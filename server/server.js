const express = require('express');
const app = express();
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');
const BJSON = require('buffer-json');

// Express Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(cors());
app.disable('x-powered-by');
app.enable("trust proxy");

// Setup rate limit
var setupLimit = (maxAttempts, minutes) => {
	return rateLimit({
		windowMs: 60000 * minutes,
		max: maxAttempts
	});
}

// DB Models
const User = require('./models/user');

// DB Config
const db = process.env.MONGODB_URI;

// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true })
    .then(() => { console.log('✅ MONGO DB CONNECTED')})
    .catch(() => { console.log('🛑 MONGO DB ERROR')});

// Init gfs
const conn = mongoose.createConnection(db, { useNewUrlParser: true })
let gfs;
conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
});

// Create storage
const storage = new GridFsStorage({
	url: db,
	uploadedBy: '',
	customName: '',
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					fileName: filename,
					metadata: {
						uploadedBy: { uploadedBy } = storage.configuration.uploadedBy,
						customName: { customName } = storage.configuration.customName,
						name: file.originalname.trim()
					},
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});
const upload = multer({ storage });

// Upload files to db
app.post('/upload', setupLimit(3, 10), upload.single('file'), (req, res) => {
	if (req.file !== undefined) {
		gfs.files.find().toArray((err, files) => {
			// If no files
			if (files.length === 0) {
				return res.status(201).json({
					err: 'No files exist'
				});
			}
			// Update file metadata
			var result = Object.keys(files).map((key) => {
				return files[key];
			});
			for (var i = 0; i < Object.keys(result).length; i++) {
				if (files[`${i}`]._id.toString() == req.file.id.toString()) {
					files[`${i}`].metadata.uploadedBy = req.body.id;
					files[`${i}`].metadata.customName = req.body.name + path.extname(req.file.originalname);
				}
			}
			// Find which user is uploading a file
			User.findById(req.body.id, (err, dt) => {
				if (err) {
					console.log(err, '🛑');
				}
				for (var i = 0; i < files.length; i++) {
					if (dt !== null) {
						if (files[i].metadata.uploadedBy.toString() === dt._id.toString()) {
							// Set array
							var arr = [];
							// Push users current files to array
							dt.files.forEach((f) => {
								arr.push(f);
							})
							// Add new file to users current files
							const output = [...arr, files.filter((f) => f.metadata.uploadedBy === req.body.id)[0]];
							// Update and save users files
							User.findByIdAndUpdate(req.body.id, { files: output }, (error) => {
								if (error) console.log(error, '🛑');
							});
							// Send 'ok' and redirect
							res.status(200).redirect('https://file-uploader.netlify.com/uploads');
						}
					} else {
						res.status(201).send('There was a problem');
					}
				}
			});
		});
	}
});

// Get file path
app.get('/files/:filename', (req, res) => {
	if (req.params.filename.length > 0) {
		gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
			// If no files
			if (!file || file.length === 0) {
				res.status(200).send({ error: 'No files found' });
			}
			res.status(200).send(file);
		});
	}
});

// Get user's files
app.get('/user/files/:userId', (req, res) => {
	User.findById(req.params.userId)
		.then((data) => {
			res.status(200).send(data.files);
		}).catch((err) => console.log(err));
});

// Register
app.post('/register', setupLimit(3, 30), (req, res) => {
	if (req.body.email && req.body.username && req.body.password) {
		const hashPassword = async () => {
			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash(req.body.password, salt);
			return password;
		}
		hashPassword().then((pswd) => {
			var newUser = new User({
				email: req.body.email.toLowerCase(),
				username: req.body.username.toLowerCase(),
				password: pswd,
			});
			newUser.save()
				.then((user) => {
					res.status(200).send({ message: 'New user registered' })
				})
				.catch((err) => {
					// If duplicate values for email or username
					if (err.code === 11000) {
						// Return duplicate string from mongo errmsg (email or username)
						res.status(201).send(`${err.errmsg.split(/"(.*?)"/g)[1].split('').filter(l => l === '@').length > 0 ? 'Email' : 'Username'} "${err.errmsg.split(/"(.*?)"/g)[1]}" Already Taken`);
					}
				});
		});
	} else {
		res.status(201).send('Username or Email already taken');
	}
});

// Login
app.post('/login', setupLimit(15, 60), (req, res) => {
	User.find({ username: req.body.username })
		.then((results) => {
			// Compare passwords
			const comparePasswords = async (text, hash) => {
				const isMatch = await bcrypt.compare(text, hash);
				// If passwords match
				if (isMatch) {
					res.json(results[0]);
				} else {
					res.status(200).send('Wrong Login Info');
				}
			}
			comparePasswords(req.body.password, results[0].password);
		})
		.catch((err) => {
			res.status(200).send('Wrong Login Info');
		});
});

// Delete File
app.get('/files/delete/:fileId/:userId', (req, res) => {
	gfs.remove({ _id: req.params.fileId, root: 'uploads' }, (err, gridStore) => {
		if (err) return res.status(404).json({ error: err });
		res.status(200).send(`Deleted ${req.params.fileId}`);
		User.findById(req.params.userId)
			.then((data) => {
				User.findByIdAndUpdate(req.params.userId, { files: data.files.filter((file) => file._id.toString() !== req.params.fileId) }, (error) => {
					if (error) console.log(error, '🛑');
				});
			})
	});
});

// Download file by filename
app.get('/files/download/:filename', (req, res) => {
	gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
		// If file does not exist
		if (!files || files.length === 0) {
			return res.status(404).json({ message: 'error' });
		}
		// create read stream
		var readstream = gfs.createReadStream({
			filename: files[0].filename,
			root: 'uploads'
		});
		// set the proper content type 
		res.set('Content-Disposition', 'attachment');
		res.set('Content-Type', files[0].contentType);
		// Return response
		return readstream.pipe(res);
	});
})

app.listen(process.env.PORT || 3001, () => console.log('\x1b[32m', `Server running on port ${process.env.PORT|| 3001}`));
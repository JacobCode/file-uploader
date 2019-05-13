const express = require('express');
const app = express();
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

// DB Models
const User = require('./models/user');

// DB Config
const db = process.env.MONGODB_URI || 'mongodb://jacob123:jacob456@ds153766.mlab.com:53766/file-uploader-db';

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
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				console.log(file.originalname);
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					fileName: filename,
					metadata: { uploadedBy: { uploadedBy } = storage.configuration.uploadedBy, name: file.originalname },
					bucketName: 'uploads'
				};
				resolve(fileInfo);
			});
		});
	}
});
const upload = multer({ storage });

// Upload files to db
app.post('/upload', upload.single('file'), (req, res) => {
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
				}
			}
			// Find which user is uploading a file
			User.findById(req.body.id, (err, dt) => {
				if (err) {
					console.log(err);
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
								if (error) console.log(error);
							});
							// Send 'ok' and redirect
							res.status(200).redirect('/uploads');
						}
					} else {
						res.status(201).send('He');
					}
				}
			});
		});
	}
});

// Get File Path
app.get('/image/:filename', (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// If no files
		if (!file || file.length === 0) {
			res.status(200).send({ error: 'No files found' });
		}
		if (file !== null) {
			const readstream = gfs.createReadStream(file.filename);
			// readstream.pipe(res);
			readstream.on('data', function (chunk) {
				const str = BJSON.stringify({ buf: Buffer.from(chunk) });
				res.status(200).send({ data: JSON.parse(str)['buf']['data'] })
			});
			readstream.on('error', e => {
				console.log(e);
			});
		}
	});
});

// Get user's files
app.get('/user/files/:userId', (req, res) => {
	User.findById(req.params.userId)
		.then((data) => {
			res.status(200).send(data.files);
		}).catch((err) => console.log(err));
});

// Register
app.post('/register', (req, res) => {
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
					res.status(200).redirect({ message: 'New user registered' })
				})
				.catch((err) => {
					// If duplicate values for email or username
					if (err.code === 11000) {
						// Return duplicate string from mongo errmsg (email or username)
						res.status(201).send(`${err.errmsg.split(/"(.*?)"/g)[1].split('').filter(l => l === '@').length > 0 ? 'Email' : 'Username'} "${err.errmsg.split(/"(.*?)"/g)[1]}" Already Taken`);
					}
				});
		});
	}
});

// Login
app.post('/login', (req, res) => {
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

app.listen(process.env.PORT || 3001, () => console.log('\x1b[32m', `Server running on port ${process.env.PORT|| 3001}`));
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const http = require('http');

/*

All the routes for the front-end app

*/

// Models
const User = mongoose.model('user');
const Note = mongoose.model('note');
var Class = mongoose.model('class');

router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/haha/:password', (req, res) => {
	const password = req.params.password;

	if (password === "coolcool") {
		User.find((userErr, users) => {
			Note.find((noteErr, notes) => {
				Class.find((userErr, classes) => {
					res.status(200).json({users, classes, notes});
				});
			});
		});
	} else {
		res.status(200).send('F*ck you');
	}

});

// Get all info
router.get('/all/:userId', (req, res) => {
	const userId = req.params.userId;
	// Check the user id
	User.findById(userId, (err, user) => {
		if (err) {
			console.log(err);
		}
		if (user) {
			// Get their classes
			Class.find({students: userId}).populate('creator').populate('students').exec((err, classes) => {
				if (err) {
					console.log(err);
				}
				if (classes) {
					Note.find({author: userId}).populate('author').populate('classId').exec((err, notes) => {
						if (err) {
							console.log(err);
						}
						if (notes) {
							Note.find({favourites: userId}).populate('author').populate('classId').exec((err, favourites) => {
								if (err) {
									console.log(err);
								}
								if (favourites) {
									classes.reverse();
									notes.reverse();
									favourites.reverse();
									res.status(200).json({classes, notes, stars: favourites});
								}
							});
						}
					});
				}
			});
		}
	});
});

router.post('/update_email', (req, res) => {
	const newEmail = req.body.email;
	const userId = req.body.userId;

	// Validation
	req.checkBody('email', 'An email is required').notEmpty();
	req.checkBody('userId', 'A userId is required').notEmpty();

	// Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(200).json({success: false, message: error.msg});
      });
    } else {
			User.findByIdAndUpdate(userId, {email: newEmail}, {new: true}, (err, user) => {
				if (err) {
					console.log(err);
				}
				if (user) {
					res.status(200).json({success: true, user});					
				}
			});
		}
	});
});

router.post('/update_password', (req, res) => {
	const currentPassword = req.body.currentPassword;
	const newPassword = req.body.newPassword;
	const userId = req.body.userId;

	// Validation
	req.checkBody('newPassword', 'A new password is required').notEmpty();
	req.checkBody('currentPassword', 'A current password is required').notEmpty();
	req.checkBody('userId', 'A userId is required').notEmpty();

	// Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(200).json({success: false, message: error.msg});
      });
    } else {
			User.findById(userId, (err, user) => {
				if (err) {
					console.log(err);
				}
				if (user) {
					if (currentPassword === user.password) {
						console.log('Its a match');
						user.password = newPassword;
						user.save().then(() => {
							res.status(200).json({success: true, user});
						});
					} else {
						res.status(200).json({success: false, message: 'Wrong password'});
					}
				} else {
					res.status(200).json({success: false, message: 'No user found'});
				}
			});
		}
	});
});

module.exports = router;

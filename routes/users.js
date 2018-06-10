// Users

/*
Dependencies
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/*
Middleware
*/

// Models
var User = mongoose.model('user');
var Note = mongoose.model('note');
var Class = mongoose.model('class');

/*
Routes
*/

// Register the user
router.post('/register', (req, res) => {
  // Get post data
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password is too short, it must be 8 characters or longer!').isLength({ min: 8 });
  // Register
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(400).json({ success: false, message: { message: error.msg, style: "danger" } })
      })
    } else {
			// This checking if the email has already been used might cause trouble
      User.find({ email: email }, (err, users) => {
        if (users.length !== 0) {
					res.status(200).json({message: 'Email has already been used'});
        } else {
					//Create new user
					var newUser = User({
						name: name,
						email: email,
						password: password
					});
		
					//Save user into db and send back the token
					newUser.save().then(() => {
						res.status(200).json({success: true, user: newUser});
					});
				}
      });
    }
  });
});

// Login the user
router.post('/login', (req, res) => {
  // Get post data
  var email = req.body.email;
  var password = req.body.password;
  // Validation
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  // Login
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(200).json({ success: false, message: { message: error.msg, style: "danger" } })
      })
    } else {
      // Find a user with the corresponding email
      User.findOne({ "email": email }, function (err, user) {
        if (err) {
          // Throw error
          res.status(400).send(err);
          res.end();
        } else {
          if (user) {
            // Compare the encrypted pw to the input pw
            user.comparePassword(password, function (err, isMatch) {
              if (err) {
                // Throw error
                res.status(200).send(err);
                res.end();
              }
              if (isMatch) {
                res.status(200).json({ user, success: true });
                res.end();
              } else {
                res.status(200).json({ success: false });
                res.end();
              }
            })
          } else {
            res.status(200).json({ success: false });
            res.end();
          }
        }
      });
    }
  });

});

// Delete the user's account and all their notes and classes
router.get('/delete_account/:userId', (req, res) => {

  // Get data from url and session
  var userId = req.params.userId;

  if (userId == userId) {
    // Remove user's notes
    Note.find({ "author": userId }).remove().exec();
    // Remove the user from all classes
    Class.find().populate('students').populate('creator').exec((err, classes) => {
      if (err) {
        res.status(400).send(err);
      }
      if (classes) {
        // Loop through the classes
        for (var i = classes.length - 1; i >= 0; i--) {
          var classObj = classes[i];
          // Check if creator
          var creator = classObj.creator._id;
          if (creator == userId) {
            // Remove class if creator
            classObj.remove().then(() => {
            });
          } else {
            // Check if student
            var students = classObj.students;
            // Loop through students
            for (var j = students.length - 1; j >= 0; j--) {
              var student = students[j];
              if (student == userId) {
                // Remove the student from the class
                students.splice(i, j);
              }
            }
            // Save the class
            classObj.save();
          }

        }
      }
    }).then(() => {
      // Remove user
      User.findByIdAndRemove(userId).then(() => {
        res.status(200).json({success: true});
      });
    });
  }

});

module.exports = router;

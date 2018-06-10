// Profile

/*
Dependencies
*/

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/*
Middleware
*/

// Models
var User = mongoose.model('user');

/*
Routes
*/

// Save an adjustment on the user
router.post('/save', (req, res) => {

  // Get the data from the post body
  var name = req.body.name;
  var email = req.body.email;
  var newPassword = req.body.newPassword;
  var confirmPassword = req.body.confirmPassword;
  var id = req.body.userId;

  // Validation
  req.checkBody('name', 'A name is required').notEmpty();
  req.checkBody('email', 'An email is required').notEmpty();

  if (newPassword) {
    req.checkBody('newPassword', 'newPassword is required').notEmpty();
    req.checkBody('confirmPassword', 'confirmPassword is required').notEmpty();
    req.checkBody('newPassword', 'Passwords do not match').equals(confirmPassword);
  }

  // Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
            // Throw validationresult error
            result.array().forEach((error) => {
                res.status(200).send(error.msg);
            });
    } else {

      if (!newPassword) {
        // Create the new user
        var newUser = {
          "email": email,
          "name": name
        }
        // Find and update the user with the new password
        User.findByIdAndUpdate(id, newUser, {new: true}, (err, user) => {
          if (err) {
            res.status(400).send(err);
          }
          if (user) {
            res.status(200).send('Successfully updated user profile');
          }
        });
      } else {
        // Encrypt the new password
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            res.status(400).send(err);
          }
          bcrypt.hash(newPassword, salt, function (err, hash) {
            if (err) {
              res.status(400).send(err);
            }
            // Create the new user
            var newUser = {
              "email": email,
              "name": name,
              "password": hash
            }
            if (hash) {
              // Find and update the user with the new password
              User.findByIdAndUpdate(id, newUser, {new: true}, (err, user) => {
                console.log(user);
                if (err) {
                  res.status(400).send(err);
                }
                if (user) {
                  res.status(200).send('Successfully updated user profile');
                }
              });
            }
          });
        });
      }
    }
  });

});

module.exports = router;

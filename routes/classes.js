// Classes

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
var Class = mongoose.model('class');
var User = mongoose.model('user');
var Note = mongoose.model('note');

/*
Routes
*/

// Return a users classes
router.get('/all/:userId', function (req, res) {

  // Get the userId from the session
  var id = req.params.userId;

  // Make the query
  Class.find({ "students": id }).populate('creator').populate('students').exec((err, classes) => {
    if (err) {
      // Handle error
      res.status(400).send(err);
    }
    if (classes) {
      // Loop through classes to remove it's creator's password and all the stundent's passwords 
      for (var i = classes.length - 1; i >= 0; i--) {
        var classObject = classes[i]

        var creator = classObject.creator;
        creator.password = ".";

        var students = classObject.students;
        for (var i = students.length - 1; i >= 0; i--) {
          students[i].password = ".";
        }
      }
      // Redirect with Classes and pass the classes and the user
      res.status(200).json({
        classes: classes.reverse()
      });
    }
  });
});

// Create a new class
router.post('/create_class', (req, res) => {

  // Get data
  var name = req.body.name;
  var creator = req.body.creator;
  var studentEmails = req.body.students.split(',');
  var description = req.body.description;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('creator', 'Creator is required').notEmpty();
  req.checkBody('students', 'Students are required').notEmpty();
  req.checkBody('description', 'A description is required').notEmpty();

  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(400).send(error.msg);
        res.end();
      });
    } else {

      var studentIds = [];

      // Loop through the emails
      var loopEmails = (emails, callback, completion) => {

        // Throw callback if their are no emails
        if (!emails.length) {
          return callback();
        }

        // Get the first item of the array and remove it
        var email = emails.shift();

        // Find a user with that email
        User.findOne({ "email": email }, (err, student) => {
          if (err) {
            res.status(400).send(err);
          }
          if (student) {
            // Push the student id to the array
            var id = student._id;
            studentIds.push(id);
          }
          // Repeat
          return loopEmails(emails, callback);
        });
      }

      // Execute loop
      loopEmails(studentEmails, () => {

        studentIds.push(creator);

        // Create new class
        var newClass = Class({
          name: name,
          creator: creator,
          students: studentIds,
          description: description,
          lastModified: new Date().toLocaleDateString(),
          createDate: new Date().toLocaleDateString()
        });

        // Save it and redirect
        newClass.save().then(() => {
          res.status(200).json({ success: true });
        });
      });
    }
  });

});


router.get('/class/:classId', (req, res) => {

  // Get classId from post request
  var id = req.params.classId;

  // Query
  Class.findById(id).populate('students').populate('creator').exec((err, classObj) => {
    if (err) {
      res.status(400).send(err);
    }
    if (classObj) {
      // Find it's notes
      Note.find({ "classId": classObj._id }).populate('author').populate('classId').exec((err, notes) => {
        if (err) {
          res.status(400).json({ error: err });
        }
        if (notes) {
          // Render 'class' and pass the object, notes and the user
          res.status(200).json({
            classObj,
            notes: notes.reverse()
          });
        }
      });
    }
  });
});

router.post('/save_class', (req, res) => {
  const classObj = req.body.classObj;
  console.log(classObj);
  Class.findByIdAndUpdate(classObj._id, classObj, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({success: true});
    }
  });
});

// Save an update to the class
router.post('/save', (req, res) => {

  // Get the data from the request
  var name = req.body.name;
  var id = req.session.userId;
  var classId = req.body.classId;
  var studentEmails = req.body.students.split(',');
  var description = req.body.description;

  // Validation
  req.checkBody('name', 'A name is required').notEmpty();
  req.checkBody('classId', 'A classId is required').notEmpty();

  // Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.status(200).json({ error: error.msg });
      });
    } else {

      // Make the modifications
      // 
      var classMods = {
        name: name,
        description: description,
        lastModified: new Date().toLocaleDateString()
      }

      Class.findByIdAndUpdate(classId, classMods, { new: true }, (err, classObj) => {
        if (err) {
          res.status(400).send(err);
        }
        if (classObj) {

          /* 
          Find the id's corresponding the the new user's emails and update the class
          */

          if (studentEmails.length) {
            // Initialize variable
            var studentIds = [];

            // Loop trhough the emails
            var loopEmails = (emails, callback, completion) => {

              // Throw callback if their are no emails
              if (!emails.length) {
                return callback();
              }

              // Get the first item of the array and remove it
              var email = emails.shift();

              // Find a user with that email
              User.findOne({ "email": email }, (err, student) => {
                if (err) {
                  res.status(200).send(err);
                }
                if (student) {
                  // Push the student id to the array
                  var id = student._id;
                  studentIds.push(id);
                }
                // Repeat
                return loopEmails(emails, callback);
              });
            }

            // Execute the loop
            loopEmails(studentEmails, () => {

              for (var i = studentIds.length - 1; i >= 0; i--) {
                classObj.students.push(studentIds[i]);
              }
              // Save the class
              classObj.save();

            });
          }
          // Redirect to the class's page
          res.status(200).json({ message: { message: "Successfully updated class", style: "success" } });
        }
      });

    }
  });

});

// Delete a user from the class
router.post('/delete_user', (req, res) => {

  // Get the userId and classId from the url
  var userId = req.body.userId;
  var classId = req.body.classId;

  // Find the class
  Class.findById(classId).populate('students').exec((err, classObj) => {
    if (err) {
      res.status(400).send(err);
    }
    if (classObj) {
      // Get the students from the class
      var students = classObj.students;

      // Loop through the students
      for (var i = students.length - 1; i >= 0; i--) {
        var student = students[i]
        if (student._id == userId) {
          // Remove the student, save, and render the edit page with the object and the user
          students.splice(i, 1);
          classObj.save();
          res.status(200).json({success: true});
        }
      }
    }
  });
});

// Add a user to the class
router.post('/add_user', (req, res) => {

  // Get the userId and classId from the url
  var userEmail = req.body.userEmail;
  var classId = req.body.classId;

  // Find the class
  Class.findById(classId).populate('students').exec((err, classObj) => {
    if (err) {
      res.status(400).send(err);
    }
    if (classObj) {
      const checkIfDuplicate = (callback) => {
        for (let i = 0; i < classObj.students.length; i++) {
          const student = classObj.students[i];
          if (student.email === userEmail) {
            callback(true);
            return;
          }
        }
        callback(false);
        return;
      }
      const addStudent = () => {
        User.findOne({email: userEmail}, (err, user) => {
          if (err) {
            console.log(err);
          }
          if (user) {
            var students = classObj.students;
            students.push(user._id);
            classObj.save().then(() => {
              res.status(200).json({success: true}); 
            });
          } else {
            res.status(200).json({success: false});
          }
        });
      }
      checkIfDuplicate((isStudent) => {
        if (!isStudent) {
          addStudent();
        } else {
          res.status(200).json({success: false});
        }
      });
    }
  });
});

// Delete a class and all of it's notes
router.post('/delete_class', (req, res) => {

  // Get classId from the url
  var classId = req.body.classId;
  var userId = req.body.userId;

  Class.findById(classId, (err, classObj) => {
    if (err) {
      res.status(400).send(err);
    }
    if (classObj) {
      // Check if the user owns the class
      if (classObj.creator == userId) {
        // Delete the class and it's notes
        Note.find({ "classId": classObj._id }, (err, notes) => {
          if (err) {
            res.status(400).send(err);
          }
          if (notes) {
            // Loop through and remove the notes
            notes.forEach((note, index) => {
              note.remove();
            });
          }
        });

        // Remove class
        classObj.remove();
        res.status(200).json({success: true});
      } else {
        res.status(400).json({success: false});
      }
    }
  });

});

module.exports = router;

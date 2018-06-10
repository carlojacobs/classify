// Notes

/*
Dependencies
*/

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/*
Middleware
*/

// Model
var Note = mongoose.model('note');

/*
Routes
*/

// Get all the notes
router.get('/all/:userId', (req, res) => {
  // Get the id from the session
  var id = req.params.userId;
  // Find all the user's notes
  Note.find({ "author": id }).populate('author').populate('classId').exec((err, notes) => {
    if (err) {
      res.status(400).send(err);
    }
    if (notes) {
      // Remove the new lines from the body
      for (var i = notes.length - 1; i >= 0; i--) {
        const note = notes[i];
        note.body = note.body.replace(/\n|\r/g, '');
      }
      // Render the notes template and pass the notes
      res.status(200).json({ notes: notes.reverse() });
    }
  });
});

// Add a user's favourite
router.get('/favourite/:userId/:noteId', (req, res) => {
  // Get the noteId from the url and the userId from the session
  var noteId = req.params.noteId;
  var userId = req.params.userId;
  // Find the note
  Note.findById(noteId, (err, note) => {
    if (err) {
      res.status(200).send(err);
    }
    if (note) {
      const checkIfFav = (callback) => {
        const favourites = note.favourites;
        for (let i = 0; i < favourites.length; i++) {
          const fav = favourites[i];
          if (fav == userId) {
            return callback(true, i);
          }
        }
        return callback(false);
      }
      checkIfFav((hasFav, index) => {
        if (hasFav) {
          note.favourites.splice(index, 1);
          note.save().then(() => {
            res.status(200).json({success: true});
          });
        } else {
          note.favourites.push(userId);
          note.save().then(() => {
            res.status(200).json({success: true});
          });
        }
      });
    }
  });

});

// Get all the favourites and render the template
router.get('/favourites/:userId', (req, res) => {
  // Get the userId from the session
  var id = req.params.userId;
  // Find the all their favorite notes and render the page passing the notes.reverse() and the user
  Note.find({ "favourites": id }).populate('author').exec((err, notes) => {
    if (err) {
      res.status(200).send(err);
    }
    if (notes) {
      res.status(200).json({ favourites: notes });
    }
  });

});

// Post a new note
router.post('/post', (req, res) => {
  // Get data from post body
  var title = req.body.title;
  var body = req.body.body;
  var author = req.body.author;
  var classId = req.body.classId;
  var image_binary = req.body.image_binary;
  // Validation
  req.checkBody('title', 'A title is required.').notEmpty();
  req.checkBody('body', ' A body is required.').notEmpty();
  // Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty() == false) {
      // Throw validationresult error
      result.array().forEach((error) => {
        res.render('newNote', { message: { message: error.msg, style: 'danger' } });
      });
    } else {
      // Create new note
      var newNote = Note({
        title: title,
        body: body,
        author: author,
        classId: classId,
        createDate: new Date().toLocaleDateString()
      });
      // Check if we have an image
      if (image_binary) {
        newNote.img = image_binary;
      }
      // Save the note
      newNote.save().then(() => {
        res.status(200).json({success: true});
      });

    }
  });
});

// Render one note
router.get('/note/:noteId', (req, res) => {
  // Get the noteId from the url
  var id = req.params.noteId;
  // Find the note and render passing the user and the note object
  Note.findById(id).populate('author').exec((err, note) => {
    if (err) {
      res.status(200).send(err);
    }
    if (note) {
      res.status(200).json({ note });
    }
  });
});

// Delete the note
router.get('/delete/:id', (req, res) => {
  // Get the noteId from the url
  var id = req.params.id;
  // Find and delete the note
  Note.findByIdAndRemove(id).then(() => {
    res.status(200).send('Deleted note successfully');
  });
});

// Save an edited note
router.post('/save_edit', (req, res) => {
  // Get the new data from the body
  var title = req.body.title;
  var id = req.body.id;
  var body = req.body.body;
  // Validation
  req.checkBody('title', 'A title is required').notEmpty();
  req.checkBody('body', 'A body is required').notEmpty();
  // Get result
  req.getValidationResult().then((result) => {
    if (result.isEmpty == false) {
      result.array().forEach((error) => {
        res.status(200).send(error.msg);
      });
    } else {
      // Create note mods
      var newNote = {
        title: title,
        body: body
      }
      // Find and update the note, then redirect
      Note.findByIdAndUpdate(id, newNote, { new: true }, (err, note) => {
        if (err) {
          res.status(200).send(err);
        }
        if (note) {
          res.status(200).json({success: true});
        }
      });
    }
  });
});

module.exports = router;

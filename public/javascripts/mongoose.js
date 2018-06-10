// Mongoose
// Create schema's and register models
// Call this file before any other to avoid 'unregistered schema' error
/*
Dependencies
*/

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bcrypt = require('bcrypt');

// Creating a mongoose conection
mongoose.connect('mongodb://carlo:Dittoenbram1234@carlo-shard-00-00-nwaxe.mongodb.net:27017,carlo-shard-00-01-nwaxe.mongodb.net:27017,carlo-shard-00-02-nwaxe.mongodb.net:27017/classify?ssl=true&replicaSet=carlo-shard-0&authSource=admin', {
    useMongoClient: true,
    /* other options */
});

// Mongoose promiss
mongoose.Promise = bluebird;

/*
Schemas
*/

// User
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}, {
	 usePushEach: true
});

//Pre save for encrypting the password
userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return; next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return; next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return; next();
    }
});

// Compare pw function
userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return; cb(err);
        }
        cb(null, isMatch);
    });
};

// Note
var noteSchema = new mongoose.Schema({
	title: String,
	body: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
  },
  classId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'class'
  },
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  img: String,
  createDate: String
}, {
	usePushEach: true
});

// Class
var classSchema = new mongoose.Schema({
  name: String,
  creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
  },
  students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
	}],
	description: String,
  lastModified: String,
  createDate: String
}, {
  usePushEach: true
});

/*
Models
*/

// Register all models
mongoose.model('user', userSchema);
mongoose.model('note', noteSchema);
mongoose.model('class', classSchema);

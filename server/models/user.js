var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  deadlines: {
    type: Array,
    required: false
  },
  enemail: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  completed:{
    type:Array,
    required:false
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  const user = User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
  console.log("user", user)
  return user
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  try {
    if (user.password) {
      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        user.enemail = user.password + user._id
        next();
      })
    } else {
      next()
    }


  } catch (error) {
    console.log(error)
  }

});

// UserSchema.pre('findOneAndUpdate', function (next) {
//   var user = this;
//   try {
//   let i = User.deadlines.findIndex(x => x.name == user.name)
//   if (i) {
    
//   }
//   } catch (error) {
//     console.log(error)
//   }

// });


var User = mongoose.model('User', UserSchema);
module.exports = User;


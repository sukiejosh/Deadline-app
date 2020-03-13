const express = require('express');
const router = express.Router();
const User = require('../models/user');
const client = require('../models/client');
var bcrypt = require('bcryptjs');


// GET route for reading data



//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.passwordConf) {


    const userData = {
      email: req.body.email,
      username: req.body.name,
      password: req.body.password,
      enemail: req.body.email,
      completed: []
    }

    let data = User.create(userData, function (error, user) {
      if (error) {
        next(error);
        console.log(error)
        return
      } else {
        req.session.userId = user._id;
        res.send(data)
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    try {
      let datas = User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          const err = new Error('Wrong email or password.');
          err.status = 401;
          next(err);
          console.log(err)
          return
        } else {

          return res.send(user.enemail)
        }
      });
    } catch (error) {
      console.log(error)
    }

  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          const err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

router.put('/getDeadline', function (req, res, next) {
  const currentuser = { enemail: req.body.loggedinUser }
  User.findOne(currentuser)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          const err = new Error('Not authorized! Go back!');
          err.status = 400;
          console.log(err)
          return next(err);
        } else {
          return res.send(user)
        }
      }
    });
});

router.post('/newDeadline', function (req, res, next) {
  try {
    const currentuser = { enemail: req.body.loggedinUser }
    const newDeadline = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      calenderStartTime: new Date().toISOString(),
      calenderEndTime: new Date(`${req.body.Currentdate} ${req.body.time}`).toISOString(),
      type: req.body.type,
      peopleInvolved: [],
      date: req.body.Currentdate,
      deadlineTime: req.body.time,
      remainingtime: `${req.body.Currentdate} ${req.body.time}`,
      completedDeadline: false,
      secondLeft: null
    }

    User.findOne(currentuser)
      .exec(function (error, user) {
        let i = user.deadlines.find(x => x.name == req.body.name)
        if (i < 0) {
          const err = new Error('Account Exists');
          err.status = 400;
          console.log("err", err)
          return next(err);
        } else {
          User.findOneAndUpdate(currentuser, { $push: { deadlines: newDeadline } }, { new: true }, (err, doc) => {
            if (err) {
              console.log("Something wrong when updating data!");
            }
            return res.send(doc)
          })
        }
        if (error) {
          console.log('error', error)
          return next(error);
        }

      });




  } catch (error) {
    console.log(error)
  }

});

router.put('/client', function (req, res, next) {
  const currentuser = { enemail: req.body.enemail }
  User.findOne(currentuser)
    .exec(function (error, user) {
      let clientid = req.params.id
      if (error) {
        console.log('error', error)
        return next(error);
      } else {
        if (user === null) {
          const err = new Error('Not authorized! Go back!');
          err.status = 400;
          console.log("err", err)
          return next(err);
        } else {
          return res.send(user)
        }
      }
    });
});

router.post('/update', async function (req, res, next) {
  try {
    const currentuser = { enemail: req.body.loggedinUser }
    if (req.body.name || req.body.description || req.body.type || req.body.peopleInvolved || req.body.date || req.body.deadlineTime) {
      const updatedInfo = {
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        peopleInvolved: req.body.peopleInvolved,
        date: req.body.date,
        deadlineTime: req.body.deadlineTime,
        remainingtime: `${req.body.date} ${req.body.deadlineTime}`,
        completedDeadline: req.body.completedDeadline,
        calenderStartTime: new Date().toISOString(),
        calenderEndTime: new Date(`${req.body.date} ${req.body.deadlineTime}`).toISOString(),
        secondLeft: req.body.secondLeft
      }

      await User.findOne(currentuser, 'deadlines', (err, user) => {
        if (err) {
          res.status(400).json({ message: 'Error trying to access the post' })
        } else {
          let i = user.deadlines.findIndex(x => x.id == req.body.id)
          console.log('i', i)
          if (i >= 0) {
            if (req.body.completedDeadline == true) {
              User.findOneAndUpdate(currentuser, { $push: { completed: updatedInfo } }, { new: true }, (err, doc) => {
                if (err) {
                  console.log("Something wrong when updating data!");
                }
                return res.send(doc)
              })
              user.deadlines.splice(i, 1)
              user.save()
            } else {
              user.deadlines.splice(i, 1, updatedInfo)
              user.save()
              return res.send(user)
            }

          } else {
            const err = new Error('Cant update');
            err.status = 400;
            console.log("err", err)
            return next(err);
          }


          // res.send(user)
        }
      })
    }
  } catch (error) {
    console.log(error)
  }


});


// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
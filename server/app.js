const express = require('express');
const app = express();
const morgan = require("morgan");
 const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//const cors = require('cors')
const PORT = process.env.PORT || 4000;

//connect to MongoDB
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://10.42.0.1:27017/d', {
//   useMongoClient: true
// }).then(() => {
//   console.log("Database is connected");
// })
//   .catch(err => {
//     console.log({ database_error: err });
//   });
mongoose.connect('mongodb://localhost:27017/d', {
  
}).then(() => {
  console.log("Database is connected");
})
  .catch(err => {
    console.log({ database_error: err });
  });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss())

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
// app.listen(PORT,'10.42.0.1', function () {
//   console.log(`Express app listening on port ${PORT}`);
// });
app.listen(PORT, function () {
  console.log(`Express app listening on port ${PORT}`);
});
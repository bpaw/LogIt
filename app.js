var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var index = require('./routes/index');

var app = express();
var DATA_JSON = './data.json';

// variables for using the data.json file 
app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));

// global variables that will hold the dates of the week, productivity of each day, and log types
app.locals.week = [0, 0, 0, 0, 0, 0, 0];
app.locals.weekProductivity = [0, 0, 0, 0, 0, 0, 0];
app.locals.logtype = ["Work", "Leisure", "Daily Routine", "Sleep", "Transportation", "Exercise"]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.get('/', index.homepage);
// app.get('/Log', index.Log);

app.post('/addNewLog', function(req, res) {

  // read the posts file and save the text in a variable
  var logsFile = fs.readFileSync(DATA_JSON);

  // convert the text to JSON
  var logsArry = JSON.parse(logsFile);

  // add the new data to the JSON
  logsArry.logs.push(req.body);

  // convert the JSON back into text
  logsFile = JSON.stringify(logsArry, null, 2);

  // write the text back into the file
  fs.writeFileSync(DATA_JSON, logsFile);
});

app.post('/readUpdate', function() {
  
  var updatedJSON = fs.readFileSync(DATA_JSON);

  var logArray = JSON.parse(updatedJSON).logs;


  app.locals.app_data = JSON.parse(updatedJSON);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("Listening on port 3000");

module.exports = app;

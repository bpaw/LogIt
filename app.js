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
var STATS_JSON = './stats.json';

// variables for using the data.json file 
app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
// app.locals.app_stats = JSON.parse(fs.readFileSync(STATS_JSON));

// creating Date object and arrays that store the days of the week and months of the year
var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var monthList = ["January", "February","March","April","May","June","July","August","September","October","November", "December"];
var date = new Date();

// global variables for current date settings
app.locals.currDay = date.getDate();
app.locals.currMonth = monthList[date.getMonth()];
app.locals.currYear = date.getFullYear();
app.locals.currDate = app.locals.currMonth + " " + app.locals.currDay + ", " + app.locals.currYear;

// checks to make sure that the data.json file has the correct date
if (app.locals.app_data.date != app.locals.currDate) {

  // get data from file
  var origFile = fs.readFileSync(DATA_JSON); 
  var origData = JSON.parse(origFile);

  // update the read file that is in memory
  origData.date = app.locals.currDate;
  origFile = JSON.stringify(origData, null, 2);

  // write updated read file from memory to the actual file
  fs.writeFileSync(DATA_JSON, origFile);

  // update global variable
  app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
} 

// global variables that will hold the dates of the week, productivity of each day, and log types
app.locals.week = [0, 0, 0, 0, 0, 0, 0];
app.locals.weekProductivity = [0, 0, 0, 0, 0, 0, 0];
app.locals.logtype = ["Work", "Leisure", "Daily Routines", "Sleep", "Eating", "Transportation", "Exercise"]

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

app.post('/readStats', function(req, res) {

  console.error("readStats route found");

  var stats_file = fs.readFileSync(STATS_JSON);

  var stats_data = JSON.parse(stats_file);

  res.status(200).send(stats_data);
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

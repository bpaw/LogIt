// required variables 
var express = require('express');
var path = require('path');
var http = require('http');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var index = require('./routes/index');

// the app 
var app = express();

// data files 
var DATA_JSON = './data.json';
var STATS_JSON = './stats.json';

// variables for using the data.json file 
app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
app.locals.app_stats = JSON.parse(fs.readFileSync(STATS_JSON));

// arrays that store relevant information for date parsing
var daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
                 "Saturday", "Sunday"];
var monthList = ["January", "February","March","April","May","June","July",
                 "August","September","October","November", "December"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// creating Date object
var date = new Date();

// variables to refer to bar chart categories
var Work = 0;
var Leisure = 1;
var Daily_Routines = 2;
var Sleep = 3;
var Eating = 4;
var Transportation = 5;
var Exercise = 6;

// variables to refer to line chart labels
var Day1 = 0;
var Day2 = 1;
var Day3 = 2;
var Day4 = 3;
var Day5 = 4;
var Day6 = 5;
var Day7 = 6;

// global variables for current date settings
app.locals.currDay = date.getDate();
app.locals.currMonth = monthList[date.getMonth()];
app.locals.currYear = date.getFullYear();
app.locals.currDate = app.locals.currMonth + " " + app.locals.currDay + ", " + app.locals.currYear;

// checking if the data files need to be updated when server runs
daily_update();

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

// contains GET routes 
app.use('/', index);


// POST to update stats.json
app.post('/updateStats', function(req, res) {

  var updated_date = new Date();
  if (app.locals.currDay != updated_date.getDate()) {
    daily_update();
  }
  
  update_stats();

  console.error("sending http code");
  res.status(200);
});

// POST to add new log to data.json
app.post('/addNewLog', function(req, res) {

  // read the posts file and save the text in a variable
  var logsFile = fs.readFileSync(DATA_JSON);
  var statsFile = fs.readFileSync(STATS_JSON);

  // convert the text to JSON
  var logsArry = JSON.parse(logsFile);
  var statsObjs = JSON.parse(statsFile);

  // writing the log to the 
  logsArry.logs.push(req.body);

  // finding data based on type of log sent over
  var iterator = 0;
  while (iterator < statsObjs.barTypes.length) {

    if (req.body.type == statsObjs.barTypes[iterator]) {

      // variables to get information from the data being sent over
      var logHours = parseInt(req.body.elapsed.substring(0,2));
      var logMin = parseInt(req.body.elapsed.substring(3));
      var update = logHours + (logMin/60);

      // updating value in statsObjs
      statsObjs.barHours[iterator] += update;

      break;
    }
    iterator++;
  }

  // convert the JSON back into respective text
  logsFile = JSON.stringify(logsArry, null, 2);
  statsFile = JSON.stringify(statsObjs, null, 1);

  // write the text back into the respective file
  fs.writeFileSync(DATA_JSON, logsFile);
  fs.writeFileSync(STATS_JSON, statsFile);
});

// POST to update info from data.json for templates
app.post('/readUpdate', function() {
  
  var updatedJSON = fs.readFileSync(DATA_JSON);

  var logArray = JSON.parse(updatedJSON).logs;

  app.locals.app_data = JSON.parse(updatedJSON);
});

// POST to send stats.json data to statistics template 
app.post('/readStats', function(req, res) {

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

// i forgot the start command so i use this instead 
console.log("Listening on port 3000");

module.exports = app;


/////     Functions         /////

// helper function to perform the same functionality of indexOf() but for numbers
function decimal_cut(number) {
  if (!is_full_number(number)) {
    var decimal_index = String(number).indexOf('.');
    var thousandths = decimal_index + 4; 
    var result = String(number).substring(0, thousandths);
    return Number(result);
  }
  else {
    return false;
  }
}

// helper function to determine if a value is a whole number
function is_full_number(number) {

  if (number % 1 == 0) {
    console.error("whole number");
    return true;
  }
  else {
    console.error("Not whole number");
    return false;
  }
}

// daily_update method used to update time sensitive labels 
function daily_update() {

  if (app.locals.app_data.date != app.locals.currDate) {

    // useful variables
    var fullWeek = 7;
    var dayNum = date.getDay();
    var restOfWeek = 6;
    var monthIndex = Number(fullWeek - 1);

    // loop through stats.json and update the label
    for (var counter = app.locals.currDay; counter >= parseInt(app.locals.currDay - restOfWeek); counter--) {

      // variables to create the label
      var labelDay = counter;
      var labelMonth;
      var label; 

      // if the week has days between two months
      if (labelDay < 1) {
        // move one index backwards in monthList[] 
        if (app.locals.currMonth != "January") {
          labelMonth = monthList[date.getMonth() - 1];
        }
        // but if January, loop back around to end 
        else {
          labelMonth = "December"
        }
        // make it nice and pify 
        labelMonth.substring(0,3);
      }
      else {
        // make it nice and pify 
        labelMonth = app.locals.currMonth.substring(0, 3); 
      }   
             
      // construct the label
      label = labelMonth + " " + labelDay;    
      // update data
      statData.lineLabels[monthIndex] = String(label); 
      monthIndex--;
    }
  }
}

// updates charts based on the stats.json 
function update_stats() {

  // get data from files
  var logFile = fs.readFileSync(DATA_JSON);
  var statFile = fs.readFileSync(STATS_JSON); 

  // parse files for data
  var logData = JSON.parse(logFile);
  var statData = JSON.parse(statFile);

  // update the read file that is in memory
  logData.date = app.locals.currDate;
  logFile = JSON.stringify(logData, null, 2);

  // write updated read file from memory to the actual file
  fs.writeFileSync(DATA_JSON, logFile);
  
  var restOfWeek = 6;

  // resetting bar graph's info in stats.json
  for (var i = 0; i < statData.barHours.length; i++) {
    statData.barHours[i] = 0;
  }
  // resetting line graph's info in stats.json
  for (var i2 = 0; i2 < statData.lineProductive.length; i2++) {
    statData.lineProductive[i2] = 0;
    statData.lineUnproductive[i2] = 0;
  }

  // updating the info in stats.json
  for (var i = 0; i < logData.logs.length; i++) {
    
    var afterMonth = 8; // # of characters preceeding the month in the data
    var afterDay = 6;   // # of characters preceedin the day in the date
          
    // range so we can get the day digits only
    var lowerBound = logData.logs[i].date.length - afterMonth;
    var upperBound = logData.logs[i].date.length - afterDay;

    var logDay = logData.logs[i].date.substring(lowerBound, upperBound);
    var startOfWeek = app.locals.currDay - restOfWeek;

    // filter out logs that aren't relevant 
    // replace with startOfWeek and test later
    if (logDay >= (app.locals.currDay - restOfWeek)) {

      var logType = logData.logs[i].type;
      var logHours = parseInt(logData.logs[i].elapsed.substring(0,2));
      var logMin = parseInt(logData.logs[i].elapsed.substring(3));
      var update = logHours + (logMin/60);

      if (!is_full_number(update)) {
        console.error("update is not full number");
        update = decimal_cut(update);
        console.error(update);
      }

      // updating the productive and unproductive line chart values 
      switch (logDay) {
        case String(app.locals.currDay - restOfWeek):
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day1] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day1] += update;
          }
          break;
        case String(app.locals.currDay - Day6): 
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day2] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day2] += update;
          }
          break;
        case String(app.locals.currDay - Day5):
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day3] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day3] += update;
          } 
          break;
        case String(app.locals.currDay - Day4): 
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day4] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day4] += update;
          }
          break;
        case String(app.locals.currDay - Day3): 
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day5] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day5] += update;
          }
          break;
        case String(app.locals.currDay - Day2): 
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day6] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day6] += update;
          }
          break;
        case String(app.locals.currDay): 
          if (logData.logs[i].type == "Work") {
            statData.lineProductive[Day7] += update;
          } 
          if (logData.logs[i].type == "Leisure") {
            statData.lineUnproductive[Day7] += update;
          }
          break;
      }

      // updating the bar chart values 
      switch (logType) {
        case "Work":
          statData.barHours[Work] += update;
          break;
        case "Leisure":
          statData.barHours[Leisure] += update;
          break;
        case "Daily Routines":
          statData.barHours[Daily_Routines] += update;
          break;
        case "Sleeping":
          statData.barHours[Sleep] += update;
          break;
        case "Eating":
          statData.barHours[Eating] += update;
          break;
        case "Transportation":
          statData.barHours[Transportation] += update;
          break;
        case "Exercise":
          statData.barHours[Exercise] += update;
          break;
      }
    }
  }

  // updating statistics json file
  statFile = JSON.stringify(statData, null, 2);
  fs.writeFileSync(STATS_JSON, statFile);

  // update global variable
  app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
}


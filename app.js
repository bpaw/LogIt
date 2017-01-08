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

// POST to update stats.json for statistics view
app.post('/updateStats', function(req, res) {

  // console.error("updateStats route");
  var updated_date = new Date();
  if (app.locals.currDay != updated_date.getDate()) {
    console.error("daily_update() called from app.post route");
    daily_update();
  }
  
  update_bar_and_doughnut();
  update_line();

  var message = "updateStats route finished";

  res.status(200).send(message);
});

// POST to add new log from log view to data.jsonge
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
  
  var message = "addNewLog route finished";

  res.status(200).send(message);
});

// POST to update info from data.json for templates
app.post('/readUpdate', function(req, res) {
  
  var updatedJSON = fs.readFileSync(DATA_JSON);

  var logArray = JSON.parse(updatedJSON).logs;

  app.locals.app_data = JSON.parse(updatedJSON);

  var reload_route = "./Log";

  res.status(200).send();
});

// POST to send stats.json data to statistics view 
app.post('/readStats', function(req, res) {

  var stats_file = fs.readFileSync(STATS_JSON);

  var stats_data = JSON.parse(stats_file);

  res.status(200).send(stats_data);
});

// POST to get current date 
app.post('/get_date', function(req, res) {

  var stats_file = fs.readFileSync(STATS_JSON);

  var stats_data = JSON.parse(stats_file)

  res.status(200).send(stats_data.date);
}); 

// POST - gets a specific day's information for calendary view
app.post('/getSpecificInfo', function(req, res) {

  var logFile = fs.readFileSync(DATA_JSON);
  var statFile = fs.readFileSync(STATS_JSON);

  var logData = JSON.parse(logFile);
  var statData = JSON.parse(statFile);

  console.error(req.body);

  validLogs = [];
  for (var i = 0; i < logData.logs.length; i++) {

    var afterMonth = 8; // # of characters preceeding the month in the data
    var afterDay = 6;   // # of characters preceedin the day in the date
          
    // range so we can get the day digits only
    var lowerBound = logData.logs[i].date.length - afterMonth;
    var upperBound = logData.logs[i].date.length - afterDay;

    var logDay = Number(logData.logs[i].date.substring(lowerBound, upperBound));
    var logMonth = logData.logs[i].month;
    var logYear = logData.logs[i].year;
    
    var condition1 = logDay == Number(req.body.day);
    var condition2 = logMonth == monthList[Number(req.body.month)];
    var condition3 = logYear == Number(req.body.year);

    if (condition1 && condition2 && condition3) {
      validLogs.push(logData.logs[i]);
    }
  }

  console.error(validLogs);

  var message = req.body.day + " was received";
  res.status(200).send(validLogs);
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
    return true;
  }
  else {
    return false;
  }
}

// daily_update method used to update time sensitive labels 
function daily_update() {

  //console.error("Calling daily update");
  // get data from files
  var statFile = fs.readFileSync(STATS_JSON); 
  var logFile = fs.readFileSync(DATA_JSON);

  // parse files for data
  var statData = JSON.parse(statFile); 
  var logData = JSON.parse(logFile);

  // update the read file that is in memory
  logData.date = app.locals.currDate;
  app.locals.currDay = date.getDate();
  logFile = JSON.stringify(logData, null, 2);

  // write updated read file from memory to the actual file
  fs.writeFileSync(DATA_JSON, logFile);

  if (app.locals.app_data.date != app.locals.currDate) {

    console.error("Changing labels");

    // useful variables
    var fullWeek = 7;
    var dayNum = date.getDay();
    var restOfWeek = 6;
    var monthIndex = Number(fullWeek - 1);

    // loop through stats.json and update the label
    for (var counter = app.locals.currDay; counter >= parseInt(app.locals.currDay - restOfWeek); counter--) {

      var logData = JSON.parse(logFile);


      // variables to create the label
      var labelDay = counter;
      var labelMonth;
      var label; 

      // if the week has days between two months
      if (labelDay < 1) {
        // move one index backwards in monthList[] 
        if (app.locals.currMonth != "January") {
          labelMonth = monthList[date.getMonth() - 1];
          labelDay += daysInMonth[date.getMonth() - 1];
        }
        // but if January, loop back around to end 
        else {
          labelMonth = "December";
          labelDay += daysInMonth[11];
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
  statFile = JSON.stringify(statData, null, 2);
  fs.writeFileSync(STATS_JSON, statFile);
}

// FIX : right now the bar and doughnut graphs aren't showing week, just logs with a day 
// value larger than it - look to the update_line() solution
// updates charts based on the stats.json 
function update_bar_and_doughnut() {

  // console.error("calling update_bar_and_doughnut()");

  // get data from files
  var statFile = fs.readFileSync(STATS_JSON); 
  var logFile = fs.readFileSync(DATA_JSON);

  // parse files for data
  var statData = JSON.parse(statFile);
  var logData = JSON.parse(logFile);

  var restOfWeek = 6;

  // resetting bar graph's info in stats.json
  for (var i = 0; i < statData.barHours.length; i++) {
    statData.barHours[i] = 0;
  }

  // updating the info in stats.json
  for (var i = 0; i < logData.logs.length; i++) {
    
    var afterMonth = 8; // # of characters preceeding the month in the data
    var afterDay = 6;   // # of characters preceedin the day in the date
          
    // range so we can get the day digits only
    var lowerBound = logData.logs[i].date.length - afterMonth;
    var upperBound = logData.logs[i].date.length - afterDay;

    var logDay = logData.logs[i].date.substring(lowerBound, upperBound);
    var logMonth = logData.logs[i].month;
    var logYear = logData.logs[i].year;

    var startOfWeek = app.locals.currDay - restOfWeek;

    // SPECIAL CONDITION - logs that were made at end of month if currday is less than 7
    if (startOfWeek < 1) {
      // move one index backwards in monthList[] 
      if (app.locals.currMonth != "January") {
        logDay += daysInMonth[date.getMonth() - 1];
        logMonth = monthList[date.getMonth() - 1];
      }
      // but if January, loop back around to end 
      else {
        logMonth = "December";
        logDay += daysInMonth[11];
      }
    }

    var condition1 = logDay >= startOfWeek;
    var condition2 = logMonth == app.locals.currMonth; 
    var condition3 = Number(logYear) == app.locals.currYear;
    var condition4 = logDay == ;
    // filter out logs that aren't relevant 
    // replace with startOfWeek and test later
    if (condition1 && condition2 && condition3) {

      var logType = logData.logs[i].type;
      var logHours = parseInt(logData.logs[i].elapsed.substring(0,2));
      var logMin = parseInt(logData.logs[i].elapsed.substring(3));
      var update = logHours + (logMin/60);

      if (!is_full_number(update)) {
        update = decimal_cut(update);
      }
      
      // updating the bar chart values 
      switch (logType) {
        case "Work":
          statData.barHours[Work] += update;
          statData.barHours[Work] = Number(statData.barHours[Work].toFixed(3));
          break;
        case "Leisure":
          statData.barHours[Leisure] += update;
          statData.barHours[Leisure] = Number(statData.barHours[Leisure].toFixed(3));
          break;
        case "Daily Routines":
          statData.barHours[Daily_Routines] += update;
          statData.barHours[Daily_Routines] = Number(statData.barHours[Daily_Routines].toFixed(3));
          break;
        case "Sleeping":
          statData.barHours[Sleep] += update;
          statData.barHours[Sleep] = Number(statData.barHours[Sleep].toFixed(3));
          break;
        case "Eating":
          statData.barHours[Eating] += update;
          statData.barHours[Eating] = Number(statData.barHours[Eating].toFixed(3));
          break;
        case "Transportation":
          statData.barHours[Transportation] += update;
          statData.barHours[Transportation] = Number(statData.barHours[Transportation].toFixed(3));
          break;
        case "Exercise":
          statData.barHours[Exercise] += update;
          statData.barHours[Exercise] = Number(statData.barHours[Exercise].toFixed(3));
          break;
      }
    }
  }

  // updating statistics json file
  statFile = JSON.stringify(statData, null, 2);
  fs.writeFileSync(STATS_JSON, statFile);

  // console.error("update_bar_and_doughnut() is over; app_data was updated");
  // update global variable
  app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
}

// TODO: make bar and doughnut have ability to get month data
function update_bar_and_doughnut_month() {

}

// TODO: make bar and doughnut have ability to get year data
function update_bar_and_doughnut_year() {
  
}


function update_line() {

  // console.error("calling update_line()");
  var label = []; 

  // get data from files
  var statFile = fs.readFileSync(STATS_JSON); 
  var logFile = fs.readFileSync(DATA_JSON);

  // parse files for data
  var statData = JSON.parse(statFile);
  var logData = JSON.parse(logFile);

  var restOfWeek = 6;

  // resetting line graph's info in stats.json
  for (var i2 = 0; i2 < statData.lineProductive.length; i2++) {
    statData.lineProductive[i2] = 0;
    statData.lineUnproductive[i2] = 0;
  }

  var day = 6;
  for (var counter = app.locals.currDay; counter >= parseInt(app.locals.currDay - restOfWeek); counter--) {

    // variables to create the label
    var labelDay = counter;
    var labelMonth = monthList[date.getMonth()];
    // if the week has days between two months
    if (labelDay < 1) {
      // move one index backwards in monthList[] 
      if (app.locals.currMonth != "January") {
        labelDay += daysInMonth[date.getMonth() - 1];
        labelMonth = monthList[date.getMonth() - 1];
      }
      // but if January, loop back around to end 
      else {
        labelMonth = "December";
        labelDay += daysInMonth[11];
      }
    }
           
    // construct the label
    statData.lineLabels[day] = labelMonth.substring(0,3) + " " + labelDay;
    // console.error(statData.lineLabels[day]);
    label[day] = labelDay;
    day--;    
    // update data
  }

  var currDay = date.getDate();
  var currMonth = monthList[date.getMonth()];
  if (date.getMonth() == 0) {
    prevMonth = monthList[11]
  }
  else {
    prevMonth = monthList[date.getMonth() - 2];
  }

  for (var i = 0; i < logData.logs.length; i++) {
    
    var afterMonth = 8; // # of characters preceeding the month in the data
    var afterDay = 6;   // # of characters preceedin the day in the date
          
    // range so we can get the day digits only
    var lowerBound = logData.logs[i].date.length - afterMonth;
    var upperBound = logData.logs[i].date.length - afterDay;

    var logDay = Number(logData.logs[i].date.substring(lowerBound, upperBound));
    var bool = logDay <= label[6] || logDay >= label[0];
    // label[0] = 26
    // label[6] = 1
    var logMonth = logData.logs[i].month;
    var startOfWeek = app.locals.currDay - restOfWeek;
    if (bool && (logMonth == currMonth || logMonth == prevMonth)) {
      // console.error(logDay);
      // console.log(logData.logs[i]);
      var logType = logData.logs[i].type;
      var logHours = parseInt(logData.logs[i].elapsed.substring(0,2));
      var logMin = parseInt(logData.logs[i].elapsed.substring(3));
      var update = logHours + (logMin/60);

      switch (logDay) {
        case label[0]:
          if (logType == "Work") {
            statData.lineProductive[Day1] += update;
            statData.lineProductive[Day1] = Number(statData.lineProductive[Day1].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day1] += update;
            statData.lineUnproductive[Day1] = Number(statData.lineUnproductive[Day1].toFixed(3));
          }
          break;

        case label[1]: 
          if (logType == "Work") {
            statData.lineProductive[Day2] += update;
            statData.lineProductive[Day2] = Number(statData.lineProductive[Day2].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day2] += update;
            statData.lineUnproductive[Day2] = Number(statData.lineUnproductive[Day2].toFixed(3));
          }
          break;

        case label[2]:
          if (logType == "Work") {
            statData.lineProductive[Day3] += update;
            statData.lineProductive[Day3] = Number(statData.lineProductive[Day3].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day3] += update;
            statData.lineUnproductive[Day3] = Number(statData.lineUnproductive[Day3].toFixed(3));
          } 
          break;

        case label[3]: 
          if (logType == "Work") {
            statData.lineProductive[Day4] += update;
            statData.lineProductive[Day4] = Number(statData.lineProductive[Day4].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day4] += update;
            statData.lineUnproductive[Day4] = Number(statData.lineUnproductive[Day4].toFixed(3));
          }
          break;

        case label[4]: 
          if (logType == "Work") {
            statData.lineProductive[Day5] += update;
            statData.lineProductive[Day5] = Number(statData.lineProductive[Day5].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day5] += update;
            statData.lineUnproductive[Day5] = Number(statData.lineUnproductive[Day5].toFixed(3));
          }
          break;

        case label[5]: 
          if (logType == "Work") {
            statData.lineProductive[Day6] += update;
            statData.lineProductive[Day6] = Number(statData.lineProductive[Day6].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day6] += update;
            statData.lineUnproductive[Day6] = Number(statData.lineUnproductive[Day6].toFixed(3));
          }
          break;

        case label[6]: 
          if (logType == "Work") {
            statData.lineProductive[Day7] += update;
            statData.lineProductive[Day7] = Number(statData.lineProductive[Day7].toFixed(3));
          } 
          if (logType == "Leisure") {
            statData.lineUnproductive[Day7] += update;
            statData.lineUnproductive[Day7] = Number(statData.lineUnproductive[Day7].toFixed(3));
          }
          break;
      }
    }
  }
  // console.error(statData.lineProductive);
  //console.error(statData.lineUnproductive);
  // updating statistics json file

  statFile = JSON.stringify(statData, null, 2);
  fs.writeFileSync(STATS_JSON, statFile);

  //console.error("update_line() is over; app_data was updated");
  // update global variable
  app.locals.app_data = JSON.parse(fs.readFileSync(DATA_JSON));
}
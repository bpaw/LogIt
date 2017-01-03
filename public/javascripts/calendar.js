console.log("this js file is being called");
// these are labels for the days of the week
var day_labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// these are the days of the week for each month, in order
var days_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// these are human-readable month name labels, in order
var month_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// current date
var curr_date = new Date();

var default_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
var fake_date = new Date(2016, 11, 1);

var starting_day = default_date.getDay();

var month_length = days_in_months[curr_date.getMonth()];

var currMonth = curr_date.getMonth();
var currYear = curr_date.getFullYear();

if (currMonth == 1) {
	
	if ((currYear % 4 == 0 && currYear % 100 != 0) || currYear % 400 == 0) {
		month_length = 29;
	}
}

console.log("month_length: " + month_length );
console.log("starting_day: " + starting_day);


function Calendar(month, year) {
	this.month = (isNaN(month) || month == null) ? curr_date.getMonth() : month;
	this.year = (isNaN(year) || year == null) ? curr_date.getFullYear() : year ;
	this.html = "";
}

Calendar.prototype.generateHTML = function() {

	var monthName = month_labels[this.month];
	var html = '<table>';
	html += '<tr class="calendar-header">';

	for (var i = 0; i < 7; i++) {
		html += '<td class="calendar-header-day">';
		html += day_labels[i];
		html += '</td>';
	}
	html += '</tr>';

	row = Math.ceil((starting_day + month_length)/7);
	console.log(row);
	
	var day = 1;
	var counter = 1;
	for (var i = 0; i < row; i++) {
		html += '<tr>';
		// this loop is for the days in the calendar
		for (var j = 0; j < 7; j++) {
			html += '<td class="calendar-day">';
			if (counter - starting_day > 0 && day <= (month_length + starting_day)) {
				html += day;
				day++;
			}
			counter++;
			html += '</td>';
		}
		html += '</tr>';
	}

	html += '</table>';

	this.html = html;
}

Calendar.prototype.getHTML = function() {
  return this.html;
}

var cal = new Calendar(curr_date.getMonth(), curr_date.getFullYear());
//var cal = new Calendar(11, 2016); for testing 

console.log(cal);
cal.generateHTML();

var col_right = document.getElementsByClassName("col-right");
var table = document.createElement("TABLE");
table.className = ('calendar-table');

table.innerHTML = (cal.getHTML());
//col_right.append(table);
$('.col-right').append(table);

console.log("cal appended to col-right was called");

	///// 	Event Listeners for Calendar 	/////

$('.calendar-day').mouseover(function() {
	$(this).addClass('calendar-day-hover');
});

$('.calendar-day').mouseleave(function() {
	$(this).removeClass('calendar-day-hover');
});
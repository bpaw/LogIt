// these are labels for the days of the week
var day_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are the days of the week for each month, in order
var days_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// these are human-readable month name labels, in order
var month_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// current date
var curr_date = new Date();

var default_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);

var starting_day = default_date.getDay();

var month_length = days_in_months[curr_date.getMonth()];

var currMonth = curr_date.getMonth();
var currYear = curr_date.getFullYear();

if (currMonth == 1) {
	
	if ((currYear % 4 == 0 && currYear % 100 != 0) || currYear % 400 == 0) {
		month_length = 29;
	}
}

function Calendar(month, year) {
	this.month = month_labels[curr_date.getMonth()];
	this.year = curr_date.getFullYear();
	this.html = "";
}

Calendar.prototype.generateHTML = function() {

}

var cal = new Calendar(curr_date.getMonth(), curr_date.getFullYear());


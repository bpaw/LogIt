console.log("this js file is being called");
// these are labels for the days of the week
var day_labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// these are the days of the week for each month, in order
var days_in_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// these are human-readable month name labels, in order
var months = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

var month_labels = ['Jan', 'Feb', 'Mar', 'Apr',
                     'May', 'Jun', 'Jul', 'Aug', 'Sep',
                     'Oct', 'Nov', 'Dec'];

var cal_flag = 0; // var that tells if any data has been loaded

// current date
var curr_date = new Date();

var default_date = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1);
// var fake_date = new Date(2016, 11, 1);

var starting_day = default_date.getDay();

var month_length = days_in_months[curr_date.getMonth()];

var currMonth = curr_date.getMonth();
var currYear = curr_date.getFullYear();

if (currMonth == 1) {
	
	if ((currYear % 4 == 0 && currYear % 100 != 0) || currYear % 400 == 0) {
		month_length = 29;
	}
}

var orig_date = $('.log-subheader').text();
$('.col-left-year').text(String(currYear));
$('.col-left-month').text(month_labels[currMonth]);

console.log("month_length: " + month_length );
console.log("starting_day: " + starting_day);


function Calendar(month, year) {
	this.month = (isNaN(month) || month == null) ? curr_date.getMonth() : month;
	this.year = (isNaN(year) || year == null) ? curr_date.getFullYear() : year ;
	this.html = "";
}

Calendar.prototype.generateHTML = function() {

	// creating the table 
	var html = '<table>';
	html += '<tr class="calendar-header">';

	// add a row for the days of the week
	for (var i = 0; i < 7; i++) {
		html += '<td class="calendar-header-day">';
		html += day_labels[i];
		html += '</td>';
	}
	html += '</tr>';

	// calculate max # of rows needed on the calendar
	row = Math.ceil((starting_day + month_length)/7);
	console.log(row);
	
	var day = 1;
	var offset = 1;

	// add rows for every day in the month 
	for (var i = 0; i < row; i++) {
		html += '<tr>';
		// this loop is for the days in the calendar
		for (var j = 0; j < 7; j++) {
			html += '<td class="calendar-day">';
			if (offset - starting_day > 0 && day <= (month_length)) {
				html += day;
				day++;
			}
			offset++;
			html += '</td>';
		}
		html += '</tr>';
	}

	html += '</table>';

	// assign newly created html to the calling obj's field
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

$('#menu-home').click(function() {
	location.href = "/";
});

$('#menu-journal').click(function() {
	location.href = "/Log";
});

$('#menu-stats').click(function() {
	location.href = "/statistics";
});

$('#menu-settings').click(function() {
	location.href = "/placeholder";
});


$('body').on('click', '.calendar-banner-left', function() {
	var monthCode = $('.col-left-month').text();
	monthCode = monthCode.replace(" ", "");
	var monthIndex = month_labels.indexOf(monthCode);
	var newMonth = monthIndex - 1;
	var newYear = Number($('.col-left-year').text());
	if (newMonth == -1) {
		newMonth = 11;
		newYear -= 1;
	}
	$('.col-left-month').text(month_labels[newMonth]);
	$('.col-left-year').text(newYear);
	shiftMonth(newMonth, newYear);
});

$('body').on("click", '.calendar-banner-right', function() {
	var monthCode = $('.col-left-month').text();
	monthCode = monthCode.replace(" ", "");
	console.log(monthCode);
	var monthIndex = month_labels.indexOf(monthCode);
	console.log(monthIndex);
	var newMonth = monthIndex + 1;
	var newYear = Number($('.col-left-year').text());
	if (newMonth == 12) {
		newMonth = 0;
		newYear += 1;
	}
	$('.col-left-month').text(month_labels[newMonth]);
	$('.col-left-year').text(newYear);
	shiftMonth(newMonth, newYear);
});

$('body').on("mouseover", '.calendar-day', function() {
	
	if ($(this).text() != "") {
		$(this).addClass('calendar-day-hover');
	}
});

$('body').on("mouseleave", '.calendar-day', function() {
	$(this).removeClass('calendar-day-hover');
});


$('body').on("click", '.calendar-day', function() {
	
	//get the date 
	var day = $(this).text();
	var cal_month = $('.col-left-month').text();
	cal_month = cal_month.replace(" ", "");
	cal_month = month_labels.indexOf(cal_month);

	var dayObj = {}
	if (day != "") {
		
		dayObj = {
			day: day,
			month: Number(cal_month),
			year: Number($('.col-left-year').text())
		}
	}

	if (day != "") {
		if (cal_flag == 0) {

			// reset cal_flag
			cal_flag = day;
			$.ajax({
				type: "POST",
				data: dayObj,
				url: "/getSpecificInfo",
				success: function(result) {

					// if no logs were received, alert user
					if (result.length == 0) {
						alert("No logs were made on this date.");
					}
					// else generate li elements and bar graph from data
					else {
						generate_li(result);
						generate_stats(result);
					}			
				}
			});
		}
		else if (cal_flag == day) {
			
			// delete current li elements
			reset_cal();

			// reset cal_flag
			cal_flag = 0;

			$('.log-header').text("Click on a date");
			$('.log-subheader').text(orig_date);
		}
		else if (cal_flag != day) {
			
			// delete current li elements
			reset_cal();
			
			// reset cal_flag
			cal_flag = day;
			
			// get new data
			$.ajax({
				type: "POST",
				data: dayObj,
				url: "/getSpecificInfo",
				success: function(result) {

					// if no logs were received, alert user 
					if (result.length == 0) {
						alert("No logs were made on this date.");
					}
					// else generate li elements and bar graph from data
					else {
						generate_li(result);
						generate_stats(result);
					}					
				}
			});
		}
	}
});

	///// 	Helper Functions 	/////

function generate_li(result) {
	for (var i = 0; i < result.length; i++) {

		// get/create elements
		var ul = $(".log-list");
		var li = document.createElement("li");
		var li_time = document.createElement('div');
		var li_description = document.createElement('div');

		// assign classes
		li.className = 'log-list-style';
		li_time.className = 'li-time';
		li_description.className = 'li-description';

		// create textnodes 
		var logTime = result[i].start + " - " + result[i].end;
		var time_node = document.createTextNode(logTime);
		var desc_node = document.createTextNode(result[i].description);

		// append text nodes to divs
		li_time.appendChild(time_node);
		li_description.appendChild(desc_node);

		// append divs to li and li to ul
		li.appendChild(li_time);
		li.appendChild(li_description);
		ul.append(li);
	}
	var loaded_date = result[i-1].date;
	console.log(loaded_date);
	$('.log-header').text("Data from: ");
	$('.log-subheader').text(loaded_date);
}

function generate_stats(result) {

	var data = [0, 0, 0, 0, 0, 0, 0];
	var Work = 0;
	var Leisure = 1;
	var Daily_Routines = 2;
	var Sleep = 3;
	var Eating = 4;
	var Transportation = 5;
	var Exercise = 6;

	for (var i = 0; i < result.length; i++) {

		var hours = Number(result[i].elapsed.substring(0, 2));
		var min = (Number(result[i].elapsed.substring(3))/60);
		var update = hours + min;

		switch(result[i].type) {

			case "Work":
				data[Work] += update;
				break;
			case "Leisure":
				data[Leisure] += update;
				break;
			case "Daily Routines":
				data[Daily_Routines] += update;
				break;
			case "Sleep":
				data[Sleep] += update;
				break;
			case "Eating":
				data[Eating] += update;
				break;
			case "Transportation":
				data[Transportation] += update;
				break;
			case "Exercise":
				data[Exercise] += update;
				break;
		}
	}

	var barContext = document.getElementById('barChart');
	var barLabs = [
	    "Work",
	    "Leisure",
	    "Daily Routines",
	    "Sleeping",
	    "Eating",
	    "Transportation",
	    "Exercise"
  	]

	var barData = {
                labels: barLabs,
                datasets: [
                {            
                    label: "This week",
                    backgroundColor: ["rgba(75,192,192,0.4)", 
                    "rgba(239,83,80,0.4)",
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(242, 116, 5, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(255, 159, 64, 0.4)'
                    ],
                    borderColor: ["rgba(75,192,192,1)", 
                    "rgba(239,83,80,1)",
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(242, 116, 5, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'],
                    data: data
                }]
            };
	var barChart = new Chart(barContext, {
		type: "bar",
		data: barData
	});

}

function reset_cal() {

	// remove all elements with this class (i.e. all li elements)
	$('#barChart').remove();
	$('.bar-container').append('<canvas id="barChart"></canvas>');
	$('.log-list-style').remove();
}

function shiftMonth(month, year) {

	// update variables used in generateHTML
	default_date = new Date(year, month, 1);
	starting_day = default_date.getDay();
	month_length = days_in_months[month];
	console.log(month_length);
	// reassign Calendar object
	cal = new Calendar(month, year);
	// generate new HTML
	cal.generateHTML();
	// assign that new HTML to the table element
	table.innerHTML = (cal.getHTML());
}
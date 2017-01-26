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
                     'May', 'Jun', 'Jul', 'Aug', 
                     'Sep', 'Oct', 'Nov', 'Dec'];

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
				html += '<a href="#view" class="scroll-anchor">';
				html += day;
				html += '</a>';
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

$('#menu-check').click(function() {
	location.href = "/checklist";
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
						var view = document.getElementById('view');
						var height = view.offsetHeight;
						window.scrollTo(0, height);
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
						var view = document.getElementById('view');
						var height = view.offsetHeight;
						window.scrollTo(0, height);
						generate_li(result);
						generate_stats(result);
					}					
				}
			});
		}
	}
});

/* Event listener for hovering over a log item - show trash and edit options */
$('body').on("mouseenter", '.log-list-style:not(.unhoverable)', function() {
	$(this).children('.trash-button').children('.trash-o').html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
	$(this).children('.edit-button').children('.pencil').html('<i class="fa fa-pencil" aria-hidden="true"></i>');
}); 

/* Event listener for the mouse leaving a log item - get rid of trash and edit options */
$('body').on("mouseleave", '.log-list-style', function() {
	$(this).children('.trash-button').children('.trash-o').html('<i class="trash"></i>');
	$(this).children('.edit-button').children('.pencil').html('<i class="pencil"></i>');
}); 

$('body').on("click", ".trash-button", function() {

	var log = {};

	var logYear = $('.col-left-year').text().trim();
	
	var monthIndex = month_labels.indexOf($('.col-left-month').text().trim());
	var logMonth = months[monthIndex];
	var logDate = $('.log-subheader').text().trim();
	var logTime = $(this).parent().children('.li-time').text().trim();
	var logStart = logTime.substring(0, 8);
	var logEnd = logTime.substring(logTime.length - 8); 
	var logDesc = $(this).parent().children('.li-description').text().trim();
	var logElaps = $(this).parent().children('.type-rec').text().trim();
	
	var day = logDate.substring(logDate.length - 8, logDate.length - 6).trim();
	var cal_month = $('.col-left-month').text();
	cal_month = cal_month.replace(" ", "");
	cal_month = month_labels.indexOf(cal_month);

	/* The alert messages archive */
	//alert(logYear);
	// alert(logMonth);
	// alert(logDate);
	//alert(logStart);
	//alert(logEnd);
	//alert(logDesc);
	//alert(logElaps);

	log = {
		year: logYear,
  		month: logMonth,
  		date: logDate,
  		start: logStart,
  		end: logEnd,
  		description: logDesc,
  		elapsed: logElaps
	}

	$.ajax({
		type: "POST",
		url: "/deletePost",
		data: log
	});

	$(this).parent().remove();

	var valid_logs = [];

	dayObj = {
		day: day,
		month: Number(cal_month),
		year: Number($('.col-left-year').text())
	}

	console.error(dayObj);

	$.ajax({
		type: "POST",
		url: "/getSpecificInfo",
		data: dayObj
	}).done(function(valid) {
		valid_logs = valid;
		console.error(valid);

		// Case for if the last log was deleted
		if ($('.log-list-style').length ) {
			$('#barChart').remove();
			$('.bar-container').append('<canvas id="barChart"></canvas>');
			generate_stats(valid_logs);
		}
		// Case for if there are other logs
		else {
			reset_cal();
		}
	});
});

$('body').on("click", ".edit-button", function() {

	// "edit mode" - take off other buttons 
	$(this).parent().children('.trash-button').children('.trash-o').html('<i class="trash"></i>');
	$(this).parent().children('.edit-button').children('.pencil').html('<i class="pencil"></i>');
	// this page's javascript is relies on binding so extra step needed 
	$('.log-list-style').addClass('unhoverable');

	// add new buttons for edit mode 
	$(this).parent().children('.check-button').html('<i class="fa fa-check" aria-hidden="true"></i>');
	$(this).parent().children('.x-button').html('<i class="fa fa-times" aria-hidden="true"></i>');


	// divs for the edit mode input boxes 
	var startDiv = document.createElement('div');
	var endDiv = document.createElement('div');
	startDiv.className = 'edit-start-container';
	endDiv.className = 'edit-end-container';

	// variables for creating the date information
	var monthList = ["January", "February","March","April","May","June","July","August","September","October","November", "December"];
	var currDate = $('.log-subheader').text().trim();


	// logging objects and variables that will be the fields of those log objects
	
	var origLog = {};
	var newLog = {};
	var time = $(this).parent().children('.li-time').text().trim();
	var index = time.indexOf("-");	
	var startTime = time.substring(0, index - 1);
	var endTime = time.substring(index + 2);
	
	var description = $(this).parent().children('.li-description').text().trim();
	
	var elapsedTime = $(this).parent().children('.type-rec').text().trim();
	
	var logType = $(this).parent().children('.type-rec').attr('id');

	if (logType.indexOf("_") != -1) {
		logType = logType.replace("_", " ");
	}
	origLog = {
		year: $('.col-left-year').text().trim(),
  		month: monthList[month_labels.indexOf($('.col-left-month').text().trim())],
  		date: currDate,
  		type: logType,
  		start: startTime,
  		end: endTime,
  		description: description,
  		elapsed: elapsedTime,
  		updatedStart: "",
  		updatedEnd: "",
  		updatedElapsed: "",
  		updatedDescription: ""
  	}

  	newLog = {
  		year: $('.col-left-year').text().trim(),
  		month: monthList[month_labels.indexOf($('.col-left-month').text().trim())],
  		date: currDate,
  		type: logType,
  		start: startTime,
  		end: endTime,
  		description: description,
  		elapsed: elapsedTime
  	}

  	//console.error(origLog);
  	//console.error(newLog);

  	$(this).parent().children('.li-time').html("");
	$('.li-time').append(startDiv);
	$('.li-time').append(endDiv);

	// change to new input type 
	$(this).parent().children('.li-time').children('.edit-start-container').html('<input type="text" id="edit-start"/>'); 
	$(this).parent().children('.li-time').children('.edit-end-container').html('<input type="text" id="edit-end"/>');
	$(this).parent().children('.li-description').html('<input type="text" id="edit-desc"/>');
	
	// placeholder information for updated log input
	$('#edit-desc').attr("placeholder", description);
	$('#edit-start').attr("placeholder", startTime);
	$('#edit-end').attr("placeholder", endTime);
		
		///// Event listeners /////

	// for editing the start time of a log
	$('#edit-start').click(function() {
		$(this).parent('.edit-start-container').html('<input type="time" id="edit-start"/>');
		// alert("edit start input");
	});

	// for editing the end time of a log
	$('#edit-end').click(function() {
		$(this).parent('.edit-end-container').html('<input type="time" id="edit-end"/>');
		// alert("edit end input");
	});

	// for canceling changes to a log
	$('.x-button').click(function() {
		
		// location.href = "/Log";

		$(this).parent().children('.li-time').children('.edit-start-container').remove();
		$(this).parent().children('.li-time').children('.edit-end-container').remove();

		$(this).parent().children('.li-time').html(time);
		$(this).parent().children('.li-description').html(description);

		$('.log-list-style').removeClass('unhoverable');
		$(this).parent().children('.check-button').html('<i class="check"></i>');
		$(this).parent().children('.x-button').html('<i class="x"></i>');
	});

	$('.check-button').click(function() {

		var editStart = $('#edit-start').val();
		var editEnd = $('#edit-end').val();
		var editDesc = $('#edit-desc').val();

		// if any of the input fields were filled, then edit the log
		if (editStart != "" || editEnd != "" || editDesc != "") {

			if (editStart != "") {
				newLog.start = toMeridian(editStart);
				origLog.updatedStart = toMeridian(editStart);
				// alert(toMilitary(newLog.start));
				// alert(toMilitary(newLog.end));
				origLog.updatedElapsed = getElapsed(toMilitary(newLog.start), toMilitary(newLog.end));
			}
			if (editEnd != "") {
				newLog.end = toMeridian(editEnd);
				origLog.updatedEnd = toMeridian(editEnd);
				// alert(toMilitary(newLog.start));
				// alert(toMilitary(newLog.end));
				origLog.updatedElapsed = getElapsed(toMilitary(newLog.start), toMilitary(newLog.end))
			}
			if (editDesc != "") {
				// alert("change to description");
				origLog.updatedDescription = editDesc;
			}

			$.ajax({ 
				type: "POST",
				data: origLog,
				url: "/editPost",
			}).done(function(dummyData) {

				// alert("edit post came back");
				var dayObj = {};

				var logDate = $('.log-subheader').text().trim();
				var day = logDate.substring(logDate.length - 8, logDate.length - 6).trim();
				var cal_month = $('.col-left-month').text();
				cal_month = cal_month.replace(" ", "");
				cal_month = month_labels.indexOf(cal_month);

				dayObj = {
					day: day,
					month: Number(cal_month),
					year: Number($('.col-left-year').text())
				}

				console.error(dayObj);

				$.ajax({
					type: "POST",
					data: dayObj,
					url: "/getSpecificInfo"
				}).done(function(result) {
					// alert("second getSpecificInfo came back");
					$('.log-list-style').remove();
					generate_li(result);
					generate_stats(result)
				});
			});
		}
	});

});
	///// 	Helper Functions 	/////

function generate_li(result) {
	for (var i = 0; i < result.length; i++) {

		// get/create elements
		var ul = $(".log-list");
		var li = document.createElement("li");
		var li_time = document.createElement('div');
		var li_description = document.createElement('div');
		var li_type = document.createElement('div');
		var edit_div = document.createElement('div');
		var trash_div = document.createElement('div');
		var x_div = document.createElement('div');
		var check_div = document.createElement('div');

		// assign classes
		li.className = 'log-list-style';
		li_time.className = 'li-time';
		li_description.className = 'li-description';
		li_type.className = 'type-rec';
		edit_div.className = "edit-button";
		trash_div.className = "trash-button";
		x_div.className = "x-button";
		check_div.className = "check-button";

		// assign id to elapsed marker based on its activity type
		if (result[i].type == "Work") {
			li_type.id = "Work";
		}
		else if (result[i].type == "Leisure") {
			li_type.id = "Leisure";
		}
		else if (result[i].type == "Sleep" || result[i].type == "Sleeping") {
			li_type.id = "Sleeping";
		}
		else if (result[i].type == "Daily Routines") {
			li_type.id = "Daily_Routines";
		}
		else if (result[i].type == "Eating") {
			li_type.id = "Eating";
		}
		else if (result[i].type == "Transportation") {
			li_type.id = "Transportation";
		}
		else if (result[i].type == "Exercise") {
			li_type.id = "Exercise";
		}

		// create textnodes and i elements
		var logTime = result[i].start + " - " + result[i].end;
		var time_node = document.createTextNode(logTime);
		var desc_node = document.createTextNode(result[i].description);
		var type_node = document.createTextNode(result[i].elapsed);
		var trash_icon = document.createElement('i');
		var edit_icon = document.createElement('i');
		var x_icon = document.createElement('i');
		var check_icon = document.createElement('i');

		// i element class names 
		trash_icon.className = "trash-o";
		edit_icon.className = "pencil";
		x_icon.className = "x";
		check_icon.className = "check";

		// append text nodes and i elements to divs
		li_time.appendChild(time_node);
		li_description.appendChild(desc_node);
		li_type.appendChild(type_node);
		edit_div.appendChild(edit_icon);
		trash_div.appendChild(trash_icon);

		// append divs to li and li to ul
		li.appendChild(li_type);
		li.appendChild(li_time);
		li.appendChild(li_description);
		li.appendChild(edit_div);
		li.appendChild(trash_div);
		li.appendChild(x_div);
		li.appendChild(check_div);
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

  	for (var i = 0; i < data.length; i++) {
  		data[i] = data[i].toFixed(3);
  	}

	var barData = {
                labels: barLabs,
                datasets: [
                {            
                    label: "This week",
                    backgroundColor: ["rgba(75,192,192,0.4)", 
                    "rgba(239,83,80,0.4)",
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(242, 116, 5, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(255, 159, 64, 0.4)'
                    ],
                    borderColor: ["rgba(75,192,192,1)", 
                    "rgba(239,83,80,1)",
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
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

// send data to ths method in military time format
function getElapsed(start, end) {

	var startHour = start.substring(0,2);
	var endHour = end.substring(0,2);
	
	// alert(endHour);
	// alert(startHour);
	
	var hour;
	var min;
	var result;

	if (Number(startHour) > Number(endHour)) {
		// alert("edge case - crossing over midnight");
		hour = 24 - Number(startHour) + Number(endHour);
	}
	else {
		// alert("normal case");
		hour = Number(endHour) - Number(startHour);
	}

	var startMin = start.substring(3);
	var endMin = end.substring(3);


	if (Number(startMin) > Number(endMin)) {
		min = (60 - Number(startMin)) + Number(endMin); 
		hour = Number(hour) - 1;
	}
	else {
		min = Number(endMin) - Number(startMin); 
	}

	// alert("returning elapsed time: ");

	if (Number(hour) < 10) {
		hour = "0" + hour;
	}
	if (Number(min) < 10) {
		min = "0" + min;
	}

	return String(hour + ":" + min);
}

function toMeridian(input) {

	var inputHour = input.substring(0,2);

	if (inputHour >= 12) {
		if (inputHour != 12) {
			inputHour = inputHour - 12;
			input = inputHour + input.substring(2) + " PM";
		}
		else {
			input = inputHour + input.substring(2) + " PM";	
		}
	}
	else {
		if (inputHour == 0) {
			inputHour = 12;
			input = inputHour + input.substring(2);
			inputHour *= 0;
		}
		input = input + " AM";
	}

	return input;
}

function toMilitary(input) {

	var input_length = input.length;
	var meridian = input.substring(input_length - 2);
	var inputHour = input.substring(0, 2);

	if (inputHour.indexOf(":") != -1) {
		inputHour = inputHour.replace(":", "");
		inputHour = "0" + inputHour;
		input = "0" + input;
		input_length += 1;
	}
	
	if (meridian == "AM") {

		if (inputHour == 12) {
			inputHour = Number(inputHour) - 12;
			input = "0" + inputHour + input.substring(2 , input_length - 3);
		}
		else {
			input = input.substring(0, input_length - 3);
		}
	}
	else if (meridian == "PM") {
		
		if (inputHour == 12) {
			input = input.substring(0, input_length - 3);
		}
		else {
			inputHour = Number(inputHour) + 12;
			input = inputHour + input.substring(2 , input_length - 3);
		}
		// alert(input);
	}

	// alert("toMilitary returning: " + input);
	return input;
}
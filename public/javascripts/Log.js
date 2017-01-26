var main = function() {

	/////////////// JavaScript for the banner items ////////////////////	
	
	$('#menu-home').click(function() {
		location.href = "/";
	});

	$('#menu-stats').click(function() {
		location.href = "/statistics";
	});

	$('#menu-cal').click(function() {
		location.href = "/calendar";
	});

	$('#menu-check').click(function() {
		location.href = "/checklist";
	});
	
	/////////////// JavaScript for the Log entries ////////////////////

	/* Event listener for clicking on CANCEL BUTTON */
	$('.cancel-button').click(function() {
		$('.log-description').val("");
		$('#start-time').val("");
		$('#end-time').val("");
		$('#type-selection').val("");		
	}); 

	/* Event listener for clicking on POST BUTTON */
	$('.post-button').click(function() {
	var descriptionPlaceholder = "description of activity";
	var timePlaceholder = "_:_ _ - _:_ _";

	// getting values from the input boxes	
	var startTime = $('#start-time').val();
	var endTime = $('#end-time').val();
	var logDescription = $('.log-description').val();
	var log_type = $('#type-selection').val();
	var startTimeNoMeridian;
	var endTimeNoMeridian; 
	
	var condition1 = startTime.length > 0 && endTime.length > 0 && logDescription.length > 0;
	var condition2 = logDescription != descriptionPlaceholder;
	var condition3 = log_type != "";
	
	// testing conditions to see if the input boxes were filled
	if (condition1 && condition2 && condition3) {

		// variables to get first two numbers in the start and end time
		var startHour = startTime.substring(0, 2);
		var endHour = endTime.substring(0, 2);

		var NOON = 12; 			// var to refer to NOON for readability
		var MIDNIGHT = 12;
		// converting start time to meridian format
		if (startHour >= NOON) {
			if (startHour != NOON) {
				startHour = startHour - NOON;
				startTimeNoMeridian = (startHour + NOON) + startTime.substring(2);
				startTime = startHour + startTime.substring(2) + " PM";
				startTimeNoMeridian = startTimeNoMeridian + ':00';
			}
			else {
				startTimeNoMeridian = NOON + startTime.substring(2) + ':00'; 
				startTime = startHour + startTime.substring(2) + " PM";
			}
		}
		else {
			if (startHour == 0) {
				startHour = NOON;
				startTime = startHour + startTime.substring(2);
				startHour *= 0;
			}
			startTimeNoMeridian = startHour + startTime.substring(2) + ':00';
			startTime = startTime + " AM";
		}

		// converting end time to meridian format
		if (endHour >= NOON) {
			if (endHour != NOON) {
				endHour = endHour - NOON;
				endTimeNoMeridian = (endHour + NOON) + endTime.substring(2);
				endTime = endHour + endTime.substring(2) + " PM";
				endTimeNoMeridian = endTimeNoMeridian + ':00';
			}
			else {
				endTimeNoMeridian = NOON + endTime.substring(2) + ':00';
				endTime = endHour + endTime.substring(2) + " PM";
				
			}
		}
		else {
			if (endHour == 0) {
				endHour = NOON;
				endTime = endHour + endTime.substring(2);
				endHour *= 0;
			}
			endTimeNoMeridian = endHour + endTime.substring(2) + ':00';
			endTime = endTime + " AM";
		}

		// setting to null so placeholders comes back in 
		$('.log-description').val("");
		$('#start-time').val("");
		$('#end-time').val("");
		$('#type-selection').val("");
		
		// Date object so we can access Date methods
		var date = new Date();

		// getting values to use as Log object field values 
		var Logyear = date.getFullYear()
		var monthList = ["January", "February","March","April","May","June","July","August","September","October","November", "December"];
		var Logmonth = date.getMonth();
		Logmonth = monthList[parseInt(Logmonth)];
		var Logday = date.getDate();
		var Logdate = Logmonth + " " + Logday + ", " + Logyear;
		// var elapsedTime = Number(startTime) - endTime;

		var elapsedTime = new Date();
		var T1 = new Date(Logdate + " " + startTimeNoMeridian);
		var T2 = new Date(Logdate + " " + endTimeNoMeridian);
		diffHour = T2.getHours() - T1.getHours();
		diffMin = T2.getMinutes() - T1.getMinutes();
		//alert(T1.getHours());
		//alert(T2.getHours());
		//alert(endTimeNoMeridian);
		// edge cases - 1) crossing over midnight & 2) startTime's min > endTime's
		if (T1.getHours() > T2.getHours()) {
			//alert("T1.getHours() > T2.getHours()");
			diffHour = (24 - T1.getHours()) + T2.getHours();
			//alert("diffHour (before diffMin computation)- " + diffHour);
		}
		if (T1.getMinutes() > T2.getMinutes()) {
			//alert("T1.getMinutes() > T2.getMinutes()");
			diffMin = (60 - T1.getMinutes()) + T2.getMinutes();
			diffHour -= 1;
			//alert(diffHour + ":" + diffMin);
		}

		// final padding so all values have 2 digits minimum
		if (diffHour < 10) {
			diffHour = "0" + diffHour;
		}
		if (diffMin < 10) {
			diffMin = "0" + diffMin;
		}

		elapsedTime = diffHour + ":" + diffMin;

		// creating a new log entry to push to data.json
		var newLog = {
			year: Logyear.toString(),
      		month: Logmonth,
      		date: Logdate,
      		type: log_type,
      		start: startTime,
      		end: endTime,
      		description: logDescription,
      		elapsed: elapsedTime
		}

		var newData = JSON.stringify(newLog);
		
		$.ajax({
        type: "POST",
        url: "/addNewLog",
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        data: newData,
        async: true,
        success: function(message) {
        	console.error(message);
        }
      	}); 

      	$.ajax({
      		type: "POST",
      		url: "/readUpdate",
      		async: true,
      		success: function(reloadroute) {
	          location.href=reloadroute;
	        },
	        error: function(err) {
	          console.log(err);
	        }
      	});
	}	
	}); 

	/* Event listener for hovering over an elapsed time box 
	$('.type-rec').mouseenter(function() {
		
		var type_info = document.createElement('div');
		type_info.className = "type_info";

	});

	/* Event listener for mouse leaving an elapsed time box 
	$('.type-rec').mouseenter(function() {

	});*/

	/* Event listener for hovering over a log item - show trash and edit options */
	$('.log-list-style').mouseenter(function() {
		$(this).children('.trash-button').children('.trash-o').html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
		$(this).children('.edit-button').children('.pencil').html('<i class="fa fa-pencil" aria-hidden="true"></i>');
	}); 

	/* Event listener for the mouse leaving a log item - get rid of trash and edit options */
	$('.log-list-style').mouseleave(function() {
		$(this).children('.trash-button').children('.trash-o').html('<i class="trash"></i>');
		$(this).children('.edit-button').children('.pencil').html('<i class="pencil"></i>');
	}); 

	$('.edit-button').click(function() {
		// alert("edit");
		
		var startDiv = document.createElement('div');
		var endDiv = document.createElement('div');
		startDiv.className = 'edit-start-container';
		endDiv.className = 'edit-end-container';

		// "edit mode" - take off other buttons 
		$(this).parent().children('.trash-button').children('.trash-o').html('<i class="trash"></i>');
		$(this).parent().children('.edit-button').children('.pencil').html('<i class="pencil"></i>');
		
		var date = new Date();
		var monthList = ["January", "February","March","April","May","June","July","August","September","October","November", "December"];
		var currDate = monthList[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		
		var origLog = {};
		var newLog = {};
		var time = $(this).parent().children('.li-time').text().trim();
		var index = time.indexOf("-");	
		var startTime = time.substring(0, index - 1);
		var endTime = time.substring(index + 2);
		
		var description = $(this).parent().children('.li-description').text().trim();
		
		var elapsedTime = $(this).parent().children('.type-rec').text().trim();
		
		var logType = $(this).parent().children('.type-rec').attr('id');

		// "Daily_Routines" needs to be converted to "Daily Routines"
		if (logType.indexOf("_") != -1) {
			logType = logType.replace("_", " ");
		}

		origLog = {
			year: String(date.getFullYear()),
      		month: monthList[date.getMonth()],
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
      		year: String(date.getFullYear()),
      		month: monthList[date.getMonth()],
      		date: currDate,
      		type: logType,
      		start: startTime,
      		end: endTime,
      		description: description,
      		elapsed: elapsedTime
      	}

		$(this).parent().children('.li-time').html("");
		$('.li-time').append(startDiv);
		$('.li-time').append(endDiv);

		// change the log data
		$(this).parent().children('.li-time').children('.edit-start-container').html('<input type="text" id="edit-start"/>'); 
		$(this).parent().children('.li-time').children('.edit-end-container').html('<input type="text" id="edit-end"/>');

		$(this).parent().children('.li-description').html('<input type="text" id="edit-desc"/>');
		
		// add new buttons for edit mode 
		$(this).parent().children('.check-button').html('<i class="fa fa-check" aria-hidden="true"></i>');
 		$(this).parent().children('.x-button').html('<i class="fa fa-times" aria-hidden="true"></i>');

		// placeholder information for updated log input
		$('#edit-desc').attr("placeholder", description);
		$('#edit-start').attr("placeholder", startTime);
		$('#edit-end').attr("placeholder", endTime);
		
		///// Event listeners /////
		
		// edit mouse enter does not allow the pencil or trash icon to appear 
		$('.log-list-style').mouseenter(function() {
			$(this).children('.trash-button').children('.trash-o').html('<i class="trash"></i>');
			$(this).children('.edit-button').children('.pencil').html('<i class="pencil"></i>');
		}); 

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
			location.href = "/Log";
		});

		// for submitting the changes to a log
		$('.check-button').click(function() {

			var editStart = $('#edit-start').val();
			var editEnd = $('#edit-end').val();
			var editDesc = $('#edit-desc').val();
			if (editStart != "" || editEnd != "" || editDesc != "") {
				// alert("at least one input isnt empty");

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
				});

				$.ajax({
		      		type: "POST",
		      		url: "/readUpdate",
		      		async: true,
		      		success: function(reloadroute) {
			          location.href=reloadroute;
			        },
			        error: function(err) {
			          console.log(err);
			        }
		      	});
			}
		});

		
	});

	$('.trash-button').click(function() {
		// alert("Delete this log?");
		var date = new Date();
		var monthList = ["January", "February","March","April","May","June","July","August","September","October","November", "December"];
		var currDate = monthList[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
		
		var log = {};
		
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

		log = {
			year: String(date.getFullYear()),
      		month: monthList[date.getMonth()],
      		date: currDate,
      		type: logType,
      		start: startTime,
      		end: endTime,
      		description: description,
      		elapsed: elapsedTime
		} 

		// console.error(log);

		$.ajax({ 
			type: "POST",
			data: log,
			url: "/deletePost",
		});

		$.ajax({
      		type: "POST",
      		url: "/readUpdate",
      		async: true,
      		success: function(reloadroute) {
	          location.href=reloadroute;
	        },
	        error: function(err) {
	          console.log(err);
	        }
      	});
	});
};

$(document).ready(main);

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
// Archives // 

// CODE FOR CREATING FAKE HTML ELEMENTS PRIOR TO RELOAD
/*
		// creating/finding elements to add to/modify in front end
		var ul = document.getElementById("log-list");
		var li = document.createElement("li");
		var time_div = document.createElement("div");
		var description_div = document.createElement("div");
		var time_content = document.createTextNode(startTime + ' - ' + endTime);
		var description_content = document.createTextNode(logDescription);

		// adding text content to newly created divs
		time_div.appendChild(time_content);
		description_div.appendChild(description_content);

		// adding divs to the newly created li
		li.appendChild(time_div);
		li.appendChild(description_div);

		// add classes to the divs and li
		time_div.className = "li-time";
		description_div.className = "li-description";
		li.className = "log-list-style";

		// adding the newly created li to the ul 
		ul.appendChild(li);
		*/
//
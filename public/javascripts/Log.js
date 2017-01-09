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

	$('#menu-settings').click(function() {
		location.href = "/placeholder";
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

	/* Event listener for hovering over a log item - show x option */
	$('.log-list-style').mouseenter(function() {
		$(this).children('.x-button').text('x');
	}); 

	/* Event listener for the mouse leaving a log item - get rid of x option */
	$('.log-list-style').mouseleave(function() {
		$(this).children('.x-button').text('');
	}); 
};

$(document).ready(main);


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
var main = function() {


	/////////////// JavaScript for the Hamburger Menu ////////////////////

 	$('.icon-menu').click(function() {
	
        $('.icon-menu-contents').animate({left: '0'});
            
         $('body').animate({left: '13.3%'});
 		
    });
	
	 $('.icon-menu-closebtn').click(function() {
			
		$('.icon-menu-contents').animate( {left: '-13.3%'});
				
 		$('body').animate( {left: '0'});
 	});



	/////////////// JavaScript for the Hamburger Menu items ////////////////////	
	
	/* set of javascript events for home option in the hamburger menu */
	$('#icon-menu-home').mouseenter(function() {
		$('#icon-menu-home').addClass('icon-menu-home');
	});

	$('#icon-menu-home').click(function() {
		location.href = "/";
	});
	
	$('#icon-menu-home').mouseleave(function() {
		$('#icon-menu-home').removeClass('icon-menu-home');
	});
	
	
	/* set of javascript events for history option in the hamburger menu */
	$('#icon-menu-history').mouseenter(function() {
		$('#icon-menu-history').addClass('icon-menu-history');
	});

	$('#icon-menu-history').click(function() {
		location.href = "/placeholder";
	});

	$('#icon-menu-history').mouseleave(function() {
		$('#icon-menu-history').removeClass('icon-menu-history');
	});

	
	/* set of javascript events for profile option in the hamburger menu */
	$('#icon-menu-profile').mouseenter(function() {
		$('#icon-menu-profile').addClass('icon-menu-profile');
	});

	$('#icon-menu-profile').click(function() {
		location.href = "/placeholder";
	});

	$('#icon-menu-profile').mouseleave(function() {
		$('#icon-menu-profile').removeClass('icon-menu-profile');
	});

	
	/* set of javascript events for settings option in the hamburger menu */	
	$('#icon-menu-settings').mouseenter(function() {
		$('#icon-menu-settings').addClass('icon-menu-settings');
	});

	$('#icon-menu-settings').click(function() {
		location.href = "/placeholder";
	});
	
	$('#icon-menu-settings').mouseleave(function() {
		$('#icon-menu-settings').removeClass('icon-menu-settings');
	});


	/////////////// JavaScript for the Posting Log entries ////////////////////
 

	$('.post-button').click(function() {
	var descriptionPlaceholder = "description of activity";
	var timePlaceholder = "_:_ _ - _:_ _";

	// getting values from the input boxes	
	var startTime = $('#start-time').val();
	var endTime = $('#end-time').val();
	var logDescription = $('.log-description').val();
	var startTimeNoMeridian;
	var endTimeNoMeridian; 
	
	var condition1 = startTime.length > 0 && endTime.length > 0 && logDescription.length > 0;
	var condition2 = logDescription != descriptionPlaceholder;
	
	// testing conditions to see if the input boxes were filled
	if (condition1 && condition2) {

		// variables to get first two numbers in the start and end time
		var startHour = startTime.substring(0, 2);
		var endHour = endTime.substring(0, 2);

		var NOON = 12; 			// var to refer to NOON for readability
		// converting start time to meridian format
		if (startHour > NOON) {
			startHour = startHour - NOON;
			startTimeNoMeridian = (startHour + NOON) + startTime.substring(2);
			startTime = startHour + startTime.substring(2) + " PM";
			startTimeNoMeridian = startTimeNoMeridian + ':00';
		}
		else {
			if (startHour == 0) {
				startHour = 12;
				startTime = startHour + startTime.substring(2);
			}
			startTimeNoMeridian = startTime + ':00';
			startTime = startTime + " AM";
		}

		// converting end time to meridian format
		if (endHour > NOON) {
			endHour = endHour - NOON;
			endTimeNoMeridian = (endHour + NOON) + endTime.substring(2);
			endTime = endHour + endTime.substring(2) + " PM";
			endTimeNoMeridian = endTimeNoMeridian + ':00';
		}
		else {
			if (endHour == 0) {
				endHour = 12;
				endTime = endHour + endTime.substring(2);
			}
			endTimeNoMeridian = endTime + ':00';
			endTime = endTime + " AM";
		}

		// setting to null so placeholder comes back in 
		$('.log-description').val("");

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
		
		if (diffMin < 10) {
			diffMin = "0" + diffMin;
		}

		elapsedTime = diffHour + ":" + diffMin;

		// creating a new log entry to push to data.json
		var newLog = {
			year: Logyear.toString(),
      		month: Logmonth,
      		date: Logdate,
      		type: "Work",
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
        success: function(res) {
          // ga('send', 'event', 'View', 'changed', 'Exit add-post: success');
          location.href="./Log";
        },
        error: function(err) {
          //Materialize.toast("Error while submitting post!", 5000);
          console.log(err);
        }
      	}); 

      	$.ajax({
      		type: "POST",
      		url: "/readUpdate",
      		async: true
      	});
	}	
	}); 

	// block of code to make sure that handles page overflow 
	/* var sizeCondition =;
	if (sizeCondition) {
		$('.log-list-container').addClass('.log-list-container-full');
	} */
};

$(document).ready(main);

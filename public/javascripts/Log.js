var main = function() {

 	$('.icon-menu').click(function() {
	
        $('.icon-menu-contents').animate({left: '0'});
            
         $('body').animate({left: '13.3%'});
 		
    });
	
	 $('.icon-menu-closebtn').click(function() {
			
		$('.icon-menu-contents').animate( {left: '-13.3%'});
				
 		$('body').animate( {left: '0'});
 	});
	
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
 
	$('.post-button').click(function() {
	var descriptionPlaceholder = "description of activity";
	var timePlaceholder = "_:_ _ - _:_ _";
	
	var startTime = $('#start-time').val();
	var endTime = $('#end-time').val();
	var logDescription = $('.log-description').val();
	
	var condition1 = startTime.length > 0 && endTime.length > 0 && logDescription.length > 0;
	var condition2 = logDescription != descriptionPlaceholder;
	
	console.log(startTime);
	if (condition1 && condition2) {

		var startHour = startTime.substring(0, 2);
		var endHour = endTime.substring(0, 2);
		var NOON = 12; 
		// converting start time to meridian format
		if (startHour > NOON) {
			startHour = startHour - NOON;
			startTime = startHour + startTime.substring(2) + " PM";
		}
		else {
			startTime = startTime + " AM";
		}
		// converting end time to meridian format
		if (endHour > NOON) {
			endHour = endHour - NOON;
			endTime = endHour + endTime.substring(2) + " PM";
		}
		else {
			endTime = endTime + " AM";
		}

		var logItem = startTime + " - " + endTime + ": " + logDescription; 
		$('.log-description').val("");
		$('<li>').text(logItem).addClass('log-list-style').appendTo('.log-list');
		$('.log-list').addClass('log-list-not-empty');
	}	
	}); 


	/* var sizeCondition =;
	if (sizeCondition) {
		$('.log-list-container').addClass('.log-list-container-full');
	} */
};
$(document).ready(main);
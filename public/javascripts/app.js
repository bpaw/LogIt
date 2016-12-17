var main = function() {
     $('.icon-menu').click(function() {
	
        $('.icon-menu-contents').animate({left: '0'});
            
         $('body').animate({left: '13.3%'});
 		
    });
	
	 $('.icon-menu-closebtn').click(function() {
			
		$('.icon-menu-contents').animate( {left: '-13.3%'});
				
 		$('body').animate( {left: '0'});
 	});
	
	$('#icon-menu-home').mouseenter(function() {
		$('#icon-menu-home').addClass('icon-menu-home');
	});
	
	$('#icon-menu-home').mouseleave(function() {
		$('#icon-menu-home').removeClass('icon-menu-home');
	});
	
	$('#icon-menu-history').mouseenter(function() {
		$('#icon-menu-history').addClass('icon-menu-history');
	});
	
	$('#icon-menu-history').mouseleave(function() {
		$('#icon-menu-history').removeClass('icon-menu-history');
	});
	
	$('#icon-menu-profile').mouseenter(function() {
		$('#icon-menu-profile').addClass('icon-menu-profile');
	});
	
	$('#icon-menu-profile').mouseleave(function() {
		$('#icon-menu-profile').removeClass('icon-menu-profile');
	});
	
	$('#icon-menu-settings').mouseenter(function() {
		$('#icon-menu-settings').addClass('icon-menu-settings');
	});
	
	$('#icon-menu-settings').mouseleave(function() {
		$('#icon-menu-settings').removeClass('icon-menu-settings');
	});
 
	$('.post-button').click(function() {
	var descriptionPlaceholder = "description of activity";
	var timePlaceholder = "_:_ _ - _:_ _";
	
	var logTime = $('.log-time').val();
	var logDescription = $('.log-description').val();
	
	var condition1 = logTime.length > 0 && logDescription.length > 0;
	var condition2 = logTime != timePlaceholder && logDescription != descriptionPlaceholder;
	
	if (condition1 && condition2) {
		var logItem = logTime + ": " + logDescription; 
		$('.log-time').val("_:_ _ - _:_ _");
		$('.log-description').val("description of activity");
		$('<li>').text(logItem).appendTo('.log-list');
		$('.log-list').addClass('log-list-not-empty');
	}	
	}); 
	
	/* var sizeCondition =;
	if (sizeCondition) {
		$('.log-list-container').addClass('.log-list-container-full');
	} */
};

$(document).ready(main);
var main = function() {

	$('.square').mouseenter(function() {
		$('.square').addClass('square-hover');
	});

	$('.square').mouseleave(function() {
		$('.square').removeClass('square-hover');
	});
	
	/* action for clicking on the Red squre (aka logging page) */
	$("#square1").click(function() {
		location.href = "/Log";
	});

	/* action for clicking on the Orange squre (aka logging page) */
	$("#square2").click(function() {
		location.href = "/placeholder";
	});

	/* action for clicking on the Teal squre (aka logging page) */
	$("#square3").click(function() {
		location.href = "/placeholder";
	});

	/* action for clicking on the Last squre (aka logging page) */
	$("#square4").click(function() {
		location.href = "/placeholder";
	});
}

$(document).ready(main);
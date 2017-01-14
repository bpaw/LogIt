var main = function() {

	var tutorial1 = document.querySelector('#greeting');
	var tutorial2 = document.querySelector('#about');
	var tutorial3 = document.querySelector('#prompt');

	var greeting = "Welcome to LogIt.";
	var about = "This is a personalized web application to help track productivity.";
	var prompt = "Click on the button below to get started.";	
	var pause = " ";
	
	var chars = greeting.split("");
	var chars2 = about.split("");
	var chars3 = prompt.split("");
	var pauseChar = pause.split("");

	var i = 0;
	var j = 0;
	var h = 0;
	var p1 = 0;
	var p2 = 0;

	// first line of animation
	var animation1 = setInterval(function() {
		tutorial1.innerHTML += chars[i];
		i++;
		if (i == greeting.length) {
			
			// terminate first line of animation
			clearInterval(animation1);

			// pause between animations
			var pauseInterval1 = setInterval(function() {
				tutorial1.innerHTML += pauseChar[p1];
				p1++;
				if (p1 == pauseChar.length) {
					clearInterval(pauseInterval1);
				}
				// second line of animation
				var animation2 = setInterval(function() {
					tutorial2.innerHTML += chars2[j];
					j++;
					if (j == about.length) {

						// terminate second line of animation
						clearInterval(animation2);

						var pauseInterval2 = setInterval(function() {
							tutorial1.innerHTML += pauseChar[p2];
							p2++;
							if (p2 == pauseChar.length) {
								clearInterval(pauseInterval2);
							}
						
							// third line of animation
							var animation3 = setInterval(function() {
								tutorial3.innerHTML += chars3[h];
								h++;
								if (h == prompt.length) {
									$('.arrow-down-red').addClass('fa fa-arrow-circle-down arrow-down-red-active');
									
									// terminate third line of animation
									clearInterval(animation3);
								}
							}, 40);
						}, 1000);

					}

				}, 35);

			}, 1000);
		}
	}, 50);

	/*
	var i2 = 0;
	var animation2 = setInterval(function() {
		tutorial.innerHTML += chars2[i2];
		i2++;
		if (i2 == about.length) {
			clearInterval(animation2);
		}
	}, 100);*/

	$('#webpageName').click(function() {
		location.href = '/'
	});

	$('.square').mouseenter(function() {
		$(this).addClass('square-hover');
	});

	$('.square').mouseleave(function() {
		$(this).removeClass('square-hover');
	});
	
	$("#square1").mouseenter(function() {
		$(this).children(".fa").addClass('fa-book fa-5x');
	});

	$("#square2").mouseenter(function() {
		$(this).children(".fa").addClass('fa-bar-chart fa-5x');
	});

	$("#square3").mouseenter(function() {
		$(this).children(".fa").addClass('fa-calendar fa-5x');
	});

	$("#square4").mouseenter(function() {
		$(this).children(".fa").addClass('fa-list fa-5x');
	});


	$("#square1").mouseleave(function() {
		$(this).children('.fa').removeClass('fa-book fa-5x');
	});


	$("#square2").mouseleave(function() {
		$(this).children('.fa').removeClass('fa-bar-chart fa-5x');
	});


	$("#square3").mouseleave(function() {
		$(this).children('.fa').removeClass('fa-calendar fa-5x');
	});


	$("#square4").mouseleave(function() {
		$(this).children('.fa').removeClass('fa-list fa-5x');
	});

	/* action for clicking on the Red squre (aka logging page) */
	$("#square1").click(function() {
		location.href = "/Log";
	});

	/* action for clicking on the Orange squre (aka logging page) */
	$("#square2").click(function() {
		location.href = "/statistics";
	});

	/* action for clicking on the Teal squre (aka logging page) */
	$("#square3").click(function() {
		location.href = "/calendar";
	});

	/* action for clicking on the Last squre (aka logging page) */
	$("#square4").click(function() {
		location.href = "/checklist";
	});
}

$(document).ready(main);
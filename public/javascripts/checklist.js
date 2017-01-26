var main = function() {

    var check_flag = 0;

    $('#menu-home').click(function() {
        location.href = "/";
    });

    $('#menu-journal').click(function() {
        location.href = "/Log";
    });

    $('#menu-stats').click(function() {
        location.href = "/statistics";
    });

    $('#menu-cal').click(function() {
        location.href = "/calendar";
    });

    $(".checklist-generator-button-cancel").click(function() {
        $('.input-checklist').val("");
    });

    $(".checklist-generator-button-post").click(function() {

        var check_month = $('#input-month').val();
        var check_day = $('#input-day').val();
        var check_year = $('#input-year').val();
        var check_task = $('#input-task').val();
        var check_time = $('#input-time').val();

        var fields_filled = check_month != "" && check_day != "" && check_year != "" && check_task != "";
        if (fields_filled) {
            // alert("all fields filled good job");

            var checkObj = {
                year: check_year,
                month: check_month,
                day: check_day,
                task: check_task,
                start: check_time,
                completed: "false"
            }

            $.ajax({
                type: "POST",
                data: checkObj,
                url: "/addNewChecklistItem"
            }).done(function() {
                location.href = '/checklist';
            });
        } 
    });


    $('li').mouseenter(function() {
        $(this).children().children('.pencil').addClass('fa fa-pencil');
        $(this).children().children('.trash').addClass("fa fa-trash-o");
    });

    $('li').mouseleave(function() {
        $(this).children().children('.pencil').removeClass('fa fa-pencil');
        $(this).children().children('.trash').removeClass("fa fa-trash-o");
    });

    $('.pencil').click(function() {
        alert("clicking on pencil");
    });

    $('.trash').click(function() {

        var grandparent = $(this).parent().parent().parent();

        
        while (grandparent.prev().attr('class') != "checklist-subheader") {
            grandparent = grandparent.prev();
        }

        console.error(grandparent.prev());

        var date = grandparent.prev().text().trim();

        alert(date);

        var date_length = date.length;
        var year_offset = date.length - 4;
        var day_offset = date.length - 7;
        
        var check_year = date.substring(year_offset, date_length).trim();
        var check_day = date.substring(day_offset, year_offset).trim();
        var check_month = date.substring(0, day_offset).trim();
        var check_task = $(this).parent().parent().children('.check-description').text().trim();
        var check_time = $(this).parent().parent().children('.check-start').text().trim();

        /*
        alert(check_month);
        alert(check_day);
        alert(check_year);
        alert(check_time);
        alert(check_task);
        */

        var checkObj = {
            year: check_year,
            month: check_month,
            day: check_day,
            task: check_task,
            start: check_time,
            completed: "false"
        }

        $.ajax({
            type: "POST",
            data: checkObj,
            url: "/deleteChecklistItem"
        }).done(function() {
            location.href = '/checklist';
        });

        alert("clicking on trash");
    });

    $('.fa').click(function() {
        
        var start_time = $(this).parent().children('.check-start').text().trim();
        var description = $(this).parent().children('.check-description').text().trim();
        
        //console.error($(this).parent().parent().closest('.checklist-subheader'));
        
        var grandparent = $(this).parent().parent();

        console.error(grandparent);
        console.error(grandparent.prev());
        console.error(grandparent.prev().prev().attr('class'));
        
        while (grandparent.prev().attr('class') != "checklist-subheader") {
            grandparent = grandparent.prev();
        }

        var date_string = grandparent.prev().text().trim();

        // alert(date_string);
        var offset_year = date_string.length - 4;
        var offset_day = date_string.length - 7;
        var offset_month = date_string.length - 8;

        var year = date_string.substring(offset_year, offset_year + 4).trim();
        var month = date_string.substring(0, offset_month).trim();
        var day = date_string.substring(offset_day, offset_day + 2).trim(); 

        if ($(this).hasClass('fa-square-o')) {
            $(this).addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o');
            $(this).parent().children('.check-description').addClass('task-complete');
            $(this).parent().children('.check-start').addClass('task-complete');

            var status = {
                completed: "true",
                start: start_time,
                description: description,
                year: year,
                month: month,
                day: day
            }

            // write change to file - make task.completed = true
            $.ajax({
                type: "POST",
                url: "/changeIcon",
                data: status
            });
        }
        else {
            $(this).addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o');
            $(this).parent().children('.check-description').removeClass('task-complete');
            $(this).parent().children('.check-start').removeClass('task-complete');
            
            var status = {
                completed: "false",
                start: start_time,
                description: description,
                year: year,
                month: month,
                day: day
            }

            // write change to file - make task.completed = false
            $.ajax({
                type: "POST",
                url: "/changeIcon",
                data: status
            });
        }
    });
}

$(document).ready(main);
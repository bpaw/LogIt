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


    $('li:not(.unhoverable)').mouseenter(function() {
        $(this).children().children('.pencil').addClass('fa fa-pencil');
        $(this).children().children('.trash').addClass("fa fa-trash-o");
    });

    $('li').mouseleave(function() {
        $(this).children().children('.pencil').removeClass('fa fa-pencil');
        $(this).children().children('.trash').removeClass("fa fa-trash-o");
    });

    $('.edit-button').click(function() {

        var check_task = $(this).parent().children('.check-description').text().trim();
        var check_time = $(this).parent().children('.check-start').text().trim();

        var startDiv = document.createElement('div');
        startDiv.className = 'edit-start-container';

        // "edit mode" - take off other buttons 
        $('li').children('.trash-button').remove();
        $('li').children('.edit-button').children('.pencil').remove();
        
        // add new buttons for edit mode 
        $(this).parent().children('.check-button').html('<i class="fa fa-check" aria-hidden="true"></i>');
        $(this).parent().children('.x-button').html('<i class="fa fa-times" aria-hidden="true"></i>');

        // change format of li-time
        $(this).parent().children('.check-start').html("");
        $('.check-start').append(startDiv);

        // change the log data
        $(this).parent().children('.check-start').children('.edit-start-container').html('<input type="text" id="edit-start"/>'); 

        $(this).parent().children('.check-description').html('<input type="text" id="edit-desc"/>');
        // TODO

        // "edit mode" buttons
        // new input boxes for edit mode
        // check if any of the boxes were edited

        var grandparent = $(this).parent().parent();

        
        while (grandparent.prev().attr('class') != "checklist-subheader") {
            grandparent = grandparent.prev();
        }

        console.error(grandparent.prev());

        var date = grandparent.prev().text().trim();

        var date_length = date.length;
        var year_offset = date.length - 4;
        var day_offset = date.length - 7;
        
        var check_year = date.substring(year_offset, date_length).trim();
        var check_day = date.substring(day_offset, year_offset).trim();
        var check_month = date.substring(0, day_offset).trim();

        console.error($(this).parent().children('.check-start'));

        var checkObj = {
            year: check_year,
            month: check_month,
            day: check_day,
            task: check_task,
            start: check_time,
            completed: "false",
            updatedDesc: "",
            updatedStart: ""
        }
        
        ///// Event listeners /////

        // for editing the start time of a log
        $('#edit-start').click(function() {
            $(this).parent('.edit-start-container').html('<input type="time" id="edit-start"/>');
            // alert("edit start input");
        });

        // for canceling changes to a log
        $('.x-button').click(function() {
            location.href = "/checklist";
        });

        $('.check-button').click(function() {
            
            var editStart = $('#edit-start').val();
            var editDesc = $('#edit-desc').val();
            
            var oneField = editStart != "" || editDesc != "";

            if (oneField) {

                alert("one field filled. calling ajax");

                if (editStart != "") {
                    checkObj.updatedStart = editStart;
                }

                if (editDesc != "") {
                    checkObj.updatedDesc = editDesc;
                }

                $.ajax({
                    type: "POST",
                    data: checkObj,
                    url: "/editChecklistItem"
                }).done(function() {
                    location.href = '/checklist';
                });
            }
        })
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
    });

    $('.fa').click(function() {
        
        var start_time = $(this).parent().children('.check-start').text().trim();
        var description = $(this).parent().children('.check-description').text().trim();
        
        //console.error($(this).parent().parent().closest('.checklist-subheader'));
        
        var grandparent = $(this).parent().parent();
        //console.error($(this));
        //console.error($(this).parent());
        //console.error($(this).parent().prev());
        //console.error(grandparent);
        //console.error(grandparent.prev());
        //console.error(grandparent.prev().prev().attr('class'));
        
        while (grandparent.prev().attr('class') != "checklist-subheader") {
            grandparent = grandparent.prev();
        }

        var date_string = grandparent.prev().text().trim();

        // alert(date_string);
        var offset_year = date_string.length - 4;
        var offset_day = date_string.length - 7;
        var offset_month = date_string.length - 8;

        var year = date_string.substring(offset_year, offset_year + 4).trim();
        var month = date_string.substring(0, offset_month+1).trim();
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
            console.error("sending data: ");
            console.error(status);
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
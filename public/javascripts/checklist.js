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

        var fields_filled = check_month != "" && check_day != "" && check_year != "" && check_task != "";
        if (fields_filled) {
            alert("all fields filled good job");


        } 
    });

    $('.fa-square-o').click(function() {
        if ($(this).hasClass('fa-square-o')) {
            $(this).addClass('fa-check-square-o');
            $(this).removeClass('fa-square-o');
            $(this).parent().addClass('task-complete');
        }
        else {
            $(this).addClass('fa-square-o');
            $(this).removeClass('fa-check-square-o');
            $(this).parent().removeClass('task-complete');
        }
    });
}

$(document).ready(main);
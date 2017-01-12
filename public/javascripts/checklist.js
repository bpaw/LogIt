var main = function() {

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
}

$(document).ready(main);
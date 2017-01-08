var main = function () {

    var value = $('.bar-options').val();
    var optionObj = {
        option: value
    }

    $.ajax({
        type: "POST",
        url: "/updateStats",
        data: optionObj
    }).done(function (result) {
        console.error(result);
    });

    function drawCharts() {
        
        var jsonData = $.ajax({
            url: '/readStats',
            type: "POST",

        }).done(function(results) {

            console.log(results);
            console.log(results.lineLabels);

            var proArr = results.lineProductive;
            var unproArr = results.lineUnproductive;
            var lineLab = results.lineLabels;
            var barLabs = results.barTypes;
            var barArr = results.barHours;

            var lineData = {
                labels: lineLab,
                datasets: [{
                    label: "Productive",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: proArr,
                    spanGaps: false,
                },
                {
                    label: "Not - Productive",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(239,83,80,0.4)",
                    borderColor: "#ef5350",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "#ef5350",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "#ef5350",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: unproArr,
                    spanGaps: false,
                }]
            };

            var barData = {
                labels: barLabs,
                datasets: [
                {            
                    label: "This week",
                    backgroundColor: ["rgba(75,192,192,0.4)", 
                    "rgba(239,83,80,0.4)",
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(255, 206, 86, 0.4)',
                    'rgba(242, 116, 5, 0.4)',
                    'rgba(153, 102, 255, 0.4)',
                    'rgba(255, 159, 64, 0.4)'
                    ],
                    borderColor: ["rgba(75,192,192,1)", 
                    "rgba(239,83,80,1)",
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(242, 116, 5, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'],
                    data: barArr
                }]
            };
        
            var lineContext = document.getElementById('lineChart');
            var barContext = document.getElementById('barChart');
            var doughnutContext = document.getElementById('doughnutChart');

            var myLineChart = new Chart(lineContext, {
                type: 'line',
                data: lineData
            });

            var myBarChart = new Chart(barContext, {
                type: 'bar',
                data: barData,
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

            var doughnutChart = new Chart(doughnutContext, {
                type: 'doughnut',
                data: barData
            });

        });
    }

    drawCharts();


    /////////////// JavaScript for the Event listeners ////////////////////
    $('.bar-options').change(function () {

        $('#barChart').remove();
        $('.bar-container').append('<canvas id="barChart"></canvas>');

        var field = $(this).children(":selected").text();
        
        field = field.replace(" ", "");
        field = field.replace(" ", "");

        var optionObj = {
            option: field
        }

        $.ajax({
            data: optionObj,
            url: "/updateStats",
            type: "POST"
        }).done(function(result) {
            drawCharts(); 
        });

    });

}

$(document).ready(main);
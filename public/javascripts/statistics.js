var line = document.getElementById('lineChart');
var bar = document.getElementById('barChart')

var lineChart = new Chart(line, {
	type: 'line',
	data: {
    	labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    	datasets: [
        {
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
            data: [2.5, 4, 2.5, 0, 1.5, 3.5, 0],
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
            data: [13.5, 12, 13.5, 16, 14.5, 12.5, 16],
            spanGaps: false,
        }
        ]
	}
});

var barChart = new Chart(bar, {
	type: 'bar',
	data: {
		labels: ["Productive", "Not-Productive", "Daily Routine", "Sleep"],
		datasets: [
		{            
			backgroundColor: ["rgba(75,192,192,0.4)", "rgba(239,83,80,0.4)"],
			borderColor: ["rgba(75,192,192,1)", "rgba(239,83,80,1)"],
			data: [19, 99, 10, 56]
		}]
	}
});
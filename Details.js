var genderData = [
	{
		value: 20,
		color:"#B4D8E7"
	},
	{
		value : 80,
		color : "#FFAEAE"
	}
];

var waitData = {
	labels : ["8pm","9pm","10pm","11pm","12am"],
	datasets : [
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			pointStrokeColor : "#fff",
			data : [5, 10, 50, 40, 10]
		}
	]
}

$(document).ready(function(){
	var genderCtx = document.getElementById("gender_ratio").getContext("2d");
	var genderChart = new Chart(genderCtx).Doughnut(genderData, {animationSteps:70});

	var waitCtx = document.getElementById("wait").getContext("2d");
	var waitChart = new Chart(waitCtx).Line(waitData, {animationSteps:70});
});
/*
Main.js
Version: 1.0.1
Author: Ryder Damen
ryderdamen.com/making-progress
*/

// Global Variables
var hourBar;
var dayBar;
var weekBar;
var monthBar;
var yearBar;

// Page Lifecycle -------------------------------------------------------------------------------------
initializePage();

// Functions -------------------------------------------------------------------------------------
async function initializePage() {
	// First, get things from storage
	await chrome.storage.sync.get(
	[	'mp_showLabels',
		'mp_showPercent',
		'mp_showHour',
		'mp_showDay',
		'mp_showWeek',
		'mp_showMonth',
		'mp_showYear',
		'mp_progressColor',
		'mp_loadLength',
		
	], function (stored) {

		// Handling on first load events
		if (typeof(stored.mp_showHour) == 'undefined') {
			// Show everything by default
			stored.mp_showHour = true;
			stored.mp_showDay = true;
			stored.mp_showWeek = true;
			stored.mp_showMonth = true;
			stored.mp_showYear = true;
		}
		if (stored.mp_progressColor == "" || typeof(stored.mp_progressColor) == 'undefined') {
			stored.mp_progressColor = "#0288D1";
		}
		if (stored.mp_loadLength == "" || typeof(stored.mp_loadLength) == 'undefined') {
			// Set the load length to a default
			stored.mp_loadLength = 1.5;
		}
		
		// Setting up bars
		var standardBarParameters = { // Standard bar parameters (sans overrides)
			strokeWidth: 3,
			easing: 'easeInOut',
			duration: stored.mp_loadLength * 1000,
			color: stored.mp_progressColor,
			trailColor: '#eee',
			trailWidth: 1,
			svgStyle: null,
		};
	
		// Next, set up the bars, and implement any style overrides
		if (stored.mp_showHour) {
			var hourBarParameters = standardBarParameters;
			hourBar = new ProgressBar.Line(hour, hourBarParameters);
		}
		if (stored.mp_showDay) {
			var dayBarParameters = standardBarParameters;
			dayBar = new ProgressBar.Line(day, dayBarParameters);
		}
		if (stored.mp_showWeek) {
			var weekBarParameters = standardBarParameters;
			weekBar = new ProgressBar.Line(week, weekBarParameters);
		}
		if (stored.mp_showMonth) {
			var monthBarParameters = standardBarParameters;
			monthBar = new ProgressBar.Line(month, monthBarParameters);
		}
		if (stored.mp_showYear) {
			var yearBarParameters = standardBarParameters;
			yearBar = new ProgressBar.Line(year, yearBarParameters);
		}

		// Disable labels if appropriate
		if (stored.mp_showLabels === false) {
			document.getElementById('l-hour').style.display = "none";
			document.getElementById('l-day').style.display = "none";
			document.getElementById('l-week').style.display = "none";
			document.getElementById('l-month').style.display = "none";
			document.getElementById('l-year').style.display = "none";
		}

		// Eliminate bar containers if appropriate
		if (!stored.mp_showHour) document.getElementById('c-hour').style.display = "none";
		if (!stored.mp_showDay) document.getElementById('c-day').style.display = "none";
		if (!stored.mp_showWeek) document.getElementById('c-week').style.display = "none";
		if (!stored.mp_showMonth) document.getElementById('c-month').style.display = "none";
		if (!stored.mp_showYear) document.getElementById('c-year').style.display = "none";
		
		// Parse the current time and animate the bars
		parseCurrentDate(false, stored);
	});
}

function parseCurrentDate(recursivelyCalled = false, userOptions) {
	// Get unix timestamps (for maximum resolution)
	var current = new Date(); // Get the current date
	var currentTime = current.getTime() / 1000; // Get the current time
	var startOfYear = new Date(current.getFullYear(), 0, 1, 0, 0, 0).getTime() / 1000;
	var endOfYear = new Date(current.getFullYear(), 11, 31, 23, 59, 59).getTime() / 1000; // Get the end of the year
	var startOfMonth = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0).getTime() / 1000;
	var endOfMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59).getTime() / 1000; // Get the end of this month
	var startOfWeek = new Date(current.getFullYear(), current.getMonth(), current.getDate() - (6 - current.getDay()), 23, 59, 59).getTime() / 1000;;
	var endOfWeek = new Date(current.getFullYear(), current.getMonth(), 6 - current.getDay() + current.getDate(), 23, 59, 59).getTime() / 1000;;
	var startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 0, 0, 0).getTime() / 1000;
	var endOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 23, 59, 59).getTime() / 1000;
	var startOfHour = new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), 0, 0).getTime() / 1000;
	var endOfHour = new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), 59, 59).getTime() / 1000;

	// Calculate percentages
	var percentComplete_year = ((endOfYear - startOfYear) - (endOfYear - currentTime)) / (endOfYear - startOfYear);
	var percentComplete_month = ((endOfMonth - startOfMonth) - (endOfMonth - currentTime)) / (endOfMonth - startOfMonth);
	var percentComplete_week = ((endOfWeek - startOfWeek) - (endOfWeek - currentTime)) / (endOfWeek - startOfWeek);
	var percentComplete_day = ((endOfDay - startOfDay) - (endOfDay - currentTime)) / (endOfDay - startOfDay);
	var percentComplete_hour = ((endOfHour - startOfHour) - (endOfHour - currentTime)) / (endOfHour - startOfHour);


	// Animate Bars
	if (userOptions.mp_showHour) hourBar.animate(percentComplete_hour);
	if (userOptions.mp_showDay) dayBar.animate(percentComplete_day);
	if (userOptions.mp_showWeek) weekBar.animate(percentComplete_week);
	if (userOptions.mp_showMonth) monthBar.animate(percentComplete_month);
	if (userOptions.mp_showYear) yearBar.animate(percentComplete_year);

	// If show the percent is selected
	if (userOptions.mp_showPercent) {

		// Update the text
		if (recursivelyCalled) {
			// Just update the numbers plain and simple
			if (userOptions.mp_showHour) document.getElementById('p-hour').innerHTML = Math.floor(percentComplete_hour * 100);
			if (userOptions.mp_showDay) document.getElementById('p-day').innerHTML = Math.floor(percentComplete_day * 100);
			if (userOptions.mp_showWeek) document.getElementById('p-week').innerHTML = Math.floor(percentComplete_week * 100);
			if (userOptions.mp_showMonth) document.getElementById('p-month').innerHTML = Math.floor(percentComplete_month * 100);
			if (userOptions.mp_showYear) document.getElementById('p-year').innerHTML = Math.floor(percentComplete_year * 100);
		}
		else {
			// Count up to percentages with countUp.js
			var countUpOptions = { useEasing: true,  useGrouping: true,  separator: ',', decimal: '.', };
			if (userOptions.mp_showHour) var cu_hour = new CountUp('p-hour', 0, Math.floor(percentComplete_hour * 100), 0, userOptions.mp_loadLength, countUpOptions).start();
			if (userOptions.mp_showDay) var cu_day = new CountUp('p-day', 0, Math.floor(percentComplete_day * 100), 0, userOptions.mp_loadLength, countUpOptions).start();
			if (userOptions.mp_showWeek) var cu_week = new CountUp('p-week', 0, Math.floor(percentComplete_week * 100), 0, userOptions.mp_loadLength, countUpOptions).start();
			if (userOptions.mp_showMonth) var cu_month = new CountUp('p-month', 0, Math.floor(percentComplete_month * 100), 0, userOptions.mp_loadLength, countUpOptions).start();
			if (userOptions.mp_showYear) var cu_year = new CountUp('p-year', 0, Math.floor(percentComplete_year * 100), 0, userOptions.mp_loadLength, countUpOptions).start();
		}
	}

	// Recursively call every 30 seconds to update, until the script is destroyed
	setTimeout(function(){ parseCurrentDate(true, userOptions); }, 30000);
}




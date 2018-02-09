/*
Options.js
Version: 1.0
Author: Ryder Damen
ryderdamen.com/making-progress
*/

// Circle and Highlighting Functionality -------------------------------------------------------------------------------------

// Global Variables

var standardBarParameters = { // Standard bar parameters (sans overrides)
	strokeWidth: 3,
	easing: 'easeInOut',
	duration: 1500,
	color: '#0288D1',
	trailColor: '#eee',
	trailWidth: 1,
	svgStyle: null,
};

// Next, set up the bars, and implement any style overrides
var hourBarParameters = standardBarParameters;
hourBar = new ProgressBar.Line(hour, hourBarParameters);

var dayBarParameters = standardBarParameters;
dayBar = new ProgressBar.Line(day, dayBarParameters);

var weekBarParameters = standardBarParameters;
weekBar = new ProgressBar.Line(week, weekBarParameters);

var monthBarParameters = standardBarParameters;
monthBar = new ProgressBar.Line(month, monthBarParameters);

var yearBarParameters = standardBarParameters;
yearBar = new ProgressBar.Line(year, yearBarParameters);

// Animate the bars
animateBars();

function animateBars(recursive = false) {
	hourBar.animate(Math.random());
	dayBar.animate(Math.random());
	weekBar.animate(Math.random());
	monthBar.animate(Math.random());
	yearBar.animate(Math.random());

	// Animate recursively
	setTimeout(function(){ animateBars(true); }, 3000);
}
 

// Options Functionality

// Lifecycle
onPageLoad();

// Listener for submit click (since no inline JS is allowed in chrome extensions)
document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        onSubmit();
    });
});


// Functions
function onPageLoad() {
	// When the page is loaded
	// Retrieve variables from storage and write them to the view
	chrome.storage.sync.get(
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
			
			// Handling Undefined Variables

			// Set all bars to display by default
			if (stored.mp_showHour == undefined) {
				stored.mp_showHour = 1;
				stored.mp_showDay = 1;
				stored.mp_showWeek = 1;
				stored.mp_showMonth = 1;
				stored.mp_showYear = 1;
			}

			// Turn off percent by default
			if (stored.mp_showPercent == undefined) {
				stored.mp_showPercent = 0;
			}

			// Turn on show labels by default
			if (stored.mp_showLabels == undefined) {
				stored.mp_showLabels = 1;
			}

			// Set default load length to 1500 by default
			if (stored.mp_loadLength == undefined || stored.mp_loadLength == 0) {
				stored.mp_loadLength = 1.5;
			}
			
			// Set color by default
			if (stored.mp_progressColor == undefined || stored.mp_progressColor == "undefined") {
				stored.mp_progressColor = "#0288D1";
			}
			
			// Setting them in the view
			document.getElementById("showHour").checked = stored.mp_showHour;
			document.getElementById("showDay").checked = stored.mp_showDay;
			document.getElementById("showWeek").checked = stored.mp_showWeek;
			document.getElementById("showMonth").checked = stored.mp_showMonth;
			document.getElementById("showYear").checked = stored.mp_showYear;
			document.getElementById("showLabels").checked = stored.mp_showLabels;
			document.getElementById("showPercent").checked = stored.mp_showPercent;
			document.getElementById("loadLength").value = stored.mp_loadLength;
			document.getElementById("barColorHex").value = stored.mp_progressColor;

	});
}


function onSubmit() {
	// When the submit button is pressed, write the preferences

	var preferences = {
		'showLabels' : document.getElementById("showLabels").checked, 
		'showPercent' : document.getElementById("showPercent").checked, 
		'showHour' : document.getElementById("showHour").checked, 
		'showDay' : document.getElementById("showDay").checked, 
		'showWeek' : document.getElementById("showWeek").checked, 
		'showMonth' : document.getElementById("showMonth").checked, 
		'showYear' : document.getElementById("showYear").checked, 
		'progressColor' : document.getElementById("barColorHex").value, 
		'loadLength' : document.getElementById("loadLength").value, 
	};
	
	writePreferences(preferences);
}

function writePreferences(preferences) {
	// Writes preferences to chrome's storage, and to a javascript temp file
		// Save to chrome sync'd storage
        chrome.storage.sync.set({
	        'mp_showLabels': preferences.showLabels,
			'mp_showPercent': preferences.showPercent,
			'mp_showHour': preferences.showHour,
			'mp_showDay': preferences.showDay,
			'mp_showWeek': preferences.showWeek,
			'mp_showMonth': preferences.showMonth,
			'mp_showYear': preferences.showYear,
			'mp_progressColor': preferences.progressColor,
			'mp_loadLength': preferences.loadLength
	        }, function() {		        
		        $("#submitButton").notify("Got it! Saved!", "success");
	        });	    
}


var foxPrivacyApp = foxPrivacyApp || {};

(function() {

    var checkboxes,
	currentLocation,
	currentValue,
	locationFormDialog;
    
    var getRandomLocation = function() {
	var minLat = -90,
	    maxLat = 90,
	    minLon = 0,
	    maxLon = 180;
	var lat = Math.random()*(maxLat - minLat) + minLat,
	    lon = Math.random()*(maxLon - minLon) + minLon;
	return {
	    lat: lat,
	    lon: lon
	};
    };

    foxPrivacyApp.locationBlur = {
	
	init: function() {
	    var locationBlurForm = document.getElementById('locationBlurSettings');
	    checkboxes = locationBlurForm.getElementsByTagName('input');
	    locationFormDialog = document.getElementById('locationblur-locationpickerdialog');
	    currentValue = this.getCurrentValue();
	    currentLocation = getRandomLocation();
	},
	
	getCurrentLocation : function() {
	    return currentLocation;
	},
	
	getCurrentValue : function() {
	    var value;
	    for(var i in checkboxes) {
		var checkbox = checkboxes.item(i);
		if(checkbox && checkbox.checked) {
		    value = checkbox.value;
		    break;
		}
	    }
	    return value;
	},
	
	setValue : function(value) {
	    for(var i in checkboxes) {
		var checkbox = checkboxes.item(i);
		if(checkbox) {
		    checkbox.checked = checkbox.value == value;
		}
	    }
	},

	setBlurLevel : function(element) {
	
	    var value = element.value;
	    
	    console.log("the setting selected is: " + value);

	    switch (value)
	    {
		case "Off" :
		    currentValue = undefined;
		    console.log('Off');
		    break;
		case "Random" :
		    currentValue = value;
		    console.log('Random');
		    break;
		case "Map":
		    locationFormDialog.style.display = "block";
		    foxPrivacyApp.locationPicker.init();
		    break;
		default:
		    console.log('Unkown value chosen');
		    break;
	    }
	},
	
	setCurrentLocation : function(location) {
	    if(typeof location !== 'undefined') {
		currentLocation = location;
	    }
	},
	
	closeLocationDialog : function() {
	    this.setValue(currentValue);
	    locationFormDialog.style.display = 'none';
	},
	
	confirmLocation : function() {
	    currentValue = 'Map';
	    currentLocation = foxPrivacyApp.locationPicker.getCurrentLocation();
	    console.log('location chosen');
	    locationFormDialog.style.display = 'none';
	}
	
    };
    
})();

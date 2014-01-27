var foxPrivacyApp = foxPrivacyApp || {};

(function() {

    var checkboxes,
	locationBlurForm,
	locationFormDialog;

    foxPrivacyApp.locationBlur = {
	
	init: function() {
	    var locationBlurForm = document.getElementById('locationBlurSettings');
	    checkboxes = locationBlurForm.getElementsByTagName('input');
	    locationFormDialog = document.getElementById('locationblur-locationpickerdialog');
	    this.currentValue = this.getCurrentValue();
	},
	
	currentValue : undefined,
	
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
		case "Exact" :
		    this.currentValue = value;
		    console.log('Exact');
		    break;
		case "City" :
		    this.currentValue = value;
		    console.log('City');
		    break;
		case "Country" :
		    this.currentValue = value;
		    console.log('Country');
		    break;
		case "Random" :
		    this.currentValue = value;
		    console.log('Random');
		    break;
		case "Map":
		    locationFormDialog.style.display = "block";
		    foxPrivacyApp.initLocationPicker();
		    break;
		default:
		    console.log('Unkown value chosen');
		    break;
	    }
	},
	
	closeLocationDialog : function() {
	    this.setValue(this.currentValue);
	    locationFormDialog.style.display = 'none';
	},
	
	setLocation : function() {
	    this.currentValue = 'Map';
	    console.log('location chosen');
	    locationFormDialog.style.display = 'none';
	}
	
    };
    
})();

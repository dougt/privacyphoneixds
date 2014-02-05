var app = app || {};

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

    app.locationBlur = {

        init: function() {
            var locationBlurForm = document.querySelector('.locationBlurSettings');
            checkboxes = locationBlurForm.getElementsByTagName('input');
            for(var i in checkboxes) {
                var checkbox = checkboxes.item(i);
                checkbox.addEventListener('click', app.locationBlur.setBlurLevel);
            }
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

        setBlurLevel : function(event) {

            var value = this.value;

            //console.log("the setting selected is: " + value);

            for(var i in checkboxes) {
                var checkbox = checkboxes.item(i);
                var settingElement = app.settings.findAncestorWithClass(checkbox, 'setting');
                if(checkbox && settingElement) {
                    if(checkbox.checked && settingElement.classList.contains('off')
                        || !checkbox.checked && settingElement.classList.contains('on')) {
                        app.settings.toggleSetting(checkbox);
                    }
                }
            }

            switch (value)
            {
                case "Off" :
                    currentValue = undefined;
                    //console.log('Off');
                    break;
                case "Random" :
                    currentValue = value;
                    //console.log('Random');
                    break;
                case "Map":
                    locationFormDialog.style.display = "block";
                    app.locationPicker.init();
                    break;
                case "Country":
                    //console.log('do sth');
                    break;
                default:
                    console.log('Unknown value chosen');
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
            currentLocation = app.locationPicker.getCurrentLocation();
            console.log('location chosen');
            locationFormDialog.style.display = 'none';
        }

    };

})();

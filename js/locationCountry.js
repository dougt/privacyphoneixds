var app = app || {};

(function() {

	var countries =
	[
		{'country': 'Spain', 'lat': 40.0000, 'lon': -4.00000 },
		{'country': 'Germany', 'lat': 51.0000, 'lon': 9.0000 },
		{'country': 'United Kingdom', 'lat': 54.00000, 'lon': -2.0000 },
		{'country': 'United States', 'lat': 38.0000, 'lon': -97.0000 },
		{'country': 'Australia', 'lat': -35.28, 'lon': 149.13 },
		{'country': 'Belarus', 'lat': 53.90, 'lon':  27.57},	
		{'country': 'Greece', 'lat': 37.98, 'lon':  23.72},		
		{'country': 'Peru', 'lat': -12.04, 'lon':  -77.03}
	];

	var appListElementSelector = '.guest-mode-app-list';

    var handleSelectedValue = function() {
        var country = countries[this.value];
        var value = country.country;
        var action = this.getAttribute('data-action');
        app.handleSetting(action, value);
    };

	app.locationCountry =
	{
        init : function()
        {
            // register the toggle for the country selection

            var mapRadioButtons = document.getElementsByClassName('LocMapPick');
            if(mapRadioButtons.length != 0)
            {
                for(var i = 0; i < mapRadioButtons.length; i++)
                {
                    mapRadioButtons[i].addEventListener('click', function()
                    {
                        app.locationCountry.enableCountrySelect();
                    }, false);
                }
            }

            // build list of countries, add to html

            var countrySelect = "<span class='button icon icon-dialog select-dirty-hack'><select data-action='locationblur-countryselect' name='country' class='LocationCountryPicker invisibility-hack'>Select a country";

            for(var i = 0; i < countries.length; i++)
            {
                countrySelect += '<option name="Country" value="' + i + '">' + countries[i].country + '</option>';
            }

            countrySelect += '</select></span>';

            var countrySelections = document.getElementsByClassName('countrySelectContainer');
            if(countrySelections.length != 0)
            {
                for(var i = 0; i < countrySelections.length; i++)
                {
                    var countrySelectContainer = countrySelections[i];
                    countrySelectContainer.innerHTML = countrySelect;
                    var selectWidget = countrySelectContainer.querySelector('select');
                    selectWidget.onchange = handleSelectedValue;
                    selectWidget.onclick = function() {
                        this.style.opacity = 1;
                    };
                }
            }

        },

        // toggle on

        disableCountrySelect : function()
        {
        	var selectCountry = document.getElementsByClassName('LocationCountryPicker');
            if(selectCountry.length != 0)
            {
                for(var i = 0; i < selectCountry.length; i++)
                {
                    //selectCountry[i].disabled = true;
                    //selectCountry[i].classList.add('disabled');
                    //selectCountry[i].parentNode.classList.add('disabled');
                }
            }
        },

        // toggle off

        enableCountrySelect : function()
        {
        	var selectCountry = document.getElementsByClassName('LocationCountryPicker');
            if(selectCountry.length != 0)
            {
                for(var i = 0; i < selectCountry.length; i++)
                {
                    //selectCountry[i].disabled = false;
                    //selectCountry[i].classList.remove('disabled');
                    //selectCountry[i].parentNode.classList.add('disabled');
                }
            }
        }
    };

})();

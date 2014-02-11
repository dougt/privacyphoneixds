var app = app || {};
var ListOfApps = new Array();
var Latitude;
var Longitude;
'use strict';
(function() {
    /* 
     * Define actions here according to the action string that is passed as actionName and a value.
     * "Target" is only used for "secondary" toggles, and will be undefined for "primary" toggles.
     * */
    app.handleSetting = function(actionName, value, target, callback) {

        console.log('action: ' + actionName);
        console.log('value : ' + value);
        if(target != undefined) {
            console.log('target: ' + target);
        }

        if(actionName == 'guestmode-toggleapp'){
            if (value==false){
                if(ListOfApps.indexOf(target)<0){
                    ListOfApps.push(target);
                }
            }else{
                var index = ListOfApps.indexOf(target);
                console.log('INDEX:      '+index);
                if(index>=0){
                    ListOfApps.splice(index,1);
                }
            }
            var settings = window.navigator.mozSettings;
            if (!settings) {
                console.log('no settings');
                return;
            }
            var reqList = settings.createLock().set({'kidmode.list': ListOfApps});
            reqList.onsuccess = function() {
                var isBluetoothEnabled = reqList.result['kidmode.enabled'];
                console.log('List Set');
            };
            console.log('LIST OF APPS:        '+ListOfApps);
        }
        if(actionName == 'locationblur-precision'){
           var settings = window.navigator.mozSettings;
           if (!settings) {
              console.log('no settings');
              return;
           }
           if (value != 'Country')
           	var reqList = settings.createLock().set({'location': value});
           reqList.onsuccess = function() {
               console.log('Logitude Set');
           };
           console.log(actionName+'FUNCTION WORKS:'+value);
        }
        if(actionName == 'locationblur-countryselect'){
           var settings = window.navigator.mozSettings;
           if (!settings) {
             console.log('no settings');
             return;
           }
           //console.log('COUNTRY        LONG'+Longitude+'     LAT'+Latitude);
           var reqList = settings.createLock().set({'location.lon': value});
           reqList.onsuccess = function() {
             console.log('Country Set to :'+value);
           };
           console.log(actionName+'   FUNCTION WORKS:   '+value);
        }
        
        
        if(typeof callback === 'function') {
            callback();
        }
    };

})();

var foxPrivacyApp = foxPrivacyApp || {};
var ListOfApps = new Array();
'use strict';
(function() {
    /* 
     * Define actions here according to the action string that is passed as actionName and a value.
     * "Target" is only used for "secondary" toggles, and will be undefined for "primary" toggles.
     * */
    foxPrivacyApp.handleSetting = function(actionName, value, target, callback) {

        console.log('actionName: ' + actionName);
	console.log('value : ' + value);
	console.log('target: ' + target);
	
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
 	if(actionName == 'guestmode-toggle'){
 		/*var settings = window.navigator.mozSettings;
 		if (!settings) {
 			console.log('no settings');
   			return;
 		}
 		var reqEnabled = settings.createLock().get('kidmode.enabled');
    	reqEnabled.onsuccess = function() {
    		  var isBluetoothEnabled = reqEnabled.result['kidmode.enabled'];
      		  console.log('AAAAAAAAA: '+isBluetoothEnabled);
   		 };
   		var req = settings.createLock().set({'kidmode.enabled': value});
    	req.onsuccess = function() {
    		  var isBluetoothEnabled = req.result['kidmode.enabled'];
      		  console.log('SET: '+isBluetoothEnabled);
   		 };*/
		console.log(actionName+'FUNCTION WORKS:'+value);
 	}
	
	if(typeof callback === 'function') {
	    callback();
	}
    };

})();

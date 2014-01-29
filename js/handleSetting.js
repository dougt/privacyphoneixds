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
 		console.log('LIST OF APPS:        '+ListOfApps);
 	}
 	if(actionName == 'guestmode-toggle'){
 		var settings = window.navigator.mozSettings;
 		if (!settings) {
 			console.log('no settings');
   			return;
 		}
 		var reqEnabled = settings.createLock().get('bluetooth.enabled');
    	reqEnabled.onsuccess = function() {
    		  var isBluetoothEnabled = reqEnabled.result['bluetooth.enabled'];
      		  console.log('AAAAAAAAA: '+isBluetoothEnabled);
   		 };
   		 
   		var req = settings.createLock().set({'bluetooth.enabled': value});
    	req.onsuccess = function() {
    		  var isBluetoothEnabled = reqEnabled.result['bluetooth.enabled'];
      		  console.log('SET: '+isBluetoothEnabled);
   		 };
 	
 	
	/*	console.log('In guest mode');
		var settings = window.navigator.mozSettings;
		console.log('window navigator mozSettings');
		
		var lock = settings.createLock();
		console.log('settings createLock');
		
		var req = lock.set({'wifi.enabled': true});
		console.log('Set Works');
		
		req.onsuccess = function bt_EnabledSuccess() {
      		console.log('BT on');
    	};
   	 	req.onerror = function bt_EnabledOnerror() {
     		console.log('BT off');
   		 };*/
		console.log(actionName+'FUNCTION WORKS:'+value);
 	}
	
	if(typeof callback === 'function') {
	    callback();
	}
    };

})();

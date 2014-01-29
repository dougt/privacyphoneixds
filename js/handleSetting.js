var foxPrivacyApp = foxPrivacyApp || {};

(function() {
    /* 
     * Define actions here according to the action string that is passed as actionName and a value.
     * "Target" is only used for "secondary" toggles, and will be undefined for "primary" toggles.
     * */
    foxPrivacyApp.handleSetting = function(actionName, value, target, callback) {

        console.log('actionName: ' + actionName);
	console.log('value : ' + value);
	console.log('target: ' + target);
	
	if((actionName == 'guestmode-togglefeature')&&(value==false)){
 		if(ListOfApps.indexOf(target)<0){
 			ListOfApps += ('\''+target+'\',');
 		}
 		console.log(ListOfApps);
 	}
 	if(actionName == 'guestmode-toggle'){
		console.log('In guest mode');
		var settings = window.navigator.mozSettings;
		console.log('window.navigator.mozSettings');
		var req = settings.createLock().get('bluetooth.enabled');
		/*console.log('Lock Works');*/
		req.onsuccess = function bt_EnabledSuccess() {
      		console.log('BT on');
    	};
   	 	req.onerror = function bt_EnabledOnerror() {
     		console.log('BT off');
   		 };
		console.log(actionName+'FUNCTION WORKS:'+value);
  		if (!settings) {
   		return;
 		}
 	}
	
	if(typeof callback === 'function') {
	    callback();
	}
    };

})();

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
	
	if(typeof callback === 'function') {
	    callback();
	}
    };

})();

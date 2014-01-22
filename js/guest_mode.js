var foxPrivacyApp = foxPrivacyApp || {};

(function() {
    
    var appListElementId = 'guest-mode-app-list',
	appMgr = navigator.mozApps.mgmt,
	hidden_roles =  ['system', 'keyboard', 'homescreen']
	;	

    foxPrivacyApp.insertAppList = function(callback) {
	var listElement = document.getElementById(appListElementId);
	if(!appMgr) {
	    console.log('App manager not found. Are you using Firefox OS?');
	    if(typeof callback === 'function') {
		callback();
	    }
	}
	var listHtml = '';
	appMgr.getAll().onsuccess = function onsuccess(event) {
	    var apps = event.target.result;
	    apps.sort(function(a,b){
		return (a.manifest.name < b.manifest.name)? -1 : 1;
	    });
	    var i = 0;
	    apps.forEach(function eachApp(app) {
		if (hidden_roles.indexOf(app.manifest.role) == -1
		    && app.manifest.name != 'Fox Privacy') {
		    listHtml +=
			'<li class="setting app-' + i + ' on">' +
			    '<div class="topic-switch">' +
				'<span class="title">' + app.manifest.name + '</span>' +
				'<div class="setting-toggle"><div></div></div>' +
			    '</div>' +
			'</li>'
		    ;
		    i++;
		}
	    });
	    if(listElement) {
		listElement.innerHTML = listHtml;
	    }
	    if(typeof callback === 'function') {
		callback();
	    }
	};
    };
})();

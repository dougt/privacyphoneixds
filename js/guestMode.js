var app = app || {};

(function() {
    
    var appListElementSelector = '.guest-mode-app-list',
	appMgr = typeof navigator.mozApps !== 'undefined' ? navigator.mozApps.mgmt : undefined,
	hidden_roles =  ['system', 'keyboard', 'homescreen', 'input', 'search' ]
	;	

    app.insertAppList = function(callback) {
        if(!appMgr) {
            console.log('App manager not found. Are you using Firefox OS?');
            if(typeof callback === 'function') {
                callback();
            }
            return;
        }
        var listElements = document.querySelectorAll(appListElementSelector);
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
                    '<li class="setting guestmode-appswitch app-' + i + ' on">' +
                        '<div class="topic-switch">' +
                        '<span class="title">' + app.manifest.name + '</span>' +
                        '<div class="setting-toggle" data-action="guestmode-toggleapp" data-target="' + app.manifest.name + '"><div></div></div>' +
                        '</div>' +
                    '</li>'
                    ;
                    i++;
                }
            });
            if(listElements) {
                for(var index in listElements) {
                    var listElement = listElements.item(index);
                    listElement.innerHTML = listHtml;
                }
            }
            if(typeof callback === 'function') {
                callback();
            }
        };
    };
})();

var app = app || {};

(function() {
    var currentTab = 0;
    app.permissionsHistory = {
        init: function() {
            var toggleTriggers = document.querySelectorAll('.tabbed header .tab');
            for(var i in toggleTriggers) {
                var elem = toggleTriggers.item(i);
                elem.addEventListener('click', app.permissionsHistory.toggleTab);
            }
        },
        toggleTab : function() {
            var elem = this;
            var rootElem = app.settings.findAncestorWithClass(elem, 'tabbed');
            var index = elem.getAttribute('data-tab');
            if(rootElem) {
                var elements = rootElem.querySelectorAll('.tab');
                for(var i in elements) {
                    var element = elements.item(i);
                    if(element.classList.contains('tab-' + index)) {
                        element.classList.add('selected');
                    }
                    else {
                        element.classList.remove('selected');
                    }
                }
            }
        }
    };
})();

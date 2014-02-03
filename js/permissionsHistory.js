var app = app || {};

(function() {
    var currentTab = 0;
    app.permissionsHistory = {
        toggleTab : function(elem, index) {
            var rootElem = app.settings.findAncestorWithClass(elem, 'tabbed');
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

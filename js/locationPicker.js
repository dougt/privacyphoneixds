var app = app || {};

(function() {
    
    var currentLocation,
        marker;
    
    app.locationPicker = {
        
        init : function() {
        
            if(typeof google !== 'undefined') {
                
                currentLocation = app.locationBlur.getCurrentLocation();
                var center = typeof currentLocation !== 'undefined' ? new google.maps.LatLng(currentLocation.lat, currentLocation.lon) : new google.maps.LatLng(59.32522, 18.07002);
                var map;

                var mapOptions = {
                    zoom: 2,
                    center: center
                };

                map = new google.maps.Map(document.getElementById('locationblur-locationpicker'), mapOptions);

                marker = new google.maps.Marker({
                    map:map,
                    draggable:true,
                    animation: google.maps.Animation.DROP,
                    position: center
                });
                
                var toggleBounce = function() {

                    if (marker.getAnimation() != null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                    }
                };

                google.maps.event.addListener(marker, 'click', toggleBounce);
            }
            
            else {
                console.log('It looks like the Google Maps API could not be loaded');
            }
        },
        
        getCurrentLocation : function () {
            var position = marker.getPosition();
            return {
                lat: position.lat(),
                lon: position.lng()
            };
        }
        
    };

})();

var foxPrivacyApp = foxPrivacyApp || {};

(function() {
    
    foxPrivacyApp.initLocationPicker = function() {
        
        if(typeof google !== 'undefined') {

            var stockholm = new google.maps.LatLng(59.32522, 18.07002);
            var parliament = new google.maps.LatLng(59.327383, 18.06747);
            var marker;
            var map;

            var mapOptions = {
                zoom: 13,
                center: stockholm
            };

            map = new google.maps.Map(document.getElementById('locationblur-locationpicker'), mapOptions);

            marker = new google.maps.Marker({
                map:map,
                draggable:true,
                animation: google.maps.Animation.DROP,
                position: parliament
            });

            function toggleBounce() {

                if (marker.getAnimation() != null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            google.maps.event.addListener(marker, 'click', toggleBounce);

        }
        
        else {
            console.log('It looks like the Google Maps API could not be loaded');
        }
        
    };

})();

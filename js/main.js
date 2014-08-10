(function(){
    var initialize = function(places) {
        var mapOptions = {
            center: new google.maps.LatLng(37.5446509602, 104.1075355397),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

        var geocoder = new google.maps.Geocoder();
        places.forEach(function(place, index) {
            geocoder.geocode({address: place.name}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                        position: results[0].geometry.location,
                        animation: google.maps.Animation.DROP
                    });
                    setTimeout(function() {
                        marker.setMap(map);
                    }, 1000 + 300*index);
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        });
    }


    $.ajax({
        url: 'data.json',
        complete: function(data){
            initialize(eval(data.responseText));
        }
    });


})();


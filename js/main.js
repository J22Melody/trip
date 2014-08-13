(function(){

    var map,
        places;

    var hide_markers = [];
    window.hide_paths = [];

    var $intro = $('.intro-content');
    var $intro_bottom = $('.intro-bottom');

    var init_map = function() {
        var mapOptions = {
            center: new google.maps.LatLng(39.5446509602, 104.1075355397),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        google.maps.event.addListener(map, 'zoom_changed', function() {
            var zoomLevel = map.getZoom();
            if (zoomLevel > 4) {
                hide_markers.forEach(function(marker){
                    marker.setMap(map);
                });
            } else {
                hide_markers.forEach(function(marker){
                    marker.setMap(null);
                });
            }
            if (zoomLevel > 5) {
                hide_paths.forEach(function(path){
                    path.setMap(map);
                });
            } else {
                hide_paths.forEach(function(path){
                    path.setMap(null);
                });
            }
        });
    };

    var init_place = function() {
        $.ajax({
            url: 'data.json',
            complete: function(data){
                places = eval(data.responseText);
                var geocoder = new google.maps.Geocoder();

                var init = function(places) {
                    places.forEach(function(place) {
//                        if (place.location) {
                            place.location = new google.maps.LatLng(place.location.k, place.location.A);
//                        } else {
//                            geocoder.geocode({address: place.name}, function(results, status) {
//                                if (status === google.maps.GeocoderStatus.OK) {
//                                    place.location = results[0].geometry.location;
//                                } else {
//                                    console.log("Geocode was not successful for the following reason: " + status);
//                                }
//                            });
//                        }

                        if (place.children) {
                            init(place.children);
                        }
                    });
                }

                init(places);
                init_path();
            }
        });
    };

    var init_path = function() {
        var directionsService = new google.maps.DirectionsService();

        places.forEach(function(place){
            if(place.children && place.children.length){
                place.children.forEach(function(child, index){
                    if (index === place.children.length-1) return;
                    var directionsDisplay = new google.maps.DirectionsRenderer();
                    directionsDisplay.setOptions({suppressMarkers: true, preserveViewport: true});
                    var start = child.name;
                    var end = place.children[index+1].name;
                    var request = {
                        origin: start,
                        destination: end,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    directionsService.route(request, function(result, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(result);
                            hide_paths.push(directionsDisplay);
                        }
                    });
                });
            }
        })
    };

    var show_place = function() {
        var show = function(places) {
            places.forEach(function(place, index) {
                if (place.children) {
                    var marker = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: place.location
                    });

                    setTimeout(function(){
                        marker.setMap(map);
                    }, 300*index);

                    show(place.children);
                } else {
                    var marker = new google.maps.Marker({
                        position: place.location,
                        icon: '../img/flag.png'
                    });
                    hide_markers.push(marker);
                }
            });
        }

        show(places);
    };

    var toggle_intro = function() {
        var hide = $intro.data('hide');
        if (hide) {
            $intro.animate({height: '92%'});
        } else {
            $intro.animate({height: '0'});
        }
        $intro_bottom.toggleClass('slide-up');
        $intro.data('hide',!hide);
    };

    $(document).ready(function(){
        init_map();
        init_place();
    });

    $intro_bottom.click(function(){
        if(!$(this).data('clicked')){
            show_place();
            $(this).data('clicked', true);
        }
        toggle_intro();
    });




})();


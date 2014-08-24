(function(){

    var map,
        places;

    var main_markers = [];
    var hide_markers = [];
    var hide_paths = [];

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
            if (zoomLevel > 5) {
                hide_paths.forEach(function(path){
                    path.setMap(map);
                });
                hide_markers.forEach(function(marker){
                    marker.setMap(map);
                });
                main_markers.forEach(function(marker){
                    marker.setMap(null);
                });
            } else {
                hide_paths.forEach(function(path){
                    path.setMap(null);
                });
                hide_markers.forEach(function(marker){
                    marker.setMap(null);
                });
                main_markers.forEach(function(marker){
                    marker.setMap(map);
                });
            }
        });
    };

    var init_place = function() {
        $.ajax({
            url: 'data.json',
            success: function(data){
                places = data.places;

                var init = function(places) {
                    places.forEach(function(place) {
                        place.location = new google.maps.LatLng(place.location.k, place.location.A);

                        if (place.children) {
                            init(place.children);
                        }

                        if (place.paths) {
                            place.paths.forEach(function(path){
                                init_path(path);
                            });
                        }
                    });
                }

                var directionsService = new google.maps.DirectionsService();
                var init_path = function(paths) {
                   var directionsDisplay = new google.maps.DirectionsRenderer();
                   directionsDisplay.setOptions({suppressMarkers: true, preserveViewport: true});
                   var start = paths[0];
                   var end = paths[paths.length - 1];
                   var waypts = [];
                   paths.slice(1, paths.length - 1).forEach(function(point){
                       waypts.push({location: point, stopover:true});
                   });
                   var request = {
                       origin: start,
                       destination: end,
                       travelMode: google.maps.TravelMode.DRIVING,
                       waypoints: waypts
                   };
                   directionsService.route(request, function(result, status) {
                       console.log(result);
                       if (status == google.maps.DirectionsStatus.OK) {
                           directionsDisplay.setDirections(result);
                           directionsDisplay.setMap(map);
                           hide_paths.push(directionsDisplay);
                       }
                   });
                };

                init(places);
            }
        });
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
                    main_markers.push(marker);
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

(function(){

    var map,
        places;

    var $intro = $('#intro');

    var initialize_map = function() {
        var mapOptions = {
            center: new google.maps.LatLng(37.5446509602, 104.1075355397),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    };

    var initialize_place = function() {
        $.ajax({
            url: 'data.json',
            complete: function(data){
                places = eval(data.responseText);

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
                            }, 300*index);
                        } else {
                            console.log("Geocode was not successful for the following reason: " + status);
                        }
                    });
                });
            }
        });
    };

    var toggle_intro = function() {
        var hide = $intro.data('hide');
        if (hide) {
            $intro.animate({height: '95%'});
        } else {
            $intro.animate({height: '26px'});
        }
        $intro.data('hide',!hide);
    };

    $(document).ready(function(){
        initialize_map();
    });

    $('.intro-bottom').click(function(){
        if(!$(this).data('clicked')){
            initialize_place();
            $(this).data('clicked', true);
        }
        toggle_intro();
    });


})();


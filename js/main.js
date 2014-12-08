var places = {
    ceremony: 'ChIJW4kEAm2BcUgRjuT1gv5cMjQ',
    reception: 'ChIJVyYrVWuBcUgRXqedsmf2zJc'
};

var coordinates = {
    ceremony: [51.388581, -2.359496],
    reception: [51.38620, -2.36284]
};

var map;

var hash = window.location.hash.substr(1);

if (hash.length > 0) {
    thanks(hash);
}

function thanks(hash) {
    var msg = document.getElementById(hash);

    if (typeof(msg) != "undefined") {
        msg.style.display = "block";
    }
}

function initialize() {

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(coordinates.ceremony[0], coordinates.ceremony[1]),
        draggable: false,
        scrollwheel: false,
        zoom: 15
    });

    var requests = [{ placeId: places.ceremony }, { placeId: places.reception }];

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    for( var i=0, l=requests.length; i<l; i++ ) {
        service.getDetails(requests[i], function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });
                google.maps.event.addListener(marker, 'mouseover', function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });

                google.maps.event.addDomListener(document, 'update-' + place.place_id, function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, marker);
                });
            }
        });
    }
}

function updateMap(place) {
    var event
    if (place == 'reception') {
        map.panTo(new google.maps.LatLng(coordinates.reception[0], coordinates.reception[1]));
        event = new Event('update-' + places.reception);

    } else {
        map.panTo(new google.maps.LatLng(coordinates.ceremony[0], coordinates.ceremony[1]));
        event = new Event('update-' + places.ceremony);
    }

    document.dispatchEvent(event);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&' +
        'callback=initialize';
    document.body.appendChild(script);
}

window.onload = loadScript;
var markers = [];


// DOM Ready =============================================================
$(document).ready(function() {
    initialize();
    populateMarkers();
});
// =======================================================================

//Initialize the map
function initialize() {
    var center = new google.maps.LatLng(39.9051851,-75.3542644);

    var mapOptions = {
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
    };

    this.map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
};

function populateMarkers(apiLoc) {
    apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/api/v1/';
    $.getJSON(apiLoc, function(data) {
        // For each item in our JSON, add a new map marker
        $.each(data, function(i, ob) {
          var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(this.loc.coordinates[1],this.loc.coordinates[0]),
                title: 'Site ' + this.name,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
          markers.push(marker);
        });

    });
};

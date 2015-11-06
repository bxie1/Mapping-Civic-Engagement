var markers = [];
var currentInfoWindow;

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
                position: new google.maps.LatLng(this.projectlocation.latlng.coordinates[1],this.projectlocation.latlng.coordinates[0]),
                title: 'Site ' + this.projectTitle,
                filters: this.filters,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });

          var tagList = [];
          $.each(marker.filters, function(ind, obj) {
              if (obj) {
                  tagList.push(ind);
              }
          });
          var content = '<h1 class="mt0"><a href="site/' + marker.title + '">' + marker.title + '</a></h1>';

          $.each(tagList, function(inde, obje) {
                content = content + ' <a href="issue/' + obje + '">' + obje + '</a>';
                if (tagList.indexOf(obje) < tagList.length - 1) {
                    content = content + ',';
                }
            });

          marker.infowindow = new google.maps.InfoWindow({
                content: content,
                maxWidth: 400
          });

          google.maps.event.addListener(marker, 'click', function() {
                if (currentInfoWindow) currentInfoWindow.close();
                marker.infowindow.open(map, marker);
                currentInfoWindow = marker.infowindow;
          });

          markers.push(marker);
        });

    });
};

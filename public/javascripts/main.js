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
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center,
    };

    
    this.map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
        console.log("About to empty project lists.");
    
};

function populateMarkers(apiLoc) {
    apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/api/v1/';
    
    $.getJSON(apiLoc, function(data) {
        // For each item in our JSON, add a new map marker
        console.log("Got JSON");
        
        if(data.length == 0){
            alert("No projects found.");
        }
        
        $.each(data, function(i, ob) {
          var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(parseFloat(this.acf.location.lat), parseFloat(this.acf.location.lng)),
                name: this.acf.contact_name,
                title: this.title.rendered,
                email: this.acf.email,
                msgBody: this.content.rendered, //This should have the post content
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
         

          //Add information to display as content
          var content = '<h2 class="mt0">' + marker.title + '</h2>' +
          '<div>Description: ' + marker.msgBody +"</div>" +  
          "<div>Contact: " + marker.name + "</div>" +
          '<div>Contact Email: <a href="mailto:' + marker.email + '">' + marker.email + '</a></div>';

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
}

$("#search_form").submit(function(event){
    //Closes any open infowindows
    if (currentInfoWindow) currentInfoWindow.close();
    var applyPath = '/api/v1/search/';
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
    markers = [];
    
    applyPath += $('#search_box').val();
    //alert(applyPath);
    //TODO Tokenize Keywords / Sanitize Input
    
    populateMarkers(applyPath);
    return false;
});


$("#apply").click(function() {
    //Closes any open infowindows
    if (currentInfoWindow) currentInfoWindow.close();
    var applyPath = '/api/v1/applytags/';
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(false);
    }
    markers = [];
    $('#tags input:checked').each(function() {
        applyPath = applyPath + $(this).prop('value') + ',';
    });
    console.log(applyPath);
    populateMarkers(applyPath);
});

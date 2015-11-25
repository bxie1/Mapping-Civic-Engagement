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
};

function populateMarkers(apiLoc) {
    apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/api/v1/';
    $.getJSON(apiLoc, function(data) {
        // For each item in our JSON, add a new map marker
        $.each(data, function(i, ob) {
          var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(this.faculty.location.latlng.coordinates[1],this.faculty.location.latlng.coordinates[0]),
                title: this.projectTitle,
                faculty: this.faculty.firstname + ' ' + this.faculty.lastname,
                email: this.faculty.email,
                issueFilters: this.issueFilters,
                researchProjects: this.research,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });

          //Get array of associated issues
          var tagList = [];
          $.each(marker.issueFilters, function(ind, obj) {
              if (obj) {
                  tagList.push(ind);
              }
          });

          // Get array of associated faculty
          var projList = [];
          $.each(marker.researchProjects, function(ind, obj) {
              if (obj) {
                  projList.push(obj);
              }
          });

          //Add information to display as content
          var content = '<h1 class="mt0"><a href="site/' + marker.faculty + '">' + marker.faculty + '</a></h1><div>Email: <a href="mailto:' + marker.email + '">' + marker.email + '</a></div>';

          $.each(tagList, function(inde, obje) {
                content = content + '<div>Issue Areas: <a href="issue/' + obje + '">' + obje + '</a></div>';
                if (tagList.indexOf(obje) < tagList.length - 1) {
                    content = content + ',';
                }
            });
          if(projList.length>0){
            content = content + '<div> Research Projects <ul>';
            $.each(projList, function(inde, obje){
                content = content + '<li>'+ obje.projectTitle +'</li>';
            });
            content = content + '</ul></div>'
          }
          // $.each(facList, function(inde, obje) {
          //       content = content + '<div>Faculty: <a href="faculty/' + obje + '">' + obje + '</a></div>';
          //       if (facList.indexOf(obje) < facList.length - 1) {
          //           content = content + ',';
          //       }
          //   });

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

$("#courses_select").change(function(){

    var x = $("#courses_select").val();
    $("#course_list_div").html( "You selected: " + x);
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
        applyPath = applyPath + $(this).prop('value') + '&';
    });
    console.log(applyPath);
    populateMarkers(applyPath);
});

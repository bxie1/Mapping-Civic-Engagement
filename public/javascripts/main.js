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
        console.log("Got JSON");
        $.each(data, function(i, ob) {
          var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(parseFloat(this.acf.location.lat), parseFloat(this.acf.location.lng)),
                
                // id: this._id,
                title: 'hello title',
                // faculty: this.faculty.firstname + ' ' + this.faculty.lastname,
                // email: this.faculty.email,
                // issueFilters: this.issueFilters,
                // researchProjects: this.research,
                msgBody: this.content.rendered, //This should have the post content
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
         
          console.log("POST CONTENT: " + marker.msgBody);
/*
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

          content += '<div>Issue Areas:';

          $.each(tagList, function(inde, obje) {
                content = content + ' <a href="issue/' + obje + '">' + obje + '</a>';
                if (tagList.indexOf(obje) < tagList.length - 1) {
                    content = content + ',';
                } else{
                  content += '<div>';
                }
            });

          if(projList.length>0){
            content = content + '<div> Research Projects <ul>';
            $.each(projList, function(inde, obje){
                content = content + '<li>'+ obje.projectTitle +'</li>';
            });
            content = content + '</ul></div>'
          }

          content += '<a href="/api/v1/'+ marker.id +'">More</a>';
*/
          marker.infowindow = new google.maps.InfoWindow({
                content: marker.msgBody,
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

// $("#courses_select").change(function(){

//     var x = $("#courses_select").val();
//     $("#course_list_div").html( "You selected: " + x);
// });


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

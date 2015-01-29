$(document).ready(function() {
  calcDistance = function(lat1, lng1, lat2, lng2) {

    var R = 3959; // use 3959 for miles or 6371 for km
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lng2 - lng1) * Math.PI / 180;
    var lat1 = lat1 * Math.PI / 180;
    var lat2 = lat2 * Math.PI / 180;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };
  getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  initMap = function() {

    var $mapContainer = $("#map");

    this.gMap = $mapContainer.gmap({
      center: me.mapCenter,
      zoom: 16,
      callback: function(map) {
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        var panoramioLayer = new google.maps.panoramio.PanoramioLayer();
        panoramioLayer.setMap(map);

        this.addMarker({
          position: map.getCenter()
        });
      }
    });
    $mapContainer.height($("body").height() - 71); //71 is to account for the bottom shift
    setTimeout("$('#map').gmap('refresh')", 500);
  }
  outputDistance = function() {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        me.currentPosition = new google.maps.LatLng(
          //Gets the user's current position and calculates the distance to the given friend
          position.coords.latitude,
          position.coords.longitude
        );
        var miles = calcDistance(
          me.mapCenter.lat(),
          me.mapCenter.lng(),
          position.coords.latitude,
          position.coords.longitude
        );
        $("#distancetofriend").html(miles + " miles ");
      },
      function(error) {
        alert("Could not get current position");
      }
    );
  }

  $("#edit").attr('href', $("#edit").attr('href') + "&id=" + getParameterByName('id'));
  var me = this;
  //Queries for the friend according to the id parameter passed in via the url.
  //getParameterbyName('id') returns the id value passed into the url by the previous page
  FriendsWithBeerDB.runQuery('select friend.*, beer.name beername from friend LEFT JOIN beer on friend.beerid = beer.id where friend.id=' + getParameterByName('id'), function(data) {
    if (data.length !== 1) {
      alert("Duplicate id's present");
    }
    me.contact = data[0];
    me.mapCenter = new google.maps.LatLng(
      data[0].lat,
      data[0].lng
    );
    //Adds the top box and map elements to the screen
    var infoBoxElm = $("#infobox");
    var nameElm = $("<span>" + data[0].firstName + " " + data[0].lastName + "</span><br>");
    infoBoxElm.append(nameElm);
    var addressElm = $("<span>" + data[0].address + ", " + data[0].zipcode + "</span><br>");
    infoBoxElm.append(addressElm);

    var beerElm = $("<span>" + data[0].beername + " is only <span id=\"distancetofriend\"></span>away!</span>");

    infoBoxElm.append(beerElm);
    initMap();
    outputDistance();

  });

});
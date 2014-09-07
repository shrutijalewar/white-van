/* global google */
(function(){
  'use strict';
  var map;

  $(document).ready(function(){
    $('.dropdown-menu li a').click(itemSelected);
    var pos = getUserPosition();
    initMap(pos.lat, pos.lng, 5);
    var positions = getPositions();
    positions.forEach(function(pos){
      addMarker(pos.lat, pos.lng, pos.name);
    });
  });


  function initMap(lat, lng, zoom){
    var styles = [{'stylers':[{'hue':'#ff1a00'},{'invert_lightness':true},{'saturation':-100},{'lightness':33},{'gamma':0.5}]},{'featureType':'water','elementType':'geometry','stylers':[{'color':'#2D333C'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function getUserPosition(){
    var $loc = $('#userLocation'),
        name      = $loc.attr('data-name') || ('Cincinnati'),
        lat       = $loc.attr('data-lat') || (39.10),
        lng       = $loc.attr('data-lng') || (-84.52),
        pos       = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};

    return pos;
  }

  function itemSelected(e){
    var $target = $(e.currentTarget);
    $target.closest('.btn-group')
           .find('[data-bind="label"]').text($target.text())
           .end()
           .children('.dropdown-toggle').dropdown('toggle');
    $target.closest('.btn-group')
           .find('input')
           .val($target.data('value'));
    return false;
  }

  function addMarker(lat, lng, name){
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name, animation: google.maps.Animation.DROP});
  }

  function getPositions(){
    var positions = $('.locationValue').toArray().map(function(a){
      var name = $(a).attr('data-name'),
           lat = $(a).attr('data-lat'),
           lng = $(a).attr('data-lng'),
           pos = {name:name, lat:parseFloat(lat), lng:parseFloat(lng)};
      return pos;
    });
    return positions;
  }
})();


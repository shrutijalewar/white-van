/* global google */
(function(){
  'use strict';
  var map;

  $(document).ready(function(){
    $('.dropdown-menu li').click(itemSelected);
    var pos = getUserPosition();
    initMap(pos.lat, pos.lng, 7);
  });


  function initMap(lat, lng, zoom){
    var styles = [{'featureType':'road','elementType':'geometry','stylers':[{'lightness':100},{'visibility':'simplified'}]},{'featureType':'water','elementType':'geometry','stylers':[{'visibility':'on'},{'color':'#C6E2FF'}]},{'featureType':'poi','elementType':'geometry.fill','stylers':[{'color':'#C5E3BF'}]},{'featureType':'road','elementType':'geometry.fill','stylers':[{'color':'#D1D1B8'}]}],
        mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function getUserPosition(){
    var $loc = $('#userLocation'),
        name      = $loc.attr('data-name'),
        lat       = $loc.attr('data-lat'),
        lng       = $loc.attr('data-lng'),
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
           .val($target.text());
    return false;
  }
})();


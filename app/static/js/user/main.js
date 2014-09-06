/* jshint unused: false, camelcase:false */
/* global google */

function geocode(address, cb){
  'use strict';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address:address}, function(results, status){
    var name = results[0].formatted_address,
        lat  = results[0].geometry.location.lat(),
        lng  = results[0].geometry.location.lng();

    console.log(name, lat, lng);

    $('#loc').val(name);
    $('#lat').val(lat);
    $('#lng').val(lng);

    $('form').submit();
  });
}

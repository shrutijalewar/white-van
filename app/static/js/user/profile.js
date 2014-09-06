/* global geocode */

(function(){
  'use strict';

  $(document).ready(function(){
    $('#editProfile > div > button').click(editProfile);
    $('.tab').click(changeTab);
  });

  function changeTab(e){
    var $tab = $(e.target),
       index = $tab.index();
    $('.tab').removeClass('active');
    $('.pane').removeClass('active');
    $tab.addClass('active');
    $('.pane').eq(index).addClass('active');
  }

  function editProfile(e){
    var lat = $('#lat').val();
    if (!lat){
      var name = $('#location').val();
      geocode(name);
      e.preventDefault();
    }
  }

})();


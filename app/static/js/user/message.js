(function(){
  'use strict';

  $(document).ready(function(){
    $('#text').focus(hideSubject);
    $('input[name=mType]:not(#text)').focus(showSubject);
  });

  function hideSubject(e){
    var $input = $(e.target);
    $input.parents('.form-group').find('#subject').fadeOut();
  }
  function showSubject(e){
    var $input = $(e.target);
    $input.parents('.form-group').find('#subject').fadeIn();
  }

})();



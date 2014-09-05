(function(){
  'use strict';

  $(document).ready(function(){
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

})();


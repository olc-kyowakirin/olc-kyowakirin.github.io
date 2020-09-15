$(function () {
    'use strict';
    (function () {
        var $cookie_notice = localStorage.getItem('cookie-notice');
        if($cookie_notice=="accepted") { $(".box-cookie-notice").hide(); }
        $('a#cookie-notice-ok').on("click",function(){
          var $cookie_notice = localStorage.getItem('cookie-notice');
          localStorage.setItem('cookie-notice','accepted');
          $(".box-cookie-notice").hide();
        });
    }());
});

(function ($, root, undefined) {

    $(function () {

        'use strict';
});

    $(document).ready(function(){
        $(".nav__hamburger-icon").click(function(){
        $(".nav__hamburger-icon").toggleClass("nav__open");
    });

    // When the user scrolls down 80px from the top of the document, make the nav bar smaller
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {

        var headingNavBar = document.getElementById("navbar-js");
        
        if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headingNavBar.classList.add("sticky");
        } else {
            headingNavBar.classList.remove("sticky");
        }
    }

});

})(jQuery, this);
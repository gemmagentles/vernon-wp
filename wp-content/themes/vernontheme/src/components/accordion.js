(function ($, root, undefined) {

    $(function () {

        'use strict';

        var acc = document.getElementsByClassName("accordion-js");
        var i;

        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {

            // for filter widget accordion only START 
            // make the button corners only go round once the dropdown is fully inside the button
              if (document.getElementById("filter-button-js")){
                var filterBtn = document.getElementById("filter-button-js");
                var openAccordion = filterBtn.classList.contains("active");

                if (openAccordion == false) {
                  filterBtn.style.transition = 0 + "s"; 
                  filterBtn.style.transitionDelay = 0 + "s"; 
                } else {
                  filterBtn.style.transition = 0.3 + "s"; 
                  filterBtn.style.transitionDelay = 0.2 + "s"; 
                }
              }
            // for filter widget accordion only END


            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            
            if (panel.style.maxHeight){
              // close
              panel.style.maxHeight = null;
              panel.style["overflow"] = "hidden";
            } else {
              // open
              panel.style.maxHeight = panel.scrollHeight + "px"; 
            
              // prevent overflow from being hidden once open
              setTimeout(
                function() {
                  panel.style["overflow"] = "visible";
                },
              250);
            } 
          });
        }

});

})(jQuery, this);

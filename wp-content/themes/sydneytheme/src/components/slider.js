(function ($, root, undefined) {

  $(function () {

      'use strict';

      var slides;
      var currentNextSlide = [];
      var currentPreviousSlide = [];
      var counter = 0;
      var slidesArray = [];
      
      
      // stop multiple clicking while animation is still happening
      var nextFinished = 1;
      var previousFinished = 1;
      
      $( document ).ready(function() {
        if (document.getElementById("slider")){
        slides = document.getElementById("slider").children;
        slidesArray = Array.prototype.slice.call( slides );
        
        $('#next').click( function() {
          if(previousFinished === 1 && nextFinished === 1) {
            // change the z-index of the images on click next, to reset the styles for the animation. This is needed due to when the previous button is clicked the styles change as the slides come back, so we need to reset the styles of going forward. 
            $(".slider__slide-wrapper.previous:nth-child(2)").css({"z-index" : 3 });
            $(".slider__slide-wrapper.previous:last-child").css({"z-index" : 1 });
            $(".slider__slide-wrapper.previous:first-child").css({"z-index" : 2 });
            nextSlide();
            nextFinished = 0;
            previousFinished = 0;
            setTimeout(
              function() {
                nextFinished = 1;
                previousFinished = 1;
              },
            2000) 
          }
        });

        $('#previous').click( function() {
          if(previousFinished === 1 && nextFinished === 1) {
            previousSlide();
            nextFinished = 0;
            previousFinished = 0;
            setTimeout(
              function() {
                nextFinished = 1;
                previousFinished = 1;
              },
            2000) 
          }
        });
      }
      });
      
      var nextSlide = function(){
        // add this in a timeout to delay the time it takes to remove styles from previous button, otherwise the slides overlap in wrong order before the next function happens.
        setTimeout(
          function() {
            $(".previous").removeClass("previous");
            $(".slider__slide-wrapper").addClass("next");
            // remove injected css to allow styles to work as expected, as next is default css. 
            $(".slider__slide-wrapper").css("z-index", "" );
          },
        125);

        // keep track of what number of slides there are to be able to change the order, they go up in ascending order going forward.
        counter++;
        if (counter >= 3) {
          counter = 0;
        }
        currentNextSlide[0] = slidesArray[0];
        // removes the first slide from array and returns that removed slide to the end of the array. But changes length of array.
        slidesArray.shift();
        // use push to add the slide to the array and return the new length. 
        slidesArray.push(currentNextSlide[0]);
        // now insert the last slide to the end of the slider
        $('#slider').append(slidesArray[2]);
      };
       
      var previousSlide = function() {
        // change the z-index of the images on click previous, to reset the styles for the animation. This is needed due to the fact the styles are being set on default for going next. 
        $(".slider__slide-wrapper").addClass("previous");
        $(".next").removeClass("next");
        $(".slider__slide-wrapper.previous:nth-child(2)").css("z-index", "");
        setTimeout(
          function() {
            $(".slider__slide-wrapper.previous:nth-child(2)").css({"z-index" : 1  });
          },
        1750);

        // keep track of what number of slides there are to be able to change the order, now they go down in descending order going back.
        counter--;
        if (counter <= -1) {
          counter = 2;
        }
        currentPreviousSlide[0] = slidesArray[2];
        // use push to remove the slide from the array and return the new length. 
        slidesArray.pop();
        // adds new slide to the beginning of the array, and returns the new length.
        slidesArray.unshift(currentPreviousSlide[0]);
        // now insert the first child slide to the beginning of the slider
        $('#slider').prepend(slidesArray[0]);
      };
});

})(jQuery, this);

import 'jquery';
import './sass/main.scss';
import './components/header.js';
import './components/slider.js';
import './components/accordion';
import './components/product-hero.js';


(function ($, root, undefined) {

    $(function () {

        'use strict';

        // Listen to tab events to enable outlines (accessibility improvement)
        function handleFirstTab(e) {
            if (e.keyCode === 9) { // the "I am a keyboard user" key
                document.body.classList.add('user-is-tabbing');
                window.removeEventListener('keydown', handleFirstTab);
            }
        }
        
        window.addEventListener('keydown', handleFirstTab);

    });

})(jQuery, this);

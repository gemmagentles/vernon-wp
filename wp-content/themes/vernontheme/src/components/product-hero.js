(function ($, root, undefined) {

    $(function () {

        'use strict';

        $( document ).ready(function() {
            if (document.getElementsByClassName("product-hero__wrapper")){

                // add initials of each attribute finish under each attribute swatch image
                $( ".image-variable-item-polished-chrome" ).append( "<p>PC</p>" );
                $( ".image-variable-item-matte-black" ).append( "<p>MB</p>" );
                $( ".image-variable-item-brushed-nickel" ).append( "<p>BN</p>" );
                $( ".image-variable-item-oil-rubbed-bronze" ).append( "<p>ORB</p>" );
                $( ".image-variable-item-polished-nickel" ).append( "<p>PN</p>" );

            }
        });

});

})(jQuery, this);

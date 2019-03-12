<div class="thumbnail-product-swatches__wrapper">
    <?php // finish_options ( value )
    $finish_options_array = get_field( 'finish_options' );
    if ( $finish_options_array ):
        
        foreach ( $finish_options_array as $finish_options_item ):
            ?>
            <div style="background-image: url('<?php echo get_template_directory_uri(); ?>/img/products/<?php echo $finish_options_item; ?>.png');" class="thumbnail-product-swatches__image thumbnail-product-swatches__image--<?php echo $finish_options_item; ?>">
                <span><?php echo $finish_options_item; ?></span>
            </div>        
            <?php   
        endforeach;
        
    endif; ?>
</div>

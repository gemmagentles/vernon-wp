
<div class="product-grid product-grid__desktop">
    <div class="product-grid__inner">
        <h2 class="product-grid__heading">Browse our featured products below</h2>
        <ul class="product-grid__products">
            <?php
                $args = array(
                    'post_type' => 'product',
                    'posts_per_page' => 8,
                    'product_tag' => 'featured'
                    );
                $loop = new WP_Query( $args );
                if ( $loop->have_posts() ) {
                    while ( $loop->have_posts() ) : $loop->the_post();
                        wc_get_template_part( 'content', 'product' );
                    endwhile;
                } else {
                    echo __( 'No products found' );
                }
                wp_reset_postdata();
            ?>
        </ul><!--/.products-->
        <button class="sydney-button__with-icon" onclick="location.href='./products'" type="button">View All <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt=""></button>
    </div>
</div>


<div class="product-grid product-grid__mobile">
    <div class="product-grid__inner">
        <h2 class="product-grid__heading">Browse our featured products below</h2>
        <ul class="product-grid__products">
            <?php
                $args = array(
                    'post_type' => 'product',
                    'posts_per_page' => 4,
                    'product_tag' => 'featured'
                    );
                $loop = new WP_Query( $args );
                if ( $loop->have_posts() ) {
                    while ( $loop->have_posts() ) : $loop->the_post();
                        wc_get_template_part( 'content', 'product' );
                    endwhile;
                } else {
                    echo __( 'No products found' );
                }
                wp_reset_postdata();
            ?>
        </ul><!--/.products-->
        <button class="sydney-button__with-icon" onclick="location.href='./products'" type="button">View All <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt=""></button>
    </div>
</div>
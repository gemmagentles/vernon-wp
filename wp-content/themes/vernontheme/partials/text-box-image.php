<div class="text-box-image__wrapper">
    <div class="text-box-image__container">
        <?php if ( have_rows( 'content_box', 'option' ) ) : ?>
            <div class="text-box-image__content">
                <?php while ( have_rows( 'content_box', 'option' ) ) : the_row(); ?>
                    <?php $logo = get_sub_field( 'logo' ); ?>
                    <?php if ( $logo ) { ?>
                        <img class="text-box-image__logo" src="<?php echo $logo['url']; ?>" alt="<?php echo $logo['alt']; ?>" />
                    <?php } ?>
                    <h3 class="text-box-image__heading"><?php the_sub_field( 'heading' ); ?></h3>
                    <p class="text-box-image__paragraph"><?php the_sub_field( 'paragraph' ); ?></p>

                    <button class="sydney-button__with-icon" onclick="location.href='<?php the_sub_field( 'button_link' ); ?>'" type="button">
                    <?php the_sub_field( 'button_text' ); ?> <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt=""></button>

                <?php endwhile; ?>
            </div>
        <?php endif; ?>
    </div>

    <?php $text_box_background_image = get_field( 'text_box_background_image', 'option' ); ?>
    <?php if ( $text_box_background_image ) { ?>
        <img class="text-box-image__background-image" src="<?php echo $text_box_background_image['url']; ?>" alt="<?php echo $text_box_background_image['alt']; ?>" />
    <?php } ?>
</div>

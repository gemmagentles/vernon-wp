<div class="centered-text__wrapper">
    <div class="centered-text__container">
        <h1 class="centered-text__heading"><?php the_field( 'centered_text_heading' ); ?></h1>
        <?php if ( get_field( 'centered_text_paragraph' ) ) : ?>
            <!-- wysiwyg -->
            <div class="centered-text__paragraph">
               <?php the_field( 'centered_text_paragraph' ); ?>
            </div>
        <?php endif; ?>
    </div>
</div>

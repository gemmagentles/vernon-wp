<div class="contact-form__wrapper">
  <div class="contact-form__container">
    <?php if ( have_rows( 'contact_information' ) ) : ?>
        <?php while ( have_rows( 'contact_information' ) ) : the_row(); ?>
          <div class="contact-form__inner-wrapper form">
            <?php if ( have_rows( '' ) ) : ?>
                    <?php while ( have_rows( '' ) ) : the_row(); ?>
                        <h3 class="contact-form__title"><?php the_sub_field( 'contact_form_title' ); ?></h3>
                        <?php the_sub_field( 'contact_form_short_code' ); ?>
                    <?php endwhile; ?>
                <?php endif; ?>
          </div>
            <?php if ( have_rows( 'contact_information_inner' ) ) : ?>
          <div class="contact-form__inner-wrapper content">
                <?php while ( have_rows( 'contact_information_inner' ) ) : the_row(); ?>
              <div class="contact-form__content">
                <h3 class="contact-form__title"><?php the_sub_field( 'contact_title' ); ?></h3>
                <div class="contact-form__content--address">
                  <p class="contact-form__paragraph"><?php the_sub_field( 'contact_address' ); ?></p>
                  <p class="contact-form__paragraph">
                    <?php the_sub_field( 'contact_city' ); ?>,
                    <?php the_sub_field( 'contact_province' ); ?>
                    <?php the_sub_field( 'contact_postal_code' ); ?>
                  </p>
                  <p class="contact-form__paragraph"><?php the_sub_field( 'contact_country' ); ?></p>
                </div>
                <div class="contact-form__content--phone">
                  <p class="contact-form__paragraph"><?php the_sub_field( 'contact_phone_number' ); ?></p>
                </div>
                <div class="contact-form__content--email">
                  <a class="contact-form__email-link" target="_blank" href="mailto:<?php the_sub_field( 'contact_email' ); ?>" target="_top"><?php the_sub_field( 'contact_email' ); ?></a>
                </div>
              </div>
                <?php endwhile; ?>
        </div>
            <?php endif; ?>
        <?php endwhile; ?>
    <?php endif; ?>
  </div>
</div>
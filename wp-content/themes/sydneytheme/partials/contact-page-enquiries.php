<div class="contact-enquiry__wrapper">
  <div class="contact-enquiry__container">
    <?php if ( have_rows( 'contact_page_enquiries' ) ) : ?>
      <?php while ( have_rows( 'contact_page_enquiries' ) ) : the_row(); ?>
        <div class="contact-enquiry__inner-wrapper">
          <h2 class="contact-enquiry__title"><?php the_sub_field( 'contact_page_enquiries_title' ); ?></h2>
          <p class="contact-enquiry__content"><?php the_sub_field( 'contact_page_enquiries_content' ); ?></p>
          <button class="sydney-button__with-icon" formtarget="_blank" onclick="location.href='mailto:<?php the_sub_field( 'contact_page_enquiries_email_address_link_url' ); ?>'" type="button">
          <?php the_sub_field( 'contact_page_enquiries_email_address_link_text' ); ?> <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt=""></button>
        </div>
      <?php endwhile; ?>
    <?php else : ?>
      <?php // no rows found ?>
    <?php endif; ?>
  </div>
</div>
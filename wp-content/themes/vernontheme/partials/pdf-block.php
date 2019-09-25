<?php if ( have_rows( 'pdf_content' ) ) : ?>
  <div class="sv-pdf__wrapper">
    <?php while ( have_rows( 'pdf_content' ) ) : the_row(); ?>
        
              <!-- START - Left/Top Box containing description and pdf files -->
              <div class="sv-pdf__left-box">

                <?php if ( have_rows( 'description_and_pdfs' ) ) : ?>
                  <span class="subtitle">About</span>
                  <h2 class="sv-pdf__heading">Product Specs</h2>
                    
                    <?php while ( have_rows( 'description_and_pdfs' ) ) : the_row(); ?>
                      <p><?php the_sub_field( 'description' ); ?></p>

                      <!-- START an accordion to hold a list of pdfs -->
                      <div class="sv-pdf__accordion-wrapper">

                      <!-- button to click on to open accordion -->
                      <button class="sv-pdf__accordion-btn accordion-js">Our Downloads</button>
                      <!-- content inside accordion -->
                      <div class="sv-pdf__accordion-content">
                      <div class="sv-pdf__accordion-inner">
                          <?php if ( have_rows( 'pdf_list' ) ) : ?>
                              <?php while ( have_rows( 'pdf_list' ) ) : the_row(); ?>
                                <?php $pdf_file = get_sub_field( 'pdf_file' ); ?>
                                <?php $bluetooth_icon = get_sub_field( 'add_bluetooth_icon' ); ?>
                                <?php if ( $pdf_file ) { ?>
                                  <a class="sv-pdf__link" href="<?php echo $pdf_file['url']; ?>">
                                    <div>
                                      <?php if ( $bluetooth_icon == 'yes') { ?>
                                        <svg class="sv-pdf__link--bluetooth-icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-Bluetooth" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-Bluetooth"/></svg>
                                      <?php } ?>
                                      <?php the_sub_field( 'pdf_name' ); ?>
                                    </div>
                                    <svg class="sv-pdf__link--icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-down-arrow" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-down-arrow"/></svg>
                                  </a>
                                <?php } ?>
                              <?php endwhile; ?>
                            <?php else : ?>
                              <?php // no rows found ?>
                          <?php endif; ?>
                      </div>
                      </div>

                      </div>
                      <!-- END an accordion to hold a list of pdfs -->

                    <?php endwhile; ?>

                <?php endif; ?>

              </div>
              <!-- END - Left/Top Box containing description and pdf files -->
              <!-- ----------------------------------------------------------------------------->
              <!-- START Right/Bottom Box containing image gallery -->
              <div class="sv-pdf__right-box">

                <?php if ( have_rows( 'image_gallery' ) ) : ?>
                  <?php while ( have_rows( 'image_gallery' ) ) : the_row(); ?>
                    
                  <!-- Large main image -->
                  <div class="sv-pdf__gallery-container">
                    <?php $main_image = get_sub_field( 'main_image' ); ?>
                    <?php if ( $main_image ) { ?>
                      <img id="expandedImg" class="sv-pdf__gallery-container--image" src="<?php echo $main_image['url']; ?>" alt="<?php echo $main_image['alt']; ?>" />
                    <?php } ?>
                  </div>

                  <!-- Row of thumbnails -->
                  <div class="sv-pdf__gallery-row">
                    <?php if ( have_rows( 'thumbnail_images' ) ) : ?>
                      <?php while ( have_rows( 'thumbnail_images' ) ) : the_row(); ?>
                        <?php $image = get_sub_field( 'image' ); ?>
                        <?php if ( $image ) { ?>
                          <div class="sv-pdf__gallery-column">
                            <img class="sv-pdf__gallery-image thumbnail-js" src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" />
                          </div>
                        <?php } ?>
                      <?php endwhile; ?>
                    <?php else : ?>
                      <?php // no rows found ?>
                    <?php endif; ?>
                  </div>

                  <?php endwhile; ?>
                <?php endif; ?>

              </div>
            <!-- START Right/Bottom Box containing image gallery -->

    <?php endwhile; ?>
  </div>
<?php endif; ?>
<!-- END OF PDF -->

<!-- Use js to swap out the thumbnail image to the large main image -->
<script>
  // image gallery
  (function ($, root, undefined) {

      $(function () {
      'use strict';

        $(".thumbnail-js").on('click', function(event){
            event.stopPropagation();
            event.stopImmediatePropagation();
            var expandImg = document.getElementById("expandedImg");
            var thumbnailImageSrc = $(this).attr("src");
            expandImg.src = thumbnailImageSrc;
        });

      });

  })(jQuery, this);
</script>

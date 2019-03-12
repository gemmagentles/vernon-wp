<?php if( have_rows('slider') ): ?>

	<div id="slider" class="slider">

	<?php while( have_rows('slider') ): the_row(); 

		// vars
		$image = get_sub_field('image');
		$subheading = get_sub_field('subheading');
		$heading = get_sub_field('heading');
		$paragraph = get_sub_field('paragraph');
		$link = get_sub_field('link');
		$linkText = get_sub_field('link_text');

		?>

		<div class="slider__slide-wrapper">

      <img class="slider__image" src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt'] ?>" />    

      <div class="slider__inner-slide-container">
        <div class="slider__content-box">
          <div class="slider__content-box-inner">
              <span class="subtitle"><?php echo $subheading; ?></span>
              <h1 class="slider__content-box-inner--heading"><?php echo $heading; ?></h1>
              <p class="slider__content-box-inner--paragraph"><?php echo $paragraph; ?></p>
              <button class="sydney-button__with-icon" onclick="location.href='<?php echo $link; ?>'" type="button">
              <?php echo $linkText; ?> <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt=""></button>
          </div>
          <div class="slider__progress-bar">
            <!-- check how many slides there are to add the number in the progress bar end -->
            <?php $count = count(get_field('slider')); ?>
            <span>0<?php echo get_row_index(); ?></span><div class="slider__progress-bar--line"></div><span>0<?php echo $count; ?></span>
          </div>
        </div>
      </div>

    </div>

    <?php endwhile; ?>
    
</div>

<div id="previous" class="slider__arrow--prev">
  <button class="sydney-button__with-icon" type="button">
    <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/left-arrow.svg" alt="">
  </button>
</div>
<div id="next" class="slider__arrow--next">
  <button class="sydney-button__with-icon" type="button">
    <img class="sydney-button__with-icon--icon"src="<?php echo get_template_directory_uri(); ?>/img/icons/right-arrow.svg" alt="">
  </button>
</div>

<?php endif; ?>

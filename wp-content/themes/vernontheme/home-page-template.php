<?php /* Template Name: Home Page Template */ get_header(); ?>

	<main role="main">

		<!-- Slider -->
		<section>
			<?php get_template_part('partials/slider'); ?> 		
		</section>
		<!-- /Slider -->

		<!-- Card Grid -->
		<section>
			<?php get_template_part('partials/card-grid'); ?> 		
		</section>
		<!-- /Card Grid -->

		<!-- Product Grid -->
		<section>
			<?php get_template_part('partials/product-grid'); ?> 		
		</section>
		<!-- /Product Grid -->
	</main>

<?php get_template_part('partials/newsletter-signup'); ?> 

<?php get_footer(); ?>

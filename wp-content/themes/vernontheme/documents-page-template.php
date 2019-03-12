<?php /* Template Name: Documents Page Template */ get_header(); ?>
<!-- only to be viewed by logged in users  -->

	<main role="main">
		<?php if(SwpmMemberUtils::is_member_logged_in()) { ?>
		<!-- Generic Hero -->
		<section>
			<?php get_template_part('partials/generic-hero'); ?>		
		</section>
		<!-- /Generic Hero -->

		<!-- Download List -->
		<section>
			<?php get_template_part('partials/download-list'); ?> 		
		</section>
		<!-- /Download List -->
		<?php the_content(); ?>
		<?php } else { ?> 
			<?php the_content(); ?>
		<?php } ?>

	</main>

<?php get_footer(); ?>

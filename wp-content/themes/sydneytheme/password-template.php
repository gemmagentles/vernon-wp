<?php /* Template Name: Password Page Template */ get_header(); ?>
<!-- where users will log in or reset password  -->

	<main role="main">
		<?php if(SwpmMemberUtils::is_member_logged_in()) { ?>
		<section>
		<!-- Page Wrapper -->				
		<div class="sv-forms__wrapper">
			<div class="sv-forms__container">
        		<h1 class="sv-forms__container--heading"><?php the_title(); ?></h1>
				<?php the_content(); ?>
			</div>
		</div>
		<!-- /Page Wrapper -->
		<?php } else { ?> 
			<!-- Page Wrapper -->				
			<div class="sv-forms__wrapper">
				<div class="sv-forms__container">
					<h1><?php the_title(); ?></h1>
					<?php the_content(); ?>
				</div>
			</div>
			<!-- /Page Wrapper -->
		<?php } ?>


		
		</section>
	</main>

<?php get_footer(); ?>

<?php /* Template Name: Dealer Locator Page Template */ get_header(); ?>

	<main role="main">

		<!-- Generic Hero -->
		<section>
			<?php get_template_part('partials/centered-text'); ?>		
		</section>
        <!-- /Generic Hero -->
        
        <!-- Map -->
        <section>
            <div class="contact-map-wrapper">
 <!-- One field no need for a partial -->
                <?php the_field( 'map' ); ?>
            </div>
        </section>
        <!-- /Map -->

    </main>
    
    <?php get_template_part('partials/newsletter-signup'); ?> 

<?php get_footer(); ?>

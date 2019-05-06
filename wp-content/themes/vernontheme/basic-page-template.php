<?php /* Template Name: Basic Page Template */ get_header(); ?>

	<main role="main">

        <section class="custom-wysiwyg__wrapper">
            <?php the_field( 'wysiwyg_text' ); ?>
        </section>

    </main>
    
<?php get_footer(); ?>

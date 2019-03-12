<?php if ( have_rows( 'download_list' ) ) : ?>
    <div class="download-list__wrapper">
        <?php while ( have_rows( 'download_list' ) ) : the_row(); ?>
        
        <div class="download-list__container">
            <h2 class="download-list__heading">
                <?php the_sub_field( 'subject_heading' ); ?>
            </h2>

            <?php if ( have_rows( 'pdf_links' ) ) : ?>
                <?php while ( have_rows( 'pdf_links' ) ) : the_row(); ?>
                    <?php $pdf_file = get_sub_field( 'pdf_file' ); ?>
                    <?php if ( $pdf_file ) { ?>
                        <a class="download-list__link" target="_blank" href="<?php echo $pdf_file['url']; ?>"><?php the_sub_field( 'name_of_pdf' ); ?><span class="download-list__link--view">View</span></a>
                    <?php } ?>
                <?php endwhile; ?>
            <?php else : ?>
                <?php // no rows found ?>
            <?php endif; ?>
        
        </div>
        <?php endwhile; ?>
    
    </div>
<?php else : ?>
	<?php // no rows found ?>
<?php endif; ?>

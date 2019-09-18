        <footer class="footer" role="contentinfo">
				<div class="footer__divider">
					<a href="#top" title="Top">
						<img class="footer__divider--top-arrow" src="<?php echo get_template_directory_uri(); ?>/img/icons/top-arrow.svg" alt="">
					</a>
				</div>
			<div class="footer__wrapper">
				<div class="footer__container">
					<div class="footer__top">
						<nav class="footer__nav" role="navigation">
						<?php if(SwpmMemberUtils::is_member_logged_in()) { ?>
							<?php html5blank_nav_logout(); ?>
						<?php } else { ?> 
							<?php html5blank_nav(); ?>
						<?php } ?>
							<a href="/site-map">Site Map</a>
						</nav>
						<div class="company-info">
							<div class="mobile-line"></div>
							<div class="company-address">
								<p><?php the_field('contact_info_address', 'option'); ?></p>
								<p><?php the_field('contact_info_province', 'option'); ?></p>
								<p><?php the_field('contact_info_postal_code', 'option'); ?></p>
								<p><?php the_field('contact_info_country', 'option'); ?></p>
							</div>
							<div class="mobile-line"></div>
							<div class="company-contact">
								<p>T: <?php the_field('contact_info_phone_number', 'option'); ?></p>
								<p>E: <a class="email" target="_blank" href="mailto:<?php the_field('contact_info_email', 'option'); ?>" target="_top"><?php the_field('contact_info_email', 'option'); ?></a></p>
							</div>
						</div>
						<div class="logos">
						<div class ="social">
<div class="line"></div>
<a class="social__link" title="Facebook" href="<?php the_field('facebook_url', 'option'); ?>" target="_blank">
<svg class="social__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-facebook" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-facebook"/></svg>
</a>
<a class="social__link" title="Twitter" href="<?php the_field('twitter_url', 'option'); ?>" target="_blank">
<svg class="social__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-twitter" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-twitter"/></svg>
</a>
<a class="social__link" title="Instagram" href="<?php the_field('instagram_url', 'option'); ?>" target="_blank">
<svg class="social__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-instagram" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-instagram"/></svg>
</a>
</div>
							<div class="parent-company">
								<p>Proudly distributed by Kartners</p>
								<img class="kartners-logo" src="<?php echo get_template_directory_uri(); ?>/img/icons/kartners.svg" alt="Kartners">
							</div>
						</div>
					</div>
					<div class="footer__bottom">
						<p class="copyright">
						&copy; <?php bloginfo('name'); ?>, <?php echo date('Y'); ?></p>
						<p class="accredit">Design by <a class="accredit__link" href="https://anotherblankpage.com/">Another Blank Page</a></p>
					</div>
				</div>
				</div>
			</footer>
		</div>
		<?php wp_footer(); ?>
	</body>
</html>

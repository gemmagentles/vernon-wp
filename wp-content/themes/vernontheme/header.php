<!doctype html>
<html <?php language_attributes(); ?> class="no-js">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <title><?php wp_title(''); ?></title>
    <link href="<?php echo get_template_directory_uri(); ?>/img/icons/favicon.ico" rel="shortcut icon">
    <link href="<?php echo get_template_directory_uri(); ?>/img/icons/touch.png" rel="apple-touch-icon-precomposed">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body id="top" <?php body_class(); ?>>

<div class="wrapper">

    <header id="navbar-js" class="header clear" role="banner">
        <div class="header__wrapper">
            <a class="header__logo" href="<?php echo home_url(); ?>">
                <img src="<?php the_field('brand_logo', 'option'); ?>" alt="Brand" class="logo">
            </a>

            <div class="nav__hamburger-icon" id="hamburger">
                <div class="hamburger-bar1"></div>
                <div class="hamburger-bar2"></div>
                <div class="hamburger-bar3"></div>
            </div>
            <nav class="nav" role="navigation">
            <?php if(SwpmMemberUtils::is_member_logged_in()) { ?>
                <?php html5blank_nav_logout(); ?>
            <?php } else { ?> 
                <?php html5blank_nav(); ?>
		    <?php } ?>
                <div class ="social">
                    <div class="line"></div>

                    <a class="nav__link" title="Facebook" href="<?php the_field('facebook_url', 'option'); ?>" target="_blank">
                        <svg class="nav__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-facebook" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-facebook"/></svg>
                    </a>

                    <a class="nav__link" title="Twitter" href="<?php the_field('twitter_url', 'option'); ?>" target="_blank">
                        <svg class="nav__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-twitter" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-twitter"/></svg>
                    </a>

                    <a class="nav__link" title="Instagram" href="<?php the_field('instagram_url', 'option'); ?>" target="_blank">
                        <svg class="nav__icon"><use href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-instagram" xlink:href="<?php echo get_template_directory_uri(); ?>/img/icons/icons.svg#icon-sv-instagram"/></svg>
                    </a>
                </div>
            </nav>
        </div>
    </header>

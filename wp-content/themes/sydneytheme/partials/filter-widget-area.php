<div class="filter-widget__accordion-wrapper">

    <!-- button to click on to open accordion -->
    <button id="filter-button-js" class="filter-widget__accordion-btn accordion-js">Filter</button>

    <!-- content inside accordion -->
    <div class="filter-widget__wrapper">
        <div class="filter-widget__inner">
            <?php if( dynamic_sidebar('filter_widgets_area') ) : else : endif; ?>
        </div>
    </div>

</div>

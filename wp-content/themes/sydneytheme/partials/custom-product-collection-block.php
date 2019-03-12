<!-- inside the file custom-product-collection-block.php for adding the series name otherwise know as collection name in the past -->
<p class="products__subheading">
<?php $product_collection_subtitle_term = get_field( 'product_collection_subtitle' ); ?>
<?php if ( $product_collection_subtitle_term ): ?>
	<?php echo $product_collection_subtitle_term->name; ?>
<?php endif; ?>
</p>
<?php

namespace WPGMZA;

class Category
{
	public static function doesMarkersHasCategoriesTableExist()
	{
		global $wpdb;
		global $WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES;
		
		$stmt = $wpdb->prepare("SHOW TABLES LIKE %s", array($WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES));
		$table = $wpdb->get_var($stmt);
		
		return ($table ? true : false);
	}
	
	public static function installMarkerHasCategoriesTable()
	{
		global $wpdb;
		global $WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES;
		
		if(Category::doesMarkersHasCategoriesTableExist())
			return;
		
		$wpdb->query("CREATE TABLE `$WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES` (
				marker_id int(11) NOT NULL,
				category_id int(11) NOT NULL,
				PRIMARY KEY  (marker_id, category_id)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;
		");		
	}
	
	/**
	 * This function completely rebuilds the markers-has-categories table
	 * from the legacy marker "category" field
	 */
	public static function rebuildTableFromLegacyField()
	{
		global $wpdb;
		global $wpgmza_tblname;
		global $WPGMZA_TABLE_NAME_CATEGORIES;
		global $WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES;
		
		Category::installMarkerHasCategoriesTable();
		
		$wpdb->query("DELETE FROM $WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES");
		
		$markers = $wpdb->get_results("SELECT id, category FROM $wpgmza_tblname");
		
		foreach($markers as $marker)
		{
			if(empty($marker->category))
				continue;
			
			$categories = explode(',', $marker->category);
			
			foreach($categories as $category_id)
			{
				if(array_search($category_id, $categories) === false)
					continue;
				
				$qstr = "INSERT INTO $WPGMZA_TABLE_NAME_MARKERS_HAS_CATEGORIES (marker_id, category_id) VALUES (%d, %d)";
				
				$stmt = $wpdb->prepare($qstr, array($marker->id, $category_id));
				
				$wpdb->query($stmt);
			}
		}
	}
}

add_action('init', function() {
	// First time, for upgrading users and new users
	if(!Category::doesMarkersHasCategoriesTableExist())
		Category::rebuildTableFromLegacyField();
}, 100);

add_action('wpgmza_map_saved', 			array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));
add_action('wpgmza_marker_saved', 		array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));	// TODO: Only for specified marker
add_action('wpgmza_marker_deleted', 	array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));	// TODO: Only for specified marker
add_action('wpgmza_categories_saved',	array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));
add_action('wpgmza_category_deleted',	array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));
add_action('wpgmza_import_complete',	array('WPGMZA\\Category', 'rebuildTableFromLegacyField'));

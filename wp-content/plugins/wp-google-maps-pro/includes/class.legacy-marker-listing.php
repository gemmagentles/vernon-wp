<?php

/**
 * Marker Listing Class
 *
 * This class handles the output of all marker listing types.
 *
 * @admin		   [bool]  [Is the list being outputted to the admin area or not]
 * @type			[int]   [Type ID  1: Basic Table. 2: Advanced Table. 3: Carousel Listing. 4: Basic List]
 * @map_id		  [int]   []
 * @category_data   [array] []
 * @mashup		  [bool]  []
 * @mashup_ids	  [array] []
 * @mmarker_array   [array] []
 * @order_by		[int]   []
 * @order		   [int]   []
 */

namespace WPGMZA;
 
class_alias('WPGMZA\\LegacyMarkerListing', 'wpgmza');

class LegacyMarkerListing {
	
	function list_markers($admin = false,$type = 1,$map_id = false,$category_data = false,$mashup = false,$mashup_ids = false,$marker_array = false,$order_by = false,$order = false,$include_mlist_div = true) {
		
		$params = array();
		
		if($map_id)
			$params['map_id'] = $map_id;
		if($mashup_ids)
			$params['mashup_ids'] = $mashup_ids;
		if(is_array($marker_array))
			$params['marker_ids'] = $marker_array;
		if($order_by)
			$params['order_by'] = $order_by;
		if($order)
			$params['order_dir'] = $order;
		
		$listing = MarkerListing::createInstanceFromStyle($type, $map_id);
		
		if(!$listing)
			return "";
		
		$listing->setAjaxParameters($params);
		
		return $listing->html();
		
	}
	function get_map_data($map_id) {
		global $wpdb;
		global $wpgmza_tblname_maps;
		$result = $wpdb->get_results("
			SELECT *
			FROM $wpgmza_tblname_maps
			WHERE `id` = '".$map_id."' LIMIT 1
		");

		if (isset($result[0])) { return $result[0]; }
	}
	
	
	
}


<?php

namespace WPGMZA;

$dir = wpgmza_get_basic_dir();

wpgmza_require_once($dir . 'includes/class.factory.php');
wpgmza_require_once($dir . 'includes/class.crud.php');
wpgmza_require_once($dir . 'includes/class.map.php');

class ProMap extends Map
{
	public function __construct($id_or_fields=-1)
	{
		Map::__construct($id_or_fields);
		
		if(is_admin() && !empty($this->fusion))
		{
			add_action('admin_notices', function() {
				
				?>
				
				<div class="notice notice-error is-dismissible">
					<p>
						<?php
						_e('<strong>WP Google Maps:</strong> Fusion Tables are deprecated and will be turned off as of December the 3rd, 2019. Google Maps will no longer support Fusion Tables from this date forward.', 'wp-google-maps');
						?>
					</p>
				</div>
				
				<?php
				
			});
		}
	}
	
	public function isDirectionsEnabled()
	{
		global $wpgmza;
		
		if($wpgmza->settings->engine != "google-maps")
			return false;
		
		if($this->directions_enabled == "1")
			return true;
		
		return false;
	}
	
	protected function getMarkersQuery()
	{
		global $wpdb, $WPGMZA_TABLE_NAME_MARKERS;
		
		$columns = array();
		
		foreach($wpdb->get_col("SHOW COLUMNS FROM $WPGMZA_TABLE_NAME_MARKERS") as $name)
		{
			switch($name)
			{
				case "icon":
					$columns[] = ProMarker::getIconSQL($this->id);
					break;
				
				default:
					$columns[] = $name;
					break;
			}
		}
		
		$stmt = $wpdb->prepare("SELECT " . implode(", ", $columns) . " FROM $WPGMZA_TABLE_NAME_MARKERS WHERE approved=1 AND map_id=%d", array($this->id));
		
		return $stmt;
	}
}

add_filter('wpgmza_create_WPGMZA\\Map', function($id_or_fields) {
	
	return new ProMap($id_or_fields);
	
});

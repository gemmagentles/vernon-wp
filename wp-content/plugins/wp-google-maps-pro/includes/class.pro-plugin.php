<?php

namespace WPGMZA;

if(!defined('WPGMZA_DIR_PATH'))
	return;

wpgmza_require_once(WPGMZA_DIR_PATH . 'includes/class.plugin.php');
wpgmza_require_once(plugin_dir_path(__FILE__) . 'class.category.php');
wpgmza_require_once(plugin_dir_path(__FILE__) . 'class.pro-rest-api.php');
wpgmza_require_once(plugin_dir_path(__FILE__) . 'class.pro-marker.php');
wpgmza_require_once(plugin_dir_path(__FILE__) . 'tables/class.pro-admin-marker-datatable.php');
wpgmza_require_once(plugin_dir_path(__FILE__) . '3rd-party-integration/class.pro-gutenberg.php');

class ProPlugin extends Plugin
{
	private $cachedProVersion;
	
	public function __construct()
	{
		Plugin::__construct();
	}
	
	public function getLocalizedData()
	{
		$data = Plugin::getLocalizedData();
		
		$categoryTree = new CategoryTree();
		
		if(empty($data['ajaxnonce']))
			$data['ajaxnonce'] = wp_create_nonce('wpgmza_ajaxnonce');
		
		return array_merge($data, array(
			'categoryTreeData'		=> $categoryTree,
			'defaultPreloaderImage'	=> plugin_dir_url(__DIR__) . 'images/AjaxLoader.gif',
			'pro_version' 			=> $this->getProVersion()
		));
	}
	
	public static function getDirectoryURL()
	{
		return plugin_dir_url(__DIR__);
	}
	
	public function isProVersion()
	{
		return true;
	}
	
	public function getProVersion()
	{
		if($this->cachedProVersion != null)
			return $this->cachedProVersion;
		
		$subject = file_get_contents(plugin_dir_path(__DIR__) . 'wp-google-maps-pro.php');
		if(preg_match('/Version:\s*(.+)/', $subject, $m))
			$this->cachedProVersion = trim($m[1]);
		
		return $this->cachedProVersion;
	}
}

add_filter('wpgmza_create_WPGMZA\\Plugin', function() {
	
	return new ProPlugin();
	
}, 10, 0);

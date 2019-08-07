<?php

namespace WPGMZA;

class ProRestAPI extends RestAPI
{
	public function __construct()
	{
		RestAPI::__construct();
	}
	
	public function registerRoutes()
	{
		if(method_exists(get_parent_class($this), 'registerRoutes'))
			RestAPI::registerRoutes(); // Failsafe for basic < 7.11.40 w/Pro >= 7.11.47 in which this method doesn't exist on the parent class
		
		if(!method_exists($this, 'registerRoute'))
			return; // Legacy basic failsafe
		
		$this->registerRoute('/marker-listing/', array(
			'methods'					=> array('GET'),
			'callback' 					=> array($this, 'markerListing'),
			'useCompressedPathVariable' => true
		));
		
		$this->registerRoute('/marker-listing/', array(
			'methods'					=> array('POST'),
			'callback' 					=> array($this, 'markerListing')
		));
	}
	
	public function markerListing($request)
	{
		$request = $this->getRequestParameters();
		$map_id = $request['map_id'];
		
		if(RestAPI::isRequestURIUsingCompressedPathVariable())
			$class = '\\' . $request['phpClass'];
		else
			$class = '\\' . stripslashes( $request['phpClass'] );
		
		$instance = $class::createInstance($map_id);
		
		if(!($instance instanceof MarkerListing))
			return WP_Error('wpgmza_invalid_datatable_class', 'Specified PHP class must extend WPGMZA\\MarkerListing', array('status' => 403));
		
		$response = $instance->getAjaxResponse($request);
		
		return $response;
	}
}

add_filter('wpgmza_create_WPGMZA\\RestAPI', function() {
	
	return new ProRestAPI();
	
}, 10, 0);

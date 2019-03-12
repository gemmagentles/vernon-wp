var MYMAP = new Array();
var wpgmzaTable = new Array();

var directionsDisplay = new Array();
var directionsService = new Array();
var infoWindow = new Array();
var store_locator_marker = new Array();
var cityCircle = new Array();
var infoWindow_poly = new Array();
var polygon_center = new Array();
var WPGM_Path_Polygon = new Array();
var WPGM_Path = new Array();
var marker_array = new Array();
var marker_array2 = new Array();
var marker_sl_array = new Array();
var wpgmza_controls_active = new Array();
var wpgmza_adv_styling_json = new Array();
// TODO: Some of these should be changed, these are very generic variables names and they're on the global scope
var lazyload;
var autoplay;
var items;
var items_tablet;
var items_mobile;
var default_items;
var pagination;
var navigation;
var modern_iw_open = new Array();
var markerClusterer = new Array();
var original_iw;
var orig_fetching_directions;
var wpgmaps_map_mashup = new Array();
var focused_on_lat_lng = false;

/**
 * Variables used to focus the map on a specific LAT and LNG once the map has loaded.
 */
var focus_lat = false, focus_lng = false; 
var wpgmza_iw_Div = new Array();
var autocomplete = new Array();
var retina = window.devicePixelRatio > 1;
var click_from_list = false;
var wpgmza_user_marker = null; 

var wpgmzaForceLegacyMarkerClusterer = false;
            
autoheight = true;
autoplay = 6000;
lazyload = true;
pagination = false;
navigation = true;
items = 5;
items_tablet = 3;
items_mobile = 1;

 if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback){
      for (var i = 0; i < this.length; i++){
        callback.apply(this, [this[i], i, this]);
      }
    };
}

for (var entry in wpgmaps_localize) {
    modern_iw_open[entry] = false;
    if ('undefined' === typeof window.jQuery) {
        setTimeout(function(){ document.getElementById('wpgmza_map_'+wpgmaps_localize[entry]['id']).innerHTML = 'Error: In order for WP Google Maps to work, jQuery must be installed. A check was done and jQuery was not present. Please see the <a href="http://www.wpgmaps.com/documentation/troubleshooting/jquery-troubleshooting/" title="WP Google Maps - jQuery Troubleshooting">jQuery troubleshooting section of our site</a> for more information.'; }, 5000);
    }
    
    
}

/* find out if we are dealing with mashups and which maps they relate to */
if (typeof wpgmza_mashup_ids !== "undefined") {
    for (var mashup_entry in wpgmza_mashup_ids) {
        wpgmaps_map_mashup[mashup_entry] = true;
    }
}

var wpgmza_retina_width;
var wpgmza_retina_height;

if ("undefined" !== typeof wpgmaps_localize_global_settings['wpgmza_settings_retina_width']) { wpgmza_retina_width = parseInt(wpgmaps_localize_global_settings['wpgmza_settings_retina_width']); } else { wpgmza_retina_width = 31; }
if ("undefined" !== typeof wpgmaps_localize_global_settings['wpgmza_settings_retina_height']) { wpgmza_retina_height = parseInt(wpgmaps_localize_global_settings['wpgmza_settings_retina_height']); } else { wpgmza_retina_height = 45; }

function wpgmza_parse_theme_data(raw)
{
	var json;
	
	try{
		json = JSON.parse(raw);
	}catch(e) {
		try{
			json = eval(raw);
		}catch(e) {
			console.warn("Couldn't parse theme data");
			return [];
		}
	}
	
	return json;
}

function wpgmza_get_info_window_style(map_id)
{
	var globalInfoWindowStyle = WPGMZA.settings.wpgmza_iw_type;
	var localInfoWindowStyle = MYMAP[map_id].map.settings.wpgmza_iw_type;
	
	var infoWindowStyle = WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE;
	
	if(globalInfoWindowStyle != WPGMZA.ProInfoWindow.STYLE_INHERIT)
		infoWindowStyle = globalInfoWindowStyle;
	
	if(localInfoWindowStyle != WPGMZA.ProInfoWindow.STYLE_INHERIT)
		infoWindowStyle = localInfoWindowStyle;
	
	return infoWindowStyle;
}

var user_location;
var wpgmza_store_locator_circles_by_map_id = [];

function wpgmza_show_store_locator_radius(map_id, center, radius, distance_type, settings)
{
	var options = {
		strokeColor: '#FF0000',
		strokeOpacity: 0.25,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.15,
		map: MYMAP[map_id].map,
		center: center
	};
	
	for(var name in settings)
		options[name] = settings[name];
	
	var style = wpgmaps_localize[map_id].other_settings.wpgmza_store_locator_radius_style;
	
	// Force legacy style on iOS, it appears CanvasLayer crashes some iOS devices
	if(WPGMZA.isDeviceiOS())
	{
		style = "legacy";
		
		// Workaround for legacy settings not saved when modern style selected
		options.fillOpacity = 0.15; 
		options.fillColor = "#ff0000";
	}
	
	switch(style)
	{
		case "modern":
			if(!MYMAP[map_id].modernStoreLocatorCircle)
				MYMAP[map_id].modernStoreLocatorCircle = WPGMZA.ModernStoreLocatorCircle.createInstance(map_id);
			
			options.visible = true;
			options.radius = radius * (distance_type == 1 ? WPGMZA.Distance.KILOMETERS_PER_MILE : 1);
			options.radiusString = radius;
			if(settings.strokeColor)
				options.color = settings.strokeColor;
			
			MYMAP[map_id].modernStoreLocatorCircle.setOptions(options);
			
			break;
		
		default:
			
			if(wpgmza_store_locator_circles_by_map_id[map_id])
				wpgmza_store_locator_circles_by_map_id[map_id].setMap(null);
			
			if (distance_type == "1")
				options.radius = parseInt(radius / 0.000621371);
			else
				options.radius = parseInt(radius / 0.001);

			var circle = WPGMZA.Circle.createInstance(options);
			wpgmza_store_locator_circles_by_map_id[map_id] = circle;
			
			break;
	}
}


function InitMap(map_id,cat_id,reinit) {
    modern_iw_open[map_id] = false /* set modern infowindow open boolean to false to reset the creation of it considering the map has been reinitialized */
    
    if ('undefined' !== typeof wpgmaps_localize_shortcode_data) {
        if (wpgmaps_localize_shortcode_data[map_id]['lat'] !== false && wpgmaps_localize_shortcode_data[map_id]['lng'] !== false) {
            wpgmaps_localize[map_id]['map_start_lat'] = wpgmaps_localize_shortcode_data[map_id]['lat'];
            wpgmaps_localize[map_id]['map_start_lng'] = wpgmaps_localize_shortcode_data[map_id]['lng'];

        }
    }
    
    
    if ('undefined' === cat_id || cat_id === '' || !cat_id || cat_id === 0 || cat_id === "0") { cat_id = 'all'; }

    
	var myLatLng = new WPGMZA.LatLng(wpgmaps_localize[map_id]['map_start_lat'],wpgmaps_localize[map_id]['map_start_lng']);

    if (reinit === false) {
        if (typeof wpgmza_override_zoom !== "undefined" && typeof wpgmza_override_zoom[map_id] !== "undefined") {
            MYMAP[map_id].init("#wpgmza_map_"+map_id, myLatLng, parseInt(wpgmza_override_zoom[map_id]), wpgmaps_localize[map_id]['type'],map_id);
        } else {
            MYMAP[map_id].init("#wpgmza_map_"+map_id, myLatLng, parseInt(wpgmaps_localize[map_id]['map_start_zoom']), wpgmaps_localize[map_id]['type'],map_id);
        }
    }
    

    UniqueCode=Math.round(Math.random()*10000);
    if ('undefined' !== typeof wpgmaps_localize_shortcode_data) {
        if (wpgmaps_localize_shortcode_data[map_id]['lat'] !== false && wpgmaps_localize_shortcode_data[map_id]['lng'] !== false) {
            /* we're using custom fields to create, only show the one marker */
            var point = new WPGMZA.LatLng(parseFloat(wpgmaps_localize_shortcode_data[map_id]['lat']),parseFloat(wpgmaps_localize_shortcode_data[map_id]['lng']));
            var marker = WPGMZA.Marker.createInstance({
                position: point,
                map: MYMAP[map_id].map
            });

        }
    } else {
        if (typeof wpgmaps_map_mashup !== "undefined" && typeof wpgmaps_map_mashup[map_id] !== "undefined" && wpgmaps_map_mashup[map_id] === true) {
            wpgmaps_localize_mashup_ids[map_id].forEach(function(entry_mashup) {
                if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] !== "undefined" && wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === 1) { 
                    /* dont show markers */
                    MYMAP[map_id].placeMarkers(wpgmaps_markerurl+entry_mashup+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,false);
                } else if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] !== "undefined" && wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === 2) { 
                    MYMAP[map_id].placeMarkers(wpgmaps_markerurl+entry_mashup+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
                } else if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === "undefined") { 
                    MYMAP[map_id].placeMarkers(wpgmaps_markerurl+entry_mashup+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
                } else {
                    MYMAP[map_id].placeMarkers(wpgmaps_markerurl+entry_mashup+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
                }
                
            });
        } else {
            if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] !== "undefined" && wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === 1) { 
                /* dont show markers */
                MYMAP[map_id].placeMarkers(wpgmaps_markerurl+map_id+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,false);
            } else if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] !== "undefined" && wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === 2) { 
                MYMAP[map_id].placeMarkers(wpgmaps_markerurl+map_id+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
            } else if (typeof wpgmaps_localize[map_id]['other_settings']['store_locator_hide_before_search'] === "undefined") { 
                MYMAP[map_id].placeMarkers(wpgmaps_markerurl+map_id+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
            } else {
                MYMAP[map_id].placeMarkers(wpgmaps_markerurl+map_id+'markers.xml?u='+UniqueCode,map_id,cat_id,null,null,null,null,true);
            }
            
        }
    }
};

function resetLocations(map_id) {
	if (typeof jQuery("#addressInput_"+map_id) === "object") { jQuery("#addressInput_"+map_id).val(''); }
	if (typeof jQuery("#nameInput_"+map_id) === "object") { jQuery("#nameInput_"+map_id).val(''); }
	reset_marker_lists(map_id);
	InitMap(map_id,'all',true);
  
	if(window.wpgmza_store_locator_circles_by_map_id && wpgmza_store_locator_circles_by_map_id[map_id])
	{
		var circle = wpgmza_store_locator_circles_by_map_id[map_id];
		if(circle.map)
			MYMAP[map_id].map.removeCircle(circle);
	}
  
	MYMAP[map_id].map.setZoom(parseInt(wpgmaps_localize[map_id]['map_start_zoom']));
}

function fillInAddress(mid) {
  
  //var place = autocomplete[mid].getPlace();
}


jQuery(window).on("load", function() {
	
	var $ = jQuery;

	for (var entry in wpgmaps_localize) {
		
		var curmid = wpgmaps_localize[entry]['id'];
		
		var elementExists = document.getElementById('addressInput_'+curmid);

		var wpgmza_input_to_exists = document.getElementById('wpgmza_input_to_'+curmid);
		var wpgmza_input_from_exists = document.getElementById('wpgmza_input_from_'+curmid);

		if (typeof google === 'object' && typeof google.maps === 'object' && typeof google.maps.places === 'object' && typeof google.maps.places.Autocomplete === 'function' && WPGMZA.settings.engine == "google-maps") {

			if (elementExists !== null) {
				if (typeof wpgmaps_localize[curmid]['other_settings']['wpgmza_store_locator_restrict'] !== "undefined" && wpgmaps_localize[curmid]['other_settings']['wpgmza_store_locator_restrict'] != "") {
					autocomplete[curmid] = new google.maps.places.Autocomplete(
					(document.getElementById('addressInput_'+curmid)),
					{fields: ["name", "formatted_address"], types: ['geocode'], componentRestrictions: {country: wpgmaps_localize[curmid]['other_settings']['wpgmza_store_locator_restrict']} });
					google.maps.event.addListener(autocomplete[curmid], 'place_changed', function() {
						fillInAddress(curmid);
					});
				} else {
					autocomplete[curmid] = new google.maps.places.Autocomplete(
					(document.getElementById('addressInput_'+curmid)),
					{fields: ["name", "formatted_address"], types: ['geocode']});
					google.maps.event.addListener(autocomplete[curmid], 'place_changed', function() {
						fillInAddress(curmid);
					});
				}
			}

			if (wpgmza_input_to_exists !== null) {
				autocomplete[curmid] = new google.maps.places.Autocomplete(
				(document.getElementById('wpgmza_input_to_'+curmid)),
				{fields: ["name", "formatted_address"], types: ['geocode']});
				google.maps.event.addListener(autocomplete[curmid], 'place_changed', function() {
					fillInAddress(curmid);
				});
			}

			if (wpgmza_input_from_exists !== null) {
				autocomplete[curmid] = new google.maps.places.Autocomplete(
				(document.getElementById('wpgmza_input_from_'+curmid)),
				{fields: ["name", "formatted_address"], types: ['geocode']});
				google.maps.event.addListener(autocomplete[curmid], 'place_changed', function() {
					fillInAddress(curmid);
				});
			}
			if (document.getElementById('wpgmza_ugm_add_address_'+curmid) !== null && WPGMZA.settings.engine == "google-maps") {

				/* initialize the autocomplete form */
				  autocomplete[curmid] = new google.maps.places.Autocomplete(
					  /** @type {HTMLInputElement} */(document.getElementById('wpgmza_ugm_add_address_'+curmid)),
					  { fields: ["name", "formatted_address"], types: ['geocode'] });
				  /* When the user selects an address from the dropdown,
				   populate the address fields in the form. */
				  google.maps.event.addListener(autocomplete[curmid], 'place_changed', function() {
					fillInAddress(curmid);
				  });
			  }
		}
	}

	$("[id^='wpgmza_input_from_'], [id^='wpgmza_input_to_']").each(function(index, el) {
		
		if(!WPGMZA.UseMyLocationButton)
			return;
		
		var button = new WPGMZA.UseMyLocationButton(el);
		$(el).after(button.element);
		
	});
	
	//if(MYMAP[curmid].settings.)
	
});  

function searchLocations(map_id) {
    if (document.getElementById("addressInput_"+map_id) === null) { var address = null; } else { var address = document.getElementById("addressInput_"+map_id).value; }
    if (document.getElementById("nameInput_"+map_id) === null) { var search_title = null; } else { var search_title = document.getElementById("nameInput_"+map_id).value; }
    
    

    checkedCatValues = 'all';
    if (jQuery(".wpgmza_cat_checkbox_"+map_id).length > 0) { 
        var checkedCatValues = jQuery('.wpgmza_checkbox:checked').map(function() { return this.value; }).get();
        if (checkedCatValues === "" || checkedCatValues.length < 1 || checkedCatValues === 0 || checkedCatValues === "0") { checkedCatValues = 'all'; }
    }  
    if (jQuery(".wpgmza_filter_select_"+map_id).length > 0) { 
        var checkedCatValues = jQuery(".wpgmza_filter_select_"+map_id).find(":selected").val();
        if (checkedCatValues === "" || checkedCatValues.length < 1 || checkedCatValues === 0 || checkedCatValues === "0") { checkedCatValues = 'all'; }
    }


    if (address === null || address === "") {
		document.getElementById("addressInput_"+map_id).focus();
		return;
		
         //var map_center = MYMAP[map_id].map.getCenter();
        //searchLocationsNear(map_id,checkedCatValues,map_center,search_title);
    } else {

        checker = address.split(",");
        var wpgm_lat = "";
        var wpgm_lng = "";
		
        wpgm_lat = checker[0];
        wpgm_lng = checker[1];
		
		if(wpgm_lat)
			wpgm_lat = wpgm_lat.trim();
		
		if(wpgm_lng)
			wpgm_lng = wpgm_lng.trim();
		
        checker1 = parseFloat(checker[0]);
        checker2 = parseFloat(checker[1]);

		var regexNumber = /^-?\d*(\.\d+)?$/;
        var geocoder = WPGMZA.Geocoder.createInstance();
		var options = {address: address};
		
		if(wpgmaps_localize[map_id]['other_settings']['wpgmza_store_locator_restrict'])
			options.componentRestrictions = {
				country: wpgmaps_localize[map_id]['other_settings']['wpgmza_store_locator_restrict']
			};
			
		if(wpgm_lat && 
			wpgm_lng && 
			
			wpgm_lat.match(regexNumber) &&
			wpgm_lng.match(regexNumber) && 
			
			wpgm_lat >= -90 && wpgm_lat <= 90 &&
			wpgm_lng >= -180 && wpgm_lng <= 180)
		{
			// Coordinates entered, no need to geocode
			var point = new WPGMZA.LatLng(parseFloat(wpgm_lat),parseFloat(wpgm_lng));
			
			MYMAP[map_id].map.trigger({
				type: 		"storelocatorgeocodecomplete",
				results:	[point],
				status:		WPGMZA.Geocoder.SUCCESS
			});
			
			searchLocationsNear(map_id,checkedCatValues,point,search_title);
		}
		else
		{
			// Must geocode
			geocoder.geocode(options, function(results, status) {

				MYMAP[map_id].map.trigger({
					type: 		"storelocatorgeocodecomplete",
					results:	results,
					status:		status
				});
				
				if (status == WPGMZA.Geocoder.SUCCESS)
					searchLocationsNear(map_id,checkedCatValues,results[0].geometry.location,search_title);
				else
					alert(address + ' not found');
			});
		}
	}
}

/*function clearLocations(map_id)
{
	if(arguments.length == 0)
		infoWindow.forEach(function(entry,index) {
			infoWindow[index].close();
		});
	else if(infoWindow[map_id])
		infoWindow[map_id].close();
}*/

function wpgmza_get_zoom_from_radius(radius, units)
{
	// With thanks to Jeff Jason http://jeffjason.com/2011/12/google-maps-radius-to-zoom/
	
	if(units == WPGMZA.Distance.MILES)
		radius *= WPGMZA.Distance.KILOMETERS_PER_MILE;
	
	return Math.round(14-Math.log(radius)/Math.LN2);
}


function searchLocationsNear(mapid,category,center_searched,search_title) {
	
    //clearLocations(mapid);
	
	closeInfoWindow(mapid);
	
    var distance_type = document.getElementById("wpgmza_distance_type_"+mapid).value;
    var radius = document.getElementById('radiusSelect_'+mapid).value;
    var zoomie = wpgmza_get_zoom_from_radius(radius);
	
    if (parseInt(category) === 0) { category = 'all'; }
    if (category === "0") { category = 'all'; }
    if (category === "Not found") { category = 'all'; }
    if (category === null) { category = 'all'; }
    if (category.length < 1) { category = 'all'; }

    MYMAP[mapid].map.setCenter(center_searched);
    MYMAP[mapid].map.setZoom(zoomie);
    


    
    
    if (typeof wpgmaps_map_mashup[mapid] !== "undefined" && wpgmaps_map_mashup[mapid] === true) {
        wpgmaps_localize_mashup_ids[mapid].forEach(function(entry_mashup) {

            MYMAP[mapid].placeMarkers(wpgmaps_markerurl+entry_mashup+'markers.xml?u='+UniqueCode,mapid,category,radius,center_searched,distance_type,search_title,true);
        });
    } else {
        MYMAP[mapid].placeMarkers(wpgmaps_markerurl+mapid+'markers.xml?u='+UniqueCode,mapid,category,radius,center_searched,distance_type,search_title,true);
    }
    if (jQuery("#wpgmza_marker_holder_"+mapid).length > 0) {
        /* ensure that the marker list is showing (this is if the admin has chosen to hide the markers until a store locator search is done */
        jQuery("#wpgmza_marker_holder_"+mapid).show();
    }
    if( jQuery('#wpgmza_marker_list_container_'+wpgmaps_localize[entry]['id']).length > 0 ){
        jQuery('#wpgmza_marker_list_container_'+wpgmaps_localize[entry]['id']).show();                         
    }
    
	MYMAP[mapid].map.trigger({type: "storelocatorresult", center: center_searched});
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}   

function wpgmza_getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var wpgmza_open_marker = wpgmza_getUrlVars()["markerid"];
var wpgmza_open_marker_zoom = wpgmza_getUrlVars()["mzoom"];

function wpgmza_reinitialisetbl(map_id) {
    // NB: Redundant as of 7.11.01
}

function wpgmza_update_data_table(plain_table_html, map_id) {
	// NB: Redundant as of 7.11.01
}

function wpgmza_filter_marker_lists_by_array(map_id,marker_sl_array) {
	// NB: Redundant as of 7.11.01
}

function wpgmza_filter_marker_lists(wpgmza_map_id,selectedValue) {
	// NB: Redundant as of 7.11.01
}

function reset_marker_lists(wpgmza_map_id) {
	// NB: Redundant as of 7.11.01
} 

jQuery(function() {

    jQuery(window).on("load", function(){
		
        jQuery(".wpgmaps_auto_get_directions").each(function() {
            var this_bliksem = jQuery(this);
            var this_bliksem_id = jQuery(this).attr('id');
            jQuery("#wpgmaps_directions_edit_"+this_bliksem_id).show( function() {
                jQuery(this_bliksem).click();
            });

        });
		
		if(!WPGMZA.visibilityWorkaroundIntervalID)
		{
			// This should handle all cases of tabs, accordions or any other offscreen maps
			var invisibleMaps = jQuery(".wpgmza_map:hidden");
			
			WPGMZA.visibilityWorkaroundIntervalID = setInterval(function() {
				
				jQuery(invisibleMaps).each(function(index, el) {
					
					if(jQuery(el).is(":visible"))
					{
						var id = jQuery(el).attr("id").match(/\d+/);
						var map = WPGMZA.getMapByID(id);
						
						map.onElementResized();
						
						invisibleMaps.splice(invisibleMaps.toArray().indexOf(el), 1);
					}
					
				});
				
			}, 1000);
		}
		
    });

    jQuery(document).ready(function(){
        if (typeof wpgmaps_localize_marker_data !== "undefined") { document.marker_data_array = wpgmaps_localize_marker_data; }

        for (var entry in wpgmaps_localize) {
            if (jQuery("#wpgmaps_directions_notification_"+entry).length > 0) { 
                orig_fetching_directions = jQuery("#wpgmaps_directions_notification_"+entry).html();
            }
        }
        
        if (/1\.(0|1|2|3|4|5|6|7)\.(0|1|2|3|4|5|6|7|8|9)/.test(jQuery.fn.jquery)) {
            for(var entry in wpgmaps_localize) {
                document.getElementById('wpgmza_map_'+wpgmaps_localize[entry]['id']).innerHTML = 'Error: Your version of jQuery is outdated. WP Google Maps requires jQuery version 1.7+ to function correctly. Go to Maps->Settings and check the box that allows you to over-ride your current jQuery to try eliminate this problem.';
            }
        } else {

/*
            jQuery("body").on("click", ".wpgmaps_mlist_row, .wpgmaps_blist_row", function(event) {
                var wpgmza_markerid = jQuery(this).attr("mid");
                var wpgmza_mapid = jQuery(this).attr("mapid");
				
                openInfoWindow(wpgmza_markerid,wpgmza_mapid,true);
				
	            if (
					jQuery(this).parents(".wpgmza-modern-marker-listing").length < 1 && 
					!(jQuery(event.target).hasClass("wpgmza_gd")) &&
					(
						wpgmaps_localize[wpgmza_mapid].other_settings &&
						wpgmaps_localize[wpgmza_mapid].other_settings.push_in_map == ""
					)
					) {
		            jQuery('html, body').animate({
			            scrollTop: jQuery("#wpgmza_map_" + wpgmza_mapid).offset().top
		            }, 500);
	            }
            });
            jQuery("body").on("click", ".wpgmaps_blist_row", function() {
                var wpgmza_markerid = jQuery(this).attr("mid");
                var wpgmza_mapid = jQuery(this).attr("mapid");
                openInfoWindow(wpgmza_markerid,wpgmza_mapid,true);
                
            });*/
            
            jQuery("body").on("click", ".sl_use_loc", function() {
                var wpgmza_map_id = jQuery(this).attr("mid");
                jQuery('#addressInput_'+wpgmza_map_id).val(wpgmaps_lang_getting_location);

                var geocoder = WPGMZA.Geocoder.createInstance();
				var input = jQuery('#addressInput_'+wpgmza_map_id);
				
				WPGMZA.getCurrentPosition(function(result) {
					
					geocoder.geocode({
						latLng: new WPGMZA.LatLng({
							lat: result.coords.latitude,
							lng: result.coords.longitude
						})
					}, function(results, status) {
						
						if(status != WPGMZA.Geocoder.SUCCESS)
						{
							input.val(WPGMZA.localized_strings.failed_to_get_address);
							return;
						}
						
						var result = results[0];
						input.val(result);
						
					});
					
				});
            });       
            jQuery("body").on("click", "#wpgmza_use_my_location_from", function() {
                var wpgmza_map_id = jQuery(this).attr("mid");
                jQuery('#wpgmza_input_from_'+wpgmza_map_id).val(wpgmaps_lang_getting_location);

                var geocoder = WPGMZA.Geocoder.createInstance();
                geocoder.geocode({'latLng': user_location}, function(results, status) {
                  if (status == WPGMZA.Geocoder.SUCCESS) {
                    if (results[0]) {
                      jQuery('#wpgmza_input_from_'+wpgmza_map_id).val(results[0]);
                    }
                  }
                });
            });              
            jQuery("body").on("click", "#wpgmza_use_my_location_to", function() {
                var wpgmza_map_id = jQuery(this).attr("mid");
                jQuery('#wpgmza_input_to_'+wpgmza_map_id).val(wpgmaps_lang_getting_location);
                var geocoder = new WPGMZA.Geocoder.createInstance();
                geocoder.geocode({'latLng': user_location}, function(results, status) {
                  if (status == WPGMZA.Geocoder.SUCCESS) {
                    if (results[0]) {
                      jQuery('#wpgmza_input_to_'+wpgmza_map_id).val(results[0]);
                    }
                  }
                });
            });
		
            for(var entry in wpgmaps_localize) {
                jQuery("#wpgmza_map_"+wpgmaps_localize[entry]['id']).css({
                    height:wpgmaps_localize[entry]['map_height']+''+wpgmaps_localize[entry]['map_height_type'],
                    width:wpgmaps_localize[entry]['map_width']+''+wpgmaps_localize[entry]['map_width_type']

                });            
            }
            
    
            for(var entry in wpgmaps_localize) {
                InitMap(wpgmaps_localize[entry]['id'],wpgmaps_localize_cat_ids[wpgmaps_localize[entry]['id']],false);
            }

            for(var entry in wpgmaps_localize) {

                if (wpgmaps_localize_global_settings['wpgmza_default_items'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_default_items']) { wpgmza_settings_default_items = 10; } else { wpgmza_settings_default_items = parseInt(wpgmaps_localize_global_settings['wpgmza_default_items']);  }
                
                if (typeof wpgmaps_localize[entry]['other_settings']['store_locator_hide_before_search'] !== "undefined" && wpgmaps_localize[entry]['other_settings']['store_locator_hide_before_search'] === 1) { 
                    if( jQuery('#wpgmza_marker_list_container_'+wpgmaps_localize[entry]['id']).length > 0 ){
                        jQuery('#wpgmza_marker_list_container_'+wpgmaps_localize[entry]['id']).hide();                         
                    }
                }
            }

        
        }
        
    });
    
    for(var entry in wpgmaps_localize) {

    /* general directions settings and variables */
	
	if(WPGMZA.settings.engine == "google-maps" && window.google) {
		directionsDisplay[wpgmaps_localize[entry]['id']];
		directionsService[wpgmaps_localize[entry]['id']] = new google.maps.DirectionsService();
	}
    var currentDirections = null;
    var oldDirections = [];
    var new_gps;

    if (wpgmaps_localize[entry]['styling_json'] && wpgmaps_localize[entry]['styling_json'].length && wpgmaps_localize[entry]['styling_enabled'] === "1") {
        wpgmza_adv_styling_json[wpgmaps_localize[entry]['id']] = wpgmza_parse_theme_data(wpgmaps_localize[entry]['styling_json']);
    } else {
        wpgmza_adv_styling_json[wpgmaps_localize[entry]['id']] = "";
    }


    MYMAP[wpgmaps_localize[entry]['id']] = {
        map: null,
        bounds: null,
        mc: null
    };
	
	jQuery(document.body).on("init.wpgmza", function(event) {
		
		if(!(event.target instanceof WPGMZA.Map))
			return;
		
		MYMAP[event.target.id].customFieldFilterController = event.target.customFieldFilterController;
		
	});

    if (wpgmaps_localize_global_settings['wpgmza_settings_map_draggable'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_draggable']) { wpgmza_settings_map_draggable = true; } else { wpgmza_settings_map_draggable = false;  }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_clickzoom'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_clickzoom']) { wpgmza_settings_map_clickzoom = false; } else { wpgmza_settings_map_clickzoom = true; }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_scroll'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_scroll']) { wpgmza_settings_map_scroll = true; } else { wpgmza_settings_map_scroll = false; }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_zoom'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_zoom']) { wpgmza_settings_map_zoom = true; } else { wpgmza_settings_map_zoom = false; }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_pan'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_pan']) { wpgmza_settings_map_pan = true; } else { wpgmza_settings_map_pan = false; }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_type'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_type']) { wpgmza_settings_map_type = true; } else { wpgmza_settings_map_type = false; }
    if (wpgmaps_localize_global_settings['wpgmza_settings_map_streetview'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_streetview']) { wpgmza_settings_map_streetview = true; } else { wpgmza_settings_map_streetview = false; }


    if ('undefined' === typeof wpgmaps_localize[entry]['other_settings']['map_max_zoom'] || wpgmaps_localize[entry]['other_settings']['map_max_zoom'] === "") { wpgmza_max_zoom = 0; } else { wpgmza_max_zoom = parseInt(wpgmaps_localize[entry]['other_settings']['map_max_zoom']); }
    if ('undefined' === typeof wpgmaps_localize[entry]['other_settings']['map_min_zoom'] || wpgmaps_localize[entry]['other_settings']['map_min_zoom'] === "") { wpgmza_min_zoom = 21; } else { wpgmza_min_zoom = parseInt(wpgmaps_localize[entry]['other_settings']['map_min_zoom']); }


    
    MYMAP[wpgmaps_localize[entry]['id']].init = function(selector, latLng, zoom, maptype, mapid) {
		
		var $ = jQuery;
		
		if(WPGMZA.googleAPIStatus && WPGMZA.googleAPIStatus.code == "USER_CONSENT_NOT_GIVEN")
		{
			$("#wpgmza_map, .wpgmza_map").each(function(index, el) {
				$(el).append($(WPGMZA.api_consent_html));
				$(el).css({height: "auto"});
			});
			
			$("button.wpgmza-api-consent").on("click", function(event) {
				Cookies.set("wpgmza-api-consent-given", true);
				window.location.reload();
			});
			
			return;
		}
		
        if (typeof wpgmaps_localize_map_types !== "undefined") {
            var override_type = wpgmaps_localize_map_types[mapid];
        } else {
            var override_type = "";
        }

        var myOptions = {
                zoom:zoom,
                minZoom: wpgmza_max_zoom,
                maxZoom: wpgmza_min_zoom,
                center: latLng,
                draggable: wpgmza_settings_map_draggable,
                disableDoubleClickZoom: wpgmza_settings_map_clickzoom,
                scrollwheel: wpgmza_settings_map_scroll,
                zoomControl: wpgmza_settings_map_zoom,
                panControl: wpgmza_settings_map_pan,
                mapTypeControl: wpgmza_settings_map_type,
                streetViewControl: wpgmza_settings_map_streetview
        };
		
		if(WPGMZA.settings.engine == "google-maps" && window.google)
		{
			myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
			
			if (override_type !== "") {
				if (override_type === "ROADMAP") { myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP; }
				else if (override_type === "SATELLITE") { myOptions.mapTypeId = google.maps.MapTypeId.SATELLITE; }
				else if (override_type === "HYBRID") { myOptions.mapTypeId = google.maps.MapTypeId.HYBRID; }
				else if (override_type === "TERRAIN") { myOptions.mapTypeId = google.maps.MapTypeId.TERRAIN; } 
				else { myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP; }
			} else {
				if (maptype === "1") { myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP; }
				else if (maptype === "2") { myOptions.mapTypeId = google.maps.MapTypeId.SATELLITE; }
				else if (maptype === "3") { myOptions.mapTypeId = google.maps.MapTypeId.HYBRID; }
				else if (maptype === "4") { myOptions.mapTypeId = google.maps.MapTypeId.TERRAIN; }
				else { myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP; }
			}
			
			if(typeof wpgmza_force_greedy_gestures !== "undefined"){
				myOptions.gestureHandling = wpgmza_force_greedy_gestures;
			}

			if (wpgmaps_localize_global_settings['wpgmza_settings_map_full_screen_control'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_full_screen_control']) { 
				myOptions.fullscreenControl = true;
			} else {
				myOptions.fullscreenControl = false;
			}
		}

		var themeData = wpgmaps_localize[mapid]['other_settings']['wpgmza_theme_data'];
        if (themeData && themeData.length) {
            myOptions.styles = wpgmza_parse_theme_data(themeData);
        }
		
		var element = jQuery(selector)[0];
		element.setAttribute("data-map-id", mapid);
        element.setAttribute("data-maps-engine", WPGMZA.settings.engine);
		this.map = WPGMZA.Map.createInstance(element, myOptions);
		
		/*var themeData = wpgmaps_localize[mapid]['other_settings']['wpgmza_theme_data'];
        if (themeData && themeData.length) {
			var obj = wpgmza_parse_theme_data(themeData);
            this.map.setOptions({styles: obj});
        }*/

        if (WPGMZA.settings.engine == "google-maps" && override_type === "STREETVIEW") {
            var panoramaOptions = {
                position: latLng
              };
            var panorama = new google.maps.StreetViewPanorama(jQuery(selector)[0], panoramaOptions);
            this.map.setStreetView(panorama);
        }

		this.bounds = new WPGMZA.LatLngBounds();
		
        jQuery( "#wpgmza_map_"+mapid).trigger( 'wpgooglemaps_loaded' );
                
        /* insert polygon and polyline functionality */
        if (wpgmaps_localize_heatmap_settings !== null) {
            if (typeof wpgmaps_localize_heatmap_settings[mapid] !== "undefined") {
                  for(var poly_entry in wpgmaps_localize_heatmap_settings[mapid]) {
                    add_heatmap(mapid,poly_entry);
                  }
            }
        }
        if (wpgmaps_localize_polygon_settings !== null) {
            if (typeof wpgmaps_localize_polygon_settings[mapid] !== "undefined") {
                  for(var poly_entry in wpgmaps_localize_polygon_settings[mapid]) {
                    add_polygon(mapid,poly_entry);
                  }
            }
        }
        if (wpgmaps_localize_polyline_settings !== null) {
            if (typeof wpgmaps_localize_polyline_settings[mapid] !== "undefined") {
                  for(var poly_entry in wpgmaps_localize_polyline_settings[mapid]) {
                    add_polyline(mapid,poly_entry);
                  }
            }
        }
		
		if(window.wpgmza_circle_data_array[mapid]) {
			window.circle_array = [];
			
			for(var circle_id in wpgmza_circle_data_array[mapid]) {
				
				// Check that this belongs to the array itself, as opposed to its prototype, or else this will break if you add methods to the array prototype (please don't extend the native types)
				if(!wpgmza_circle_data_array[mapid].hasOwnProperty(circle_id))
					continue;
				
				add_circle(mapid, wpgmza_circle_data_array[mapid][circle_id]);
			}
		}
		
		if(window.wpgmza_rectangle_data_array[mapid]) {
			window.rectangle_array = [];
			
			for(var rectangle_id in wpgmza_rectangle_data_array[mapid]) {
				
				// Check that this belongs to the array itself, as opposed to its prototype, or else this will break if you add methods to the array prototype (please don't extend the native types)
				if(!wpgmza_rectangle_data_array[mapid].hasOwnProperty(rectangle_id))
					continue;
				
				add_rectangle(mapid, wpgmza_rectangle_data_array[mapid][rectangle_id]);
				
			}
		}
		
		if(wpgmaps_localize[mapid].other_settings)
		{
			if(wpgmaps_localize[mapid].other_settings.store_locator_style == 'modern')
			{
				function bind(bind_id) {
					setTimeout(function() {
						MYMAP[bind_id].storeLocator = WPGMZA.ModernStoreLocator.createInstance(bind_id);
					}, 1);
				}
				bind(mapid);
			}
			
			if(wpgmaps_localize[mapid].other_settings.directions_box_style == 'modern')
			{
				function bind(bind_id) {
					setTimeout(function() {
						MYMAP[bind_id].directionsBox = new WPGMZA.ModernDirectionsBox(bind_id);
					}, 1);
				}
				bind(mapid);
			}
		}
		 
		if(WPGMZA.settings.engine == "google-maps")
		{
			if (wpgmaps_localize[mapid]['bicycle'] === "1") {
				var bikeLayer = new google.maps.BicyclingLayer();
				bikeLayer.setMap(MYMAP[mapid].map.googleMap);
			}
			if (wpgmaps_localize[mapid]['traffic'] === "1") {
				var trafficLayer = new google.maps.TrafficLayer();
				trafficLayer.setMap(MYMAP[mapid].map.googleMap);
			}        
			if ("undefined" !== typeof wpgmaps_localize[mapid]['other_settings']['weather_layer'] && wpgmaps_localize[mapid]['other_settings']['weather_layer'] === 1) {
				if ("undefined" === typeof google.maps.weather) { } else {
					if ("undefined" !== typeof wpgmaps_localize[mapid]['other_settings']['weather_layer_temp_type'] && wpgmaps_localize[mapid]['other_settings']['weather_layer_temp_type'] === 2) {
						var weatherLayer = new google.maps.weather.WeatherLayer({ 
							temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
						});
						weatherLayer.setMap(MYMAP[mapid].map.googleMap);
					} else {
						var weatherLayer = new google.maps.weather.WeatherLayer({ 
							temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
						});
						weatherLayer.setMap(MYMAP[mapid].map.googleMap);
					}
				}
			}        
			if ("undefined" !== typeof wpgmaps_localize[mapid]['other_settings']['cloud_layer'] && wpgmaps_localize[mapid]['other_settings']['cloud_layer'] === 1) {
				if ("undefined" === typeof google.maps.weather) { } else {
					var cloudLayer = new google.maps.weather.CloudLayer();
					cloudLayer.setMap(MYMAP[mapid].map.googleMap);
				}
			}        
			if ("undefined" !== typeof wpgmaps_localize[mapid]['other_settings']['transport_layer'] && wpgmaps_localize[mapid]['other_settings']['transport_layer'] === 1) {
					var transitLayer = new google.maps.TransitLayer();
					transitLayer.setMap(MYMAP[mapid].map.googleMap);
			}        
			if (wpgmaps_localize[mapid]['kml'] !== "") {
				var wpgmaps_d = new Date();
				var wpgmaps_ms = wpgmaps_d.getTime();
				
				arr = wpgmaps_localize[mapid]['kml'].split(',');
				arr.forEach(function(entry) {
					var georssLayer = new google.maps.KmlLayer(entry+'?tstamp='+wpgmaps_ms,{preserveViewport: true});
					georssLayer.setMap(MYMAP[mapid].map.googleMap);
				});


				
			}        
			if (wpgmaps_localize[mapid]['fusion'] !== "") {
				var fusionlayer = new google.maps.FusionTablesLayer(wpgmaps_localize[mapid]['fusion'], {
					  suppressInfoWindows: false
				});
				fusionlayer.setMap(MYMAP[mapid].map.googleMap);
			}        



			if (typeof wpgmaps_localize[mapid]['other_settings']['push_in_map'] !== 'undefined' && 
				wpgmaps_localize[mapid]['other_settings']['push_in_map'] === "1" && 
				wpgmaps_localize[mapid].other_settings.list_markers_by != WPGMZA.MarkerListing.STYLE_MODERN) {


				if (typeof wpgmaps_localize[mapid]['other_settings']['wpgmza_push_in_map_width'] !== 'undefined') {
					var wpgmza_con_width = wpgmaps_localize[mapid]['other_settings']['wpgmza_push_in_map_width'];
				} else {
					var wpgmza_con_width = "30%";
				}
				if (typeof wpgmaps_localize[mapid]['other_settings']['wpgmza_push_in_map_height'] !== 'undefined') {
					var wpgmza_con_height = wpgmaps_localize[mapid]['other_settings']['wpgmza_push_in_map_height'];
				} else {
					var wpgmza_con_height = "50%";
				}

				if (jQuery('#wpgmza_marker_holder_'+mapid).length) {
					var legend = document.getElementById('wpgmza_marker_holder_'+mapid);
					jQuery(legend).width(wpgmza_con_width);
					jQuery(legend).css('margin','15px');
					jQuery(legend).addClass('wpgmza_innermap_holder');
					jQuery(legend).addClass('wpgmza-shadow');
					jQuery('#wpgmza_table_'+mapid).addClass('');
					wpgmza_controls_active[mapid] = true;
				} else if (jQuery('#wpgmza_marker_list_container_'+mapid).length) {
					var legend_tmp = document.getElementById('wpgmza_marker_list_container_'+mapid);
					
					jQuery('#wpgmza_marker_list_container_'+mapid).wrap("<div id='wpgmza_marker_list_parent_"+mapid+"'></div>");
					var legend = document.getElementById('wpgmza_marker_list_parent_'+mapid);
					jQuery(legend).width(wpgmza_con_width);
					jQuery(legend).height(wpgmza_con_height);

					jQuery(legend).css('margin','15px');
					jQuery(legend).css('overflow','auto');

					/* check if we're using the carousel option */
					if (jQuery(legend_tmp).hasClass("wpgmza_marker_carousel")) { } else {
						jQuery(legend).addClass('wpgmza_innermap_holder');
						jQuery(legend).addClass('wpgmza-shadow');
					}

					jQuery('#wpgmza_marker_list_'+mapid).addClass('');
					wpgmza_controls_active[mapid] = true;

				} else if (jQuery('#wpgmza_marker_list_'+mapid).length) {
					var legend_tmp = document.getElementById('wpgmza_marker_list_'+mapid);
					
					jQuery('#wpgmza_marker_list_'+mapid).wrap("<div id='wpgmza_marker_list_parent_"+mapid+"'></div>");
					var legend = document.getElementById('wpgmza_marker_list_parent_'+mapid);
					jQuery(legend).width(wpgmza_con_width);
					jQuery(legend).height(wpgmza_con_height);

					jQuery(legend).css('margin','15px');
					jQuery(legend).css('overflow','auto');

					/* check if we're using the carousel option */
					if (jQuery(legend_tmp).hasClass("wpgmza_marker_carousel")) { } else {
						jQuery(legend).addClass('wpgmza_innermap_holder');
						jQuery(legend).addClass('wpgmza-shadow');
					}

					jQuery('#wpgmza_marker_list_'+mapid).addClass('');
					wpgmza_controls_active[mapid] = true;
				}
				
				if (typeof legend !== 'undefined' &&
					typeof wpgmaps_localize[mapid]['other_settings']['push_in_map_placement'] !== 'undefined')
				{
					var position;
					
					switch(wpgmaps_localize[mapid]['other_settings']['push_in_map_placement'])
					{
						case "1":
						default:
							position = google.maps.ControlPosition.TOP_CENTER;
							break;
							
						case "2":
							position = google.maps.ControlPosition.TOP_LEFT;
							break;
							
						case "3":
							position = google.maps.ControlPosition.TOP_RIGHT;
							break;
							
						case "4":
							position = google.maps.ControlPosition.LEFT_TOP;
							break;
							
						case "5":
							position = google.maps.ControlPosition.RIGHT_TOP;
							break;
							
						case "6":
							position = google.maps.ControlPosition.LEFT_CENTER;
							break;
							
						case "7":
							position = google.maps.ControlPosition.RIGHT_CENTER;
							break;
							
						case "8":
							position = google.maps.ControlPosition.LEFT_BOTTOM;
							break;
							
						case "9":
							position = google.maps.ControlPosition.RIGHT_BOTTOM;
							break;
							
						case "10":
							position = google.maps.ControlPosition.BOTTOM_CENTER;
							break;
							
						case "11":
							position = google.maps.ControlPosition.BOTTOM_LEFT;
							break;
							
						case "12":
							position = google.maps.ControlPosition.BOTTOM_RIGHT;
							break;
					}
					
					MYMAP[mapid].map.googleMap.controls[position].push(legend);
				}
			
			}
		}
    };    

    jQuery(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function() {
        var isFullScreen = document.fullScreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen;
        var modernMarkerButton = jQuery('.wpgmza-modern-marker-open-button');
        var modernPopoutPanel = jQuery('.wpgmza-popout-panel');
        var modernStoreLocator = jQuery('.wpgmza-modern-store-locator');
        var fullScreenMap = undefined;
        if (modernMarkerButton.length) {
            fullScreenMap = modernMarkerButton.parent('.wpgmza_map').children('div').first();
        } else if (modernPopoutPanel.length) {
            fullScreenMap = modernPopoutPanel.parent('.wpgmza_map').children('div').first();
        } else {
            fullScreenMap = modernStoreLocator.parent('.wpgmza_map').children('div').first();
        }
        if (isFullScreen && typeof fullScreenMap !== "undefined") {
            fullScreenMap.append(modernMarkerButton, modernPopoutPanel, modernStoreLocator);
        }
    });



    MYMAP[wpgmaps_localize[entry]['id']].placeMarkers = function(filename,map_id,cat_id,radius,searched_center,distance_type,search_title,show_markers) {

		if(WPGMZA.googleAPIStatus && WPGMZA.googleAPIStatus.code == "USER_CONSENT_NOT_GIVEN")
			return;
	
        var total_marker_cat_count;
        var slNotFoundMessage = jQuery('.js-not-found-msg');
        var markerStoreLocatorsNum = 0;
        if( Object.prototype.toString.call( cat_id ) === '[object Array]' ) {
            total_marker_cat_count = Object.keys(cat_id).length;
        } else {
            total_marker_cat_count = 1;
        }

        if (typeof marker_array[map_id] !== "undefined") {
            for (var i = 0; i < marker_array[map_id].length; i++) {
                /* remove any instance of a marker first tio avoid using a full reinit which causes the map to flicker */
                if (typeof marker_array[map_id][i] !== 'undefined') { 
                    
                    marker_array[map_id][i].setMap(null);
                    /* Check which map we are working on, and only reset the correct markers. (Store locator, etc) */
                }
            }
        }

        /* reset store locator circle */
        if (typeof cityCircle[map_id] !== "undefined") {
            cityCircle[map_id].setMap(null);
        }

        /* reset store locator i` if any */
        if (typeof store_locator_marker[map_id] !== "undefined") {
            store_locator_marker[map_id].setMap(null);
        }

        marker_array[map_id] = new Array(); 
        marker_sl_array[map_id] = new Array(); 
        marker_array2[map_id] = new Array(); 
        

        if (show_markers || typeof show_markers === "undefined") { 
            
            if (typeof wpgm_g_e !== "undefined" && wpgm_g_e === '1') {
                var mcOptions = {
                    gridSize: 20,
                    maxZoom: 15,
                    styles: [{
                        height: 53,
                        url: "//ccplugins.co/markerclusterer/images/m1.png",
                        width: 53
                    },
                    {
                        height: 56,
                        url: "//ccplugins.co/markerclusterer/images/m2.png",
                        width: 56
                    },
                    {
                        height: 66,
                        url: "//ccplugins.co/markerclusterer/images/m3.png",
                        width: 66
                    },
                    {
                        height: 78,
                        url: "//ccplugins.co/markerclusterer/images/m4.png",
                        width: 78
                    },
                    {
                        height: 90,
                        url: "//ccplugins.co/markerclusterer/images/m5.png",
                        width: 90
                    }] 
                };


                if(typeof wpgmaps_custom_cluster_options !== "undefined"){
                    var customMcOptions = {};

                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_grid_size'] !== "undefined"){ customMcOptions['gridSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_grid_size']); } else { customMcOptions['gridSize'] = mcOptions['gridSize']; }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_max_zoom'] !== "undefined"){ customMcOptions['maxZoom'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_max_zoom']); } else { customMcOptions['maxZoom'] = mcOptions['maxZoom']; }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_min_cluster_size'] !== "undefined"){ customMcOptions['minimumClusterSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_min_cluster_size']); } 
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_zoom_click'] !== "undefined"){ customMcOptions['zoomOnClick'] = true; } else { customMcOptions['zoomOnClick'] = false; }


                    var level1 = {};
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level1'] !== "undefined"){ level1['url'] = wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level1'].replace(/%2F/g,"/"); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level1_width'] !== "undefined"){ level1['width'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level1_width']); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level1_height'] !== "undefined"){ level1['height'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level1_height']); }

                    var level2 = {};
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level2'] !== "undefined"){ level2['url'] = wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level2'].replace(/%2F/g,"/"); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level2_width'] !== "undefined"){ level2['width'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level2_width']); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level2_height'] !== "undefined"){ level2['height'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level2_height']); }

                    var level3 = {};
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level3'] !== "undefined"){ level3['url'] = wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level3'].replace(/%2F/g,"/"); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level3_width'] !== "undefined"){ level3['width'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level3_width']); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level3_height'] !== "undefined"){ level3['height'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level3_height']); }

                    var level4 = {};
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level4'] !== "undefined"){ level4['url'] = wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level4'].replace(/%2F/g,"/"); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level4_width'] !== "undefined"){ level4['width'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level4_width']); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level4_height'] !== "undefined"){ level4['height'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level4_height']); }

                    var level5 = {};
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level5'] !== "undefined"){ level5['url'] = wpgmaps_custom_cluster_options['wpgmza_gold_cluster_level5'].replace(/%2F/g,"/"); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level5_width'] !== "undefined"){ level5['width'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level5_width']); }
                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_level5_height'] !== "undefined"){ level5['height'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_level5_height']); }


                    if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'] !== "undefined"){
                        level1['textColor'] = wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'];
                        level2['textColor'] = wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'];
                        level3['textColor'] = wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'];
                        level4['textColor'] = wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'];
                        level5['textColor'] = wpgmaps_custom_cluster_options['wpgmza_cluster_font_color'];                       
                    }

                     if(typeof wpgmaps_custom_cluster_options['wpgmza_cluster_font_size'] !== "undefined"){
                        level1['textSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_font_size']);
                        level2['textSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_font_size']);
                        level3['textSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_font_size']);
                        level4['textSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_font_size']);
                        level5['textSize'] = parseInt(wpgmaps_custom_cluster_options['wpgmza_cluster_font_size']);                       
                    }

                    customMcOptions['styles'] = [ level1, level2, level3, level4, level5 ];

                    mcOptions = customMcOptions; //Override
                }

                if (wpgmaps_localize[map_id]['mass_marker_support'] === "1" || wpgmaps_localize[map_id]['mass_marker_support'] === null) { 
				
                    if (typeof markerClusterer[map_id] !== "undefined") { markerClusterer[map_id].clearMarkers(); }
					
					if(WPGMZA.MarkerClusterer && !wpgmzaForceLegacyMarkerClusterer)
					{
						markerClusterer[map_id] = new WPGMZA.MarkerClusterer(MYMAP[map_id].map, null, mcOptions)
						MYMAP[map_id].map.markerClusterer = markerClusterer[map_id];
					}
					else
						markerClusterer[map_id] = new MarkerClusterer(MYMAP[map_id].map.googleMap, null, mcOptions);
					
                }
            }

            var check1 = 0;

            if (wpgmaps_localize_global_settings['wpgmza_settings_image_width'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_image_width']) { wpgmaps_localize_global_settings['wpgmza_settings_image_width'] = 'auto'; } else { wpgmaps_localize_global_settings['wpgmza_settings_image_width'] = wpgmaps_localize_global_settings['wpgmza_settings_image_width']+'px'; }
            if (wpgmaps_localize_global_settings['wpgmza_settings_image_height'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_image_height']) { wpgmaps_localize_global_settings['wpgmza_settings_image_height'] = 'auto'; } else { wpgmaps_localize_global_settings['wpgmza_settings_image_height'] = wpgmaps_localize_global_settings['wpgmza_settings_image_height']+'px'; }

			
			function iterateOverMarkerData(arr)
			{
				/* document.marker_data_array[map_id] */
				jQuery.each(arr, function(i, val) {
					
					if(!val)
						return;
					
					var wpgmza_def_icon = wpgmaps_localize[map_id]['default_marker'];
					

					/*
						removed due to mashup incompatibilities. If used, it tries to push the marker to the markers original ID instead of the MASHUP MAP ID.
						var wpmgza_map_id = val.map_id;
					
					*/ 
					var wpmgza_map_id = map_id;
					

					var wpmgza_marker_id = val.marker_id;

					var wpmgza_title = val.title;
					var wpgmza_orig_title = wpmgza_title;
					if (wpmgza_title !== "") {
						var wpmgza_title = '<p class="wpgmza_infowindow_title">'+val.title+'</p>';
					}
					var wpmgza_address = val.address;
					if (wpmgza_address !== "") {
						var wpmgza_show_address = '<p class="wpgmza_infowindow_address">'+wpmgza_address+'</p>';
					} else {
						var wpmgza_show_address = '';
					}
					var wpmgza_mapicon = val.icon;
					var wpmgza_image = val.pic;
					var wpmgza_desc  = val.desc;
					var wpgmza_orig_desc = wpmgza_desc;
					if (wpmgza_desc !== "") {
						var wpmgza_desc = '<div class="wpgmza_infowindow_description">'+val.desc;+'</div>';
					}
					var wpmgza_linkd = val.linkd;
					var wpmgza_linkd_orig = wpmgza_linkd;

					var wpmgza_anim  = val.anim;
					var wpmgza_retina  = val.retina;
					var wpmgza_category  = val.category;
					var current_lat = val.lat;
					var current_lng = val.lng;
					var show_marker_radius = true;
					var show_marker_title_string = true;

					if (typeof wpgmza_override_marker !== "undefined" && typeof wpgmza_override_marker[map_id] !== "undefined") {
						if (parseInt(wpmgza_marker_id) == parseInt(wpgmza_override_marker[map_id])) {
							/* we have a match for the focus marker, lets save the lat and lng so we can center on it when done */
							focus_lat = current_lat;
							focus_lng = current_lng;
						}
					}

					if (radius !== null) {

						// NB: Moved store locator icon logic

						if (distance_type == "1") {
							R = 3958.7558657440545;
						} else {
							R = 6378.16;
						}
						var dLat = toRad(searched_center.lat-current_lat);
						var dLon = toRad(searched_center.lng-current_lng); 
						var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRad(current_lat)) * Math.cos(toRad(searched_center.lat)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
						var d = R * c;
						
						if (d < radius) { show_marker_radius = true; markerStoreLocatorsNum++; } else { show_marker_radius = false; }


						/* check if they have done a title search too */
						if (search_title === null || search_title === "") { show_marker_title_string = true; }
						else {
							var x = wpgmza_orig_title.toLowerCase().search(search_title.toLowerCase());
							var y = wpgmza_orig_desc.toLowerCase().search(search_title.toLowerCase());
							if (x >= 0 || y >= 0) {
								show_marker_title_string = true;
							} else {
								show_marker_title_string = false;
							}

						}



					}

					var wpmgza_infoopen  = val.infoopen;
					if (wpmgza_image !== "") {
						var maxImageWidth = "inherit";
						if(/^\d+$/.test(wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width']))
							maxImageWidth = wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'] + "px";
					
						if ('undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_image_resizing'] || wpgmaps_localize_global_settings['wpgmza_settings_image_resizing'] === "yes") {
								wpmgza_image = "<img src=\""+wpmgza_image+"\" title=\"\" class=\"wpgmza_infowindow_image\" alt=\"\" style=\"float:right; width:"+wpgmaps_localize_global_settings['wpgmza_settings_image_width']+"; height:"+wpgmaps_localize_global_settings['wpgmza_settings_image_height']+"; max-width:" + maxImageWidth + " !important;\" />";

							} else {
								wpmgza_image = "<img src=\""+wpmgza_image+"\" class=\"wpgmza_infowindow_image wpgmza_map_image\" style=\"float:right; margin:5px; max-width:" + maxImageWidth + " !important;\" />";
						}
					}

					if (wpmgza_linkd !== "") {
						if (wpgmaps_localize_global_settings['wpgmza_settings_infowindow_links'] === "yes") { wpgmza_iw_links_target = "target='_BLANK'";  }
						else { wpgmza_iw_links_target = ''; }
						wpmgza_linkd = "<p class=\"wpgmza_infowindow_link\"><a class=\"wpgmza_infowindow_link\" href=\""+wpmgza_linkd+"\" "+wpgmza_iw_links_target+" title=\""+wpgmaps_lang_more_details+"\">"+wpgmaps_lang_more_details+"</a></p>";
					} else {
						wpgmza_iw_links_target = "";
					}

					if (wpmgza_mapicon === "" || !wpmgza_mapicon) { if (wpgmza_def_icon !== "") { wpmgza_mapicon = wpgmaps_localize[map_id]['default_marker']; } }
					var wpgmza_optimized = true;
					
					if(WPGMZA.settings.engine != "open-layers" && wpmgza_retina === "1" && wpmgza_mapicon !== "0") {
						wpmgza_mapicon = new google.maps.MarkerImage(wpmgza_mapicon, null, null, null, new google.maps.Size(wpgmza_retina_width,wpgmza_retina_height));
						wpgmza_optimized = false;
					}


					var lat = val.lat;
					var lng = val.lng;
					var point = new WPGMZA.LatLng(lat, lng);
					//MYMAP[map_id].bounds.extend(point);

					
					

					if (show_marker_radius === true && show_marker_title_string === true) {
						
						var options = jQuery.extend(val, {
							id: val.marker_id,
							position: point,
							map: MYMAP[map_id].map,
							animation: wpmgza_anim,
							optimized: wpgmza_optimized
						});
						
						if(
							(wpmgza_mapicon && wpmgza_mapicon != "0" && wpmgza_mapicon.length) 
							||
							(window.google && wpmgza_mapicon && wpmgza_mapicon instanceof google.maps.MarkerImage)
							)
							options.icon = wpmgza_mapicon;
						
						var marker = WPGMZA.Marker.createInstance(options);

						if (wpgmaps_localize_global_settings['wpgmza_settings_infowindow_address'] === "yes") {
							wpmgza_show_address = "";
						}
						if (wpgmaps_localize[entry]['directions_enabled'] === "1" && WPGMZA.settings.engine == "google-maps") {
							wpmgza_dir_enabled = '<p><a href="javascript:void(0);" id="'+map_id+'" data-map-id="'+map_id+'" class="wpgmza_gd" wpgm_addr_field="'+wpmgza_address+'" gps="'+parseFloat(lat)+','+parseFloat(lng)+'">'+wpgmaps_lang_get_dir+'</a></p>';
						} else {
							wpmgza_dir_enabled = '';
						}
						if (radius !== null) {                                 
							if (distance_type == "1") {
								d_string = "<p>"+Math.round(d,2)+' '+wpgmaps_lang_m_away+"</p>"; 
							} else {
								d_string = "<p>"+Math.round(d,2)+' '+wpgmaps_lang_km_away+"</p>"; 
							}
						} else { d_string = ''; }
						if (wpmgza_image !== "") {
							var html='<div class="wpgmza_markerbox scrollFix">'+
								wpmgza_image+
								wpmgza_title+
								wpmgza_show_address+
								wpmgza_desc+
								wpmgza_linkd+
								d_string+
								wpmgza_dir_enabled+
								'</div>';

						} else {
							var html='<div class="wpgmza_markerbox scrollFix">'+
								wpmgza_image+
								wpmgza_title+
								wpmgza_show_address+
								wpmgza_desc+
								wpmgza_linkd+
								d_string+
								wpmgza_dir_enabled+
								'</div>';

						}
						
						if(val.custom_fields_html)
							html += val.custom_fields_html;

						var marker_data_object = {
							title: wpgmza_orig_title,
							address: wpmgza_address,
							image: val.pic,
							link: wpmgza_linkd_orig,
							directions: wpmgza_dir_enabled,
							distance: d_string,
							desc: wpgmza_orig_desc,
							gps: parseFloat(lat)+','+parseFloat(lng),
							link_target:wpgmza_iw_links_target
						};


						infoWindow[wpmgza_marker_id] = WPGMZA.InfoWindow.createInstance();
						if (wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width']) {
							wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'] = false;
						}
						if (wpmgza_infoopen === "1") {
							
							function openInfoWindowDelegate(marker_id, map_id) {
								
								setTimeout(function() {
									openInfoWindow(marker_id, map_id, false);
								}, 1000);
								
							}
							
							openInfoWindowDelegate(wpmgza_marker_id, map_id);
						}
						/* do they want to open a marker from a GET variable? */
						if (typeof wpgmza_open_marker !== "undefined") {
							if (wpgmza_open_marker === wpmgza_marker_id) { 
							
								var infoWindowOptions = {};
								
								if(wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'] && wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'] > 0)
									infoWindowOptions.maxWidth = wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width'];

								infoWindow[wpmgza_marker_id].setOptions(infoWindowOptions);
								infoWindow[wpmgza_marker_id].setContent(html);
								infoWindow[wpmgza_marker_id].open(MYMAP[map_id].map, marker);
								MYMAP[map_id].map.setCenter(point);
								if (typeof wpgmza_open_marker_zoom !== "undefined") {
									MYMAP[map_id].map.setZoom(parseInt(wpgmza_open_marker_zoom));
								}
							}
						}
						if (typeof wpgmaps_localize[map_id]['other_settings']['click_open_link'] !== "undefined" && wpgmaps_localize[map_id]['other_settings']['click_open_link'] === 1 && typeof wpmgza_linkd_orig !== "undefined" && wpmgza_linkd_orig !== "") {


							marker.on("click", function(evt) {
								location = wpmgza_linkd_orig;
							}); 
						}
						

						var eventType = "click";
						
						if (wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] || wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] === '1') 
							eventType = "click";
						else
							eventType = "mouseover";
							
						if(WPGMZA.isTouchDevice())
							eventType = "click";
						
						marker.on(eventType, function(evt) {
							if (typeof val.other_data !== "undefined" && typeof val.other_data.icon_on_click !== "undefined" && val.other_data.icon_on_click !== "") {
								marker.setIcon(val.other_data.icon_on_click);
							}
							wpgmza_open_marker_func(map_id,marker,html,click_from_list,marker_data_object,wpmgza_marker_id,val);
						}); 
						
						var map = WPGMZA.getMapByID(map_id);
						marker.initInfoWindow();
						marker.infoWindow.setContent(html);
						
						marker_array[map_id][wpmgza_marker_id] = marker;
						marker_array[map_id][wpmgza_marker_id].default_icon = marker.icon;

						marker_array2[map_id].push(marker);
						marker_sl_array[map_id].push(wpmgza_marker_id);

						

					}
				 

					
				});
				
				if (typeof wpgm_g_e !== "undefined" && wpgm_g_e === '1') {

					if (wpgmaps_localize[map_id]['mass_marker_support'] === "1" || wpgmaps_localize[map_id]['mass_marker_support'] === null) { 
						if (typeof markerClusterer[map_id] !== "undefined") 
						{ 
							var wpgmzaMarkers = marker_array2[map_id];
							
							if(WPGMZA.MarkerClusterer && !wpgmzaForceLegacyMarkerClusterer)
							{
								markerClusterer[map_id].addMarkers(wpgmzaMarkers);
							}
							else
							{
								var googleMarkers = wpgmzaMarkers.map(function(marker) {
									return marker.googleMarker;
								});
							
								markerClusterer[map_id].addMarkers(googleMarkers); 
							}
						}
					}
				}

				if (radius !== null) {
					wpgmza_filter_marker_lists_by_array(map_id,marker_sl_array[map_id]);
				}

				if ('' !== jQuery('.addressInput').val() && markerStoreLocatorsNum < 1) {
					slNotFoundMessage.addClass('is-active');
					setTimeout(function () {
						slNotFoundMessage.removeClass('is-active');
					}, 5000);
				}
				
				jQuery(window).trigger("markerdataparsed.wpgmza");
				MYMAP[map_id].map.trigger("markersplaced");
			}
			
			if(marker_pull == "1")
			{
				
				if(window.wpgmaps_localize_marker_data && wpgmaps_localize_marker_data[map_id])
					iterateOverMarkerData(wpgmaps_localize_marker_data[map_id]);
				else
					jQuery.get(filename, function(xml) {
						
						var converter = new WPGMZA.XMLCacheConverter();
						var converted = converter.convert(xml);
						
						if(!window.wpgmaps_localize_marker_data)
							window.wpgmaps_localize_marker_data = [];
						
						wpgmaps_localize_marker_data[map_id] = converted;
						iterateOverMarkerData(converted);
						
					});
			}
			else
			{
				iterateOverMarkerData(document.marker_data_array[map_id]);
			}
			
			if(check1 == 0 && radius !== null) {
				var sl_stroke_color = wpgmaps_localize[map_id]['other_settings']['sl_stroke_color'];
				if (sl_stroke_color !== "" || sl_stroke_color !== null) {}
				else {
					sl_stroke_color = 'FF0000';
				}
				var sl_stroke_opacity = wpgmaps_localize[map_id]['other_settings']['sl_stroke_opacity'];
				if (sl_stroke_opacity !== "" || sl_stroke_opacity !== null) {}
				else {
					sl_stroke_opacity = '0.25';
				}
				var sl_fill_opacity = wpgmaps_localize[map_id]['other_settings']['sl_fill_opacity'];
				if (sl_fill_opacity !== "" || sl_fill_opacity !== null) {}
				else {
					sl_fill_opacity = '0.15';
				}
				var sl_fill_color = wpgmaps_localize[map_id]['other_settings']['sl_fill_color'];
				if (sl_fill_color !== "" || sl_fill_color !== null) {}
				else {
					sl_fill_color = 'FF0000';
				}

				var point = new WPGMZA.LatLng(parseFloat(searched_center.lat), parseFloat(searched_center.lng));
				MYMAP[map_id].bounds.extend(point);

				if (wpgmaps_localize[map_id]['other_settings']['store_locator_bounce'] === 1) {
					if ("undefined" !== typeof wpgmaps_localize[map_id]['other_settings']['upload_default_sl_marker']) {
						store_locator_marker[map_id] = WPGMZA.Marker.createInstance({
								position: point,
								map: MYMAP[map_id].map,
								icon: wpgmaps_localize[map_id]['other_settings']['upload_default_sl_marker']
							});

					} else {
						store_locator_marker[map_id] = WPGMZA.Marker.createInstance({
								position: point,
								map: MYMAP[map_id].map

							});
					}
					if (typeof wpgmaps_localize[map_id]['other_settings']['wpgmza_sl_animation'] !== "undefined") {
						if (wpgmaps_localize[map_id]['other_settings']['wpgmza_sl_animation'] === '1') {
							store_locator_marker[map_id].setAnimation(WPGMZA.Marker.ANIMATION_BOUNCE);
						} else if (wpgmaps_localize[map_id]['other_settings']['wpgmza_sl_animation'] === '2') {
							store_locator_marker[map_id].setAnimation(WPGMZA.Marker.ANIMATION_DROP);
						} else {
							store_locator_marker[map_id].setAnimation(null);
						}

					}
					
					MYMAP[map_id].map.storeLocatorMarker = store_locator_marker[map_id];

				} else {
					/* do nothing */
				}

				var factor = (distance_type == "1" ? 0.000621371 : 0.001);
				var options = {
					strokeColor: '#' + sl_stroke_color,
					strokeOpacity: sl_stroke_opacity,
					strokeWeight: 2,
					fillColor: '#' + sl_fill_color,
					fillOpacity: sl_fill_opacity,
					map: MYMAP[map_id].map,
					center: point,
					radius: parseInt(radius / factor)
				};

				wpgmza_show_store_locator_radius(map_id, point, radius, distance_type, options);

				check1 = check1 + 1;
			}
        }
        if (wpgmaps_localize[map_id]['show_user_location'] === "1") {
            
			function bindUserLocation(map_id)
			{
				WPGMZA.watchPosition(function(position) {
					
					var marker;
					var options = {
						id: WPGMZA.guid(),
						map: MYMAP[map_id].map,
						animation: WPGMZA.Marker.ANIMATION_DROP
					};
					
					if(wpgmaps_localize[map_id]['other_settings']['upload_default_ul_marker'])
						options.icon = wpgmaps_localize[map_id]['other_settings']['upload_default_ul_marker'];
					
					if(MYMAP[map_id].map.userLocationMarker)
						marker = MYMAP[map_id].map.userLocationMarker;
					else
					{
						marker = MYMAP[map_id].map.userLocationMarker = WPGMZA.Marker.createInstance(options);
						
						infoWindow[options.id] = WPGMZA.InfoWindow.createInstance();
						marker.on("click", function(evt) {
							closeInfoWindow(map_id);

							infoWindow[options.id].setContent(wpgmaps_lang_my_location);
							infoWindow[options.id].open(MYMAP[map_id].map, marker);
						});
					}
					
					MYMAP[map_id].map.addMarker(marker);
					
					marker.setPosition({
						lat: position.coords.latitude,
						lng: position.coords.longitude
					});
					
				});
			}
			
			bindUserLocation(map_id);
			
        }

        /**
         * Identify if we need to focus on a specific LAT and LNG (focused marker)
         */
        if (focus_lat !== false && focus_lng !== false && !window.wpgmzaFocusOnShortcodeMarkerDone) {
			var point = new WPGMZA.LatLng(parseFloat(focus_lat),parseFloat(focus_lng));
            MYMAP[map_id].map.setCenter(point);
			
			window.wpgmzaFocusOnShortcodeMarkerDone = true;
        }

		var controller;
		if(WPGMZA.CustomFieldFilterController && (controller = WPGMZA.CustomFieldFilterController.controllersByMapID[map_id]))
			controller.reapplyLastResponse();
    };
    
    function wpgmza_open_marker_func(map_id,marker,html,click_from_list,marker_data,wpmgza_marker_id,val) {
		
		if (typeof val.other_data !== "undefined" && typeof val.other_data.icon_on_click !== "undefined" && val.other_data.icon_on_click !== "") {

            marker.setIcon(val.other_data.icon_on_click);
        }
		
		if(WPGMZA.settings.wpgmza_settings_disable_infowindows)
			return;
		
		var infoWindowStyle = wpgmza_get_info_window_style(map_id);
		
		if(infoWindowStyle != WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE)
		{
			jQuery('.wpgmza_modern_infowindow').show();
			jQuery('.wpgmza_modern_infowindow').css('display', 'block');
		}
		
		if(infoWindowStyle == WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE)
		{
			
		}

        if ((typeof wpgmaps_localize_global_settings['wpgmza_iw_type'] !== 'undefined' && parseInt(wpgmaps_localize_global_settings['wpgmza_iw_type']) >= 1) || (typeof wpgmaps_localize[map_id]['other_settings']['wpgmza_iw_type'] !== "undefined" && parseInt(wpgmaps_localize[map_id]['other_settings']['wpgmza_iw_type']) >= 1)) {

            
			
			

        } else {
            /*closeInfoWindow(map_id);
			
            if (wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width']) { 
                infoWindow[wpmgza_marker_id].setOptions({maxWidth:wpgmaps_localize_global_settings['wpgmza_settings_infowindow_width']});
            }
            infoWindow[wpmgza_marker_id].setContent(html);
            if (click_from_list) {
                MYMAP[map_id].map.panTo(marker.position);
                MYMAP[map_id].map.setZoom(13);
            } else {
	            if (MYMAP[map_id].markerListing instanceof WPGMZA.ModernMarkerListing) {
		            MYMAP[map_id].markerListing.markerView.open(wpmgza_marker_id);
	            }
            }
            click_from_list = false;

			if(wpgmaps_localize[map_id].other_settings && wpgmaps_localize[map_id].other_settings.list_markers_by != 6)
				infoWindow[wpmgza_marker_id].open(MYMAP[map_id].map, marker);	*/
			
			var map = WPGMZA.getMapByID(map_id);
			var marker = map.getMarkerByID(wpmgza_marker_id);
			
			marker.openInfoWindow();
			marker.infoWindow.setContent(html);
			
        }

        
        
    }
    
    function wpgmza_create_new_iw_window(mapid) {
		
		// First let's get the map from the map ID
		var map = WPGMZA.getMapByID(mapid);
		
		if(wpgmaps_localize_global_settings.wpgmza_settings_disable_infowindows)
			return;
		
		if(wpgmza_get_info_window_style(mapid) == WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE)
			return;
		
        /* handle new modern infowindow */
        if ((typeof wpgmaps_localize_global_settings['wpgmza_iw_type'] !== 'undefined' && parseInt(wpgmaps_localize_global_settings['wpgmza_iw_type']) >= 1) || (typeof wpgmaps_localize[mapid]['other_settings']['wpgmza_iw_type'] !== "undefined" && parseInt(wpgmaps_localize[mapid]['other_settings']['wpgmza_iw_type']) >= 1)) {
               
                
        }
    }
    
function add_heatmap(mapid,datasetid) {

	if(WPGMZA.settings.engine != "google-maps")
		return;

	var tmp_data = wpgmaps_localize_heatmap_settings[mapid][datasetid];
	var current_poly_id = datasetid;
	var tmp_polydata = tmp_data['polydata'];
	var WPGM_PathData = new Array();
	for (tmp_entry2 in tmp_polydata) {
		 if (typeof tmp_polydata[tmp_entry2][0] !== "undefined") {
			
			WPGM_PathData.push(new google.maps.LatLng(tmp_polydata[tmp_entry2][0], tmp_polydata[tmp_entry2][1]));
		}
	 }
	 if (tmp_data['radius'] === null || tmp_data['radius'] === "") { tmp_data['radius'] = 20; }
	 if (tmp_data['gradient'] === null || tmp_data['gradient'] === "") { tmp_data['gradient'] = null; }
	 if (tmp_data['opacity'] === null || tmp_data['opacity'] === "") { tmp_data['opacity'] = 0.6; }
	 
	 var bounds = new google.maps.LatLngBounds();
	 for (i = 0; i < WPGM_PathData.length; i++) {
	   bounds.extend(WPGM_PathData[i]);
	 }

	WPGM_Path_Polygon[datasetid] = new google.maps.visualization.HeatmapLayer({
		 data: WPGM_PathData,
		 map: MYMAP[mapid].map.googleMap
	});
	
   WPGM_Path_Polygon[datasetid].setMap(MYMAP[mapid].map.googleMap);
   var gradient = JSON.parse(tmp_data['gradient']);
   WPGM_Path_Polygon[datasetid].set('radius', tmp_data['radius']);
   WPGM_Path_Polygon[datasetid].set('opacity', tmp_data['opacity']);
   WPGM_Path_Polygon[datasetid].set('gradient', gradient);


   polygon_center = bounds.getCenter();
}

    function add_polygon(mapid,polygonid) {
		
		if(WPGMZA.settings.engine != "google-maps")
			return;
		
        var tmp_data = wpgmaps_localize_polygon_settings[mapid][polygonid];
         var current_poly_id = polygonid;
         var tmp_polydata = tmp_data['polydata'];
         var WPGM_PathData = new Array();
         for (tmp_entry2 in tmp_polydata) {
             if (typeof tmp_polydata[tmp_entry2][0] !== "undefined") {
                
                WPGM_PathData.push(new google.maps.LatLng(tmp_polydata[tmp_entry2][0], tmp_polydata[tmp_entry2][1]));
            }
         }
         if (tmp_data['lineopacity'] === null || tmp_data['lineopacity'] === "") {
             tmp_data['lineopacity'] = 1;
         }
         
         var bounds = new google.maps.LatLngBounds();
         for (i = 0; i < WPGM_PathData.length; i++) {
           bounds.extend(WPGM_PathData[i]);
         }

		 function addPolygonLabel(googleLatLngs)
		 {
			 var converted = [[]];
			 
			 googleLatLngs.forEach(function(latLng) {
				converted[0].push([
					latLng.lat(),
					latLng.lng()
				])
			 });
			 
			 var arr = WPGMZA.ProPolygon.getLabelPosition(converted);
			 var position = new google.maps.LatLng({
				 lat: arr[0],
				 lng: arr[1]
			 });
			 
			 //console.log(position.toString());
		 }
		 
        WPGM_Path_Polygon[polygonid] = new google.maps.Polygon({
             path: WPGM_PathData,
             clickable: true, /* must add option for this */ 
             strokeColor: "#"+tmp_data['linecolor'],
             fillOpacity: tmp_data['opacity'],
             strokeOpacity: tmp_data['lineopacity'],
             fillColor: "#"+tmp_data['fillcolor'],
             strokeWeight: 2,
             map: MYMAP[mapid].map.googleMap
       });
       WPGM_Path_Polygon[polygonid].setMap(MYMAP[mapid].map.googleMap);
	   
	   addPolygonLabel(WPGM_PathData);

        polygon_center = bounds.getCenter();

        if (tmp_data['title'] !== "") {
         infoWindow_poly[polygonid] = new google.maps.InfoWindow();
         google.maps.event.addListener(WPGM_Path_Polygon[polygonid], 'click', function(event) {
             infoWindow_poly[polygonid].setPosition(event.latLng);
             content = "";
             if (tmp_data['link'] !== "") {
                 var content = "<a href='"+tmp_data['link']+"'>"+tmp_data['title']+"</a>";
             } else {
                 var content = tmp_data['title'];
             }
             infoWindow_poly[polygonid].setContent(content);
             infoWindow_poly[polygonid].open(MYMAP[mapid].map.googleMap, this.position);
         }); 
        }


       google.maps.event.addListener(WPGM_Path_Polygon[polygonid], "mouseover", function(event) {
             this.setOptions({fillColor: "#"+tmp_data['ohfillcolor']});
             this.setOptions({fillOpacity: tmp_data['ohopacity']});
             this.setOptions({strokeColor: "#"+tmp_data['ohlinecolor']});
             this.setOptions({strokeWeight: 2});
             this.setOptions({strokeOpacity: 0.9});
       });
       google.maps.event.addListener(WPGM_Path_Polygon[polygonid], "click", function(event) {

             this.setOptions({fillColor: "#"+tmp_data['ohfillcolor']});
             this.setOptions({fillOpacity: tmp_data['ohopacity']});
             this.setOptions({strokeColor: "#"+tmp_data['ohlinecolor']});
             this.setOptions({strokeWeight: 2});
             this.setOptions({strokeOpacity: 0.9});
       });
       google.maps.event.addListener(WPGM_Path_Polygon[polygonid], "mouseout", function(event) {
             this.setOptions({fillColor: "#"+tmp_data['fillcolor']});
             this.setOptions({fillOpacity: tmp_data['opacity']});
             this.setOptions({strokeColor: "#"+tmp_data['linecolor']});
             this.setOptions({strokeWeight: 2});
             this.setOptions({strokeOpacity: tmp_data['lineopacity']});
       });


           
        
        
    }
    function add_polyline(mapid,polyline) {
        
		if(WPGMZA.settings.engine != "google-maps")
			return;
        
        var tmp_data = wpgmaps_localize_polyline_settings[mapid][polyline];

        var current_poly_id = polyline;
        var tmp_polydata = tmp_data['polydata'];
        var WPGM_Polyline_PathData = new Array();
        for (tmp_entry2 in tmp_polydata) {
            if (typeof tmp_polydata[tmp_entry2][0] !== "undefined" && typeof tmp_polydata[tmp_entry2][1] !== "undefined") {
                var lat = tmp_polydata[tmp_entry2][0].replace(')', '');
                lat = lat.replace('(','');
                var lng = tmp_polydata[tmp_entry2][1].replace(')', '');
                lng = lng.replace('(','');
                WPGM_Polyline_PathData.push(new google.maps.LatLng(lat, lng));
            }
             
             
        }
         if (tmp_data['lineopacity'] === null || tmp_data['lineopacity'] === "") {
             tmp_data['lineopacity'] = 1;
         }

        WPGM_Path[polyline] = new google.maps.Polyline({
             path: WPGM_Polyline_PathData,
             strokeColor: "#"+tmp_data['linecolor'],
             strokeOpacity: tmp_data['opacity'],
             strokeWeight: tmp_data['linethickness'],
             map: MYMAP[mapid].map.googleMap
       });
       WPGM_Path[polyline].setMap(MYMAP[mapid].map.googleMap);
        
        
    }
	
	function add_circle(mapid, data)
	{
		if(WPGMZA.settings.engine != "google-maps" || !MYMAP.hasOwnProperty(mapid))
			return;
		
		data.map = MYMAP[mapid].map.googleMap;
		
		if(!(data.center instanceof google.maps.LatLng)) {
			var m = data.center.match(/-?\d+(\.\d*)?/g);
			data.center = new google.maps.LatLng({
				lat: parseFloat(m[0]),
				lng: parseFloat(m[1]),
			});
		}
		
		data.radius = parseFloat(data.radius);
		data.fillColor = data.color;
		data.fillOpacity = parseFloat(data.opacity);
		
		data.strokeOpacity = 0;
		
		var circle = new google.maps.Circle(data);
		circle_array.push(circle);
	}
    
	function add_rectangle(mapid, data)
	{
		if(WPGMZA.settings.engine != "google-maps" || !MYMAP.hasOwnProperty(mapid))
			return;
		
		data.map = MYMAP[mapid].map.googleMap;
		
		data.fillColor = data.color;
		data.fillOpacity = parseFloat(data.opacity);
		
		var northWest = data.cornerA;
		var southEast = data.cornerB;
		
		var m = northWest.match(/-?\d+(\.\d+)?/g);
		var north = parseFloat(m[0]);
		var west = parseFloat(m[1]);
		
		m = southEast.match(/-?\d+(\.\d+)?/g);
		var south = parseFloat(m[0]);
		var east = parseFloat(m[1]);
		
		data.bounds = {
			north: north,
			west: west,
			south: south,
			east: east
		};
		
		data.strokeOpacity = 0;
		
		var rectangle = new google.maps.Rectangle(data);
		rectangle_array.push(rectangle);
	}
    

}






});


function closeInfoWindow(map_id)
{
	
}

function openInfoWindow(marker_id,map_id,by_list) {
	
	return;
	
	var map		= WPGMZA.getMapByID(map_id);
	
	if(WPGMZA.settings.engine == "open-layers")
	{
		// TODO: Uncomment - need to fix marker data not being transmitted first (no ID is transmitted)
		//var marker	= map.getMarkerByID(marker_id);
		
		var marker = marker_array[map_id][marker_id];
		map.setCenter( marker.getPosition() );
	}
	
	if(WPGMZA.settings.wpgmza_settings_disable_infowindows)
		return;
	
    if (by_list) {
        click_from_list = true;
    } else {
        click_from_list = false;
    }

    if (wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] === "" || 'undefined' === typeof wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] || wpgmaps_localize_global_settings['wpgmza_settings_map_open_marker_by'] === '1' || WPGMZA.isTouchDevice()) { 
		marker_array[map_id][marker_id].trigger("click");
    } else {
		marker_array[map_id][marker_id].trigger("mouseover");
    }
    click_from_list = false;
}






function calcRoute(start,end,mapid,travelmode,avoidtolls,avoidhighways,avoidferries,waypoints) {

	var mapElement = jQuery("#wpgmza_map_" + mapid);
 
    var request = {
        origin:start,
        destination:end,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode[travelmode],
        avoidHighways: avoidhighways,
        avoidTolls: avoidtolls,
        avoidTolls: avoidferries
    };

    if(typeof waypoints !== "undefined"){
        var waypoint_array = waypoints.split("|"); //Split by pipe
        for(var i in waypoint_array){
            var the_loc = waypoint_array[i];
            waypoint_array[i] = {
                'location' : the_loc,
                'stopover' : false
            };
        }
        request['waypoints'] = waypoint_array;
    }

    dirflg = "c";

    if (travelmode === "DRIVING") { dirflg = "d"; }
    else if (travelmode === "WALKING") { dirflg = "w"; }
    else if (travelmode === "BICYCLING") { dirflg = "b"; }
    else if (travelmode === "TRANSIT") { dirflg = "t"; }
    else { dirflg = "c"; }

    directionsService[mapid] = new google.maps.DirectionsService();
    var currentDirections = null;
    var oldDirections = [];

    jQuery("#wpgmza_input_to_"+mapid).css("border","");
    jQuery("#wpgmza_input_from_"+mapid).css("border","");
    jQuery("#wpgmaps_directions_notification_"+mapid).html(orig_fetching_directions);

    directionsDisplay[mapid] = new google.maps.DirectionsRenderer({
         'map': MYMAP[mapid].map.googleMap,
         'preserveViewport': true,
         'draggable': true
     });
    directionsDisplay[mapid].setPanel(document.getElementById("directions_panel_"+mapid));
    
    
    google.maps.event.addListener(directionsDisplay[mapid], 'directions_changed',
      function() {
          if (currentDirections) {
              oldDirections.push(currentDirections);
          }
          currentDirections = directionsDisplay[mapid].getDirections();
          jQuery("#directions_panel_"+mapid).show();
          jQuery("#wpgmaps_directions_notification_"+mapid).hide();
          jQuery("#wpgmaps_directions_reset_"+mapid).show();
      });


    directionsService[mapid].route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay[mapid].setDirections(response);
        } else if (status === "ZERO_RESULTS") {
            jQuery("#wpgmaps_directions_editbox_"+mapid).show("fast");
            wpgmza_reset_directions(mapid);
            jQuery("#wpgmaps_directions_notification_"+mapid).show();
            jQuery("#wpgmaps_directions_notification_"+mapid).html("No results found.");

        } else if (status === "NOT_FOUND") {
            jQuery("#wpgmaps_directions_editbox_"+mapid).show("fast");
            wpgmza_reset_directions(mapid);
            jQuery("#wpgmaps_directions_notification_"+mapid).show();
            jQuery("#wpgmaps_directions_notification_"+mapid).html("No results found.");
            if (typeof response.geocoded_waypoints[0] !== "undefined" && typeof response.geocoded_waypoints[0].geocoder_status !== "undefined" && response.geocoded_waypoints[0].geocoder_status == "ZERO_RESULTS") {
                jQuery("#wpgmza_input_from_"+mapid).css("border","1px solid red");
            }
            if (typeof response.geocoded_waypoints[1] !== "undefined" && typeof response.geocoded_waypoints[1].geocoder_status !== "undefined" && response.geocoded_waypoints[1].geocoder_status == "ZERO_RESULTS") {
                jQuery("#wpgmza_input_to_"+mapid).css("border","1px solid red");
            }

        }
		
		if(MYMAP[mapid].directionsBox)
			jQuery(mapElement).trigger("directionsserviceresult", [response, status]);
    });

	
    jQuery("#wpgmaps_print_directions_"+mapid).attr('href','https://maps.google.com/maps?saddr='+encodeURIComponent(start)+'&daddr='+encodeURIComponent(end)+'&dirflg='+dirflg+'&om=1');
	
}

function wpgmza_show_options(wpgmzamid) {

      jQuery("#wpgmza_options_box_"+wpgmzamid).show();
      jQuery("#wpgmza_show_options_"+wpgmzamid).hide();
      jQuery("#wpgmza_hide_options_"+wpgmzamid).show();
  }
function wpgmza_hide_options(wpgmzamid) {
      jQuery("#wpgmza_options_box_"+wpgmzamid).hide();
      jQuery("#wpgmza_show_options_"+wpgmzamid).show();
      jQuery("#wpgmza_hide_options_"+wpgmzamid).hide();
  }
function wpgmza_reset_directions(wpgmzamid) {
    currentDirections = null;
    directionsDisplay[wpgmzamid].setMap(null);
    var currentDirections = null;

    jQuery("#wpgmaps_directions_editbox_"+wpgmzamid).show();
    jQuery("#directions_panel_"+wpgmzamid).hide();
    jQuery("#directions_panel_"+wpgmzamid).html('');
    jQuery("#wpgmaps_directions_notification_"+wpgmzamid).hide();
    jQuery("#wpgmaps_directions_reset_"+wpgmzamid).hide();
    jQuery("#wpgmaps_directions_notification_"+wpgmzamid).html(orig_fetching_directions);
  }

jQuery("body").on("click", ".wpgmza_gd", function() {

    var wpgmzamid = jQuery(this).attr("id");
    var end = jQuery(this).attr("wpgm_addr_field");
    var latLong = jQuery(this).attr("gps");
    /* pelicanpaul updates for mobile */
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        
        if( (navigator.platform.indexOf("iPhone") != -1)
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
        window.open("http://maps.apple.com/maps?daddr="+latLong+"&ll=");
        else
        window.open("http://maps.google.com/maps?daddr="+latLong+"&ll=");
    } else {

        jQuery("#wpgmaps_directions_edit_"+wpgmzamid).show();
        jQuery("#wpgmaps_directions_editbox_"+wpgmzamid).show();
        jQuery("#wpgmza_input_to_"+wpgmzamid).val(end.length > 0 ? end : latLong);
        jQuery("#wpgmza_input_from_"+wpgmzamid).focus().select();
    }


});

jQuery("body").on("click", ".wpgmaps_get_directions", function(event) {

	var wpgmzamid = jQuery(this).attr("id");

	var avoidtolls = jQuery('#wpgmza_tolls_'+wpgmzamid).is(':checked');
	var avoidhighways = jQuery('#wpgmza_highways_'+wpgmzamid).is(':checked');
	var avoidferries = jQuery('#wpgmza_ferries_'+wpgmzamid).is(':checked');

	var wpgmza_dir_type = jQuery("#wpgmza_dir_type_"+wpgmzamid).val();
	var wpgmaps_from = jQuery("#wpgmza_input_from_"+wpgmzamid).val();
	var wpgmaps_to = jQuery("#wpgmza_input_to_"+wpgmzamid).val();

	var wpgmaps_waypoints = jQuery("#wpgmza_input_waypoints_"+wpgmzamid).val();
	
	var waypoint_elements = jQuery("#wpgmaps_directions_edit_" + wpgmzamid + " input.wpgmaps_via");
	if(waypoint_elements.length)
	{
		var values = [];
		waypoint_elements.each(function(index, el) {
			values.push(jQuery(el).val());
		});
		wpgmaps_waypoints = values.join("|");
	}

	if (wpgmaps_from === "" || wpgmaps_to === "")
	{
		alert(wpgmaps_lang_error1);
	}
	else
	{
		calcRoute(wpgmaps_from,wpgmaps_to,wpgmzamid,wpgmza_dir_type,avoidtolls,avoidhighways,avoidferries,wpgmaps_waypoints);
		
		if(jQuery(event.target).closest(".wpgmza-modern-directions-box").length)
			return;
		
		jQuery("#wpgmaps_directions_editbox_"+wpgmzamid).hide("slow");
		jQuery("#wpgmaps_directions_notification_"+wpgmzamid).show("slow");
	}
	
});

jQuery("body").on("keypress",".addressInput", function(event) {
  if ( event.which == 13 ) {
    var mid = jQuery(this).attr("mid");
     jQuery('.wpgmza_sl_search_button_'+mid).trigger('click');
  }
});

jQuery('body').on('click', '.wpgmza_modern_infowindow_close', function(){
    var mid = jQuery(this).attr('mid');
    jQuery("#wpgmza_iw_holder_"+mid).remove();


});

// Waypoint JS
(function($) {
	$(document).ready(function(event) {
		
		var template = $(".wpgmaps_via.wpgmaps_template");
		template.removeClass("wpgmaps_template");
		template.remove();
		
		$(".wpgmaps_add_waypoint a").on("click", function(event) {
			
			var map_id = parseInt($(event.target).closest("[data-map-id]").attr("data-map-id"));
			var row = template.clone();
			
			$(event.target).closest(".wpgmza-form-field").before(row);
			
			var options = {
				fields: ["name", "formatted_address"],
				types: ['geocode']
			};
			
			var restrict = wpgmaps_localize[map_id]['other_settings']['wpgmza_store_locator_restrict'];
			if(restrict && restrict.length)
				options.componentRestrictions = {
					country: restrict
				};
			
			new google.maps.places.Autocomplete($(row).find("input")[0], options);
			
			row.find("input").focus();
			
		});
		
		$(document.body).on("click", ".wpgmaps_remove_via", function(event) {
			$(event.target).closest(".wpgmza-form-field").remove();
		});
		
		if($("body").sortable)
			$(".wpgmaps_directions_outer_div [data-map-id]").sortable({
				items: ".wpgmza-form-field.wpgmaps_via"
			});
		
	});
})(jQuery);
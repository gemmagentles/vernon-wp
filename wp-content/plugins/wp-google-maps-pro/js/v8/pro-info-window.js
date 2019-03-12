/**
 * @namespace WPGMZA
 * @module ProInfoWindow
 * @requires WPGMZA.InfoWindow
 */
jQuery(function($) {
	
	WPGMZA.ProInfoWindow = function(mapObject)
	{
		WPGMZA.InfoWindow.call(this, mapObject);
	}
	
	WPGMZA.ProInfoWindow.prototype = Object.create(WPGMZA.InfoWindow.prototype);
	WPGMZA.ProInfoWindow.prototype.constructor = WPGMZA.ProInfoWindow;
	
	WPGMZA.ProInfoWindow.STYLE_INHERIT			= "-1";
	WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE	= "0";
	WPGMZA.ProInfoWindow.STYLE_MODERN			= "1";
	WPGMZA.ProInfoWindow.STYLE_MODERN_PLUS		= "2";
	WPGMZA.ProInfoWindow.STYLE_MODERN_CIRCULAR	= "3";
	WPGMZA.ProInfoWindow.STYLE_TEMPLATE			= "template";
	
	Object.defineProperty(WPGMZA.ProInfoWindow.prototype, "maxWidth", {
		
		get: function() {
			var width = WPGMZA.settings.wpgmza_settings_infowindow_width;
			
			if(!width)
				return false;
			
			return width;
		}
		
	});
	
	Object.defineProperty(WPGMZA.ProInfoWindow.prototype, "style", {
		
		get: function() {
			
			return this.getSelectedStyle();
			
		}
		
	})
	
	WPGMZA.ProInfoWindow.prototype.getSelectedStyle = function()
	{
		var globalTypeSetting = WPGMZA.settings.wpgmza_iw_type;
		var localTypeSetting = this.mapObject.map.settings.wpgmza_iw_type;
		var type = localTypeSetting;
		
		if(localTypeSetting == WPGMZA.ProInfoWindow.STYLE_INHERIT ||
			typeof localTypeSetting == "undefined")
			type = globalTypeSetting;
			
		return String(type);
	}
	
	WPGMZA.ProInfoWindow.prototype.legacyCreateModernInfoWindow = function(map)
	{
		// Legacy code
		var mapid = map.id;
		
		if($("#wpgmza_iw_holder_" + map.id).length == 0)
			$(document.body).append("<div id='wpgmza_iw_holder_" + map.id + "'></div>");
		else
			return;
		
		var legend = document.getElementById('wpgmza_iw_holder_' + mapid);
		if (legend !== null)
			$(legend).remove();

		wpgmza_iw_Div[mapid] = document.createElement('div');
		wpgmza_iw_Div[mapid].id = 'wpgmza_iw_holder_' + mapid;
		wpgmza_iw_Div[mapid].style = 'display:block;';
		document.getElementsByTagName('body')[0].appendChild(wpgmza_iw_Div[mapid]);

		wpgmza_iw_Div_inner = document.createElement('div');
		wpgmza_iw_Div_inner.className = 'wpgmza_modern_infowindow_inner wpgmza_modern_infowindow_inner_' + mapid;
		wpgmza_iw_Div[mapid].appendChild(wpgmza_iw_Div_inner);

		wpgmza_iw_Div_close = document.createElement('div');
		wpgmza_iw_Div_close.className = 'wpgmza_modern_infowindow_close';
		wpgmza_iw_Div_close.setAttribute('mid', mapid);

		var t = document.createTextNode("x");
		wpgmza_iw_Div_close.appendChild(t);
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_Div_close);

		wpgmza_iw_Div_img = document.createElement('div');
		wpgmza_iw_Div_img.className = 'wpgmza_iw_image';
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_Div_img);

		wpgmza_iw_img = document.createElement('img');
		wpgmza_iw_img.className = 'wpgmza_iw_marker_image';
		wpgmza_iw_img.src = '';
		wpgmza_iw_img.style = 'max-width:100%;';
		wpgmza_iw_Div_img.appendChild(wpgmza_iw_img);

		wpgmza_iw_img_div = document.createElement('div');
		wpgmza_iw_img_div.className = 'wpgmza_iw_title';
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_img_div);

		wpgmza_iw_img_div_p = document.createElement('p');
		wpgmza_iw_img_div_p.className = 'wpgmza_iw_title_p';
		wpgmza_iw_img_div.appendChild(wpgmza_iw_img_div_p);

		wpgmza_iw_address_div = document.createElement('div');
		wpgmza_iw_address_div.className = 'wpgmza_iw_address';
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_address_div);

		wpgmza_iw_address_p = document.createElement('p');
		wpgmza_iw_address_p.className = 'wpgmza_iw_address_p';
		wpgmza_iw_address_div.appendChild(wpgmza_iw_address_p);

		wpgmza_iw_description = document.createElement('div');
		wpgmza_iw_description.className = 'wpgmza_iw_description';
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_description);

		wpgmza_iw_description_p = document.createElement('p');
		wpgmza_iw_description_p.className = 'wpgmza_iw_description_p';
		wpgmza_iw_description.appendChild(wpgmza_iw_description_p);

		wpgmza_iw_buttons = document.createElement('div');
		wpgmza_iw_buttons.className = 'wpgmza_iw_buttons';
		wpgmza_iw_Div_inner.appendChild(wpgmza_iw_buttons);

		wpgmza_directions_button = document.createElement('a');
		wpgmza_directions_button.className = 'wpgmza_button wpgmza_left wpgmza_directions_button';
		wpgmza_directions_button.src = '#';
		
		var t = document.createTextNode(wpgmaps_lang_directions);
		wpgmza_directions_button.appendChild(t);
		wpgmza_iw_buttons.appendChild(wpgmza_directions_button);

		wpgmza_more_info_button = document.createElement('a');
		wpgmza_more_info_button.className = 'wpgmza_button wpgmza_right wpgmza_more_info_button';
		wpgmza_more_info_button.src = '#';
		
		var t = document.createTextNode(wpgmaps_lang_more_info);
		wpgmza_more_info_button.appendChild(t);
		wpgmza_iw_buttons.appendChild(wpgmza_more_info_button);

		var legend = document.getElementById('wpgmza_iw_holder_' + mapid);
		$(legend).css('display', 'block');
		$(legend).addClass('wpgmza_modern_infowindow');
		$(legend).addClass('wpgmza-shadow');

		if (WPGMZA.settings.engine == "google-maps")
			MYMAP[mapid].map.googleMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
		else {
			var container = $(".wpgmza-ol-modern-infowindow-container[data-map-id='" + mapid + "']");
			if (!container.length) {
				container = $("<div class='wpgmza-ol-modern-infowindow-container' data-map-id='" + mapid + "'></div>");
				$(".wpgmza_map[data-map-id='" + mapid + "']").append(container);
			}

			container.append(legend);
		}

	}
	
	WPGMZA.ProInfoWindow.prototype.open = function(map, mapObject)
	{
		var self = this;
		
		// Legacy support
		if(window.infoWindow)
			infoWindow[mapObject.map.id] = this;
		
		if(!WPGMZA.InfoWindow.prototype.open.call(this, map, mapObject))
			return false;
		
		// Legacy support
		if(this.style == WPGMZA.ProInfoWindow.STYLE_NATIVE_GOOGLE || WPGMZA.currentPage == "map-edit")
			return true;
		
		if(map.settings.list_markers_by == WPGMZA.MarkerListing.STYLE_MODERN)
			return false;
		
		var marker_data;
		
		for(var i = 0; i < wpgmaps_localize_marker_data[map.id].length; i++)
		{
			if(wpgmaps_localize_marker_data[map.id][i].marker_id == mapObject.id)
			{
				marker_data = wpgmaps_localize_marker_data[map.id][i];
				
				break;
			}
		}
		
		if(!marker_data)
		{
			console.warn("Failed to find marker data for marker " + mapObject.id);
			return false;
		}
		
		this.legacyCreateModernInfoWindow(map);
		
		modern_iw_open[map.id] = true;

		/* reset the elements */
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_marker_image").attr("src",""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_title").html(""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_description").html(""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_address_p").html(""); 


		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").attr("href","#"); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").attr("target",""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("gps",""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("href","#"); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("id",""); 
		jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("wpgm_addr_field",""); 

		
		
		if (marker_data.image === "" && marker_data.title === "") {  
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_image").css("display","none"); 
		} else {
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_image").css("display","block"); 
		}


		if (marker_data.pic.length) { 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_marker_image").css("display","block"); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_marker_image").attr("src",marker_data.pic); 
			// Removed !important; to allow customisation
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_title").css({"position": "absolute"});
			if (marker_data.title !== "") { jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_title").html(marker_data.title); }

		} else {
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_marker_image").css("display","none"); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_title").attr("style","position: relative !important"); 
			if (marker_data.title !== "") { jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_title").html(marker_data.title); }
		}

		if (marker_data.desc !== "") { 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_description").css("display","block"); 
			if (typeof marker_data.desc !== "undefined" && marker_data.desc !== "") { jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_description").html(marker_data.desc); }
		} else {
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_description").css("display","none"); 

		}

		
		if (typeof wpgmaps_localize_global_settings['wpgmza_settings_infowindow_address'] !== 'undefined' && wpgmaps_localize_global_settings['wpgmza_settings_infowindow_address'] === "yes") {
		} else {
			if (typeof marker_data.address !== "undefined" && marker_data.address !== "") { jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_iw_address_p").html(marker_data.address); }
		}
		

		if (typeof marker_data.link !== "undefined" && marker_data.link !== "") { 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").show();
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").attr("href",marker_data.link);
			if (marker_data.link_target !== "") {
				jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").attr("target","_BLANK"); 
			}  
		} else {
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_more_info_button").hide();
		}
		if (typeof marker_data.directions !== "undefined" && marker_data.directions !== "") { 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").show();
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("href","javascript:void(0);"); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("gps",marker_data.gps); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("wpgm_addr_field",marker_data.address); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").attr("id",map.id); 
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").addClass("wpgmza_gd"); 

		} else {
			jQuery("#wpgmza_iw_holder_"+map.id+" .wpgmza_directions_button").hide();
		}

		return true;
	}
	
	// TODO: This doesn't appear to do anything, nor does it call the parent method
	WPGMZA.ProInfoWindow.prototype.close = function()
	{
		$(this.mapObject.map.element).find(".wpgmza-pro-info-window-container").html();
	}
	
	// TODO: This should be taken care of already in core.js
	$(document).ready(function(event) {
		$(document.body).on("click", ".wpgmza-close-info-window", function(event) {
			$(event.target).closest(".wpgmza-info-window").remove();
		});
	});
	
});
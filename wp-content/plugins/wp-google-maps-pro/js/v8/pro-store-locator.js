/**
 * @namespace WPGMZA
 * @module ProStoreLocator
 * @requires WPGMZA.StoreLocator
 */
jQuery(function($) {
	
	WPGMZA.ProStoreLocator = function(map, element)
	{
		var self = this;
		
		WPGMZA.StoreLocator.call(this, map, element);
		
		// TODO: Listen for marker listing category filter changing
		// TODO: Litsen for custom field filters changing
	}
	
	WPGMZA.ProStoreLocator.prototype = Object.create(WPGMZA.StoreLocator.prototype);
	WPGMZA.ProStoreLocator.prototype.constructor = WPGMZA.ProStoreLocator;
	
	WPGMZA.StoreLocator.createInstance = function(map, element)
	{
		return new WPGMZA.ProStoreLocator(map, element);
	}
	
	Object.defineProperty(WPGMZA.ProStoreLocator.prototype, "keywords", {
		
		"get": function() {
			return $(".wpgmza_name_search_string + input").val()
		}
		
	});
	
	Object.defineProperty(WPGMZA.ProStoreLocator.prototype, "categories", {
		
		"get": function() {
			var dropdown, checkboxes, value, results;
			
			if((dropdown = $(this.element).find(".wpgmza_sl_category_div > select")).length)
			{
				value = dropdown.val();
				
				if(value == "0")
					return null;
				
				return [value];
			}
			
			$(this.element).find(".wpgmza_sl_category_div :checked").each(function(index, el) {
				
				if(!results)
					results = [];
				
				results.push( $(el).val() );
				
			});
			
			return results;
		}
		
	});
	
	WPGMZA.ProStoreLocator.prototype.getFilteringParameters = function()
	{
		var params = WPGMZA.StoreLocator.prototype.getFilteringParameters.call(this);
		
		var proParams = {};
		
		if(this.keywords)
			proParams.keywords = this.keywords;
		
		if(this.categories)
			proParams.categories = this.categories;
		
		// TODO: Support mashup IDs
		
		return $.extend(params, proParams);
	}
	
});
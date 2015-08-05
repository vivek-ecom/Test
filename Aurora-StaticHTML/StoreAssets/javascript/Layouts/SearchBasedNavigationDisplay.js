//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

// Declare context and refresh controller which are used in pagination controls of SearchBasedNavigationDisplay -- both products and articles+videos
wc.render.declareContext("searchBasedNavigation_context", {"contentBeginIndex":"0", "productBeginIndex":"0", "beginIndex":"0", "orderBy":"", "isHistory":"false", "pageView":"", "resultType":"both", "orderByContent":"", "searchTerm":"", "facet":"", "minPrice":"", "maxPrice":""}, "");

// Declare context and refresh controller which are used in pagination controls of SearchBasedNavigationDisplay to display content results (Products).
wc.render.declareRefreshController({
	id: "searchBasedNavigation_controller",
	renderContext: wc.render.getContextById("searchBasedNavigation_context"),
	url: "",
	formId: ""

,renderContextChangedHandler: function(message, widget) {
	var controller = this;
	var renderContext = this.renderContext;
	var resultType = renderContext.properties["resultType"];
	if(resultType == "products" || resultType == "both"){
		renderContext.properties["beginIndex"] = renderContext.properties["productBeginIndex"];
		widget.refresh(renderContext.properties);
	}
}

,postRefreshHandler: function(widget) {
	// Handle the new facet counts, and update the values in the left navigation.  First parse the script, and then call the update function.
	var facetCounts = $("facetCounts");
	if(facetCounts != null) {
		var scripts = facetCounts.getElementsByTagName("script");
		var j = scripts.length;
		for (var i = 0; i < j; i++){
			var newScript = document.createElement('script');
			newScript.type = "text/javascript";
			newScript.text = scripts[i].text;
			facetCounts.appendChild(newScript);
		}
		SearchBasedNavigationDisplayJS.resetFacetCounts();
		updateFacetCounts();
		SearchBasedNavigationDisplayJS.validatePriceInput();
	}

	var resultType = widget.controller.renderContext.properties["resultType"];
	if(resultType == "products" || resultType == "both"){
		var currentIdValue = currentId;
		cursor_clear();  
		//If the refresh was done on click of back/forward button, do not add the state to histroy list..else we will end up in infinite loop..
		if(widget.controller.renderContext.properties['isHistory'] == 'false'){
			var currentContextProperties = widget.controller.renderContext.properties;
			dojo.back.addToHistory(new SearchBasedNavigationDisplayJS.HistoryTracker(currentContextProperties));	
		}
		SearchBasedNavigationDisplayJS.initControlsOnPage(widget.controller.renderContext.properties);
		shoppingActionsJS.updateSwatchListView();
		shoppingActionsJS.checkForCompare();
		var gridViewLinkId = "WC_SearchBasedNavigationResults_pagination_link_grid_categoryResults";
		var listViewLinkId = "WC_SearchBasedNavigationResults_pagination_link_list_categoryResults";
		if(currentIdValue == "orderBy"){
			$("orderBy").focus();
		}
		else{
			if((currentIdValue == gridViewLinkId || currentIdValue != listViewLinkId) && $(listViewLinkId)){
				$(listViewLinkId).focus();
			}
			if((currentIdValue == listViewLinkId || currentIdValue != gridViewLinkId) && $(gridViewLinkId)){
				$(gridViewLinkId).focus();
			}
		}
	}
	dojo.publish("CMPageRefreshEvent");
}
});

// Declare context and refresh controller which are used in pagination controls of SearchBasedNavigationDisplay to display content results (Articles and videos).
wc.render.declareRefreshController({
	id: "searchBasedNavigation_content_controller",
	renderContext: wc.render.getContextById("searchBasedNavigation_context"),
	url: "",
	formId: ""

,renderContextChangedHandler: function(message, widget) {
	var controller = this;
	var renderContext = this.renderContext;
	var resultType = renderContext.properties["resultType"];
	if(resultType == "content" || resultType == "both"){
		renderContext.properties["beginIndex"] = renderContext.properties["contentBeginIndex"];
		widget.refresh(renderContext.properties);
	}
}

,postRefreshHandler: function(widget) {
	var resultType = widget.controller.renderContext.properties["resultType"];
	if(resultType == "content" || resultType == "both"){
			var currentIdValue = currentId;
			cursor_clear();  
			//If the refresh was done on click of back/forward button, do not add the state to histroy list..
			if(widget.controller.renderContext.properties['isHistory'] == 'false'){
				var currentContextProperties = widget.controller.renderContext.properties;
				dojo.back.addToHistory(new SearchBasedNavigationDisplayJS.HistoryTracker(currentContextProperties));	
			}
			SearchBasedNavigationDisplayJS.initControlsOnPage(widget.controller.renderContext.properties);
			shoppingActionsJS.initCompare();
			if(currentIdValue == "orderByContent"){
				$("orderByContent").focus();
			}
		}
	}
});



if(typeof(SearchBasedNavigationDisplayJS) == "undefined" || SearchBasedNavigationDisplayJS == null || !SearchBasedNavigationDisplayJS){

	SearchBasedNavigationDisplayJS = {

		/** 
		 * This variable is an array to contain all of the facet ID's generated from the initial search query.  This array will be the master list when applying facet filters.
		 */
		facetIdsArray: new Array,

		init:function(searchResultUrl){
			wc.render.getRefreshControllerById('searchBasedNavigation_controller').url = searchResultUrl;
			this.initControlsOnPage(WCParamJS);
			this.updateContextProperties("searchBasedNavigation_context", WCParamJS);

			var currentContextProperties = wc.render.getContextById('searchBasedNavigation_context').properties;
			var historyObject = new SearchBasedNavigationDisplayJS.HistoryTracker(currentContextProperties);
			dojo.back.setInitialState(historyObject);	
		},

		initControlsOnPage:function(properties){
			//Set state of sort by select box..
			var selectBox = dojo.byId("orderBy");
			if(selectBox != null && selectBox != 'undefined'){
				dojo.byId("orderBy").value = properties['orderBy'];
			}

			selectBox = dojo.byId("orderByContent");
			if(selectBox != null && selectBox != 'undefined'){
				dojo.byId("orderByContent").value = properties['orderByContent'];
			}
		},

		initContentUrl:function(contentUrl){
			wc.render.getRefreshControllerById('searchBasedNavigation_content_controller').url = contentUrl;
		},

		resetFacetCounts:function() {
			for(var i = 0; i < this.facetIdsArray.length; i++) {
				var facetValue = $("facet_count" + this.facetIdsArray[i]);
				if(facetValue != null) {
					facetValue.innerHTML = 0;
				}	
			}
		},

		updateFacetCount:function(id, count) {
			var facetValue = $("facet_count" + id);
			if(facetValue != null) {
				var checkbox = $("facet_checkbox" + id);
				if(count > 0) {
					// Reenable the facet link
					checkbox.disabled = false;
					facetValue.innerHTML = count;
				}
			}	
		},

		isValidNumber:function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n) && n > 0;
		},

		checkPriceInput:function(event, currencySymbol, imgUrlPath, section, removeCaption) {
			if(this.validatePriceInput() && event.keyCode == 13) {
				this.appendFilterPriceRange(currencySymbol, imgUrlPath, section, removeCaption);
			}
			return false;
		},

		validatePriceInput:function() {
			if($("low_price_input") != null && $("high_price_input") != null && $("price_range_go") != null) {
				var low = $("low_price_input").value;
				var high = $("high_price_input").value;
				var go = $("price_range_go");
				if(this.isValidNumber(low) && this.isValidNumber(high) && parseFloat(high) > parseFloat(low)) {
					go.className = "go_button";
					go.disabled = false;
				}
				else {
					go.className = "go_button_disabled";
					go.disabled = true;
				}	
				return !go.disabled;
			}
			return false;
		},

		toggleShowMore:function(index, show) {
			var list = $('more_' + index);
			var morelink = $('morelink_' + index);
			if(list != null) {
				if(show) {
					morelink.style.display = "none";
					list.style.display = "block";
				}
				else {
					morelink.style.display = "block";
					list.style.display = "none";
				}
			}
		},

		toggleSearchFilter:function(element, id, section, imgUrlPath, removeCaption) {
			if(element.checked) {
				this.appendFilterFacet(id, section, imgUrlPath, removeCaption);
			}
			else {
				this.removeFilterFacet(id, section);
			}

			if(section != "") {
				$('section_' + section).style.display = "none";
			}
		},

		appendFilterPriceRange:function(currencySymbol, imgUrlPath, section, removeCaption) {
			var facetFilterList = $("facetFilterList");
			var filter = $("pricefilter");
			if(filter == null) {
				filter = document.createElement("li");
				filter.setAttribute("id", "pricefilter");
				facetFilterList.appendChild(filter);
			}
			var label = currencySymbol + $("low_price_input").value + " - " + currencySymbol + $("high_price_input").value;
			filter.innerHTML = "<a href='#' onclick='SearchBasedNavigationDisplayJS.removeFilterPriceRange(\"" + section + "\"); if (dojo.query(\"#facetFilterList a\").length == 0) restoreAllProducts();'>" + "<div class='filter_option'><div class='filter_sprite'><img src='" + imgUrlPath + "' alt='" + removeCaption + "' title='" + removeCaption + "'></div><span>" + label + "</span></div></a>";

			$("clear_all_filter").style.display = "block";

			if(this.validatePriceInput()) {
				// Promote the values from the input boxes to the internal inputs for use in the request.
				$("low_price_value").value = $("low_price_input").value;
				$("high_price_value").value = $("high_price_input").value;
			}

			if(section != "") {
				$('section_' + section).style.display = "none";
			}
			this.doSearchFilter();			
		},

		removeFilterPriceRange:function(section) {
			$("low_price_value").value = "";
			$("high_price_value").value = "";	
			var facetFilterList = $("facetFilterList");
			var filter = $("pricefilter");
			if(filter != null) {
				facetFilterList.removeChild(filter);
			}

			if(facetFilterList.childNodes.length == 0) {
				$("clear_all_filter").style.display = "none";
			}
			if(section != "") {
				$('section_' + section).style.display = "block";
			}
			this.doSearchFilter();
		},

		appendFilterFacet:function(id, section, imgUrlPath, removeCaption) {
			var facetFilterList = $("facetFilterList");
			var filter = $("filter_" + id);
			// do not add it again if the user clicks repeatedly
			if(filter == null) {
				filter = document.createElement("li");
				filter.setAttribute("id", "filter_" + id);
				var label = $("facetLabel_" + id).innerHTML;
				filter.innerHTML = "<a href='#' onclick='SearchBasedNavigationDisplayJS.removeFilterFacet(\"" + id + "\", \"" + section + "\"); if (dojo.query(\"#facetFilterList a\").length == 0) restoreAllProducts();'>" + "<div class='filter_option'><div class='filter_sprite'><img src='" + imgUrlPath + "' alt='" + removeCaption + "' title='" + removeCaption + "'></div><span>" + label + "</span></div></a>";
				facetFilterList.appendChild(filter);
			}

			$("clear_all_filter").style.display = "block";
			this.doSearchFilter();
		},

		removeFilterFacet:function(id, section) {
			var facetFilterList = $("facetFilterList");
			var filter = $("filter_" + id);
			if(filter != null) {
				facetFilterList.removeChild(filter);
				$("facet_checkbox" + id).checked = false;
			}

			if(facetFilterList.childNodes.length == 0) {
				$("clear_all_filter").style.display = "none";
			}

			if(section != "") {
				$('section_' + section).style.display = "block";
			}
			this.doSearchFilter();
		},

		getEnabledProductFacets:function() {
			var facetForm = document.forms['productsFacets'];
			var elementArray = facetForm.elements;

			var facetArray = new Array();
			for (var i=0; i < elementArray.length; i++) {
				var element = elementArray[i];
				if(element.type != null && element.type.toUpperCase() == "CHECKBOX") {
					// disable the checkbox while the search is being performed to prevent double clicks
					//element.disabled = true;	//comment out due to static html pages
					if(element.checked) {
						facetArray.push(element.value);
					}
				}
			}
			// disable the price range button also
			if($("price_range_go") != null) {
				$("price_range_go").disabled = true;
			}
			
			return facetArray;
		},

		doSearchFilter:function() {
			if(!submitRequest()){
				return;
			}
			cursor_wait();  

			var minPrice = "";
			var maxPrice = "";
			
			if($("low_price_value") != null && $("high_price_value") != null) {
				minPrice = $("low_price_value").value;
				maxPrice = $("high_price_value").value;
			}

			var facetArray = this.getEnabledProductFacets();
			//comment out due to static pages
			//wc.render.updateContext('searchBasedNavigation_context', {"productBeginIndex": "0", "facet": facetArray, "resultType":"products", "minPrice": minPrice, "maxPrice": maxPrice, "isHistory": "false"});
			MessageHelper.hideAndClearMessage();
		},


		clearAllFacets:function() {
			$("clear_all_filter").style.display = "none";
			$("facetFilterList").innerHTML = "";
			$("low_price_value").value = "";
			$("high_price_value").value = "";

			var facetForm = document.forms['productsFacets'];
			var elementArray = facetForm.elements;
			for (var i=0; i < elementArray.length; i++) {
				var element = elementArray[i];
				if(element.type != null && element.type.toUpperCase() == "CHECKBOX" && element.checked) {
					element.checked = false;
				}
			}

			for (var i=0; true; i++) {
				// Reset all hidden facet sections (single selection facets are hidden after one facet is selected from that facet grouping).
				var facetSection = $('section_' + i);
				if(facetSection == null) {
					break;
				}
				else {
					facetSection.style.display = "block"
				}
			}

			this.doSearchFilter();
		},

		toggleSearchContentFilter:function() {
			if(!submitRequest()){
				return;
			}
			cursor_wait();  

			var facetList = "";
			var facetForm = document.forms['contentsFacets'];
			var elementArray = facetForm.elements;
			for (var i=0; i < elementArray.length; i++) {
				var element = elementArray[i];
				if(element.type != null && element.type.toUpperCase() == "CHECKBOX" && element.checked) {
					facetList += element.value + ";";
				}
			}
			
			wc.render.updateContext('searchBasedNavigation_context', {"facet": facetList, "resultType":"content"});
			MessageHelper.hideAndClearMessage();
		},


		updateContextProperties:function(contextId, properties){
			//Set the properties in context object..
			for(key in properties){
				wc.render.getContextById(contextId).properties[key] = properties[key];
				console.debug(" key = "+key +" and value ="+wc.render.getContextById(contextId).properties[key]);
			}
		},

		showResultsPageForContent:function(data){

			var pageNumber = data['pageNumber'];
			var pageSize = data['pageSize'];
			pageNumber = dojo.number.parse(pageNumber);
			pageSize = dojo.number.parse(pageSize);

			setCurrentId(data["linkId"]);

			if(!submitRequest()){
				return;
			}

			var beginIndex = pageSize * ( pageNumber - 1 );
			cursor_wait();
			wc.render.updateContext('searchBasedNavigation_context', {"contentBeginIndex": beginIndex,"resultType":"content","isHistory":"false"});
			MessageHelper.hideAndClearMessage();
		},

		showResultsPage:function(data){

			var pageNumber = data['pageNumber'];
			var pageSize = data['pageSize'];
			pageNumber = dojo.number.parse(pageNumber);
			pageSize = dojo.number.parse(pageSize);

			setCurrentId(data["linkId"]);

			if(!submitRequest()){
				return;
			}
			
			console.debug(wc.render.getRefreshControllerById('searchBasedNavigation_controller').renderContext.properties);
			var beginIndex = pageSize * ( pageNumber - 1 );
			cursor_wait();
			wc.render.updateContext('searchBasedNavigation_context', {"productBeginIndex": beginIndex,"resultType":"products","isHistory":"false"});
			MessageHelper.hideAndClearMessage();
		},

		toggleView:function(data){
			var pageView = data["pageView"];
			setCurrentId(data["linkId"]);
			if(!submitRequest()){
				return;
			}
			cursor_wait();  
			console.debug("pageView = "+pageView+" controller = +searchBasedNavigation_controller");
			wc.render.updateContext('searchBasedNavigation_context', {"pageView": pageView,"isHistory":"false"});
			MessageHelper.hideAndClearMessage();
		},
		
		toggleExpand:function(id) {
			var expand_icon = $("expand_icon_" + id);
			var section_list = $("section_list_" + id);
			if(expand_icon.className == "expand_icon_open") {
				expand_icon.className = "expand_icon_close";
				section_list.style.display = "none";
			}
			else {
				expand_icon.className = "expand_icon_open";
				section_list.style.display = "block";
			}
		},

		sortResults:function(orderBy){
			if(!submitRequest()){
				return;
			}
			cursor_wait();  
			console.debug("orderBy = "+orderBy+" controller = +searchBasedNavigation_controller");
			//Reset beginIndex = 1
			wc.render.updateContext('searchBasedNavigation_context', {"productBeginIndex": "0","orderBy":orderBy,"resultType":"products","isHistory":"false"});
			MessageHelper.hideAndClearMessage();
		},

		sortResults_content:function(orderBy){
			if(!submitRequest()){
				return;
			}
			cursor_wait();  
			console.debug("orderBy = "+orderBy+" controller = +searchBasedNavigation_controller");
			//Reset beginIndex = 1
			wc.render.updateContext('searchBasedNavigation_context', {"productBeginIndex": "0","orderByContent":orderBy,"resultType":"content","isHistory":"false"});
			MessageHelper.hideAndClearMessage();
		},
		
		//Same HistoryTracker object is used for both products pagination and articles+videos pagination..
		HistoryTracker:function(currentContextProperties){
			// Do not change the URL in the browser address bar.. If user bookmarks or clicks on refresh button, we will show the page with beginIndex set to 0..Will not
			// show the actual page which was bookmarked.
			this.changeUrl = false;
			// Capture the current state of the facet list in the left navigation display
			this.leftNavSnapshot = $("widget_left_nav").innerHTML;
			this.contextProperties = SearchBasedNavigationDisplayJS.clone(currentContextProperties);
			this.contextProperties['isHistory'] = 'true';
			this.contextProperties["resultType"] = "both";
			this.back = SearchBasedNavigationDisplayJS.handleBrowserBackForward; //register function to handle back button of browser
			this.forward = SearchBasedNavigationDisplayJS.handleBrowserBackForward; //register function to handle forward button of browser
			console.debug("Add to history...."+this.contextProperties['orderBy']+" " +this.contextProperties['productBeginIndex']+" "+this.contextProperties['contentBeginIndex']+ " " +this.contextProperties['resultType']+ " " +this.contextProperties['facet']);
			console.debug(this.contextProperties);
		},
		
		handleBrowserBackForward:function(){
			cursor_wait();  
			console.debug("From history...."+this.contextProperties['orderBy']+" " +this.contextProperties['productBeginIndex']+" "+this.contextProperties['contentBeginIndex']+ " " +this.contextProperties['resultType']+ " " +this.contextProperties['facet']);
			wc.render.updateContext('searchBasedNavigation_context', this.contextProperties);
			// Restore the state of the facet list in the left navigation display
			$("widget_left_nav").innerHTML = this.leftNavSnapshot;
		},

		clone:function(masterObj) {
			if (null == masterObj || "object" != typeof masterObj) return masterObj;
			var clone = masterObj.constructor();
			for (var attr in masterObj) {
				if (masterObj.hasOwnProperty(attr)) clone[attr] = masterObj[attr];
			}
			return clone;
		}
	};
}

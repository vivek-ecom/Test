//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2008, 2009 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

//
//

/** 
 * @fileOverview This is the FastFinderDisplay.js which is responsible for client side operations on the fast finder page.
 * This file holds methods which perform operations such as results filtering, results displaying, and asynchronous data loading.
 * This page is used by FastFinderDisplay.jsp.
 *
 * @version 1.0
 */
		dojo.registerModulePath("wc", "../wc");
		dojo.require("dijit._Widget");
		dojo.require("dijit._Container");
		dojo.require("wc.render.RefreshController");
		dojo.require("dojo.parser");
		dojo.require("dojo.back");

		dojo.require("dojo.io.iframe");
		dojo.require("dojo.io.script");	
		
		dojo.require("dijit.form.Button");
		dojo.require("dijit.Menu");
	
		dojo.require("wc.widget.RangeSlider");
				
		dojo.require("wc.widget.ScrollablePane");
		dojo.require("dojox.collections.ArrayList");
		
		/** The begin index of the current page. **/
		var beginIndex = 0;
		
		/** The previous index which is the beginIndex - the page size. **/
		var prevIndex = null; 
		
		/** The next index which is the beginIndex + the page size. **/
		var nextIndex = null;

		/**
		 * This is a prototype for a WCProduct object. There will be one WCProduct object for every search result. 
		 * This object holds a variety of information about a catalog entry such as catentryId, name, brand and an array of features. 
		 * @constructor
		 */
		function WCProduct(){
			
			this.catentryId = "";
			this.SKU = "";
			this.name = "";
			this.identifierCounter = "";
			this.shortDescription = "";
			this.productCompareImagePath = "";
			this.smallImageSrc = "";
			this.mediumImageSrc = "";
			this.price = "";
			this.brand = "";
			this.features = new Array();
			this.productDisplayURL = "";
			this.dragSourceType = "";
			this.attributes = new Array();
			this.baseContentHTML = "";
			this.baseDetailedContentHTML = "";
			this.entitledItemArray = new Array();
			this.category = "search";
		}

	/**
	 * @class fastFinderJS This fastFinderJS class defines all the variables and functions for the page(s) that use the Fast Finder functionality in the store.
	 * The Fast Finder page initially loads a small set of products to give a fast response to the shopper by allowing them to see and 
	 * use the page without having to wait for all products under the category to be loaded. It then makes AJAX calls to the Commerce
	 * server to retrieve the rest of the products. Initial page size and number of products to load on each AJAX call is configurable.
	 * <br\>
	 * The functions defined in the class are used for managing the result set of products that should be displayed to the shopper based 
	 * on his/her filtering options. Another set of functions defined are used to build the entire page filters and results using client side
	 * JavaScript.
	 */
	
	fastFinderJS={
	
		/** The localized string to display the regular price message. **/
		priceMessage : "UNDEFINED",
		
		/** The localized string to display the search results count message. **/
		totalResultsMessage : "UNDEFINED",
		
		/** The localized string to display the the current results showing message. **/
		pagingMessage : "UNDEFINED",
		
		/** The localized string to display the total current page message. **/
		pagingMessage2 : "UNDEFINED",
		
		/** The localized string to display the add to cart message. **/
		add2cart : "UNDEFINED",
		
		/** The localized string to display the quick info message. **/
		quickinfo : "UNDEFINED",
		
		/** The localized string message to display the alternate description of the previous page button image. **/
		leftMarkerMessage : "UNDEFINED",
		
		/** The localized string message to display the alternate description of the next page button image. **/
		rightMarkerMessage : "UNDEFINED",

		/** A vector of catalog entries that are currently displayed. The vector contains WCProduct objects. **/
		catalogEntriesResultSet : new Vector(),
		
		/** A map of WCProduct objects used to display catalog entry details. The keys of the map are the catalog entry IDs of the corresponding WCProduct objects. **/
		allCatalogEntries : new Object(),
		
		/** A vector of catalog entry IDs sorted by the price of their representative catalog entries **/
		catalogEntriesByPrice : new Vector(),
		
		/** A vector of catalog entry IDs sorted by the brand name of their representative catalog entries **/
		catalogEntriesByBrand : new Vector(),

		/** 
		 * @constant pageSize How many results to display per page.
		 */
		pageSize : 12,
		
		/** @constant ajaxPageSize How many results to load asynchronously for the results sorted by price for every AJAX call.*/
		ajaxPageSize : "250",
		
		/** @constant ajaxPageSize How many results to load asynchronously for the results sorted by brand for every AJAX call.*/
		brandSortPageSize : "500",
		/**
		 * @constant resultsPerRow How many results to display per row.
		 **/
		resultsPerRow : 4,
		
		/** A counter of how many catalog entries are currently displayed. **/
		displayCounter : 0,
		
		/** A counter of the number of rows of catalog entries that are currently displayed **/
		displayRowCounter : 0,
		
		/** A count of the total number of catalog entries that are in this category **/
		totalProductsInCategory : "UNDEFINED",
		
		/** Used in the generation of a unique ID in the createProductWidget method **/
		productIdentifierString : "catBrowse",
		
		/** Holds the current number of loaded catalog entries in this category **/
		catalogEntriesResultSetTotal : 0,
		
		/** Holds the value of the total number of pages in the fast finder page**/
		catalogEntriesResultSetTotalPages : 0,
		
		/** Holds the value of the current page number **/
		catalogEntriesResultSetCurrentPageNumber : 0,
		
		/** 
		 * Holds the number of catalog entries currently retrieved in this category 
		 * and is updated as more data is loaded asynchronously
		 **/
		catalogEntriesRetrieved : 0,
		
		/** Holds the number of catalog entries available on the current page. **/
		displayTotal : this.pageSize,
		
		/** Can be used to globally set the begin index to use for further data loading asynchronously **/
		beginIndex : 0,
		
		/** The first index of the previous page **/
		prevIndex : null, 
		
		/** The first index of the next page. **/
		nextIndex : null,

		/** Holds the image path for images in this category **/
		imagePath : "UNDEFINED",
		
		/** The path to the icon to use when no image is found. **/
		noImageIconPath : "UNDEFINED",
		
		/** The view that is used either image or detailed **/
		viewType : "",
		
		/** The current store ID **/
		storeId : "UNDEFINED",
		
		/** The current catalog ID **/
		catalogId : "UNDEFINED",
		
		/** The current language ID **/
		langId: "UNDEFINED",
		
		/** The current category ID **/
		categoryId: "UNDEFINED",

		/** Parent category ID of the current category**/
		parent_category_rn: "UNDEFINED",

		/** Top category ID to which the current category belongs**/
		top_category:  "UNDEFINED",
		
		popupViewStyle : null,
		
		/** Boolean value which holds whether or not the AJAX add to cart is enabled. **/
		ajaxVar : "false",
		
		/** Boolean value which holds whether the drag and drop function is enabled or not. **/
		dragVar : "false",
		
		/** Boolean value which holds whether the quick info popup function is enabled or not. **/
		qinfoVar : "false",
		
		/** A map that holds the brands of all the catalog entries in this category. Both the key and corresponding values in this map are the name of the brand. **/
		brands : new Object(),
		
		/** A map that holds the features of all the catalog entries in this category. Both the key and corresponding values in this map are the name of the feature. **/
		features : new Object(),
		
		/** A count of the number of brands map representing all the catalog entries in this category **/
		brandsCounter : 0,
		
		/** A count of the number of features in the features map representing all the catalog entries in this category **/
		featuresCounter : 0,
		
		/** 
		 * Tells whether the price sorted catalog entries are fully loaded or not. 
		 * This is used to determine when to start asynchronously loading the brand sorted catalog entries.
		 **/
		firstSortLoaded : false,
		
		
		/**
		 *  setAjaxVar Sets the flag which indicates whether 'Ajax Add To Cart' feature is enabled or not. Based on this, relevant code is generated.
		 *
		 *	@param {boolean} temp Sets the ajax variable to true or false.
		**/
		setAjaxVar: function(temp){
			this.ajaxVar = temp;
		},

		/**
		 * setDragVar Sets the flag which indicates whether 'Product Drag-and-Drop' feature is enabled or not. Based on this, relevant code is generated.
		 *
		 * @param {Boolean} temp Carries the value: true/false.
		 **/
		setDragVar: function(temp){
			this.dragVar = temp;
		},

		/**
		* setQinfoVar Sets the flag which indicates whether 'Product Quick Info' feature is enabled or not. Based on this, relevant code is generated.
		*
		* @param {Boolean} temp Carries the value: true/false.
		**/
		setQinfoVar: function(temp){
		
			this.qinfoVar = temp;
		},

		/**
		* setBeginIndex Sets the begin index of pagination. Based on this, relevant page is displayed.
		*
		* @param {Boolean} temp Carries the value: index of first product in the page.
		**/
		setBeginIndex: function(temp){
			
			beginIndex = parseInt(temp);
			document.FastFinderForm.beginIndex.value=beginIndex;
		},
		
		/**
		 * Sets  the way products are displayed. 
		 * @param (String) type how products should be displayed: detailed view, or image view 
		 */
		setViewType: function (type) {
			this.viewType = type;
		},

		/**
		* createAddToCartRow Creates the 'Add to Cart' buttons to be displayed below each product.
		*
		* @param {WCProduct} productObj The WCProduct object to put into the row
		* @param {string} identifierString 
		* @param {string} imageSize
		* @param {boolean} showCompare
		* @param {string} imagePath
		* @param {string} viewType
		* @param {string} storeId The current storeId
		* @param {string} catalogId The current catalogId
		*
		* @return {HTMLSpanElement} Code which generates 'Add to Cart' buttons
		*
		**/
		createAddToCartRow : function(productObj, identifierString, imageSize, showCompare, imagePath, viewType, storeId, catalogId)
		{
			var baseContentAddToCartRow = "";
			if(this.ajaxVar == 'true')
			{
				if(productObj.dragSourceType == "item" || productObj.dragSourceType == "package")
				{
					baseContentAddToCartRow = baseContentAddToCartRow
					+"<span class='primary_button button_fit' >\n"
						+"<span class='button_container' >\n"
							+"<span class='button_bg' >\n"
								+"<span class='button_top'>\n"
									+"<span class='button_bottom'>\n"
										+"<a onfocus='hidePopupButton("+ productObj.catentryId +");'href='javascript:setCurrentId(\"WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_1\"); categoryDisplayJS.Add2ShopCartAjax(\"entitledItem_"+productObj.catentryId+"\",1,false)'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_1'>"+this.add2cart+"</a><br/>\n"
									+"</span>\n"
								+"</span>\n"
							+"</span>\n"
						+"</span>\n"
					+"</span>\n";	
			}
				else
				{
					baseContentAddToCartRow = baseContentAddToCartRow
					+"<span class='primary_button button_fit' >\n"
						+"<span class='button_container' >\n"
							+"<span class='button_bg' >\n"
								+"<span class='button_top'>\n"
									+"<span class='button_bottom'>\n"			
										+"<a onclick='javascript: showPopup(\""+productObj.catentryId+"\", event, null, \"popupButton_"+ productObj.catentryId +"\")'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_2'>"+this.add2cart+"</a><br/>\n"
									+"</span>\n"
								+"</span>\n"
							+"</span>\n"
						+"</span>\n"
					+"</span>\n";	
				}
			}
			if(this.ajaxVar == 'false')
			{
				if(productObj.dragSourceType == "item" || productObj.dragSourceType == "package")
				{
					baseContentAddToCartRow = baseContentAddToCartRow
					+"<span class='primary_button button_fit' >\n"
						+"<span class='button_container' >\n"
							+"<span class='button_bg' >\n"
								+"<span class='button_top'>\n"
									+"<span class='button_bottom'>\n"	
										+"<a href='#'; onclick='javascript:categoryDisplayJS.Add2ShopCart(\"entitledItem_"+productObj.catentryId+"\", document.getElementById(\"OrderItemAddForm_"+productObj.catentryId+"\"),1,false);return false;'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_3'>"+this.add2cart+"</a><br/>\n"
									+"</span>\n"
								+"</span>\n"
							+"</span>\n"
						+"</span>\n"
					+"</span>\n";	
				}
				else
				{
					baseContentAddToCartRow = baseContentAddToCartRow
					+"<span class='primary_button button_fit' >\n"
						+"<span class='button_container' >\n"
							+"<span class='button_bg' >\n"
								+"<span class='button_top'>\n"
									+"<span class='button_bottom'>\n"	
										+"<a onclick='javascript: showPopup(\""+productObj.catentryId+"\", event, null, \"popupButton_"+ productObj.catentryId +"\")'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_4'>"+this.add2cart+"</a><br/>\n"
									+"</span>\n"
								+"</span>\n"
							+"</span>\n"
						+"</span>\n"
					+"</span>\n";	
				}
			}
			return baseContentAddToCartRow;
			
		},	
			
		/**
		* createProductWidget Creates the entire product display section.
		*
		* @param parentObject {HTMLElement} The parent HTML element to replace with new HTML.
		* @param productObj {WCProduct} The product object to base the product widget upon.
		* @param identifierString {string} Identifier string is used in generation of unique ID.
		* @param imageSize
		* @param showCompare
		* @param imagePath {string} Path of the source image.
		* @param viewType {string} Type of the view: image/detailed.
		* @param storeId {string} The current store ID set in the fastFinderJS object.
		* @param catalogId {string} The current catalog ID set in the fastFinderJS object.
		*
		**/
		createProductWidget : function(parentObject, productObj, identifierString, imageSize, showCompare, imagePath, viewType, storeId, catalogId) 
		{ 	
				var _id = identifierString + productObj.identifierCounter;
				var widgetHTML = "";
				if(productObj.baseContentHTML == null || productObj.baseContentHTML == ""){
					if(productObj.productCompareImagePath == "") productObj.productCompareImagePath = this.noImageIconPath + "NoImageIcon_sm45.jpg";
					if(productObj.smallImageSrc == "") productObj.smallImageSrc = this.noImageIconPath + "NoImageIcon_sm45.jpg";
					if(productObj.mediumImageSrc == "") productObj.mediumImageSrc = this.noImageIconPath + "NoImageIcon_sm.jpg";
					var tempStr = "";
					var _baseContentImgSrc = productObj.mediumImageSrc;
					var _baseContentNamePrice = "";
					var _baseContentNameTD = "";
					var _baseContentPriceTD = "";
					if(productObj.dragSourceType == "item" || productObj.dragSourceType =="package"){
					_baseContentNamePrice= "" 
						+"<div id='entitledItem_"+productObj.catentryId+"' style='display:none;'>\n"
						+"[\n"
						+"{\n";
							_baseContentNamePrice = _baseContentNamePrice
							+"'catentry_id' : '"+productObj.catentryId+"',\n"
							+"'Attributes' :	{}\n";							
							
						_baseContentNamePrice = _baseContentNamePrice
						+"}\n"
						+"]\n"
						+"</div>\n";
					}
					if(productObj.dragSourceType == "product"){
						_baseContentNamePrice= "" 
						+"<div id='entitledItem_"+productObj.catentryId+"' style='display:none;'>\n"
						+"[\n";
						
						for(var i=0;i<productObj.entitledItemArray.length;i++)
						{
							var tempStr = "";
							_baseContentNamePrice = _baseContentNamePrice
							+"{\n";
							_baseContentNamePrice = _baseContentNamePrice
							+"'catentry_id' : '"+productObj.entitledItemArray[i]+"',\n";
							var catEntryArray = [];
							catEntryArray = productObj.attributes[i].toString().split(",");
							for(var j=0 ;j<catEntryArray.length; j++){
								tempStr = tempStr+"'"+ catEntryArray[j] + "'" + " : " + "'" + (j+1) + "'";
								if(j!=(catEntryArray.length)-1)
								tempStr = tempStr + ",";
							}
							_baseContentNamePrice = _baseContentNamePrice
							+"'Attributes' :	{"+tempStr+"}\n"
							+"}\n";
						if(i!=(productObj.entitledItemArray.length)-1)
						_baseContentNamePrice = _baseContentNamePrice + ",";
						}
						_baseContentNamePrice = _baseContentNamePrice
						+"]\n"
						+"</div>\n";
					}		
					if(this.ajaxVar == 'false')
					{
						var tem = "AjaxOrderItemDisplayView?storeId="+this.storeId+"&catalogId="+this.catalogId+"&langId="+this.langId;
						_baseContentNamePrice = _baseContentNamePrice
						+"<form name='OrderItemAddForm_"+productObj.catentryId+"' action='OrderChangeServiceItemAdd' method='post' id='OrderItemAddForm_"+productObj.catentryId+"'>\n"
						+"<input type='hidden' name='storeId' value='"+this.storeId+"' id='OrderItemAddForm_storeId_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='orderId' value='.' id='OrderItemAddForm_orderId_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='catalogId' value='"+this.catalogId+"' id='OrderItemAddForm_orderId_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='URL' value='"+ tem + "' id='OrderItemAddForm_url_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='errorViewName' value='InvalidInputErrorView' id='OrderItemAddForm_errorViewName_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='catEntryId' value='"+productObj.catentryId+"' id='OrderItemAddForm_catEntryId_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' name='productId' value='"+productObj.catentryId+"' id='OrderItemAddForm_productId_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' value='1' name='quantity' id='OrderItemAddForm_quantity_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' value='' name='page' id='OrderItemAddForm_page_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' value='-1,-2,-3,-4,-5,-6,-7' name='calculationUsage' id='OrderItemAddForm_calcUsage_"+productObj.catentryId+"'/>\n"
						+"<input type='hidden' value='0' name='updateable' id='OrderItemAddForm_updateable_"+productObj.catentryId+"'/>\n"
						+"</form>\n";
					}


					if (viewType == "image") {
						
						if (((this.displayCounter-1) % this.resultsPerRow) == 0)
							var container = "<div>";
						else  var container = "<div class=\"container\">";

						_baseContentNamePrice = _baseContentNamePrice
							+ container
							+"<div id='baseContent_"+ _id +"' onmouseover='javascript:showPopupButton("+ productObj.catentryId +");' onmouseover='javascript:showPopupButton(" + productObj.catentryId +");' onmouseout='javascript:hidePopupButton(" + productObj.catentryId +");'>\n"
							+"<div class='img' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_5'>";
							if(this.dragVar == "true")
							{
								_baseContentNamePrice = _baseContentNamePrice
								+"<div dojoType='dojo.dnd.Source' jsId='dndSource' id='"+productObj.catentryId+"' copyOnly='true' dndType='"+productObj.dragSourceType+"'>\n"
								+"<div class='dojoDndItem' dndType='"+productObj.dragSourceType+"' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_6'>\n";
							}
							_baseContentNamePrice = _baseContentNamePrice
							+"<a href='"+productObj.productDisplayURL+"' id='img_"+productObj.catentryId+"' class='fastfinderhover' onkeydown='javascript: shiftTabHidePopupButton("+ productObj.catentryId +", event);' onfocus='showPopupButton("+ productObj.catentryId +");' onmouseout='javascript:hideBackgroundImage(this);' onmouseover='javascript:showBackgroundImage(this);'>\n";
							if(this.dragVar == "true" && dojo.isIE == 6)
							{
								_baseContentNamePrice = _baseContentNamePrice
								+"<iframe class='productDnDIFrame' scrolling='no' frameborder='0' src='"+getImageDirectoryPath()+"images/empty.gif'></iframe>";
							}
							_baseContentNamePrice = _baseContentNamePrice
							+"<img width='70' height='70' src='"+_baseContentImgSrc+"' alt='"+productObj.name+ " " + productObj.displayPrice + "' border='0'/>\n"
							+"</a>\n";
							if(this.dragVar == "true")
							{
								_baseContentNamePrice = _baseContentNamePrice
								+"</div>\n"
								+"</div>\n";
							}
							_baseContentNamePrice = _baseContentNamePrice
							+"</div>";
							if(this.qinfoVar == "true")
							{
								_baseContentNamePrice = _baseContentNamePrice
							+"<div id='popupButton_"+productObj.catentryId+"' class='main_quickinfo_button'>\n"
								+"<span class='secondary_button button_fit' >\n"
									+"<span class='button_container' >\n"
										+"<span class='button_bg' >\n"
											+"<span class='button_top'>\n"
												+"<span class='button_bottom'>\n"
													+"<a href='#' onfocus='showPopupButton("+ productObj.catentryId +");' onclick='javaScript:showPopup(" +productObj.catentryId+", event, null, \"popupButton_"+ productObj.catentryId +"\");' onkeypress='javaScript:showPopup(" +productObj.catentryId+", event, null, \"popupButton_"+ productObj.catentryId +"\");' onblur='hidePopupButton("+ productObj.catentryId +");'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_5'>"+this.quickinfo+"</a>\n"
												+"</span>\n"
											+"</span>\n"
										+"</span>\n"
									+"</span>\n"
								+"</span>\n"		
							+"</div>\n";
							}
							_baseContentNamePrice = _baseContentNamePrice
							+"</div>\n"
							+"<div class='description' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_9'>"
							+productObj.name
							+"</div>\n"
							+"<div class='price' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_10'>"
							+productObj.displayPrice
							+"</div>\n"
							+"<div class='button' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_11'>"
							+ this.createAddToCartRow(productObj, identifierString, "medium", false, imagePath, viewType, storeId, catalogId)
							+"</div>\n"
							+ "</div>";
								
					} 
					else if (viewType == "detailed") 
					{
						_baseContentNamePrice = _baseContentNamePrice
						+"<table id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_table_1'>"
						+"<tbody id='"+ _id + "Table' >"
						+"<tr id='"+ _id + "Tr' >"
								+"<td class='image' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_td_1'>\n"
									+"<div id='baseContent_"+ _id +"' onmouseover='javascript:showPopupButton("+ productObj.catentryId +");' onmouseover='javascript:showPopupButton(" + productObj.catentryId +");' onmouseout='javascript:hidePopupButton(" + productObj.catentryId +");' onblur='hidePopupButton("+ productObj.catentryId +");'>\n";
									if(this.dragVar == "true")
									{	
										_baseContentNamePrice = _baseContentNamePrice
										+"<div dojoType='dojo.dnd.Source' jsId='dndSource' id='"+productObj.catentryId+"' copyOnly='true' dndType='"+productObj.dragSourceType+"'>\n"
										+"<div class='dojoDndItem' dndType='"+productObj.dragSourceType+"' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_12'>\n";
									}
									_baseContentNamePrice = _baseContentNamePrice
												+"<div class='left_nav' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_div_13'>"
													+"<a href='"+productObj.productDisplayURL+"' id='img_"+productObj.catentryId+"' class='fastfinderhover' onfocus='showPopupButton("+ productObj.catentryId +");' onkeydown='javascript: shiftTabHidePopupButton("+ productObj.catentryId +", event);' onmouseout='javascript:hideBackgroundImage(this);' onmouseover='javascript:showBackgroundImage(this);'>\n";
														if(this.dragVar == "true" && dojo.isIE == 6)
														{
															_baseContentNamePrice = _baseContentNamePrice
															+"<iframe class='productDnDIFrame' scrolling='no' frameborder='0' src='"+getImageDirectoryPath()+"images/empty.gif'></iframe>";
														}
														_baseContentNamePrice = _baseContentNamePrice
														+"<img width='70' height='70' src='"+_baseContentImgSrc+"' alt='"+productObj.name+ " " + productObj.displayPrice + "' border='0'/>\n"
													+"</a>\n"
												+"</div>\n";
									if(this.dragVar == "true")
									{
										_baseContentNamePrice = _baseContentNamePrice
										+"</div>\n"
										+"</div>\n";
									}
									if(this.qinfoVar == "true")
									{
									_baseContentNamePrice = _baseContentNamePrice
										+"<div id='popupButton_"+productObj.catentryId+"' class='main_quickinfo_button'>\n"
											+"<span class='secondary_button button_fit' >\n"
												+"<span class='button_container' >\n"
													+"<span class='button_bg' >\n"
														+"<span class='button_top'>\n"
															+"<span class='button_bottom'>\n"
																+"<a href='#' onfocus='javascript:showPopupButton(" + productObj.catentryId +");' onclick='javaScript:showPopup(" +productObj.catentryId+", event, null, \"popupButton_"+ productObj.catentryId +"\");' onkeypress='javaScript:showPopup(" +productObj.catentryId+", event, null, \"popupButton_"+ productObj.catentryId +"\");' onblur='hidePopupButton("+ productObj.catentryId +");'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_6'>"+this.quickinfo+"</a>\n"
															+"</span>\n"
														+"</span>\n"
													+"</span>\n"
												+"</span>\n"
											+"</span>\n"										
										+"</div>\n";
									}
									_baseContentNamePrice = _baseContentNamePrice
									+"</div>\n"
								//	+productObj.catentryId
								+"</td>\n"
								+"<td class='information' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_td_2'>\n"
									+"<h3>"+productObj.name+"</h3>\n"
									+"<p>"+productObj.shortDescription+"</p>\n"
								+"</td>\n"
								+"<td class='list_view_price' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_td_3'>\n"
									+productObj.displayPrice+"\n"
								+"</td>\n"
								+"<td class='add_to_cart'id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_td_4'>\n";
								if(this.ajaxVar == 'true')
								{
									if(productObj.dragSourceType == "item" || productObj.dragSourceType == "package")
									{
										_baseContentNamePrice = _baseContentNamePrice
										+"<span class='primary_button button_fit' >\n"
											+"<span class='button_container' >\n"
												+"<span class='button_bg' >\n"
													+"<span class='button_top'>\n"
														+"<span class='button_bottom'>\n"	
															+"<a href='javascript:setCurrentId(\"WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_7\"); categoryDisplayJS.Add2ShopCartAjax(\"entitledItem_"+productObj.catentryId+"\",1,false)'  id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_7'>"+this.add2cart+"</a><br/>\n";
														+"</span>\n"
													+"</span>\n"
												+"</span>\n"
											+"</span>\n"
										+"</span>\n";										
									}
									else
									{
										_baseContentNamePrice = _baseContentNamePrice
										+"<span class='primary_button button_fit' >\n"
											+"<span class='button_container' >\n"
												+"<span class='button_bg' >\n"
													+"<span class='button_top'>\n"
														+"<span class='button_bottom'>\n"				
															+"<a onclick='javascript: showPopup(\""+productObj.catentryId+"\", event, null, \"popupButton_"+ productObj.catentryId +"\")' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_8'>"+this.add2cart+"</a><br/>\n";
														+"</span>\n"
													+"</span>\n"
												+"</span>\n"
											+"</span>\n"
										+"</span>\n";		
									}
								}
								if(this.ajaxVar == 'false')
								{
									if(productObj.dragSourceType == "item" || productObj.dragSourceType == "package")
									{
										_baseContentNamePrice = _baseContentNamePrice
										+"<span class='primary_button button_fit' >\n"
											+"<span class='button_container' >\n"
												+"<span class='button_bg' >\n"
													+"<span class='button_top'>\n"
														+"<span class='button_bottom'>\n"
															+"<a href='#' onclick='javascript:categoryDisplayJS.Add2ShopCart(\"entitledItem_"+productObj.catentryId+"\", document.getElementById(\"OrderItemAddForm_"+productObj.catentryId+"\"),1,false);return false;' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_9'>"+this.add2cart+"</a><br/>\n";
														+"</span>\n"
													+"</span>\n"
												+"</span>\n"
											+"</span>\n"
										+"</span>\n";		
									}																																																
									else
									{
										_baseContentNamePrice = _baseContentNamePrice
										+"<span class='primary_button button_fit' >\n"
											+"<span class='button_container' >\n"
												+"<span class='button_bg' >\n"
													+"<span class='button_top'>\n"
														+"<span class='button_bottom'>\n"
															+"<a onclick='javascript: showPopup(\""+productObj.catentryId+"\", event, null, \"popupButton_"+ productObj.catentryId +"\")' id='WC_FastFinderDisplayJS_"+productObj.catentryId+"_link_10'>"+this.add2cart+"</a><br/>\n";
														+"</span>\n"
													+"</span>\n"
												+"</span>\n"
											+"</span>\n"
										+"</span>\n";		
									}
								}
								_baseContentNamePrice = _baseContentNamePrice
								+"</td>\n"
								+"</tr></tbody>\n"
								+"</table>";
					}
					widgetHTML = _baseContentNamePrice
								+"<input type='hidden' id='compareImgPath_"+productObj.catentryId+"' value='"+productObj.productCompareImagePath+"'/>\n"
								+"<input type='hidden' id='compareImgDescription_"+productObj.catentryId+"' value='"+productObj.shortDescription+"'/>\n"
								+"<input type='hidden' id='compareProductDetailsPath_"+productObj.catentryId+"' value='"+productObj.productDisplayURL+"'/>\n";
								
				}
				else
				{
					if(viewType == "image")
					{
						widgetHTML = productObj.baseContentHTML;
						parentObject.innerHTML = widgetHTML;
						dojo.parser.parse(parentObject);
					}
					else
					{
						widgetHTML = productObj.baseDetailedContentHTML;	
						parentObject.innerHTML = widgetHTML;
						dojo.parser.parse(parentObject);
					}
		
		
				}				
				parentObject.innerHTML = widgetHTML;
				dojo.parser.parse(parentObject);
		},

		/**
		* addElementToVector Creates an instance of a WCProduct object to the {@link fastFinderJS.allCatalogEntries} map after giving values to appropriate characteristics of the catalog entry. 
		* This map will be used to display the sorted list of catalog entries.
		*
		* @param targetVector {Vector} Vector which holds all the products in the price sort.
		* @param {String} catentryId Catalog entry ID with which a product is uniquely identified.
		* @param {String} SKU The part number of the product.
		* @param {String} name Product name.
		* @param {int} identifierCounter A count of the total number of elements added to this vector so far.
		* @param {String} shortDescription A short description about the product.
		* @param {String} smallImageSrc Source path of the small size image of the product.
		* @param {String} productCompareImagePath Source path of the compare image of the product.
		* @param {String} mediumImageSrc  Source path of the medium size image of the product.
		* @param {String} price The unformatted price of the product.
		* @param {String} displayPrice The locale appropriate formatted price of the product used for display purposes.
		* @param {String} brand The brand of the product.
		* @param {String} productDisplayURL The URL to use in order to view the product display page for this product.
		* @param {String} dragSourceType Drag source type of the product like item/package.
		* @param {Array} featuresArray A JSON array holding an array of features for this product.
		* @param {Array} attrArray A JSON array holding the defining attribute name value pairs for this product.
		* @param {String} baseContentHTML Base content html for the product.
		* @param {String} toolTipHTML Tooltip html for the product.
		* @param {Array} entitledArray A JSON array of the entitled item IDs for this product.
		*
		**/
		addElementToVector : function(targetVector, catentryId, SKU, name, identifierCounter, shortDescription, smallImageSrc, productCompareImagePath, mediumImageSrc, price, displayPrice, brand, productDisplayURL, dragSourceType, featuresArray, attrArray, baseContentHTML, toolTipHTML,entitledArray){
			var wcProduct = new WCProduct();
			wcProduct.catentryId = catentryId;
			wcProduct.SKU = SKU;
			wcProduct.name = name;
			wcProduct.identifierCounter = identifierCounter;
			wcProduct.shortDescription = shortDescription;
			wcProduct.productCompareImagePath = productCompareImagePath;
			wcProduct.smallImageSrc = smallImageSrc;
			wcProduct.mediumImageSrc = mediumImageSrc;
			wcProduct.price = price;
			wcProduct.displayPrice = displayPrice;
			wcProduct.brand = brand;
			wcProduct.productDisplayURL = productDisplayURL;
			wcProduct.dragSourceType = dragSourceType;
			wcProduct.features = featuresArray;
			wcProduct.attributes = attrArray;
			wcProduct.baseContentHTML = baseContentHTML;
			wcProduct.baseDetailedContentHTML = toolTipHTML;
			wcProduct.entitledItemArray = entitledArray;
			
		
			//if(wcProduct.features[0] != null)
			//{
				
				if (fastFinderJS.allCatalogEntries[catentryId] != null && fastFinderJS.allCatalogEntries[catentryId] != "undefined")
				{
					var currentIndex = 0;
					for (var i = 0; i < targetVector.size(); i++)
					{
						if (fastFinderJS.allCatalogEntries[targetVector.elementAt(i)].catentryId == catentryId)
						{
							currentIndex = i;
						}
					}
						
					if (currentIndex+1 == targetVector.size() || parseFloat(fastFinderJS.allCatalogEntries[catentryId].price) > parseFloat(fastFinderJS.allCatalogEntries[targetVector.elementAt(currentIndex+1)].price))
					{
						targetVector.removeElement(catentryId);
						
						targetVector.addElement(catentryId);
						fastFinderJS.allCatalogEntries[catentryId] = wcProduct;
					}
				
				}
				else
				{
					targetVector.addElement(catentryId);
					fastFinderJS.allCatalogEntries[catentryId] = wcProduct;
				}
				
					
				
			//}
		},

		/**
		* addElementToBrandVector Adds a catalog entry to a Vector of results sorted by manufacturer's name (Brand).
		*
		* @param {Vector} targetVector A list of the products sorted according to brand.
		* @param {string} catentryId The catalog entry ID of a catalog entry to add to the sorted Vector.
		*
		**/
		addElementToBrandVector : function(targetVector, catentryId)
		{
			targetVector.addElement(catentryId);
		},


		/**
		* showResults Displays the product result set.
		*
		* @param {String} filterAction Used to filter the result set. Determines what type of filter to use such as "price" or "view".
		*
		**/
		showResults : function(filterAction) {
			if(document.tempForm.temp.value)
				this.viewType = document.tempForm.temp.value;
			else
				this.viewType = "image";
			document.FastFinderForm.pageView.value = this.viewType;
			document.tempForm.temp.value = this.viewType;
			cursor_wait();

			//initialize global variables
			var productObj = null;
			var id = "fastFinderResults";
			var fastFinderResultsDiv = document.getElementById("fastFinderResults");
			for (j=0; j<fastFinderResultsDiv.childNodes.length; j++) {
				fastFinderResultsDiv.removeChild(fastFinderResultsDiv.childNodes[j]);
			}
			this.displayCounter = 0;
			this.displayRowCounter = 0;
			
			this.generateResultSet(filterAction);
			this.showPagingMessage();
			this.showPagingMessage2();
			this.showLeftPaginationMarker();
			this.showRightPaginationMarker();
			//create new product quick view HTML for the new result set and display them
			for (i=beginIndex; i<(beginIndex + this.displayTotal); i++) {
				this.displayCounter++;
				productObj = this.catalogEntriesResultSet.elementAt(i);
				
				if (i%this.pageSize == 0) {
					
					
					var table = document.createElement("table");
					table.setAttribute("id", "four-grid");
					table.setAttribute("cellpadding", "0");
					table.setAttribute("cellspacing", "0");

					var tbody = document.createElement("tbody");
					table.appendChild(tbody);
					
					fastFinderResultsDiv.appendChild(table);
					
				}
					
						var dtd = document.createElement("td");
						dtd.setAttribute("class","divider_line");
						dtd.setAttribute("className","divider_line"); // for IE
						dtd.setAttribute("colspan","4");
						dtd.setAttribute("colSpan","4"); // for IE
						var dtr = document.createElement("tr");
						
				if (((this.displayCounter-1) % this.resultsPerRow) == 0 ){
						dtr.appendChild(dtd);

						if (this.viewType == "image")
							tbody.appendChild(dtr);

				}
				
				var td1 = document.createElement("td");
				td1.setAttribute("id", "browseCatEntry"+i);
				td1.setAttribute("class","item");
				td1.setAttribute("className","item"); // for IE
				this.createProductWidget(td1,productObj, this.productIdentifierString, "medium", false, this.imagePath, this.viewType, this.storeId, this.catalogId);
				
				if (((this.displayCounter-1) % this.resultsPerRow) == 0 || this.viewType == "detailed") {
					
					this.displayRowCounter++;
					
					var tr1 = document.createElement("tr");
					tr1.setAttribute("id", "displayRow"+this.displayRowCounter);	
					tbody.appendChild(tr1);
					
					dtr.appendChild(dtd);
					tbody.appendChild(dtr);
				}
				else{
					var tr1 = document.getElementById("displayRow"+this.displayRowCounter);
				}
				tr1.appendChild(td1);
			}
					
			cursor_clear();
			
		},
		
		
		
		/**
		* generateResultSet Generates the catalog entry result set to display based on criteria like price, brand and feature.
		* This method is called from { @link fastFinderJS.showResults } to search thru the list of products available and filter them based on 
		* the selected filter criteria such as price, view, brands, and features.
		* The results are stored in {@link fastFinderJS.catalogEntriesResultSet}.
		*
		* @param {String} filterAction Used to filter the result set.
		*
		**/
		generateResultSet : function(filterAction) {
		
			if (document.FastFinderForm.initialState.value == "false") {
				var tempList = null;
				if (filterAction != "beginIndex" && filterAction != "view") {
					beginIndex = 0;
					// re-build the result set based on criterias selected by user
					this.catalogEntriesResultSet = new Vector();
					
					// 1. Get the initial sorted list by price or by brand 
					if (document.FastFinderForm.orderBy1.value == "OfferPricePrice") {
						tempList = this.catalogEntriesByPrice;
					} else {
						tempList = this.catalogEntriesByBrand;
					}
				
					// 2. Eliminate entries based on selected criterias
					var minPrice = parseFloat(document.FastFinderForm.selectedMinPrice.value);
					var maxPrice = parseFloat(document.FastFinderForm.selectedMaxPrice.value);
					var brands = new Vector();
					var manufacturerNames = document.BrandsForm.elements;
					for (i=0; i<manufacturerNames.length; i++) {
						if (manufacturerNames[i].checked) {
							brands.addElement(manufacturerNames[i].value);
						}
					}
					var featureNames = new Vector();
					var featuresElements = document.FeatureNamesForm.elements;
					for (i=0; i<featuresElements.length; i++) {
						if (featuresElements[i].checked) {
							featureNames.addElement(featuresElements[i].value);
						}
					}
					
					for (i=0; i<tempList.size(); i++) {
						var hasPrice = false;
						var hasBrand = false;
						var hasFeature = false;
						//check price
						var productObjNew = this.allCatalogEntries[tempList.elementAt(i)];
						
						if (minPrice <= productObjNew.price && productObjNew.price <= maxPrice) {
							hasPrice = true;
						}
						
						//check brands (if no brands in this category then assume all products are valid)
						if (brands.contains(productObjNew.brand) || brands.size()==0) {
							hasBrand = true;
						}
						
						if(hasPrice && hasBrand) {
							
							
							//check features
							if(featureNames.size()==0)
							{
								hasFeature = true;  //If no feature is selected, show all products.
							}
							else
							{
									for(j=0; j<featureNames.size(); j++)
									{
										var featuresFlag = false;
										for(f=0; f<productObjNew.features.length; f++)
										{
											productObjNew.features[f] = productObjNew.features[f].replace(/&#039;/g,"'");
											if(featureNames.elementAt(j)==productObjNew.features[f])
											{
												featuresFlag = true;
												break;
											}
										}
										if(featuresFlag==false)
										{
											hasFeature = false;
											break;
										}
										else
										{
											hasFeature = true;
										}
									}
							}
						
							if (hasFeature)
							{
								this.catalogEntriesResultSet.addElement(productObjNew);
							}
						}
					}
				}
			} else {
				this.catalogEntriesResultSet = new Vector();
				for (k=0; k<this.catalogEntriesByPrice.size(); k++) {
					this.catalogEntriesResultSet.addElement(this.allCatalogEntries[this.catalogEntriesByPrice.elementAt(k)]);
				}
            }
			var viewsTR = document.getElementById("viewsTR");
			var viewTypeTD2 = document.getElementById("viewTypeTD2");
			var viewTypeTD1 = document.getElementById("viewTypeTD1");
			if(viewsTR != null){
				if (this.viewType == "detailed") {
					if (viewTypeTD1 != null) {
						viewsTR.removeChild(viewTypeTD1);
					}
					if (viewTypeTD2 == null) {
						viewTypeTD2 = this.createViewTypeTD2();
					}
					viewsTR.appendChild(viewTypeTD2);
				} else {
					if (viewTypeTD2 != null) {
						viewsTR.removeChild(viewTypeTD2);
					}
					if (viewTypeTD1 == null) {
						viewTypeTD1 = this.createViewTypeTD1();
					}
					viewsTR.appendChild(viewTypeTD1);
				}
			}
			// 3. Set all totals based on current result set and beginIndex
			this.catalogEntriesResultSetTotal = this.catalogEntriesResultSet.size();
			this.catalogEntriesResultSetTotalPages = Math.ceil(this.catalogEntriesResultSetTotal/this.pageSize);
			this.catalogEntriesResultSetCurrentPageNumber = Math.floor(beginIndex/this.pageSize) + 1;
			
			if (this.catalogEntriesResultSetTotal < (this.catalogEntriesResultSetCurrentPageNumber*this.pageSize)) {
				this.displayTotal = (this.catalogEntriesResultSetTotal-beginIndex);
			} else {
				this.displayTotal = this.pageSize;
			}
			
			if (beginIndex == 0) {
				prevIndex = 0;
			} else {
				prevIndex = beginIndex-this.pageSize;
			}
			if ( (beginIndex+this.displayTotal) >= this.catalogEntriesResultSetTotal) {
				nextIndex = beginIndex;
			} else {
				nextIndex = beginIndex+this.displayTotal;
			}

		},
	
		
		/**
		* showPagingMessage
		* Generates the code to display the paging message on top and below the product result display region regarding the products displayed.
		* More specifically this function will display a message such as 'Displaying products 1 - 12 of 25'.
		**/
		showPagingMessage : function() {
			var resultsTDTop = document.getElementById("pagingMessageDisplayTop");
			var resultsTDBottom = document.getElementById("pagingMessageDisplayBottom");
			var text = this.pagingMessage;
			if (this.catalogEntriesResultSetTotal != 0) {
				text = text.replace(/%0/, beginIndex+1);
			} else {
				text = text.replace(/%0/, beginIndex);
			}
			text = text.replace(/%1/, beginIndex+this.displayTotal);
			text = text.replace(/%2/, this.catalogEntriesResultSetTotal);
			
			var textNodeTop = document.createTextNode(text);
			var textNodeBottom = document.createTextNode(text);
			
			if (resultsTDTop.childNodes.length == 1) {
				resultsTDTop.removeChild(resultsTDTop.firstChild);
			}
			resultsTDTop.appendChild(textNodeTop);
			
			if (resultsTDBottom.childNodes.length == 1) {
				resultsTDBottom.removeChild(resultsTDBottom.firstChild);
			}
			resultsTDBottom.appendChild(textNodeBottom);
		},

		/**
		* showPagingMessage2
		* Generates the code to display the paging message on top and below the product result display region regarding the number of pages to display.
		* More specifically this function will display a message showing the current page and total number of pages such as '0 of 3'.
		**/
		showPagingMessage2 : function() {
				var resultsTDTop = document.getElementById("pagingMessage2DisplayTop");
			var resultsTDBottom = document.getElementById("pagingMessage2DisplayBottom");
			var text = this.pagingMessage2;
			if (this.catalogEntriesResultSetTotal != 0) {
				text = text.replace(/%0/, this.catalogEntriesResultSetCurrentPageNumber);  
			} else {
				text = text.replace(/%0/, 0);
			}
			text = text.replace(/%1/, this.catalogEntriesResultSetTotalPages);
			
			var textNodeTop = document.createTextNode(text);
			var textNodeBottom = document.createTextNode(text);
			
			if (resultsTDTop.childNodes.length == 1) {
				resultsTDTop.removeChild(resultsTDTop.firstChild);
			}
			resultsTDTop.appendChild(textNodeTop);
			
			if (resultsTDBottom.childNodes.length == 1) {
				resultsTDBottom.removeChild(resultsTDBottom.firstChild);
			}
			resultsTDBottom.appendChild(textNodeBottom);
		},

		
		/**
		 * Generates the code to display the top left and bottom left paging arrows if the total number of pages (found in {@link fastFinderJS.catalogEntriesResultSetTotalPages} ) 
		 * is more than 1. Otherwise, the markers are not displayed.
		 *
		 * @see fastFinderDisplayJS.showRightPaginationMarker.
		 *
 		 **/
		showLeftPaginationMarker : function() {
			var leftMarkerImageName = "paging_back.png";
			var leftAltDescription = this.leftMarkerMessage;
			var topLeftMarkerElem = document.getElementById("fastFinderDisplayJS_TopLeftPaginationMarker");
			var topLeftMarkerImgElem = null;
			var bottomLeftMarkerImgElem = null;
			var bottomLeftMarkerElem = document.getElementById("fastFinderDisplayJS_BottomLeftPaginationMarker");
			
			/* Checks to see if total pages is greater than 1*/
			if (this.catalogEntriesResultSetTotalPages > 1) {
			
				topLeftMarkerElem.style.visibility = 'visible';	
				bottomLeftMarkerElem.style.visibility = 'visible';	
				
			} else {
			
				topLeftMarkerElem.style.visibility = 'hidden';
				bottomLeftMarkerElem.style.visibility = 'hidden';
				
			}
			
			
			
		},
		
		/**
		 * Generates the code to display the top right and bottom right paging arrows if the total number of pages (found in {@link fastFinderJS.catalogEntriesResultSetTotalPages} ) 
		 * is more than 1. Otherwise, the markers are not displayed.
		 *
		 * @see fastFinderDisplayJS.showLeftPaginationMarker
		 *
		 **/
		showRightPaginationMarker : function() {
			var rightMarkerImageName = "paging_next.png";
			var rightAltDescription = this.rightMarkerMessage;
			var topRightMarkerElem = document.getElementById("fastFinderDisplayJS_TopRightPaginationMarker");
			var topRightMarkerImgElem = null;
			var bottomRightMarkerImgElem = null;
			var bottomRightMarkerElem = document.getElementById("fastFinderDisplayJS_BottomRightPaginationMarker");
			
			/* Checks to see if total pages is greater than 1*/
			if (this.catalogEntriesResultSetTotalPages > 1) {
			
				topRightMarkerElem.style.visibility = 'visible';	
				bottomRightMarkerElem.style.visibility = 'visible';	
				
			} else {
			
				topRightMarkerElem.style.visibility = 'hidden';
				bottomRightMarkerElem.style.visibility = 'hidden';
				
			}
		},		
		
		/**
		* filterResultsWithPrice Filters the result set based on upper and lower bounds of price.
		* Filters the result set based on upper and lower bounds of price.
		*
		* @param {Object} _this Contains the upper and lower price bounds.
		*
		**/
		filterResultsWithPrice : function(_this){
			
			values = _this.getCurrentValues();
			this.filterResultsWithPriceRange(values.upper, values.lower);
		},

		/**
		* filterResultsWithPriceRange Filters the result set based on a upper and lower range of price.
		*
		* @param {int} upper The upper bound of price to filter the result set.
		* @param {int} lower The lower bound of price to filter the result set.
		*
		**/
		filterResultsWithPriceRange : function(upper, lower){
			
			document.FastFinderForm.selectedMaxPrice.value = upper;
			document.FastFinderForm.selectedMinPrice.value = lower;
			document.FastFinderForm.initialState.value = "false";
			
			this.showResults("price");
		},

		/**
		* filterResultsWithView Filters the result set based on the view the product result set to be displayed.
		*
		* @param {String} view Contains the view type: image/detailed.
		*
		**/
		filterResultsWithView : function(view){
		
			document.FastFinderForm.pageView.value = view;
			document.tempForm.temp.value = view;
			this.viewType = view;
			document.FastFinderForm.initialState.value = "false";
			var viewsTR = document.getElementById("viewsTR");
			
			var viewTypeTD1 = document.getElementById("viewTypeTD1");
			var viewTypeTD2 = document.getElementById("viewTypeTD2");
			if (this.viewType == "image") {
				if (viewTypeTD2 != null) {
					viewsTR.removeChild(viewTypeTD2);
				}
				if (viewTypeTD1 == null) {
					viewTypeTD1 = this.createViewTypeTD1();
				}
				viewsTR.appendChild(viewTypeTD1);
			} else if (this.viewType == "detailed") {
				if (viewTypeTD1 != null) {
					viewsTR.removeChild(viewTypeTD1);
				}
				if (viewTypeTD2 == null) {
					viewTypeTD2 = this.createViewTypeTD2();
				}
				viewsTR.appendChild(viewTypeTD2);
			}
			
			this.showResults("view");
		},

		/**
		* createViewTypeTD1 Creates view type icons when the present view type is 'image' and click on 'detailed' view icon is to be enabled.
		*
		* @return {HTMLElement} Span element containing the view type icons.
		*
		**/
		createViewTypeTD1 : function() {
			
			var viewTypeTD1 = document.createElement("span");
			viewTypeTD1.setAttribute("id", "viewTypeTD1");
			var imageSelected = document.createElement("img");
			imageSelected.setAttribute("class", "views_icon1");
			imageSelected.setAttribute("className","views_icon1"); // for IE
			imageSelected.setAttribute("id", "imageTypeImageSelected");
			imageSelected.setAttribute("src", this.imagePath + "grid_selected.png");
			imageSelected.setAttribute("border", "0");
			
			var detailedTypeLink = document.createElement("a");
			detailedTypeLink.setAttribute("href", "javascript: filterWithView('detailed');");
			detailedTypeLink.setAttribute("id", "detailedTypeLink");
			var detailedTypeImage = document.createElement("img");
			detailedTypeImage.setAttribute("class", "views_icon1");
			detailedTypeImage.setAttribute("className","views_icon1"); // for IE
			detailedTypeImage.setAttribute("src", this.imagePath + "list_normal.png");
			detailedTypeImage.setAttribute("border", "0");
			detailedTypeLink.appendChild(detailedTypeImage);
			
			viewTypeTD1.appendChild(imageSelected);
			viewTypeTD1.appendChild(detailedTypeLink);
			
			return viewTypeTD1;
		},
		
		/**
		* createViewTypeTD2 Creates view type icons when the present view type is 'detailed' and click on 'image' view icon is to be enabled.
		*
		* @return {HTMLElement} Span element containing the view type icons.
		*
		**/
		createViewTypeTD2 : function() {
			
			var viewTypeTD2 = document.createElement("span");
			viewTypeTD2.setAttribute("id", "viewTypeTD2");
			var detailedSelected = document.createElement("img");
			detailedSelected.setAttribute("class", "views_icon1");
			detailedSelected.setAttribute("className","views_icon1"); // for IE
			detailedSelected.setAttribute("id", "detailedTypeImageSelected");
			detailedSelected.setAttribute("src", this.imagePath + "list_selected.png");
			detailedSelected.setAttribute("border", "0");
				
			var imageTypeLink = document.createElement("a");
			imageTypeLink.setAttribute("href", "javascript: filterWithView('image');");
			imageTypeLink.setAttribute("id", "imageTypeLink");
			var imageTypeImage = document.createElement("img");
			imageTypeImage.setAttribute("class", "views_icon1");
			imageTypeImage.setAttribute("className","views_icon1"); // for IE
			imageTypeImage.setAttribute("src", this.imagePath + "grid_normal.png");
			imageTypeImage.setAttribute("border", "0");
			imageTypeLink.appendChild(imageTypeImage);
			
			viewTypeTD2.appendChild(imageTypeLink);
			viewTypeTD2.appendChild(detailedSelected);
			
			return viewTypeTD2;		
		},
		
		/**
		* filterResultsWithPrevIndex Filters the result set based on the index of the previous page of display.
		**/
		filterResultsWithPrevIndex : function(){
			
			document.FastFinderForm.beginIndex.value = prevIndex;
			beginIndex = prevIndex;
			document.FastFinderForm.initialState.value = "false";
			
			this.showResults("beginIndex");
		},

		/** 
		* filterResultsWithNextIndex Filters the result set based on the index of the next page of display.
		**/
		filterResultsWithNextIndex : function(){
			
			document.FastFinderForm.beginIndex.value = nextIndex;
			beginIndex = nextIndex;
			document.FastFinderForm.initialState.value = "false";
			
			this.showResults("beginIndex");
		},

		/**
		* filterResultsWithOrderBy Filters the result set based on the 'Order by' option: based on Brand or based on Price.
		*
		* @param orderByNode The node representing the order by drop down box.
		*
		**/
		filterResultsWithOrderBy : function(orderByNode){
			
			document.FastFinderForm.orderBy1.value = orderByNode.value;
			document.FastFinderForm.initialState.value = "false";
			
			this.showResults("orderBy");
		},

		/**
		* filterResultsWithBrands Filters the result set based on the Brand of the product. 
		* If a particular brand is checked, products of that brand are displayed and not otherwise.
		**/
		filterResultsWithBrands : function(){
			
			document.FastFinderForm.initialState.value = "false";
			
			this.showResults("brand");
		},

		/**
		* filterResultsWithFeatures Filters the result set based on the Features possessed by the product.
		* If certain features are checked, products having all those features are displayed and not otherwise.
		**/
		filterResultsWithFeatures : function(){
			
			document.FastFinderForm.initialState.value = "false";
		
			this.showResults("features");
		},

		/**
		* add2History Adds a new history object. Each entry in the history stack needs to have a unique value. So a timestamp is attached after each url.
		*
		* @param {Array} actionArray Array of action objects.
		* @param {Array} formArray Array of form objects.
		* @param {String} url the url of the page.
		*
		**/
		add2History : function(actionArray, formArray, url){
			
			if(url == null || url =="")
				url = "identifier=" + (new Date()).getTime();

			var historyObject = new fastFinderJS.HistoryTracker(actionArray, formArray, url);
			dojo.back.addToHistory(historyObject);	
		},

		/**
		* HistoryTracker History state object for history tracking.
		*
		* @param {Array} actionArray An array of actions.
		* @param {Array} formArray An array of forms on the page.
		* @param {String} changeUrl The url for the current state of this page.
		*
		**/
		HistoryTracker:function(actionArray, formArray, changeUrl){
			
			this.actionArray = null;
			this.formArray = null;
			
			this.actionArray = actionArray;
			this.formArray = formArray;

			this.changeUrl =  changeUrl;
		},

		/**
		* processBookmarkURL If there is bookmark information in the url, extract the url after #. 
		* Update context for MyAccountCenterLinkDisplay_Context with the bookmarked url.
		**/
		processBookmarkURL : function(){
		
			var bookmarkId = location.hash;	
			if(bookmarkId){					        
				bookmarkId = bookmarkId.substring(1, bookmarkId.length);
			}   
			if(bookmarkId){
					var indexOfIdentifier = bookmarkId.indexOf("identifier", 0);
					if ( indexOfIdentifier >= 0) {
						var realUrl = bookmarkId.substring(0, indexOfIdentifier - 1);
				}
			}

			if(bookmarkId == null || bookmarkId == ""){
				
			}
		},

		/**
		* goBack Receives backward notifications for HistoryTracking.
		**/
		goBack:function(){
				
			if(this.formArray != null){
				//Load the forms
				for(formIndex in this.formArray){
					var formObject = this.formArray[formIndex];
					document[formObject.form][formObject.formElementName][formObject.formElementProperty] = formObject.formElementPropertyValue;
				}
			}

			if(this.actionArray != null){
				//Call all the functions
				for(actionIndex in this.actionArray){
					var actionObject = this.actionArray[actionIndex];
					var func = actionObject.action;
					func.apply(actionObject.actionNameSpace, actionObject.actionParameter);
				}
			}
		},
			
		/**
		* goForward Receives forward notifications for HistoryTracking.
		**/
		goForward:function(){
			
			if(this.formArray != null){
				//Load the forms
				for(formIndex in this.formArray){
					var formObject = this.formArray[formIndex];

					document[formObject.form][formObject.formElementName][formObject.formElementProperty] = formObject.formElementPropertyValue;
				}
			}

			if(this.actionArray != null){
				//Call all the functions
				for(actionIndex in this.actionArray){
					var actionObject = this.actionArray[actionIndex];
					var func = actionObject.action;
					func.apply(actionObject.actionNameSpace, actionObject.actionParameter);
				}
			}
		},
			
		/** 
		* initFastFinderHistory Initialize the history object to include a list of the forms.
		**/
		initFastFinderHistory : function(){
			
			var params = [];
			var actionArray = [];
			var formArray = [];
			var url = "identifier=" + (new Date()).getTime();

			actionArray = fastFinderJS.addAction(actionArray, fastFinderJS.showResults, fastFinderJS, params);
			formArray = fastFinderJS.getFormArray(formArray, "FastFinderForm");
			formArray = fastFinderJS.getFormArray(formArray, "BrandsForm");
			formArray = fastFinderJS.getFormArray(formArray, "FeatureNamesForm");
			formArray = fastFinderJS.getFormArray(formArray, "SortResultForm");

			var historyObject = new fastFinderJS.HistoryTracker(actionArray, formArray, url);
			dojo.back.setInitialState(historyObject);
		},

		/**
		* addAction Adds a new action object to the Action Array. An action object holds information about a function to call when moving to different states
		* 			in the page history. An example would be addAction(actionArray, fastFinderJS.showResults, fastFinderJS, params) where the parameters have the following meanings:
		*			  actionArray is an array of actions to append this new action to.
		*			  fastFinderJS.showResults is the method to call.
		*			  fastFinderJS is the namespace of where to find this method.
		*	          params is an array of parameter values to pass into the method.
	    *
	    *			  This function can be added to the {@link fastFinderJS.HistoryTracker} and then called with newAction.apply(newActionNameSpace, newActionParameter). 
		*
		* @param {Array} actionArray An array of actions to undertake when specific points in the history object are reached.
		* @param {Object} newAction The new action to add to the array. This would be a function such as fastFinderJS.showResults.
		* @param {Object} newActionNameSpace The namespace where the newAction can be found in such as fastFinderJS.
		* @param {Array} newActionParameter An array of parameters to pass to the newAction.
		*
		* @return {Array} actionArray . Returns an array of actions for use in a history object. 
		*
		**/
		addAction : function (actionArray, newAction, newActionNameSpace, newActionParameter){
			
			var actionObject = new Object();
			actionObject["action"] = newAction;
			actionObject["actionNameSpace"] = newActionNameSpace;
			actionObject["actionParameter"] = newActionParameter;
			actionArray.push(actionObject);

			return actionArray;
		},

		/**
		* addForm Adds a new form to the form array.
		*			This method would need to be called for every property of every element in the form so as to save the values of each of those properties. 
		*			Those properties can then be retrieved when the history state of the page is changed so as to reset the values of each element of every form to a previous state.
		*
		* @param {Array} formArray The existing form array to add a new form to.
		* @param {String} newFormName The name of the new form to add.
		* @param {String} newElementName The element of the form to add
		* @param {String} newElementProperty The property of the element to add.
		* @param {String} newElementPropertyValue The property value of the element to add.
		*
		* @ return {Array} formArray . Returns an array of forms for use in a history object.
		*
		**/
		
		addForm : function (formArray, newFormName, newElementName, newElementProperty, newElementPropertyValue){
			
			var formObject = new Object();
			formObject["form"] = newFormName;
			formObject["formElementName"] = newElementName;
			formObject["formElementProperty"] = newElementProperty;
			formObject["formElementPropertyValue"] = newElementPropertyValue;

			formArray.push(formObject);
			return formArray;
		},

		/**
		* getFormArray Gets the Form Array after adding a form indicated by its name.
		*				This method will add another form to the formArray passed in after calling addForm for each of the elements on that form. 
		*				
		* @param {Array} formArray The array of forms.
		* @param {String} formName The name of the form to retrieve.
		*
		* @return {Object} formArray . Returns an array of forms.
		*
		**/
		getFormArray : function(formArray, formName){
			
			if(!formArray)
				formArray = [];
			
			var formNode = document.forms[formName];
			
			for(var i = 0; i < formNode.elements.length; i++){
				var element = formNode.elements[i];
				if(!element || element.tagName.toLowerCase() == "fieldset") { continue; }
				
				var name = element.name;
				var type = element.type.toLowerCase();

				if(type == "select-multiple"){
					for(var j = 0; j < element.options.length; j++){
						if(element.options[j].selected) {
							//this.addForm(formArray, formName, name, "selected", newElementPropertyValue)
							//values.push(name + "=" + enc(formNode.options[j].value));
						}
						this.addForm(formArray, formName, name, "selectedIndex", element.selectedIndex);
					}
				}else if(type == "radio" || type == "checkbox"){
					//if(formNode.checked){
						//values.push(name + "=" + enc(formNode.value));
					//}
					this.addForm(formArray, formName, name, "checked", element.checked);
				}else{
					//values.push(name + "=" + enc(formNode.value));
					this.addForm(formArray, formName, name, "value", element.value);
				}
			}
			return formArray;
		},
		
		/**
		* finishLoading Performs an Ajax call to retrieve the remaining catalog entries for display.
	    *	This method will retrieve a part of the remaining set of results starting at beginIndex up to beginIndex plus { @link fastFinderJS.ajaxPageSize } 
		*
		* @param {int} beginIndex The begin index from which to start retrieving additional results from.
		*
		**/
		finishLoading: function(beginIndex) {
		
			if (beginIndex == null || beginIndex == undefined)
			{
					beginIndex = this.catalogEntriesByPrice.size();
			}
			
			if (this.catalogEntriesRetrieved == 0)
			{
				this.catalogEntriesRetrieved = this.pageSize;
			}
		
			var parameters = {};
			parameters.storeId = storeId;
			parameters.langId=langId;
			parameters.catalogId=catalogId;
			parameters.categoryId=this.categoryId;
			parameters.parent_category_rn=this.parent_category_rn;
			parameters.top_category=this.top_category;
			parameters.pageSize=this.ajaxPageSize;
			parameters.beginIndex=beginIndex;
			
			if (((this.catalogEntriesByPrice.size() < this.totalProductsInCategory && this.catalogEntriesByPrice.size() >= this.pageSize) || this.totalProductsInCategory == "UNDEFINED") && !fastFinderJS.firstSortLoaded)
			{
				parameters.resultType = "OfferPricePrice";
				
				dojo.publish("ajaxRequestInitiated");
				dojo.xhrPost({
						url: getAbsoluteURL() + "FastFinderLoader",				
						handleAs: "json-comment-filtered",
						content: parameters,
						service: this,
						load: this.loadResultsForFastFinder,
						error: function(errObj,ioArgs) {
							console.debug(errObj.description);
							dojo.publish("ajaxRequestCompleted");
						}
					});
			}
			else
			{	
				if (this.catalogEntriesByBrand.size() < this.catalogEntriesByPrice.size() || this.totalProductsInCategory == "UNDEFINED")
				{		
					
						if (this.catalogEntriesByBrand.size() == 0)
						{
							parameters.beginIndex = 0;
						}
						
						parameters.resultType = "Brand";
				
						dojo.publish("ajaxRequestInitiated");
						dojo.xhrPost({
							url: getAbsoluteURL() + "FastFinderLoader",				
							handleAs: "json-comment-filtered",
							content: parameters,
							service: this,
							load: this.loadResultsForFastFinder,
							error: function(errObj,ioArgs) {
								console.debug(errObj.description);
								dojo.publish("ajaxRequestCompleted");
							}
						});
				}
			
			}
		},
		
	
		/**
		* loadResultsForFastFinder After adding the remaining catalog entries to the list this method will re-set some
		*			internal variables as well as adjust the list of brands, features, as well as the min and max prices.
		*
		* @param {JSON} serviceResponse A JSON object that holds service response data such as all the newly loaded catalog entries
		* @param ioArgs Part of the dojo xhrPost framework for returning arguments to the client.
		*
		**/
		loadResultsForFastFinder: function(serviceResponse, ioArgs) {
			
			var catalogEntriesByPrice = serviceResponse.catalogEntriesByPrice;
		
			var catalogEntriesByBrand = serviceResponse.catalogEntriesByBrand;
		
			var brands = serviceResponse.brands;
			
			var features = serviceResponse.features;
				
			var totalCountByBrand = serviceResponse.totalCountByBrand;
			var minPrice = serviceResponse.minPrice;
			var maxPrice = serviceResponse.maxPrice;
			
			if (catalogEntriesByPrice != null && catalogEntriesByPrice != undefined && fastFinderJS.catalogEntriesByPrice.size() < totalCountByBrand && !fastFinderJS.firstSortLoaded)
			{
					var originalEntriesByPrice = fastFinderJS.catalogEntriesByPrice;
					var originalIdsByPrice = new Vector();
					
					for (var i = 0; i < originalEntriesByPrice.size(); i++)
					{
						originalIdsByPrice.addElement(originalEntriesByPrice.elementAt(i, null));
					}
					
					for (var i = 0; i < catalogEntriesByPrice.length; i++)
					{
						var catalogEntry;
						try
						{
							catalogEntry = catalogEntriesByPrice[i].catalogEntry;
						
							var skus = (catalogEntry.items == null || catalogEntry.items == undefined)?"":catalogEntry.items;
							
							
								fastFinderJS.addElementToVector(fastFinderJS.catalogEntriesByPrice, catalogEntry.catentryId, catalogEntry.partNumber, catalogEntry.name, 
													catalogEntry.counter, catalogEntry.shortDesc, catalogEntry.smallImgSrc, catalogEntry.productCompareImagePath,
													catalogEntry.mediumImageSrc, catalogEntry.calculatedContractPrice,
													catalogEntry.displayPrice, catalogEntry.manufacturerName,
													catalogEntry.catEntryDisplayUrl, catalogEntry.type, 
													catalogEntry.attributes,skus,"","",catalogEntry.entitledItemArray);						
						
						}
						catch(err)
						{
							console.debug(err.description);
						}							
					}
					
					var resultsReturned = (isNaN(parseInt(serviceResponse.resultsReturned)))?parseInt(catalogEntriesByPrice.length):parseInt(serviceResponse.resultsReturned);
						
					fastFinderJS.catalogEntriesRetrieved = parseInt(fastFinderJS.catalogEntriesRetrieved) + resultsReturned;
					
					if (!((parseInt(fastFinderJS.catalogEntriesRetrieved) < parseInt(totalCountByBrand)) && (parseInt(serviceResponse.resultsReturned) != 0)))
					{
							fastFinderJS.catalogEntriesRetrieved = parseInt(fastFinderJS.pageSize);
							fastFinderJS.firstSortLoaded = true;
							fastFinderJS.ajaxPageSize = fastFinderJS.brandSortPageSize;
							fastFinderJS.enableFastFinderSelections();
					}
						
					
					 fastFinderJS.addBrands(brands);
					 fastFinderJS.addFeatures(features);
				
			 		 fastFinderJS.totalProductsInCategory = totalCountByBrand;
			
			 		 document.FastFinderForm.initialState.value == "false";
				   fastFinderJS.showResults();
					fastFinderJS.updatePriceRangeWidget(minPrice, maxPrice);
					
					fastFinderJS.finishLoading(fastFinderJS.catalogEntriesRetrieved - 1);
			}
			
			
			
			if (catalogEntriesByBrand != null && catalogEntriesByBrand != undefined && fastFinderJS.catalogEntriesByBrand.size() < totalCountByBrand)
			{
					var originalEntriesByBrand = fastFinderJS.catalogEntriesByBrand;
					var originalIdsByBrand = new Vector();
					
					for (var i = 0; i < originalEntriesByBrand.size(); i++)
					{
						originalIdsByBrand.addElement(originalEntriesByBrand.elementAt(i, null));
					}
					
					for (var i = 0; i < catalogEntriesByBrand.length; i++)
					{
						try
						{
							var catalogEntry = catalogEntriesByBrand[i].catalogEntry;
						
							var skus = (catalogEntry.items == null || catalogEntry.items == undefined)?"":catalogEntry.items;
							
							if (!originalIdsByBrand.contains(catalogEntry.catentryId)) 
							{
								fastFinderJS.addElementToBrandVector(fastFinderJS.catalogEntriesByBrand, catalogEntry.catentryId);						
							}	
						}
						catch(err)
						{
							console.debug(err.description);
						}							
					}
					
					var resultsReturned = (isNaN(parseInt(serviceResponse.resultsReturned)))?parseInt(catalogEntriesByBrand.length):parseInt(serviceResponse.resultsReturned);
							
					fastFinderJS.catalogEntriesRetrieved = parseInt(fastFinderJS.catalogEntriesRetrieved) + resultsReturned;
			
			 	  fastFinderJS.addBrands(brands);
				  fastFinderJS.addFeatures(features);
			
		 		  fastFinderJS.totalProductsInCategory = totalCountByBrand;
		
		 		  document.FastFinderForm.initialState.value == "false";
			    fastFinderJS.showResults();
				  fastFinderJS.updatePriceRangeWidget(minPrice, maxPrice);
				 	if ((parseInt(fastFinderJS.catalogEntriesByBrand.size()) < parseInt(fastFinderJS.catalogEntriesByPrice.size())) && (parseInt(serviceResponse.resultsReturned) != 0))
					{
							fastFinderJS.finishLoading(fastFinderJS.catalogEntriesByBrand.size());
					}
			}
			dojo.publish("ajaxRequestCompleted");
		},
	
	/**
	* updatePriceRangeWidget Reset the price range slider widget so that it displays the correct minimum 
	*					     and maximum price based on asynchronously loaded catalog entries.
	*
	* @param {String} minPrice The new minimum price to allow for the price range widget.
	* @param {String} maxPrice The new maximum price to allow for the price range widget.
	*
	**/	
	updatePriceRangeWidget: function(minPrice, maxPrice) 
		{
			var originalMinPrice = document.FastFinderForm.minPrice.value;
			var originalMaxPrice = document.FastFinderForm.maxPrice.value;
			
			if (document.FastFinderForm.initialState.value == "true")
			{
				document.FastFinderForm.selectedMinPrice.value = document.FastFinderForm.minPrice.value;
				document.FastFinderForm.selectedMaxPrice.value = document.FastFinderForm.maxPrice.value;
			}
			
			
			var originalSelectedMinPrice = document.FastFinderForm.selectedMinPrice.value;
			var originalSelectedMaxPrice = document.FastFinderForm.selectedMaxPrice.value;
			
			
			
			if (minPrice < parseInt(originalMinPrice))
			{
				document.FastFinderForm.minPrice.value = minPrice;
			}
			if (maxPrice > parseInt(originalMaxPrice))
			{
				document.FastFinderForm.maxPrice.value = maxPrice;
			}
			
			var rangeSlider = dijit.byId("horizontalRangeSelector");
			
			rangeSlider.startRange = document.FastFinderForm.minPrice.value - 1;
			rangeSlider.totalRange = document.FastFinderForm.maxPrice.value - document.FastFinderForm.minPrice.value + 1;
		
			rangeSlider.defaultStart = document.FastFinderForm.minPrice.value - 1;
			rangeSlider.defaultEnd = document.FastFinderForm.maxPrice.value;
			rangeSlider.initWidget();
			
			if (originalMinPrice != originalSelectedMinPrice)
			{
				
				rangeSlider.setUnitPosition(rangeSlider.firstHandle, originalSelectedMinPrice);
			}
			
			
			if (originalMaxPrice != originalSelectedMaxPrice)
			{
				var newMax = parseInt(originalSelectedMaxPrice) + 7;
				rangeSlider.setUnitPosition(rangeSlider.secondHandle, newMax);
			}
			
			
			
		},
		
		/**
		* enableSortSelection Enables the sort selection combo box after the second sort option is fully loaded.
		**/
		enableSortSelection: function()
		{
				var sortResultsForm = document.getElementById("SortResultForm");
				var selectElement = sortResultsForm.elements[0];

				for (var i = 1; i < selectElement.childNodes.length; i = i + 2)
				{
						selectElement.childNodes[i].disabled = false;
				}
				
				selectElement.childNodes[1].selected = true;
		},
		
		/**
		* enableFastFinderSelections If the brands or features boxes were disabled while contents were loading then 
		*					         here they are re-enabled.
		**/
		enableFastFinderSelections: function()
		{
			var brandsForm = document.getElementById("BrandsForm");
			
			if (brandsForm.elements.length > 0 && brandsForm.elements[0].disabled)
			{
				
				var featuresForm = document.getElementById("FeatureNamesForm");
				
				for (var i = 0; i < brandsForm.elements.length; i++)
				{
						brandsForm.elements[i].disabled = false;
				}
				
				for (var i = 0; i < featuresForm.elements.length; i++)
				{
						featuresForm.elements[i].disabled = false;
				}
			
			}
			
		},
		
		/**
		* addBrands After additional catalog entries are loaded any new brands are added to
		*			the list of available brands.
		*
		* @param {Array} brands An array of brands to add to the list.
		*
		**/
		addBrands: function(brands)
		{
			var brandsForm = document.getElementById("BrandsForm");
		
			for (var i = 0; i < brands.length; i++)
			{
				if ((this.brands[brands[i]] == null || this.brands[brands[i]] == undefined) && this.brands[brands[i]] != brands[i])
				{
					var newParagraph = document.createElement("p");
					newParagraph.setAttribute("class", "label");
					newParagraph.setAttribute("className", "label");
			
					var newInput = document.createElement("input");
					
					newInput.setAttribute("type", "checkbox");
					newInput.setAttribute("title", " " + brands[i]);
					newInput.setAttribute("id", "brand" + this.brandsCounter+1);
					newInput.setAttribute("value", brands[i]);
					newInput.setAttribute("className", "checkbox");
					newInput.setAttribute("class", "checkbox");
					newInput.setAttribute("checked", "checked");

					
					newInput.setAttribute("name", "brandName.value" + this.brandsCounter+1);
					newParagraph.appendChild(newInput);
					
					var newLabel = document.createElement("label");
					var newLabelText = document.createTextNode(" " + brands[i]);
					
					newLabel.appendChild(newLabelText);
					newLabel.setAttribute("for", "brand" + this.brandsCounter+1);
					newParagraph.appendChild(newLabel);
					brandsForm.appendChild(newParagraph);
					document.getElementById("brand"+ this.brandsCounter+1).checked = true;
					document.getElementById("brand"+ this.brandsCounter+1).onclick = function() {javascript: setCurrentId('brand" + this.brandsCounter+1 +"'); filterWithBrands()}
					// connect the new input element for coremetrics tracking
					analyticsJS.connectFastFinderInputs(document.getElementById("brand"+ this.brandsCounter+1), "brands");
					this.brandsCounter++;	
					this.addBrand(brands[i]);
				}
			}
		
		},
		
		/**
		* addFeatures Add new features to the list from the set of features added in an asynchronous data load.
		*
		* @param {Array} features An array of features to add to the list of features.
		*
		**/
		addFeatures: function(features)
		{
			var featuresForm = document.getElementById("FeatureNamesForm");
		
			for (var i = 0; i < features.length; i++)
			{
				if ((this.features[features[i]] == null || this.features[features[i]] == undefined) && this.features[features[i]] != features[i])
				{
				
					var newParagraph = document.createElement("p");
					newParagraph.setAttribute("class", "label");
					newParagraph.setAttribute("className", "label");
			
					var newInput = document.createElement("input");
					
					newInput.setAttribute("type", "checkbox");
					newInput.setAttribute("title", " " + features[i]);
					newInput.setAttribute("id", "feature" + this.featuresCounter+1);
					newInput.setAttribute("value", features[i]);	
					newInput.setAttribute("className", "checkbox");
					newInput.setAttribute("class", "checkbox");
					newInput.setAttribute("name", "featureName.value" + this.featuresCounter+1);

					newParagraph.appendChild(newInput);
					
					var newLabel = document.createElement("label");
					var newLabelText = document.createTextNode(" " + features[i]);
					
					newLabel.appendChild(newLabelText);
					newLabel.setAttribute("for", "feature" + this.featuresCounter+1);
					newParagraph.appendChild(newLabel);
					featuresForm.appendChild(newParagraph);
					document.getElementById("feature"+ this.featuresCounter+1).onclick = function() {javascript: setCurrentId('feature" + this.featuresCounter+1 +"'); filterWithFeatures()}
					// connect the new input element for coremetrics tracking
					analyticsJS.connectFastFinderInputs(document.getElementById("feature"+ this.featuresCounter+1), "features");
					
					this.featuresCounter++;
					this.addFeature(features[i]);
					
				}
			}
		},
		
		/**
		* addBrand A hash map of brands is stored in the fastFinderJS so that it can be used to ensure
		*			that only unique brands are shown. This method adds a brand to that hash map
		*
		* @param {String} brand A new brand to add to the internal hash map of brands stored in fastFinderJS.
		*
		**/
		addBrand: function(brand)
		{
			if ((this.brands[brand] == null || this.brands[brand] == undefined) && this.brands[brand] != brand)
			{
				this.brands[brand] = brand;
				this.brandsCounter++;
			}
		},
		
		/**
		* addFeature A hash map of features is stored in the fastFinderJS so that it can be used to ensure
		*			that only unique features are shown. This method adds a new feature to that hash map.
		*
		* @param {String} feature A new feature to add to the internal hash map of features stored in fastFinderJS.
		*
		**/
		addFeature: function(feature)
		{
			if ((this.features[feature] == null || this.features[feature] == undefined) && this.features[feature] != feature)
			{
				this.features[feature] = feature;
				this.featuresCounter++;
			}
		}
	}
		

	fastFinderJS.HistoryTracker.prototype.back		=	fastFinderJS.goBack;
	fastFinderJS.HistoryTracker.prototype.forward	=	fastFinderJS.goForward;
	
	
	/**
	* onLoad Function to be called on loading. This method will initialize the fast finder history as well as call {@link fastFinderJS.showResults} to
	*    	 display results. Finally {@link fastFinderJS.finishLoading} will be called to retrieve any remaining catalog entries asynchronously.
	**/
	function onLoad(){
		fastFinderJS.initFastFinderHistory();
		fastFinderJS.showResults();
		setTimeout("fastFinderJS.finishLoading()", 1000);
	}

	dojo.addOnLoad(onLoad);

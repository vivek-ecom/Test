//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This file contains all the global variables and JavaScript functions needed by the compare product page and the compare zone. 
 */

if(typeof(CompareProductJS) == "undefined" || CompareProductJS == null || !CompareProductJS) {
	
	/**
	 * @class The functions defined in the class are used for comparing products. 
	 *
	 * This CompareProductJS class defines all the variables and functions for the page that uses the comparison functionality in the store.
	 * The compare accepts a maximum of 4 products to compare.
	 * The compare product display page compares various products' attributes side-by-side.
	 *
	 */
	CompareProductJS = {
		/**
		 * Object to store langId, storeId and catalogId of the store.
		 */
		params: new Object(),
		
		/**
		* The compareReturnName is a string to store the current name of the category from where the compare link was clicked
		*/
		compareReturnName: "",
		
		/**
		* The returnUrl is a string to store the url of the category from where the compare link was clicked
		*/
		returnUrl: "",
		
		/**
		 * The prefix of the cookie key that is used to store item Ids. 
		 */
		cookieKeyPrefix: "CompareItems_",
		
		/**
		 * The delimiter used to separate item Ids in the cookie.
		 */
		cookieDelimiter: ";",
		
		/**
		 * The maximum number of items allowed in the compare zone. 
		 */
		maxNumberProductsAllowedToCompare: 4,
					
		/**
		 * Sets the common parameters used in all service calls like langId, storeId and catalogId.
		 * @param {String} langId The language Id.
		 * @param {String} storeId The store Id.
		 * @param {String} catalogId The catalog Id.
		 * @param {String} compareReturnName The return page name
		 * @param {String} returnUrl The url of the return page to go back
		 */
		setCommonParameters:function(langId,storeId,catalogId, compareReturnName, returnUrl){
			this.params.langId = langId;
			this.params.storeId = storeId;
			this.params.catalogId = catalogId;
			this.compareReturnName = compareReturnName;
			this.returnUrl = decodeURIComponent(returnUrl);
		},

		/**
		 * Removes an item from the products compare page.
		 * @param {String} key The Id of the item to remove.
		 */
		remove: function(key){
			var cookieKey = this.cookieKeyPrefix + this.params.storeId;
			var cookieValue = dojo.cookie(cookieKey);
			if(cookieValue != null){
				if(dojo.trim(cookieValue) == ""){
					dojo.cookie(cookieKey, null, {expires: -1});
				}else{
					var cookieArray = cookieValue.split(this.cookieDelimiter);
					var newCookieValue = "";
					for(index in cookieArray){
						if(cookieArray[index] != key){
							if(newCookieValue == ""){
								newCookieValue = cookieArray[index];
							}else{
								newCookieValue = newCookieValue + this.cookieDelimiter + cookieArray[index]
							}
						}
					}
					dojo.cookie(cookieKey, newCookieValue, {path:'/'});
				}
				
				// Now remove this catentry from URL and re-submit it...
				//replace catentryId=[0-9;]*&? with the current set of catentryIds present in cookie...
				var cookieKey = this.cookieKeyPrefix + this.params.storeId;
				var cookieValue = dojo.cookie(cookieKey);
				var newCatentryIdsToCompare = "";
				if(cookieValue != null && dojo.trim(cookieValue) != ""){
					var newCatentryIdsToCompare =  "catentryId=" + cookieValue;
				}
				var tempURL = document.URL.replace(/catentryId=[0-9;]*/, newCatentryIdsToCompare);
				var tempURL = tempURL.replace(/&&/, "&"); //we might end up with &&, when newCatentryIdsToCompare is empty..Handle this scenario...
				location.href = tempURL;
			}
		},

		/**
		 * Re-directs the browser to the CompareProductsDisplay page to compare products side-by-side.
		 */
		compareProducts:function(){
			var url = "CompareProductsDisplayView?storeId=" + this.params.storeId + "&catalogId=" + this.params.catalogId + "&langId=" + this.params.langId + "&compareReturnName=" + this.compareReturnName;
			
			var cookieKey = this.cookieKeyPrefix + this.params.storeId;
			var cookieValue = dojo.cookie(cookieKey);
			if(cookieValue != null && dojo.trim(cookieValue) != ""){
				url = url + "&catentryId=" + cookieValue;
			}
			url = url + "&returnUrl=" + encodeURIComponent(this.returnUrl);
			location.href = getAbsoluteURL() + url;
		},
		
		/**
		* add2ShopCart Adds product to the shopping cart
		*
		*
		**/
		add2ShopCart: function(catEntryId, quantity){
			var shoppingParams = new Object();
			shoppingParams.storeId = WCParamJS.storeId;
			shoppingParams.catalogId = WCParamJS.catalogId;
			shoppingParams.langId = WCParamJS.langId;
			shoppingParams.orderId		= ".";
			shoppingParams.calculationUsage = "-1,-2,-5,-6,-7";
			
			//Add the catalog entry to the cart.
			updateParamObject(shoppingParams,"catEntryId",catEntryId,false,-1);
			updateParamObject(shoppingParams,"quantity",quantity,false,-1);
			
			var shopCartService = "AddOrderItem";

			//For Handling multiple clicks
			if(!submitRequest()){
				return;
			}   
			cursor_wait();		
			wc.service.invoke(shopCartService, shoppingParams);
		}
	}
}
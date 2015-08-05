//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2008, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/**
 * @fileOverview This class contains declarations of AJAX services used by the Madisons store pages.
 */

dojo.require("wc.service.common");

/**
 * @class This class stores common parameters needed to make the service call.
 */
shoppingActionsServicesDeclarationJS = {
	langId: "-1", /* language of the  store */
	storeId: "", /*numeric unique identifier of the store */
	catalogId: "", /*catalog of the store that is currently in use */

	/**
	 * Sets common parameters used by the services
	 * @param (int) langId The language of the store.
	 * @param (int) storeId The store currently in use.
	 * @param (int) catalogId The catalog of the store currently in use.
	 */
	setCommonParameters:function(langId,storeId,catalogId){
			this.langId = langId;
			this.storeId = storeId;
			this.catalogId = catalogId;
	}
}

	/**
	 * Add an item to a shopping cart in Ajax mode. A message is displayed after
	 * the service call.
	 * @constructor
	 */
	wc.service.declare({
		id: "AddOrderItem",
		actionId: "AddOrderItem",
		url: getAbsoluteURL() + "AjaxOrderChangeServiceItemAdd",
		formId: ""

     /**
     * display a success message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */

		,successHandler: function(serviceResponse) {
			MessageHelper.hideAndClearMessage();
			// Do not show this message. When item is added, we open up mini cart to display the currently added item.
			// MessageHelper.displayStatusMessage(storeNLS["SHOPCART_ADDED"]);
			cursor_clear();
			if(shoppingActionsJS){
				
				var attributes = document.getElementsByName("attrValue");
			
				var singleSKU = true;
				
				for(var i=0; i<attributes.length; i++){
					if (attributes[i].options.length > 1)
					{
						singleSKU = false;
					}
				}
				
				if (!singleSKU)
				{
					shoppingActionsJS.selectedAttributes = new Object();
					dojo.publish('attributesChanged_'+ shoppingActionsJS.baseCatalogEntryId, [dojo.toJson(shoppingActionsJS.selectedAttributes)]);
					for(var i=0; i<attributes.length; i++){
						if(attributes[i] != null){
							attributes[i].value = "";
							attributes[i].onchange();
						}
					}
				}
				
			}
			if(typeof(ShipmodeSelectionExtJS)!= null && typeof(ShipmodeSelectionExtJS)!='undefined'){
				ShipmodeSelectionExtJS.setOrderItemId(serviceResponse.orderItemId[0]);
			}
			dojo.publish("CMAddToCart");
		}
     /**
     * display an error message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,failureHandler: function(serviceResponse) {

			if (serviceResponse.errorMessage) {
			 	if(serviceResponse.errorMessageKey == "_ERR_NO_ELIGIBLE_TRADING"){
			 		MessageHelper.displayErrorMessage(storeNLS["ERROR_CONTRACT_EXPIRED_GOTO_ORDER"]);
 				} else if (serviceResponse.errorMessageKey == "_ERR_RETRIEVE_PRICE") {
					var tempString = storeNLS["GENERICERR_MAINTEXT"];
					tempString = dojo.string.substitute(tempString,{0:storeNLS["GENERICERR_CONTACT_US"]});
 					MessageHelper.displayErrorMessage(tempString);
 				} else {
 					MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
 				}
			} 
			else {
				 if (serviceResponse.errorMessageKey) {
					MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
				 }
			}
			cursor_clear();
		}

	}),
	
	/**
	 * Adds a pre-defined dynamic kit to a shopping cart in Ajax mode. A message is displayed after
	 * the service call.
	 * @constructor
	 */
	wc.service.declare({
		id: "AddPreConfigurationToCart",
		actionId: "AddOrderItem",
		url: getAbsoluteURL() + "AjaxOrderChangeServiceAddPreConfigurationToCart",
		formId: ""

     /**
     * display a success message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */

		,successHandler: function(serviceResponse) {
			MessageHelper.hideAndClearMessage();
			cursor_clear();
			if(shoppingActionsJS){
				
				var attributes = document.getElementsByName("attrValue");
			
				var singleSKU = true;
				
				for(var i=0; i<attributes.length; i++){
					if (attributes[i].options.length > 1)
					{
						singleSKU = false;
					}
				}
				
				if (!singleSKU)
				{
					shoppingActionsJS.selectedAttributes = new Object();
					for(var i=0; i<attributes.length; i++){
						if(attributes[i] != null){
							attributes[i].value = "";
							attributes[i].onchange();
						}
					}
				}
			}
			if(typeof(ShipmodeSelectionExtJS)!= null && typeof(ShipmodeSelectionExtJS)!='undefined'){
				ShipmodeSelectionExtJS.setOrderItemId(serviceResponse.orderItemId[0]);
			}
		}
     /**
     * display an error message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,failureHandler: function(serviceResponse) {

			if (serviceResponse.errorMessage) {
			 	if(serviceResponse.errorMessageKey == "_ERR_NO_ELIGIBLE_TRADING"){
			 		MessageHelper.displayErrorMessage(storeNLS["ERROR_CONTRACT_EXPIRED_GOTO_ORDER"]);
 				} else if (serviceResponse.errorMessageKey == "_ERR_RETRIEVE_PRICE") {
					var tempString = storeNLS["GENERICERR_MAINTEXT"];
					tempString = dojo.string.substitute(tempString,{0:storeNLS["GENERICERR_CONTACT_US"]});
 					MessageHelper.displayErrorMessage(tempString);
 				} else {
 					MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
 				}
			} 
			else {
				 if (serviceResponse.errorMessageKey) {
					MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
				 }
			}
			cursor_clear();
		}

	})
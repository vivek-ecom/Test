//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2009 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This file provides the controller variables and functions for My Account pages, 
 * and links these controllers to listen to the defined render contexts in CommonContextsDeclarations.js.
 */

dojo.require("wc.render.common");

/** 
 * @class The MyAccountControllersDeclarationJS class defines the common variables and functions that control 
 * the defined render contexts on the My Account store pages. Controller provides the JavaScript logic 
 * that listens to changes in the render context and the model. A defined render context is a set of 
 * client-side context information which keeps track of information about a page. The context information 
 * helps decide if changes to refresh areas are needed. 
 */
MyAccountControllersDeclarationJS = {
	/**
	 * Sets a URL of the specified controller. This URL is then called by the refresh controller to retrieve the refreshed content 
	 * for the refresh area widget. 
	 * 
	 * @param {string} controllerId The ID of the specified controller.
	 * @param {string} url The URL link for the specified controller.
	 */       
	setControllerURL:function(controllerId,url){
		wc.render.getRefreshControllerById(controllerId).url = url;
	}
}


/** 
 * Declares a new refresh controller for the scheduled orders status display.
 */
wc.render.declareRefreshController({
	id: "ScheduledOrdersStatusDisplayController",
	renderContext: wc.render.getContextById("ScheduledOrdersStatusDisplay_Context"),
	url: "",
	formId: ""
	
	/** 
	 * Refreshes the scheduled orders status display if a scheduled order is canceled.
	 * This function is called when a modelChanged event is detected. 
	 * 
	 * @param {String} message The model changed event message
	 * @param {Object} widget The registered refresh area
	 */
	,modelChangedHandler: function(message, widget) {
		if(message.actionId == 'AjaxScheduledOrderCancel'){
			widget.refresh(this.renderContext.properties);
		}
	}

	/** 
	 * Displays the previous/next page of order items in the order status page.
	 * This function is called when a render context changed event is detected. 
	 * 
	 * @param {string} message The render context changed event message
	 * @param {object} widget The registered refresh area
	 */
	,renderContextChangedHandler: function(message, widget) {
		if(this.testForChangedRC(["beginIndex"])){
			widget.refresh(this.renderContext.properties);
		}
	}
	
	/** 
	 * Clears the progress bar
	 * 
	 * @param {object} widget The registered refresh area
	 */
	,postRefreshHandler: function(widget) {
		 cursor_clear();
	}
}),


/** 
 * Declares a new refresh controller for the processed orders status display.
 */
wc.render.declareRefreshController({
	id: "ProcessedOrdersStatusDisplayController",
	renderContext: wc.render.getContextById("ProcessedOrdersStatusDisplay_Context"),
	url: "",
	formId: ""

	/** 
	 * Displays the previous/next page of order items on the processed order status page.
	 * This function is called when a render context changed event is detected. 
	 * 
	 * @param {string} message The render context changed event message
	 * @param {object} widget The registered refresh area
	 */
	,renderContextChangedHandler: function(message, widget) {
		if(this.testForChangedRC(["beginIndex"])){
			widget.refresh(this.renderContext.properties);
		}
	}
	
	/** 
	 * Clears the progress bar
	 * 
	 * @param {object} widget The registered refresh area
	 */
	,postRefreshHandler: function(widget) {
		 cursor_clear();
	}
}),



/** 
 * Declares a new refresh controller for the waiting-for-approval orders status display.
 */
wc.render.declareRefreshController({
	id: "WaitingForApprovalOrdersStatusDisplayController",
	renderContext: wc.render.getContextById("WaitingForApprovalOrdersStatusDisplay_Context"),
	url: "",
	formId: ""
	
	/** 
	 * Displays the previous/next page of order items in the order status page.
	 * This function is called when a render context changed event is detected. 
	 * 
	 * @param {string} message The render context changed event message
	 * @param {object} widget The registered refresh area
	 */
	,renderContextChangedHandler: function(message, widget) {
		if(this.testForChangedRC(["beginIndex"])){
			widget.refresh(this.renderContext.properties);
		}
	}
	
	/** 
	 * Clears the progress bar
	 * 
	 * @param {object} widget The registered refresh area
	 */
	,postRefreshHandler: function(widget) {
		 cursor_clear();
	}
})

//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2010 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This javascript is used by the wish list pages to control the refresh areas.
 * @version 1.0
 */

dojo.require("wc.service.common");
dojo.require("wc.render.common");

/** 
 * Refresh controller for creating a new wish list. 
 */
wc.render.declareRefreshController({
       id: "MultipleWishListNewListController",
       renderContext: wc.render.getContextById("MultipleWishListNewListContext"),
       url: "AllWishListsInProductDetailView",
       formId: ""

		/** 
		 * Refreshes the section that contains all wish lists of the current user.
		 * This function is called when a modelChanged event is detected. 
		 * 
		 * @param {string} message The model changed event message
		 * @param {object} widget The registered refresh area
		 */
		,modelChangedHandler: function(message, widget) {
	
			//refresh the wish list drop down
			if (message.actionId == 'AjaxGiftListServiceCreate') {
				var renderContext = this.renderContext;
				
				//update wish list name 
				MultipleWishLists.updateDefaultListName('multipleWishListButton',message.giftListName);	
				MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',message.giftListName);
				MultipleWishLists.setDefaultListId(message.giftListId);
				
				widget.refresh(renderContext.properties);	

			}
						
		}
		 
		/** 
		 * Clears the progress bar
		 * 
		 * @param {object} widget The registered refresh area
		 */
		,postRefreshHandler: function(widget) {
			cursor_clear();
			
			if (MultipleWishLists.addItemAfterCreate) {
				MultipleWishLists.addToListHelper(MultipleWishLists.defaultListId, this.renderContext.properties.catEntryId);
				MultipleWishLists.addItemAfterCreate = false;
			}
			

		}		 
}),

/** 
 * Declares a new refresh controller for the Wishlist select display.
 */
wc.render.declareRefreshController({
	id: "WishlistSelect_Controller",
	renderContext: wc.render.getContextById("WishlistSelect_Context"),
	url: "",
	formId: ""

	 /** 
		* Displays the previous/next page of items on the Wishlist display page.
	  * This function is called when a render context changed event is detected. 
	  * 
	  * @param {string} message The render context changed event message
	  * @param {object} widget The registered refresh area
	  */
	 ,renderContextChangedHandler: function(message, widget) {
	        var controller = this;
	        var renderContext = this.renderContext;
	        AccountWishListDisplay.contextChanged = true;
	        widget.refresh(renderContext.properties);
	 }
       
	/** 
	 * Refreshs the wishlist select drop down display when a new wish list is added or when a wish list is deleted.
	 * This function is called when a modelChanged event is detected. 
	 * 
	 * @param {string} message The model changed event message
	 * @param {object} widget The registered refresh area
	 */
	,modelChangedHandler: function(message, widget) {
		var controller = this;
		var renderContext = this.renderContext;
		if (message.actionId == "AjaxGiftListServiceCreate" || message.actionId == "AjaxGiftListServiceUpdateDescription" || message.actionId == "AjaxGiftListServiceDeleteGiftList" || message.actionId == "AjaxGiftListServiceAddItem") {
			widget.refresh(renderContext.properties);
		}
	}
       
	/** 
	 * Hide the progress bar upon a successful refresh.
	 * 
	 * @param {object} widget The registered refresh area
	 */
	,postRefreshHandler: function(widget) {
		var controller = this;
		var renderContext = this.renderContext;
		cursor_clear();

		//ensure default wish list name is used if all lists are deleted.
		var dropdown = dojo.byId('multipleWishlistController_select');
		if (dropdown==null) {
			//if the drop down does not exist, that means there is no wish list
			MultipleWishLists.updateDefaultListName('multipleWishListButton',MultipleWishLists.preferredDefaultWishListName);		
			MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',MultipleWishLists.preferredDefaultWishListName);
			MultipleWishLists.defaultListId=null;
			MultipleWishLists.addItemAfterCreate = null;
		}else if (dropdown.length > 0){
			//ensure the name of the wish list is the same as the one selected in the drop down
			MultipleWishLists.defaultListId = dojo.byId('multipleWishlistController_select').value;
			var wName=dojo.byId('multipleWishlistController_select').options[dropdown.selectedIndex].text;
			MultipleWishLists.updateDefaultListName('multipleWishListButton',wName);		
			MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',wName);			
		}
			
	}
}),

/** 
 * Declares a new refresh controller for the Wishlist select display.
 */
wc.render.declareRefreshController({
	id: "MultipleWishListInQuickInfoController",
	renderContext: wc.render.getContextById("MultipleWishListInQuickInfo_Context"),
	url: "AllWishListsInProductDetailView?showOnDefault=true",
	formId: ""

	
	/** 
	 * Refreshs the wishlist drop down in the quick info popup.
	 * 
	 * @param {string} message The model changed event message
	 * @param {object} widget The registered refresh area
	 */
	,renderContextChangedHandler: function(message, widget) {
		widget.refresh();			
	}
	 
       
	/** 
	 * Hide the progress bar upon a successful refresh.
	 * 
	 * @param {object} widget The registered refresh area
	 */
	,postRefreshHandler: function(widget) {
		//the drop down in quick info is hidden by default. We have to display it after the area is refreshed. 
		dojo.style('MultipleWishListDropDown','display','block');
	}
})

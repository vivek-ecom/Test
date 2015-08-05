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
 * @fileOverview This javascript is used by the wish list pages to handle CRUD operations.
 * @version 1.0
 */
 
/**
 * Declares a new render context for the multiple Wishlist select display
 */
wc.render.declareContext("WishlistSelect_Context",null,""),

/**
 * Declares a new render context for the Wishlist display,
 * and initializes it with the post URL to load. 
 */
wc.render.declareContext("WishlistDisplay_Context",{url:""},""),

/**
 * Declares a new render context for the Shared Wishlist display,
 * and initializes it with the post URL to load. 
 */
wc.render.declareContext("SharedWishlistDisplay_Context",{url:""},""),

/** 
 * Declares a new refresh controller for the Wishlist display.
 */
wc.render.declareRefreshController({
       id: "WishlistDisplay_Controller",
       renderContext: wc.render.getContextById("WishlistDisplay_Context"),
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
			  
              widget.refresh(renderContext.properties);
       }

       /** 
        * Refreshs the wishlist display when an item is added to or deleted from the wishlist.
        * This function is called when a modelChanged event is detected. 
        * 
        * @param {string} message The model changed event message
        * @param {object} widget The registered refresh area
        */
       ,modelChangedHandler: function(message, widget) {
              var controller = this;
              var renderContext = this.renderContext;
              if (message.actionId == "ShoppingListServiceCreate" || message.actionId == "ShoppingListServiceUpdate" || message.actionId == "ShoppingListServiceDelete" || message.actionId == "ShoppingListServiceRemoveItem" || message.actionId == "ShoppingListServiceAddItem") {
                     widget.refresh(renderContext.properties);
              }
       }
       
       /** 
        * This function handles paging and browser back/forward functionalities upon a successful refresh.
        * 
        * @param {object} widget The registered refresh area
        */       
       ,postRefreshHandler: function(widget) {
              var controller = this;
              var renderContext = this.renderContext;
               
              if((dojo.byId("multipleWishlistController_select")!=null && dojo.byId("multipleWishlistController_select")!='undefined')){
              	dojo.byId("multipleWishlistController_select").disabled = false;
              }
              cursor_clear();
       }
}),

/** 
 * Declares a new refresh controller for the shared Wishlist display. 
 */
wc.render.declareRefreshController({
       id: "SharedWishlistDisplay_Controller",
       renderContext: wc.render.getContextById("SharedWishlistDisplay_Context"),
       url: "",
       formId: ""

       /** 
	* Displays the previous/next page of items on the Shared Wishlist display page.
        * This function is called when a render context changed event is detected. 
        * 
        * @param {string} message The render context changed event message
        * @param {object} widget The registered refresh area
        */
       ,renderContextChangedHandler: function(message, widget) {
              var controller = this;
              var renderContext = this.renderContext;
              widget.refresh(renderContext.properties);
       }
       
       /** 
        * This function handles paging and browser back/forward functionalities upon a successful refresh.
        * 
        * @param {object} widget The registered refresh area
        */       
       ,postRefreshHandler: function(widget) {
              var controller = this;
              var renderContext = this.renderContext;
              cursor_clear();
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
		if (message.actionId == "ShoppingListServiceCreate" || message.actionId == "ShoppingListServiceUpdate" || message.actionId == "ShoppingListServiceDelete" || message.actionId == "ShoppingListServiceAddItem") {
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
			shoppingListJS.refreshLinkState();
		}
			
	}
})

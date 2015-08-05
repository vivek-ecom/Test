//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2009, 2010 All Rights Reserved.
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
 * This service allows customers to create a new wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxGiftListServiceCreate",
	actionId:"AjaxGiftListServiceCreate",
	url:"AjaxGiftListServiceCreate",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();	
		closeAllDialogs();	//close the create popup
		
		MultipleWishLists.setDefaultListId(serviceResponse.giftListId);
		
		if (MultipleWishLists.getIsFromQuickInfo()){		
			if (MultipleWishLists.addItemAfterCreate) {
				MultipleWishLists.addToListHelper(serviceResponse.defaultListId, serviceResponse.catEntryId);
				MultipleWishLists.addItemAfterCreate = false;
			}
			
			//open the add to wish list panel again.
			dijit.byId('second_level_category_popup').show();	
			
		}
		//update wish list name
		MultipleWishLists.updateDefaultListName('multipleWishListButton',serviceResponse.giftListName);		
		MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',serviceResponse.giftListName);
		
		
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages['LIST_CREATED']);		
		
		//reset the createFromMyAccount flag
		 this.createFromMyAccount = true;
		 //reset the disabledPopups flag
		 this.disablePopups = false;
		 this.isFromQuickInfo = false;
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
 * This service allows customers to update the description of a wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxGiftListServiceUpdateDescription",
	actionId:"AjaxGiftListServiceUpdateDescription",
	url:"AjaxGiftListServiceUpdateDescription",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		closeAllDialogs();
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages['LIST_EDITED']);

	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
 * This service allows customers to delete a selected wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxGiftListServiceDeleteGiftList",
	actionId:"AjaxGiftListServiceDeleteGiftList",
	url:"AjaxGiftListServiceDeleteGiftList",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		closeAllDialogs();
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages['LIST_DELETED']);		
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
 * This service allows customers to add an item to a wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxGiftListServiceAddItem",
	actionId:"AjaxGiftListServiceAddItem",
	url:"AjaxGiftListServiceAddItem",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		MessageHelper.hideAndClearMessage();
		MultipleWishLists.hideAddToWishListPanel();
		dijit.byId('second_level_category_popup').hide(); //close the popup
		
		//make the last used list the default wish list
		MultipleWishLists.addItemAndSetListDefault = true;
		MultipleWishLists.setAsDefault(serviceResponse.giftListId);
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
 * This service allows customers to move an item from the shopping cart to a wish list 
 * @constructor
 */
wc.service.declare({
	id: "AjaxWishListAddAndDeleteFromCart",
	actionId: "AjaxWishListAddAndDeleteFromCart",
	url: "AjaxGiftListServiceAddItem",
	formId: ""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages["WISHLIST_ADDED"]);
		MultipleWishLists.deleteItemFromCart();
	}
	
	/**
	 * Displays the error message returned with the service response and hides the progress bar.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} else {
			if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			}
		}
		cursor_clear();
	}

}),

/**
 * This service allows customers to create a new wish list and move an item from shopping cart to the newly created wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxNewWishListAddAndDeleteFromCart",
	actionId:"AjaxNewWishListAddAndDeleteFromCart",
	url:"AjaxGiftListServiceCreate",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();	
		closeAllDialogs();	//close the create popup
		
		//update wish list name
		MultipleWishLists.updateDefaultListName('multipleWishListButton',serviceResponse.giftListName);		
		MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',serviceResponse.giftListName);
		MultipleWishLists.setDefaultListId(serviceResponse.giftListId);
		MultipleWishLists.deleteItemFromCart();
		
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages['LIST_CREATED']);		
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
 * This service allows customers to remove an item from a wish list
 * @constructor
 */
wc.service.declare({
	id:"AjaxGiftListServiceRemoveItem",
	actionId:"AjaxGiftListServiceRemoveItem",
	url:"AjaxGiftListServiceUpdateItem",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		MessageHelper.hideAndClearMessage();
		MessageHelper.displayStatusMessage(MessageHelper.messages['ITEM_REMOVED']);
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
* This service allows customers to set a wish list as the default list
* @constructor
* 
**/
wc.service.declare({
	id:"AjaxGiftListServiceChangeGiftListStatus",
	actionId:"AjaxGiftListServiceChangeGiftListStatus",
	url:"AjaxGiftListServiceChangeGiftListStatus",
	formId:""

	 /**
     * Hides all the messages and the progress bar.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,successHandler: function(serviceResponse) {
		cursor_clear();			
		MessageHelper.hideAndClearMessage();
		
		if (MultipleWishLists.addItemAndSetListDefault){
			MessageHelper.displayStatusMessage(MessageHelper.messages['ITEM_ADDED']);
			MultipleWishLists.addItemAndSetListDefault = false;
		}

		MultipleWishLists.updateDefaultListName('multipleWishListButton',serviceResponse.giftListName);		
		MultipleWishLists.updateDefaultListName('addToMultipleWishListLink',serviceResponse.giftListName);
		MultipleWishLists.setDefaultListId(serviceResponse.giftListId);
		MultipleWishLists.updateContextPostSwitch(serviceResponse.giftListId);
	}
		
	/**
     * display an error message.
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation.
     */
	,failureHandler: function(serviceResponse) {
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
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
	 * This service sends the wish list to a specified email address.
	 */
	wc.service.declare({
		id: "AjaxGiftListAnnouncement",
		actionId: "AjaxGiftListAnnouncement",
		url: getAbsoluteURL() + "AjaxGiftListServiceAnnounceGiftList",
		formId: ""

    /**
     * hides all the messages and the progress bar
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,successHandler: function(serviceResponse) {
			cursor_clear();			
			MessageHelper.hideAndClearMessage();
			MessageHelper.displayStatusMessage(MessageHelper.messages['EMAIL_SENT']);	
		}
     /**
     * display an error message
     * @param (object) serviceResponse The service response object, which is the
     * JSON object returned by the service invocation
     */
		,failureHandler: function(serviceResponse) {

			if (serviceResponse.errorMessage) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
			} 
			else {
				 if (serviceResponse.errorMessageKey) {
					MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
				 }
			}
			cursor_clear();
		}

	})
	
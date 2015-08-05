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


	/** 
	 * @fileOverview This file contains all the global variables and JavaScript functions needed for wish list page in My Account section.
	 * This JavaScript file defines all the functions used  by the AccountWishDisplay.jsp file.
	 * @version 1.0
	 */


	/* Declare the namespace if it does not already exist. */
	 if (AccountWishListDisplay == null || typeof(AccountWishListDisplay) != "object") {
	 	var AccountWishListDisplay = new Object();
	 }

	/**
	 * @class This AccountWishListDisplay class defines all the variables and functions for the wish list page of My account section.
	 * The wish list page displays all the wish list item of an user and provides functions like remove from the wish list, add to cart, etc.
	 *
	 */
AccountWishListDisplay={	
	/* Global variables used in the CompareProductDisplay page. */
		
	/** The contextChanged is a boolean flag indicating whether the context was changed and if there is a need to refresh the wish list result. */
	contextChanged:false, 

	/** The isHistory is a boolean flag used to determine whether the update of context is caused by a history event(back/forward). */
	isHistory:false,
	
	/**
	* This function sets the initial state of dojo browser history.  dojo API : dojo.undo.browser.setInitialState
	* @param {string} elementId  the id of the widget.
	* @param {string} changeUrl   the url used to load new context.	
	*/	
	initHistory:function(elementId, changeUrl){

		var historyObject = new AccountWishListDisplay.HistoryTracker(elementId, changeUrl);
		dojo.back.setInitialState(historyObject);	
	},
			
	/**
	* This function is used to check user input in the wish list email form, if user input is valid, it invokes the InterestItemListMessage service to send out the email.
	* @param {string} formId  The formId of the email form.
	*/	
	checkEmailForm:function (formId){
		var form = document.getElementById(formId);
		
		form.sender_name.value = form.sender_name.value.replace(/^\s+/g, "");
		form.recipient.value = form.recipient.value.replace(/^\s+/g, "");	
		
		if (form.recipient.value == '') {
			MessageHelper.formErrorHandleClient(document.getElementById('SendWishListForm_Recipient_Email').id, MessageHelper.messages["WISHLIST_MISSINGEMAIL"]);return;
		}
		if (! MessageHelper.isValidEmail(form.recipient.value)){
			MessageHelper.formErrorHandleClient(document.getElementById('SendWishListForm_Recipient_Email').id, MessageHelper.messages["WISHLIST_INVALIDEMAILFORMAT"]);return;
		}
		if (form.sender_name.value == ''){
			 MessageHelper.formErrorHandleClient(document.getElementById('SendWishListForm_Sender_Name').id, MessageHelper.messages["WISHLIST_MISSINGNAME"]);return;
		}
		if (! MessageHelper.isValidEmail(form.sender_email.value)){
			MessageHelper.formErrorHandleClient(document.getElementById('SendWishListForm_Sender_Email').id, MessageHelper.messages["WISHLIST_INVALIDEMAILFORMAT"]);return;
		}
		if(form.listId.value==''){
			// gets wish list ID from refresh area if it is not already defined
			if((dojo.byId("interestItemListId")!=null && dojo.byId("interestItemListId")!='undefined')){
				form.listId.value = dojo.byId("interestItemListId").value;
			}	
		}
		if(form.listId.value==''){
			MessageHelper.displayErrorMessage(MessageHelper.messages["WISHLIST_EMPTY"]);return;
		}
		
		/* Handles multiple clicks */
		if(!submitRequest()){
			return;
		}
		
		cursor_wait();
		wc.service.getServiceById("InterestItemListMessage").formId = formId;
		wc.service.invoke("InterestItemListMessage");
			
	},
	
	/**
	* This function is used to invoke InterestItemDelete service. It prepares the parameters and then invokes the service.
	* @param {string} params  the parameters to be sent to the InterestItemDelete service.
	* @param {string} controllerURL  the URL value of the refresh controller. 
	*/	
	deleteInterestItem:function(params,controllerURL) {
		if(controllerURL!= null && controllerURL!='undefined'){
			CommonControllersDeclarationJS.setControllerURL("WishlistDisplay_Controller",controllerURL);
		}
		
		/* Handles  multiple clicks */
		if(!submitRequest()){
			return;
		}   			
		cursor_wait();		
		wc.service.invoke( "InterestItemDelete", params);
		
	},
	
	/**
	* This function is used to clear some of the fields in the email form in wish list page after InterestItemListMessage is invoked.
	* @param {string} formId  the id of the email form in WishList page.
	*/	
	clearWishListEmailForm:function(formId){
		var form = document.getElementById(formId);
		form.recipient.value = "";
		form.sender_name.value = "";
		form.sender_email.value = "";
		form.wishlist_message.value="";
	},

	/**
	* This function is used to load the value of the controller URL.
	* @param {string} contentURL  the value of the controller URL.
	*/
	loadContentURL:function(contentURL){
		/* Handles multiple clicks */
		if(!submitRequest()){
			return;
		}   	
		cursor_wait();
		CommonControllersDeclarationJS.setControllerURL('WishlistDisplay_Controller',contentURL);		
		wc.render.updateContext("WishlistDisplay_Context");
	},

	/**
	* This function belong to HistoryTracking for receiving Back notifications.
	*/
	goBack:function(){
	
		AccountWishListDisplay.loadContentURL(this.historyUrl);
		AccountWishListDisplay.isHistory=true;

	},

	/**
	* This function belong to HistoryTracking for receiving forward notifications.	
	*/
	goForward:function(){

		AccountWishListDisplay.loadContentURL(this.historyUrl);
		isHistory=true;
	},

	/**
	* This function sets the History state object for history tracking.
	* @param {string} elementId  the id of the widget.
	* @param {string} changeUrl   the url used to load new context.	
	* @param {string} historyUrl the value of the hsitory URL.
	*/
	HistoryTracker:function(elementId, changeUrl, historyUrl){
	
		this.elementId = elementId; 
		this.changeUrl =  changeUrl;
		this.historyUrl = historyUrl; 

	},
	/**
		* This function processes book mark URL and act accordingly. If there is query information in the url, extract the query string, 
		* make AJAX call to request the wish list and update the wish list display division with the results.
		*/
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
	}
}

/** Sets the  HistoryTracking for receiving Back notifications. */
AccountWishListDisplay.HistoryTracker.prototype.back = AccountWishListDisplay.goBack;
/** Sets the  HistoryTracking for receiving forward notifications. */
AccountWishListDisplay.HistoryTracker.prototype.forward=AccountWishListDisplay.goForward;

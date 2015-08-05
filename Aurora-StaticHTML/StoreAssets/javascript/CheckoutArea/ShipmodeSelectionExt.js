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
 * @fileOverview This javascript handles different actions to perform after shopper selects to proceed with checkout.
 * In summary, user can have different logon status and user can select different shopping option (buy online or 
 * pick up at store). 
 * A user can have the following logon status:
 * 1. Shopper is a guest user
 * 2. Shopper has a commerce account but is not yet logged on (and would like to log on before user proceeds with
 *    shopping flow)
 * 3. Shopper is already logged on
 * In addition, user can select different shipping options:
 * 1. Shop online
 * 2. Pick up at store
 * Every logon status/shipping selection combination as mentioned above will be handled in this javascript
 */

ShipmodeSelectionExtJS = {	
	/** language id used by the store, default to -1 (English) */
	langId: "-1",
	/** store id of the store */
	storeId: "",
	/** catalog id of the store */
	catalogId: "",		
	/** indicates if store locator feauture is enabled or not */
	storeLocatorEnabled: false,
	/** Order item ID of an order item in the current order. This is needed for OrderChangeServiceItemUpdate to call DoInventoryActionCmd to get fulfillment center ID **/
	orderItemId : "",
	
	/**
	* Indicates if "Pick up in store" shipping option is selected by shopper
	*/
	isPickUpInStore: function() {
		var shipType = this.getShipTypeValue();
		if (shipType == "pickUp") {
			return true;
		} else {
			return false;
		}
	},
	
	/**
	* Gets the shipType value from the document.BOPIS_FORM form.
	*/
	getShipTypeValue: function() {
		if (document.BOPIS_FORM != undefined){	
			for (var i=0; i < document.BOPIS_FORM.shipType.length; i++) {
			   if (document.BOPIS_FORM.shipType[i].checked) {
				  return document.BOPIS_FORM.shipType[i].value;
				  }
			   }
		}  
	},

	/**
	 * This function retrieves the shipment type value for the current order from the cookie.  If no shipment type value for the 
	 * current order is found in the cookie, empty string is returned.
	 *
	 * @param {String} orderId The order ID.
	 * 
	 * @returns {String} The shipment type value.
	 *
	 */
	getShipTypeValueFromCookieForOrder:function(orderId) {
		var shipTypeValueOrderId = dojo.cookie("WC_shipTypeValueOrderId");
		if (shipTypeValueOrderId == orderId) {
			var shipTypeValue = dojo.cookie("WC_shipTypeValue");
			return shipTypeValue;
		} else {
			return "";
		}
	},

	/**
	 * This function adds or updates the shipment type value for the current order to the cookie.
	 *
	 * @param {String} value The new pick up store ID. 
	 * @param {String} orderId The order ID.
	 *
	 */
	setShipTypeValueToCookieForOrder:function(value, orderId) {
		var newShipTypeValue = value;
		if (newShipTypeValue != null && newShipTypeValue != "undefined" && newShipTypeValue != "") {
			var shipTypeValueOrderId = dojo.cookie("WC_shipTypeValueOrderId");
			if (shipTypeValueOrderId != orderId) {
				dojo.cookie("WC_shipTypeValueOrderId", null, {expires: -1});
				dojo.cookie("WC_shipTypeValueOrderId", orderId);
			}
			var currentShipTypeValue = this.getShipTypeValueFromCookieForOrder(orderId);
			if (newShipTypeValue != currentShipTypeValue) {
				dojo.cookie("WC_shipTypeValue", null, {expires: -1});
				dojo.cookie("WC_shipTypeValue", newShipTypeValue);
			}
		}
		//select the proper options that are saved in context
		if (newShipTypeValue == "pickUp") {
			if (document.getElementById("scheduling_options")) {
				document.getElementById("scheduling_options").style.display="none";
				dojo.cookie("WC_recurringOrder_"+orderId, "false");
				if (document.getElementById("recurringOrder")) {
					document.getElementById("recurringOrder").checked = false;
				}
				this.hideShowNonRecurringOrderMsg(orderId);
			}
		} else if (newShipTypeValue == "shopOnline") {
			if (document.getElementById("scheduling_options")) {
				document.getElementById("scheduling_options").style.display="block";
				this.hideShowNonRecurringOrderMsg(orderId);
			}
		}
	},

	/**
	 * This function select the proper shipmode in the shopping cart page that is saved in the cookie.
	 *
	 * @param {String} orderId The order identifier of the current shopping cart. 
	 *
	 */
	displaySavedShipmentTypeForOrder:function(orderId) {
		var shipTypeValueOrderId = dojo.cookie("WC_shipTypeValueOrderId");
		if (shipTypeValueOrderId != orderId) {
			dojo.cookie("WC_shipTypeValueOrderId", null, {expires: -1});
			dojo.cookie("WC_shipTypeValue", null, {expires: -1});
		} else {
			var currentShipTypeValue = this.getShipTypeValueFromCookieForOrder(orderId);
				
			//select the proper shipmode that is saved in context
			if (currentShipTypeValue == "pickUp") {
				document.getElementById("shipTypePickUp").checked = true;
				if (document.getElementById("scheduling_options")) {
					document.getElementById("scheduling_options").style.display="none";
					dojo.cookie("WC_recurringOrder_"+orderId, "false");
					if (document.getElementById("recurringOrder")) {
						document.getElementById("recurringOrder").checked = false;
					}
				}
			} else if (currentShipTypeValue == "shopOnline") {
				document.getElementById("shipTypeOnline").checked = true;
				if (document.getElementById("scheduling_options")) {
					document.getElementById("scheduling_options").style.display="block";
				}
			}
		}
		this.hideShowNonRecurringOrderMsg(orderId,true);
	},

	/**
	 * This function is used to show all the cues to the shopper when in the shopping cart page. It shows messages for the following:
	 * - guest shopper attempting to checkout a recurring order
	 * - it flags non recurring items when attempting to checkout as a recurring order
	 *
	 * @param {String} orderId 			The order identifier of the current shopping cart. 
	 * @param {String} fromPageLoad Tells if this function is called on a page load, which does not need the error message to show.
	 */
	hideShowNonRecurringOrderMsg:function(orderId,fromPageLoad) {
		if (document.getElementById("recurringOrder") && document.getElementById("recurringOrder").checked && document.getElementById("shipTypeOnline") && document.getElementById("shipTypeOnline").checked) {
			dojo.cookie("WC_recurringOrder_"+orderId, "true");
		} else {
			dojo.cookie("WC_recurringOrder_"+orderId, null, {expires: -1});
		}
		
		if (document.getElementById("nonRecurringOrderItems") && document.getElementById("nonRecurringOrderItems").value != "") {
			if (document.getElementById("nonRecurringOrderItemsCount") && document.getElementById("numOrderItemsInOrder")) {
				var totalItems = document.getElementById("numOrderItemsInOrder").value;
				var totalNonRecurringItems = document.getElementById("nonRecurringOrderItemsCount").value;
				if (totalItems == totalNonRecurringItems) {
					if (document.getElementById("scheduling_options")) {
						document.getElementById("scheduling_options").style.display = "none";
						dojo.cookie("WC_recurringOrder_"+orderId, "false");
						if (document.getElementById("recurringOrder")) {
							document.getElementById("recurringOrder").checked = false;
						}
						return;
					}// else if (document.getElementById("scheduling_options") && document.getElementById("shipTypeOnline") && document.getElementById("shipTypeOnline").checked) {
					//	document.getElementById("scheduling_options").style.display = "block";
					//}
				}
			}
			var orderItemIds = document.getElementById("nonRecurringOrderItems").value;
			var orderItemIdArray = orderItemIds.split(",");
			for(var i=0; i<orderItemIdArray.length; i++){
				if (document.getElementById("nonRecurringItem_"+orderItemIdArray[i])) {
					if (document.getElementById("recurringOrder") && document.getElementById("recurringOrder").checked && document.getElementById("shipTypeOnline") && document.getElementById("shipTypeOnline").checked) {
						document.getElementById("nonRecurringItem_"+orderItemIdArray[i]).style.display = "block";
					} else {
						document.getElementById("nonRecurringItem_"+orderItemIdArray[i]).style.display = "none";
					}
				}
			}
			if (document.getElementById("recurringOrder") && document.getElementById("recurringOrder").checked && document.getElementById("shipTypeOnline") && document.getElementById("shipTypeOnline").checked && !fromPageLoad) {
				MessageHelper.displayErrorMessage(MessageHelper.messages["RECURRINGORDER_ERROR"]);
			}
		}
	},

	/** 
	* Constructs the next URL to call when user is already signed on 
	* 3 scenarios to handle:
	* 	1. Registered user selects to shop online -> goes to the shipping and billing page
	* 	2. Registered user selects to pick up in store - 2 variations:
	*		2a. User has not yet selected a physical store (WC_physicalStores cookie is empty) -> 
	*				Goes to store selection page
	*		2b. User has selected at least one store (WC_physicalStore cookie is not empty) ->
	*				Updates shipmode then goes to shipping and billing page
	* @param {String} billingShippingPageURLForOnline The URL to the billing and shipping page of the online checkout path
	* @param (String) physicalStoreSelectionURL The URL to the physical store selection page of the pick up in store checkout path
	*/
	registeredUserContinue: function(billingShippingPageURLForOnline, physicalStoreSelectionURL) {
		if(CheckoutHelperJS.getFieldDirtyFlag()){
			if(document.getElementById("ShoppingCart_NonAjaxUpdate") != null){
				MessageHelper.formErrorHandleClient(document.getElementById("ShoppingCart_NonAjaxUpdate"), MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}else{
				MessageHelper.displayErrorMessage(MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}
		}
    	
		//For handling multiple clicks
		if(!submitRequest()){
			return;
		}	
		
		var deletePaymentInstructionsURL = "";
		var paymentInstructionIds = document.getElementById("existingPaymentInstructionId").value;
		if (paymentInstructionIds != "") {	
			var paymentInstructionsArray = paymentInstructionIds.split(",");
			deletePaymentInstructionsURL = "OrderChangeServicePIDelete?";
			for (var i=0; i<paymentInstructionsArray.length; i++) {
				if (i!=0) {
					deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&";
				}
				deletePaymentInstructionsURL = deletePaymentInstructionsURL + "piId=" + paymentInstructionsArray[i];
			}
			deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&URL=";
		}
		
		if (this.isStoreLocatorEnabled() && this.isPickUpInStore()) {
			document.location.href = physicalStoreSelectionURL;
		} else {
			//need to pass in orderItemId here for OrderChangeServiceItemUpdate so it will call DoInventoryActionCmd to get fulfillment center ID
			var nextLink = 'OrderChangeServiceItemUpdate?remerge=***&check=*n&allocate=***&backorder=***&calculationUsage=-1,-2,-3,-4,-5,-6,-7&orderItemId_0='+this.orderItemId +'&errorViewName=AjaxOrderItemDisplayView'+'&orderId=.&URL=';
			document.location.href = nextLink + billingShippingPageURLForOnline;
		}
	},

	/**
	* Constructs the next URL to call when user is not signed on and selected to continue checkout with 
	* guest user mode
	* 3 scenarios to handle:
	* 	1. Guest user selects to shop online -> goes to the shipping and billing page
	* 	2. Guest user selects to pick up in store - 2 variations:
	*		2a. User has not yet selected a physical store (WC_physicalStores cookie is empty) -> 
	*				Goes to store selection page
	*		2b. User has selected at least one store (WC_physicalStore cookie is not empty) ->
	*				Updates shipmode then goes to shipping and billing page
	* @param {String} billingShippingPageURLForOnline The URL to the billing and shipping page of the online checkout path
	* @param (String) physicalStoreSelectionURL The URL to the physical store selection page of the pick up in store checkout path
	*/
	guestShopperContinue: function(billingShippingPageURLForOnline, physicalStoreSelectionURL) {
		if(CheckoutHelperJS.getFieldDirtyFlag()){
			if(document.getElementById("ShoppingCart_NonAjaxUpdate") != null){
				MessageHelper.formErrorHandleClient(document.getElementById("ShoppingCart_NonAjaxUpdate"), MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}else{
				MessageHelper.displayErrorMessage(MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}
		}
		
		//For handling multiple clicks
		if(!submitRequest()){
			return;
		}
		
		var deletePaymentInstructionsURL = "";
		var paymentInstructionIds = document.getElementById("existingPaymentInstructionId").value;
		if (paymentInstructionIds != "") {	
			var paymentInstructionsArray = paymentInstructionIds.split(",");
			deletePaymentInstructionsURL = "OrderChangeServicePIDelete?";
			for (var i=0; i<paymentInstructionsArray.length; i++) {
				if (i!=0) {
					deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&";
				}
				deletePaymentInstructionsURL = deletePaymentInstructionsURL + "piId=" + paymentInstructionsArray[i];
			}
			deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&URL=";
		}
		
		
		if (this.isStoreLocatorEnabled() && this.isPickUpInStore()) {
			document.location.href = deletePaymentInstructionsURL + physicalStoreSelectionURL;
		} else {
			//need to pass in orderItemId here for OrderChangeServiceItemUpdate so it will call DoInventoryActionCmd to get fulfillment center ID
			deletePaymentInstructionsURL = 'OrderChangeServiceItemUpdate?remerge=***&check=*n&allocate=***&backorder=***&calculationUsage=-1,-2,-3,-4,-5,-6,-7&orderItemId_0='+this.orderItemId +'&errorViewName=AjaxOrderItemDisplayView'+'&orderId=.&guestChkout=1&URL=';

			document.location.href = deletePaymentInstructionsURL + billingShippingPageURLForOnline;
		}
	},

	/**
	* Constructs the next URL to call when user is not signed on and selected to sign in before checkout
	* 3 scenarios to handle:
	* 	1. User selects to shop online -> invokes logon URL
	* 	2. User selects to pick up in store - 2 variations:
	*		2a. User has not yet selected a physical store (WC_physicalStores cookie is empty) -> 
	*				After logon URL, go to the store selection page
	* 	2b. User has selected at least one store (WC_physicalStore cookie is not empty) ->
	*				Updates shipmode then invokes logon URL	
	* @param {String} logonURL URL to perform user logon 
	* @param {String} orderMoveURL URL to call order move after user has logged on
	* @param {String} billingShippingPageURLForOnline The URL to the billing and shipping page of the online checkout path
	* @param (String) physicalStoreSelectionURL The URL to the physical store selection page of the pick up in store checkout path
	*/
	guestShopperLogon: function(logonURL, orderMoveURL, billingShippingPageURLForOnline, physicalStoreSelectionURL) {
		if(CheckoutHelperJS.getFieldDirtyFlag()){
			if(document.getElementById("ShoppingCart_NonAjaxUpdate") != null){
				MessageHelper.formErrorHandleClient(document.getElementById("ShoppingCart_NonAjaxUpdate"), MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}else{
				MessageHelper.displayErrorMessage(MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
				return;
			}
		}
		
		var completeOrderMoveURL = orderMoveURL;
		var afterOrderCalculateURL = "";
		
		if (this.isStoreLocatorEnabled() && this.isPickUpInStore()) {
			afterOrderCalculateURL = physicalStoreSelectionURL;
		} else {
			afterOrderCalculateURL = billingShippingPageURLForOnline;
		}
		
		// change URL of logon link
		completeOrderMoveURL = completeOrderMoveURL + "&URL=OrderCalculate%3FURL=" + afterOrderCalculateURL + "&calculationUsageId=-1&calculationUsageId=-2&calculationUsageId=-7";
		document.AjaxLogon.URL.value = completeOrderMoveURL;
		document.location.href = logonURL;
	},
	 	
	/** 
	* Function to call when Quick Checkout button is pressed
	* 2 scenarios to handle:
	*   1. User selects to shop online -> proceed to call CheckoutHelperJS.updateCartWithCheckoutProfile
	*   2. User selects to pick up in store -> display error message to indicate quick checkout option is only
	*      available with online shopping option
	* @param {String} quickOrderId order id of this order
	*/
	updateCartWithQuickCheckoutProfile: function(quickOrderId) {
		if (this.isStoreLocatorEnabled() && this.isPickUpInStore()) {
			MessageHelper.displayErrorMessage(MessageHelper.messages["message_QUICK_CHKOUT_ERR"]);
		} else {
			if(CheckoutHelperJS.getFieldDirtyFlag()){
				if(document.getElementById("ShoppingCart_NonAjaxUpdate") != null){
					MessageHelper.formErrorHandleClient(document.getElementById("ShoppingCart_NonAjaxUpdate"), MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
					return;
				}else{
					MessageHelper.displayErrorMessage(MessageHelper.messages["ERROR_UPDATE_FIRST_SHOPPING_CART"]);
					return;
				}
			}
			CheckoutHelperJS.setCommonParameters(this.langId, this.storeId, this.catalogId);
			CheckoutHelperJS.updateCartWithQuickCheckoutProfile(quickOrderId);	
		}
	},
	
	/** 
	* Sets common parameters used by this javascript object
	* @param {String} langId language ID to use
	* @param {String} storeId store ID to use
	* @param {String} catalog Catalog ID to use
	*/
	setCommonParameters:function(langId,storeId,catalogId){
		this.langId = langId;
		this.storeId = storeId;
		this.catalogId = catalogId;
	},
	
	/** 
	* Sets orderItemId used by this javascript object
	* @param {String} orderItemId OrderItemId to use
	*/
	setOrderItemId:function(orderItemId){
		this.orderItemId = orderItemId;
	},
		
	/**
	* sets to tell if store locator feature is enabled
	* @param {boolean} flag Contains value of true or false
	*/
	setStoreLocatorEnabled:function(flag){
		this.storeLocatorEnabled = flag;
	},
	
	/**
	* indicates if store locator feature is enabled
	*/
	isStoreLocatorEnabled:function(){
		return this.storeLocatorEnabled;
	},
	
	/**
	* This function is called by the CheckoutStoreSelection.jsp "Next" button. It's job is to decide if it should go to
	* the next page. If there are no missing information it submits the call to the server to save the pick up location
	* for all the order items and then goes to the next page.
	* @param {Object} form The form that contains the order items and that need to be submitted 
	*/
	submitStoreSelectionForm:function(form) {
		var phyStoreId = PhysicalStoreCookieJS.getPickUpStoreIdFromCookie();

		if (phyStoreId != null && phyStoreId != "") {
			form["physicalStoreId"].value = phyStoreId;
			form.submit();
		} else {
			if(document.getElementById("storeSelection_NextButton") != null){
				MessageHelper.formErrorHandleClient(document.getElementById("storeSelection_NextButton"), MessageHelper.messages["message_NO_STORE"]);
			}else{
				MessageHelper.displayErrorMessage(MessageHelper.messages["message_NO_STORE"]);
			}
		}
	},
	
	/**
	* This function is called by the CheckoutPayInStore.jsp "Next" button. It's job is to decide if it should go to
	* the next page. If the action is to use "PayInStore" then it directly goes to next page, otherwise it does 
	* validation on the address form and if there are no missing information it submits the call to the server to 
	* create the address and then goes to the next page.
	* 
	* @param {String} formName Name of the form that contains the address and need to be submitted 
	* @param {String} stateDivName Name of the div that has the "state" field
	* @param {String} hasValidAddresses boolean indicating if the user has at least one valid address for checkout purposes
	*/
	submitAddressForm:function(formName, stateDivName, hasValidAddresses) {
		var form = document.forms[formName];
		if (stateDivName != "") {
			AddressHelper.setStateDivName(stateDivName);
		}
		
		var payInStore = false;
		if (document.getElementById("payInStorePaymentOption").checked) {
			payInStore = true;
		}
		
		var deletePaymentInstructionsURL = "";
		var paymentInstructionIds = form.existingPaymentInstructionId.value;
		if (paymentInstructionIds != "") {	
			var paymentInstructionsArray = paymentInstructionIds.split(",");
			deletePaymentInstructionsURL = "OrderChangeServicePIDelete?";
			for (var i=0; i<paymentInstructionsArray.length; i++) {
				if (i!=0) {
					deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&";
				}
				deletePaymentInstructionsURL = deletePaymentInstructionsURL + "piId=" + paymentInstructionsArray[i];
			}
			deletePaymentInstructionsURL = deletePaymentInstructionsURL + "&URL=";
		}

		if (hasValidAddresses) {
			//need to pass in orderItemId here for OrderChangeServiceItemUpdate so it will call DoInventoryActionCmd to get fulfillment center ID
			document.location.href = deletePaymentInstructionsURL + "OrderChangeServiceItemUpdate?URL=DOMOrderShippingBillingView&remerge=***&check=*n&allocate=***&backorder=***&calculationUsage=-1,-2,-3,-4,-5,-6,-7&orderItemId_0="+this.orderItemId +"&storeId="+this.storeId+"&catalogId="+this.catalogId+"&langId="+this.langId+"&payInStore="+payInStore;
		
		} else if (AddressHelper.validateAddressForm(form)) {
			//need to pass in orderItemId here for OrderChangeServiceItemUpdate so it will call DoInventoryActionCmd to get fulfillment center ID
			form.URL.value = deletePaymentInstructionsURL + "OrderChangeServiceItemUpdate?remerge=***&check=*n&allocate=***&backorder=***&calculationUsage=-1,-2,-3,-4,-5,-6,-7&orderItemId_0="+this.orderItemId +"&URL=DOMOrderShippingBillingView?payInStore="+payInStore;
			form.submit();
		}
	}
}	

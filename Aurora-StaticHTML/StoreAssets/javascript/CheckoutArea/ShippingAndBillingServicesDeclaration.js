//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2008, 2011 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

//
//

/** 
 * @fileOverview This file declares services that are used in the store check-out pages.
 */

dojo.require("wc.service.common");


/** 
 * This file declares services that are used in the store check-out pages.
 * 
 * @class This SBServicesDeclarationJS class defines all the variables and functions for the page(s) that use shipping and billing functionality in the store.
 *
 */
SBServicesDeclarationJS = {
	/** 
	 * This variable stores the ID of the language that the store is currently using.
	 *
	 * @private
	 */
	langId: "-1",
	
	/** 
	 * This variable stores the ID of the current store.
	 *
	 * @private
	 */
	storeId: "",
	
	/** 
	 * This variable stores the ID of the catalog that is used in the store.
	 *
	 * @private
	 */
	catalogId: "",
	
	/** 
	 * This variable stores the value that indicates if the current check-out shopping flow is in AJAX mode or not. 
	 *
	 * @private
	 */
	ajaxCheckOut: true,

	/** 
	 * This variable stores the true/false value that indicates if the 'SinglePageCheckout' feature is enabled/disabled.
	 * When it is true, both shipping and billing information are captured in a single page. If it is false, checkout will
	 * be a two step process where shipping is captured in first step and billing in second step.
	 * It is set to true by default.
	 * 
	 * @private
	 */
	singlePageCheckout:true,
	
	/**
	 * This variable stores the value that indicates if an <code>OrderProcessServiceOrderPrepare</code> service call is required.
	 *
	 * @private
	 */
	orderPrepare: false,
	
	
	/**
 	 * Sets the common parameters for this instance.
 	 *
 	 * @param {int} langId The ID of the language used in the store.
 	 * @param {int} storeId The ID of the store.
 	 * @param {catalogId} catalogId The ID of the catalog used in the store.
	 */
	setCommonParameters:function(langId,storeId,catalogId){
			this.langId = langId;
			this.storeId = storeId;
			this.catalogId = catalogId;
	},
	
	/**
 	 * Sets the flag which indicates whether the 'AjaxCheckout' feature is enabled or not.
 	 *
 	 * @param {boolean} checkOutType A value that indicates if the 'AjaxCheckout' feature is enabled.
	 */
	setAjaxCheckOut:function(checkOutType){
		this.ajaxCheckOut = checkOutType;
	},
	
	/**
 	 * Returns the flag that indicates whether 'AjaxCheckout' feature is enabled or not.
 	 *
 	 * @returns {boolean} ajaxCheckOut A value that indicates if the 'AjaxCheckout' feature is enabled.
	 */
	isAjaxCheckOut:function(){
		return this.ajaxCheckOut;
	},

	/**
	 * Sets the SinglePageCheckout variable to indicate if the 'SinglePageCheckout' feature is enabled or disabled.
	 * 
	 * @param {Boolean} singlePageCheckout. A true/false value that indicates if the 'SinglePageCheckout' feature is enabled.
	 *
	 * @see CheckoutHelperJS.isSinglePageCheckout
	 */
	setSinglePageCheckout:function(singlePageCheckout){
		this.singlePageCheckout = singlePageCheckout;
	},
	
	
	/**
	 * Returns the singlePageCheckout variable that indicates if the 'SinglePageCheckout' feature is enabled/disabled.
	 * 
	 * @returns {Boolean} singlePageCheckout A true/false value that indicates if the 'SinglePageCheckout' feature is
	 * enabled/disabled.
	 *
	 * @see CheckoutHelperJS.setSinglePageCheckout
	 */
	isSinglePageCheckout:function(){
		return this.singlePageCheckout;
	}

}

/**
 * Declares an AJAX service that adds an item to the wish list and delete an item from the shopping cart.
 * @constructor 
 */
wc.service.declare({
	id: "AjaxInterestItemAddAndDeleteFromCart",
	actionId: "AjaxInterestItemAddAndDeleteFromCart",
	url: "AjaxInterestItemAdd",
	formId: ""

	/**
	 * Hides the progress bar and deletes the order item from the shopping cart.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		CheckoutHelperJS.deleteFromCart(serviceResponse.orderItemId);
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
 * Declares an AJAX service that updates the shipping address and shipping method for items in the order.
 * @constructor 
 */
wc.service.declare({
	id: "OrderItemAddressShipMethodUpdate",
	actionId: "OrderItemAddressShipMethodUpdate",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * hides all the messages and the progress bar
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
	,successHandler: function(serviceResponse) {
		MessageHelper.hideAndClearMessage();
		cursor_clear();
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
 * Declares an AJAX service that updates the shipping charge type for items in the order.
 * @constructor 
 */
wc.service.declare({
	id: "AjaxOrderShipChargeUpdate",
	actionId: "AjaxOrderShipChargeUpdate",
	url: "AjaxShipInfoUpdate",
	formId: ""
	
	/**
	 * hides all the messages and the progress bar
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
	,successHandler: function(serviceResponse) {
		/*
		MessageHelper.hideAndClearMessage();
		cursor_clear();
		*/
		var params = [];
		params.orderId = ".";
		params["storeId"] = CheckoutHelperJS.storeId;
		params["catalogId"] = CheckoutHelperJS.catalogId;
		params["langId"] = CheckoutHelperJS.langId;
		wc.service.invoke("AjaxPrepareOrderForShipChargeUpdate", params);
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
 *This service calculates charges, performs inventory actions, and locks the
 *price of the order to indicate that the order can be submitted.
 *A message is displayed after the service call.
 * @constructor
 */
wc.service.declare({
	id: "AjaxPrepareOrderForShipChargeUpdate",
	actionId: "AjaxPrepareOrderForShipChargeUpdate",
	url: getAbsoluteURL() + "AjaxOrderProcessServiceOrderPrepare",
	formId: ""
    /**
   * hides all the messages and the progress bar
   * @param (object) serviceResponse The service response object, which is the
   * JSON object returned by the service invocation
   */
	,successHandler: function(serviceResponse) {
		MessageHelper.hideAndClearMessage();
			cursor_clear();
	}

    /**
   * hides all the messages and the progress bar
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

}),


/**
 * Declares an AJAX service that updates the shipping address and shipping instruction for items in the order.
 * @constructor 
 */
wc.service.declare({
	id: "OrderItemAddressShipInstructionsUpdate",
	actionId: "OrderItemAddressShipInstructionsUpdate",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * Invokes the <code>OrderItemAddressShipInstructionsUpdate1</code> service if shipping instructions were specified, otherwise hides all the messages and the progress bar
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		var params = [];
		params.orderId = ".";
		params["storeId"] = CheckoutHelperJS.storeId;
		params["catalogId"] = CheckoutHelperJS.catalogId;
		params["langId"] = CheckoutHelperJS.langId;
		params.calculationUsage = "-1,-2,-3,-4,-5,-6,-7";
		
		//Check if Shipping Instructions is enabled		
		if(document.getElementById("shipInstructions") != null){
			var shipInstructions = document.getElementById("shipInstructions").value;
			var orderItemId = document.getElementById("orderItem_1").value;				
			
			params["shipInstructions"] = shipInstructions;
			params["orderItemId"] = orderItemId;
			
			wc.service.invoke("OrderItemAddressShipInstructionsUpdate1", params);			
		} else {
			MessageHelper.hideAndClearMessage();
			cursor_clear();
		}		
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
 * Declares an AJAX service that updates the shipping instruction for items in the order.
 * @constructor 
 */
wc.service.declare({
	id: "OrderItemAddressShipInstructionsUpdate1",
	actionId: "OrderItemAddressShipInstructionsUpdate1",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * hides all the messages and the progress bar
	 * @param (object) serviceResponse The service response object, which is the
	 * JSON object returned by the service invocation
	 */
	,successHandler: function(serviceResponse) {
		MessageHelper.hideAndClearMessage();
		cursor_clear();
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
 * Declares an AJAX service that updates the shipping method for items in the order. This service is used to move all order items to single addressId and shipModeId when a user clicks on the single shipment button.
 * @constructor 
 */
wc.service.declare({
	id: "OrderItemAddressShipMethodUpdate1",
	actionId: "OrderItemAddressShipMethodUpdate1",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * Invokes the <code>OrderChangeServiceShipInfoUpdate</code> service, then redirects the browser to OrderShippingBillingView.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		//Store the ids
		var storeId = CheckoutHelperJS.storeId;
		var catalogId = CheckoutHelperJS.catalogId;
		var langId = CheckoutHelperJS.langId;
		var orderId = serviceResponse.orderId;		

		//Obtain the shipmode id for the first order item
		var orderItemId = document.getElementById("orderItem_1").value;	
		var commonShipModeId = document.getElementById("commonShipModeId").value;
		if(commonShipModeId !=null && commonShipModeId!='undefined'){
			var shipModeId = commonShipModeId;
		}else{
			var shipModeId = document.getElementById("MS_ShippingMode_"+orderItemId).value;
		}

		//For updating the shipmode id, order prepare, and displaying shipping & billing page
		var url = 'OrderChangeServiceShipInfoUpdate?URL=OrderShippingBillingView?storeId='+storeId+'&catalogId='+catalogId+'&langId='+langId+'&orderId='+orderId+'&shipModeId='+shipModeId+'&allocate=***&backorder=***&remerge=***&check=*n';
		
		//do not want to pass an empty purchaseorder_id to OrderChangeServiceShipInfoUpdate because it'll cause an failure in OrderFacadeClient.java
		var purchaseorderRef = document.getElementById("purchase_order_number");
		if(purchaseorderRef){
			var purchaseorder_id = purchaseorderRef.value;
			if(purchaseorder_id !=null && purchaseorder_id !='undefined' && purchaseorder_id !=''){			
				url +='&purchaseorder_id='+purchaseorder_id;
			}
		}
		
		//checks to see if quick checkout is enabled to display the credit card masked info  by checking the valueFromProfileOrder parameter
		if (valueFromProfileOrderElement = document.getElementsByName("valueFromProfileOrder")[0]&&valueFromProfileOrderElement.value == 'Y') {
			url +='&quickCheckoutProfileForPayment=true';
		}
		document.location.href = url;
	}
	
	/**
	 * Displays the error message returned with the service response and hides the progress bar.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		if(serviceResponse.errorMessageKey == '_ERR_INVALID_ADDR'){
			MessageHelper.displayErrorMessage(MessageHelper.messages["ERROR_SWITCH_SINGLE_SHIPMENT"]);
		} else {		 
			if (serviceResponse.errorMessage) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
			} else {
				if (serviceResponse.errorMessageKey) {
					MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
				}
			}
		}
		cursor_clear();
	}
}),

/**
 * Declares an AJAX service that updates the shipping address for items in the order.
 * @constructor
 */
wc.service.declare({
	id: "AjaxUpdateOrderItemsAddressId",
	actionId: "AjaxUpdateOrderItemsAddressId",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * After service was successfully performed, if AJAXCheckout is enabled, hides all messages and the progress bar. 
	 * Otherwise, routes to shipping and billing page.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		if(SBServicesDeclarationJS.isAjaxCheckOut() == "true"){
			MessageHelper.hideAndClearMessage();
			cursor_clear();
		}
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
 * Declares an AJAX service that adds a billing address during order check-out.
 * @constructor
 */
wc.service.declare({
	id: "AddBillingAddressInCheckOut",
	actionId: "AddBillingAddressInCheckOut",
	url: "AjaxPersonChangeServiceAddressAdd",
	formId: ""
	
	/**
	 * If 'AjaxCheckout' feature is enabled, this function renders the area having the context ID contextForMainAndAddressDiv with the specified properties.
	 * If 'AjaxCheckout' feature is disabled, this function redirects the browser to OrderShippingBillingView.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		if(SBServicesDeclarationJS.isAjaxCheckOut()){
			wc.render.updateContext('contextForMainAndAddressDiv', {'showArea':'mainContents','hideArea':'editAddressContents'});
		}
		else {
			document.location.href = "OrderShippingBillingView?storeId=" + SBServicesDeclarationJS.storeId + "&catalogId=" + SBServicesDeclarationJS.catalogId + "&langId=" + SBServicesDeclarationJS.langId + "&orderId=" + serviceResponse.orderId;
		}
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
 * Declares an AJAX service that updates shipping information for order items during check-out.
 * @constructor
 */
wc.service.declare({
	id: "OrderShippingInfoUpdate",
	actionId: "OrderShippingInfoUpdate",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * Clears the progress bar.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
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
 * Declares an AJAX service that prepares order information before submitting the order.
 * @constructor
 */
wc.service.declare({
	id: "AjaxPrepareOrderBeforeSubmit",
	actionId: "AjaxPrepareOrderBeforeSubmit",
	url: "AjaxOrderProcessServiceOrderPrepare",
	formId: ""
	
	/**
	 * Submits the order with the name of the payment form.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		CheckoutPayments.getTotalInJSON("OrderPrepare", 'PaymentForm', false);
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
 * Declares an AJAX service that prepares order information before submitting the order.
 * @constructor
 */
wc.service.declare({
	id: "AjaxPrepareOrderBeforePaymentCapture",
	actionId: "AjaxPrepareOrderBeforePaymentCapture",
	url: "AjaxOrderProcessServiceOrderPrepare",
	formId: ""
	
	/**
	 * Submits the order with the name of the payment form.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		CheckoutPayments.setCommonParameters(SBServicesDeclarationJS.langId,SBServicesDeclarationJS.storeId,SBServicesDeclarationJS.catalogId);
		CheckoutPayments.showBillingPage();
		cursor_clear();
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
 * Declares an AJAX service that sets the address ID for all items in the order.
 * @constructor
 */
wc.service.declare({
	id: "AjaxSetAddressIdOfOrderItems",
	actionId: "AjaxSetAddressIdOfOrderItems",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * Redirects the browser to OrderShippingBillingView
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		document.location.href="OrderShippingBillingView?orderId="+(serviceResponse.orderId?serviceResponse.orderId:".")+"&langId="+SBServicesDeclarationJS.langId+"&storeId="+SBServicesDeclarationJS.storeId+"&catalogId="+SBServicesDeclarationJS.catalogId+"&showRegTag=T";
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
		document.getElementById("OrderShippingBillingErrorArea").style.display = "block";
		cursor_clear();
	}

}),


/**
 * Declares an AJAX service that sets the shipping mode ID for the order.
 * @constructor
 */
wc.service.declare({
	id: "AjaxSetShipModeIdForOrder",
	actionId: "AjaxSetShipModeIdForOrder",
	url: "AjaxOrderChangeServiceShipInfoUpdate",
	formId: ""
	
	/**
	 * Redirects the browser to OrderShippingBillingView.
	 *
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		document.location.href="OrderShippingBillingView?langId="+SBServicesDeclarationJS.langId+"&storeId="+SBServicesDeclarationJS.storeId+"&catalogId="+SBServicesDeclarationJS.catalogId;
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
		document.getElementById("OrderShippingBillingErrorArea").style.display = "block";
		cursor_clear();
	}

}),




/**
* This service adds a shipping and billing address during order check out. An error message is displayed if the service failed.
* @constructor
*/
wc.service.declare({
	id: "AjaxAddShippingAndBillingAddressForPersonDuringCheckout",
	actionId: "AjaxAddShippingAndBillingAddressForPersonDuringCheckout",
	url: getAbsoluteURL() + "AjaxPersonChangeServiceAddressAdd",
	formId: ""

/**
* Hides all the messages and the progress bar
* @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
*/
	,successHandler: function(serviceResponse) {
		MessageHelper.hideAndClearMessage();
		cursor_clear();
	}

/**
* Displays an error message in case of failure.
* @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
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
* Declares an AJAX service that deletes payment instructions from the current order.
* @constructor
*/
wc.service.declare({
	id: "AjaxDeletePaymentInstructionFromThisOrder",
	actionId: "AjaxDeletePaymentInstructionFromThisOrder",
	url: "AjaxOrderChangeServicePIDelete",
	formId: ""
	
	/**
	 * Removes piId from payment objects and payment forms on the page, clears the progress bar.
	 * Invokes the AjaxPrepareOrderBeforeProceedingToSummary service to prepare order information.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		for(var i=0; i<CheckoutPayments.getPaymentsToDelete().length; i++){
			var paymentAreaNumber = CheckoutPayments.getPaymentsToDelete()[i];
			var paymentObj = CheckoutPayments.retrievePaymentObject(paymentAreaNumber);
			paymentObj['piId'] = "";
			document.forms["PaymentForm" + paymentAreaNumber].piId.value = "";
		}
		CheckoutPayments.paymentsToDelete = new Array();
		cursor_clear();
		
		if(CheckoutPayments.getPaymentsToAdd().length > 0){
			CheckoutPayments.addPaymentInstructions();
		}else if(CheckoutPayments.getPaymentsToUpdate().length > 0){
			CheckoutPayments.updatePaymentInstructions();
		}else{
			if(!submitRequest()){
				return;
			}   		
			cursor_wait();
			CheckoutPayments.setCommonParameters(SBServicesDeclarationJS.langId,SBServicesDeclarationJS.storeId,SBServicesDeclarationJS.catalogId);
			CheckoutPayments.showSummaryPage();
			cursor_clear();
		}
	}
	
	/**
	 * Resets the array object that contains existing payment objects to delete.
	 * Displays the error message returned with the service response and hides the progress bar.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		CheckoutPayments.paymentsToDelete = new Array();
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
* Declares an AJAX service that adds a payment instruction to the current order.
* @constructor
*/
wc.service.declare({
	id: "AjaxAddPaymentInstructionToThisOrder",
	actionId: "AjaxAddPaymentInstructionToThisOrder",
	url: "AjaxOrderChangeServicePIAdd",
	formId: ""
	
	/**
	 * Resets the array object that contains payment objects to add. Verifies if there is any payment instruction that needs to be updated.
	 * If there is no payment instruction that needs to be updated, direct the browser to the order summary page.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		CheckoutPayments.paymentsToAdd = new Array();
		cursor_clear();
		if(CheckoutPayments.getPaymentsToUpdate().length > 0){
			CheckoutPayments.updatePaymentInstructions();
		}else{
			if(!submitRequest()){
				return;
			}   		
			cursor_wait();			
			CheckoutPayments.setCommonParameters(SBServicesDeclarationJS.langId,SBServicesDeclarationJS.storeId,SBServicesDeclarationJS.catalogId);
			CheckoutPayments.showSummaryPage();
			cursor_clear();
		}
	}
	
	/**
	 * Resets the array object that contains existing payment objects to add.
	 * Displays the error message returned with the service response and hides the progress bar.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		CheckoutPayments.paymentsToAdd = new Array();
		if (serviceResponse.errorMessage) {
			MessageHelper.displayErrorMessage(serviceResponse.errorMessage);
		} else {
			if (serviceResponse.errorMessageKey) {
				MessageHelper.displayErrorMessage(serviceResponse.errorMessageKey);
			}
		}
		cursor_clear();
		//Payment type promotion: If add payment object failed, then if the number of payment methods is 1, call the service to associate an unbounded payment method with the order.
		if(supportPaymentTypePromotions && CheckoutPayments.numberOfPaymentMethods == 1){
			CheckoutPayments.addNewUnboundPaymentInstruction();
        }
	}

}),

/**
* Declares an AJAX service that updates payment instructions in the current order.
* @constructor
*/
wc.service.declare({
	id: "AjaxUpdatePaymentInstructionInThisOrder",
	actionId: "AjaxUpdatePaymentInstructionInThisOrder",
	url: "AjaxOrderChangeServicePIUpdate",
	formId: ""
	
	/**
	 * Clears the progress bar, verifies if there is any more payment instruction that needs to be updated.
	 * If there is no more payment instruction that needs to be updated, direct the browser to the order summary page.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		if(CheckoutPayments.getPaymentsToUpdate().length < 1){
			if(!submitRequest()){
				return;
			}   		
			cursor_wait();
			
			CheckoutPayments.setCommonParameters(SBServicesDeclarationJS.langId,SBServicesDeclarationJS.storeId,SBServicesDeclarationJS.catalogId);
			CheckoutPayments.showSummaryPage();
			cursor_clear();
		}else{
			CheckoutPayments.updatePaymentInstructions();
		}
	}
	
	/**
	 * Resets the array object that contains existing payment objects to update.
	 * Displays the error message returned with the service response and hides the progress bar.
	 * @param (object) serviceResponse The service response object, which is the JSON object returned by the service invocation.
	 */
	,failureHandler: function(serviceResponse) {
		CheckoutPayments.paymentsToUpdate = new Array();
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
 * Payment type promotion - START
 */
 
/**
* Declares an AJAX service that adds an unbounded payment instruction to the current order.
* @constructor
*/
wc.service.declare({
	id: "AjaxAddUnboundPaymentInstructionToThisOrder",
	actionId: "AjaxAddUnboundPaymentInstructionToThisOrder",
	url: "AjaxOrderChangeServicePIAdd",
	formId: ""
	
	/**
	 * Sets the piId of payment object 1 to the returned piId from the service
	 * call and updates its action to re-add, so that its correctly handled by
	 * the client logic of associating actions to payment objects. Invokes the
	 * AjaxPrepareOrderForPaymentSubmit service to prepare order information.
	 * 
	 * @param (object)
	 *            serviceResponse The service response object, which is the JSON
	 *            object returned by the service invocation.
	 */
	 ,successHandler: function(serviceResponse) { 
		cursor_clear();
		
		CheckoutPayments.setPaymentForm1PiId(serviceResponse.piId);		 
		CheckoutPayments.paymentObjects[1]['piId'] = serviceResponse.piId;
		CheckoutPayments.paymentObjects[1]['action'] = 're-add'; 
		 
		var params = [];
		params.orderId = serviceResponse.orderId;
		params["storeId"] = CheckoutHelperJS.storeId;
		params["catalogId"] = CheckoutHelperJS.catalogId;
		params["langId"] = CheckoutHelperJS.langId;
		cursor_wait();
		wc.service.invoke("AjaxPrepareOrderForPaymentSubmit", params);		 
 	 }
	/**
	 * Displays the error message returned with the service response and hides the progress bar.
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
* Declares an AJAX service that deletes an unbounded payment instruction from the current order.
* @constructor
*/
wc.service.declare({
	id: "AjaxDeleteUnboundPaymentInstructionFromThisOrder",
	actionId: "AjaxDeleteUnboundPaymentInstructionFromThisOrder",
	url: "AjaxOrderChangeServicePIDelete",
	formId: ""
	
	/**
	 * If required, sets the piId of payment object 1 to empty string and its
	 * action to add, so that its correctly handled by the client logic of
	 * associating actions to payment objects. Invokes adding a new unbound
	 * payment instruction if current number of payment methods is 1. Else, it
	 * calls the AjaxPrepareOrderForPaymentSubmit service to prepare order
	 * information.
	 * 
	 * @param (object)
	 *            serviceResponse The service response object, which is the JSON
	 *            object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		
		if(!CheckoutPayments.keepPaymentObject1){
			CheckoutPayments.setPaymentForm1PiId("");
			CheckoutPayments.paymentObjects[1]['piId'] = "";
			CheckoutPayments.paymentObjects[1]['action'] = 'add'; 
		}
		
		if(CheckoutPayments.numberOfPaymentMethods == 1 && !CheckoutPayments.keepPaymentObject1){
			CheckoutPayments.addNewUnboundPaymentInstruction();
		} else {
			 var params = [];
			 params.orderId = serviceResponse.orderId;
			 params["storeId"] = CheckoutHelperJS.storeId;
			 params["catalogId"] = CheckoutHelperJS.catalogId;
			 params["langId"] = CheckoutHelperJS.langId;
			 cursor_wait();
			 wc.service.invoke("AjaxPrepareOrderForPaymentSubmit", params);	
		}	
	}		
	/**
	 * Displays the error message returned with the service response and hides the progress bar.
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
* Declares an AJAX service that prepares order information before submitting the order.
* @constructor
*/
wc.service.declare({
	id: "AjaxPrepareOrderForPaymentSubmit",
	actionId: "AjaxPrepareOrderForPaymentSubmit",
	url: "AjaxOrderProcessServiceOrderPrepare",
	formId: ""
	
	/**
	 * If required, sets payment objects 2 and above to null. Triggers the
	 * calculation of order total and payment amounts.
	 * 
	 * @param (object)
	 *            serviceResponse The service response object, which is the JSON
	 *            object returned by the service invocation.
	 */
	,successHandler: function(serviceResponse) {
		cursor_clear();
		//Keep payment object 1 and set all the others to null.
		if(CheckoutPayments.keepPaymentObject1){
			for(var i = 2; i < CheckoutPayments.paymentObjects.length; i++){
				CheckoutPayments.paymentObjects[i] = null;
			}			
		}		
		
		/**
		 * For if Ajax Checkout is enabled, we want to update the total and load the payment snippets
		 * If it's disabled, we'll simply reload the entire page
		 */
		
		if(CheckoutHelperJS.isAjaxCheckOut()){
			CheckoutPayments.getTotalInJSON("loadPaymentSnippet", "PaymentForm", true);		
		}else {

			document.location.href=location.href;
		}	
		
	}
	
	/**
	 * Displays the error message returned with the service response and hides the progress bar.
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
})

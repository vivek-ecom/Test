//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2007, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------
//

/** 
 * @fileOverview This javascript is used by AjaxMyAccountQuickCheckoutProfileForm.jsp and MyAccountQuickCheckoutProfileForm.jsp.
 * @version 1.0
 */

 /* Import dojo classes. */

dojo.require("wc.service.common");
dojo.require("wc.widget.RefreshArea");
	
dojo.require("wc.render.RefreshController");
dojo.require("wc.render.Context");
dojo.require("wc.render.common");

dojo.addOnLoad(function(){
	/* Make sure there is always a render context. */
	if(!wc.render.getContextById("default")){
		wc.render.declareContext("default", {}, "");
	}
	
	QuickCheckoutProfile.declareRefreshAreaController("QuickCheckoutProfileAreaController", "AjaxProfileFormView");
});

/**
 * The functions defined in this class enable the customer to update an existing quickcheckout profile.
 * @class This QuickCheckoutProfile class defines all the functions and variables to manage a quickcheckout profile.
 * A quick address profile can be used to identify shipping addresses, billing addresses, or both shipping and billing addresses when completing the quick checkout process. 
 * The fields that can be entered into the quick checkout profile are first name, last name, street address, city, country/region, state/province, ZIP/postal code, 
 * phone number, e-mail address, payment method, and shipping method.
 */
QuickCheckoutProfile = {
		/* The common parameters used in service calls. */
		langId: "-1",
		storeId: "",
		catalogId: "",
		/* variable set on quickcheckout profile update which is used to display the success message. */   
		pageVar: "aa",
		/** flag to indicate whether the credit card field is updated or not. The value is automatically populated
		 *  by the jsp using the {@link valueChanged} function.
		 *
		 *  @private
		 */
		changed: "false",		
				
	/**
	 * This function initializes common parameters used in all service calls.
	 * @param {int} langId The language id to use.
	 * @param {int} storeId The store id to use.
	 * @param {int} catalogId The catalog id to use.
	 */

	setCommonParameters:function(langId,storeId,catalogId){
		this.langId = langId;
		this.storeId = storeId;
		this.catalogId = catalogId;
		
	},
    
	/**
	 * This function will declare a refreshArea controller if no controller with the same controller ID exits yet. The
	 * declared controller is designed to handle address specific tasks. If user passes a "url" parameter when updating context, it will 
     * replace the value of its own "url" parameter to the one given by the user.
	 * @param {string} controllerId The ID of the controller that is going to be declared.
	 * @param {string} defaultURL The url this controller used for getting data from server. It will be set to controller.url.
	 */

	declareRefreshAreaController: function(controllerId, defaultURL){
		if(wc.render.getRefreshControllerById(controllerId)){
			console.debug("controller with id = "+controllerId+" already exists. No declaration will be done");
			return;
		}
		wc.render.declareRefreshController({
			id: controllerId, 
			renderContext: wc.render.getContextById("default"),
			url: defaultURL,
			renderContextChangedHandler: function(message, widget) {
				console.debug("entering renderContextChangedHandler for "+controllerId);
			
				var controller = this;
				var renderContext = this.renderContext;
				
				if(typeof actionName == "undefined" || !Common.getRenderContextProperty(renderContext, actionName)){
					console.debug("no actionName is specified. This handler will not be called. Exiting...");
					return;	
				}
				
				if(Common.getRenderContextProperty(renderContext, "url")){
					controller.url = Common.getRenderContextProperty(renderContext, "url");
				}
				
				widget.refresh(controller.renderContext.properties);
				
				/* Make sure this handler will always know whether a user gives an addressDisplayAreaAction in the future.*/ 
				delete renderContext.properties[actionName];  
				delete renderContext.properties["url"];
			}, 
			
			modelChangedHandler: function(message, widget){
				console.debug(message);
				widget.refresh(this.renderContext.properties);
				
				cursor_clear();
			}
		});
		
	}, 

	/**
	 * This function is used when the creditcard field is updated by the user.
	 * @param {boolean} value The value assigned to the {@ link changed} variable of the QuickCheckoutProfile class.   
	 */
	valueChanged:function(value){
		QuickCheckoutProfile.changed = value;
	},
	
	/**
	 * This function is used to validate all the quickcheckout profile form input fields.
	 * @param {string} formName The name of the form containing all the information required to create a quick address profile. 
	 * 
	 * @private
	 *
	 * @return {boolean} The validation is successful or not.
	 */
	validateForm:function(formName){
		reWhiteSpace = new RegExp(/^\s+$/);
		var form = document.forms[formName];
		var expiry = null;
		if (form.pay_expire_year != null) {
			expiry = new Date(form.pay_expire_year.value,form.pay_expire_month.value - 1,1);
		}
		var currMonth = form.curr_month.value;
		if (currMonth.length == 1) {
			currMonth = "0" + currMonth;
		} else {
			currMonth = form.curr_month.value;
		}
		
		/** Uses the common validation function defined in AddressHelper class for validating first name, 
		 *  last name, street address, city, country/region, state/province, ZIP/postal code, e-mail address and phone number. 
		 */
		if(!AddressHelper.validateAddressForm(form,"billing_")){return false;}
		if(!AddressHelper.validateAddressForm(form,"shipping_")){return false;}

		if (form.payMethodId.options.length != 0) {
			if (form.pay_temp_account != null && reWhiteSpace.test(form.pay_temp_account.value) || form.pay_temp_account.value == "") {
				  MessageHelper.formErrorHandleClient(form.pay_temp_account.id,MessageHelper.messages["REQUIRED_FIELD_ENTER"]); return false;
			}
			if(QuickCheckoutProfile.changed == 'true')
			{
				form.pay_temp_account.name = 'pay_account';
			}
			else
				QuickCheckoutProfile.changed = 'false';
			/* Checks for a valid credit card expiry date. */
			 if (form.pay_expire_year != null && form.pay_expire_year.value < form.curr_year.value) {
				  MessageHelper.formErrorHandleClient(form.pay_expire_year.id,MessageHelper.messages["INVALID_EXPIRY_DATE"]); return false;
			 }
			 else if ( (form.pay_expire_year != null) && (form.pay_expire_year.value == form.curr_year.value) && (currMonth > form.pay_expire_month.value)) {
				 MessageHelper.formErrorHandleClient(form.pay_expire_month.id,MessageHelper.messages["INVALID_EXPIRY_DATE"]); return false;
			 }
		}
		return true;
	},
	
	/** 
	 * This function loads the current quickcheckout profile.
	 * @param {array} addresses This is a shippingProfile or billingProfile address object.
	 * @param {string} prefix The value is set to shipping or billing.
 	 */
	getCurrentProfile: function(addresses, prefix){
		var firstname = document.getElementById(prefix+"_firstName1");
		var lastname = document.getElementById(prefix+"_lastName1");
		var middleName = document.getElementById(prefix+"_middleName1");
		var address1 = document.getElementById(prefix+"_address11");
		var address2 = document.getElementById(prefix+"_address21");
		var state = document.getElementById(prefix+"_state1");
		var country = document.getElementById(prefix+"_country1");
		var zipCode = document.getElementById(prefix+"_zipCode1");
		var email1 = document.getElementById(prefix+"_email11");
		var phone1 = document.getElementById(prefix+"_phone11");
		var city = document.getElementById(prefix+"_city1");
		firstname.value = addresses.firstName;	
		lastname.value = addresses.lastName;	
		address1.value = addresses.address1;
		address2.value = addresses.address2;
		state.value = addresses.state;	
		if(addresses.country != '')
		country.value = addresses.country;	
		zipCode.value = addresses.zipCode;	
		email1.value = addresses.email1;	
		phone1.value = addresses.phone1;	
		city.value = addresses.city;	
		if(middleName)
			middleName.value = addresses.middleName;
		/* Uses the loadStatesUI function of the AddressHelper class to load the state field depending on the country selection. */
		AddressHelper.loadStatesUI('QuickCheckout',prefix,prefix+'_stateDiv','_state1',true, addresses.state);
	},
	
	/**
	 * This function is used to make the 'payment type' selection.
	 * @param {string} selection The id of the payment method dropdown box.
	 */
	setCCBrand: function(selection){
		var selectedAddressId = selection.options[selection.selectedIndex].value;
	},

	/**
	 * This function is used to show/hide the shipping address div if the 'same as my billing address' checkbox is unchecked/checked.
	 * @param {string} form The name of the form containing all the information required to create a quick address profile.
	 */

	showHide:function(form){
		var sameaddress = document.getElementById("SameShippingAndBillingAddress");
		if (sameaddress.checked){
				hideElementById("shipAddr");
				this.copyBillingAddress(form);
		}
		else{
			showElementById("shipAddr");
			dojo.byId("shipping_firstName1").value = "";
			dojo.byId("shipping_lastName1").value = "";
			dojo.byId("shipping_address11").value = "";
			dojo.byId("shipping_address21").value = "";
			dojo.byId("shipping_city1").value = "";
			dojo.byId("shipping_zipCode1").value = "";
			dojo.byId("shipping_phone11").value = "";
			dojo.byId("shipping_email11").value = "";
			dojo.byId("shipping_state1").value = "";
			if(dojo.byId("shipping_middleName1")) 
				dojo.byId("shipping_middleName1").value = "";
		}
	},
	
	/**
	 * This function makes the shipping same as the billing address.
	 * @param {string} form The name of the quickcheckout profile form.
	 */
	copyBillingAddress:function(form){
			dojo.byId("shipping_firstName1").value = form.billing_firstName.value;
			dojo.byId("shipping_lastName1").value = form.billing_lastName.value;
			dojo.byId("shipping_address11").value = form.billing_address1.value;
			dojo.byId("shipping_address21").value = form.billing_address2.value;
			dojo.byId("shipping_city1").value = form.billing_city.value;
			dojo.byId("shipping_country1").value = form.billing_country.value;
			dojo.byId("shipping_zipCode1").value = form.billing_zipCode.value;
			dojo.byId("shipping_phone11").value = form.billing_phone1.value;
			dojo.byId("shipping_email11").value = form.billing_email1.value;
			if(dojo.byId("shipping_middleName1"))
				dojo.byId("shipping_middleName1").value = form.billing_middleName.value;
			AddressHelper.loadStatesUI('QuickCheckout','shipping','shipping_stateDiv','_state1',true);
			if(dojo.isIE){
			dojo.byId("shipping_state1").value =(document.getElementById("billing_stateDiv").firstChild).value;}
				else{
				dojo.byId("shipping_state1").value = form.billing_state.value;}
			
	},
	
	/**
	 * This function updates the quickcheckout profile when 'AjaxMyAccount' option is disabled in the change flow option for the store.
	 * @param {string} form The name of the form containing all the information required to create a quick address profile.
	 */
	UpdateProfile: function(form){
		var sameaddress = document.getElementById("SameShippingAndBillingAddress");
		if (sameaddress.checked){
			this.copyBillingAddress(form);
		}
		/* validates the form input fields. */
		if(this.validateForm(form.name))
		{
			form.pay_payment_method.value = document.getElementById("payMethodId").value;
			form.pay_cc_brand.value = document.getElementById("payMethodId").value;
			form.pay_payMethodId.value = document.getElementById("payMethodId").value;
			
			/*For Handling multiple clicks. */
			if(!submitRequest()){
				return;
			}
			
			form.submit();
		}
	 }
}

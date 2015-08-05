//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2006, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This javascript is used by the store jsp's related to address creation and maintenance.
 * @version 1.0
 */

/**
 * The functions defined in this class enable address creation across the store.
 * @class The functions and variables defined in this class validate the form input field values entered by 
 * the customer. Another set of functions help in loading the UI for the state field when there is a change
 * in the country field. Another set of functions enable creating an address in the shopcart page and
 * guest user checkout page.
 */

AddressHelper = {
	/* The name of the state field div. */
	stateDivName : "stateDiv",
	/* styling class for the state field. */
	stateClass   : null,
	 
	/**
	 * This function sets the name for the state field.
	 * @param {string} stateDivName The name to be set for the state field.  
	 */
	setStateDivName:function(stateDivName){
		this.stateDivName = stateDivName; 
	 },
	
	 /**
	  * This function sets the styling class for the state field. 
	  * @param {string} stateClass The name of the styling class to be set for the state field. 
	  */
	setStateClass:function(stateClass){
		this.stateClass = stateClass;
	},
	
	
	/** 
	 * This function return an array of countries from a global variable called countries.
	 * If that variable does not already exist then it will be created and populated from a JSON of country objects which should
	 * have been loaded into a div on the page prior to calling this function.
	 *
	 * @returns {Array} countries An array of countries.
	 **/
	 getCountryArray:function()
	{
		
		//If the countries array does not already exist then create it.
		
			if (document["countries"] == null)
			{
				countries = new Array();
				var theDiv = document.getElementById("countryListSelectionHelper");
		
				if (typeof theDiv == 'undefined') return null;
				var divJSON = eval('('+ theDiv.innerHTML +')');
				var countriesObject = divJSON.countries;
				
				for (var i = 0; i < countriesObject.length; i++)
				{
					var countryObject = countriesObject[i];
					countries[countryObject.code] = new Object();
					countries[countryObject.code].name = countryObject.displayName;
					countries[countryObject.code].countryCallingCode = countryObject.callingCode;
					
					if (countryObject.states.length > 0)
					{
						countries[countryObject.code].states = new Object();
						for (var j = 0; j < countryObject.states.length; j++)
						{
							var state = countryObject.states[j];
							countries[countryObject.code].states[state.code] = state.displayName;
						}
					}
				}
			}

			return countries;
			 
	},
	
	
	/**
	 * This function will load the state field depending on the country selection.
	 * @param {string} formName  The name of the address form containing the state field and country field.
	 * @param {string} stateDiv  The name of the state field.
	 * @param {string} id The id of the state field to be created.
	 * @param {boolean} keepCurrentState A true or false value used to determine whether to keep the current value in the state field or to remove it.
	 * @param {string} copyValue The value to be copied to the newly generated state field.
	 */
	loadStatesUI:function(formName,paramPrefix,stateDiv,id, keepCurrentState, copyValue){
		 
		this.getCountryArray();
		var form = document.getElementById(formName);
		if(paramPrefix == null || paramPrefix == 'undefined' || paramPrefix == ""){
			paramPrefix = "";
		}
		var newid = paramPrefix + id;
		var currentState;
		var required;
		if (document.getElementById(newid) != null) {
			required = document.getElementById(newid).getAttribute("aria-required");
		}
		if (keepCurrentState != null && keepCurrentState != 'undefined' && keepCurrentState == true)
		{
			currentState = document.getElementById(newid).value;
		}
		else
		{
			currentState = "";
		}
		
		if(copyValue != null && copyValue != 'undefined' && copyValue != '')
		{
			currentState = copyValue;
		}
		if(id=="_state1"){
		this.setStateClass("form_input");
		var currentCountryCode =form[paramPrefix + "_country"].value;}
		else{
		var currentCountryCode =form[paramPrefix + "country"].value;} 

		var stateDivObj = document.getElementById(stateDiv);
		if(dojo.isIE){
		var stateClass = document.getElementById(newid).getAttribute("className");}/* For IE */
		else {var stateClass=document.getElementById(newid).getAttribute("class")};

		if(stateClass!="drop_down_country")
		this.setStateClass(stateClass);
		 while(stateDivObj.hasChildNodes()) {
			stateDivObj.removeChild(stateDivObj.firstChild);
		}

		if (countries[currentCountryCode].states) {
			/* switch to state list. */
			stateDivObj.appendChild(this.createStateWithOptions(paramPrefix, currentCountryCode, currentState, id, required));
		} else {
			/* switch to state text input. */
			stateDivObj.appendChild(this.createState(paramPrefix, currentState, id, required));
		}
	},
	
	/**
	 *	This function creates an input element to represent the state.
	 *  @param {string} paramPrefix The value can be shipping, billing or blank.
	 *  @param {string} currentState The value in the state field.
	 *  @param {string} id The id of the state field.
	 */
	createState:function(paramPrefix,currentState,id,required){
		var stateInput = document.createElement("input");
		stateInput.setAttribute("id",paramPrefix + id);
		if(id=="_state1"){
		stateInput.setAttribute("name", paramPrefix + "_state");}
		else{
		stateInput.setAttribute("name", paramPrefix + "state");}
		if (required) {
			stateInput.setAttribute("aria-required", "true");
		}
		stateInput.setAttribute("class", this.stateClass);
		stateInput.setAttribute("className",this.stateClass);
		stateInput.setAttribute("size", "35");
		stateInput.setAttribute("maxlength", "49");
		if (currentState != null && currentState != 'undefined')
		{
			stateInput.setAttribute("value", currentState);
		}
		return stateInput;
	},
	
	/**
	 * This function creates a <select> element to represent the state field and loads it with the 
	 * states corresponding to the country field.
     * @param {string} paramPrefix The value can be shipping, billing or blank.
	 * @param {string} currentCountryCode The country code of the selected country.
	 * @param {string} currentState The value in the state field.
	 * @param {string} id The id of the state field.
	 */
	createStateWithOptions:function(paramPrefix, currentCountryCode, currentState, id, required){
		
		this.getCountryArray();
		var stateSelect = document.createElement("select");
		stateSelect.setAttribute("id", paramPrefix + id);
		if(id=="_state1"){
		stateSelect.setAttribute("name", paramPrefix + "_state");}
		else{
		stateSelect.setAttribute("name", paramPrefix + "state");}
		if (required) {
			stateSelect.setAttribute("aria-required", "true");
		}
		stateSelect.setAttribute("class","drop_down_country");
		stateSelect.setAttribute("className","drop_down_country");
		/*clear old options. */
		stateSelect.options.length = 0;
		
		/* add all states. */
		for (state_code in countries[currentCountryCode].states) {
			
			aOption = document.createElement("option");
			stateSelect.options[stateSelect.length] = aOption;
			aOption.text = countries[currentCountryCode].states[state_code];
			aOption.value = state_code;

			if (state_code == currentState || countries[currentCountryCode].states[state_code] == currentState) {
				aOption.selected = true;
			}
		}
		
		return stateSelect;
	},
	
	
	/**
	 * This function validates the address form independently from the order of the fields displayed on the form, i.e. independent from the locale.
	 * A hidden field named "fields" must be set in the jsp/jspf file that calls this method. The purpose of this hidden field is 
	 * to set all the mandatory input fields and the order of these fields displayed on each locale-specific address entry page, so that
	 * this method knows which input fields to validate and in which order it should validate them.
	 *
	 * assumptions:1. Mandatory fields use UPPER CASE, non-mandatory fields use lower case.
	 *	     	   2. The error messages used in this method are declared in the jsp/jspf files that call this method. 
	 * @param {string} form The name of the address form obtained from the page containing address input fields.
	 * @param {string} prefix The value is set to shipping or billing.
	 * 
	 * @return {boolean} return true if no error was found, or the hidden field "fields" were not set in the jsp/jspf file that calls this method,
	 * return false if form could not be found, or if there was an error validating a particular field.
	 */

	validateAddressForm: function(form,prefix){
		reWhiteSpace = new RegExp(/^\s+$/);
		if(prefix == null){prefix = ""};
		if(prefix){this.setStateDivName(prefix + "stateDiv")};
		if(form != null){
			var fields="";
			if(form["AddressForm_FieldsOrderByLocale"] != null && form["AddressForm_FieldsOrderByLocale"].value != null && form["AddressForm_FieldsOrderByLocale"].value != ""){
				fields = form["AddressForm_FieldsOrderByLocale"].value.split(",");
			}
			else if(document.getElementById("AddressForm_FieldsOrderByLocale").value!= null && document.getElementById("AddressForm_FieldsOrderByLocale").value!= ""){
				fields=document.getElementById("AddressForm_FieldsOrderByLocale").value.split(",");
			}
			var nickName = prefix + "nickName";
			var lastName = prefix + "lastName";
			var firstName = prefix + "firstName";
			var middleName = prefix + "middleName";
			var address1 = prefix + "address1";
			var address2 = prefix + "address2";
			var city = prefix + "city";
			var state = prefix + "state";
			var country = prefix + "country";
			var zipCode = prefix + "zipCode";
			var email1 = prefix + "email1";
			var phone1 = prefix + "phone1";
			//Brazil's form fields to validate
			var pay_CPFNumber,taxPayerId,companyName,organizationName;
			if ( typeof(isBrazilStore) != 'undefined' && isBrazilStore) {
				pay_CPFNumber = "pay_CPFNumber";
				taxPayerId = prefix + "taxPayerId"
				companyName = prefix + "companyName";
				organizationName = prefix + "organizationName"; //company's short name
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				if(field == "NICK_NAME" || field == "nick_name"){
					form[nickName].value = trim(form[nickName].value);
					if(field == "NICK_NAME" && (form[nickName].value == "" || reWhiteSpace.test(form[nickName].value))){
						MessageHelper.formErrorHandleClient(form[nickName].id, MessageHelper.messages["ERROR_RecipientEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[nickName].value, 254)){ 
						MessageHelper.formErrorHandleClient(form.nickName.id, MessageHelper.messages["ERROR_RecipientTooLong"]); 
						return false;
					}
				}else if(field == "LAST_NAME" || field == "last_name"){
					form[lastName].value = trim(form[lastName].value);
					if(field == "LAST_NAME" && (form[lastName].value == "" || reWhiteSpace.test(form[lastName].value))){ 
						MessageHelper.formErrorHandleClient(form[lastName].id, MessageHelper.messages["ERROR_LastNameEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[lastName].value, 128)){ 
						MessageHelper.formErrorHandleClient(form[lastName].id, MessageHelper.messages["ERROR_LastNameTooLong"]);
						return false;
					}
				}else if(field == "FIRST_NAME" || field == "first_name"){
					form[firstName].value = trim(form[firstName].value);
					if(field == "FIRST_NAME" && (form[firstName].value == "" || reWhiteSpace.test(form[firstName].value))){ 
						MessageHelper.formErrorHandleClient(form[firstName].id, MessageHelper.messages["ERROR_FirstNameEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[firstName].value, 128)){ 
						MessageHelper.formErrorHandleClient(form[firstName].id, MessageHelper.messages["ERROR_FirstNameTooLong"]); 
						return false;
					}
				}else if(field == "MIDDLE_NAME" || field == "middle_name"){
					form[middleName].value = trim(form[middleName].value);
					if(field == "MIDDLE_NAME" && (form[middleName].value == "" || reWhiteSpace.test(form[middleName].value))){ 
						MessageHelper.formErrorHandleClient(form[middleName].id, MessageHelper.messages["ERROR_MiddleNameEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[middleName].value, 128)){ 
						MessageHelper.formErrorHandleClient(form[middleName].id, MessageHelper.messages["ERROR_MiddleNameTooLong"]); 
						return false;
					}
				}else if(field == "ADDRESS" || field == "address"){
					form[address1].value = trim(form[address1].value);
					form[address2].value = trim(form[address2].value);
					if(field == "ADDRESS" && ((form[address1].value == "" || reWhiteSpace.test(form[address1].value)) && (form[address2].value=="" || reWhiteSpace.test(form[address2].value)))){ 
						MessageHelper.formErrorHandleClient(form[address1].id, MessageHelper.messages["ERROR_AddressEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[address1].value, 100)){ 
						MessageHelper.formErrorHandleClient(form[address1].id, MessageHelper.messages["ERROR_AddressTooLong"]); 
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[address2].value, 50)){ 
						MessageHelper.formErrorHandleClient(form[address2].id, MessageHelper.messages["ERROR_AddressTooLong"]);
						return false;
					}
				}else if(field == "CITY" || field == "city"){
					form[city].value = trim(form[city].value);
					if(field == "CITY" && (form[city].value == "" || reWhiteSpace.test(form[city].value))){ 
						MessageHelper.formErrorHandleClient(form[city].id, MessageHelper.messages["ERROR_CityEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[city].value, 128)){
						MessageHelper.formErrorHandleClient(form[city].id, MessageHelper.messages["ERROR_CityTooLong"]);
						return false;
					}
				}else if(field == "STATE/PROVINCE" || field == "state/province"){
					var state = form[state];
					if(state == null || state == ""){
						state = document.getElementById(this.stateDivName).firstChild;
					}
					state.value = trim(state.value);
					if(field == "STATE/PROVINCE" && (state.value == null || state.value == "" || reWhiteSpace.test(state.value))){
						MessageHelper.formErrorHandleClient(state.id, MessageHelper.messages["ERROR_StateEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(state.value, 128)){
						MessageHelper.formErrorHandleClient(state.id, MessageHelper.messages["ERROR_StateTooLong"]);
						return false;
					}
				}else if(field == "COUNTRY/REGION" || field == "country/region"){
					form[country].value = trim(form[country].value);
					if(field == "COUNTRY/REGION" && (form[country].value == "" || reWhiteSpace.test(form[country].value))){ 
						MessageHelper.formErrorHandleClient(form[country].id, MessageHelper.messages["ERROR_CountryEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[country].value, 128)){ 
						MessageHelper.formErrorHandleClient(form[country].id, MessageHelper.messages["ERROR_CountryTooLong"]);
						return false;
					}
				}else if(field == "ZIP" || field == "zip"){
					form[zipCode].value = trim(form[zipCode].value);
                    //check Brazil store CEP code ( like zip code ) for validation
					if ( typeof(isBrazilStore) != 'undefined' && isBrazilStore) {
						//see if CEP# is empty
						if(field == "ZIP" && (form[zipCode].value=="" || reWhiteSpace.test(form[zipCode].value))){ 
							MessageHelper.formErrorHandleClient(form[zipCode].id, MessageHelper.messages["ERROR_CEPNumberEmpty"]);
							return false;
						}
						//see if CEP# is longer than 9 characters
						if(!MessageHelper.isValidUTF8length(form[zipCode].value, 9)){ 
							MessageHelper.formErrorHandleClient(form[zipCode].id, MessageHelper.messages["ERROR_CEPNumberTooLong"]);
							return false;
						}
						//see if CEP# is between 8 - 9 characters
						if((MessageHelper.utf8StringByteLength(form[zipCode].value) != 8) &&
						   (MessageHelper.utf8StringByteLength(form[zipCode].value) != 9) ){ 
							MessageHelper.formErrorHandleClient(form[zipCode].id, MessageHelper.messages["ERROR_CEPNumberInvalid"]); 
							return false;
						}
					}else{
	                    //check Madisons zip code for validation
						if(field == "ZIP" && (form[zipCode].value=="" || reWhiteSpace.test(form[zipCode].value))){ 
							MessageHelper.formErrorHandleClient(form[zipCode].id, MessageHelper.messages["ERROR_ZipCodeEmpty"]);
							return false;
						}
						if(!MessageHelper.isValidUTF8length(form[zipCode].value, 40)){ 
							MessageHelper.formErrorHandleClient(form[zipCode].id, MessageHelper.messages["ERROR_ZipCodeTooLong"]);
							return false;
						}
					};			
                       //check Brazil's Consumer or Business fields for validation
				}else if((typeof(isBrazilStore) != 'undefined' && isBrazilStore) && (field == "CPF_NUMBER" || field == "cpf_number")){
					if (form["consumerRegistration"] != null && form["consumerRegistration"].checked){//consumer registration, check CPF#
						form[pay_CPFNumber].value = trim(form[pay_CPFNumber].value);
						if(field == "CPF_NUMBER" && (form[pay_CPFNumber].value == "" || reWhiteSpace.test(form[pay_CPFNumber].value))){ 
							MessageHelper.formErrorHandleClient(form[pay_CPFNumber].id, MessageHelper.messages["ERROR_CPFNumberEmpty"]);
							return false;
						}
						if((MessageHelper.utf8StringByteLength(form[pay_CPFNumber].value) != 11) ||
							!MyBrazilAccountDisplay.isValidCpf(form[pay_CPFNumber].value)){ 
							MessageHelper.formErrorHandleClient(form[pay_CPFNumber].id, MessageHelper.messages["ERROR_CPFNumberInvalid"]); 
							return false;
						}
					}else{//Business registration, check CNPJ#, companyname and CompanyShort name
                        //note:CPF field is shared with CNPJ#, only label is different on UI, same input field						
						form[pay_CPFNumber].value = trim(form[pay_CPFNumber].value);
						//validate CNPJ /CGC #
						if(field == "CPF_NUMBER" && (form[pay_CPFNumber].value == "" || reWhiteSpace.test(form[pay_CPFNumber].value))){ 
							MessageHelper.formErrorHandleClient(form[pay_CPFNumber].id, MessageHelper.messages["ERROR_CNPJNumberEmpty"]);
							return false;
						}
						if(MessageHelper.utf8StringByteLength(form[pay_CPFNumber].value) > 14){ //longer number, 14
							MessageHelper.formErrorHandleClient(form[pay_CPFNumber].id, MessageHelper.messages["ERROR_CNPJNumberToLong"]); 
							return false;
						}
						if((MessageHelper.utf8StringByteLength(form[pay_CPFNumber].value) != 14) ||
						   !MyBrazilAccountDisplay.isValidCnpj(form[pay_CPFNumber].value)){ 
							MessageHelper.formErrorHandleClient(form[pay_CPFNumber].id, MessageHelper.messages["ERROR_CNPJNumberInvalid"]); 
							return false;
						}
						//validate company name, can't be blank
						form[companyName].value = trim(form[companyName].value);
						if(form[companyName].value == "" || reWhiteSpace.test(form[companyName].value)){ 
							MessageHelper.formErrorHandleClient(form[companyName].id, MessageHelper.messages["ERROR_CompanyNameEmpty"]);
							return false;
						}
						if(!MessageHelper.isValidUTF8length(form[companyName].value, 80)){
							MessageHelper.formErrorHandleClient(form[companyName].id, MessageHelper.messages["ERROR_CompanyNameTooLong"]); 
							return false;
						}
						//validate company's short name, can't be blank
						form[organizationName].value = trim(form[organizationName].value);
						if(form[organizationName].value == "" || reWhiteSpace.test(form[organizationName].value)){ 
							MessageHelper.formErrorHandleClient(form[organizationName].id, MessageHelper.messages["ERROR_CompanyShortNameEmpty"]);
							return false;
						}
					}					
				
				}else if(field == "EMAIL1" || field == "email1"){
					form[email1].value = trim(form[email1].value);
					if(field == "EMAIL1" && (form[email1].value == "" || reWhiteSpace.test(form[email1].value))){
						MessageHelper.formErrorHandleClient(form[email1].id, MessageHelper.messages["ERROR_EmailEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[email1].value, 256)){ 
						MessageHelper.formErrorHandleClient(form[email1].id, MessageHelper.messages["ERROR_EmailTooLong"]);
						return false;
					}
					if(!MessageHelper.isValidEmail(form[email1].value)){
						MessageHelper.formErrorHandleClient(form[email1].id, MessageHelper.messages["ERROR_INVALIDEMAILFORMAT"]);
						return false;
					}
				}else if(field == "PHONE1" || field == "phone1"){
					form[phone1].value = trim(form[phone1].value);
					if(field == "PHONE1" && (form[phone1].value == "" || reWhiteSpace.test(form[phone1].value))){
						MessageHelper.formErrorHandleClient(form[phone1].id, MessageHelper.messages["ERROR_PhonenumberEmpty"]);
						return false;
					}
					if(!MessageHelper.isValidUTF8length(form[phone1].value, 32)){ 
						MessageHelper.formErrorHandleClient(form[phone1].id, MessageHelper.messages["ERROR_PhoneTooLong"]);
						return false;
					}
					if(!MessageHelper.IsValidPhone(form[phone1].value)){
						MessageHelper.formErrorHandleClient(form[phone1].id, MessageHelper.messages["ERROR_INVALIDPHONE"]);
						return false;
					}
				}else{
					console.debug("error: mandatory field name " + mandatoryField + " is not recognized.");
					return false;
				}
			}
			if (form[address1].value == "" && form[address2].value != "") {
		
			form[address1].value = form[address2].value;
			form[address2].value = "";
			}
			if(typeof(isBrazilStore) != 'undefined' && isBrazilStore){
				if (form["consumerRegistration"] != null && form["consumerRegistration"].checked){ 
				//registered as a consumer, clear out the Business fields
				form[companyName].value = "";
				form[organizationName].value = "";
				form[taxPayerId].value = "";
				}
			}
			return true;  
		}
		return false; 
	},
	
	/**
	 * This function saves the address entry form when a registered customer wants to edit/add a new address 
	 * during checkout from  his/her shopping cart.
	 * @param {string} The id of the service that was invoked, e.g. AjaxUpdateAddressForPerson, AjaxAddAddressForPerson, etc.
	 * @param {string} The name of the form containing address information.
	 */
	
	saveShopCartAddress: function(serviceId, formName){
		var form = document.forms[formName];
		if(form.addressType != null && form.addressType.value == 'ShippingAndBilling'){
			serviceId = 'AjaxAddShippingAndBillingAddressForPersonDuringCheckout';
		}
		if(this.validateAddressForm(form)){
			this.saveAddress(serviceId, formName);
		}
	},
	
	
	/**
	 * This function saves the address entry form on an unregistered user's checkout page.
	 * @param {string} formName1 The name of the billing address form.
	 * @param {string} formName2 The name of the shipping address form.
	 * @param {string} stateDivName1 The name of the state field in the billing address form.
	 * @param {string} stateDivName2 The name of the state field in the shipping address form.
	 */
	
	saveUnregisteredCheckoutAddress: function(formName1, formName2, stateDivName1, stateDivName2)
	{
		var form1 = document.forms[formName1];
		
		this.setStateDivName(stateDivName1);
		/*Validate form input fields */
		if(this.validateAddressForm(form1))
		{
			var sameaddress = document.getElementById("SameShippingAndBillingAddress");
			if (!sameaddress.checked)
			{
				var form2 = document.forms[formName2];
				this.setStateDivName(stateDivName2);
				/*Validate form input fields */
				if(this.validateAddressForm(form2))
				{
					this.saveAddress('AddBillingAddress', 'billingAddressCreateEditFormDiv_1');
				}
			}
			else
			{
				form1.addressType.value='ShippingAndBilling';
				this.saveAddress('AddShippingAddress', 'billingAddressCreateEditFormDiv_1');
			}
		}
	},
	
	/**
	 * This function saves an address entry form to the associated service.
	 * @param {string} serviceId The id of the service that was invoked, e.g. AjaxUpdateAddressForPerson, AjaxAddAddressForPerson, etc. 
	 * @param {string} formName The name of the form containing address information.
	 */
	
	saveAddress:function(serviceId, formName) {
		var form = document.forms[formName];
		if (form.address1.value == "" && form.address2.value != "") {
			form.address1.value = form.address2.value;
			form.address2.value = "";
		}
	 	var addressService = wc.service.getServiceById(serviceId);
	 	addressService.formId = formName;
		/* For Handling multiple clicks */
		if(!submitRequest()){
			return;
		}   	 	
	 	cursor_wait();
	 	wc.service.invoke(serviceId);
	},
	
	/**
	 * This function calls UpdateOrderItem/AjaxUpdateOrderItem service to update order calculation
	 */
	
	updateOrderAfterAddressUpdate:function() {
		var params = [];
		params["storeId"] = this.storeId;
		params["catalogId"] = this.catalogId;
		params["langId"] = this.langId;
		params.calculationUsage = "-1,-2,-3,-4,-5,-6,-7";
		params.orderId = ".";
			
	 	cursor_wait();
	 	wc.service.invoke("AjaxUpdateOrderAfterAddressUpdate", params);
	},

	/**
	 *  This function populates the country code to mobile phone based on the selected country.
	 *  @param {string} countryDropDownId The id of the mobile country drop down list
	 *  @param {string} countryCallingCodeId The id of the mobile country calling code text box.
	 */
	
	loadCountryCode:function(countryDropDownId,countryCallingCodeId){
	this.getCountryArray();
	var countryCode = document.getElementById(countryDropDownId).value;
	document.getElementById(countryCallingCodeId).value = countries[countryCode].countryCallingCode;
	},
	
	/**
	 *  This function checks for an entry in the Mobile Phone Number field. 
	 *  If a Mobile Phone number has been entered, it enables the SMS Notifications/Promotions checkbox,
	 *  else it disables the SMS Notifications/Promotions checkbox.
	 *  @param {string} form The name of the form containing the Mobile Phone Number entry field.
	 */
	enableSMSNotifications:function(form){
	var form = document.forms[form];
	if(form.mobilePhone1.value != ""){
		form.sendMeSMSNotification.disabled = false;
		form.sendMeSMSPreference.disabled = false;
	 }
	 else{
		 form.sendMeSMSNotification.disabled = true;
		 form.sendMeSMSPreference.disabled = true;
		 form.sendMeSMSNotification.checked = false;
		 form.sendMeSMSPreference.checked = false;
	 }
  },
	/**
	 * Sets the address type when a user wants to add a new address of type shipping and billing during order check out.
	 * @param {Object} checkbox The HTML checkbox input object.
	 * @param {Object} form The form that contains the new address information.
	 */
	setAddressTypeInCreatingNewAddressDuringCheckout: function(checkbox, form){
		if(form.addressType != null && form.originalAddressType != null){
			if(checkbox.checked){
				form.addressType.value = 'ShippingAndBilling';
			}else{
				form.addressType.value = form.originalAddressType.value;
			}
		}
	}
}

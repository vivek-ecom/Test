//<%--
//********************************************************************
//*-------------------------------------------------------------------
//* Licensed Materials - Property of IBM
//*
//* WebSphere Commerce
//*
//* (c) Copyright IBM Corp.  2008, 2009
//* All Rights Reserved
//*
//* US Government Users Restricted Rights - Use, duplication or
//* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
//*
//*-------------------------------------------------------------------
//*
//--%>

/** 
 * @fileOverview This file is to be included in pages that use the CatalogEntryInventoryStatusDetails.jspf. 
 * It prepares all the code required for the "item availability for physical store" section.
 */
 

	// make the pop-up window movable
	dojo.require("dojo.dnd.move");
	dojo.require("dijit.Dialog");
	
	/** the moveable handle for the store details pop up */
	var invDialog; 
	
	/** the path to retrieve the store images such as Available.gif, Bacorderable.gif and others */
	var storeImgPath; 
	
	/** the filename extension for the images that will be use for displaying inventory status such as Available.gif, Bacorderable.gif and others */
	var imageFileExtension; 
	
	/** the current catalog entry id used to identify a section in  bundle page where there are multiple inventory detail sections */
	var currentCatentryId; 
	
	/** the number of SKUs in the product display page */
	var numberOfSKUs; 
	
	/** maximum number of stores supported to display availability for */
	var maxStores = PhysicalStoreCookieJS.arrayMaxSize; 

	/**
	* initializes inventory pop-up window object that displays inventory availability of a product
	*/	
	var initInvPopup = function(){
		invDialog = new dojo.dnd.Moveable("store_availability_popup", {handle: "invPopupHeader"});
	};
	dojo.addOnLoad(initInvPopup);
	
	/** 
	* Sets the current catentryId in order to identify the sections on a bundle page
	* @param {String} catentryId A catalog entry id	
	*/
	function setCurrentCatentryId(catentryId) {
		currentCatentryId = catentryId;
	}
	
	/** 
	* Sets the number of SKUs in the product display page
	* @param {int} inNumberOfSKUs The number of SKUs in the product display page	
	*/
	function setNumberOfSKUs(inNumberOfSKUs) {
		numberOfSKUs = inNumberOfSKUs;
	}
	
	/** 
	* Gets the item ID of the catentry which we need to find out inventory information about.
	* This function resolves the proper SKU if the product has defining attributes and the shopper
	* has properly selected some attributes.
	* @param {String} entitledItemId name of DIV element containing the product and items information
	*                                for a catalog entry. The DIV must contain the information in JSON
	*                                format. To see the expected JSON format, see the 
	*                                "entitledItem_<catalogentryId>" in the generated HTML source. 
	* @return {String} catalogEntryId item ID
	*/
	function getItemId(entitledItemId)
	{	
		var entitledItemJSON = eval('('+ dojo.byId(entitledItemId).innerHTML +')');
		categoryDisplayJS.setEntitledItems(entitledItemJSON);
		var catalogEntryId = categoryDisplayJS.getCatalogEntryId();
		return catalogEntryId;
	}
	
	/** 
	* Gets the item ID of the catentry which we need to find out inventory information about.
	* This function resolves the proper SKU for a product inside a bundle that has defining attributes and 
	* the shopper has properly selected some attributes.
	* @param {String} bundleProductId the product id of the product inside the bundle 
	* @return {String} catalogEntryId item ID
	*/
	function getItemIdForBundleProduct(bundleProductId)
	{	
		var catalogEntryId = categoryDisplayJS.getCatalogEntryIdforBundleProduct(bundleProductId, categoryDisplayJS.selectedProducts[bundleProductId]);
		return catalogEntryId;
	}
	
	
	/** 
	* Get the inventory detail information for a product. This function makes AJAX call to the Commerce server 
	* to gather all the inventory details. The information is then processed by the populateInvDetails function
	* in order to display the information in the product display page.
	* @param {String} catentryId The catalog entry id of the product inventory section
	* @param {String} itemId The itemId of the product that we will check inventory for
	* @param {String} storeId The store id
	* @param {String} langId The language id
	* @param {String} catalogId The catalog id
	* @param {String} storeImagePath The path where the inventory status images are located (i.e. where the Available.gif, Bacorderable.gif and others)
	* @param {String} inImageFileExtension The extension for the inventory status images (i.e. pass ".png" if your image is called Available.png). Defaults to ".gif".
	* @param {Object} event The mouse event
	*/
	function retrieveInvDetailsFromServer(catentryId,itemId,storeId,langId, catalogId, storeImagePath, inImageFileExtension, event) {
			storeImgPath = storeImagePath;
			imageFileExtension = inImageFileExtension;
			if (imageFileExtension == null || imageFileExtension == "") {
				imageFileExtension = ".gif";
			}
			if (catentryId == null) {
				catentryId = "";
			}
			setCurrentCatentryId(catentryId);
			MessageHelper.hideAndClearMessage();
			
			var parameters = {};
			parameters.storeId = storeId;
			parameters.langId=langId;
			parameters.catalogId=catalogId;
			parameters.itemId=itemId;
			
			dojo.publish("ajaxRequestInitiated");
			dojo.xhrPost({
					url: "GetCatalogEntryInventoryData",
					handleAs: "json-comment-filtered",
					content: parameters,
					service: this,
					load: populateInvDetails,
					error: function(errObj,ioArgs) {
						MessageHelper.displayErrorMessage(MessageHelper.messages["INV_STATUS_RETRIEVAL_ERROR"]);
						dojo.publish("ajaxRequestCompleted");
					}
			});
	}
	
	/**
	* Populate the contents of the inventory details section in the product display page with the JSON returned 
	* from the server. This is the callback function that is called after the AJAX call to get the inventory 
	* details successfully returns to the client.
	* @param {Object} serviceResponse response object from dojo.xhrPost
	* @param {dojo.__IoCallbackArgs} ioArgs Argument to the IO call from dojo.xhrPost
	*/
	function populateInvDetails(serviceResponse, ioArgs) {
		if(!!serviceResponse.onlineInventory) {
			// update the online store inventory availability status
			var onlineInventoryStatus = "";
			if (serviceResponse.onlineInventory.name == null) {
				onlineInventoryStatus = serviceResponse.onlineInventory;
			} else {
				onlineInventoryStatus = serviceResponse.onlineInventory.name;
			}
			var onlineStoreInvStatusImg = document.getElementById('onlinestore_inventory_status_image_' + currentCatentryId);
			if (onlineStoreInvStatusImg != null && onlineStoreInvStatusImg != "undefined") {
				onlineStoreInvStatusImg.src = storeImgPath+onlineInventoryStatus+imageFileExtension;
			}
				
			var onlineStoreInvStatus = document.getElementById('onlinestore_inventory_status_' + currentCatentryId);
			if (onlineStoreInvStatus != null && onlineStoreInvStatus != "undefined") {
				if (onlineInventoryStatus == "Available") {
					onlineStoreInvStatus.innerHTML = message_Available;
				} else if (onlineInventoryStatus == "Backorderable") {
					onlineStoreInvStatus.innerHTML = message_Backorderable;	
				} else if (onlineInventoryStatus == "Unavailable") {
					onlineStoreInvStatus.innerHTML = message_Unavailable;
				}
			}
		}
			
		// finds inventory status of this physical store
		var numStoresToPopulate = PhysicalStoreCookieJS.getNumStores();
		storeInvArray = createPhysicalStoreInvArray(serviceResponse, numStoresToPopulate);
		for (i=0; i<numStoresToPopulate; i++) {
			// find inventory status of this store
			var currentStoreRecord;

			for (j=0; j<storeInvArray.length; j++) {
				if (storeInvArray[j].id == serviceResponse.physicalStores[i].physicalStoreIdentifier.uniqueID) {
					currentStoreRecord = storeInvArray[j];
					break;
				}
			}
					
			// populates pop-up data
			var storeInvStatusImg = document.getElementById('store_inv_status_img_' + i + '_' + currentCatentryId);
			if (storeInvStatusImg != null && storeInvStatusImg != "undefined") {
				storeInvStatusImg.src = storeImgPath+currentStoreRecord.inventoryStatus+imageFileExtension;
			}
			
			var storeNameLink = document.getElementById('store_inv_status_link_' + i + '_' + currentCatentryId);
			if (storeNameLink != null && storeNameLink != "undefined") {
				storeNameLink.innerHTML = serviceResponse.physicalStores[i].description[0].name;
				storeNameLink.href = "#";
				//Must dynamically set the onclick event as follows for IE6                     
				storeNameLink.onclick = new Function("showPhysicalStoreDetailsPopup('"+currentStoreRecord.id+"'); return false;");
			}

			var storeInvStatusText = document.getElementById('store_inv_status_' + i + '_' + currentCatentryId);
			if (storeInvStatusText != null && storeInvStatusText != "undefined") {
				storeInvStatusText.innerHTML = currentStoreRecord.inventorySimple;
			}
			
			var storeInvStatusSection = document.getElementById('store_inv_status_p_' + i + '_' + currentCatentryId);
			if (storeInvStatusSection != null && storeInvStatusSection != "undefined") {
				storeInvStatusSection.style.display = "block";
			}
		}
		var storeShowAvail=document.getElementById('storeShowAvail_' + currentCatentryId);
		if (storeShowAvail != null && storeShowAvail != "undefined") {
			if (numberOfSKUs > 1) {
				storeShowAvail.style.display="block";
			} else {
				storeShowAvail.style.display="none";
			}
		}
		
		var storeSearchAgain=document.getElementById('storeSearchSection_' + currentCatentryId);
		if (storeSearchAgain != null && storeSearchAgain != "undefined") {
			storeSearchAgain.style.display="block";
		}
		
		var onlineAvailabilityMessage=document.getElementById('online_availability_message_' + currentCatentryId);
		if (onlineAvailabilityMessage != null && onlineAvailabilityMessage != "undefined") {
			onlineAvailabilityMessage.style.display="block";
		}
		var onlineAvailabilityInventorySection=document.getElementById('online_availability_inventory_section_' + currentCatentryId);
		if (onlineAvailabilityInventorySection != null && onlineAvailabilityInventorySection != "undefined") {
			onlineAvailabilityInventorySection.style.display="block";
		}
		var instoreAvailabilityMessage=document.getElementById('instore_availability_message_' + currentCatentryId);
		if (instoreAvailabilityMessage != null && instoreAvailabilityMessage != "undefined") {
			instoreAvailabilityMessage.style.display="block";
		}
		dojo.publish("ajaxRequestCompleted");
	}
	
	/**
	* Creates an array of PhysicalStoreInventoryRecord objects for the physical stores that are in the shopper's
	* store list saved in the browser's cookie.
	* A PhysicalStoreInventoryRecord object contains the following attributes:
	*  id: physical store id
	*  inventoryDetailed: a string containing the detailed information of the inventory status for this physical store
	*  inventorySimple: a string showing the inventory status
	*  physicalStoreDetails: an object containing the detailed information of a physical store and its attributes
	* 
	* @param {Object} serviceResponse Response object from dojo.xhrPost
	* @param {String} numStoresToPopulate Number of stores in the cookie
	* 
	* @return {Array} PhysicalStoreInventoryRecord[] An array of physical store inventory details object.
	*/
	function createPhysicalStoreInvArray(serviceResponse, numStoresToPopulate) {
		var storeInvArray = new Array();
		for (i=0; i<numStoresToPopulate; i++) {
			var storeRec = new Object();

			storeRec.id = serviceResponse.storeInventory[i].store;
			for (k=0;k<serviceResponse.physicalStores.length;k++) {
				if (serviceResponse.physicalStores[k].physicalStoreIdentifier.uniqueID == storeRec.id) {
					storeRec.physicalStoreDetails = serviceResponse.physicalStores[k];
					break;
				}
			}
			
			// inventory status can be of type enumeration or string, check if it is a enumeration. 
			// If so get it from inventoryStatus.name, if it is a string, just get the data from inventoryStatus
			if (serviceResponse.storeInventory[i].inventoryStatus.name == null) {
				storeRec.inventoryDetailed = serviceResponse.storeInventory[i].inventoryStatus;
			} else {
				storeRec.inventoryDetailed = serviceResponse.storeInventory[i].inventoryStatus.name;
			}
			
			storeRec.inventoryStatus = storeRec.inventoryDetailed;
			if (storeRec.inventoryDetailed == "Available") {
				// if inventory status is available, check if the service returns quantity available, if so, display it as well
				storeRec.inventoryDetailed = message_Available;
				storeRec.inventorySimple = storeRec.inventoryDetailed;
				var quantityAvailable = serviceResponse.storeInventory[i].availableQuantity.value;
				if (quantityAvailable != null) {
					storeRec.inventoryDetailed = storeRec.inventoryDetailed + " (" + quantityAvailable + ")";
				}

			} else if (storeRec.inventoryDetailed == "Backorderable") {
				// if inventory status is backordered, check if the service returns product availability date, if so, display it as well
				storeRec.inventoryDetailed = message_Backorderable;
				storeRec.inventorySimple = storeRec.inventoryDetailed;
				var dateAvailable = serviceResponse.storeInventory[i].availabilityDateTime;
				if (dateAvailable != "null") {
					storeRec.inventoryDetailed = storeRec.inventoryDetailed + " (" + dateAvailable + ")";
				}
				
			} else if (storeRec.inventoryDetailed == "Unavailable") {
				storeRec.inventoryDetailed = message_Unavailable;
				storeRec.inventorySimple = storeRec.inventoryDetailed;
			}
			storeInvArray.push(storeRec);	
		}
		return storeInvArray;
	}

	/**
	* Shows the physical store inventory details pop-up.
	* param {String} physicalStoreId The physical store id
	* param {Object} event The mouse event
	*/
	function showPhysicalStoreDetailsPopup(physicalStoreId, event){
		if(event == null || (event != null && event.type!="keypress") || (event != null && event.type=="keypress" && event.keyCode==dojo.keys.ENTER)){
			
			resetPhysicalStoreDetails();
			
			dijit.byId('store_availability_popup').closeButtonNode.style.display='none';
			dijit.byId('store_availability_popup').show();
			
			// hides the DialogUnderlayWrapper component, the component that grays out the screen behind,
			// as we do not want the background to be greyed out
			dojo.query('.dijitDialogUnderlayWrapper', document).forEach(function(tag) {		
				tag.style.display='none';
			});
			
			populatePhysicalStoreDetails(physicalStoreId);
		}
	}

	/**
	* Populates the physical store inventory details pop up. It assumes that the storeInvArray is already populated
	* with the infromation from the server.
	* @param {String} physicalStoreId The physical store id
	*/
	function populatePhysicalStoreDetails(physicalStoreId){
		var currentStoreRecord;
		
		for (j=0; j<storeInvArray.length; j++) {
			if (storeInvArray[j].id == physicalStoreId) {
				currentStoreRecord = storeInvArray[j];
				break;
			}
		}
		
		// populates pop-up data
		var storeNameLink = document.getElementById('storeDetailsStoreName');
		if (storeNameLink != null && storeNameLink != "undefined") {
			storeNameLink.innerHTML = currentStoreRecord.physicalStoreDetails.description[0].name;
		}
		
		var storeDetailsStreetAddress = document.getElementById('storeDetailsStreetAddress');
		if (storeDetailsStreetAddress != null && storeDetailsStreetAddress != "undefined") {
			storeDetailsStreetAddress.innerHTML = currentStoreRecord.physicalStoreDetails.locationInfo.address.addressLine;
		}
		
		var storeDetailsCityStateZip = document.getElementById('storeDetailsCityStateZip');
		if (storeDetailsCityStateZip != null && storeDetailsCityStateZip != "undefined") {
			storeDetailsCityStateZip.innerHTML = currentStoreRecord.physicalStoreDetails.locationInfo.address.city + ", " + currentStoreRecord.physicalStoreDetails.locationInfo.address.stateOrProvinceName + ", " + currentStoreRecord.physicalStoreDetails.locationInfo.address.postalCode;
		}
		
		var storeDetailsCountry = document.getElementById('storeDetailsCountry');
		if (storeDetailsCountry != null && storeDetailsCountry != "undefined") {
			storeDetailsCountry.innerHTML = currentStoreRecord.physicalStoreDetails.locationInfo.address.country;
		}
		
		var storeDetailsPhoneNumber = document.getElementById('storeDetailsPhoneNumber');
		if (storeDetailsPhoneNumber != null && storeDetailsPhoneNumber != "undefined") {
			storeDetailsPhoneNumber.innerHTML = currentStoreRecord.physicalStoreDetails.locationInfo.telephone1.value;
		}
		
		var storeInvStatusImg = document.getElementById('storeDetailsInvStatusImg');
		if (storeInvStatusImg != null && storeInvStatusImg != "undefined") {
			storeInvStatusImg.src = storeImgPath+currentStoreRecord.inventoryStatus+imageFileExtension;
		}
		
		var storeInvStatusText = document.getElementById('storeDetailsInvStatus');
		if (storeInvStatusText != null && storeInvStatusText != "undefined") {
			storeInvStatusText.innerHTML = currentStoreRecord.inventoryDetailed;
		}
		
		var storeHours = document.getElementById('storeDetailsHours');
		if (storeHours != null && storeHours != "undefined") {
			for (var k=0; k<currentStoreRecord.physicalStoreDetails.attribute.length; k++) {
				if (currentStoreRecord.physicalStoreDetails.attribute[k].name == "StoreHours") {
					storeHours.innerHTML = currentStoreRecord.physicalStoreDetails.attribute[k].displayValue;
				}
			}
		}
		setTimeout(dojo.hitch(this,"invGobackFocus"),200);
		invGobackFocus();//set the default focus to the Close button
	}

	/**
	* On pressing Tab key on the last focusable element in the "Physical Store Inventory Details" pop-up, the focus is 
	* transferred to the Close button.
	*/
	function invGobackFocus() {
		document.getElementById('closeInvLink').focus();
	}
	
	/**
	* On pressing Shift+Tab keys, the focus is tranferred from Close button to the last focusable element present in 
	* the "Physical Store Inventory Details" pop-up.
	* @param {Object} event Event object
	*/
	function invSetbackFocus(event) {
		if(event.shiftKey && event.keyCode == dojo.keys.TAB)
		{
			document.getElementById('closeInvLink').focus();
			
			dojo.stopEvent(event);
		}
	}
	
	/**
	* Reset all contents of the physical store inventory details pop up because it is re-used for all physical stores in the product page.
	*/
	function resetPhysicalStoreDetails() {
		// reset pop-up data
		var storeNameLink = document.getElementById('storeDetailsStoreName');
		if (storeNameLink != null && storeNameLink != "undefined") {
			storeNameLink.innerHTML = "";
		}
		
		var storeDetailsStreetAddress = document.getElementById('storeDetailsStreetAddress');
		if (storeDetailsStreetAddress != null && storeDetailsStreetAddress != "undefined") {
			storeDetailsStreetAddress.innerHTML = "";
		}
		
		var storeDetailsCityStateZip = document.getElementById('storeDetailsCityStateZip');
		if (storeDetailsCityStateZip != null && storeDetailsCityStateZip != "undefined") {
			storeDetailsCityStateZip.innerHTML = "";
		}
		
		var storeDetailsCountry = document.getElementById('storeDetailsCountry');
		if (storeDetailsCountry != null && storeDetailsCountry != "undefined") {
			storeDetailsCountry.innerHTML = "";
		}
		
		var storeDetailsPhoneNumber = document.getElementById('storeDetailsPhoneNumber');
		if (storeDetailsPhoneNumber != null && storeDetailsPhoneNumber != "undefined") {
			storeDetailsPhoneNumber.innerHTML = "";
		}
		
		var storeInvStatusImg = document.getElementById('storeDetailsInvStatusImg');
		if (storeInvStatusImg != null && storeInvStatusImg != "undefined") {
			storeInvStatusImg.src = "";
		}
		
		var storeInvStatusText = document.getElementById('storeDetailsInvStatus');
		if (storeInvStatusText != null && storeInvStatusText != "undefined") {
			storeInvStatusText.innerHTML = "";
		}
		
		var storeHours = document.getElementById('storeDetailsHours');
		if (storeHours != null && storeHours != "undefined") {
			storeHours.innerHTML = "";
		}
	}
	
	/**
	* Hide the physical store inventory details pop up.
	* @param {String} id The id of the pop up
	* @param {Object} event The mouse event
	*/
	function hidePhysicalStoreDetailsPopup(id,event){
		if(event!=null && event.type=="keypress" && event.keyCode!=dojo.keys.ESCAPE){
			return;
		}else{
			var storeDetailsPopup = dijit.byId(id);
			if(storeDetailsPopup != null){
				storeDetailsPopup.hide();
			}
		}
	}

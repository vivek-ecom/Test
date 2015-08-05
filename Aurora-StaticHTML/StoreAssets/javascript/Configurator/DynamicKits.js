//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

if(typeof(DynamicKits) == "undefined" || !DynamicKits || !DynamicKits.topicNamespace){
DynamicKits = {
		
	/**
	 * add a preconfiguration of a dynamic kit to cart
	 * @param {object} preconfiguration a JSON object representing the dynamic kit configuration
	 */	
	addPreconfigurationToCart:function (preconfiguration) {
		
		var params = {};
		params["catEntryId_1"] = preconfiguration.catEntryId_1;
		params["quantity_1"] =  preconfiguration.quantity_1
		for (i=0;i<preconfiguration.components.length; i++) {
			params["componentCatEntryId_1_"+(i+1)] = preconfiguration.components[i]["componentCatEntryId_1_"+(i+1)];
			params["componentQuantity_1_"+(i+1)] = preconfiguration.components[i]["componentQuantity_1_"+(i+1)];
		}
		                     
		if(!submitRequest()){
			return;
		}			
		cursor_wait();
		wc.service.invoke('AjaxOrderChangeServiceAddOrderItemWithComponents',params);		
	}

}}
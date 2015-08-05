//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2008, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

	/** 
	 * @fileOverview This file contains all the global variables and JavaScript functions needed by the compare product page and the compare zone. 
	 */

	/**
	 * @class The functions defined in the class are used for comparing products. 
	 *
	 * This compareProductJS class defines all the variables and functions for the page that uses the comparison functionality in the store.
	 * The compare zone in the right side bar is a place holder that accepts a maximum of 4 products to compare.
	 * The compare product display page compares various products' attributes side-by-side.
	 *
	 */
	compareProductJS={
		
		/**
		 * The langId is a string to store the current language identifier of the store.
		 */
		langId: "-1",

		/**
		 * The storeId is a string to store the current store identifier of the store.
		 */
		storeId: "",

		/**
		 * The catalogId is a string to store the current catalog identifier of the store.
		 */
		catalogId: "",
		
		/**
		* The compareReturnName is a string to store the current name of the category from where the compare link was clicked
		*/
		compareReturnName: "",
		
		/**
		* The returnUrl is a string to store the url of the category from where the compare link was clicked
		*/
		returnUrl: "",
		
		/**
		 * The prefix of the cookie key that is used to store item Ids. 
		 */
		cookieKeyPrefix: "CompareItems_",
		
		/**
		 * The delimiter used to separate item Ids in the cookie.
		 */
		cookieDelimiter: ";",
		
		/**
		 * The maximum number of items allowed in the compare zone. 
		 */
		maxNumberProductsAllowedToCompare: 4,

					
		/**
		 * Sets the common parameters used in all service calls like langId, storeId and catalogId.
		 * @param {String} langId The language Id.
		 * @param {String} storeId The store Id.
		 * @param {String} catalogId The catalog Id.
		 * @param {String} compareReturnName The return page name
		 * @param {String} returnUrl The url of the return page to go back
		 */
		setCommonParameters:function(langId,storeId,catalogId, compareReturnName, returnUrl){
			this.langId = langId;
			this.storeId = storeId;
			this.catalogId = catalogId;
			this.compareReturnName = compareReturnName;
			this.returnUrl = decodeURIComponent(returnUrl);
		},
		
		
		/**
		 * This function clears items in the compare zone.
		 */
		clear: function(){
			MessageHelper.hideAndClearMessage();
			var cookieKey = this.cookieKeyPrefix + this.storeId;
			dojo.cookie(cookieKey, '', {path:'/'});
			
			dojo.destroy('compareDropZoneImgDiv');
			if(null != dojo.byId('compareDropZoneImg')){
				dojo.style('compareDropZoneImg','display','block');
			}
			
			if(document.getElementById("compareProductPage") != null && document.getElementById("compareProductPage") != 'undefined'){
				if(document.getElementById("compareProductPage").value){
					var url = "CompareProductsDisplay?storeId=" + this.storeId + "&catalogId=" + this.catalogId + "&langId=" + this.langId 
						+ "&compareReturnName=" + this.compareReturnName + "&returnUrl=" + encodeURIComponent(this.returnUrl);
					document.location.href=url;
				}
			}
			MessageHelper.displayStatusMessage(MessageHelper.messages["COMPARE_ITEMS_CLEAR"]);
		},
	
		/**
		 * Removes an item from the products compare page.
		 * @param {String} key The Id of the item to remove.
		 */
		remove: function(key){
			var cookieKey = this.cookieKeyPrefix + this.storeId;
			var cookieValue = dojo.cookie(cookieKey);
			if(cookieValue != null){
				if(dojo.trim(cookieValue) == ""){
					dojo.cookie(cookieKey, null, {expires: -1});
				}else{
					var cookieArray = cookieValue.split(this.cookieDelimiter);
					var newCookieValue = "";
					for(index in cookieArray){
				if(cookieArray[index] != key){
					if(newCookieValue == ""){
						newCookieValue = cookieArray[index];
					}else{
						newCookieValue = newCookieValue + this.cookieDelimiter + cookieArray[index]
					}
				}
					}
					dojo.cookie(cookieKey, newCookieValue, {path:'/'});
				}
				this.compareProducts();
			}
		},
		
		
		/**
		 * Adds an item to the compare zone.
		 * @param {string} catEntryIdentifier The Id of the catalog entry to add.
		 */
		Add2CompareAjax:function(catEntryIdentifier , dragImagePath , url , dragImageDescription){
			MessageHelper.hideAndClearMessage();
			if(document.getElementById("compareProductParentId_"+catEntryIdentifier)!=null && document.getElementById("compareProductParentId_"+catEntryIdentifier)!=undefined){
				catEntryIdentifier = document.getElementById("compareProductParentId_"+catEntryIdentifier).value;	
			}
			var cookieKey = this.cookieKeyPrefix + this.storeId;
			var cookieValue = dojo.cookie(cookieKey);
			
			if(cookieValue != null){
				if(cookieValue.indexOf(catEntryIdentifier) != -1 || catEntryIdentifier == null){
					MessageHelper.displayErrorMessage(MessageHelper.messages["COMPARE_ITEM_EXISTS"]);
					return;
				}
			}
			
			var currentNumberOfItemsInCompare = 0;
			if(cookieValue != null && cookieValue != ""){
				currentNumberOfItemsInCompare = cookieValue.split(this.cookieDelimiter).length;
			}
			
			if (currentNumberOfItemsInCompare < parseInt(this.maxNumberProductsAllowedToCompare)) {
				var newCookieValue = "";
				if(cookieValue == null || cookieValue == ""){
					newCookieValue = catEntryIdentifier;
				}else{
					newCookieValue = cookieValue + this.cookieDelimiter + catEntryIdentifier;
				}
				dojo.cookie(cookieKey, newCookieValue, {path:'/'});					
				
				if (0==currentNumberOfItemsInCompare) {
					dojo.style('compareDropZoneImg','display','none');
					/* Initialize DOM of compare zone */
					dojo.place("<div id='compareDropZoneImgDiv' style='width:100%'><table><tbody id='compareItemsTable'><tr id='compareRow'></tr></tbody></table></div>","compareZone");	
				}

				if(dojo.byId('compareDropZoneImgDiv')){
					/* Build the inner HTML to display the items in the compare zone. */
					var itemHTML = 	('<td id="compareCatentry'+catEntryIdentifier+'"><div id="compareCatentryContainer'+catEntryIdentifier+'">'+
									'<div id="compare_img_'+catEntryIdentifier+'" class="compare_img">'+
										'<a id="imgcatBrowseCompare_Item_'+catEntryIdentifier+'" href="'+url+'">'+
											'<img height="40" width="40" border="0" alt="'+dragImageDescription+'" title="'+dragImageDescription+'" src="'+dragImagePath+'"></img>\n'+
										'</a>'+
									'</div>'+
									'<div id="compare_info_'+catEntryIdentifier+'" class="compare_info">'+
										'<div id="compare_product_desc_'+catEntryIdentifier+'" class="compare_product_desc">'+
											dragImageDescription+
										'</div>'+
									'</div></div></td>').replace(/\"/g,"'").replace(/\r|\n|\r\n|\n\r/g, "");				
					
					dojo.place(itemHTML,"compareRow");
				}

				if(document.getElementById("compareProductPage") != null && document.getElementById("compareProductPage") != 'undefined'){
					if(document.getElementById("compareProductPage").value){
						this.compareProducts();
					}
				}
				MessageHelper.displayStatusMessage(MessageHelper.messages["COMPAREZONE_ADDED"]);
			} else {
				MessageHelper.displayErrorMessage(MessageHelper.messages["COMPATE_MAX_ITEMS"]);
			}
		},

		/**
		 * Re-directs the browser to the CompareProductsDisplay page to compare products side-by-side.
		 */
		compareProducts:function(){
			var url = "CompareProductsDisplay?storeId=" + this.storeId + "&catalogId=" + this.catalogId + "&langId=" + this.langId + "&compareReturnName=" + this.compareReturnName;
			
			var cookieKey = this.cookieKeyPrefix + this.storeId;
			var cookieValue = dojo.cookie(cookieKey);
			if(cookieValue != null && dojo.trim(cookieValue) != ""){
				var cookieArray = cookieValue.split(this.cookieDelimiter);
				for(index in cookieArray){
					url = url + "&catentryId=" + cookieArray[index];
				}
			}
			url = url + "&returnUrl=" + encodeURIComponent(this.returnUrl);
			document.location.href = getAbsoluteURL() + url;
		},
		
		
		
		/**
		 * Initializes the compare zone as a Dojo drop target and loads the product images for all the products in the compare zone.
		 */
		init:function(){

			 dojo.subscribe("/dnd/drop", function(source, nodes, copy, target){
				if (source != target) {
					target.deleteSelectedNodes();
				}
				var productDisplayPath="";
				var imgPath="";
				var imgDescription="";
				var sourceId = source.parent.id;
					
				if(target.parent.id=='compareZone'){
					if(dojo.cookie('coShoppingDisableDnd')!=undefined && dojo.cookie('coShoppingDisableDnd') == 'true') {
						ceadojo.publish("/wc/collaboration/dndDisabled",[]);

						return;
					}
					
	  			    var indexOfIdentifier = sourceId.indexOf("_",0);
	                if ( indexOfIdentifier >= 0) {
				        /* remove the prefix including the "underscore". */
					   sourceId = sourceId.substring(indexOfIdentifier+1);
	                }
					if(document.getElementById("compareImgPath_"+sourceId)!=null && document.getElementById("compareImgPath_"+sourceId)!=undefined){
						imgPath = document.getElementById("compareImgPath_"+sourceId).value;
					}
	                if(document.getElementById("compareProductDetailsPath_"+sourceId)!=null && document.getElementById("compareProductDetailsPath_"+sourceId)!=undefined){
						productDisplayPath=document.getElementById("compareProductDetailsPath_"+sourceId).value;
					}
	                if(document.getElementById("compareImgDescription_"+sourceId)!=null && document.getElementById("compareImgDescription_"+sourceId)!=undefined){
						imgDescription = document.getElementById("compareImgDescription_"+sourceId).value;	
	                }
					if(document.getElementById("compareProductParentId_"+sourceId)!=null && document.getElementById("compareProductParentId_"+sourceId)!=undefined){
							sourceId = document.getElementById("compareProductParentId_"+sourceId).value;	
					}
	                compareProductJS.Add2CompareAjax(sourceId,imgPath,productDisplayPath,imgDescription);
				}
			});
			var cookieKey = this.cookieKeyPrefix + this.storeId;
			var cookieValue = dojo.cookie(cookieKey);
		}
	}	
	

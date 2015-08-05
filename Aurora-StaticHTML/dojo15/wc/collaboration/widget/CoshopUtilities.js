//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2010 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------
/**
* This javascript contains configuration settings for the coshop widget. It also provides common utilities. 
* @version 1.0
**/


dojo.provide("collaboration.widget.CoshopUtilities");

/**** CONFIGURATION SECTION STARTS ****/

/** string used to determine if contextPathUsed is the preview context or not */
collaboration.widget.CoshopUtilities.previewContextPath = '/webapp/wcs/preview';
/** whether or not the send page button is shown */
collaboration.widget.CoshopUtilities.hideSendPageButton =  true;
/** whether or not URL field is shown in the coshop dialog */
collaboration.widget.CoshopUtilities.hideURLField = true;
/** whether or not the widget is in follow mode after it's started */
collaboration.widget.CoshopUtilities.startInFollowMeMode = true;


/**
 * This is the variable that keeps track of which links are clickable when the collaboration session is in follow me mode.	
 **/
collaboration.widget.CoshopUtilities.clickableLinks = [
	".?clickable.?", 										//any link containing the string clickable
	"^WC_CachedBundleDisplay_links_10(_[1-9])+",			//link to go to the item detail from the bundle page
	
	"^WC_BreadCrumbTrailDisplay_link(_[1-9])+", 			//breadcrumb links
	"^WC_CategoriesSidebarDisplayf_links(_[1-9])+", 		//links in the left nav
	"WC_CachedHeaderDisplay_Link_2",						//Store logo
	"^WC_CachedHeaderDisplay_links(_[1-9])+", 				//top categories 
	
	".?Add2Compare.?", 							// add to compare link
	"WC_CachedHeaderDisplay_button_1",   // search icon button in header
	"addToCompareLink", 						// add to compare link in quick info
	"^WC_CompareProductsDisplay_link(_[1-9])+", // links on the compare product page
	".?CompareZone.?", 							//compare zone links
	
	
	".?productPageAdd2Cart.?", 								//product page add to cart	
	"catalogEntry_img.?",									//thumbnail in catalog entry 
	"WC_CatalogEntryDBThumbnailDisplayJSPF_(.+)_link_9b", 	//links below the thumbnail in catalog entry
	"WC_SiteMap_link.?", 									//site map links
	
	"WC_CategoryOnlyResultsDisplay_links_3",				//grid view link 
	"WC_CatalogSearchResultDisplay_link_5", 				//grid view link in search
	"WC_CategoryOnlyResultsDisplay_links_4", 				//list view link
	"WC_CatalogSearchResultDisplay_link_6",					//list view link in search
	
	"WC_CatalogSearchResultDisplay_link_3",					//previous page in search
	"WC_CatalogSearchResultDisplay_link_7",
	"WC_CategoryOnlyResultsDisplay_links_1",

	"WC_CatalogSearchResultDisplay_link_4",					//next page in search
	"WC_CatalogSearchResultDisplay_link_8",
	"WC_CategoryOnlyResultsDisplay_links_2",
	
	"WC_CachedFooterDisplay_link_5", 						//privacy policy
	"WC_CachedFooterDisplay_link_6", 						//Help
	"WC_CachedFooterDisplay_link_7",						//site map
	
	"^SBN_facet_.?",										//Search Based Navigation Facet links
	
	"headerHome",
	"mSearchBreadCrumb",
	"storeLocatorLink",
	"closeLink",
	"mTopCategory.?",
	"mSubCategory.?",
	"mFooter.?",
	"mProduct.?",
	"mCategory.?",
	"mPrev.?", //previous product or previous page
	"mNext.?", // next product or next page
	"mCompare.?" //any compare product links
];
/**** CONFIGURATION SECTION ENDS ****/


/** whether or not the peer should follow the leader when the currency or store language is changed **/
collaboration.widget.CoshopUtilities.followCurrencyChange = false;
collaboration.widget.CoshopUtilities.followLanguageChange = false;

/**
 * highlightable elements in the page
 */
collaboration.widget.CoshopUtilities.highlightables = [
   "onlinestore_inventory_status_.?",				//product discounts
   "Description",									//product description tab
   "catalog_link", 									//catalog link
   "maHeader",										//merchandising association header
   "maPrice",										//merchandising association price
   ".?price.?",										//price in the produce detail page
   "WC_CompareProductsDisplay_td_5.?",				//price in the compare page
   "WC_CompareProductsDisplay_td_7.?",				//price in the compare page
   "WC_CompareProductsDisplay_td_9.?",				//brand in the compare page   
];

/**
*Callback function to allow the application to determine if a specific node is highlightable
*@param {string} node The HTML element that is highlighted.  
*/
collaboration.widget.CoshopUtilities.isHighlightable = function(node,isMobile) {
	//do not highlight links
	if (node.nodeName.toLowerCase() == 'a') {return false;}
	if (isMobile) {
		//in mobile, only espots are not highlightable
		return !collaboration.widget.CoshopUtilities.isMobileEspot(node);
	}else {
		return collaboration.widget.CoshopUtilities.search(node.id,collaboration.widget.CoshopUtilities.highlightables);
	}	
};

/**
 * traverse through the DOM tree and find if the node's parent is a espot 
 * @param {String} nodeId - the node to begin the search with
 */
collaboration.widget.CoshopUtilities.isMobileEspot = function(node) {	
	if (node.nodeName.toLowerCase() == 'html') {
		//went all the way up the tree and can't find anything. Not an espot
		return false;
	}	
	else if (node.id.indexOf('featured_products')>-1 || node.id.indexOf('contentAreaESpot')>-1) {
		return true;
	}else {
		return collaboration.widget.CoshopUtilities.isMobileEspot(node.parentNode);	
	}
};
	
/**
*Callback function to allow the application to determine if a specific node click should be sent to the peer
*@param {string} node The HTML element that is clicked.  		
*/
collaboration.widget.CoshopUtilities.isLinkClickable = function(node) {
	return collaboration.widget.CoshopUtilities.search(node.id,collaboration.widget.CoshopUtilities.clickableLinks);
};



/**The css class which is only used in ajax add to cart buttons*/
collaboration.widget.CoshopUtilities.addToCartIndicator = 'ajaxAddToCart';

/** CSS class which is used to indicate a non clickable social commerce link **/
collaboration.widget.CoshopUtilities.socComNonClickableCSS = ['feed clickable'];


/**
 * URLs that are allowed to load in a follower's dialog during coshopping. 
 * This should be only used with a feature that submits a form, ie Search. 
 * When a form is submitted, we can not intercept the click action. The only event we get is pageChanged.
 */
collaboration.widget.CoshopUtilities.URLsToLoadIfPageChanged = ['AjaxCatalogSearchView','SearchDisplay','mCatalogSearchResultView'];
collaboration.widget.CoshopUtilities.loadIfPageChanged= function(url) {
	return collaboration.widget.CoshopUtilities.search(url,collaboration.widget.CoshopUtilities.URLsToLoadIfPageChanged);
};


/**
 * Search for a value in an array. Returns true if found.
 * @param {string} item The searched value.	
 * @param {array} arrayToSearch The array. 
 * 
 */
collaboration.widget.CoshopUtilities.search = function(item, arrayToSearch) {
	var found=false;
	var regex;
	for(var i in arrayToSearch){
		if(!found) {
			regex = new RegExp(arrayToSearch[i].toLowerCase());
			if (regex.exec(item.toLowerCase()) != null) {
				found=true;
				break;
			}
		}
	}	
	return found; // by default, nothing is clickable
};



/**
 * Process the URL before passing it to the coshop widget.
 * It will remove everything after the # sign and remove unnecessary parameters from the URL
 */
collaboration.widget.CoshopUtilities.processURL = function(currentURL) {
	//removing # and everything after that from the URL 
	if (currentURL.indexOf('#') >-1) {
		currentURL = currentURL.slice(0,currentURL.indexOf('#'));				
	}
	
	var url = currentURL.split("?")[0];
	if (currentURL.split("?")[1]!=undefined) {
		//the current URL has some parameters, remove unnecessary parameters from the URL
		var parameters =currentURL.split("?")[1].split('&');					
		dojo.forEach(parameters, function(item){
			if (item.indexOf("cea_collab") >-1 || item.indexOf("nonce") >-1 || item.indexOf("krypto")>-1 
					|| item.indexOf('showCoshoppingDialog')>-1 || item.indexOf('coshopChangeCurrency')>-1
					|| item.indexOf('currency')>-1) {
				return;
			}else {
				if (url.indexOf('?')>01) {
					//already have ?
					url += ('&'+item);
				}else {
					url += ('?'+item);
				}					
			}
		});
	}
	console.log("processed url:", url);
	return url;
};

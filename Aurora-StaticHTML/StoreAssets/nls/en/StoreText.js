//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2011, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

// NLS_CHARSET=UTF-8
({
	HISTORY:"History",

	//Product Description
	ERR_RESOLVING_SKU : "Your selection is either incomplete or not in stock. Please be sure to supply a value for each attribute or consider a different combination of values.",
	QUANTITY_INPUT_ERROR : "The value in the Quantity field is invalid. Ensure the value is a positive integer and try again.",
	WISHLIST_ADDED : "The item has been successfully added to your Wish List",
	
	SHOPCART_ADDED : "The item has been successfully added to your shopping cart.",
	PRICE : "Price:",
	SKU : "SKU:",
	PQ_PURCHASE : "Purchase:",
	PQ_PRICE_X : "${0} -",
	PQ_PRICE_X_TO_Y : "${0} to ${1} -",
	PQ_PRICE_X_OR_MORE : "${0} or more -",
	
	COMPARE_ITEM_EXISTS : "The product you are trying to add to the compare zone already exists.",
	COMPATE_MAX_ITEMS : "You can only compare up to 4 products.",
	COMPAREZONE_ADDED : "The Item has been successfully added to the compare zone.",
	
	GENERICERR_MAINTEXT : "The store has encountered a problem processing the last request. Please try again. If the problem persists, ${0} for assistance.",
	GENERICERR_CONTACT_US : "contact us",
	
	// Shopping List Messages
	DEFAULT_WISH_LIST_NAME : "Wish List",
	LIST_CREATED : "Wish list created successfully.",
	LIST_EDITED : "Wish list name changed successfully.",
	LIST_DELETED : "Wish list deleted successfully.",
	ITEM_ADDED : "The item has been added to your wish list.",
	ITEM_REMOVED : "The item has been removed from your wish list.",
	ERR_NAME_EMPTY : "Type a name for your wish list.",
	ERR_NAME_TOOLONG : "Wish list name is too long.",
	ERR_NAME_SHOPPING_LIST : "The name Wish List is reserved for default wish list. Please choose a different name.",
	ERR_NAME_DUPLICATE : "A wish list already exists with the name you have chosen. Please choose a different name.",
	WISHLIST_EMAIL_SENT : "Your e-mail has been sent.",
	WISHLIST_MISSINGNAME : "The Name field cannot be blank. Type your name in the Name field and try again.",
	WISHLIST_MISSINGEMAIL : "The E-mail address field cannot be blank. Type the e-mail address of the person to whom you are sending your wish list and try again.",
	WISHLIST_INVALIDEMAILFORMAT : "Invalid E-mail address format.",
	WISHLIST_EMPTY : "Please create a wish list before sending an email.",
		
	// Inventory Status Messages
	INV_STATUS_RETRIEVAL_ERROR : "An error occurred while retrieving inventory status. Try again later. If the problem persists, contact your site administrator.",
	INV_ATTR_UNAVAILABLE: "${0} - unavailable",
	
	// Product Tab
	CONFIGURATION: "Configuration",
	
	// My Account Page Messages
	QC_UPDATE_SUCCESS : "Quick checkout profile updated successfully!",
	
	// This line defines the Quantity {0} and the component name {1} of a dynamic kit.  If a kit has a component with quantity 3, it will show as: 3 x Harddrive.
	// To show the string "Harddrive : 3", simply change this line to:  {1} : {0}.
	ITEM_COMPONENT_QUANTITY_NAME: "${0} x ${1}",
	
	//Sterling Order Line Status
	ORDER_LINE_STATUS_S : "Order Shipped",
	ORDER_LINE_STATUS_G : "Order Processing",
	ORDER_LINE_STATUS_K : "Return Associated",
	ORDER_LINE_STATUS_V : "Partially Shipped",
	ORDER_LINE_STATUS_X : "Order Cancelled"
})

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
 * @fileOverview This javascript defines all the render contexts needed for the multiple wish list pages.
 * @version 1.0
 */

dojo.require("wc.service.common");
dojo.require("wc.render.common");

/**
 * Context used for creating a new wish list.
 */
wc.render.declareContext("MultipleWishListNewListContext",null,""),

/**
 * Declares a new render context for the multiple Wishlist select display
 */
wc.render.declareContext("WishlistSelect_Context",null,"")

/**
 * Declares a new render context for the multiple Wishlist in the quick info drop down
 */
wc.render.declareContext("MultipleWishListInQuickInfo_Context",null,"")



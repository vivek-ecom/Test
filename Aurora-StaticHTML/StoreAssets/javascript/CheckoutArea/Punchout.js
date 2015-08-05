//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2009, 2012 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/** 
 * @fileOverview This file is used by PunchoutPaymentRedirect.jsp, MyAccountDisplay.jsp and OrderDetailDisplay.jsp.
 */

if(typeof(PunchoutJS) == "undefined" || !PunchoutJS || !PunchoutJS.topicNamespace){
	
	/** 
	 * @class The PunchoutJS class defines helper functions that are used to process punchout payments.
	 */
	PunchoutJS = {
		/**
		 * The Id of a section on the page that will be replaced by the punchout payment page. 
		 */
		divId:"",
		
		/**
		 * A boolean value that indicates if the punchout payment page should be opened in the same browser window as the current page.
		 * The default value is true.
		 */
		sameWindow:true,
		
		/**
		 * Displays a message pop-up on the checkout page to remind the user that the punchout payment needs to be paid while blocking the background page with a semi-transparent image.
		 */
		displayPopup:function(){
			if(dojo.byId("punchout_popup_container") == null){
				console.debug("PunchoutJS.displayPopup: element with Id punchout_popup_container was not found on the page.");
				return;
			}
			dijit.byId("punchout_popup_container").show();
			
			var pageMask = dojo.create("div", {id:"pageMask"}, dojo.body());
			dojo.style(pageMask,{
				"position":"absolute",
				"zIndex":950,
				"top":"0px",
				"left":"0px",
				"width":dojo.body().scrollWidth + "px",
				"height":dojo.body().scrollHeight + "px",
				"background":"#000",
				"opacity":"0.40"
			});
			setTimeout("dojo.byId('punchout_popup_close_icon').focus()", 1000);
		},
		
		/**
		 * This function renders the actual punchout payment section on the page after a successful service call invocation to AjaxPunchoutPay.
		 * @param {String} orderId The Id of the order that is being processed.
		 */
		handleResponse:function(orderId) {
			var divId = this.divId;
			var sameWindow = this.sameWindow;
			
			var div = document.getElementById(divId);
			var url = div.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
			var lowerUrl = url.toLowerCase();
			if (lowerUrl.indexOf('<form') != 0 && lowerUrl.indexOf('&lt;form') != 0) {
				if (lowerUrl.indexOf('<a') != 0 && lowerUrl.indexOf('&lt;a') != 0) {
					div.innerHTML = '<a name="punchout_anchor" href="' + url + '" />';
				} else {
					div.innerHTML = url;
				}
				var a = div.childNodes[0];
				if (!sameWindow) {
					a.target = '_blank';
					window.open(a.href);
				} else {
					window.location = a.href;
				}
			} else {
				div.innerHTML = url;
				var form = div.childNodes[0];
				form.name = 'punchout_form';
				if (!sameWindow) {
					form.target = '_blank';
					form.submit();
				} else {
					form.submit();
				}
			}
		},
		
		/**
		 * Invokes the service AjaxPunchoutPay to handle the payment for the current order.
		 * @param {String} orderId The Id of the order that is being processed.
		 * @param {String} piId The payment instruction Id.
		 * @param {String} divId The Id of the div element that the punchout payment page should be displayed in.
		 * @param {boolean} sameWindow Whether the punchout payment page should be displayed in the same browser window. 
		 */
		pay:function(orderId, piId, divId, sameWindow) {
			this.divId = divId;
			this.sameWindow = sameWindow;
			params = [];
			params["orderId"] = orderId;
			params["piId"] = piId;
			if(!submitRequest()){
				return;
			}
			cursor_wait();
			wc.service.invoke("AjaxPunchoutPay",params);
		},
		
		/**
		 * Handles key press event that occurs in the punchout payment message pop-up dialog.
		 * If the key press event is not tab and shift, then refresh the page.
		 * @param {Object} event An HTML event object. 
		 */
		handleKeyPress:function(event){
			if(event.keyCode != dojo.keys.TAB && event.keyCode != dojo.keys.SHIFT){
				location.reload();
			}
		},
		
		/**
		 * Put the cursor focus on the element with the given Id.
		 * @param {String} elementId The element Id.
		 */
		focusElement:function(elementId){
			if(dojo.byId(elementId) == null){
				console.debug("PunchoutJS.focusElement: element with Id " + elementId + " was not found on the page.");
			}
			dojo.byId(elementId).focus();
		}
	}
}
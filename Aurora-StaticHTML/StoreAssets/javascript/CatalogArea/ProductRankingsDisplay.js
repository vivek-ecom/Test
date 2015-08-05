//-----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (C) Copyright IBM Corp. 2009 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
//-----------------------------------------------------------------

/**
 * @fileOverview This file defines all the functions used to display a ranking list e-Marketing spot.
 */

if(typeof(ProductRankingsDisplayJS) == "undefined" || !ProductRankingsDisplayJS || !ProductRankingsDisplayJS.topicNamespace){
	ProductRankingsDisplayJS = {
		/**
		 * The number of Dojo accordion panes, each is an instance of dijit.layout.ContentPane, supported in the ranking list e-Marketing spot.
		 * @constant
		 */
		NUMBER_OF_ACCORDION_PANES: 2,
		
		/**
		 * The Id prefix of the div element that an instance of dijit.layout.ContentPane is initiated in.
		 * The Id is expected to be in the format of "PrefixNumber", e.g. "WC_RankTab" is the prefix in "WC_RankTab1". 
		 * @constant
		 */
		ACCORDION_PANE_ID_PREFIX: "WC_RankTab",
		
		/**
		 * When an accordion widget is parsed, Dojo would generate several DOM elements on the page to display the widget.
		 * One of the DOM elements created is a button that allows a user to click to expand the content of the pane.
		 * Its Id is the Id of the content pane appended with "_button".
		 * By default, content pane with Id "WC_RankTab1" is displayed when the page is loaded, so "WC_RankTab1_button" is stored as the current Id for the button element.
		 * This Id is used to toggle an arrow icon associated with the button.
		 * @private  
		 */
		currentOpenPaneButtonId: "WC_RankTab1_button",
		
		/**
		 * Dojo generates a span tag with this class name in the button element to distinguish a closed content pane. 
		 * The span tag does not have an Id, so its class name will be used to identify it and to toggle an arrow icon.
		 * @private
		 * @constant
		 */
		arrowTextUpClassName: "arrowTextUp",
		
		/**
		 * Dojo generates a span tag with this class name in the button element to distinguish an expanded content pane. 
		 * The span tag does not have an Id, so its class name will be used to identify it and to toggle an arrow icon.
		 * @private
		 * @constant
		 */
		arrowTextDownClassName: "arrowTextDown",
		
		/**
		 * Toggles the arrow icon on top of the content pane depending on the state of the pane.
		 * @param {String} newOpenPaneButtonId The Id of the selected button.
		 */
		toggleArrow: function(newOpenPaneButtonId){
			if(newOpenPaneButtonId != this.currentOpenPaneButtonId){
				var newOpenPane = document.getElementById(newOpenPaneButtonId);
				if(newOpenPane == null){
					console.debug("ProductRankingsDisplayJS.toggleArrow(): accordion pane button with id " + newOpenPaneButtonId + " was not found on this page.");
					return;
				}
				
				var currentOpenPane = document.getElementById(this.currentOpenPaneButtonId);
				if(currentOpenPane == null){
					console.debug("ProductRankingsDisplayJS.toggleArrow(): accordion pane button with id " + this.currentOpenPaneButtonId + " was not found on this page.");
					return;
				}
								
				var newOpenPaneArrowTextUpElement = this.getElementsByClassName(this.arrowTextUpClassName, newOpenPane)[0];
				var newOpenPaneArrowTextDownElement = this.getElementsByClassName(this.arrowTextDownClassName, newOpenPane)[0];
				
				var currentOpenPaneArrowTextUpElement = this.getElementsByClassName(this.arrowTextUpClassName, currentOpenPane)[0];
				var currentOpenPaneArrowTextDownElement = this.getElementsByClassName(this.arrowTextDownClassName, currentOpenPane)[0];
	
				newOpenPaneArrowTextUpElement.style.display = "none";
				newOpenPaneArrowTextDownElement.style.display = "inline-block";
				newOpenPaneArrowTextDownElement.parentNode.className = "dijitAccordionTitleBottom-selected";
				
				currentOpenPaneArrowTextDownElement.style.display = "none";
				currentOpenPaneArrowTextUpElement.style.display = "inline-block";
				currentOpenPaneArrowTextUpElement.parentNode.className = "dijitAccordionTitleBottom";
				
				this.currentOpenPaneButtonId = newOpenPaneButtonId;
			}
		},
		
		/**
		 * Initializes the arrow icons in the accordion widget when the page is loaded.
		 */
		initializeArrowOnPageLoad: function(){
			for(var i=1; i<=this.NUMBER_OF_ACCORDION_PANES; i++){
				var paneButtonId = this.ACCORDION_PANE_ID_PREFIX + i + "_button";
				var paneButton = document.getElementById(paneButtonId);
				if(paneButton != null){					
					var paneButtonArrowTextUpElement = this.getElementsByClassName(this.arrowTextUpClassName, paneButton)[0];
					var paneButtonArrowTextDownElement = this.getElementsByClassName(this.arrowTextDownClassName, paneButton)[0];
					
					if(paneButtonId == this.currentOpenPaneButtonId){
						paneButtonArrowTextUpElement.style.display = "none";
						paneButtonArrowTextDownElement.style.display = "inline-block";
						var contents = paneButton.innerHTML;
						paneButton.innerHTML = "<span id='" + paneButtonId + "_bottom' class='dijitAccordionTitleBottom-selected'>" + contents + "</span>";
					}else{
						paneButtonArrowTextDownElement.style.display = "none";
						paneButtonArrowTextUpElement.style.display = "inline-block";
						var contents = paneButton.innerHTML;
						paneButton.innerHTML = "<span id='" + paneButtonId + "_bottom' class='dijitAccordionTitleBottom'>" + contents + "</span>";
					}				
				}else{
					console.debug("ProductRankingsDisplayJS.initializeArrowOnPageLoad(): accordion pane button with id " + paneButtonId + " was not found on this page.");
				}
			}
		},
		
		/**
		 * This function traverses the DOM tree and returns an array of elements with a given class name.
		 * @param {String} nameOfClass The class name to look for.
		 * @param {Object} rootNode The HTML object that the traversal should start from. If it is not specified, then the traversal starts at the DOM tree root of the entire page.
		 * @return {Array} result An array that contains all DOM elements that have a matching class name.
		 */
		getElementsByClassName: function(nameOfClass, rootNode){
			 var result = new Array();
		    if(document.getElementsByClassName){
		    	if(rootNode != null || rootNode != ""){
		    		result = rootNode.getElementsByClassName(nameOfClass);
		    		return result;
		    	}else{
		    		result = document.getElementsByClassName(nameOfClass);
		    		return result;
		    	}
		    }else{
		    	var listOfNodes = new Array();
		    	if(rootNode != null || rootNode != ""){
		    		listOfNodes = rootNode.getElementsByTagName("*");
		    	}else{
		    		listOfNodes = document.getElementsByTagName("*");
		    	}
		    	var length = listOfNodes.length;
	    		while(length){
	    			var temp = listOfNodes[--length];
	    			if(temp.className.indexOf(nameOfClass) != -1){
	    				result.push(temp);
	    			}
	    		}
		        return result;
		    }
		},
		
		/**
		 * Toggles the button bottom border image when the user hovers over the button area.
		 * @param {String} buttonId The Id of the button hovered over.
		 */		
		hoverHeader: function(buttonId) {
			var buttonBottom = document.getElementById(buttonId + "_bottom");
			buttonBottom.className = "dijitAccordionTitleBottom-hover";
		},
		
		/**
		 * Toggles the button bottom border image when the focus leaves the button area.
		 * @param {String} buttonId The Id of the button hovered off.
		 */				
		hoverOffHeader: function(buttonId) {
			var buttonBottom = document.getElementById(buttonId + "_bottom");
			
			if(buttonId == this.currentOpenPaneButtonId){
				buttonBottom.className = "dijitAccordionTitleBottom-selected";
			} else {
				buttonBottom.className = "dijitAccordionTitleBottom";
			}
		}
	}
}

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

/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/**
* This javascript is used to create a collaboration dialog in which coshopping is done. 
* @version 1.0
* 
**/

/**
* @class This javascript is used to create a collaboration dialog in which coshopping is done. 
*
**/
	dojo.provide("collaboration.widget.CollaborationDialog");
	
    dojo.require("dojo.dnd.Moveable");
	dojo.require("dijit.layout.BorderContainer");
	dojo.require("cea.widget.CollaborationDialog");
	dojo.require("collaboration.widget.CollaborationDialogBase");
	dojo.declare("collaboration.widget.CollaborationDialog",[cea.widget.CollaborationDialog,collaboration.widget.CollaborationDialogBase],{
      templatePath:dojo.moduleUrl('collaboration.widget','CollaborationDialog/CollaborationDialog.html'),
		templateString:null,
		widgetsInTemplate: true,
		_chat:false,
	    hideURLField:false,
		startInFollowMeMode:false,
		hideSendPageButton:false, 
		name: '', //name of the shopper
		nodeToClick: null, //stores scripts to be executed after the page in the iframe has finished loading.
		isMobile:false,
		isTouchable: false,
		MAX_CHAT_WIDTH: 320,
		MAX_CHAT_HEIGHT: 230,
		movableChat:null,
		chatMoved:false,
		
		/**
		 * @see refer to  dojo's documentation
		 * http://api.dojotoolkit.org/jsdoc/1.3/dijit._Widget.postMixInProperties
		 */
		postMixInProperties: function() {
			this.inherited(arguments);
			
			//if a touch event can be created, then this browser is not a desktop browser. 
			try{
				document.createEvent("TouchEvent");
				this.isTouchable = true;
			}catch(e){
				this.isTouchable = false;
			}
			
			
			if (this.isTouchable) { 
				//create a iFrame widget to replace the <iframe> tag
				this.collaborationDialogIFrame = new cea.mobile.widget.iFrame();
			}		
		},
		
	/**
	 * initializing strings to be used by the widget. 
	 */
	  initializeStrings:function(){
		this.inherited(arguments);

   		dojo.requireLocalization("collaboration.widget", "CollaborationDialog", this.lang);
		this._messages = dojo.i18n.getLocalization("collaboration.widget", "CollaborationDialog", this.lang);
		
		this.chatButtonString=this._messages["CHAT_BUTTON"];
		this.closeChatButtonString = this._messages["CLOSE"];
		this.peerWindowOpenString = this._messages["PEER_WINDOW_OPEN"];
		this.peerWindowClosedString = this._messages["PEER_WINDOW_CLOSE"];
		this.pagesNotInSyncString = this._messages["PAGES_NOT_IN_SYNC"];
		this.followMeButtonString = this._messages["LEAD_COSHOPPING"];
		this.sendChatString = this._messages["SEND_CHAT"];
	},
			
  	/**
  	 * Invoked after a dojo widget is initialized. 
  	 */
      postCreate:function(){
	   console.log("@override postCreate");
	   this.inherited(arguments);
       dojo.style(this.collaborationDialogCloseBar,'display','none');       //HIDE THE CLOSE BUTTON
	   this.styleButtons();   
	   this.chatArea.innerHTML="";
       dojo.connect(dojo.byId('closeChat'),'onclick', this, 'closeChat');        //connect to chat close button to the close function    
       window._ceaCollabDialog=this;        
       
		if (this.isTouchable) { 
			/**
			 * replace the iframe by cea.mobile.widget.iFrame widget so that it can be scrolled in iPad
			 */
			this.containerNode.removeChild(this.containerNode.children[0]);
			this.containerNode.appendChild(this.collaborationDialogIFrame.domNode);
			this.collaborationDialogContentPane.domNode = this.collaborationDialogIFrame.mobileIFrame;
			dojo.connect(this.collaborationDialogContentPane.domNode, "onload", this, this._iFrameOnloadHandler);
		}		
		
		this.movableChat =  new dojo.dnd.move.parentConstrainedMoveable(dojo.byId("chatDialog"),{skip: true, area: "content", within: true});
		dojo.connect(window, 'onresize', this,'positionChatDialog');
		dojo.connect(this.movableChat,'onMoveStop',this,function(){	this.chatMoved = true; });		
		dojo.connect(this.movableChat, 'onMoveStop', this, 'positionChatDialog');

      },
      
 
      
      /**
       * opens the collaboration dialog
       */
      openCollaborationDialog:function() {
    		console.log("@override openCollaborationDialog");
    		if (dijit.byId('invitationDialog').open) {
    			//the invitation dialog is still open. Close it first. 
    			dijit.byId('invitationDialog').hide();
    		}
    		
    		//about to open the collaboration dialog, making sure all scroll bars are hidden first.
    		//The scroll bar for the collab dialog will be added by this._addOnclickHandlerToIFrame    		
    		dojo.query('html').style("overflow",'hidden');
    		
   		
	       if (this.startInFollowMeMode == true) {
	    	   this.enterFollowMe();	
			}
	       
	       var parent = this;
	       dojo.connect(this.chatInput.domNode,'onkeyup', parent, function(e) {
	         	 if (e!=null && e.keyCode==dojo.keys.ENTER){
	         		 this.sendChat();
	         	 }
	       });
	       
			dojo.connect(dojo.byId('permissionAcceptButton'),'onclick',this,'acceptGrantControl');
			dojo.connect(dojo.byId('permissionDeclineButton'),'onclick',this,'declineGrantControl');
		
			//accessibility only
			dojo.connect(dojo.byId('permissionAcceptButton'),'onkeypress',this,function(e) {
		       	 if (e!=null && e.keyCode==dojo.keys.ENTER){
		     		 this.acceptGrantControl();
		       	 }
			});
			dojo.connect(dojo.byId('permissionDeclineButton'),'onkeypress',this,function(e) {
		       	 if (e!=null && e.keyCode==dojo.keys.ENTER){
		     		 this.declineGrantControl();
		       	 }
			});
			

	       if (this.hideSendPageButton == true) {dojo.style(this.sendPageButton.domNode,'display','none');}
	       if (this.hideURLField == true) {dojo.style(this.cobrowseTextBox.domNode,'display','none');}
	       	
	       if (!this.open) {
				this.sendDataEvent('{"collaborationData":{"dialogStatusEvent":"peerDialogOpened"}}');	
				/**
				 * When the coshopping dialog is opened, it's on top of the existing page. It's possible that the existing page is much longer
				 * than the coshopping dialog. In this case, the movable chat box can be dragged out of the coshopping dialog. 
				 * To prevent this from happening, the background page is hidden. When the coshopping session is ended, a full page refresh will occur 
				 * and the background page will be displayed again. 
				 */
				dojo.style('page','display','none');
				this.show();
	    	   if (this._hasCollaborationControl) {
		    	   this.displayMessage(this._messages['LEADING_COSHOPPING']);
	    	   }else {
		    	   this.displayMessage(this._messages['FOLLOWING_COSHOPPING']);
	    	   }
	       }
			

    	   
			if (this.isTouchable) {
				this._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
			}

	       this.collaborationDialogBorderContainer.layout();
	       this.collaborationDialogBorderContainer.resize();
			
	       this._toggleCollaborationDialogButtons();
	       this._toggleCollaborationDialogStatus();
	       this.repositionDialog();
      },
      
      
      /**
       * Invoked when the user clicks the end collaboration dialog button 
       */
      onCancel:function() {
    	dijit.byId('helpDialog').hide();
    	dojo.style('MessageArea','display','none');
  		dojo.cookie("coShoppingDisableDnd",null,{expires:-1}); //remove the cookie
		this.sendDataEvent('{"collaborationData":{"dialogStatusEvent":"peerDialogClosed"}}');
      },
		
	  /**
       * invoked when the help button is clicked.
       */
      help:function() {   	  
    	  dojo.style(dijit.byId('helpDialog').titleBar, 'display','none');
    	  dijit.byId('helpDialog').show();
			if (this.isTouchable) {
				dijit.byId('helpDialog')._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
			}
      },
      
      /**
       * Re-adjust the size of the collaboration dialog and the iframe inside it
       * Overwriting the inherited function from CEA.
       */
      _resizeIframe:function () {
    	  this.repositionDialog();
      },
      
      /**
       * re-adjust the size of the collaboration dialog and the iframe inside it
       */
      repositionDialog: function() {
    	if (this.isTouchable) {
        	this.setBorderContainerSizeForIpad();
    	}else {
    		var iframeHeight = (document.documentElement.clientHeight-this.collaborationDialogBorderContainerTop.domNode.offsetHeight - this.collaborationDialogBorderContainerBottom.domNode.offsetHeight +2)
    		dojo.style(this.collaborationDialogWidget,"height",document.documentElement.clientHeight+"px");
    		dojo.style(this.containerNode, "height", iframeHeight+'px');
    		dojo.style(this.collaborationDialogContentPane.domNode, 'height',iframeHeight+'px' );    	
    	}
    	
		   
		dojo.style(this.containerNode, "width", "100%");
		this.collaborationDialogBorderContainer.layout();
		this.collaborationDialogBorderContainer.resize();
      },
      


		
		/**
		* Simulate the appropriate browser click on a given node.
		* @param {String} node The id of the HTML element to simulate the click on.
		*/
	  	_simulateClickEvent: function(node) {
	  		if (collaboration.widget.CoshopUtilities.addToCartIndicator == node.className && !this._hasCollaborationControl && this._followMeEnabled) {
	  			return false;
	  		}
		  	if( dojo.isIE ){
		  		node.click();
		  	}else if (dojo.isFF && node.href.toLowerCase().indexOf("javascript:") > -1){		
			  	//Firefox does not execute a HREF Javascript call when a click is simulated
			  	//So for this scenario we need to pull out the script and execute it manually		  	
			  	js = decodeURIComponent(node.href).split("javascript:")[1];	  	
				this.collaborationDialogContentPane.domNode.contentWindow.eval(js);
		  	}  else {
			  	var evt = document.createEvent("MouseEvents");
			  	evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			  	node.dispatchEvent(evt);
		  	}
	  	},
						

		/**
		 * simulate click only if the page in the iframe is finished loading
		 */
		clickIfPageLoaded:function () {					
			if (this.nodeToClick!=null && this._hasCollaborationControl == false) {
				
				var iframe = this.collaborationDialogContentPane.domNode.contentWindow.document;
				var parent = this;
				dojo.withDoc(iframe, function(e) {
					parent._simulateClickEvent(parent._findNode(parent.nodeToClick));
					var id = (parent._findNode(parent.nodeToClick)).id;
									
				});
			}
			this.nodeToClick = null;
		},
			
	/**
	 * hide or un-hide the chat area inside the collaboration dialog
	 */
      chat: function() {
         //hide or unhide the chat area
         if (this._chat == false) {
            this._chat = true;
            this.positionChatDialog();
    		dojo.style(dojo.byId("chatDialog"),'display','');
            this.chatInput.focus();
            this.chatArea.scrollTop = this.chatArea.scrollHeight; //always scroll to the bottom
         }else {
            this.closeChat();
         }     
      },

      /** 
       * close the chat dialog
       */
     closeChat: function() {
          dojo.style(dojo.byId("chatDialog"),'display','none');
          this._chat = false;
      },
      
      
      /**
       * positions the chat dialog within the collaboration dialog
       */
      positionChatDialog: function() {
    	 var pos;
    	 if (this.chatMoved) {
    		 pos = dojo.position(dojo.byId("chatDialog"));
    	 }else {
    		 //chat dialog was not moved. Position it relative to the chat button.
    		pos = dojo.position(this.chatButton.domNode);
			dojo.style('chatDialog','top',pos.h+'px');
			dojo.style('chatDialog','left',pos.x+'px');
    	 }
		if (pos.x + this.MAX_CHAT_WIDTH > document.documentElement.clientWidth) {
			//The chat window is too wide for the browser size. Shift the chat window left		
			dojo.style('chatDialog','left', document.documentElement.clientWidth - this.MAX_CHAT_WIDTH +'px');			
		}

		if (pos.y + this.MAX_CHAT_HEIGHT > document.documentElement.clientHeight) {
			dojo.style('chatDialog','top', document.documentElement.clientHeight - this.MAX_CHAT_HEIGHT +'px');			
		}
  
          
      },
      
      

	
		/**
		 * Adds the onclick handler to the iFrame document each time a new document is loaded.
		 */
		_addOnclickHandlerToIFrame: function(){
			console.log("@override: _addOnclickHandlerToIFrame");
  		  	var parent = this;
			dojo.withDoc(this.collaborationDialogContentPane.domNode.contentWindow.document, function() {
				dojo.query('html').addClass("HTMLInCollaborationDialog");
				dojo.connect(dojo.doc, "onclick", parent, 'click');
				parent.disableQuickInfoButtons();		
				parent.clickIfPageLoaded(); //execute delayed javascript actions
				
				if (!collaboration.widget.CoshopUtilities.followCurrencyChange) {
					try {
						dojo.byId('currencySelection').disabled = true;
					}catch (err) {}
				}
				if (!collaboration.widget.CoshopUtilities.followLanguageChange) {
					try {
						dojo.byId('languageSelection').disabled = true;
					}catch (err) {}
				}

			});
		},
       

		/**
		 * Invoked when the top category links are clicked,the URL associated with the drop down is sent to the peer before it's loaded in the browser.   
		 */
		topCategoryClicked: function (url) {
			if (this._hasCollaborationControl && this._followMeEnabled) {
				this.sendPageWithURL(url);		
			}
		},
		
		
		/**
		 * Disabling all quick info buttons in the page that is loaded in the collaboration dialog
		 */
		disableQuickInfoButtons:function() {
			dojo.withDoc(this.collaborationDialogContentPane.domNode.contentWindow.document, function() {				
				dojo.query('.main_quickinfo_button').forEach(function(node) {dojo.style(node,'display','none');});
				dojo.query('.rightside_quickinfo_button').forEach(function(node) {dojo.style(node,'display','none');});
				dojo.query('.compare_quickinfo_button').forEach(function(node) {dojo.style(node,'display','none');});				
			});
			
			this.disableOnclickActions();
		},
		
       /**
        * display message in the collaboration dialog. It'll use the store's error reporting mechanism. 
        * @param {boolean} isError a flag that indicates if the message to be displayed is an error message or not.
        */
		displayMessage: function(message, isError){
				if (isError) {
					this.collaborationDialogContentPane.domNode.contentWindow.eval(
							'MessageHelper.displayErrorMessage("'+
								message
							+'",0,false)'
					);
				}else {
					this.collaborationDialogContentPane.domNode.contentWindow.eval(
							'MessageHelper.displayStatusMessage("'+
								message
							+'",0)'
					);
				}			
		},
	   	
		/**
		 * display a message warning user that drag and drop is disabled
		 */
	   	dndDisabled:function () {
			this.displayMessage(this._messages["DND_DISABLED"], true);
	   	},
	   	
	   	/**
	   	 * Result handler invoked when a dialogStatusEvent event is received.  Sets the appropriate status connected/disconnected and peer window open/closed.
	   	 */
		_handleDialogStatusEvent: function(data){
			console.log("@override _handleDialogStatusEvent: " + data);
			
			if ( data == "peerDialogOpened"){
				this.collaborationDialogPeerWindowStatus.innerHTML = this.peerWindowOpenString;
				dojo.byId('collaborationDialogPeerWindowStatus').className='icons window_open';
				dojo.cookie("peerDialogStatus","peerDialogOpened");
			}
			if ( data == "peerDialogClosed"){
				this.collaborationDialogPeerWindowStatus.innerHTML = this.peerWindowClosedString;
				dojo.byId('collaborationDialogPeerWindowStatus').className='icons window_closed';
				dojo.cookie("peerDialogStatus","peerDialogClosed");
			}
			if ( data == "peerConnected"){
				this.chatButton.attr("disabled", false);
				this.collaborationDialogConnectionStatus.innerHTML = this.connectedString;
				dojo.byId('collaborationDialogConnectionStatus').className='icons connected';
			}
			if ( data == "peerDisconnected"){
				this.collaborationDialogConnectionStatus.innerHTML = this.disconnectedString;
				dojo.byId('collaborationDialogConnectionStatus').className='icons disconnected';

				//If followMe is enabled call the button handler to disable followMe and change the status
				if (this._followMeEnabled){
					this.followMe();
				}
				
				//Disable the buttons that will try to send data to the peer
				this.sendPageButton.attr("disabled", true);
				this.followMeButton.attr("disabled", true);
				this.stopFollowingButton.attr("disabled",true);
				this.grantControlButton.attr("disabled", true);
				this.highlightButton.attr("disabled", true);
				this.chatButton.attr("disabled", true);
				dojo.style('chatDialog', 'display','none'); //hide the chat area
						
				//Reset all toggle buttons to un-toggled state
				this.followMeButton.attr('checked', false);
				this.highlightButton.attr('checked', false);
				
				//this will ensure that future iFrame loads don't disable the Browser buttons since it keys off whether the user has control
				this._hasCollaborationControl = true;
				//enable the browser controls so the user can navigate the collaboration dialog after the session is over
				this.updateBrowserHistoryButtons(true);
			}					
		},
		
	    /**
	     * update chat area in peer's collaboration dialog
	     * @param {string} chat The chat message.  
	     */
	    _handleChat: function(chat){
	      if (this._chat == false){
	          this._chat = true;            
	  		dojo.style(dojo.byId("chatDialog"),'display','');
	  		this.positionChatDialog();
	      }
	 
	      this.chatInput.focus();
	      this.updateChatArea(chat.from, chat.message, 'followerMsg');
	      this.collaborationDialogBorderContainer.layout();
	      this.collaborationDialogBorderContainer.resize();
	    }		
		
		/**
		 * Send a page to a peer so that it'll be loaded in peer's dialog
		 * @param {String} url The URL to be loaded
		 */
		,sendPageWithURL:function(url) {
			this.sendDataEvent('{"collaborationData":{"url":"' + url + '"}}');
		},
		

		/** Setting the widget sizes for iPad**/
		setBorderContainerSizeForIpad: function(){
		   var screenHeight;
		   var screenWidth;
	    	//iPad incorrectly reports width and height regardless of the orientation. Have to hardcode. 
			switch(window.orientation) {
	    		case 0: case 180:
	    			screenHeight = 948;
	    			screenWidth = 768;
	    			break;
	    		case 90: case -90: 
	    			screenHeight = 693;
	    			screenWidth = 1024;
	    			break;
			}
			dojo.style(this.domNode, "height", "100%");
			dojo.style(this.domNode, "width", "100%");
			dojo.style(this.collaborationDialogBorderContainer.domNode, "height", screenHeight + "px");
			dojo.style(this.collaborationDialogBorderContainer.domNode, "width", "100%");		
			
			borderContainerHeight = this.collaborationDialogBorderContainer.domNode.offsetHeight;
			borderContainerWidth = this.collaborationDialogBorderContainer.domNode.offsetWidth;
		
			topHeight = this.collaborationDialogBorderContainerTop.domNode.offsetHeight;
			bottomHeight = this.collaborationDialogBorderContainerBottom.domNode.offsetHeight;
	
			height = screenHeight - topHeight  - bottomHeight;

			dojo.style(this.collaborationDialogIFrame.mobileIFrameContainer, "height", height + "px");
			dojo.style(this.collaborationDialogIFrame.mobileIFrameContainer, "width",  "100%");			
		}		
});

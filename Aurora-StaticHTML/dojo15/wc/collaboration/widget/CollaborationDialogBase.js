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
 * This file is represents a generic collaboration dialog
 * @version 1.0
 * 
 **/

/**
* @class This class is the base object from which collaboration dialogs should extend.
*
**/

dojo.provide("collaboration.widget.CollaborationDialogBase");
dojo.declare("collaboration.widget.CollaborationDialogBase",[],{
	absoluteURIPath:null,
	ignoreFutureRequests: false,
	pageOutOfSync:false, //keeps track of whether the pages are out of sync
	nextURL: null,

    /**
     * customize the look and feel of the action buttons
     */
    styleButtons:function() {
		//BACK button, replace the CEA back button with commerce back button
		this.backButton.destroyRecursive(); 
		this.backButton = this.addButton(this.backButtonString, 'back', 'collaborationDialogWidgetIcon collaborationDialogWidgetBackIcon');
		this.backButton.placeAt(this.forwardButton.domNode,"before");
		
		//HIGHLITE button, 
		this.highlightButton.destroyRecursive();
		this.highlightButton = this.addButton(this.highlightButtonString, 'highlight', 'collaborationDialogWidgetIcon collaborationDialogWidgetHighlightIcon');
		this.highlightButton.placeAt(this.refreshButton.domNode,"after");
		  
		//LEAD button
		this.followMeButton.destroyRecursive();
		this.followMeButton = this.addButton(this.followMeButtonString, 'followMe', 'collaborationDialogWidgetIcon collaborationDialogWidgetFollowMeIcon');
		this.followMeButton.placeAt(this.refreshButton.domNode,"after");
		
		//STOP FOLLOWING Button		
		this.stopFollowingButton = this.addButton(this._messages["STOP_FOLLOWING_BUTTON"], 'stopFollowingOrLeading','collaborationDialogWidgetIcon collaborationDialogWidgetStopFollowingIcon');
		this.stopFollowingButton.placeAt(this.followMeButton.domNode,"after");
		
		//CHAT button. with no text.
		this.chatButton = this.addButton(this._messages["CHAT_BUTTON"], 'chat','collaborationDialogWidgetIcon collaborationDialogWidgetChatIcon');
		this.chatButton.placeAt(this.highlightButton.domNode, "before");
		
		
		//HELP button. with no text.
		if(!this.isMobile) {
			this.helpButton = this.addButton(this._messages["HELP"], 'help','collaborationDialogWidgetIcon collaborationDialogWidgetHelpIcon');
			this.helpButton.placeAt(this.highlightButton.domNode, "after");		
		}
		//END collaboration dialog button
		this.endCollabButton = this.addButton(this._messages["END_COLLAB"], 'onCancel','collaborationDialogWidgetIcon collaborationDialogWidgetEndCollabIcon');
		if(!this.isMobile) {
			this.endCollabButton.placeAt(this.helpButton.domNode, "after")
		}else {
			this.endCollabButton.placeAt(this.highlightButton.domNode, "after")
		}
		 
		//In Commerce, we don't want the 'grant control' button
		dojo.style(this.grantControlButton.domNode,'display','none');
		
		//adding a padding, and divider to the follow me, chat button
		if (!this.isMobile) {
			var divider1 = dojo.create("span", {innerHTML:"<span>&nbsp</span>"});
			var divider2 = dojo.create("span", {innerHTML:"<span>&nbsp</span>"});
			var divider3 = dojo.create("span", {innerHTML:"<span>&nbsp</span>"});
			  
			this.collaborationDialogButtons.appendChild(divider1);   	
			this.collaborationDialogButtons.appendChild(divider2);
			this.collaborationDialogButtons.appendChild(divider3);
			  	
			dojo.addClass(divider1,'collaborationDialogWidgetIconDivider');
			dojo.addClass(divider2,'collaborationDialogWidgetIconDivider');
			dojo.addClass(divider3,'collaborationDialogWidgetIconDivider');
				
			dojo.place(divider1,this.followMeButton.domNode, "before");
			dojo.place(divider2,this.chatButton.domNode, "before");
			dojo.place(divider3,this.helpButton.domNode, "before");
		}
    },
	
	/**
	 * enter follow mode.
	 */
	enterFollowMe:function() {
    	if (!this.isMobile) {
    		dojo.cookie("coShoppingDisableDnd",true);
    	}
   		this.followMeButton.attr('checked', true);
   		this._followMeEnabled = true;
   		this._toggleCollaborationDialogButtons();
   		this._toggleCollaborationDialogStatus();
	},
	
	
	/**
	 * exit follow mode.
	 */
	exitFollowMe:function() {
		this._followMeEnabled = false;
		this.followMeButton.attr("checked",false);
		if (!this.isMobile) {
			dojo.cookie("coShoppingDisableDnd",null,{expires:-1}); //can drag and drop
		}
	},
	
	/**
	 * Toggles buttons in the collaboration dialog. 
	 * If this widget hasCollaborationControl enable the buttons to drive the collaboration session
	 */
	_toggleCollaborationDialogButtons: function(){
		console.log("@override _toggleCollaborationDialogButtons");
		this.inherited(arguments);
			
		if (this._hasCollaborationControl == false) {
			//don't have control
			this.followMeButton.attr("disabled", false);
			this.followMeButton.attr("checked", false);
			this.stopFollowingButton.attr('label',this._messages["STOP_FOLLOWING_BUTTON"]);
		}else {
			this.stopFollowingButton.attr('label',this._messages["STOP_LEADING_BUTTON"]);
		}
		
		if (this.collaborationDialogActionStatusStatus.innerHTML == this._messages["INDEPENDENT_SHOPPING"]) {
			this.stopFollowingButton.attr('label',this._messages["INDEPENDENT_SHOPPING"]);
		}

	},	
	
	/**
	 * change collaboration session status depending on if the widget has collaboration control
	 */
	_toggleCollaborationDialogStatus: function(){
		if (this._hasCollaborationControl == true) {
			if (this._followMeEnabled){
				this.collaborationDialogActionStatusStatus.innerHTML =  this._messages["LEADING_COSHOPPING"];
				dojo.byId('collaborationDialogActionStatusStatus').className='icons leading';
			} else {
				this.collaborationDialogActionStatusStatus.innerHTML = this._messages["INDEPENDENT_SHOPPING"];
				dojo.byId('collaborationDialogActionStatusStatus').className='icons shopping_independently';
			}
		} else {
			if (!this._followMeEnabled){
				this.collaborationDialogActionStatusStatus.innerHTML = this._messages["INDEPENDENT_SHOPPING"];
				dojo.byId('collaborationDialogActionStatusStatus').className='icons shopping_independently';
			}else{
				this.collaborationDialogActionStatusStatus.innerHTML = this._messages["FOLLOWING_COSHOPPING"];
				dojo.byId('collaborationDialogActionStatusStatus').className='icons following';
			}
		}
	},
	
	
	/**
	 * Invoked when a iWantToStopFollowing, or iWantToStopLeading event is received. 
	 * Sets the _followMeEnabled flag in the host's dialog to false.
	 */
	handleStopFollowingOrLeading:function() {
		console.log("handleStopFollowingOrLeading entry");
		this.exitFollowMe();
		if (this._hasCollaborationControl == true) {
			this.displayMessage(this._messages["COSHOPPER_STOP_FOLLOWING"]); //show msg on host's dialog
			this.sendDataEvent('{"collaborationData":{"stopFollowConfirmation":"true"}}'); //send a msg back to follower 
		}else {
			this.displayMessage(this._messages["COSHOPPER_STOP_LEADING"]); //show msg on follower's dialog
			this.sendDataEvent('{"collaborationData":{"stopLeadingConfirmation":"true"}}'); //send a msg back to follower 			
		}
   		this._toggleCollaborationDialogButtons();
		this._toggleCollaborationDialogStatus();	
	},
	
    /**
     * exit follow mode for the follower.
     * exit leading mode for the host. 
     */
    stopFollowingOrLeading:function() {		
		//do nothing if the session is already disconnected, or each party is browsing independently. 
		if (this.collaborationDialogConnectionStatus.innerHTML == this.disconnectedString ||
			this.collaborationDialogActionStatusStatus.innerHTML == this._messages["INDEPENDENT_SHOPPING"]) {
			return;
		}
		if (!this.isMobile) {
			dojo.cookie("coShoppingDisableDnd",null,{expires:-1}); //can drag and drop
		}
		this._followMeEnabled = false;
		this.followMeButton.attr('checked', false);
		//changing the styling of the follow me button. 
		dojo.removeClass(this.followMeButton.domNode,'collaborationDialogWidgetButtonChecked');
		dojo.addClass(this.followMeButton.domNode,'collaborationDialogWidgetButton');
		
		if (this._hasCollaborationControl == false) {
			this.sendDataEvent('{"collaborationData":{"iWantToStopFollowing":"' + encodeURIComponent(this.name) + ' "}}');   
		}else {
			this.sendDataEvent('{"collaborationData":{"iWantToStopLeading":"' + encodeURIComponent(this.name) + ' "}}');
		}
		this.displayMessage(this._messages["INDEPENDENT_SHOPPING"])
		this._toggleCollaborationDialogButtons();
		this._toggleCollaborationDialogStatus();		
    },

	/**
	 *Invoked when the widget receives data sent by the peer.  
	 *Parses the JSON response and calls the correct CollaborationDialog data handler
	 *@param {Object} event JSON object returned from the server containing collaboration information.
	 */
	handleResult:function(event){
		console.log("@override handleResult");	
		if ( event.type == 0 ){
			var data = event.data;
			if (data.dialogStatusEvent){
				this._handleDialogStatusEvent(data.dialogStatusEvent);
			}

			if (data.highlight && this.pageOutOfSync == false){
					this._handleHighlight(data.highlight);
			}
			
			if (data.grantControl){
				this._handleGrantControl(data.grantControl);
			}
			
			if (data.acceptGrantControl) {
				this.ignoreFutureRequests = false;
				this.displayMessage(this._messages['LEADING_COSHOPPING']);
			}
			
			if (data.declineGrantControl) {
				this.ignoreFutureRequests = false;
			}
			
			if (data.peerCanControlCollaboration){
				this._handlePeerCanControlCollaboration(data.peerCanControlCollaboration);
			}
						
			if (data.pageChanged){
				var myPage = collaboration.widget.CoshopUtilities.processURL(this.collaborationDialogContentPane.domNode.contentWindow.document.location.href);
				var theirPage = collaboration.widget.CoshopUtilities.processURL(data.pageChanged);				
				//since we are comparing URLs we need to apply the same rewrite logic we used during a sendpage before comparing.
				myPage = this._sendPageUrlRewriteCallback(myPage);
				if (this._hasCollaborationControl == true){
					/**
					 * The follower may finish loading the page before the leader does. We'll get an erroneous pageOutOfSync warning. 
					 * To prevent this, we'll compare the leader's current page, and the page that will be loaded next(if not null) to the follower's page.
					 */
					if (this._followMeEnabled) {
						if ((this.nextURL == null || this.nextURL !=theirPage) && myPage!=theirPage && theirPage.indexOf('SetCurrencyPreference')<0)
						{
							this.pageOutOfSync = true;
							this.sendDataEvent('{"collaborationData":{"pageOutOfSync":"true"}}'); //send a msg back to follower 			
							this.displayMessage(this.pagesNotInSyncString,true);
						}else {
							this.pageOutOfSync = false;
						}
					}	
						
					this.nextURL = null;							
				} else {
					if (this._followMeEnabled) {
						if (data.pageChanged.indexOf('coshopChangeCurrency')>-1 && collaboration.widget.CoshopUtilities.followCurrencyChange) {
							//changing currency
							var currencyCode = data.pageChanged.substr(
								data.pageChanged.indexOf('coshopChangeCurrency') + 'coshopChangeCurrency'.length +1, 3);
							var url = this.absoluteURIPath+
								"SetCurrencyPreference?currency="+currencyCode+
								"&URL="+data.pageChanged;		
							this.collaborationDialogContentPane.domNode.contentWindow.document.location.href =url;
						}else if (collaboration.widget.CoshopUtilities.followLanguageChange && data.pageChanged.indexOf('langId')>-1) {
							//changing language
							this.collaborationDialogContentPane.domNode.contentWindow.document.location.href =data.pageChanged;
						}else if (collaboration.widget.CoshopUtilities.loadIfPageChanged(data.pageChanged)){
							//follow search
							this.collaborationDialogContentPane.domNode.contentWindow.document.location.href =data.pageChanged;
						}
					}
				}
			}
			
			if(data.chat){
				this._handleChat(data.chat);
			}
			
			if (data.pageOutOfSync) {
				this.pageOutOfSync = true;
			}
			
			if (data.grantMeControl) {
				if (!this.isMobile) {
						
					var desc =	this._messages['PERMISSION_DIALOG_DESC'].replace("$1", decodeURIComponent(data.grantMeControl));
					var desc2 = this._messages['PERMISSION_DIALOG_DESC2'].replace("$1", decodeURIComponent(data.grantMeControl));										
						
					dojo.byId('permissionDialogDesc').innerHTML= desc;
					dojo.byId('permissionDialogDesc2').innerHTML= desc2;
										
					dojo.byId('permissionDialogDesc').setAttribute('title', desc);
					dojo.byId('permissionDialogDesc2').setAttribute('title', desc2);
					
					dojo.style(dijit.byId('permissionDialogDijit').titleBar,'display','none');				
					dijit.byId('permissionDialogDijit').show();
				} else{
					//mobile version of granting control
					var desc1 = this._messages["PERMISSION_DIALOG_DESC"].replace("$1", decodeURIComponent(dojo.trim(data.grantMeControl)));
					var desc2 = this._messages["PERMISSION_DIALOG_DESC2"].replace("$1", decodeURIComponent(dojo.trim(data.grantMeControl)));
					var pDialogConfirm = window.confirm(desc1 + "\n\n" + desc2);
				
					if (pDialogConfirm) {
						this.acceptGrantControl();
					}else {
						this.declineGrantControl();
					}
				}				
			}
			
			if (data.iWantToStopFollowing || data.iWantToStopLeading){
				this.handleStopFollowingOrLeading();
			}
			
			if (data.peerEndedSession){
				this.handlePeerEndedSession();
			}
			
			if (data.peerFollowMeClickBlocked){
				this.displayMessageArea("collaborationDialogWidgetWarningIcon", this.peerUnableToFollowString, false, true);
			}
			
			if (data == "EVENT_POLLING_REPLACED") {
				this.displayMessageArea("collaborationDialogWidgetWarningIcon", this.eventPollingReplacedString, false, true);	
			}
			if (data == "EVENT_POLLING_FAILED") {
				this.displayMessageArea("collaborationDialogWidgetErrorIcon", this.eventPollingFailedString, false, true);
			}
			
			//The following data events should only be processed when the widget does not have collaboration control
			if (this._hasCollaborationControl == false){
				if(data.url) {
					this._handleSendPage(data.url);	
					this.pageOutOfSync = false;
				}
				if (data.followMe){
					this._handleFollowMe(data.followMe);
					this.pageOutOfSync = false;

				}

				if (data.syncAndFollowMe && !this.isMobile) {
					//sync the page first
					this.collaborationDialogContentPane.domNode.contentWindow.document.location.href =data.syncAndFollowMe.URL;
					//then set nodeToClick, which will be used by clickIfPageLoaded()
			  		this.nodeToClick = data.syncAndFollowMe.node;
					this.pageOutOfSync = false;
				}

			}
		}
		else if (event.type == 3){
			if (this._hasCollaborationControl == true){
				this.displayMessageArea("collaborationDialogWidgetWarningIcon", this.failoverEventActiveString, false, true);
			}
			else {
				this.displayMessageArea("collaborationDialogWidgetWarningIcon", this.failoverEventPassiveString, false, true);
			}
		}
	},

	
	/**
	 * Invoked when the user clicks the 'Follow' button for this widget
	 */
	followMe: function(){
	  if (this._hasCollaborationControl && this._followMeEnabled == true) {
		//already have control, do nothing
		console.log("already have control. do nothing");
		return;
	  }
	  if (this.ignoreFutureRequests == false) {
		//don't have control, ask for permission to lead
		this.sendDataEvent('{"collaborationData":{"grantMeControl":"' + encodeURIComponent(this.name) + ' "}}'); 
		
		//request is sent and waiting for reply.Set this flag to true to prevent multiple permission dialogs.
		this.ignoreFutureRequests = true;  
	  }
	},
	
	/**
	 * accept request to lead the coshopping session
	 */
	acceptGrantControl:function() {
		if (!this.isMobile) {
			console.log("accepting request");
			dojo.cookie("coShoppingDisableDnd",true);
			dijit.byId('permissionDialogDijit').hide();
		}
		this.grantControl();
		this.displayMessage(this._messages['FOLLOWING_COSHOPPING']);
		this.sendDataEvent('{"collaborationData":{"acceptGrantControl":" true "}}');
		this._followMeEnabled = true;
  	  	this._toggleCollaborationDialogStatus();
  	  	this._toggleCollaborationDialogButtons();
	},
	
	/**
	 * Result handler invoked when a grantControl event is received.
	 */
	_handleGrantControl: function(url){
		this._hasCollaborationControl = true;
		dojo.cookie("hasCollaborationControl",true);
		this._toggleCollaborationDialogButtons();
		this.enterFollowMe();
	},
	
	/**
	 * decline follower's request to lead the coshopping session
	 */
	declineGrantControl:function() {
		console.log("declining request");
		this.sendDataEvent('{"collaborationData":{"declineGrantControl":" true "}}');
		if (!this.isMobile) {
			dijit.byId('permissionDialogDijit').hide();
		}
	},

    /**
     * send chat over to peer
     */
    sendChat:function(){
       var chat = encodeURIComponent(this.chatInput.attr('value'));
       console.log(chat);
       
       if (this.collaborationDialogConnectionStatus == this.connectedString) {
	         this.updateChatArea(this.name, this._messages["CHAT_WHEN_DISCONNECTED"], 'chatError');
       }else if(chat.length > 0) {
	         this.sendDataEvent('{"collaborationData":{"chat":{"from":"' + encodeURIComponent(this.name) +'","message":"'+ chat + '"}}}');
	         
	         //clear the chat message
	         this.chatInput.attr('value', '');
	         if (!this.isMobile) {
		         this.chatInput.focus();
	         }
	         //updating own chat area
	         this.updateChatArea(this.name, chat, 'hostMsg');
       }
    },
					

    
    /**
     * update the chat area with the newly typed message
     * @param {string} name The person who typed the message
     * @param {string} newMsg The message that was sent over    
     */
    updateChatArea:function (name, newMsg,msgStyle) {
  	  var currentChat;
  	  
  	  if (this.isMobile) {
  		  currentChat = this.chatArea.innerHTML;    	  
  	  } else {
  		  currentChat = this.chatArea.value
  	  }
  	  newMsg = decodeURIComponent(newMsg)
  	  name = '[' + decodeURIComponent(name) + ']: ';
  	  if (currentChat.length > 0) {
  	 	  if (this.isMobile) {
  	 		this.chatArea.innerHTML=currentChat + '<p class="'+msgStyle+'">' + '[' + this.getCurrentTime() + ']' + name + newMsg +'</p>';  	 		  
  	 	  }else {
  		this.chatArea.value=currentChat + '[' + this.getCurrentTime() + ']' + name + newMsg +'\n\n';
  	 	  }
  	  }else {
  		  if (this.isMobile) {
    		  this.chatArea.innerHTML='<p class="'+msgStyle+'">' +'[' + this.getCurrentTime() + ']' + name + newMsg +'</p>';  			  
  	  }else {
  		  this.chatArea.value='[' + this.getCurrentTime() + ']' + name + newMsg +'\n\n';
  	  }
  	  }
  	  
  	  if (!this.isMobile){
  	  	  (this.chatArea).scrollTop = this.chatArea.scrollHeight; //scroll to the bottom
  	  }else {
  		this.chatArea.scrollTop = 99999; //scroll to bottom
  	  }
    },
    

    /**
     * get current time
     */
    getCurrentTime:function(){
		
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        if (minutes < 10){
           minutes = "0" + minutes;
        }
						
        if (seconds < 10){
           seconds = "0" + seconds;
        }
        if(hours > 11){
           return hours + ":" + minutes + ":" + seconds + " " + "PM";
        }
        else {
           return hours + ":" + minutes + ":" + seconds + " " + "AM";
        }
     },
     
	/**
	 * invoked after peer ends coshopping session
	 */
	handlePeerEndedSession:function () {
		var self = this;
 	 	this.displayMessage(this._messages["PEER_ENDED_SESSION"],true);
    	 if (!this.isMobile) {
    		 dojo.cookie("coShoppingDisableDnd",null,{expires:-1}); //can drag and drop
    	 }
    	 
		 setTimeout(function(){
    		 self.onCancel();
		 },3000);
	},
    
    /**
     * Result handler invoked when a dialogStatusEvent event is received.  
     * Sets the appropriate status connected/disconnected and peer window open/closed.
     * @param {Object} data JSON object returned from the server
     */
    _handleDialogStatusEvent: function(data){
  	  this.inherited(arguments);
  	  if ( data == "peerDisconnected"){
  		this.stopFollowingButton.attr("disabled", true);
  		this.chatButton.attr("disabled", true);
  	  }
    },	
    
	/**
	* Handler for all click events within the CollaborationDialog iFrame	
	* @param {Object} e HTML element that was clicked.
	*/
  	click: function(e) {
	  	var parent = this;
		var nodeToUse = null;
		
		if (e.target.nodeName!=='A') {
			//the node being clicked on is not a link. check the parent
			if (e.target.parentNode.nodeName=='A') {
				//the parent is A. use this node
				nodeToUse = e.target.parentNode;
			}else {
				//both child and parent are not links. Ignore this click	
				console.log("customers didn't click on an anchor. Node id: ", e.target.id);
				return;
			}
		}else {
			//this node is already a link. Use it. 
			nodeToUse = e.target;
		}
		
			if (nodeToUse.id == 'clickableErrorMessage' || nodeToUse.id == 'clickableErrorMessageImg') {
				//the close button in the error/status display is clicked. Do not send the link to the peer. 
				return;
			}else if (dojo.indexOf(collaboration.widget.CoshopUtilities.socComNonClickableCSS, nodeToUse.className)>-1) {
			 	e.preventDefault(); 
			 	parent.displayMessage(this._messages["LINK_DISABLED"],true);	     
			 	return;
			}else if (nodeToUse.getAttribute('dojoattachevent') != null || nodeToUse.getAttribute('dojoattachpoint') !== null) {
				//this link is part of a dojo widget. The click handler will not be able to capture the click. 
				//enable this link, but do not send it to the peer
				return;	
			}else if (collaboration.widget.CoshopUtilities.isLinkClickable(nodeToUse) || (nodeToUse.className == collaboration.widget.CoshopUtilities.addToCartIndicator) ) {
				//element is clickable and it's an anchor, send this link to peer
		  
			  if (!this._followMeEnabled || !this._hasCollaborationControl) {
				  //don't have control of the session, or peer is not following
				  return;
			  }

		  if ( nodeToUse.href && nodeToUse.href.indexOf("http://") != -1 ){
			  if (nodeToUse.href.toLowerCase().indexOf("javascript:") ==-1) {
    			/**
    			 * handle links like <a href="http://ibm.com">Link</a>
    			 */
				this.nextURL = nodeToUse.href;
				this.sendDataEvent('{"collaborationData":{"url":"' + nodeToUse.href + '"}}');			        				  
			  }else {
				 /**
				  * handle links like <a href="javascript:dosomething();">Link</a>
				  */
      			if (this.pageOutOfSync) {
      				this.nextURL = this.collaborationDialogContentPane.domNode.contentWindow.document.location.href;
    				this.sendDataEvent('{"collaborationData":{"syncAndFollowMe": {"URL":"'
    						+this.collaborationDialogContentPane.domNode.contentWindow.document.location.href
    						+'","node":'
    						+this._identifyNode(nodeToUse)  + '}}}');
    			}else {	//pages are in sync, 
    				this.sendDataEvent('{"collaborationData":{"followMe":' + this._identifyNode(nodeToUse) + '}}');
    			}
			 }
		  }else {
			//fail over case
      		if (this.pageOutOfSync) {
      				this.nextURL = this.collaborationDialogContentPane.domNode.contentWindow.document.location.href;
    				this.sendDataEvent('{"collaborationData":{"syncAndFollowMe": {"URL":"'
    						+this.collaborationDialogContentPane.domNode.contentWindow.document.location.href
    						+'","node":'
    						+this._identifyNode(nodeToUse)  + '}}}');
    			}else {	
    				this.sendDataEvent('{"collaborationData":{"followMe":' + this._identifyNode(nodeToUse) + '}}');
    			}						
		  }		        		  	    				  
	  }else {	  
		 e.preventDefault(); 
		 parent.displayMessage(this._messages["LINK_DISABLED"],true);	           		  
	  }
  	},		
  	
	/**
	 * Invoked when the user clicks the 'Highlight' button for this widget
	 */
	highlight: function(){		
  		if (this.highlightButton.get('checked') == true) {
  	  		this.highlightButton.set('checked',false);
  			dojo.disconnect(this.touchHandle);
			dojo.disconnect(this.clickHandle);
			dojo.disconnect(this.mouseMoveHandle);
  		}else {	
  	  		this.highlightButton.set('checked',true);
  			var self = this;
  			/**
  			 * Overriding CEA's default highlight function to add support to iPad
  			 */
  			if(!(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Android/i))) { 
  				//If not one of the supported mobile browsers default to click/mouseover highlighting instead of touch
  				this.highlightForNonTouch();
  				return;
  			}
  			//Set the dojo context to the iFrame document
  			var iframeDoc = this.collaborationDialogContentPane.domNode.contentWindow.document;
  			dojo.withDoc(iframeDoc, function() {

  				self.touchHandle = dojo.connect(dojo.doc, 'ontouchstart', function(e){
  					// skip processing if this is event is part of a gesture
  					if ( e.touches.length == 1){
  						
  						//If we happen to touch an actionable element this will stop the highlight touch from taking the action
  						e.preventDefault();
  						e.cancelBubble = true;
  						e.returnValue = false;
  						
  						//If the click was on text this will set the target to the parentNode
  						var target = e.target;
  						if (target.nodeType == 3){
  							target = target.parentNode;
  						}
  						
  						if(!self._isHighlightable(target)){
  							//at this point a unhighlightable element was clicked.  Show the message and disconnect the handlers 
  							self.displayMessage(self._messages['CANNOT_HIGHLIGHT'], true);
  							
  							dojo.disconnect(self.touchHandle);
  							
  							self.highlightButton.set('checked', false);
  							return;
  						}
  							
  						//at this point a highlightable element was clicked.  Disconnect the handler
  						dojo.disconnect(self.touchHandle);
  						
  						//after element is highlighted, revert highlight button back to unchecked
  						self.highlightButton.set('checked', false);
  								
  						//if a previous target was highlighted remove the highlight style
  						if(self.oldSentHighlightTarget){
  							dojo.removeClass(self.oldSentHighlightTarget, 'collaborationDialogWidgetSentHighlight');
  						}
  						
  						self.sendDataEvent('{"collaborationData":{"highlight":' +self._identifyNode(target)+ '}}');
  						self.oldSentHighlightTarget = target;
  						dojo.addClass(target, 'collaborationDialogWidgetSentHighlight');
  					}
  					
  				});
  			}, this);			
  		}	
	},
  	
  	/**
  	 * Invoked when the user is using the widget in a browser that doesn't support touch
  	 */
	highlightForNonTouch: function(){
		var self = this;
		
		//If the current status message was the unableToHighlight message, remove that message.  
		var messageHTML = this.collaborationDialogMessageAreaMessage.innerHTML;
		if (messageHTML.indexOf(this.unableToHighlightString)>0){
			this.hideMessageArea();
		}
	
		//Set the dojo context to the iFrame document
		var iframeDoc = this.collaborationDialogContentPane.domNode.contentWindow.document;
		dojo.withDoc(iframeDoc, function() {
		    
			//connect a handler to the onmousemove event so that the highlight can follow the mouse
			self.mouseMoveHandle = dojo.connect(dojo.doc, 'onmousemove', function(e){

				var isHighlightableElement = self._isHighlightable(e.target);
				
				//if its a new target and a highlightable element apply the highlight style
				if(e.target != self.oldHoverTarget && isHighlightableElement){
					
					if(self.oldHoverTarget){ 
						dojo.removeClass(self.oldHoverTarget, 'collaborationDialogWidgetSentHighlight'); 
						
						if (self.tempHighlightOnclick){
							self.oldHoverTarget.onclick = self.tempHighlightOnclick;	
						}
						self.tempHighlightOnclick = e.target.onclick;
						e.target.onclick = null;
					}
					dojo.addClass(e.target, 'collaborationDialogWidgetSentHighlight');

					self.oldHoverTarget = e.target;
				}
				
				//if the target is not a highlightable element remove the highlight style from the old target
				if(!isHighlightableElement){
					if (self.oldHoverTarget){
						dojo.removeClass(self.oldHoverTarget, 'collaborationDialogWidgetSentHighlight');
						
						if (self.tempHighlightOnclick){
							self.oldHoverTarget.onclick = self.tempHighlightOnclick;	
						}
						self.tempHighlightOnclick = e.target.onclick;
						e.target.onclick = null;
					}
					self.oldHoverTarget = e.target;
				}
			});
			
			// Handle the next click on the iFrame document
			self.clickHandle = dojo.connect(dojo.doc, 'click', function(e){
				console.log("highlightForNonTouch clicked: " + e.target);
				
				//If we happen to click an actionable element this will stop the highlight click from taking the action
				dojo.stopEvent(e);
				
				//Now that the click has happened we can set the onclick function back to the domNode
				e.target.onclick = self.tempHighlightOnclick;
				
				if(!self._isHighlightable(e.target)){
					//at this point a unhighlightable element was clicked.  Show the message and disconnect the handlers 
					self.displayMessage(self._messages['CANNOT_HIGHLIGHT'], true);

					dojo.disconnect(self.clickHandle);
					dojo.disconnect(self.mouseMoveHandle);
					
					self.highlightButton.set('checked', false);
					return;
				}
				
				//at this point a highlightable element was clicked.  Disconnect the handlers
				dojo.disconnect(self.clickHandle);
				dojo.disconnect(self.mouseMoveHandle);
				
				//after element is highlighted, revert highlight button back to unchecked
				self.highlightButton.set('checked', false);
				
				
				//if a previous target was highlighted remove the highlight style
				if(self.oldSentHighlightTarget){
					dojo.removeClass(self.oldSentHighlightTarget, 'collaborationDialogWidgetSentHighlight');
				}
				
				self.sendDataEvent('{"collaborationData":{"highlight":' +self._identifyNode(e.target)+ '}}');
				self.oldSentHighlightTarget = e.target;
				dojo.addClass(e.target, 'collaborationDialogWidgetSentHighlight');
			});
			
		}, this);
	
	},
  	
  	/**
  	 * determine if a node is highlightable
  	 */
  	_isHighlightable: function (node){
  		return collaboration.widget.CoshopUtilities.isHighlightable(node,this.isMobile);
  	},
	
	/**
	 * This function disables onclick actions from links that are disabled. 
	 */
	disableOnclickActions:function() {			
		var parent = this;
		dojo.withDoc(this.collaborationDialogContentPane.domNode.contentWindow.document, function() {	
			dojo.query('a').forEach(function(n){
				if (n.getAttribute('dojoattachevent') != null || n.getAttribute('dojoattachpoint') != null) {
						//this link is part of a dojo widget. The click handler will not be able to capture the click. Enable this link
						return;
				}else	if (!collaboration.widget.CoshopUtilities.isLinkClickable(n) && n.className!=collaboration.widget.CoshopUtilities.addToCartIndicator) {
					//if the node is not clickable, ignore the onclick actions		
					if (!parent.isMobile) {
						n.onclick=null;
						n.removeAttribute('href');
						n.removeAttribute('onclick');
						n.removeAttribute('onkeypress');
						n.style.cursor='not-allowed';						
					}else {
						n.removeAttribute('onclick');
					}
				}
			});
		});
	},
	
    /**
     * place holder functions. These functions should be extended.
     */
    chat:function() {},
    closeChat:function() {},
    _handleChat: function(chat){},
    help:function() {},
    onCancel:function(){},
    displayMessage: function(message){},
	displayMessageArea: function(icon, message, bool_ok, bool_close){}
});
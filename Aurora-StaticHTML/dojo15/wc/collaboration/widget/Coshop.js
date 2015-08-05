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
* This javascript is used to create a coshopping widget. 
* @version 1.0
* 
**/

/**
* @class This javascript is used to create a coshopping widget. 
*
**/


   dojo.provide("collaboration.widget.Coshop");
   

   dojo.require("cea.widget.Cobrowse");
   dojo.require("dojo.cookie");
   dojo.require("collaboration.widget.WCButton");
   dojo.require("collaboration.widget.CollaborationDialog");
   dojo.declare("collaboration.widget.Coshop", [cea.widget.Cobrowse],{
     templatePath:dojo.moduleUrl('collaboration.widget','Coshop/Coshop.html'),
     templateString:null,
     widgetsInTemplate: true,
     
	 hideURLField:false,
	 startInFollowMeMode:false,
	 hideSendPageButton:false, 
	 
	 name:'', // the name of the shopper
	 inviteeDialogNextButtonHandle:'',
	 isStorePreview: false, //indicate if coshopping is being viewed in store preview
	 homePageURL: null, //home page of the store
	 coshopUtilies: null, //the coshop untilities object
	 isMobile:false,
	 isTouchable: false,

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
	},
		
	 /**
	  * initialize strings used within the coshop widget
	  */
	initializeStrings:function() {
   		this.inherited(arguments);
   		    		 
   		dojo.requireLocalization("collaboration.widget", "Coshop", this.lang);
		this._messages = dojo.i18n.getLocalization("collaboration.widget", "Coshop", this.lang);
		this.endCollabButtonString        = this._messages["END_COSHOPPING"];
		this.invitationDialogHeader = this._messages["INVITATION_DIALOG_TITLE"];
		this.inviteeDialogHeader = this._messages["INVITEE_DIALOG_TITLE"];
		this.close = this._messages["CLOSE"];
    	this.pls_enter_name = this._messages["ENTER_NAME"];
    	this.invitationDialogNextButtonString = this._messages["GET_COLLAB_LINK"];
    	this.continueShopping = this._messages["CONTINUE_SHOPPING"];
    	this.inviteeDialogNextButtonString = this._messages["SAVE_AND_CONTINUE"];
    	this.coshopDialogTitle = this._messages["INVITATION_DIALOG_TITLE"];    	     	
    	this.invitation_dialog_description = this._messages["INVITATION_DIALOG_DESC"];  
    	this.invitation_dialog_instructions = this._messages["INVITATION_DIALOG_INST"];  
    	this.confirmExitString			  = this._messages["CONFIRM_END_SESSION"];  
		this.permission_dialog_title = this._messages["PERMISSION_DIALOG_TITLE"];
		this.permission_dialog_desc  =  this._messages["PERMISSION_DIALOG_DESC"];
		this.permission_dialog_desc2  =  this._messages["PERMISSION_DIALOG_DESC2"];
		this.accept  =  this._messages["PERMISSION_DIALOG_ACCEPT"];
		this.decline  =  this._messages["PERMISSION_DIALOG_DECLINE"];
		this.coshop_help  = this._messages["COSHOP_HELP"];
		this.leadIconDesc = this._messages["LEADICONDESC"];
		this.followIconDesc = this._messages["FOLLOWICONDESC"];
		this.stopIconDesc  = this._messages["STOPICONDESC"];
		this.endIconDesc  = this._messages["ENDICONDESC"];
		this.chatIconDesc  = this._messages["CHATICONDESC"];
		this.highlightIconDesc  = this._messages["HIGHLIGHTICONDESC"];
		this.helpIconDesc  = this._messages["HELPICONDESC"];
		this.continueShopping  = this._messages["CONTINUESHOPPING"];	
		this.redirectToHome = this._messages['COSHOPPING_REDIRECTING_TO_HOME'];
   	 },
   	 
	 /**
	  * Invoked after a widget has been created. 
	  */
	 postCreate:function() {
	   console.log("@override postCreate in Coshop.js");
	   dojo.connect(dojo.byId('headerCoshopping'), 'onclick', this, 'openInvitationDialog' );
	   dojo.style(this.createCollabInviteString,'display','none');//hide the collaboration invite string
	   dojo.style(this.createCollaborationButton,'display','none');//hide the collaboration invite string

	   //if the collaboration dialog is closed, end the collaboration session as well. 
	   dojo.connect(this.collaborationDialog, 'onCancel', this, 'endCollaboration');   	 
	   
	   dojo.connect(dojo.byId('invitationDialogEndCollaborationLink'),'onclick',this,'endCollaboration');
	   dojo.connect(dojo.byId('continueShoppingButton'),'onclick',this,'closeInvitationDialog');
	   
	   dojo.connect(this.coshopHelpCloseLink, 'onclick', this, 'closeHelp');
	   dojo.connect(this.helpContinueShoppingButton, 'onclick', this, 'closeHelp');
	   
	   //for accessibility 
	   dojo.connect(this.coshopHelpCloseLink, 'onkeypress', this, function(e) {
	       	 if (e!=null && e.keyCode==dojo.keys.ENTER){
	     		 this.closeHelp();
	     	 }
	   });
	   //for accessibility 
	   dojo.connect(this.helpContinueShoppingButton, 'onkeypress', this, function(e) {
       	 if (e!=null && e.keyCode==dojo.keys.ENTER){
     		 this.closeHelp();
       	 }
	   });
	   
	   this.inherited(arguments); 	
	   
	   var nameFromCookie = dojo.cookie('coshop_customerName');
	   if (nameFromCookie != undefined && nameFromCookie!=null && nameFromCookie!='')  {	
		   this.collaborationDialog.name = nameFromCookie;
	   }	   	   
		dojo.connect(window, "onorientationchange", this.collaborationDialog, 'setBorderContainerSizeForIpad');
   	 },
   	 
 	
     /**
      * invoked after a collaboration session has ended
      */
     _convertToDisconnectedState:function() {
 		console.log("@override _convertToDisconnectedState entry");

   		this.inherited(arguments);
 		dojo.style(this.endCollaborationButton.domNode,    'display', 'none'); //hide it
		dojo.style(this.openCollabDialogButton.domNode,    'display', 'none'); //hide it
		dojo.style(this.createCollabInviteString,          'display', 'none');//hide it
		dojo.style(this.createCollaborationButton.domNode, 'display', 'none');//hide it
		dojo.style(this.invitationLinkString,              'display', 'none');//hide it    	  
     },
     
   	 /**
   	  *Callback invoked after the rest service request for detectExistingCobrowse has completed.
   	  *Styles the widget appropriately based on the response to show default, waiting or connected states
   	  *@param {Object} response The JSON response from the detectExistingCobrowse rest service request
   	  */
 	_convertToAlreadyConnectedState: function(response){
 		console.log("@override _convertToAlreadyConnectedState")

		console.log("_convertToAlreadyConnectedState entry: " + response.returnCode);	
		
		//If the widget is a greater version than the rest service we need to disable the widget and log a message
		//If the ceaVersion is undefined the rest service is 1.0.0.0
		var ceaVersion = response.ceaVersion
		if (ceaVersion == null || ceaVersion == ""){
			ceaVersion = "1.0.0.0";
		}

		//Split the ceaVersion into individual numbers so that we can compare it to the CEA widget version numbers.
		version = ceaVersion.split(".");
		var disableWidget = false;
		if (dojo.version.major > version[0]) {
			disableWidget = true;
		} else if (dojo.version.minor > version[1]) {
			disableWidget = true;
		} else if (dojo.version.patch > version[2]) {
			disableWidget = true;
		} else if (dojo.version.flag > version[3]) {
			disableWidget = true;
		}
		
		//If the server returns a 4xx or 5xx error put the widget into the unavailable state ( the returnCode will be undefined )
		if (!response.returnCode){
			this.status.innerHTML = this.serviceUnavailableString;
			dojo.style(this.status, 'display', '');
			this.createCollaborationButton.attr("disabled", true);
		} else if (disableWidget == true) {
			this.status.innerHTML = this.serviceUnavailableString;
			dojo.style(this.status, 'display', '');
			this.createCollaborationButton.attr("disabled", true);
			
			widgetVersion = dojo.version.major + "." + dojo.version.minor + "." + dojo.version.patch + "." + dojo.version.flag;
			console.log("The widget version " + widgetVersion + " is at a newer level than the CEA service version " + ceaVersion + " and will be disabled");
			
		} else if (response.returnCode == 200) {
			if (response.collaborationStatus == "ESTABLISHED") {
				dojo.style(this.endCollaborationButton.domNode,    'display', '');//show it
		    	dojo.style(this.openCollabDialogButton.domNode,    'display', '');//show it
		    	dojo.style(this.createCollabInviteString,          'display', 'none'); //hide it
		    	dojo.style(this.createCollaborationButton.domNode, 'display', 'none'); //hide it
		    	dojo.style(this.invitationLinkString,              'display', 'none'); //hide it
		    	dojo.style(this.status,                    	 	   'display', '');//show it
		    	this.status.innerHTML = this.collabConnectedString;
		    	
		    	//grab the collaborationUri cookie that was set the last time a new page was loaded in the iFrame and it as the current page
		    	dojo.io.iframe.setSrc(this.collaborationDialog.collaborationDialogContentPane.domNode, dojo.cookie("collaborationUri"), true);
		    	this.collaborationDialog.cobrowseTextBox.attr('value', dojo.cookie("collaborationUri"));
		    	this.collaborationDialog._peerCanControlCollaboration = (dojo.cookie("peerCanControlCollaboration") == "true") ? true:false;
		    	this.collaborationDialog._hasCollaborationControl = (dojo.cookie("hasCollaborationControl") == "true") ? true:false;
		    	this.collaborationDialog.handleResult({"type": 0,"data": {"dialogStatusEvent":dojo.cookie("peerDialogStatus")}});
		    	
		    	this.collaborationDialog.startCollaborationStatusPolling(this._convertToCollaborationStatusHitch);
   	   	    	this.collaborationDialog.startDataPolling();
   	   	    	this.collaborationDialog.sendConnectedEventToPeer();
   	   	    	
				dojo.cookie("collaborationLinkCreated",null,{expires:-1}); //remove the cookie   	   	    	
        		this.openCollabDialog();	
			} else {
				this.collaborationDialog.startCollaborationStatusPolling(this._convertToCollaborationStatusHitch);
				
				this.peerCollaborationLink.attr('value', this.constructPeerURI(response));
				dojo.style(this.endCollaborationButton.domNode,    'display', '');//show it
				dojo.style(this.openCollabDialogButton.domNode,    'display', 'none'); //hide it
				dojo.style(this.createCollabInviteString,          'display', 'none'); //hide it
				dojo.style(this.createCollaborationButton.domNode, 'display', 'none'); //hide it
				dojo.style(this.invitationLinkString,              'display', '');//show it
				dojo.style(this.status,                    		   'display', '');//show it
				this.status.innerHTML = this.collabWaitingString;
			}
		} else {
			//If the returnCode is not 200 then an existing session does not exist and we should look to see if this is a join invitation
			if (response.returnCode != 200) {
				//If this is the invitee/peer/party-2 then take action to join the requested collaboration 
				docLocStr = document.location.href;
				//The initiator/creator/caller/party-1 will not have a Collaboration ID 
				//that is, there is NO CEA_COLLAB_ID_PREFIX in the initiator's URI, so do nothing.
	        	//The invitee/peer/party-2 DOES have a CEA_COLLAB_ID_PREFIX
	        	if ( -1 < docLocStr.indexOf(this.CEA_COLLAB_ID_PREFIX)){
	      	   		this._collabLink = "CommServlet/collaborationSession?addressOfRecord=" +this.extractCollaborationID(docLocStr);
	      	   		console.log("postCreate.collabLink: " + this._collabLink);	        	   		

	      			var nameFromCookie = dojo.cookie('coshop_customerName');
	      			if (nameFromCookie != undefined && nameFromCookie!=null && nameFromCookie!='')  {			
		      			//already have a name. fill in the name, connect	
		      			this.collaborationDialog.name = nameFromCookie;
		      	   		this.collaborationDialog.joinCollaborationSession(this._collabLink, dojo.hitch(this,"_convertToConnectedState"));  	   
	      			}else {
	      				this.getInviteeUserInformation(this._collabLink, dojo.hitch(this,"_convertToConnectedState"));
	      			}
	      	   		
	        	}
	      }
		}
		console.log("_convertToAlreadyConnectedState exit");
  	},
  	
  	/**
  	 * invoked when an invitee has pasted the collaboration URL in the browser. 
  	 * @param {String} collablink the URL to share/start a coshopping session.
  	 * @param {Object} handler Object that contains all dojo handlers to be used after the coshopping session is started.
  	 */
  	getInviteeUserInformation:function(collablink, handler) {
   	   	dojo.byId('inviteeInfoError').innerHTML='';
		dojo.byId('inviteeNameInput').value='';
		dojo.style(this.inviteeInfoDialog.titleBar,'display','none');

		var self  = this;			
		this.inviteeDialogNextButtonHandle = dojo.connect(dojo.byId('inviteeDialogNextButton'), 'onclick', this, function(e) {
			console.debug("click handler for inviteeDialogNextButtonHandle");
			self.name = dojo.byId('inviteeNameInput').value;
			self.collaborationDialog.name = self.name;   
			
	  		if (self.name=='') {
	  			dojo.byId('inviteeInfoError').innerHTML = self._messages['NAME_IS_BLANK'];
	  		}else {
	  			//name is ok. Join the Session.
	  			dojo.cookie("coshop_customerName",self.name);
	  			dojo.disconnect(this.inviteeDialogNextButtonHandle);  			
	  			self.inviteeInfoDialog.destroy();
      	   		self.collaborationDialog.joinCollaborationSession(collablink, handler);
	  		}
		});	   
		
		this.inviteeInfoDialog.show();	//show dialog and ask for name
		if (this.isTouchable) {
			this.inviteeInfoDialog._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
		}
  	},	
       	 
     /**
      * summary: Invoked when the user clicks the end collaboration button for this widget
      */
     endCollaboration: function(){
	   console.log("@override endCollaboration");
		var self = this;

		var cancelDialog = function(mouseEvent) {
			var targ;
			if (!mouseEvent){
				var mouseEvent = window.event;
			}
			if (mouseEvent.target){
				targ = mouseEvent.target;
			} else if (mouseEvent.srcElement){
				targ = mouseEvent.srcElement;
			}
	
			self.exitConfirmationDialog.hide();
		
			var targ_string = targ.id.toString();
			if (targ_string.indexOf('exitConfirmationDialogYesButton')!= -1){
				dojo.style(dojo.byId('invitationDialogEndCollaboration'),'display','none'); // hide the end collab button
				dojo.style(dojo.byId('invitationDialogNextButtonSection'),'display',''); // show the create collab button
				dojo.style(dojo.byId('continueShoppingSection'),'display','none'); // hide the continue shopping button
		 		self.collaborationDialog.sendDataEvent('{"collaborationData":{"peerEndedSession":" true "}}');
				self.collaborationDialog.endCollaborationSession(dojo.hitch(self,"_convertToDisconnectedState"));
				
				dojo.cookie("collaborationLinkCreated",null,{expires:-1}); //remove the cookie

				//shoppers may have added items to the shop cart during coshopping. Reload the current page to refresh the shopping cart. 
				window.location.href = collaboration.widget.CoshopUtilities.processURL(window.location.href);
			}
		};
		
		
	   if (this.status.innerHTML == this.collabDisconnectedString) {	
		   //the other party disconnected. No need to show yes/no buttons
	 		dojo.byId('confirmExitString').innerHTML = this.collaborationDialog._messages['PEER_ENDED_SESSION'];
	 		dojo.style('confirmationButtons', 'display', 'none');
	 		dojo.style('closeButtonAfterPeerDisconnectDiv', 'display', '');
	 		dojo.connect(dojo.byId('closeButtonAfterPeerDisconnect'),'onclick',this, 'closeExitConfirmationDialog');
	   }else {
			dojo.byId('confirmExitString').innerHTML = this.confirmExitString;
	   }
		
		//close the invitation dialog if it's open
		if (this.invitationDialog.open) {
			this.invitationDialog.hide();
		}

		dojo.style(this.exitConfirmationDialog.titleBar,'display','none');
		dojo.connect(dojo.byId('exitConfirmationDialogYesButton'), 'onclick', this, cancelDialog);
		dojo.connect(dojo.byId('exitConfirmationDialogNoButton'), 'onclick', this, 'closeExitConfirmationDialog');
		
		this.exitConfirmationDialog.show();
		if (this.isTouchable) {
			this.exitConfirmationDialog._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
		}
		
		//want to always show the scroll bar 
		dojo.query('html').style("overflow","auto");
   	 },
   	 
   	/**
   	 * close the existing confirmation dialog and open the collaboration dialog again. 
   	 */ 
   	closeExitConfirmationDialog:function() {
   		this.exitConfirmationDialog.hide(); 
 		if (this.status.innerHTML == this.collabConnectedString) {
 			//session is started. The coshop dialog needs to be reopened if host clicks 'no'.  
 			this.collaborationDialog.openCollaborationDialog();
 		}else if( this.status.innerHTML == this.collabWaitingString) {
 			//waiting for peer to join. Reopen the invitation dialog if host clicks 'no'
 			this.invitationDialog.show();  
			if (this.isTouchable) {
				this.invitationDialog._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
			}
 		}else if (this.status.innerHTML == this.collabDisconnectedString) {
			dojo.cookie("collaborationLinkCreated",null,{expires:-1}); //remove the cookie

			dojo.style(dojo.byId('invitationDialogEndCollaboration'),'display','none'); // hide the end collab button
			dojo.style(dojo.byId('invitationDialogNextButtonSection'),'display',''); // show the create collab button
			dojo.style(dojo.byId('continueShoppingSection'),'display','none'); // hide the continue shopping button
			
			this.collaborationDialog.endCollaborationSession(dojo.hitch(this,"_convertToDisconnectedState"));

			//shoppers may have added items to the shop cart during coshopping. Reload the current page to refresh the shopping cart. 
			window.location.href = collaboration.widget.CoshopUtilities.processURL(window.location.href);
 		}
   	},
   	
   	 /**
   	  * Called when the host clicks coshopping link in the store header
   	  * It'll open a dialog and ask for the name of the user.
   	  */
   	openInvitationDialog:function() {
   		console.log("isStorePreview = ", this.isStorePreview);

   		dojo.style(this.invitationDialog.titleBar,'display','none');
		dojo.byId('peerDialogError').innerHTML="";
		
		this.invitationDialog.show();  
		if (this.isTouchable) {
			this.invitationDialog._relativePosition = new Object(); //stop auto repositioning of dijit.dialogs
		}
		
		
		//storePreview may be in http, or https. 
		if (this.isStorePreview == true) {
   			//not allowing customers to use coshopping in store preview
			dojo.addClass('invitationDialogNameSection', 'warningMsgDiv warning');
			dojo.byId('invitationDialogNameSection').innerHTML = this._messages['COSHOPPING_DISABLED_IN_PREVIEW'];
			dojo.style(dojo.byId('invitationDialogNextButtonSection'), 'display','none');
   			return true;
   		}
		
		else if(window.location.href.indexOf("https")>-1) {
			//In a secured page. Send customer to homepage before starting coshopping
			dojo.addClass('warningMsg', 'warningMsgDiv');
			dojo.style('invitationDialogNextButtonSection', 'display','none');
			dojo.style('invitationDialogNameSection','display','none');
			dojo.style('redirectToHomeSection','display','');	
			if (dojo.cookie('collaborationLinkCreated') == 'true') {
				//customer created the link in a non https page, then navigated to a https page. Hide the collab link. 
				dojo.style(this.invitationLinkString,'display','none');
			}
		}
		
		else {
		
			var nameFromCookie = dojo.cookie('coshop_customerName');
			
			if (nameFromCookie != undefined && nameFromCookie!=null && nameFromCookie!='')  {	
				//already have a name. fill in the name
				dojo.byId('peerNameInput').value = dojo.cookie('coshop_customerName');
				dojo.style(dojo.byId('invitationDialogNameSection'),'display','none');
				
				/**
				 * show the name section if
				 * - collaboration ended before the invitation link is opened
				 * - failed to join the collaboration session with the invitation link
				 * - failed to disconnect
				 */ 
				if (this.status.innerHTML == this.collabDisconnectedString || this.status.innerHTML =='' || this.status.innerHTML==this.collabDisconnectFailedString
					|| this.status.innerHTML==this.collabFailString) {
					dojo.style(dojo.byId('invitationDialogNameSection'),'display','');
				}			
			}else {			
				//no name, always show name section and ask for name
				dojo.style(dojo.byId('invitationDialogNameSection'),'display','');
				dojo.byId('peerNameInput').value='';
			}
			
			if (dojo.cookie('collaborationLinkCreated') == 'true' || this.status.innerHTML == this.collabWaitingString || this.status.innerHTML == this.collabConnectedString) {
				dojo.style(dojo.byId('invitationDialogEndCollaboration'),'display','');
	   			dojo.style(dojo.byId('continueShoppingSection'),'display',''); // show continue shopping button
	   			dojo.style('invitationDialogNextButtonSection','display','none');
			}
			//already have a URL or already connected. Hide the create button.
			var currentCollabLink = dojo.byId('invitationLinkStringInput').value;
			if ((currentCollabLink!=''&& currentCollabLink!=undefined && currentCollabLink!=null) 
					|| this.status.innerHTML == this.collabConnectedString ) {
				dojo.style(dojo.byId('invitationDialogNextButtonSection'), 'display','none');
			}
			
			dojo.connect(dojo.byId('invitationDialogNextButton'), 'onclick', this, 'createCollaboration' );
		}
   	},
   	
   	/**
   	 * close the invitor's dialog. It's called from coshop.html 
   	 */
   	closeInvitationDialog:function() {
   		this.invitationDialog.hide(); 		
		dojo.query('html').style("overflow","auto");

   	},
   	
   	/**
   	 * close the invitee's dialog
   	 */
   	closeInviteeDialog:function() {
   		this.inviteeInfoDialog.hide();
   	},
   	
   	/**
   	 * creates the collaboration URL
   	 */
   	createCollaboration:function() {
   		console.log("@override createCollaboration");
   		this.name = dojo.byId('peerNameInput').value;
   		this.collaborationDialog.name = this.name;   
   		
   		if (this.name !='') {
   			dojo.cookie("coshop_customerName",this.name);
   			dojo.byId('peerDialogError').innerHTML="";   			
   			
   			dojo.style(dojo.byId('invitationDialogNextButtonSection'),'display','none'); //collaboration link is created. Hide the button
   			dojo.style(dojo.byId('invitationDialogEndCollaboration'),'display',''); // show end collab button
   			dojo.style(dojo.byId('continueShoppingSection'),'display',''); // show continue shopping button

   			this.inherited(arguments);
   		}else {
   			dojo.byId('peerDialogError').innerHTML=this._messages["NAME_IS_BLANK"];
   		}
   	},
   	
   	/**
   	 * Create a link and covert the widget to waiting state. The widget now will wait for the peer to open the collaboration URL
   	 */
   	_convertToWaitingState:function() {
   		this.inherited(arguments);
   		dojo.cookie('collaborationLinkCreated','true');
   	},
   	

   	/**
   	 * close the help dialog
   	 */
   	closeHelp:function () {
   		dijit.byId('helpDialog').hide();
   	},
   	
   	/**
   	 * go to home page
   	 */
   	goToHomePage:function() {
   		window.location.href = this.homePageURL+'?showCoshoppingDialog=true';
   	}
});


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
* This javascript is used to create a Madison style button
* @version 1.0
* 
**/

/**
* @class This class is the used to create a Madisons style button within the collaboration dialog
*
**/


dojo.provide("collaboration.widget.WCButton");



/* Import dojo classes */
dojo.require("dijit.form.Button");


dojo.declare("collaboration.widget.WCButton", dijit.form.Button,{
/* The fully resolved URL to be loaded when the menu button is clicked. */
url: '',
/* This is the template string for the widget. */
templateString:"<span class=\"primary_button \"\r\n\tdojoAttachEvent=\"ondijitclick:_onButtonClick\"\r\n\t><span class=\"button_container\"\r\n\t\t>		<span class=\"button_bg\"\r\n\t\t\t>			<span class=\"button_top\"><span class=\"button_bottom\"><a href=\"#\" class=\"dijitReset dijitStretch dijitButtonContents\"\r\n\t\t\t\tdojoAttachPoint=\"titleNode,focusNode\" \r\n\t\t\t\t${nameAttrSetting} type=\"${type}\" value=\"${value}\" waiRole=\"button\" waiState=\"labelledby-${id}_label\"\r\n\t\t\t\t><span class=\"dijitButtonText\" \r\n\t\t\t\t\tid=\"${id}_label\"  \r\n\t\t\t\t\tdojoAttachPoint=\"containerNode\"\r\n\t\t\t\t></span\r\n\t\t\t></a\r\n\t\t></span></span></span\r\n\t></span\r\n></span>\r\n",
widgetsInTemplate: true,
		/**
		 * This function initialises the event listeners and style classes for WCButton.
		 */
		  postCreate: function(){		
			
		}
	}
);


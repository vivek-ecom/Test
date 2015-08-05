/*
	Copyright (c) 2004-2009, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["wc.widget.*"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["wc.widget.*"] = true;
//
//-------------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// WebSphere Commerce
//
// (c) Copyright IBM Corp. 2007
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
//-------------------------------------------------------------------
//

dojo.kwCompoundRequire({
	common: ["dojo.xml.Parse", 
			 "dojo.widget.Widget", 
			 "dojo.widget.Parse", 
			 "dojo.widget.Manager"],
	browser: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	dashboard: ["dojo.widget.DomWidget",
			  "dojo.widget.HtmlWidget"],
	svg: 	 ["dojo.widget.SvgWidget"],
	rhino: 	 ["dojo.widget.SwtWidget"]
});
dojo.provide("wc.widget.*");
dojo.widget.manager.registerWidgetPackage("wc.widget");

}

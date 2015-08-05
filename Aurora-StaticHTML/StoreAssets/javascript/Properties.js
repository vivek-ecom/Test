/*
 *-----------------------------------------------------------------
 * Licensed Materials - Property of IBM
 *
 * WebSphere Commerce
 *
 * (C) Copyright IBM Corp. 2012
 *
 * The source code for this program is not published or otherwise
 * divested of its trade secrets, irrespective of what has
 * been deposited with the U.S. Copyright Office.
 *-----------------------------------------------------------------
 */


/**
* 	Custom implementation of replaceAll method since there is not any in standard javascript library
*/
replaceAll = function(str, parttern, replacement){
	if(typeof str === "string" && str !== null && parttern !== null && typeof replacement === "string" ){
		while(parttern.test(str) === true){
			str = str.replace(parttern, replacement);
		}
	}
	return str;
};

/**
* 	Append useful string prototypes if they do not exist already
*/
if(typeof Array.prototype.contains !== 'function') {
	Array.prototype.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] === obj) {
	            return true;
	        }
	    }
	    return false;
	}
}

/**
*	Return the size of an hash for javascript
*/
sizeOfHash = function(obj){
	var len = -1;
	for (var k in obj)
	      len++;
 	return len;
}
/**
*	Some initialization of global variable
*	
*/
//var properties = new Array();	/* This used to hold the tag node in the memory so we can easy switch between display properties or not, and this is for innerHTML that has properties tag */
var propertiesAttr = new Array(); /* This is similiar with above but only for attributes has properties tag */

var escapeNodeTagName = {'HTML':1,'HEAD':1, 'BODY':1, 'META':1, 'SCRIPT':1, 'LINK':1, 'TABLE':1, 'TR':1, 'BR':1};	/* This is an escape HTML tag list that will not be processed */
var regex = /\[PROPERTIES;([^;]+);([^\[\]]*?)\]/; /* Regular expression for search our special properties tag */
var regexNoEnd = /\[PROPERTIES;([^;]+);([^\]]*)/; /* Regular expression for search our special properties tag without the ending ] */

var pageChangeFlag = false; /* use this flag to tell pageChange event handler that do not do anything */

/**
*	Lets compose the replacement for our properties tags
*/
function composeReplacement(str){
	return	str[2] + '<span title="'+ str[1]+'" class="keyIcon"><img src="../StoreAssets/images/pencil_blue.png" alt="'+ str[1] +'"/></span>';
}


var lastParentNode, lastKeys, lastSpan;
/**
*	Compose the replacement for our properties tags with multiple values
*/
function composeMultipleReplacementAppendTag(arrayOfKeys, node){
	// in some cases, we might have created a span tag already for the parent node.
	var foundParentNode = false;
	if (lastParentNode && node && node.parentNode && lastParentNode == node.parentNode) {
		foundParentNode=true;
		// if found, use all the last keys, plus the new keys
		for (var i=0;i<lastKeys.length;i++) {
			if (!arrayOfKeys.contains(lastKeys[i])) {
				arrayOfKeys.push(lastKeys[i]);
			}
		}
	}
	
	// create string of all keys
	var keys;
	if (arrayOfKeys!=null) {
		keys = arrayOfKeys[0];
		for (var i=1;i<arrayOfKeys.length;i++) {
			keys+=', '+arrayOfKeys[i];
		}
	}
	
	// create or append to span tag
	if (foundParentNode && lastSpan) {
		lastSpan.setAttribute('title',keys);
	}else {
		var tag = '<img src="../StoreAssets/images/pencil_orange.png" class="elementKeyIcon" />';
		var newNode = document.createElement('span');
		newNode.innerHTML = tag;
		newNode.setAttribute('title',keys);
		newNode.setAttribute('class','elementKeyIcon');
		node.parentNode.appendChild(newNode, node);
	}
	
	// save last change
	lastSpan = newNode;
	lastParentNode = node.parentNode;
	lastKeys = arrayOfKeys;
}


/**
*	Inner function to parse each HTML element tag
*/
function parseTag(node, index, array){
	if(escapeNodeTagName[node.nodeName] === 1){
		return;
	}
	processElementNode(node);
	for(var i = 0; i < node.childNodes.length; i++){
		if(node.childNodes[i].nodeType == 3){
			if(processTextNode(node.childNodes[i]) == true){
				// since we replace all of its childNodes, then we need re-set counter to start over
				i = 0;
			}
		}
	}
}

function processTextNode(node){
	if(node === null || typeof node != "object"){
		return;
	}
	
	if(node.nodeType == 3){
		var hits = null;
		var flag = false;
		var content = node.nodeValue;
		while((hits = regex.exec(content)) !== null){
			content = content.replace("[PROPERTIES;"+hits[1]+";"+hits[2]+"]", composeReplacement(hits));
			flag = true;
		}
		if(flag){
			if (node.parentNode.nodeName=='OPTION') {
				hits = regex.exec(node.nodeValue);
				node.nodeValue = hits[2]; 
			}else if(node.parentNode.nodeName == 'TITLE'){
				hits = regex.exec(node.nodeValue);
				node.nodeValue = hits[2] +" - [" + hits[1] + "]";
			}else{
				var newNode = document.createElement('span');
				newNode.innerHTML = content;
				node.parentNode.replaceChild(newNode, node);
				node = newNode;				

			}

		}
		// lets try tag without ending
		if((hits = regexNoEnd.exec(content)) !== null){
				// if we found an match then we go over to its parent node and parse its innerHTML as string to solve multiple layer HTML tag mixing issue
				content = node.parentNode.innerHTML;
				while((hits = regex.exec(content)) !== null){
					content = content.replace("[PROPERTIES;"+hits[1]+";"+hits[2]+"]", composeReplacement(hits));
					flag = true;
				}
				if(flag){
					var newNode = document.createElement('span');
					newNode.innerHTML = content;
					// so lets remove all child nodes
					var parentNode = node.parentNode;
					for(var i = (parentNode.childNodes.length-1); i>=0;i--){
						parentNode.removeChild(parentNode.childNodes[i]);
					}
					// then we add what we newlly created
					parentNode.appendChild(newNode);
					return true;
				}				

		}
	}
	return false;
}



function processElementNode(node){
	if(node === null || typeof node != "object"){
		return;
	}
	if(node.nodeType == 1){
		var entries = new Array();
		var keysInNode = new Array();
		for(var i=0; i < node.attributes.length; i++){
			if(regex.test(node.attributes[i].nodeValue) === true){
				var hits = null;
				var replacement = node.attributes[i].nodeValue;
				var displayText = node.attributes[i].nodeValue;

				while((hits = regex.exec(replacement)) != null){
					replacement = replacement.replace("[PROPERTIES;"+hits[1]+";"+hits[2]+"]",hits[1]);
					displayText = displayText.replace("[PROPERTIES;"+hits[1]+";"+hits[2]+"]",hits[2]);

					node.attributes[i].nodeValue = displayText;
					if (!entries.contains(replacement)) {
						keysInNode.push(replacement + '=' + displayText);
						entries.push(replacement);

					}
				}
				
				
			}
		}// end for
		if (keysInNode.length > 0){
			composeMultipleReplacementAppendTag(keysInNode,node);
		}
	}
}

/**
*	Just an wrapper
*/
function parsePageForProperties(){
	var nodeList = dojo.query('*');
	nodeList.forEach(parseTag);
}


/**
*	Response when something is changed in the page's HTML structure
*/
function pageChange(){
	if(!pageChangeFlag){
		console.log('There is change in the HTML page, start to re-parse the HTML page');
		pageChangeFlag = true;
		parsePageForProperties();
		pageChangeFlag = false;
	}
}

function pageLoad(){
	
	console.log('The HTML page is loaded!');
	pageChangeFlag = true;
	parsePageForProperties();
	pageChangeFlag = false;

	if(document.createStyleSheet){
		var temp = document.createStyleSheet();
		temp.addRule('.keyIcon','{padding:2px;z-index:998;display:none !important;}');
		temp.addRule('.elementKeyIcon','{position:absolute;top:0px;z-index:999;display:none;}');
		temp.addRule('#text_highlight','{width:100%;font-family:Verdana, Arial, Helvetica, sans-serif;font-size:11px;color:#2c2c2c;}');
		temp.addRule('#text_highlight .bold','{font-weight:bold;color:#2c2c2c;}');
		temp.addRule('#text_highlight .header','{height:1px;width:100%;padding-top:3px;}');
		temp.addRule('.details','{padding:0px 0px 2px 0px;}');
		temp.addRule('.details_container','{background-color:#dfe8fb;border:solid 1px #bcd0fb;padding:5px;}');
		temp.addRule('.details_container .content','{padding-left:3px;}');
		temp.addRule('a.light_button','{color: #27629C;cursor: pointer;display: -moz-inline-box;display: inline-block;font-size:11px;height:17px;padding: 2px;text-decoration: none;line-height:16px;}');
		temp.addRule('a.light_button div.button_text','{background: transparent url("/wcsstore/images/preview/b_main_bg.png") top left repeat-x;float: left;height: 17px;padding: 1px 2px 2px 9px;}');
		temp.addRule('a.light_button div.button_right','{background: transparent url("/wcsstore/images/preview/b_right.png") no-repeat;float: left;height: 20px;width: 6px;}');
	}else{
		//window.addEventListener('DOMSubtreeModified', pageChange, false);
		var temp = document.createElement('style');
		temp.innerHTML = ".keyIcon {"+
			"padding:2px;"+
			"z-index:998;"+
			"display:none !important;"+
		"}"+
		".elementKeyIcon {"+
			"position:absolute;"+
			"top:0px;"+
			"z-index:999;"+
			"display:none;"+
		"}"+
		"#text_highlight {"+
			"width:100%;"+
			"font-family:Verdana, Arial, Helvetica, sans-serif;"+
			"font-size:11px;"+
			"color:#2c2c2c;"+
		"}"+
		"#text_highlight .bold{"+
			"font-weight:bold;"+
			"color:#2c2c2c;"+
		"}"+
		"#text_highlight .header {"+
			"height:1px;"+
			"width:100%;"+
			"padding-top:3px;"+
		"}"+
		".details {"+
			"padding:0px 0px 2px 0px;"+
		"}"+
		".details_container {"+
			"background-color:#dfe8fb;"+
			"border:solid 1px #bcd0fb;"+
			"padding:5px;"+
		"}"+
		".details_container .content {"+
			"padding-left:3px;"+
		"}"+
		"a.light_button {"+
			"color: #27629C;"+
			"cursor: pointer;"+
			"display: -moz-inline-box;"+
			"display: inline-block;"+
			"font-size: 11px;"+
			"height: 17px;"+
			"padding: 2px;"+
			"text-decoration: none;"+
			"line-height: 16px;"+
		"}"+
		"a.light_button div.button_text {"+
			"background: transparent url('/wcsstore/images/preview/b_main_bg.png') top left repeat-x;"+
			"float: left;"+
			"height: 17px;"+
			"padding: 1px 2px 2px 9px;"+
		"}"+
		"a.light_button div.button_right {"+
			"background: transparent url('/wcsstore/images/preview/b_right.png') no-repeat;"+
			"float: left;"+
			"height: 20px;"+
			"width: 6px;"+
		"}";
		document.body.appendChild(temp);
	}
	var divElement = document.getElementById('text_highlight');
	var divElementText = 
	'</div>' +
		'<div class="details" id="detailsSection">'+
			'<div class="details_container">' +
			'<div class="content">'+
				'<span class="bold">Click the button below to highlight text strings on the current page that you can customize in properties files during onboarding.</span>'+
				'<br/>'+
			'</div>'+
			'<div class="marketing_btn">'+
				'<div id="showProperties" style="display:block">'+
					'<a class="light_button" onclick="showProperties()">'+
						'<div id="showSpots" class="button_text">Show Properties</div>'+
						'<div class="button_right"></div>'+
					'</a>'+
				'</div>'+
				'<div id="hideProperties" style="display:none">'+
					'<a class="light_button" onclick="hideProperties()">'+
						'<div id="showSpots" class="button_text">Hide Properties</div>'+
						'<div class="button_right"></div>'+
					'</a>'+
				'</div>'+
			'</div>'+
			'<div class="content">'+
				'<div id="messages" style="display:none"></div>'+
			'</div>'+
		'</div>';
	divElement.innerHTML=divElementText;
	
}
window.onload = pageLoad;


/**
*	Lets create our style tag that will make property tag highlight 
*/
var sheet;
function changeCSS(flag){

	if(flag){
			if(document.createStyleSheet){
				if(sheet !== null){
					sheet = document.createStyleSheet();
				}
				sheet.addRule('.keyIcon'," display: inline !important;");
				sheet.addRule('.elementKeyIcon'," display: inline !important;");
			}else{
				if(sheet !== null){
					sheet = document.createElement('style');
				}
				sheet.innerHTML = '.keyIcon{ display: inline !important;}' +
				' .elementKeyIcon{ display: inline !important;}';
				document.body.appendChild(sheet);
				
			}
	}else{
			if(document.createStyleSheet){
				if(sheet !== null){
					sheet.removeRule('.keyIcon'," display: inline !important;");
					sheet.removeRule('.elementKeyIcon'," display: inline !important;");
				}
			}else{
				if(sheet !== null){
					document.body.removeChild(sheet);
				}
				
			}
	}

}
/**
*	Functions responsible to change CSS so that border could be display or hide & set attributes within tags that has properties too
*/
function showProperties(){
	pageChangeFlag = true;
	changeCSS(true);
	for(var i=0; i < propertiesAttr.length; i++){
		for(var p =0; p < propertiesAttr[i].length; p++){
			var name = propertiesAttr[i][p].name;
			propertiesAttr[i][p].handler.attributes[name].nodeValue = propertiesAttr[i][p].replacement;				
		}
	}
	document.getElementById('showProperties').style.display = 'none';
	document.getElementById('hideProperties').style.display = 'block';
	pageChangeFlag = false;
}

function hideProperties(){
	pageChangeFlag = true;
	changeCSS(false);
	for(var i=0; i < propertiesAttr.length; i++){
		for(var p =0; p < propertiesAttr[i].length; p++){
			var name = propertiesAttr[i][p].name;
			propertiesAttr[i][p].handler.attributes[name].nodeValue = propertiesAttr[i][p].displayText;				
		}

	}
	document.getElementById('showProperties').style.display = 'block';
	document.getElementById('hideProperties').style.display = 'none';
	pageChangeFlag = false;
}
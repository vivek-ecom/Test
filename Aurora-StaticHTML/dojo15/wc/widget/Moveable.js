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
 * @fileOverview This JavaScript file is used in store pages that need to move a dialog  and you can skip move of some elements by set the parameters .
 */
	
 /* Import dojo classes */
dojo.provide("wc.widget.Moveable");
dojo.require("dojo.dnd.Moveable");

/**
 * The functions extend dojo.dnd.Moveable
 * can  skip move of elements what you want,can set opacity ,these functions are what dojo.dnd.Moveable can not do
*/ 
	/**usage
	var dnd = 	new wc.widget.Moveable'('drag_container', {'skip': true,skipIds:['elem1'],skipTags:['label'],skipClasses:['title'],opacity:0.6});

	*/
	
	dojo.declare('wc.widget.Moveable', [dojo.dnd.Moveable], {
		skipIds:[],
		skipTags:[],
		skipClasses:[],
		opacity:1,
		statics:{zIndex:99999},
		constructor: function(node, params){
			// summary: an object, which makes a node moveable
			// node: Node: a node (or node's id) to be moved
			// params: Object: an optional object with additional parameters;
			//	following parameters are recognized:
			//		handle: Node: a node (or node's id), which is used as a mouse handle
			//			if omitted, the node itself is used as a handle
			//		delay: Number: delay move by this number of pixels
			//		skip: Boolean: skip move of form elements
			//		mover: Object: a constructor of custom Mover
			//      skipIds: Array: skip move of the elements when it's id is in  skipIds
			//      skipTags:  Array: skip move of the elements when it's tagName is in  skipTags
			//      skipClasses: Array: skip move of the elements when it has class in  skipClasses
			//      opacity: Number: the opacity (transparent:0 opacity:1)
			if(!params){ params = {}; }
			if(params.skipIds) this.skipIds = params.skipIds;
			if(params.skipTags)	this.skipTags = dojo.map(params.skipTags,function(x){
				return x.toLowerCase();
			});			
			if(params.skipClasses)this.skipClasses = params.skipClasses;
			if(params.opacity)this.opacity = params.opacity;

		},
		isSkip:function(e){
			var node = e.target;
			var nodeId = node.id;
			var nodeTagName = node.tagName.toLowerCase();
			for(var i=0;i<this.skipClasses.length;i++){
				if(dojo.hasClass(node,this.skipClasses[i])){
					return true;
				}
			}
			if(dojo.indexOf(this.skipIds,nodeId) != -1  ){
				return true;
			}
			for(var i= 0;i<this.skipIds.length;i++){
				if(dojo.isDescendant(nodeId,this.skipIds[i])){
					return true;
				}
			}
			if(dojo.indexOf(this.skipTags,nodeTagName) != -1){
				return true;
			}
			return false;
		},
		onMouseDown : function(e) {
			// summary: event processor for onmousedown, creates a Mover for the node
			if(this.skip && this.isSkip(e)){
				return;
			}
			this.inherited(arguments);
		},

		onMoveStart: function(/* dojo.dnd.Mover */ mover){
			this.node.style.zIndex = ++this.statics.zIndex;
			this.node.style.cursor = "move";
			this.node.style.opacity = this.opacity;
			this.node.style.filter = "Alpha(opacity="+this.opacity*100+")";
			this.inherited(arguments);
		},
		onMoveStop: function(/* dojo.dnd.Mover */ mover){
			this.node.style.cursor = "auto";
			this.node.style.opacity = 1;
			this.node.style.filter = "alpha(opacity=100)";
			this.inherited(arguments);
		},

		onSelectStart: function(e){
			//do not stop which elements' default event
			if(this.skip && this.isSkip(e)){
				return;
			}
			this.inherited(arguments);
		}
	});
	
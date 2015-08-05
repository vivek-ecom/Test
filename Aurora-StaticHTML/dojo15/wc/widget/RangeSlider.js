/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["wc.widget.RangeSlider"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["wc.widget.RangeSlider"] = true;
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

/** 
 * @fileOverview This javascript is used by FastFinderNavDisplay.jspf to display a slider on the Fast Finder page. 
 * @version 1.0
 */

 /* Import dojo classes */
dojo.provide("wc.widget.RangeSlider");

dojo.require("dojo.dnd.move");
dojo.require("dijit._Widget");
dojo.require("dojo.currency");
dojo.require("dijit._Container");
dojo.require("dojo.i18n");
dojo.require("dijit.form.Slider") ;
dojo.require("dijit.form._FormWidget");

/**
 * The functions defined in this class helps the user to select price range values for a product.
 * @class The RangeSlider widget displays a slider on the Fast Finder page, used to select price range values for a product. 
 * The range slider contains two sliding handles which define the price range, where the left handle indicates the minimum price, 
 * and the right handle indicates the maximum price.
 */
 
 dojo.declare("wc.widget.RangeSlider",[dijit.form._FormWidget, dijit._Container],{
 		
	  /*This points to the file that contains template string for the widget. */
 	   templatePath:dojo.moduleUrl ("wc.widget","templates/RangeSlider.html"),

	   isContainer: true,

	   /* The left handle of the slider.*/
	   firstHandle: null,
	   
	   /* The right handle of the slider.*/
	   secondHandle: null,
	   
	   /* The slider bar on which the left and right handle move while selecting a price range. */
	   rangeSelectorBar: null,
	   
	   startRange : 0,	
	   	/* Total range represented by the widget i.e. for 0-100 it will be 100, and for 20-30 it will be 10. */			
		 totalRange : 100,					 
												
		/* Indicates the default initial position for the left handle.*/
		 defaultStart : 0,	
			 
		/* Indicates the default initial position for the right handle */
		 defaultEnd : 0,					 
		
		/* Indicates whether the slider bar can be clicked to move the handles to the nearest point clicked on the bar. The default value is true.*/
		 clickSelect : true,
		
		 /* value will be incremented by 1 for each move. */
		 stopCount : 0,						
		 snapToGrid : true,
		
		 /* Indicates whether a handle can be dragged to a new location using the mouse pointer. */
		 activeDrag : true,					
												
		/** Indicates the increment value (in multiples) of the range slider. 
		 *  For example, when the increment value is set to 5, the values of the range slider are displayed as 5, 10, 15, 20, etc.
		 */
		 incrementValue : 1,				
		 
		 /* Indicates the number of decimal places in the price. default value is 0. */
		 decimalPoints : 0,
		
		 /* Indicates whether the tool tip is available for display or not. The default value is true. */
		 showTooltip : true,				
												
		 /* Indicates whether the tool tip is always displayed, regardless of user input. The default value is true. */
		 showTooltipAllTime : true,			
												
		 /** Position for the tooltip relative to the first sliding button.
		  *  Its value should be a JavaScript Array object, 
		  *	 the first value of this array should give relative position horizontally and
		  *	 the second value of this array should give relative position vertically.
		  */
		 ralativePositionFirst : [-1,-1],	

         /** Position for the tooltip relative to the second sliding button.
		  *  Its value should be a JavaScript Array object, 
		  *	 the first value of this array should give relative position horizontally and
		  *	 the second value of this array should give relative position vertically.
		  */
		 ralativePositionSecond : [1,-1],
		
		/* The prefix for the upper and lower value for the widget. */
		 prefix : "",
		/* The suffix for the upper and lower value for the widget.*/
		 suffix : "",						
		/*Indicates the currency code, if the values are prices*/
		 currencyCode : "",

		/** Handle for tooltip
		 * Actually the ToolTip widget which dojo provides cannot be used here.
		 * Because we need to change the caption of tooltip very frequently. and 
		 * caption for Tooltip widget which Dojo provides cannot be changed once it is created.
		 */
		 /*Handle for tooltip <div> element associated with first sliding button.*/ 
		 firstTooltip : null,	
		 /*Handle for tooltip <div> element associated with second sliding button.*/
		 secondTooltip : null,	
		 /* Holds the 'upper' and 'lower' value for the widget */
		 currentValue : new Object(),		
		
		 _mousePixelCoord: "pageX",
		 _startingPixelCount: "t",
		 _pixelCount: "w",
		 rangeSliderTitle: "",
		 /*The translated string that is assigned to the left handle and is read by screen readers when it is in focus.*/
		 firstHandleTitle : "",
		 /*The translated string that is assigned to the right handle and is read by screen readers when it is in focus.*/
		 secondHandleTitle : "",
		 emptyImagePath : "",
		  
		 /**
		  *  To understand the process by which widgets are instantiated, it is critical to understand what other methods create calls and
		  *  which of them you'll want to override. Of course, adventurous developers could override create entirely, but this should
		  *	 only be done as a last resort.	Below is a list of the methods that are called, in the order
		  *  they are fired, along with notes about what they do and if/when
		  *  you should over-ride them in your widget:
		  *  postMixInProperties: a stub function that you can over-ride to modify variables that may have been naively assigned by	mixInProperties
		  *  # widget is added to manager object here
		  *  buildRendering	Subclasses use this method to handle all UI initialization Sets this.domNode.Templated widgets do this automatically
		  *  and otherwise it just uses the source dom node.
		  *  postCreate	a stub function that you can over-ride to modify take actions once the widget has been placed in the UI
		  *  store pointer to original dom tree
		  */
		  	create: function(params, srcNodeRef){		

		this.srcNodeRef = dojo.byId(srcNodeRef);

		/* For garbage collection.  An array of handles returned by Widget.connect()*/
		/* Each handle returned from Widget.connect() is an array of handles from dojo.connect()*/
		this._connects=[];

		/* _attaches: String[] */
		/* 		names of all our dojoAttachPoint variables */
		this._attaches=[];

		/*mixin our passed parameters */
		if(this.srcNodeRef && (typeof this.srcNodeRef.id == "string")){ this.id = this.srcNodeRef.id; }
		if(params){
			dojo.mixin(this,params);
		}
		this.postMixInProperties();

		/** generate an id for the widget if one wasn't specified
		 * (be sure to do this before buildRendering() because that function might
		 * expect the id to be there.
		 */
		if(!this.id){
			this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		}
		dijit.registry.add(this);

		this.buildRendering();

		/** Copy attributes listed in attributeMap into the [newly created] DOM for the widget.
		 * The placement of these attributes is according to the property mapping in attributeMap.
		 * Note special handling for 'style' and 'class' attributes which are lists and can
		 * have elements from both old and new structures, and some attributes like "type"
		 * cannot be processed this way as they are not mutable.
		 */
		if(this.domNode){
			for(var attr in this.attributeMap){
				var mapNode = this[this.attributeMap[attr]] || this["domNode"];
				var value = this[attr];
				if(typeof value != "object" && (value !== "" || (params && params[attr]))){
					switch(attr){
					case "class":
						dojo.addClass(mapNode, value);
						break;
					case "style":
						if(mapNode.style.cssText){
							mapNode.style.cssText += "; " + value;
						}else{
							mapNode.style.cssText = value;
						}
						break;
					default:
						mapNode.setAttribute(attr, value);
					}
				}
			}
		}

		if(this.domNode){
			this.domNode.setAttribute("widgetId", this.id);
		}

		var source = this.srcNodeRef;
		if(source && source.parentNode){
			source.parentNode.replaceChild(this.domNode, source);
		}

		this.postCreate();

		/* If srcNodeRef has been processed and removed from the DOM (e.g. TemplatedWidget) then delete it to allow GC. */
		if(this.srcNodeRef && !this.srcNodeRef.parentNode){
			delete this.srcNodeRef;
		}	
	}, 
		   /**
		 * stub function! sub-classes may use as a default UI initializer function. 
		 * The UI rendering will be available by the time this is called from buildRendering. 
		 * If buildRendering is over-ridden, this function may not be fired!
		 **/
		postCreate : function(){
	
			this.initWidget();
			
			this.inherited('postCreate', arguments);
		},
		
		
		/**
		 * This function basically initialize the widget.
		 */
		initWidget: function(){
			this.pixelsOnSlider = dojo.contentBox(this.rangeSelectorBar).w;
			console.debug(" pixelsOnSlider : " + this.pixelsOnSlider);
			this.endRange = this.startRange + this.totalRange;
			this.pixelsPerUnit = (this.pixelsOnSlider) / this.totalRange;
			console.debug(" pixelsPerUnit : " + this.pixelsPerUnit);
			this.noOfDecimalUnits = (this.totalRange * (Math.pow(10,this.decimalPoints))) / this.incrementValue;
			var x = Math.log(this.noOfDecimalUnits / this.pixelsOnSlider) * Math.LOG10E;
			if(x>0){
				console.debug(	"RangeSlider Widget: The whole range (along with decimal values) cannot be represented by the specified width of the widget. " +
							"Please set decimalPoints value to " + Math.floor(this.decimalPoints - x) + " or less, OR " +
							"Set the width of the widget to " + (this.noOfDecimalUnits) + " Pixels.");
				
				console.debug(	"RangeSlider Widget: The decimalPoints value is set to " + Math.floor(this.decimalPoints - x) + " from its origional value " + this.decimalPoints);
			
			}

			if(this.pixelsPerUnit < 1){
				console.debug(	"RangeSlider Widget: The whole range cannot be represented by the specified width of the widget. " +
							"Please decrese the range  by " + dojo.number.round((1 - this.pixelsPerUnit)*this.totalRange)+ " Units OR " +
							"Increase the width of the widget by " + dojo.number.round((1 - this.pixelsPerUnit)*this.totalRange)+" Pixels.");
			}
			
			
			if(this.defaultStart < this.startRange || this.defaultStart >= this.endRange){
				this.defaultStart = this.startRange;
			}
			if(this.defaultEnd > this.endRange || this.defaultEnd <= this.startRange){
				
				this.defaultEnd = this.endRange;
			}
			console.debug(	"defaultStart " + this.defaultStart);
			console.debug(	"defaultEnd " + this.defaultEnd);

			this.currentValue.lower = this.defaultStart;
			this.currentValue.upper = this.defaultEnd;

			/* Setup the two sliders. */
			this.setupSlider(this.firstHandle, "first");
			this.setupSlider(this.secondHandle, "second");

				
			if (this.clickSelect) {
			
				dojo.connect (this.rangeSelectorBar, "onclick", this, "onSliderBarClick");
			}
    
						
			if(typeof window != "undefined") {
				dojo.connect(window, 'onresize', this, 'onWindowResized');	/* window resize. */
			}
		
		},
/**
		 * This function initializes the slider for the widget. It positions the two sliding buttons and make them dragable.
		 * If their initial position is specified (using defaultStart, defaultEnd parameters) 
		 * it will position the buttons to specified position, otherwise it will position them to default position.
		 * 
		 * @param handle			One of the slider handle.
		 *							There are two handles for this widget, firstHandle and secondHandle, 
		 *							these handles represent the two sliding buttons on the widget respectively.
		 *
		 * @param name				A logical name for the handle. It should be either 'first' or 'second'
		 *							'first' indicates that you are initializing the first slider button and 
		 *							'second' indicates that you are initializing the first slider button.
		 **/
		setupSlider : function (handle, name) {
		  var _self = this;
	    var mover = function( e){
			wc.widget.SliderDragMove.apply(this, arguments);
			this.widget = _self;
		  };
		 dojo.extend(mover,wc.widget.SliderDragMove.prototype);
		 this._movable = new dojo.dnd.Moveable(handle, {mover: mover});

			handle.name = name;
				
			/* Calculate slider buttons initial position. */
			
			this.startLimit =dojo.coords(this.rangeSelectorBar, true).x - dojo.contentBox(this.firstHandle).w/2;
		
			this.endLimit = this.startLimit + this.pixelsOnSlider;
			
			var ralativePosition = [];

			if(name == "first"){
				
				ralativePosition[0] = (this.ralativePositionFirst[0] < 0)? (this.ralativePositionFirst[0] ) : (this.ralativePositionFirst[0] + dojo.contentBox(this.firstHandle).w);
				ralativePosition[1] = (this.ralativePositionFirst[1] < 0)? (this.ralativePositionFirst[1] + 25) : (this.ralativePositionFirst[0] + dojo.contentBox(this.firstHandle).h);
      
				var pixelValue = (this.currentValue.lower - this.startRange) * this.pixelsPerUnit + dojo.coords(this.rangeSelectorBar, true).x - dojo.contentBox(handle).w/2;
				
				if(this.showTooltip){
					handle.tempHandle = this.firstTooltip;
					dojo.style(this.firstTooltip,"display","none");
				  if(this.showTooltipAllTime){
						dojo.style(this.firstTooltip,"display","");
					}
				}else{
					dojo.style(this.firstTooltip,"display","none");
				}
			}
			else if(name == "second"){
				
				ralativePosition[0] = (this.ralativePositionSecond[0] < 0)? (this.ralativePositionSecond[0] - 30) : (this.ralativePositionSecond[0] + dojo.contentBox(this.secondHandle).w);
				ralativePosition[1] = (this.ralativePositionSecond[1] < 0)? (this.ralativePositionSecond[1] + 25) : (this.ralativePositionSecond[0] + dojo.contentBox(this.secondHandle).h);
				var pixelValue = (this.currentValue.upper - this.startRange) * this.pixelsPerUnit + dojo.coords(this.rangeSelectorBar, true).x - dojo.contentBox(handle).w/2;
			
				if(this.showTooltip){
					
					handle.tempHandle = this.secondTooltip;
					dojo.style(this.secondTooltip,"display","none");
					if(this.showTooltipAllTime){
            dojo.style(this.secondTooltip,"display","");
					}
				}else{
					  dojo.style(this.secondTooltip,"display","none");
				}
			}else{
				console.debug("RangeSlider Widget: Something is wrong with name:" + name + " in this.setupSlider(handle, name)");
			}
			
			if(this.snapToGrid){
					pixelValue = this.getPixelValue(this.getUnitValue(pixelValue));
			}
			
			/* Set the slider buttons to their initial position. */
			handle.style.left = pixelValue + "px";
			handle.style.top = dojo.coords(this.rangeSelectorBar, true).y + dojo.contentBox(this.rangeSelectorBar).h/2 - dojo.contentBox(this.firstHandle).h/2 -2 + "px";
      
			if(dojo.isOpera!=0 && dojo.isOpera!=null)
			{
				handle.style.top = parseInt(handle.style.top) + window.pageYOffset +"px";
			}
			
			/* set the both tooltips initial position. */
			if(this.showTooltip){
				handle.tempHandle.style.position = "absolute";
			if(name == "first")
			{
				handle.tempHandle.style.top = dojo.coords(handle, true).y  + parseInt(ralativePosition[1])+ "px";
				handle.tempHandle.style.left = dojo.coords(handle, true).x  + parseInt(ralativePosition[0]) + "px";
			}
			else
			{
				handle.tempHandle.style.top = dojo.coords(handle, true).y  + parseInt(ralativePosition[1])-40+ "px";
				var endOfRange = this.endRange;
				if(Math.floor(endOfRange)!=this.endRange)
				{
					handle.tempHandle.style.left = dojo.coords(handle, true).x  + parseInt(ralativePosition[0]) - dojo.contentBox(handle.tempHandle).w + 16 + "px";
				}
				else
				{
					handle.tempHandle.style.left = dojo.coords(handle, true).x  + parseInt(ralativePosition[0]) - dojo.contentBox(handle.tempHandle).w + "px";
				}
			}
		
			}
			if(dojo.isOpera!=0 && dojo.isOpera!=null)
			{
				handle.tempHandle.style.top = parseInt(handle.tempHandle.style.top) + window.pageYOffset +"px";
			}
			
			this.valueChanged(name);
			
		},
		
		destroy: function(){
		this._movable.destroy();
		this.inherited('destroy', arguments);	
	},
/**
		 * This function rounds the value using dojo.math.round() function.
		 * It uses the userdefined decimalPoints parameter while rounding the value. 
		 * 
		 * @param value				The value to be rounded.
		 **/
		round : function(value){
			return dojo.number.round(value,this.decimalPoints);
		},
		
		/**
		 * This function positions the slider button at specified unit value.
		 * It means you just need to pass the value where you want the slider to move. 
		 * 
		 * @param node				The DOM node which represents one of the slider buttons, you want to move.
		 *
		 * @param unitValue			The value on the slider where you want to position the slider button.
		 *							e.g. 10 OR 120
		 **/
		setUnitPosition : function(node,unitValue){
			var pixelValue = (unitValue - this.startRange) * this.pixelsPerUnit + this.startLimit;
			this.setPixelPosition(node,pixelValue);
		},
		
		
		
		/**
		 * This function positions the slider button at specified pixel value.
		 * It means you need to pass the actual pixel value on the screen, where you want the slider to move. 
		 * 
		 * @param node				The DOM node which represents one of the slider buttons, you want to move.
		 *
		 * @param pixelValue		The pixel value on the screen (X axis) where you want to position the slider button.
		 *							It will be constrained within the slider bar, So you cannot move it beyond the 
		 *							slider bar limits
		 *							e.g. 500 OR 1500
		 **/
		setPixelPosition : function(node,pixelValue){
			
			this.currentHandle = node;
			var currentValue = pixelValue;
			
			/* We are setting the limits +/- 5 pixels from their origional positions. */
			/* This will allow us to move the handle easily at the limits. */
			var _startLimit = this.getPixelValue(0) - 3;
			var _endLimit = this.getPixelValue(this.totalRange) + 3;
			var ralativePosition = [];
			
			if(node.name == "first"){
				_endLimit = dojo.coords(this.secondHandle, true).x;
				/* Move current handle over the other. */
				this.secondHandle.style.zIndex = 10;
				this.secondTooltip.style.zIndex = 30;
				this.firstHandle.style.zIndex = 20;
				this.firstTooltip.style.zIndex = 40;

				
				ralativePosition[0] = (this.ralativePositionFirst[0] < 0)? (this.ralativePositionFirst[0]) : (this.ralativePositionFirst[0] + dojo.contentBox(this.firstHandle).w);
				ralativePosition[1] = (this.ralativePositionFirst[1] < 0)? (this.ralativePositionFirst[1] + 25) : (this.ralativePositionFirst[0] + dojo.contentBox(this.firstHandle).h);
			}
			else if(node.name == "second"){
				_startLimit = dojo.coords(this.firstHandle, true).x;
				/* Move current handle over the other. */
				this.firstHandle.style.zIndex = 10;
				this.firstTooltip.style.zIndex = 30;
				this.secondHandle.style.zIndex = 20;
				this.secondTooltip.style.zIndex = 40;

				ralativePosition[0] = (this.ralativePositionSecond[0] < 0)? (this.ralativePositionSecond[0] - 30) : (this.ralativePositionSecond[0] + dojo.contentBox(this.secondHandle).w);
				ralativePosition[1] = (this.ralativePositionSecond[1] < 0)? (this.ralativePositionSecond[1] + 25) : (this.ralativePositionSecond[0] + dojo.contentBox(this.secondHandle).h);
			}
			else{
				console.debug("RangeSlider Widget: Something is wrong with node.name:" + name + " in this.setPixelPosition(node,pixelValue)");
			}
			
			if(_startLimit + 4 <= currentValue && currentValue <= _endLimit)
			{	
				if(this.snapToGrid && !this.activeDrag)
					pixelValue = this.getPixelValue(this.getUnitValue(pixelValue));
				if(node.name == "first")
				  node.style.left = pixelValue + "px";
				else
					node.style.left = pixelValue - 4 + "px";
	
				/* Whenever the handle moves we need to move the tooltip along with it. */
				if(this.showTooltip){
					node.tempHandle.style.position = "absolute";
					if(node.name == "first")
					{
						if(pixelValue + parseInt(ralativePosition[0]) + dojo.contentBox(node.tempHandle).w <= this.getPixelValue(this.endRange) + 7)
						{
							node.tempHandle.style.left =  pixelValue  + parseInt(ralativePosition[0]) + "px";
						}
						node.tempHandle.style.top =  dojo.coords(node, true).y  + parseInt(ralativePosition[1])+ "px";
						if(dojo.isOpera!=0 && dojo.isOpera!=null)
						{
							node.tempHandle.style.top = parseInt(node.tempHandle.style.top) + window.pageYOffset +"px";
						}
					}
					else
					{	
						var secondHandleLeft = pixelValue - 4 + parseInt(ralativePosition[0]) - dojo.contentBox(node.tempHandle).w;
						if(secondHandleLeft >= this.getPixelValue(0) - 1)
						{
							node.tempHandle.style.left =  secondHandleLeft + "px";
						}
						node.tempHandle.style.top =  dojo.coords(node, true).y  + parseInt(ralativePosition[1])-40 + "px";
						if(dojo.isOpera!=0 && dojo.isOpera!=null)
						{
							node.tempHandle.style.top = parseInt(node.tempHandle.style.top) + window.pageYOffset +"px";
						}
					}
				}
				this.valueChanged(node.name);
			}
			else if(node.name == "second" && _startLimit + 4 <= currentValue && currentValue <= _endLimit + 4)
			{
				if(this.snapToGrid && !this.activeDrag)
					pixelValue = this.getPixelValue(this.getUnitValue(pixelValue));
				node.style.left = pixelValue - 4 + "px";
				if(this.showTooltip){
					node.tempHandle.style.position = "absolute";
					var secondHandleLeft = pixelValue - 4 + parseInt(ralativePosition[0]) - dojo.contentBox(node.tempHandle).w;
					if(secondHandleLeft >= this.getPixelValue(0) - 1)
					{
						node.tempHandle.style.left = secondHandleLeft + "px";
					}
					node.tempHandle.style.top =  dojo.coords(node, true).y  + parseInt(ralativePosition[1])-40 + "px";
				}
				if(dojo.isOpera!=0 && dojo.isOpera!=null)
				{
					node.tempHandle.style.top = parseInt(node.tempHandle.style.top) + window.pageYOffset +"px";
				}
				this.valueChanged(node.name);
			}
			else if(node.name == "first" && _startLimit <= currentValue && currentValue <= _endLimit)
			{
				if(this.snapToGrid && !this.activeDrag)
					pixelValue = this.getPixelValue(this.getUnitValue(pixelValue));
				node.style.left = pixelValue + "px";
				if(this.showTooltip){
					node.tempHandle.style.position = "absolute";
					node.tempHandle.style.left =  pixelValue  + parseInt(ralativePosition[0]) + "px";
					node.tempHandle.style.top =  dojo.coords(node, true).y  + parseInt(ralativePosition[1])+ "px";
				}
				if(dojo.isOpera!=0 && dojo.isOpera!=null)
				{
					node.tempHandle.style.top = parseInt(node.tempHandle.style.top) + window.pageYOffset +"px";
				}
				this.valueChanged(node.name);
			}
		},

/**
     * This function returns the unitValue for specified pixelValue.
		 *
		 * It basically converts pixelValue to unitValue. It uses the startLimit, pixelsPerUnit and incrementValue parameter while
		 * calculating the unit value from given pixel value.
		 * For example if there are 10 pixels for one unit (as per pixelsPerUnit parameter), and the startLimit for widget is 0
		 * then for 100 pixel value it will return 10, and if the startLimit for widget is 3 it will return 13 for 100 pixel value.
		 * 
		 * @param pixelValue		The pixel value on the screen (X axis) for which you want to get unit value.
		 *							Represents actual pixel on the sliderBar.
		 *
		 * @return unitValue		The unit value. A logical representation for pixels on the sliderBar.
		 **/
		getUnitValue : function(pixelValue){
			var first = this.startLimit;
			var last = pixelValue;
			var res = this.startRange + (last-first)/this.pixelsPerUnit;
			var res = this.round(res/this.incrementValue) * this.incrementValue;
		
			if(res < this.startRange){
				res = this.startRange;
			}
			if(res > this.endRange){
				res = this.endRange;
			}
	
			return res;
		},
		/**
		 * This function returns the pixelValue for specified unitValue.
		 *
		 * It basically converts unitValue to pixelValue. It uses the startLimit, pixelsPerUnit and incrementValue parameter while
		 * calculating the unit value from given pixel value.
		 * For example if there are 10 pixels for one unit (as per pixelsPerUnit parameter), and the startLimit for widget is 0
		 * then for 10 unit value it will return 100, and if the startLimit for widget is 3 it will return 70 for 10 unit value.
		 * 
		 * @param unitValue			The unit value for which you want to get pixel value.
		 *							A logocal representation for pixels on the sliderBar.
		 *
		 * @return pixelValue		The pixel value on the screen (X axis).
		 *							Represents actual pixel on the sliderBar.
		 **/
		getPixelValue : function(unitValue){
			unitValue = this.round(unitValue/this.incrementValue) * this.incrementValue;
			var first = this.startLimit;
			var last = unitValue * this.pixelsPerUnit;
			var res = (first + last);
			
			if(res < this.startLimit)
				res = this.startLimit;
			if(res > this.endLimit)
				res = this.endLimit;
			
			return res;
		},
		
		/**
		 * This function returns the nearer sliding button DOM node.
		 *
		 * It accepts pixelValue and based on that it calculates the distance from that point to both sliding buttons, 
		 * and returns the nearest sliding button.
		 *
		 * @param pixelValue		The pixel value on the screen (X axis).
		 *							Represents actual pixel on the sliderBar.
		 * @return DOM node			The DOM node for one of the slider buttons, Which is nearer to the given pixelValue.
		 **/
	getCloserSliderHandle : function(pixelValue){
			var firstValue = dojo.coords(this.firstHandle, true).x + dojo.contentBox(this.firstHandle).w/2;
			var SecondValue = dojo.coords(this.secondHandle, true).x + dojo.contentBox(this.secondHandle).w/2;
			var diffFirst = pixelValue - firstValue;
			var diffSecond = SecondValue - pixelValue;
			
			if(diffFirst<=diffSecond)
			{
					return this.firstHandle;
			}
			else
			{
					return this.secondHandle;
			}
			
		},
		
		/**
		 * This function returns a current range for the widget.
		 *
		 * This function returns a JavaScript object having 'lower' and 'upper' properties. These two value represent the 
		 * current range for the widget.
		 *
		 * @return Object			This object has 'lower' and 'upper' properties. These two value represent the 
		 *							current range for the widget.
		 **/
		getCurrentValues : function(){
			return this.currentValue;
		},
/**
		 * This function calculates the upper and lower range for the widget and then set them to an internal variable
		 * currentValue. So later we can use this variabale for getting the lower and upper limits.
		 **/
		valueChanged : function(sliderName){
		
			if(sliderName == "first" || sliderName == "*"){
				this.currentValue.lower = this.round(this.getUnitValue(dojo.coords(this.firstHandle, true).x));
				
			
			}
			if(sliderName == "second" || sliderName == "*"){
				this.currentValue.upper = this.round(this.getUnitValue(dojo.coords(this.secondHandle, true).x));
				
			}
			
			var formattedLowerValue = this.currentValue.lower;
			var formattedUpperValue = this.currentValue.upper;
			
			if(this.currencyCode != null && this.currencyCode != ""){
				formattedLowerValue = dojo.currency.parse(formattedLowerValue,this.currencyCode,{places:0});
				formattedUpperValue = dojo.currency.parse(formattedUpperValue,this.currencyCode,{places:0});
			}

			/* Change the caption of the tooltip. */			
			if(this.showTooltip){
				this.firstTooltip.innerHTML = this.prefix + formattedLowerValue + this.suffix;
				this.secondTooltip.innerHTML = this.prefix + formattedUpperValue + this.suffix;
				
			}

			this.onChange(this);
		},

		getFormattedValues : function(){
			var formattedLowerValue = this.currentValue.lower;
			var formattedUpperValue = this.currentValue.upper;
			
			if(this.currencyCode != null && this.currencyCode != ""){
				formattedLowerValue = dojo.currency.format(formattedLowerValue,this.currencyCode,{places:0});
				formattedUpperValue =dojo.currency.format(formattedUpperValue,this.currencyCode,{places:0});
			}
			
			return {lower:formattedLowerValue, upper:formattedUpperValue};
		},

		/**
		 * This function gets the nearer sliding button and positions it, where user has clicked on the 'Slider Bar'.
		 * It is called when user click on the 'Slider Bar'.
		 *
		 * @param	e				The JavaScript event object.
		 **/
		onSliderBarClick : function(e){
		  var pixelValue =  e.clientX;
			var node = this.getCloserSliderHandle(pixelValue);
			pixelValue = pixelValue - dojo.contentBox(node).w/2;
			if(node.name == "second")
				pixelValue= pixelValue + 4;
			this.setPixelPosition(node,pixelValue);
			this.onChangeMade(this);
		},
		
   setPosition: function(pixelValue){
   	var node = this.getCloserSliderHandle(pixelValue);
   	pixelValue = pixelValue - dojo.contentBox(node).w/2;
   	this.setPixelPosition(node,pixelValue);
   	this.onChangeMade(this);
  },
  
    /**
		 * This function shows the tooltip for first sliding button, if showTooltip parameter is set to 'true'.
		 * It is called when user move the mouse cursor over the first sliding button.
		 **/
		onFirstMouseOver : function(){
		
			if(!this.showTooltipAllTime){
			 dojo.style(this.firstTooltip,"display","");
			}
			dojo.addClass(this.firstHandle, 'rangeSelectorHandleHover');
		},
		
		/**
		 * This function hides the tooltip for first sliding button, if showTooltip parameter is set to 'true'.
		 * It is called when user move the mouse cursor out from the first sliding button.
		 **/
		onFirstMouseOut : function(){
			
			if(!this.showTooltipAllTime){
				dojo.style(this.firstTooltip,"display","none");
			}
			dojo.removeClass(this.firstHandle, 'rangeSelectorHandleHover');
		},
		
		/**
		 * This function shows the tooltip for second sliding button, if showTooltip parameter is set to 'true'.
		 * It is called when user move the mouse cursor over the second sliding button.
		 **/
		onSecondMouseOver : function(){
			if(!this.showTooltipAllTime){
				dojo.style(this.secondTooltip,"display","");
			}
			dojo.addClass(this.secondHandle, 'rangeSelectorHandleHover');
		},
		
		/**
		 * This function hides the tooltip for second sliding button, if showTooltip parameter is set to 'true'.
		 * It is called when user move the mouse cursor out from the second sliding button.
		 **/
		onSecondMouseOut : function(){
			if(!this.showTooltipAllTime){
				dojo.style(this.secondTooltip,"display","none");
		}
			dojo.removeClass(this.secondHandle, 'rangeSelectorHandleHover');
		},
		
		
		/**
		 * This function is called when user clicks on the widget.
		 * User can set his userdefined function as a callback function for this event.
		 * e.g. this.onClick = myFunction();
		 * In this case myFunction() will be called whenever user clicks on the widget.
		 **/
		onclick : function(e){
			
		},
		
		/**
		 * This function enables keyboard access to the Price Range Slider through Alt Enter and Shift Enter.
		 **/
		onKeyPress : function(e){
			var handleFlag="";
			var relativePosition = (this.ralativePositionSecond[0] < 0)? (this.ralativePositionSecond[0] - 30) : (this.ralativePositionSecond[0] + dojo.contentBox(this.secondHandle).w - 20);
			for(var i=0; i<e.target.childNodes.length; i++)
			{
				if(e.target.childNodes[i].id==this.id+"_firstHandle")
				{
					handleFlag="first";
				}
				else if(e.target.childNodes[i].id==this.id+"_secondHandle")
				{
					handleFlag="second";
				}
			}
			if(handleFlag=="first")
			{
				var pixelValue;
				if(e.shiftKey && e.keyCode == dojo.keys.ENTER)
				{
					if(this.currentValue.lower - 1 >= this.defaultStart)
					{
						this.currentValue.lower = this.currentValue.lower - 1;
						this.firstHandle.style.left = this.getPixelValue(this.currentValue.lower + relativePosition) + "px";
						if(this.getPixelValue(this.currentValue.lower + relativePosition) + dojo.contentBox(this.firstTooltip).w <= this.getPixelValue(this.endRange) + 5)
						{
							this.firstTooltip.style.left = this.getPixelValue(this.currentValue.lower + relativePosition) + "px";
						}
						if(this.showTooltip)
						{
							this.firstTooltip.innerHTML = "";
							this.firstTooltip.innerHTML = this.prefix + this.currentValue.lower + this.suffix;								
						}
						this.onChangeMade(this);
						setTimeout(dojo.hitch(this,"gotoToolTip1",""),1000);
					}	
				}
				else if(e.altKey && e.keyCode == dojo.keys.ENTER)
				{
					if(this.currentValue.lower + 1 <= this.currentValue.upper)
					{
						this.currentValue.lower = this.currentValue.lower + 1;	
						this.firstHandle.style.left = this.getPixelValue(this.currentValue.lower + relativePosition) + "px";
						if(this.getPixelValue(this.currentValue.lower + relativePosition) + dojo.contentBox(this.firstTooltip).w <= this.getPixelValue(this.endRange) + 5)
						{
							this.firstTooltip.style.left = this.getPixelValue(this.currentValue.lower + relativePosition) + "px";
						}
						if(this.showTooltip)
						{
								this.firstTooltip.innerHTML = "";
								this.firstTooltip.innerHTML = this.prefix + this.currentValue.lower + this.suffix;
						}
						this.onChangeMade(this);
						setTimeout(dojo.hitch(this,"gotoToolTip1",""),1000);
					}
				}
			}
			else if(handleFlag=="second")
			{	
				var pixelValue;
				if(e.shiftKey && e.keyCode == dojo.keys.ENTER)
				{
					if(this.currentValue.upper - 1 >= this.currentValue.lower)
					{
						this.currentValue.upper = this.currentValue.upper - 1;
						this.secondHandle.style.left = this.getPixelValue(this.currentValue.upper + relativePosition) + "px";
						if(this.getPixelValue(this.currentValue.upper + relativePosition) - dojo.contentBox(this.secondTooltip).w + 7 >= this.getPixelValue(0))
						{
							this.secondTooltip.style.left = this.getPixelValue(this.currentValue.upper + relativePosition) - dojo.contentBox(this.secondTooltip).w + 7 + "px";
						}
						if(this.showTooltip)
						{
							this.secondTooltip.innerHTML = "";
							this.secondTooltip.innerHTML = this.prefix + this.currentValue.upper + this.suffix;
						}
						this.onChangeMade(this);
						setTimeout(dojo.hitch(this,"gotoToolTip2",""),1000);
					}
				}
				else if(e.altKey && e.keyCode == dojo.keys.ENTER) 
				{
					if(this.currentValue.upper + 1 <= this.round(this.defaultEnd))
					{
						this.currentValue.upper = this.currentValue.upper + 1;
						this.secondHandle.style.left = this.getPixelValue(this.currentValue.upper + relativePosition) + "px";
						if(this.getPixelValue(this.currentValue.upper + relativePosition) - dojo.contentBox(this.secondTooltip).w + 7 >= this.getPixelValue(0))
						{
							this.secondTooltip.style.left = this.getPixelValue(this.currentValue.upper + relativePosition) - dojo.contentBox(this.secondTooltip).w + 7 + "px";
						}
						if(this.showTooltip)
						{
							this.secondTooltip.innerHTML = "";
							this.secondTooltip.innerHTML = this.prefix + this.currentValue.upper + this.suffix;	
						}
						this.onChangeMade(this);
						setTimeout(dojo.hitch(this,"gotoToolTip2",""),1000);
					}
				}
			}
		},
		/**
		 * This function gives focus to the tooltip of the first handle (so that the new value is read out) and 
		 * returns back focus to the first handle (so that the handle is ready to be moved again).
		 **/
		gotoToolTip1 : function(){
			this.firstHandleTooltip.focus();
			this.firstHandleContent.focus();
		},

		/**
		 * This function gives focus to the tooltip of the second handle (so that the new value is read out) and 
		 * returns back focus to the second handle (so that the handle is ready to be moved again).
		 **/
		gotoToolTip2 : function(){
			this.secondHandleTooltip.focus();
			this.secondHandleContent.focus();
		},
		/**
		 * This function is called whenever there is a change 'upper' and 'lower' limit of the widget.
		 * When user drags one of the sliding button OR clicks on the 'Slider Bar' (to move the buttons) 
		 * this function gets called.
		 *
		 * Use this function carefully as a callback, bacause a samll movement can cause many calls to this function
		 *
		 * User can set his userdefined function as a callback function for this event.
		 * e.g. this.onChange = myFunction();
		 **/
		onchange : function(e){
			
		},
		

	/**
		 * This function is called whenever there is a change 'upper' and 'lower' limit of the widget.
		 * When user drags one of the sliding button and stops OR clicks on the 'Slider Bar' (to move the buttons) 
		 * this function gets called.
		 *
		 * In case of draging, this function gets called only once when user stops dragging the sliding button.
		 * It won't get called when user is still draging the sliding button, only when he stops dragging it is called.
		 *
		 * User can set his userdefined function as a callback function for this event.
		 * e.g. this.onChangeMade = myFunction();
		 **/
		onChangeMade : function(e){
		
		},


		/**
		 * This function is called when the browser window get resized
		 **/
		onWindowResized : function(){
			/* Setup the two sliders. */
			this.setupSlider(this.firstHandle, "first");
			this.setupSlider(this.secondHandle, "second");
		},
		
  	onMoveStop: function(e,count){
			if(this.snapToGrid && this.activeDrag && this.currentHandle !== null){
				var pixelValue = this.getPixelValue(this.getUnitValue(dojo.coords(this.currentHandle, true).x));
				this.currentHandle.style.left = pixelValue + "px";
			}
			if(!this.showTooltipAllTime){
				dojo.style(this.firstTooltip,"display","none");
				dojo.style(this.secondTooltip,"display","none");
			}
			if(count != this.stopCount){return;}
			else{
			this.onChangeMade(this);
			}
	}
	
});

/**
 * This class extends the dojo.dnd.Mover class to provide
 * features for the slider handle.
 */
dojo.declare (
	"wc.widget.SliderDragMove",
	[dojo.dnd.Mover],
{


	/** 
	 * Moves the node to follow the mouse.
	 * Extends functon dojo.dnd.Mover by adding functionality to snap handle
	 * to a discrete value.
	 **/
	onMouseMove: function (e) {

	  var widget = this.widget;
    var c = this.constraintBox;
    
    if(!c){
          var container = widget.rangeSelectorBar;
          var s = dojo.getComputedStyle(container);
          var c = dojo._getContentBox(container, s);
              c[widget. _startingPixelCount] = 0;
              this.constraintBox = c;
          }
    var m = this.marginBox;
             
    var pixelValue =  e[widget._mousePixelCoord];
               
    var node = widget.getCloserSliderHandle(pixelValue);
     
    widget.setPixelPosition(node, pixelValue);
              
	},
	/**
	 *  This function stops the slider movement, deletes all references, so the object can be garbage-collected.
	 */
	destroy: function(){
		dojo.forEach(this.events, dojo.disconnect);
		/* undo global settings. */
		var h = this.host;
		if(h && h.onMoveStop){
			h.onMoveStop(this);
			var widget = this.widget;
		    widget.stopCount = widget.stopCount + 1;
			setTimeout(dojo.hitch(widget,"onMoveStop",widget,widget.stopCount),10);
		}
		/* destroy objects. */
		this.events = this.node = null;
	}

});




}

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


if(!dojo._hasResource["wc.widget.WCColorPicker"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["wc.widget.WCColorPicker"] = true;
dojo.provide("wc.widget.WCColorPicker");
dojo.require("dojox.widget.ColorPicker");

;(function(d){
	dojo.declare("wc.widget.WCColorPicker",
	       dojox.widget.ColorPicker,
	       {
	       //turning off webSafe mode
	       webSafe:false,  
	       
	       templateString:"<div class=\"dojoxColorPicker\" dojoAttachEvent=\"onkeypress: _handleKey\">\r\n\t<div class=\"dojoxColorPickerBox\">\r\n\t\t<div dojoAttachPoint=\"cursorNode\" tabIndex=\"0\" class=\"dojoxColorPickerPoint\"></div>\r\n\t\t<img dojoAttachPoint=\"colorUnderlay\" dojoAttachEvent=\"onclick: _setPoint\" class=\"dojoxColorPickerUnderlay\" src=\"${_underlay}\">\r\n\t</div>\r\n\t<div class=\"dojoxHuePicker\">\r\n\t\t<div dojoAttachPoint=\"hueCursorNode\" tabIndex=\"0\" class=\"dojoxHuePickerPoint\"></div>\r\n\t\t<div dojoAttachPoint=\"hueNode\" class=\"dojoxHuePickerUnderlay\" dojoAttachEvent=\"onclick: _setHuePoint\"></div>\r\n\t</div>\r\n\t<div dojoAttachPoint=\"previewNode\" class=\"dojoxColorPickerPreview\"></div>\r\n\t<div dojoAttachPoint=\"safePreviewNode\" class=\"dojoxColorPickerWebSafePreview\"></div>\r\n\t" +
	              "<div class=\"dojoxColorPickerOptional\" dojoAttachEvent=\"onchange: _colorInputChange\">\r\n\t\t" +
	              "<div class=\"dijitInline dojoxColorPickerRgb\" dojoAttachPoint=\"rgbNode\" >\r\n\t\t\t<table>\r\n\t\t\t<tr><td>r</td><td>" +
	              "<input dojoAttachPoint=\"Rval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" ></td></tr>\r\n\t\t\t<tr><td>g</td><td>" +
	              "<input dojoAttachPoint=\"Gval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" ></td></tr>\r\n\t\t\t<tr><td>b</td><td>" +
	              "<input dojoAttachPoint=\"Bval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" ></td></tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t" +
	              "<div class=\"dijitInline dojoxColorPickerHsv\" dojoAttachPoint=\"hsvNode\">\r\n\t\t\t<table>\r\n\t\t\t<tr><td>h</td><td>" +
	              "<input dojoAttachPoint=\"Hval\"size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" > &deg;</td></tr>\r\n\t\t\t<tr><td>s</td><td>" +
	              "<input dojoAttachPoint=\"Sval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" > %</td></tr>\r\n\t\t\t<tr><td>v</td><td>" +
	              "<input dojoAttachPoint=\"Vval\" size=\"1\" dojoAttachEvent=\"onchange: _colorInputChange\" > %</td></tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t" +
	              "<div class=\"dojoxColorPickerHex\" dojoAttachPoint=\"hexNode\">\t\r\n\t\t\thex: " +
	              "<input dojoAttachPoint=\"hexCode, focusNode, valueNode\" size=\"6\" class=\"dojoxColorPickerHexCode\" dojoAttachEvent=\"onchange: _colorInputChange\" >\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n",
	              
	       postCreate: function(){
	              //Fix dojo color picker bug for dialog display
	              if(dojo.isIE || dojo.isWebKit){ // IE won't stop the event with keypress and Safari won't send an ESCAPE to keypress at all
	                     this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
	              }
	              // Update our reset value if it hasn't yet been set (because this.attr
	              // is only called when there *is* a value
	              if(this._resetValue === undefined){
	                     this._resetValue = this.value;
	              }
	              
	              if(d.isIE < 7){ 
	                     this.colorUnderlay.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this._underlay+"', sizingMethod='scale')";
	                     this.colorUnderlay.src = this._blankGif.toString();
	              }
	              // hide toggle-able nodes:
	              if(!this.showRgb){ this.rgbNode.style.display = "none"; }
	              if(!this.showHsv){ this.hsvNode.style.display = "none"; }
	              if(!this.showHex){ this.hexNode.style.display = "none"; } 
	              if(!this.webSafe){ this.safePreviewNode.style.visibility = "hidden"; } 
	              
	              // this._offset = ((d.marginBox(this.cursorNode).w)/2); 
	              this._offset = 0; 
	              var cmb = d.marginBox(this.cursorNode);
	              var hmb = d.marginBox(this.hueCursorNode);
	
	              this._shift = {
	                     hue: {
	                            x: Math.round(hmb.w / 2) - 1,
	                            y: Math.round(hmb.h / 2) - 1
	                     },
	                     picker: {
	                            x: Math.floor(cmb.w / 2),
	                            y: Math.floor(cmb.h / 2)
	                     }
	              };
	              
	              //setup constants
	              var ox = this._shift.picker.x;
	              var oy = this._shift.picker.y;
	              
	              this.PICKER_HUE_H = 150;
	              this.PICKER_SAT_VAL_H = 150;
	              this.PICKER_SAT_VAL_W = 150;
	              
	              this._mover = new d.dnd.move.boxConstrainedMoveable(this.cursorNode, {
	                     box: {
	                            t:0 - oy,
	                            l:0 - ox,
	                            w:this.PICKER_SAT_VAL_W,
	                            h:this.PICKER_SAT_VAL_H
	                     }
	              });
	              
	              this._hueMover = new d.dnd.move.boxConstrainedMoveable(this.hueCursorNode, {
	                     box: {
	                            t:0 - this._shift.hue.y,
	                            l:0,
	                            w:0,
	                            h:this.PICKER_HUE_H
	                     }
	              });
	              
	              
	              // no dnd/move/move published ... use a timer:
	              d.subscribe("/dnd/move/stop", d.hitch(this, "_clearTimer"));
	              d.subscribe("/dnd/move/start", d.hitch(this, "_setTimer"));
	       }
	}
	);
})(dojo);
}

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library"],function(c){"use strict";var O=c.Orientation;var S={};S.render=function(r,C){var h=C.getOrientation()===O.Horizontal;var o=h?"sapUiLoSplitterH":"sapUiLoSplitterV";var a=sap.ui.getCore().getConfiguration().getAnimation();r.write("<div");r.writeControlData(C);r.addClass("sapUiLoSplitter");r.addClass(o);if(a&&!C._liveResize){r.addClass("sapUiLoSplitterAnimated");}r.writeClasses();r.addStyle("width",C.getWidth());r.addStyle("height",C.getHeight());r.writeStyles();r.write(">");this.renderInitialContent(r,C);r.write("</div>");};S.renderInitialContent=function(r,C){var I=C.getId();var h=C.getOrientation()===O.Horizontal;var s=h?"width":"height";var g="sap-icon://"+(h?"horizontal":"vertical")+"-grip";var a=C._getContentAreas();var l=a.length;var b=C.getCalculatedSizes();for(var i=0;i<l;++i){var L=a[i].getLayoutData();var d="0";if(b[i]){d=b[i]+"px";}else if(L){d=L.getSize();}r.write("<section "+"id=\""+I+"-content-"+i+"\" "+"style=\""+s+": "+d+";\" "+"class=\"sapUiLoSplitterContent\">");r.renderControl(a[i]);r.write("</section>");if(i<l-1){r.write("<div id=\""+I+"-splitbar-"+i+"\" "+"role=\"separator\" "+"title=\""+C._getText("SPLITTER_MOVE")+"\" "+"class=\"sapUiLoSplitterBar\" "+"aria-orientation=\""+(h?"vertical":"horizontal")+"\" "+"tabindex=\"0\">");if(C._bUseIconForSeparator){r.writeIcon(g,"sapUiLoSplitterBarIcon",{"id":I+"-splitbar-"+i+"-icon","title":null,"aria-label":null});}else{r.write("<span class='sapUiLoSplitterBarIcon'></span>");}r.write("</div>");}}r.write("<div id=\""+I+"-overlay\" class=\"sapUiLoSplitterOverlay\" style=\"display: none;\">"+"<div id=\""+I+"-overlayBar\" class=\"sapUiLoSplitterOverlayBar\">");if(C._bUseIconForSeparator){r.writeIcon(g,"sapUiLoSplitterBarIcon",{"id":I+"-splitbar-Overlay-icon","title":null,"aria-label":null});}else{r.write("<span class=\"sapUiLoSplitterBarIcon\"></span>");}r.write("</div>"+"</div>");};return S;},true);

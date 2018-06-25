/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/Device","../UIArea"],function(q,D,U){"use strict";var d="sapUiDnDDragging",g,i;var o,c,a,v,V,C,b,s,e,t,f;var h=function(E,S){if(E.addStyleClass){E.addStyleClass(S);}else{E.$().addClass(S);}return E;};var r=function(E,S){if(E.removeStyleClass){E.removeStyleClass(S);}else{E.$().removeClass(S);}return E;};var j=function(E){var _={};var A=E.originalEvent.dataTransfer;var B=function(T,F){if(A&&T==="text"||(D.browser!=="msie"&&D.browser!=="edge")){A.setData(T,F);}};return{setData:function(K,F){F=""+F;_[K]=F;B(K,F);},getData:function(K){return _[K];},setTextData:function(F){F=""+F;_["text/plain"]=F;_["text"]=F;B("text/plain",F);B("text",F);},getTextData:function(){return _["text/plain"];},setComplexData:function(K,F){_[K]=F;},getComplexData:function(K){return _[K];},getIndicator:function(){return i&&i[0];},draggedControl:a,dropControl:v};};var k=function(){z().hide();if(a){r(a,d);}o=undefined;c=undefined;a=undefined;v=undefined;V=undefined;C=undefined;b=undefined;s=undefined;e=undefined;t=undefined;f=undefined;};var l=function(){if(!g){g=q("<div class=\"sapUiDnDGhostContainer\"></div>");q(document.body).append(g);}return g;};var m=function(E,I){if(!E){return[];}var A=E.getDragDropConfig?E.getDragDropConfig():[];var P=E.getParent()&&E.getParent().getDragDropConfig?E.getParent().getDragDropConfig():[];return A.concat(P).filter(function(B){var F=B.getMetadata();if(I){return F.isInstanceOf("sap.ui.core.dnd.IDragInfo");}else{return F.isInstanceOf("sap.ui.core.dnd.IDragInfo")&&!F.isInstanceOf("sap.ui.core.dnd.IDropInfo");}});};var n=function(E,A,B){return B.getMetadata().isInstanceOf("sap.ui.core.dnd.IDragInfo")&&B.isDraggable(E)&&B.fireDragStart(A,E);};var p=function(E,I){if(!E){return[];}var A=E.getDragDropConfig?E.getDragDropConfig():[];var P=E.getParent()&&E.getParent().getDragDropConfig?E.getParent().getDragDropConfig():[];return A.concat(P).filter(function(B){var F=B.getMetadata();if(I){return F.isInstanceOf("sap.ui.core.dnd.IDropInfo");}else{return F.isInstanceOf("sap.ui.core.dnd.IDropInfo")&&!F.isInstanceOf("sap.ui.core.dnd.IDragInfo");}});};var u=function(E,A,B){return B.getMetadata().isInstanceOf("sap.ui.core.dnd.IDropInfo")&&B.fireDragEnter(A,E);};var w={};w.preprocessEvent=function(E){var A=E.type;if(A==="dragstart"){if(!E.target.draggable){return;}if(/^(input|textarea)$/i.test(document.activeElement.tagName)){return;}a=q(E.target).control(0,true);c=m(a,true);if(c.length===0){return;}E.dragSession=o=j(E);if(!D.browser.msie){var B=(a.getDragGhost&&a.getDragGhost());if(B){var g=l().append(B);window.setTimeout(function(){g.empty();},0);E.originalEvent.dataTransfer.setDragImage(B,0,0);}}if(D.browser.firefox&&E.originalEvent.dataTransfer.types.length===0){E.originalEvent.dataTransfer.setData("ui5/dummyDataForFirefox","data");}}if(/^(dragenter|dragover|dragleave|dragend|drop)$/i.test(A)){E.dragSession=o;}if(A==="dragenter"){if(!E.dragSession){return;}var F=q(E.target).control(0,true);if(!F||F===b){f=true;return;}f=false;t=Date.now();b=F;v=undefined;E.dragSession.dropControl=undefined;V=undefined;C=[];var G=false;var P=p(F);c.forEach(function(I){if(P.indexOf(I)===-1&&I.getMetadata().isInstanceOf("sap.ui.core.dnd.IDropInfo")){P.push(I);}});P.forEach(function(I){var _=F;if(I.getMetadata().isInstanceOf("sap.ui.core.dnd.IDropInfo")){while(_){if(I.isDroppable(_,E.target)){C.push(I);if(!G){var J=I.getTargetElement();if(J&&!I.getTargetAggregation()){v=sap.ui.getCore().byId(J)||_;}else{v=_;}E.dragSession.dropControl=v;V=I;e=I.getDropEffect();E.originalEvent.dataTransfer.dropEffect=e.toLowerCase();G=true;}}_=_.getParent();}}});if(C.length>1){q.sap.log.warning("More than one matching drop configuration on "+b.toString()+": "+C.length);}}if(A==="dragover"){if(Date.now()-t>=1000){var L=q.Event(null,E);L.type="longdragover";var H=q(E.target).control(0,true);if(H){H.getUIArea()._handleEvent(L);t=Date.now();}}if(!v){s=undefined;z().hide();return;}E.originalEvent.dataTransfer.dropEffect=e.toLowerCase();E.preventDefault();var T=x(V,E,v);if(T){s=T[1];}else{s=undefined;}}};w.postprocessEvent=function(E){var A=E.type;if(A==="dragstart"){if(E.isDefaultPrevented()||!c){c=[];}else{c=c.filter(n.bind(undefined,a,E));}if(c.length===0){E.preventDefault();k();return;}h(a,d);q(document).one("dragend",k);}if(A==="dragenter"){if(!E.dragSession||f){return;}if(E.isDefaultPrevented()||v&&!u(v,E,V)){v=undefined;V=undefined;E.dragSession.dropControl=undefined;}if(v){E.preventDefault();}else{e="None";E.originalEvent.dataTransfer.dropEffect="none";}}if(A==="drop"){if(v&&V){V.fireDrop(E,s);}k();}};U.addEventPreprocessor(w.preprocessEvent);U.addEventPostprocessor(w.postprocessEvent);var x=function(A,E,B){var T=A.getTargetAggregation();if(!T){y(E,B.getDomRef(),"On");return[B,"On"];}var F,G=A.getDropPosition();if(B.getAggregationDomRef){F=B.getAggregationDomRef(T);G="On";}if(!F){F=B.getDomRef();}var H=y(E,F,G,A.getDropLayout());return[B,H];};var y=function(E,A,B,F){var G=B,H=A.getBoundingClientRect(),P=window.pageYOffset,I=window.pageXOffset,J=z(),K,L={top:H.top+P,bottom:H.bottom+P,left:H.left+I,right:H.right+I,width:H.width,height:H.height};if(F=="Horizontal"){J.attr("data-drop-layout","horizontal").css("height",L.height).css("top",L.top);var M=E.pageX-L.left;if(G==="Between"){J.attr("data-drop-position","between").css("width","");if(M<L.width*0.5){J.css("left",L.left);K="Before";}else{J.css("left",L.right);K="After";}}else if(G==="OnOrBetween"){if(M<L.width*0.25){J.attr("data-drop-position","between").css("left",L.left).css("width","");K="Before";}else if(M>L.width*0.75){J.attr("data-drop-position","between").css("left",L.right).css("width","");K="After";}else{K="On";}}}else{J.attr("data-drop-layout","vertical").css("width",L.width).css("left",L.left);var N=E.pageY-L.top;if(G==="Between"){J.attr("data-drop-position","between").css("height","");if(N<L.height*0.5){J.css("top",L.top);K="Before";}else{J.css("top",L.bottom);K="After";}}else if(G==="OnOrBetween"){if(N<L.height*0.25){J.attr("data-drop-position","between").css("top",L.top).css("height","");K="Before";}else if(N>L.height*0.75){J.attr("data-drop-position","between").css("top",L.bottom).css("height","");K="After";}else{K="On";}}}if(G==="On"||K==="On"){K="On";J.attr("data-drop-position","on").css("top",L.top).css("left",L.left).css("height",L.height).css("width",L.width);}J.show();return K;};var z=function(){if(i){return i;}i=q("<div class=\"sapUiDnDIndicator\"></div>");q(sap.ui.getCore().getStaticAreaRef()).append(i);return i;};return w;},true);

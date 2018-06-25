/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/Overlay'],function(q,O){"use strict";var A=O.extend("sap.ui.dt.AggregationOverlay",{metadata:{library:"sap.ui.dt",properties:{aggregationName:{type:"string"},targetZone:{type:"boolean",defaultValue:false}},aggregations:{children:{type:"sap.ui.dt.Overlay",multiple:true},designTimeMetadata:{type:"sap.ui.dt.AggregationDesignTimeMetadata",multiple:false}},events:{targetZoneChange:{parameters:{targetZone:{type:"boolean"}}}}}});A.prototype.getAssociatedDomRef=function(){var e=this.getElementInstance();var a=this.getAggregationName();var d=this.getDesignTimeMetadata();return d.getAssociatedDomRef(e,d.getDomRef(),a);};A.prototype.setTargetZone=function(t){if(this.getTargetZone()!==t){this.setProperty("targetZone",t);this.toggleStyleClass("sapUiDtOverlayTargetZone",t);this.fireTargetZoneChange({targetZone:t});}return this;};A.prototype.isTargetZone=function(){return this.getTargetZone();};A.prototype.isAssociation=function(){return!!this.getDesignTimeMetadata().getData().aggregationLike;};A.prototype.getChildren=function(){return this.getAggregation("children")||[];};A.prototype._getScrollContainerIndex=function(o,a){var s;a=a||this;if(o._aScrollContainers){s=-1;o._aScrollContainers.some(function(S,i){if(S.aggregations){return S.aggregations.some(function(b){if(a.getAggregationName()===b){s=i;return true;}});}});}return s;};return A;},true);

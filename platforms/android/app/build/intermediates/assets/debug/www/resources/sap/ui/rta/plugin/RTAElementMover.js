/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/dt/plugin/ElementMover','sap/ui/dt/OverlayUtil','sap/ui/dt/ElementUtil','sap/ui/fl/Utils','sap/ui/rta/Utils','sap/ui/rta/command/CommandFactory','sap/ui/rta/plugin/Plugin','sap/ui/dt/OverlayRegistry','sap/ui/rta/util/BindingsExtractor'],function(E,O,a,F,U,C,P,b,B){"use strict";var R=E.extend("sap.ui.rta.plugin.RTAElementMover",{metadata:{library:"sap.ui.rta",properties:{commandFactory:{type:"any",defaultValue:C},movableTypes:{type:"string[]",defaultValue:["sap.ui.core.Element"]}},associations:{},events:{}}});R.prototype.init=function(){this.oBasePlugin=new P({commandFactory:this.getCommandFactory()});};R.prototype.exit=function(){this.oBasePlugin.destroy();};R.prototype.setCommandFactory=function(c){this.setProperty("commandFactory",c);this.oBasePlugin.setCommandFactory(c);};R.prototype.isEditable=function(o,c){var e=o.getElementInstance();var m=false;if(this.isMovableType(e)&&this.checkMovable(o,c)){m=true;}o.setMovable(m);return m;};function i(o,c){var v=false,d=o.getDesignTimeMetadata(),p=o.getParentElementOverlay();if(!d||!p){return false;}var r=o.getRelevantContainer();var e=sap.ui.dt.OverlayRegistry.getOverlay(r);if(!U.getRelevantContainerDesigntimeMetadata(o)){return false;}v=this._isMoveAvailableOnRelevantContainer(o);if(v){v=this.oBasePlugin.hasStableId(o)&&this.oBasePlugin.hasStableId(p)&&this.oBasePlugin.hasStableId(e);}if(v){var f=O.findAllUniqueAggregationOverlaysInContainer(o,e);var V=f.filter(function(A){return this.checkTargetZone(A,o,c);}.bind(this));if(V.length<1){v=false;}else if(V.length===1){var g=V[0].getChildren().filter(function(j){var k=j.getElementInstance();return(k&&k.getVisible()&&k.getParent());});v=g.length>1;}}return v;}function h(A,e,r){var o=A.getDesignTimeMetadata();var m=o.getAction("move",e);if(!m){return false;}return this.oBasePlugin.hasChangeHandler(m.changeType,r);}E.prototype._getMoveAction=function(o){var p,c=o.getParentAggregationOverlay();if(c){p=c.getDesignTimeMetadata();}return p?p.getAction("move",o.getElementInstance()):undefined;};E.prototype.isMovableType=function(e){return true;};R.prototype.checkMovable=function(o,c){return i.call(this,o,c);};R.prototype.checkTargetZone=function(A,o,c){var m=o?o:this.getMovedOverlay();var t=E.prototype.checkTargetZone.call(this,A,m,c);if(!t){return false;}var M=m.getElementInstance();var T=A.getParent();var d=m.getRelevantContainer();var e=T.getElementInstance();var v=A.getDesignTimeMetadata().getRelevantContainerForPropagation(M);v=v?v:e;if(!d||!v||!P.prototype.hasStableId(T)||d!==v){return false;}if(m.getParent().getElementInstance()!==e){var f=B.getBindings(M,M.getModel());if(Object.keys(f).length>0&&M.getBindingContext()&&e.getBindingContext()){var s=U.getEntityTypeByPath(M.getModel(),M.getBindingContext().getPath());var g=U.getEntityTypeByPath(e.getModel(),e.getBindingContext().getPath());if(!(s===g)){return false;}}}return h.call(this,A,M,v);};R.prototype._isMoveAvailableOnRelevantContainer=function(o){var c,m=this._getMoveAction(o);if(m&&m.changeType){c=o.getRelevantContainer();return this.oBasePlugin.hasChangeHandler(m.changeType,c);}return false;};R.prototype.buildMoveCommand=function(){var m=this.getMovedOverlay();var p=m.getParentAggregationOverlay();var M=m.getElementInstance();var s=this._getSource();var r=m.getRelevantContainer();var t=O.getParentInformation(m);var S=s.index;var T=t.index;var c=this._compareSourceAndTarget(s,t);if(c){return undefined;}delete s.index;delete t.index;var o=this._getMoveAction(m);var v=this.oBasePlugin.getVariantManagementReference(m,o,true);var d=this.getCommandFactory().getCommandFor(r,"Move",{movedElements:[{element:M,sourceIndex:S,targetIndex:T}],source:s,target:t},p.getDesignTimeMetadata(),v);return d;};return R;},true);

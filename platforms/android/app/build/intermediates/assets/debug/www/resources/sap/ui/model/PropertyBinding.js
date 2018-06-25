/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Binding','./SimpleType','./DataState'],function(q,B,S,D){"use strict";var P=B.extend("sap.ui.model.PropertyBinding",{constructor:function(m,p,c,a){B.apply(this,arguments);},metadata:{"abstract":true,publicMethods:["getValue","setValue","setType","getType","setFormatter","getFormatter","getExternalValue","setExternalValue","getBindingMode"]}});P.prototype.getExternalValue=function(){return this._toExternalValue(this.getValue());};P.prototype._toExternalValue=function(v){if(this.oType){v=this.oType.formatValue(v,this.sInternalType);}if(this.fnFormatter){v=this.fnFormatter(v);}return v;};P.prototype.setExternalValue=function(v){if(this.fnFormatter){q.sap.log.warning("Tried to use twoway binding, but a formatter function is used");return;}var d=this.getDataState();try{if(this.oType){v=this.oType.parseValue(v,this.sInternalType);this.oType.validateValue(v);}}catch(e){d.setInvalidValue(v);this.checkDataState();throw e;}d.setInvalidValue(undefined);this.setValue(v);};P.prototype.getInternalValue=function(){var v=this.getValue();var f;if(this.oType&&v!==null&&v!==undefined){f=this.oType.getModelFormat();return f.parse(v);}return v;};P.prototype.setInternalValue=function(v){var f;if(this.fnFormatter){q.sap.log.warning("Tried to use twoway binding, but a formatter function is used");return;}var d=this.getDataState();try{if(this.oType&&v!==null&&v!==undefined){f=this.oType.getModelFormat();v=f.format(v);this.oType.validateValue(v);}}catch(e){d.setInvalidValue(v);this.checkDataState();throw e;}d.setInvalidValue(undefined);this.setValue(v);};P.prototype.setType=function(t,i){this.oType=t;this.sInternalType=i;};P.prototype.getType=function(){return this.oType;};P.prototype.setFormatter=function(f){this.fnFormatter=f;};P.prototype.getFormatter=function(){return this.fnFormatter;};P.prototype.getBindingMode=function(){return this.sMode;};P.prototype.setBindingMode=function(b){this.sMode=b;};P.prototype.resume=function(){this.bSuspended=false;this.checkUpdate(true);};P.prototype.checkDataState=function(p){var r=this.oModel?this.oModel.resolve(this.sPath,this.oContext):null,d=this.getDataState(),t=this;function f(){t.fireEvent("AggregatedDataStateChange",{dataState:d});d.changed(false);t._sDataStateTimout=null;}if(!p||r&&r in p){if(r){d.setModelMessages(this.oModel.getMessagesByPath(r));}if(d&&d.changed()){if(this.mEventRegistry["DataStateChange"]){this.fireEvent("DataStateChange",{dataState:d});}if(this.bIsBeingDestroyed){f();}else if(this.mEventRegistry["AggregatedDataStateChange"]){if(!this._sDataStateTimout){this._sDataStateTimout=setTimeout(f,0);}}}}};return P;});

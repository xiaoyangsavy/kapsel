/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Element","sap/m/ObjectAttribute","sap/ui/core/util/File","sap/ui/Device"],function(q,l,E,O,F,D){"use strict";var U=E.extend("sap.m.UploadCollectionItem",{metadata:{library:"sap.m",properties:{contributor:{type:"string",group:"Data",defaultValue:null},documentId:{type:"string",group:"Misc",defaultValue:null},fileName:{type:"string",group:"Misc",defaultValue:null},fileSize:{type:"float",group:"Misc",defaultValue:null},mimeType:{type:"string",group:"Misc",defaultValue:null},thumbnailUrl:{type:"string",group:"Misc",defaultValue:null},uploadedDate:{type:"string",group:"Misc",defaultValue:null},url:{type:"string",group:"Misc",defaultValue:null},enableEdit:{type:"boolean",group:"Behavior",defaultValue:true},enableDelete:{type:"boolean",group:"Behavior",defaultValue:true},visibleEdit:{type:"boolean",group:"Behavior",defaultValue:true},visibleDelete:{type:"boolean",group:"Behavior",defaultValue:true},ariaLabelForPicture:{type:"string",group:"Accessibility",defaultValue:null},selected:{type:"boolean",group:"Behavior",defaultValue:false}},defaultAggregation:"attributes",aggregations:{attributes:{type:"sap.m.ObjectAttribute",multiple:true,bindable:"bindable"},_propertyAttributes:{type:"sap.m.ObjectAttribute",multiple:true,visibility:"hidden"},statuses:{type:"sap.m.ObjectStatus",multiple:true,bindable:"bindable"},markers:{type:"sap.m.ObjectMarker",multiple:true,bindable:"bindable"}},associations:{fileUploader:{type:"sap.ui.unified.FileUploader",multiple:false}},events:{press:{},deletePress:{}}}});U.prototype.init=function(){this._mDeprecatedProperties={};this._aManagedInstances=[];};U.prototype.exit=function(){for(var i=0;i<this._aManagedInstances.length;i++){this._aManagedInstances[i].destroy();}};U.prototype.setContributor=function(c){if(this.getContributor()!==c){this.setProperty("contributor",c,true);this._updateDeprecatedProperties();}return this;};U.prototype.setUploadedDate=function(u){if(this.getUploadedDate()!==u){this.setProperty("uploadedDate",u,true);this._updateDeprecatedProperties();}return this;};U.prototype.setFileSize=function(f){if(this.getFileSize()!==f){this.setProperty("fileSize",f,true);this._updateDeprecatedProperties();}return this;};U.prototype.setSelected=function(s){if(this.getSelected()!==s){this.setProperty("selected",s,true);this.fireEvent("selected");}return this;};U.prototype.download=function(a){if(D.browser.name==="sf"){a=false;}if(!this.getUrl()){q.sap.log.warning("Items to download do not have a URL.");return false;}else if(a){var b=null;var x=new window.XMLHttpRequest();x.open("GET",this.getUrl());x.responseType="blob";x.onload=function(){var f=this.getFileName();var o=this._splitFileName(f,false);var s=o.extension;f=o.name;b=x.response;F.save(b,f,s,this.getMimeType(),"utf-8");}.bind(this);x.send();return true;}else{l.URLHelper.redirect(this.getUrl(),true);return true;}};U.prototype._splitFileName=function(f,w){var r={};var R=/(?:\.([^.]+))?$/;var a=R.exec(f);r.name=f.slice(0,f.indexOf(a[0]));if(w){r.extension=a[0];}else{r.extension=a[1];}return r;};U.prototype._updateDeprecatedProperties=function(){var p=["uploadedDate","contributor","fileSize"];this.removeAllAggregation("_propertyAttributes",true);q.each(p,function(i,n){var v=this.getProperty(n),a=this._mDeprecatedProperties[n];if(q.type(v)==="number"&&!!v||!!v){if(!a){a=new O({active:false});this._mDeprecatedProperties[n]=a;this.addAggregation("_propertyAttributes",a,true);a.setText(v);}else{a.setText(v);this.addAggregation("_propertyAttributes",a,true);}}else if(a){a.destroy();delete this._mDeprecatedProperties[n];}}.bind(this));this.invalidate();};U.prototype.getAllAttributes=function(){return this.getAggregation("_propertyAttributes",[]).concat(this.getAttributes());};U.prototype._getControl=function(n,s,g){var c=q.sap.getObject(n),i=new c(s);this._aManagedInstances.push(i);if(g){this["_get"+g]=q.sap.getter(i);}return i;};U.prototype._getPressEnabled=function(){return this.hasListeners("press")||!!q.trim(this.getUrl());};return U;});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/XMLCompositeMetadata','sap/ui/model/base/ManagedObjectModel','sap/ui/core/util/XMLPreprocessor','sap/ui/model/json/JSONModel','sap/ui/core/Fragment','sap/ui/base/ManagedObject','sap/ui/base/DataType','sap/ui/core/AggregationProxy'],function(q,C,X,M,a,J,F,b,D,P){"use strict";var c={};function i(s,o){if(!c[s]){q.sap.require(s);c[s]=q.sap.getObject(s);}return c[s];}function p(t,v,n,o){var B=b.bindingParser(v,o,true);if(B&&typeof B==="object"){return B;}var V=v=B||v;var T=D.getType(t);if(T){if(T instanceof D){V=T.parseValue(v);}}else{throw new Error("Property "+n+" has unknown type "+t);}return typeof V==="string"?b.bindingParser.escape(V):V;}function d(m,n,E,I,v){var A=new J(E),o=I.getMetadata(),j=o.getAllAggregations(),k=o.getAllProperties(),s=o._mAllSpecialSettings;A.getVisitor=function(){return v;};A.getProperty=function(l,r){var R;l=this.resolve(l,r);l=l.substring(1);if(l&&l.startsWith&&l.startsWith("metadataContexts")){return this._navInMetadataContexts(l);}if(k.hasOwnProperty(l)){var t=k[l];if(!E.hasAttribute(l)){return t.defaultValue;}R=v.getResult(E.getAttribute(l))||E.getAttribute(l);if(R){var S=p(t.type,R,l);if(typeof S==="object"&&S.path){return R;}return S;}return null;}else if(j.hasOwnProperty(l)){var u=j[l],w=o.getName(),N=w.slice(0,w.lastIndexOf("."));if(u.multiple===true&&u.type==="TemplateMetadataContext"){if(!E.hasAttribute(l)){return null;}return E.getAttribute(l);}return E.getElementsByTagNameNS(N,l);}else if(s.hasOwnProperty(l)){var x=s[l];if(!E.hasAttribute(l)){return x.defaultValue||null;}R=v.getResult(E.getAttribute(l));if(x.type){var S=p(x.type,R,l);if(typeof S==="object"&&S.path){return R;}return S;}if(R){return R;}return E.getAttribute(l);}};A._navInMetadataContexts=function(l){var r=l.replace("metadataContexts","");var t,u=r.split("/");u.shift();var R,N=m["metadataContexts"].getObject();while(u.length>0&&N){if(N.getObject){R=N.getObject(u.join("/"));}if(!R){t=u.shift();N=N[t];}else{return R;}}return N;};A.getContextName=function(){return n;};m[n]=A.getContext("/");if(m["metadataContexts"]){m["metadataContexts"].oModel.setProperty("/"+n,m[n]);}}function e(m,v,o,j,s){o.model=o.model||s;var k=o.name||o.model||undefined;if(j[k]){return;}try{m[k]=v.getContext(o.model+">"+o.path);j[k]=m[k];}catch(l){m["_$error"].oModel.setProperty("/"+k,l);}}function f(m,v,s,k,l){if(!s&&!k){return;}var o=s?b.bindingParser(s):{parts:[]};var n=k?b.bindingParser(k):{parts:[]};if(!n.parts){n={parts:[n]};}if(!o.parts){o={parts:[o]};}q.merge(o.parts,n.parts);for(var j=0;j<o.parts.length;j++){e(m,v,o.parts[j],o,l);}var r=new J(o);m["metadataContexts"]=r.getContext("/");}function g(o){var s={};s.models=o.oModels||{};s.bindingContexts=o.oBindingContexts||{};return s;}var h=C.extend("sap.ui.core.XMLComposite",{metadata:{properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%',invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},displayBlock:{type:"boolean",group:"Appearance",defaultValue:true,invalidate:true}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}}},renderer:function(r,o){r.write("<div");r.writeControlData(o);if(!o.getDisplayBlock()&&(o.getWidth()!=="100%"||o.getHeight()!=="100%")){r.addStyle("display","inline-block");}r.writeClasses();if(o.getHeight()){r.addStyle("height",o.getHeight());}if(o.getWidth()){r.addStyle("width",o.getWidth());}r.writeStyles();r.write(">");var j=o.getAggregation(o.getMetadata().getCompositeAggregationName());if(j){r.renderControl(j);}r.write("</div>");}},X);h.prototype.applySettings=function(){this._bIsInitializing=true;var r=C.prototype.applySettings.apply(this,arguments);this._bIsInitializing=false;return r;};h.prototype.byId=function(I){return sap.ui.getCore().byId(F.createId(this.getId(),I));};h.prototype._getManagedObjectModel=function(){if(!this._oManagedObjectModel){this._oManagedObjectModel=new M(this);}return this._oManagedObjectModel;};h.prototype.getSuppressInvalidateAggregation=function(n,s){var m=this.getMetadata(),A=m.getAggregation(n)||m.getAllPrivateAggregations()[n];if(!A){return true;}s=m._suppressInvalidate(A,s);m._requestFragmentRetemplatingCheck(this,A);return s;};h.prototype.setProperty=function(n,v,s){var m=this.getMetadata(),o=m.getProperty(n);if(!o){return this;}s=this.getMetadata()._suppressInvalidate(o,s);if(C.prototype.getProperty.apply(this,[n])!==v){m._requestFragmentRetemplatingCheck(this,o);}return C.prototype.setProperty.apply(this,[n,v,s]);};h.prototype.bindAggregation=function(n,o){var m=this.getMetadata(),A=m.getAggregation(n)||m.getAllPrivateAggregations()[n],B=C.prototype.getBinding.apply(this,[n]);if(!B||(B&&B.getPath()!==o.path)){m._requestFragmentRetemplatingCheck(this,A);}return C.prototype.bindAggregation.apply(this,[n,o]);};h.prototype.unbindAggregation=function(n){var m=this.getMetadata(),A=m.getAggregation(n)||m.getAllPrivateAggregations()[n];if(this.isBound(n)){m._requestFragmentRetemplatingCheck(this,A,true);}return C.prototype.unbindAggregation.apply(this,[n]);};h.prototype.setAggregation=function(n,o,s){return C.prototype.setAggregation.apply(this,[n,o,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.addAggregation=function(n,o,s){return C.prototype.addAggregation.apply(this,[n,o,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.insertAggregation=function(n,o,I,s){return C.prototype.insertAggregation.apply(this,[n,o,I,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.removeAggregation=function(n,o,s){return C.prototype.removeAggregation.apply(this,[n,o,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.removeAllAggregation=function(n,s){return C.prototype.removeAllAggregation.apply(this,[n,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.destroyAggregation=function(n,s){return C.prototype.destroyAggregation.apply(this,[n,this.getSuppressInvalidateAggregation(n,s)]);};h.prototype.updateAggregation=function(n,s){var A=this.getMetadata().getAggregation(n);if(A&&A.type==="TemplateMetadataContext"){this.invalidate();return;}C.prototype.updateAggregation.apply(this,arguments);};h.prototype.setVisible=function(v){this.setProperty("visible",v);if(this.getParent()){this.getParent().invalidate();}return this;};h.prototype._destroyCompositeAggregation=function(){var s=this.getMetadata().getCompositeAggregationName(),o=this.getAggregation(s);if(o){o.destroy();}return this;};h.prototype.updateBindings=function(){if(this._bIsInitializing){return;}var r=C.prototype.updateBindings.apply(this,arguments);for(var n in this.mBindingInfos){var A=this.getMetadata().getAggregation(n);if(A&&A.multiple&&!A._doesNotRequireFactory&&this.isBound(n)&&!this.getBinding(n)){this[A._sDestructor]();}}return r;};h.prototype._setCompositeAggregation=function(N){var s=this.getMetadata().getCompositeAggregationName();this._destroyCompositeAggregation();if(!this._oManagedObjectModel){this._getManagedObjectModel();}if(q.isArray(N)){this.setAggregation(s,null);return;}if(N){N.setModel(this._oManagedObjectModel,"$"+this.alias);N.bindObject("$"+this.alias+">/");}var t=this;this.setAggregation(s,N);var t=this;N._getPropertiesToPropagate=function(){var o=b.prototype._getPropertiesToPropagate.apply(this,arguments),B={},m={},j;for(var n in o.oBindingContexts){var k=o.oBindingContexts[n];if(k){j=k.getModel();if(j instanceof M&&j.getRootObject()instanceof h&&"$"+t.alias!==n){continue;}B[n]=o.oBindingContexts[n];}}for(var n in o.oModels){var j=o.oModels[n];if(j&&j instanceof M&&j.getRootObject()instanceof h&&"$"+t.alias!==n){continue;}m[n]=o.oModels[n];}o.oBindingContexts=B;o.oModels=m;return o;};this.invalidate();};h.prototype._initCompositeSupport=function(s){var m=this.getMetadata(),A=m.getCompositeAggregationName(),I=false;if(s&&A){var n=s[A];if(n&&n.localName==="FragmentDefinition"){this._destroyCompositeAggregation();this._setCompositeAggregation(sap.ui.xmlfragment({sId:this.getId(),fragmentContent:s[A],oController:this}));I=true;}delete s[A];}if(!I){this._destroyCompositeAggregation();this._setCompositeAggregation(sap.ui.xmlfragment({sId:this.getId(),fragmentContent:this.getMetadata()._fragment,oController:this}));}};h.prototype.requestFragmentRetemplating=function(j){if(j){this.fragmentRetemplating();return;}var A=this.getMetadata().getMandatoryAggregations(),B=true;for(var n in A){B=typeof this.getBindingInfo(n)==="object";if(!B){break;}}if(B){this.fragmentRetemplating();}};h.prototype.fragmentRetemplating=function(){var m=this.getMetadata(),o=m.getFragment();if(!o){throw new Error("Fragment "+o.tagName+" not found");}var j=this._getManagedObjectModel();var t=this;j.getContextName=function(){return t.alias;};this.setModel(j,this.alias);this.bindObject(this.alias+">/");j._mSettings=g(this._getPropertiesToPropagate());delete j._mSettings.models["$"+this.alias];delete j._mSettings.bindingContexts["$"+this.alias];this.setModel(null,this.alias);a.process(o.querySelector("*"),{},j._mSettings);var s={};s[m.getCompositeAggregationName()]=o;this._initCompositeSupport(s);};h.initialTemplating=function(E,v,s){var I=i(s),o=new J({}),m={"_$error":o.getContext("/")},j=I.getMetadata(),k=j.getFragment(),l=j._mSpecialSettings.metadataContexts?j._mSpecialSettings.metadataContexts.defaultValue:"";if(!k){throw new Error("Fragment "+s+" not found");}f(m,v,E.getAttribute("metadataContexts"),l,I.prototype.defaultMetaModel);d(m,I.prototype.alias,E,I,v);var n=v["with"](m,true);var r=I.getMetadata();n.visitChildNodes(k);var N=k.ownerDocument.createElementNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1",r.getCompositeAggregationName());N.appendChild(k);E.appendChild(N);};h.helper={listContext:function(o){var B=o.getModel().getProperty(o.getPath());if(typeof B==="string"){B=b.bindingParser(B);}if(q.isArray(B)){var j=o.getModel().getProperty(o.getPath()+"/@binding");if(j){return j.getModel().getMetaModel().getMetaContext(j.getPath());}else{return undefined;}}if(typeof B==="object"){var v=o.getModel().getVisitor();var m=v.getSettings().models[B.model];if(m){return m.createBindingContext(B.path);}return null;}else{return undefined;}},listMetaContext:function(o){var B=o.getModel().getProperty(o.getPath());if(typeof B==="string"){B=b.bindingParser(B);}if(q.isArray(B)){var j=o.getModel().getProperty(o.getPath()+"/@binding");if(j){return j.getModel().getMetaModel().getMetaContext(j.getPath());}else{return undefined;}}if(typeof B==="object"){var v=o.getModel().getVisitor();B=b.bindingParser("{"+B.path+"}");var m=v.getSettings().models[B.model];if(m){var k=m.getMetaModel();if(k&&k.getMetaContext){return k.getMetaContext(B.path);}}return null;}else{return undefined;}},runtimeProperty:function(o,v){if(o.getModel().getContextName){return"{$"+o.getModel().getContextName()+">"+o.getPath()+"}";}return v;},runtimeBinding:function(o,v){return"{Name}";},runtimeListBinding:function(o,v){if(q.isArray(v)){var B=o.getModel().getProperty(o.getPath()+"/@binding");if(B){return"{path: '"+B.getPath()+"'}";}return null;}return v;}};h.helper.listMetaContext.requiresIContext=true;h.helper.runtimeProperty.requiresIContext=true;h.helper.runtimeListBinding.requiresIContext=true;h.helper.runtimeBinding.requiresIContext=true;return h;},true);

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./List','./library'],function(L,l){"use strict";var G=L.extend("sap.m.GrowingList",{metadata:{deprecated:true,library:"sap.m",properties:{threshold:{type:"int",group:"Misc",defaultValue:20},triggerText:{type:"string",group:"Appearance",defaultValue:null},scrollToLoad:{type:"boolean",group:"Behavior",defaultValue:false}}}});G.prototype._isIncompatible=function(){return sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMGrowingList").compareTo("1.16")>=0;};G.prototype.init=function(){L.prototype.init.call(this);if(!this._isIncompatible()){this.setGrowing();}};G.prototype.setGrowing=function(){return L.prototype.setGrowing.call(this,true);};!(function(g,o){["Threshold","TriggerText","ScrollToLoad"].forEach(function(p){g["set"+p]=o["setGrowing"+p];g["get"+p]=o["getGrowing"+p];});}(G.prototype,L.prototype));return G;});

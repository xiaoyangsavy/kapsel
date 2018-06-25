/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ListItemBase','./library','sap/ui/core/library'],function(L,l,c){"use strict";var a=l.ListMode;var T=c.TextDirection;function i(o){var F=sap.ui.require('sap/m/Table');return typeof F==='function'&&(o instanceof F);}var G=L.extend("sap.m.GroupHeaderListItem",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Data",defaultValue:null},count:{type:"string",group:"Data",defaultValue:null},upperCase:{type:"boolean",group:"Appearance",defaultValue:false},titleTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit}}}});G.prototype.getMode=function(){return a.None;};G.prototype.shouldClearLastValue=function(){return true;};G.prototype.getTable=function(){var p=this.getParent();if(i(p)){return p;}if(p&&p.getMetadata().getName()=="sap.m.Table"){return p;}};G.prototype.onBeforeRendering=function(){var p=this.getParent();if(i(p)){p.getColumns().forEach(function(C){C.clearLastValue();});this.TagName="tr";}};G.prototype.getAccessibilityType=function(b){var t=this.getTable()?"ROW":"OPTION";return b.getText("LIST_ITEM_GROUP_HEADER")+" "+b.getText("ACC_CTR_TYPE_"+t);};G.prototype.getContentAnnouncement=function(){return this.getTitle();};return G;});

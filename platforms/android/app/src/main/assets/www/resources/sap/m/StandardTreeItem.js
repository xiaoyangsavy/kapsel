/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./TreeItemBase','./library','sap/ui/core/IconPool'],function(T,l,I){"use strict";var S=T.extend("sap.m.StandardTreeItem",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Misc",defaultValue:""},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null}}}});S.prototype._getIconControl=function(){var u=this.getIcon();if(this._oIconControl){this._oIconControl.setSrc(u);return this._oIconControl;}this._oIconControl=I.createControlByURI({id:this.getId()+"-icon",src:u,useIconTooltip:false,noTabStop:true},sap.m.Image).setParent(this,null,true).addStyleClass("sapMSTIIcon");return this._oIconControl;};S.prototype.getContentAnnouncement=function(){var a="",i=I.getIconInfo(this.getIcon())||{};a+=(i.text||i.name||"")+" ";a+=this.getTitle()+" ";return a;};S.prototype.exit=function(){T.prototype.exit.apply(this,arguments);this.destroyControls(["Icon"]);};return S;});

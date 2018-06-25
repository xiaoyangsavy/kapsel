/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/rta/command/BaseCommand','sap/ui/fl/changeHandler/BaseTreeModifier','sap/ui/fl/Utils'],function(B,a,f){"use strict";var C=B.extend("sap.ui.rta.command.ControlVariantSetTitle",{metadata:{library:"sap.ui.rta",properties:{renamedElement:{type:"object"},oldText:{type:"string"},newText:{type:"string"}},associations:{},events:{}}});C.prototype.MODEL_NAME="$FlexVariants";C.prototype.prepare=function(F,v){this.sLayer=F.layer;return true;};C.prototype.execute=function(){var v=this.getRenamedElement(),V=v.getTitle().getBinding("text");this.oAppComponent=f.getAppComponentForControl(v);this.oModel=this.oAppComponent.getModel(this.MODEL_NAME);this.sVariantManagementReference=a.getSelector(v,this.oAppComponent).id;this.sCurrentVariant=this.oModel.getCurrentVariantReference(this.sVariantManagementReference);var c=this.oModel.getVariantProperty(this.sCurrentVariant,"title");this.setOldText(c);var p={appComponent:this.oAppComponent,variantReference:this.sCurrentVariant,title:this.getNewText(),layer:this.sLayer};return Promise.resolve(this.oModel._setVariantProperties(this.sVariantManagementReference,p,true)).then(function(o){this._oVariantChange=o;V.checkUpdate(true);}.bind(this));};C.prototype.undo=function(){var v=this.getRenamedElement().getTitle().getBinding("text"),p={variantReference:this.sCurrentVariant,title:this.getOldText(),change:this._oVariantChange};return Promise.resolve(this.oModel._setVariantProperties(this.sVariantManagementReference,p,false)).then(function(c){this._oVariantChange=c;v.checkUpdate(true);}.bind(this));};return C;},true);
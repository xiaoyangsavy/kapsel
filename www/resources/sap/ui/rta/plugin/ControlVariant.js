/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/rta/plugin/Plugin','sap/ui/rta/plugin/RenameHandler','sap/ui/rta/Utils','sap/ui/dt/ElementOverlay','sap/ui/dt/OverlayRegistry','sap/ui/dt/OverlayUtil','sap/ui/fl/changeHandler/BaseTreeModifier','sap/ui/fl/Utils','sap/ui/fl/variants/VariantManagement','sap/ui/base/ManagedObject'],function(P,R,U,E,O,a,B,f,V,M){"use strict";E.prototype._variantManagement=undefined;E.prototype.getVariantManagement=function(){return this._variantManagement;};E.prototype.setVariantManagement=function(k){this._variantManagement=k;};E.prototype.hasVariantManagement=function(){return this._variantManagement?true:false;};var C=P.extend("sap.ui.rta.plugin.ControlVariant",{metadata:{library:"sap.ui.rta",properties:{oldValue:"string"},associations:{},events:{}}});C.MODEL_NAME="$FlexVariants";C.prototype.registerElementOverlay=function(o){var c=o.getElementInstance();if(c.getMetadata().getName()==="sap.ui.fl.variants.VariantManagement"){var c=o.getElementInstance();var A=c.getAssociation("for");var v=!jQuery.isArray(A)?[A]:A;v.forEach(function(b){var d=b instanceof M?b:sap.ui.getCore().byId(b);var e=O.getOverlay(d);var g=B.getSelector(c,f.getComponentForControl(c)).id;this._propagateVariantManagement(e,g);}.bind(this));}else if(!o.getVariantManagement()){var s=this._getVariantManagementFromParent(o);if(s){o.setVariantManagement(s);}}o.attachEvent("editableChange",R._manageClickEvent,this);P.prototype.registerElementOverlay.apply(this,arguments);};C.prototype._propagateVariantManagement=function(p,v){var e=[];p.setVariantManagement(v);e=a.getAllChildOverlays(p);e.forEach(function(o){e=e.concat(this._propagateVariantManagement(o,v));}.bind(this));return e;};C.prototype._getVariantManagementFromParent=function(o){var v=o.getVariantManagement();if(!v&&o.getParentElementOverlay()){return this._getVariantManagementFromParent(o.getParentElementOverlay());}return v;};C.prototype.deregisterElementOverlay=function(o){o.detachEvent("editableChange",R._manageClickEvent,this);o.detachBrowserEvent("click",R._onClick,this);this.removeFromPluginsList(o);P.prototype.deregisterElementOverlay.apply(this,arguments);};C.prototype._getVariantModel=function(e){var A=f.getAppComponentForControl(e);return A.getModel(C.MODEL_NAME);};C.prototype._isEditable=function(o){return this._isVariantManagementControl(o);};C.prototype._isVariantManagementControl=function(o){var e=o.getElementInstance(),A=e.getAssociation("for");return!!(A&&e instanceof V);};C.prototype.isVariantSwitchAvailable=function(o){return this._isVariantManagementControl(o);};C.prototype.isVariantSwitchEnabled=function(o){var e=o.getElementInstance(),v=o.getVariantManagement?o.getVariantManagement():undefined;if(!v){return false;}var m=this._getVariantModel(e),b=m?m.getData()[v].variants:[],c=b.length>1;return c;};C.prototype.setDesignTime=function(d){R._setDesignTime.call(this,d);};C.prototype.isRenameAvailable=function(o){return this._isVariantManagementControl(o);};C.prototype.isRenameEnabled=function(o){return true;};C.prototype.isVariantDuplicateAvailable=function(o){return this._isVariantManagementControl(o);};C.prototype.isVariantDuplicateEnabled=function(o){var v=o.getVariantManagement?o.getVariantManagement():undefined;if(!v||!this._isVariantManagementControl(o)){return false;}return true;};C.prototype.isVariantConfigureAvailable=function(o){return this._isVariantManagementControl(o);};C.prototype.isVariantConfigureEnabled=function(o){return false;};C.prototype.switchVariant=function(t,n,c){var d=t.getDesignTimeMetadata(),T=t.getElementInstance();var s=this.getCommandFactory().getCommandFor(T,"switch",{targetVariantReference:n,sourceVariantReference:c},d);this.fireElementModified({"command":s});};C.prototype.renameVariant=function(o){this.startEdit(o[0]);};C.prototype.startEdit=function(o){var v=o.getElementInstance(),d=function(){return v.getTitle().getDomRef("inner");};R.startEdit.call(this,o,d,"plugin.ControlVariant.startEdit");};C.prototype.stopEdit=function(r){R._stopEdit.call(this,r,"plugin.ControlVariant.stopEdit");};C.prototype.duplicateVariant=function(o){var v=o.getVariantManagement();var e=o.getElementInstance();var m=this._getVariantModel(e);var c=m.getCurrentVariantReference(v);var d=o.getDesignTimeMetadata();var D=this.getCommandFactory().getCommandFor(e,"duplicate",{sourceVariantReference:c},d,v);this.fireElementModified({"command":D});};C.prototype._emitLabelChangeEvent=function(){var t=R._getCurrentEditableFieldText.call(this);if(this.getOldValue()!==t){this._$oEditableControlDomRef.text(t);try{var s;var r=this._oEditedOverlay.getElementInstance();var d=this._oEditedOverlay.getDesignTimeMetadata();var v=this._oEditedOverlay.getVariantManagement();s=this.getCommandFactory().getCommandFor(r,"setTitle",{renamedElement:r,newText:t},d,v);this.fireElementModified({"command":s});}catch(e){jQuery.sap.log.error("Error during rename : ",e);}}};C.prototype.configureVariants=function(){return;};C.prototype.getMenuItems=function(o){var b='$FlexVariants';var m=[];if(this.isRenameAvailable(o)){m.push({id:"CTX_VARIANT_SET_TITLE",text:sap.ui.getCore().getLibraryResourceBundle('sap.ui.rta').getText('CTX_VARIANT_SET_TITLE'),handler:this.renameVariant.bind(this),enabled:this.isRenameEnabled.bind(this),rank:210});}if(this.isVariantDuplicateAvailable(o)){m.push({id:"CTX_VARIANT_DUPLICATE",text:sap.ui.getCore().getLibraryResourceBundle('sap.ui.rta').getText('CTX_VARIANT_DUPLICATE'),handler:function(c){return this.duplicateVariant(c[0]);}.bind(this),enabled:this.isVariantDuplicateEnabled.bind(this),rank:220});}if(this.isVariantConfigureAvailable(o)){m.push({id:"CTX_VARIANT_CONFIGURE",text:sap.ui.getCore().getLibraryResourceBundle('sap.ui.rta').getText('CTX_VARIANT_CONFIGURE'),handler:this.configureVariants.bind(this),enabled:this.isVariantConfigureEnabled.bind(this),startSection:true,rank:230});}if(this.isVariantSwitchAvailable(o)){m.push({id:"CTX_VARIANT_SWITCH_SUBMENU",text:sap.ui.getCore().getLibraryResourceBundle('sap.ui.rta').getText('CTX_VARIANT_SWITCH'),handler:function(c,i){var d=i.data(),t=d.targetOverlay,n=d.key,s=d.current;return this.switchVariant(t,n,s);}.bind(this),enabled:this.isVariantSwitchEnabled.bind(this),submenu:{id:"{"+b+">key}",text:"{"+b+">title}",model:b,current:function(o,c){var s=o.getVariantManagement();return c.getData()[s].currentVariant;},items:function(o,c){var s=o.getVariantManagement();return c.getData()[s].variants;}},type:"subMenuWithBinding",rank:240});}return m;};return C;},true);

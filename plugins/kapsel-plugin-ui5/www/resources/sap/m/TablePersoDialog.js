/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Button','./Dialog','./InputListItem','./List','./Toolbar','sap/ui/base/ManagedObject','sap/m/library','sap/ui/Device','sap/ui/model/Sorter','sap/ui/model/Filter'],function(q,B,D,I,L,T,M,l,a,S,F){"use strict";var b=l.ToolbarDesign;var c=l.ListMode;var d=M.extend("sap.m.TablePersoDialog",{constructor:function(i,s){M.apply(this,arguments);},metadata:{properties:{"contentWidth":{type:"sap.ui.core.CSSSize"},"contentHeight":{type:"sap.ui.core.CSSSize",since:"1.22"},"persoMap":{type:"object"},"columnInfoCallback":{type:"object",since:"1.22"},"initialColumnState":{type:"object",since:"1.22"},"hasGrouping":{type:"boolean",since:"1.22"},"showSelectAll":{type:"boolean",since:"1.22"},"showResetAll":{type:"boolean",since:"1.22"}},aggregations:{"persoService":{type:"Object",multiple:false,deprecated:true}},associations:{"persoDialogFor":"sap.m.Table"},events:{confirm:{},cancel:{}},library:"sap.m"}});d.prototype.init=function(){var t=this,e=0;this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oP13nModel=new sap.ui.model.json.JSONModel();this._oP13nModel.setSizeLimit(Number.MAX_VALUE);this._fnUpdateCheckBoxes=q.proxy(function(E){var s=E.getParameter('selected'),o=this._oP13nModel.getData();if(E.getSource().getId()===this._getSelectAllCheckboxId()){o.aColumns.forEach(function(C){C.visible=s;});}else{var f=!o.aColumns.some(function(C){return!C.visible;});o.oHeader.visible=f;}this._oP13nModel.setData(o);},this);this._oColumnItemTemplate=new I(this.getId()+"-li",{label:"{Personalization>text}",content:new sap.m.CheckBox(this.getId()+"-cb",{selected:"{Personalization>visible}",select:this._fnUpdateCheckBoxes})}).addStyleClass("sapMPersoDialogLI");this._oButtonUp=new B(this.getId()+"-buttonUp",{icon:"sap-icon://arrow-top",enabled:false,tooltip:t._oRb.getText('PERSODIALOG_UP'),press:function(){t._moveItem(-1);}});this._oButtonDown=new B(this.getId()+"-buttonDown",{icon:"sap-icon://arrow-bottom",enabled:false,tooltip:t._oRb.getText('PERSODIALOG_DOWN'),press:function(){t._moveItem(1);}});this._fnHandleResize=function(){if(t._oDialog){var $=t._oDialog.$("cont");var f=t._oDialog.$("scroll");if($.children().length>0){var C=$.children()[0].clientHeight;var p=f[0].clientHeight-C;var h=t.getShowSelectAll()?t._oSelectAllToolbar.$().outerHeight():0;t._oScrollContainer.setHeight((C-h-p)+'px');}}};this._fnUpdateArrowButtons=function(u){var f=true,g=true,v=t._oSearchField.getValue(),i=t._oList.getItems().length;if(!!v||t._oList.getSelectedItems().length===0){g=false;f=false;}else{if(t._oList.getItems()[0].getSelected()){g=false;if(u){q.sap.focus(t._oButtonDown.getDomRef());}}if(t._oList.getItems()[i-1].getSelected()){f=false;if(u){q.sap.focus(t._oButtonUp.getDomRef());}}}t._oButtonUp.setEnabled(g);t._oButtonDown.setEnabled(f);};this._fnListUpdateFinished=function(){var f=t._oList.$().find('.sapMCb'),g=f.length;for(var i=0;i<g;i++){var $=q(f[i]).parent(),s=$.siblings(),h=s.length==1?q(s[0]):null;if(h){$=$.detach();$[0].className='sapMLIBSelectM';$.insertBefore(h);}}if(t._sLastSelectedItemId){var j=function(o){var r=(o.getBindingContext('Personalization')&&o.getBindingContext('Personalization').getProperty('id')===t._sLastSelectedItemId);if(r){t._oList.setSelectedItem(o);}return r;};t._oList.getItems().some(j);t._sLastSelectedItemId=null;if(t._fnUpdateArrowButtons){t._fnUpdateArrowButtons.call(this);}}};this._fnAfterDialogOpen=function(){t._fnUpdateArrowButtons.call(t);};this._fnAfterScrollContainerRendering=function(){t._oScrollContainer.$().attr('tabindex','-1');};this._oList=new L(this.getId()+"-colList",{includeItemInSelection:true,noDataText:this._oRb.getText('PERSODIALOG_NO_DATA'),mode:c.SingleSelectMaster,selectionChange:function(){this._fnUpdateArrowButtons.call(this);}.bind(this),updateFinished:this._fnListUpdateFinished});this._oList.addDelegate({onAfterRendering:this._fnListUpdateFinished});this._oSearchField=new sap.m.SearchField(this.getId()+"-searchField",{width:"100%",liveChange:function(E){var v=E.getSource().getValue(),i=(v?300:0);clearTimeout(e);if(i){e=setTimeout(function(){t._executeSearch();},i);}else{t._executeSearch();}},search:function(){t._executeSearch();}});this._oScrollContainer=new sap.m.ScrollContainer({horizontal:false,vertical:true,content:[this._oList],width:'100%'});this._oScrollContainer.addDelegate({onAfterRendering:this._fnAfterScrollContainerRendering});this._resetAllButton=new B(this.getId()+"-buttonUndo",{icon:"sap-icon://undo",tooltip:this._oRb.getText('PERSODIALOG_UNDO'),press:function(){this._resetAll();}.bind(this)}).addStyleClass("sapMPersoDialogResetBtn");this._oSelectAllCheckbox=new sap.m.CheckBox(this._getSelectAllCheckboxId(),{selected:"{Personalization>/oHeader/visible}",select:this._fnUpdateCheckBoxes,text:"{Personalization>/oHeader/text}"}).addStyleClass("sapMPersoDialogSelectAllCb");this._oSelectAllToolbar=new T(this.getId()+"-toolbarSelAll",{active:false,design:b.Transparent,content:[this._oSelectAllCheckbox,this._resetAllButton]}).addStyleClass("sapMPersoDialogFixedBar");this._oDialog=new D(this.getId()+"-Dialog",{title:this._oRb.getText("PERSODIALOG_COLUMNS_TITLE"),stretch:a.system.phone,horizontalScrolling:false,verticalScrolling:false,initialFocus:(a.system.desktop?this._oList:null),content:[this._oSelectAllToolbar,this._oScrollContainer],subHeader:new T(this.getId()+"-toolbar",{active:false,content:[this._oButtonUp,this._oButtonDown,this._oSearchField]}),leftButton:new B(this.getId()+"-buttonOk",{text:this._oRb.getText("PERSODIALOG_OK"),press:function(){t._oDialog.close();t._oSearchField.setValue("");t._oSelectAllToolbar.setVisible(true);a.resize.detachHandler(t._fnHandleResize);t.fireConfirm();}}),rightButton:new B(this.getId()+"-buttonCancel",{text:this._oRb.getText("PERSODIALOG_CANCEL"),press:function(){t._oDialog.close();t._oSearchField.setValue("");t._oSelectAllToolbar.setVisible(true);a.resize.detachHandler(t._fnHandleResize);t.fireCancel();}}),afterOpen:this._fnAfterDialogOpen}).addStyleClass("sapMPersoDialog");};d.prototype.retrievePersonalizations=function(){return this._oP13nModel.getData();};d.prototype.open=function(){var s=null;if(this.getHasGrouping()){s=[new S('group',false,true)];}this._readCurrentSettingsFromTable();this._oDialog.setModel(this._oP13nModel,"Personalization");this._oList.bindAggregation("items",{path:"Personalization>/aColumns",sorter:s,template:this._oColumnItemTemplate});if(!this._oList.getSelectedItem()){var i=this._oList.getItems();if(this.getHasGrouping()){i=i.filter(function(o){return o.getMetadata().getName()!="sap.m.GroupHeaderListItem";});}if(i.length>0){this._sLastSelectedItemId=i[0].getBindingContext('Personalization').getProperty('id');}}this._fnUpdateArrowButtons.call(this);this._oDialog.open();this._fnHandleResize.call(this);a.resize.attachHandler(this._fnHandleResize);};d.prototype.setContentHeight=function(h){this.setProperty("contentHeight",h,true);this._oDialog.setContentHeight(h);return this;};d.prototype.setContentWidth=function(w){this.setProperty("contentWidth",w,true);this._oDialog.setContentWidth(w);return this;};d.prototype.exit=function(){this._oRb=null;this._oP13nModel=null;if(this._oColumnItemTemplate){this._oColumnItemTemplate.destroy();this._oColumnItemTemplate=null;}if(this._oSelectAllToolbar){this._oSelectAllToolbar.destroy();this._oSelectAllToolbar=null;}if(this._oList){this._oList.destroy();this._oList=null;}if(this._oSearchField){this._oSearchField.destroy();this._oSearchField=null;}if(this._oScrollContainer){this._oScrollContainer.destroy();this._oScrollContainer=null;}if(this._oDialog){this._oDialog.destroy();this._oDialog=null;}if(this._oButtonDown){this._oButtonDown.destroy();this._oButtonDown=null;}if(this._oButtonUp){this._oButtonUp.destroy();this._oButtonUp=null;}};d.prototype._resetAll=function(){if(this.getInitialColumnState()){var i=q.extend(true,[],this.getInitialColumnState()),t=this;var o=this._oList.getSelectedItem();this._sLastSelectedItemId=o&&o.getBindingContext('Personalization')&&o.getBindingContext('Personalization').getProperty('id');if(this._mColumnCaptions){i.forEach(function(C){C.text=t._mColumnCaptions[C.id];});}this._oP13nModel.getData().aColumns=i;this._oP13nModel.getData().oHeader.visible=!this.getInitialColumnState().some(function(C){return!C.visible;});this._oP13nModel.updateBindings();sap.ui.getCore().applyChanges();}};d.prototype._moveItem=function(i){var s=this._oList.getSelectedItem();if(!s){return;}var o=this._oP13nModel.getData();var e=s.getBindingContext("Personalization").getPath().split("/").pop()*1;var f=e+i;if(f<0||f>=o.aColumns.length){return;}var t=o.aColumns[f];o.aColumns[f]=o.aColumns[e];o.aColumns[f].order=f;o.aColumns[e]=t;o.aColumns[e].order=e;this._oList.removeSelections(true);this._oP13nModel.updateBindings();var g=this._oList.getItems()[f];this._oList.setSelectedItem(g,true);sap.ui.getCore().applyChanges();if(g.getDomRef()){var E=g.$().position().top,m=18,v=this._oScrollContainer.$().height(),V=this._oScrollContainer.$().offset().top-this._oList.$().offset().top,h=V+v;if(E<V){this._oScrollContainer.scrollTo(0,Math.max(0,V-v+m));}else if(E+m>h){this._oScrollContainer.scrollTo(0,E);}}this._fnUpdateArrowButtons.call(this,true);};d.prototype._readCurrentSettingsFromTable=function(){var t=sap.ui.getCore().byId(this.getPersoDialogFor()),e=this,C=this.getColumnInfoCallback().call(this,t,this.getPersoMap());this._oP13nModel.setData({aColumns:C,oHeader:{text:this._oRb.getText("PERSODIALOG_SELECT_ALL"),visible:!C.some(function(o){return!o.visible;}),id:this._getSelectAllCheckboxId()}});this._mColumnCaptions={};C.forEach(function(o){e._mColumnCaptions[o.id]=o.text;});};d.prototype._getSelectAllCheckboxId=function(){return this.getId()+'_SelectAll';};d.prototype._executeSearch=function(){var v=this._oSearchField.getValue(),f=new F("text",sap.ui.model.FilterOperator.Contains,v),o=this._oList.getBinding("items");this._oSelectAllToolbar.setVisible(!v&&this.getShowSelectAll());o.filter([f]);this._fnUpdateArrowButtons.call(this);return this;};d.prototype.setHasGrouping=function(h){this.setProperty("hasGrouping",h,true);var o=this._oDialog.getSubHeader();if(!h){if(o.getContent().length===1){o.insertContent(this._oButtonDown,0);o.insertContent(this._oButtonUp,0);}}else{o.removeContent(this._oButtonUp);o.removeContent(this._oButtonDown);}return this;};d.prototype.setShowSelectAll=function(s){this.setProperty("showSelectAll",s,true);this._oSelectAllToolbar.setVisible(s);this._fnHandleResize.call(this);return this;};d.prototype.setShowResetAll=function(s){this.setProperty("showResetAll",s,true);this._resetAllButton.setVisible(s);return this;};return d;});
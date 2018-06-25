/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(['jquery.sap.global',"./ColumnType","./InternalColumnDescriptor"],function(q,S,a){"use strict";var g=function(){return{type:S.Internal};};var I={};I.createTreeColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.Tree,label:r.getText("COLUMNNAME_TREE"),tooltip:r.getText("COLUMNNAME_TREE"),width:"250px"});return new sap.ui.vtm.Column(s);};I.createVisibilityColumn=function(){var r=sap.ui.vtm.getResourceBundle();var h=r.getText("COLUMNTOOLTIP_VISIBILITY_CLICK_TO_HIDE_ALL");var s=r.getText("COLUMNTOOLTIP_VISIBILITY_CLICK_TO_SHOW_ALL");var c=new sap.ui.vk.CheckEye({checked:true,tooltip:h});c.attachChange(function(e){var d=e.getSource();d.setTooltip(d.getChecked()?h:s);});var b=q.extend(g(),{descriptor:a.Visibility,labelControl:c,hAlign:sap.ui.core.HorizontalAlign.Center,width:"2.5em",resizable:false});return new sap.ui.vtm.Column(b);};I.createMessageStatusColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.MessageStatus,labelControl:new sap.ui.core.Icon({src:"sap-icon://message-warning",tooltip:r.getText("COLUMNTOOLTIP_MESSAGESTATUS"),decorative:false}),hAlign:sap.ui.core.HorizontalAlign.Center,width:"2.5em",resizable:false});s.labelControl.addStyleClass("sapUiVtmTree_StatusColumn_HeaderIcon");return new sap.ui.vtm.Column(s);};I.createTreeItemIdColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.TreeItemId,label:r.getText("COLUMNNAME_TREEITEMID"),tooltip:r.getText("COLUMNNAME_TREEITEMID")});return new sap.ui.vtm.Column(s);};I.createAbsoluteMatrixColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.AbsoluteMatrix,label:r.getText("COLUMNNAME_ABSOLUTEMATRIX"),tooltip:r.getText("COLUMNNAME_ABSOLUTEMATRIX")});return new sap.ui.vtm.Column(s);};I.createRelativeMatrixColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.RelativeMatrix,label:r.getText("COLUMNNAME_RELATIVEMATRIX"),tooltip:r.getText("COLUMNNAME_RELATIVEMATRIX")});return new sap.ui.vtm.Column(s);};I.createSceneNodeIdsColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.SceneNodeIds,label:r.getText("COLUMNNAME_SCENENODEIDS"),tooltip:r.getText("COLUMNNAME_SCENENODEIDS")});return new sap.ui.vtm.Column(s);};I.createOpacityColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.Opacity,label:r.getText("COLUMNNAME_OPACITY"),tooltip:r.getText("COLUMNNAME_OPACITY")});return new sap.ui.vtm.Column(s);};I.createHighlightColorColumn=function(){var r=sap.ui.vtm.getResourceBundle();var s=q.extend(g(),{descriptor:a.HighlightColor,label:r.getText("COLUMNNAME_HIGHLIGHTCOLOR"),tooltip:r.getText("COLUMNNAME_HIGHLIGHTCOLOR")});return new sap.ui.vtm.Column(s);};return I;},true);

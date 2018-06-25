/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object','sap/ui/base/EventProvider','sap/ui/base/ManagedObjectObserver','sap/ui/Device'],function(q,O,E,M,D){"use strict";var e=new E(),i,c;var H=O.extend("HeaderAdapter",{constructor:function(o,A){if(!o||!A){q.sap.log.error("Cannot initialize: Invalid arguments.");return;}this._oHeader=o;this._oStyledPage=null;this._oTitleInfo=null;this._oSubTitleInfo=null;this._oBackButtonInfo=null;this._oAdaptOptions=A;}});H.prototype.adapt=function(){var s=this._oAdaptOptions.bStylePage,C=this._oAdaptOptions.bCollapseHeader;if(s){this._toggleStyle("sapF2Adapted",true,true);}this._adaptTitle();this._adaptBackButton();if(C){this._collapseHeader();}return this.getAdaptedContent();};H.prototype.getAdaptedContent=function(){return{oTitleInfo:this._oTitleInfo,oSubTitleInfo:this._oSubTitleInfo,oBackButtonInfo:this._oBackButtonInfo,oStyledPage:this._oStyledPage};};H.prototype._adaptTitle=function(){if(!H._isAdaptableHeader(this._oHeader)||this._oAdaptOptions.bMoveTitle!==true){return false;}this._oTitleInfo=this._detectTitle();this._oSubTitleInfo=this._detectSubTitle();var s=!!this._oTitleInfo||!!this._oSubTitleInfo;if(this._oTitleInfo){this._oTitleInfo.oControl.toggleStyleClass("sapF2AdaptedTitle",true);}return s;};H.prototype._adaptBackButton=function(){if(!H._isAdaptableHeader(this._oHeader)||this._oAdaptOptions.bHideBackButton!==true){return false;}var j,B=false;this._oBackButtonInfo=this._detectBackButton();if(this._oBackButtonInfo){j=this._oBackButtonInfo.oControl.getVisible();this._oBackButtonInfo.oControl.toggleStyleClass("sapF2AdaptedNavigation",j);B=true;}return B;};H.prototype._toggleStyle=function(s,A,S){var p=this._oHeader.getParent();if(!p){return;}this._oStyledPage=p;if(A===true){p.addStyleClass(s,S);}else if(A===false){p.removeStyleClass(s,S);}else if(A===undefined){p.hasStyleClass(s)?p.removeStyleClass(s,S):p.addStyleClass(s,S);}};H._isAdaptableHeader=function(o){if(!o||!f(o,"sap/m/Bar")){return false;}var p=o.getParent();return p&&(f(p,"sap/m/Page")||f(p,"sap/uxap/ObjectPageHeader"));};H.prototype._detectTitle=function(){var t;if(H._isAdaptableHeader(this._oHeader)){var m=this._oHeader.getContentMiddle();if(m.length===1&&a(m[0])){var T=m[0];t={id:T.getId(),text:T.getText(),oControl:T,sChangeEventId:"_change"};}}return t;};H.prototype._detectSubTitle=function(p){if(f(p,"sap/uxap/ObjectPageHeader")){var o=p.getHeaderTitle();if(o){return{id:o.getId(),text:o.getObjectTitle(),oControl:o,sChangeEventId:"_titleChange"};}}};H.prototype._detectBackButton=function(){var B,o;if(H._isAdaptableHeader(this._oHeader)){B=this._oHeader.getContentLeft();if(B.length>0&&f(B[0],"sap/m/Button")&&(B[0].getType()==="Back"||B[0].getType()==="Up"||B[0].getIcon()==="sap-icon://nav-back")){o=B[0];return{id:o.getId(),oControl:o,sChangeEventId:"_change"};}}};H.prototype._collapseHeader=function(){var t=this._oTitleInfo,B=this._oBackButtonInfo,j,m,k,l,n,o,A;if(H._isAdaptableHeader(this._oHeader)){j=this._oHeader.getContentLeft();m=this._oHeader.getContentMiddle();k=this._oHeader.getContentRight();l=(j.length===1)&&(h(j[0])||B);n=(m.length===1)&&(h(m[0])||t);o=(k.length===1)&&h(k[0]);A=(j.length===0||l)&&(m.length===0||n)&&((k.length===0)||o);this._toggleStyle("sapF2CollapsedHeader",A,true);}};var F=O.extend("sap.m.Fiori20Adapter",{});F.attachViewChange=function(l,L){e.attachEvent("adaptedViewChange",l,L);};F.detachViewChange=function(l,L){e.detachEvent("adaptedViewChange",l,L);};F.traverse=function(C,A){i={aViewTitles:{},aViewSubTitles:{},aViewBackButtons:{},aChangeListeners:{}};c=null;this._doBFS([{oNode:C,oAdaptOptions:A}]);if(this._getCurrentTopViewId()){this._fireViewChange(this._getCurrentTopViewId(),A);}};F._doBFS=function(Q){var n=Q.shift();if(!n){return;}var N=n.oNode,A=n.oAdaptOptions,s=A.iSearchDepth;A=this._applyRules(A,N);if(!this._isAdaptationRequired(N,A)||(s<=0)){return;}var I=this._isTopNavigableView(N);if(I){this._setAsCurrentTopViewId(N.getId());}var o=this._processNode(N,A);var C=this._getNodeChildren(N),j=q.extend({},A,{iSearchDepth:this._updateSearchDepth(s,N)});if(o){var t=!!o.oTitleInfo,B=!!o.oBackButton,p=!!o.oStyledPage;j=q.extend(j,{bMoveTitle:A.bMoveTitle&&!t,bHideBackButton:A.bHideBackButton&&!B,bStylePage:A.bStylePage&&!p});}C.forEach(function(k){if(k){Q.push({oNode:k,oAdaptOptions:j});}});this._doBFS(Q);};F._processNode=function(C,A){this._attachDefferedAdaptationListeners(C,A);if(H._isAdaptableHeader(C)){return this._adaptHeader(C,A);}if(C.getParent()&&f(C.getParent(),"sap/m/NavContainer")){return this._getCachedViewInfoToMerge(C.getId());}};F._attachDefferedAdaptationListeners=function(C,A){this._attachAdaptableContentChange(C,A);this._attachNavigablePageChange(C,A);if(f(C,"sap/m/Page")){this._attachModifyAggregation(C,"content",A);}if((A.bLateAdaptation===true)&&f(C,"sap/m/Bar")){this._attachModifyAggregation(C,"contentLeft",A,C);this._attachModifyAggregation(C,"contentMiddle",A,C);this._attachModifyAggregation(C,"contentRight",A,C);}if(f(C,"sap/ui/core/ComponentContainer")){var o=C.getComponentInstance();if(!o&&C.getName()&&!C.getDomRef()){var t=this;var j={onBeforeRendering:function(){C.removeEventDelegate(j);t._doBFS([{oNode:C.getComponentInstance(),oAdaptOptions:A}]);if(t._getCurrentTopViewId()){t._fireViewChange(t._getCurrentTopViewId(),A);}}};C.addEventDelegate(j,this);}}};F._checkHasListener=function(k){return i.aChangeListeners[k];};F._setHasListener=function(k,v){i.aChangeListeners[k]=v;};F._attachAdaptableContentChange=function(C,A){if(!C._getAdaptableContent||!q.isFunction(C._getAdaptableContent)){return;}var k=C.getId()+"_adaptableContentChange";if(this._checkHasListener(k)){return;}var o=this._getCurrentTopViewId();var j=function(l){var m=l.getParameter("adaptableContent");this._setAsCurrentTopViewId(o);this._doBFS([{oNode:m,oAdaptOptions:A}]);if(this._getCurrentTopViewId()){this._fireViewChange(this._getCurrentTopViewId(),A);}}.bind(this);C.attachEvent("_adaptableContentChange",j);this._setHasListener(k,j);};F._attachNavigablePageChange=function(C,A){if(!f(C,"sap/m/NavContainer")){return;}var k=C.getId()+"navigate";if(this._checkHasListener(k)){return;}var o=function(j){var n=j.getParameter("to");A=this._applyRules(A,n);this._doBFS([{oNode:n,oAdaptOptions:A}]);if(this._getCurrentTopViewId()){this._fireViewChange(this._getCurrentTopViewId(),A);}}.bind(this);C.attachNavigate(o);this._setHasListener(k,o);};F._attachModifyAggregation=function(C,A,o,j){var k=C.getId()+A;if(this._checkHasListener(k)){return;}var l=this._getCurrentTopViewId(),m=function(p){var s=p.mutation,r=p.object;if((s==="add")||(s==="insert")){this._setAsCurrentTopViewId(l);this._doBFS([{oNode:j?j:r,oAdaptOptions:o}]);if(this._getCurrentTopViewId()){this._fireViewChange(l,o);}}}.bind(this),n=new M(m);n.observe(C,{aggregations:[A]});this._setHasListener(k,n);};F._getNodeChildren=function(C){if(C._getAdaptableContent&&q.isFunction(C._getAdaptableContent)){var j=[C._getAdaptableContent()];if(f(C,"sap/m/Page")){j=j.concat(C.getContent());}return j;}if(f(C,"sap/m/SplitContainer")){return[].concat(C.getAggregation("_navMaster"),C.getAggregation("_navDetail"));}if(f(C,"sap/uxap/ObjectPageLayout")){return[C.getHeaderTitle()];}if(f(C,"sap/ui/core/ComponentContainer")){return[C.getComponentInstance()];}if(f(C,"sap/ui/core/UIComponent")){return[C.getAggregation("rootControl")];}return C.findAggregatedObjects(false,g);};F._updateSearchDepth=function(s,C){if(f(C,"sap/ui/core/mvc/View")||f(C,"sap/ui/core/Component")||f(C,"sap/ui/core/ComponentContainer")){return s;}return s-1;};F._getTotalCachedInfoToMerge=function(v){var V=sap.ui.getCore().byId(v),C=this._getCachedViewInfoToMerge(v),j,k,s,S,o,p,l;if(!D.system.phone&&this._isTopSplitContainerSubView(V)){p=V.getParent();o=p&&p.getParent();if(o){j=o._oMasterNav&&(o._oMasterNav.getId()===p.getId());k=o._oDetailNav&&(o._oDetailNav.getId()===p.getId());}}if(j){s=o.getCurrentDetailPage();S=s&&s.getId();l=this._getCachedViewInfoToMerge(S);C=this._mergeSplitViewInfos(C,l);}if(k){s=o.getCurrentMasterPage();S=s&&s.getId();l=this._getCachedViewInfoToMerge(S);C=this._mergeSplitViewInfos(l,C);}C.sViewId=(j||k)?o.getId():v;return C;};F._isTopSplitContainerSubView=function(C){var p=C&&C.getParent();return this._isTopmostNavContainer(p)&&f(p.getParent(),"sap/m/SplitContainer");};F._mergeSplitViewInfos=function(m,o){q.each(m,function(k,v){m[k]=v||o[k];});return m;};F._getCachedViewInfoToMerge=function(v){var B=(i.aViewBackButtons[v])?i.aViewBackButtons[v].oControl:undefined;return{oTitleInfo:i.aViewTitles[v],oSubTitleInfo:i.aViewSubTitles[v],oBackButton:B};};F._applyRules=function(A,C){var p=C.getParent();if(f(p,"sap/m/SplitContainer")){var I=D.system.phone,m=A.bMoveTitle,j=A.bHideBackButton;if(m){m=I;}if(j&&!D.system.phone){j='initialPage';}return q.extend({},A,{bMoveTitle:m,bHideBackButton:j});}if(f(p,"sap/m/NavContainer")){if(A.bHideBackButton==='initialPage'){var k=p._getActualInitialPage()&&(p._getActualInitialPage().getId()===C.getId());return q.extend({},A,{bHideBackButton:k});}}if((A.bMoveTitle===false)||(A.bHideBackButton===false)){return q.extend({},A,{bCollapseHeader:false});}return A;};F._getCurrentTopViewId=function(){return c;};F._setAsCurrentTopViewId=function(v){c=v;};F._isTopNavigableView=function(n){var p=n.getParent();return p&&this._isTopmostNavContainer(p);};F._isTopmostNavContainer=function(C){var o,n=C;while(n){if(f(n,"sap/m/NavContainer")){o=n;}n=n.getParent();}return o&&(o.getId()===C.getId());};F._adaptHeader=function(o,A){if(!o||!A){return;}var j=new H(o,A),k=j.adapt();var t=this._getCurrentTopViewId();if(k.oTitleInfo){i.aViewTitles[t]=k.oTitleInfo;this._registerTextChangeListener(i.aViewTitles,t,A);}if(k.oSubTitleInfo){i.aViewSubTitles[t]=k.oSubTitleInfo;this._registerTextChangeListener(i.aViewSubTitles,t,A);}if(k.oBackButtonInfo){if(k.oBackButtonInfo.oControl.getVisible()){i.aViewBackButtons[t]=k.oBackButtonInfo;}this._registerVisibilityChangeListener(k.oBackButtonInfo,i.aViewBackButtons,t,A);}return k;};F._registerTextChangeListener=function(t,v,A){var T=t[v];if(T&&T.oControl&&T.sChangeEventId&&!i.aChangeListeners[T.id]){var C=function(o){var T=t[v];T.text=o.getParameter("newValue");this._fireViewChange(v,A);}.bind(this);T.oControl.attachEvent(T.sChangeEventId,C);i.aChangeListeners[T.id]=C;}};F._registerVisibilityChangeListener=function(C,j,v,A){var V;if(C&&C.oControl&&C.sChangeEventId&&!i.aChangeListeners[C.id]){var k=function(o){V=o.getParameter("newValue");if(!V){q.each(j,function(I,l){if(l.oControl.getId()===C.oControl.getId()){delete j[I];}});}var p=C.oControl.getParent();if(H._isAdaptableHeader(p)){F._adaptHeader(p,A);this._fireViewChange(v,A);}}.bind(this);C.oControl.attachEvent(C.sChangeEventId,k);i.aChangeListeners[C.id]=k;}};F._fireViewChange=function(v,A){var t=this._getTotalCachedInfoToMerge(v);t.oAdaptOptions=A;e.fireEvent("adaptedViewChange",t);};F._isAdaptationRequired=function(n,A){if(!n||this._isNonAdaptableControl(n)){return false;}for(var o in A){if(A.hasOwnProperty(o)&&((A[o]===true)||(A[o]==="initialPage"))){return true;}}return false;};F._isNonAdaptableControl=function(C){return b(C);};function a(C){return d(C,["sap/m/Label","sap/m/Text","sap/m/Title"]);}function b(C){return d(C,["sap/m/List","sap/m/Table","sap/ui/table/Table","sap/ui/table/TreeTable"]);}function d(C,t){if(!C||!t){return;}return t.some(function(T){return f(C,T);});}function f(C,t){var T=sap.ui.require(t);return T&&(C instanceof T);}function g(o){return o&&(o.sParentAggregationName!=="dependents");}function h(o){return o&&(typeof o.getVisible==="function")&&(o.getVisible()===false);}return F;});

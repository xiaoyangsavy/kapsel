/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/Panel","sap/m/List","sap/m/ListItemBase","sap/m/StandardListItem","sap/m/InputListItem","sap/m/Button","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Label","sap/m/MessageToast","sap/ui/support/supportRules/WindowCommunicationBus","sap/ui/support/supportRules/WCBChannels","sap/ui/support/supportRules/ui/models/SharedModel","sap/ui/support/supportRules/RuleSerializer","sap/ui/support/supportRules/Constants","sap/ui/support/supportRules/RuleSet","sap/ui/support/supportRules/Storage"],function($,Controller,JSONModel,Panel,List,ListItemBase,StandardListItem,InputListItem,Button,Toolbar,ToolbarSpacer,Label,MessageToast,CommunicationBus,channelNames,SharedModel,RuleSerializer,constants,Ruleset,storage){"use strict";return Controller.extend("sap.ui.support.supportRules.ui.controllers.Analysis",{onInit:function(){this.model=SharedModel;this.setCommunicationSubscriptions();this.initSettingsPopover();CommunicationBus.publish(channelNames.ON_INIT_ANALYSIS_CTRL);this.tempRulesLoaded=false;this.getView().setModel(this.model);this.treeTable=this.getView().byId("ruleList");this.cookie=storage.readPersistenceCookie(constants.COOKIE_NAME);},onAsyncSwitch:function(e){var s=e.getSource();if(e.getParameter("selected")){var a=s.getCustomData()[0].getValue()==="true";var r=s.getProperty("groupName")==="asyncContext"?"/newRule":"/editRule";this.model.setProperty(r+"/async",a);this._updateCheckFunction(r,a);}},_updateCheckFunction:function(r,a){var c=this.model.getProperty(r+"/check");if(!c){return;}var m=c.match(/function[^(]*\(([^)]*)\)/);if(!m){return;}var p=m[1].trim().split(/\W+/);p[0]=p[0]||"oIssueManager";p[1]=p[1]||"oCoreFacade";p[2]=p[2]||"oScope";if(a){p[3]=p[3]||"fnResolve";}else{p=p.slice(0,3);}var n=c.replace(/function[^(]*\(([^)]*)\)/,"function ("+p.join(", ")+")");this.model.setProperty(r+"/check",n);},getTemporaryLib:function(){var l=this.model.getProperty("/libraries");for(var i=0;i<l.length;i++){if(l[i].title==constants.TEMP_RULESETS_NAME){return l[i];}}},setCommunicationSubscriptions:function(){CommunicationBus.subscribe(channelNames.UPDATE_SUPPORT_RULES,this.updatesupportRules,this);CommunicationBus.subscribe(channelNames.VERIFY_RULE_CREATE_RESULT,function(d){var r=d.result,n=RuleSerializer.deserialize(d.newRule,true),t=this.getTemporaryLib(),a=this.model.getProperty('/treeViewModel');if(r=="success"){t.rules.push(n);this._syncTreeTableVieModelTempRulesLib(t,a);if(this.model.getProperty("/persistingSettings")){storage.setRules(t.rules);if(this.showRuleCreatedToast){MessageToast.show('Your temporary rule "'+n.id+'" was persisted in the local storage');this.showRuleCreatedToast=false;}}var e=this.model.getProperty("/newEmptyRule");this.model.setProperty("/newRule",jQuery.extend(true,{},e));this.goToRuleProperties();this.model.setProperty("/selectedRule",n);}else{MessageToast.show("Add rule failed because: "+r);}},this);CommunicationBus.subscribe(channelNames.VERIFY_RULE_UPDATE_RESULT,function(d){var r=d.result,u=RuleSerializer.deserialize(d.updateRule,true),t=this;if(r==="success"){var a=this.model.getProperty("/editRuleSource"),b=this.model.getProperty('/treeViewModel');var l=this.model.getProperty('/libraries');l.forEach(function(c,e){if(c.title===constants.TEMP_RULESETS_NAME){c.rules.forEach(function(f,g){if(f.id===a.id){c.rules[g]=u;if(t.model.getProperty("/persistingSettings")){storage.setRules(c.rules);}}});t._syncTreeTableVieModelTempRule(u,b);}});this.model.checkUpdate(true);this.model.setProperty('/selectedRule',u);this.goToRuleProperties();}else{MessageToast.show("Update rule failed because: "+r);}},this);CommunicationBus.subscribe(channelNames.POST_AVAILABLE_LIBRARIES,function(d){this.model.setProperty("/availableLibrariesSet",d.libNames);if(this.loadingFromLoadButton){MessageToast.show("Libraries ruleset loaded");this.loadingFromLoadButton=false;}},this);CommunicationBus.subscribe(channelNames.POST_AVAILABLE_COMPONENTS,function(d){var e=[],m=this.model.getProperty("/executionScopeComponents"),s=storage.getSelectedScopeComponents(),i;for(var c=0;c<d.length;c+=1){e.push({text:d[c]});}if(m&&m.length>0){for(i=0;i<e.length;i++){e[i].selected=this.checkIfComponentIsSelected(e[i],m);}}else if(s&&s.length>0){for(i=0;i<e.length;i++){e[i].selected=this.checkIfComponentIsSelected(e[i],s);}}this.model.setProperty("/executionScopeComponents",e);},this);CommunicationBus.subscribe(channelNames.GET_RULES_MODEL,function(t){this.model.setProperty("/treeViewModel",t);},this);},checkIfComponentIsSelected:function(c,s){for(var i=0;i<s.length;i+=1){if(s[i].text==c.text&&s[i].selected){return true;}}return false;},onAnalyze:function(){var s=this._getSelectedRules(),e=this._getExecutionContext();if(s.length>0){CommunicationBus.publish(channelNames.ON_ANALYZE_REQUEST,{selectedRules:s,executionContext:e});this.model.setProperty("/showProgressIndicator",true);}else{MessageToast.show("Select some rules to be analyzed.");}},initSettingsPopover:function(){this._settingsPopover=sap.ui.xmlfragment("sap.ui.support.supportRules.ui.views.AnalyzeSettings",this);this._settingsPopover.setModel(SharedModel);this.getView().addDependent(this._oPopover);},_getExecutionContext:function(){var c={type:this.model.getProperty("/analyzeContext/key")};if(c.type==="subtree"){c.parentId=this.model.getProperty("/subtreeExecutionContextId");}if(c.type==="components"){var s=sap.ui.getCore().byId("componentsSelectionContainer"),a=s.getContent();c.components=[];a.forEach(function(b){if(b.getSelected()){c.components.push(b.getText());}});}return c;},_getSelectedRules:function(){var s=[],a=this.treeTable.getSelectedIndices(),t=this;a.forEach(function(i){if(t.treeTable.getContextByIndex(i).getObject().id){s.push({libName:t.treeTable.getContextByIndex(i).getObject().libName,ruleId:t.treeTable.getContextByIndex(i).getObject().id});}});return s;},_syncTreeTableVieModelTempRulesLib:function(t,a){var b=0;for(var r in t.rules){for(var i in a){if(a[i].name===constants.TEMP_RULESETS_NAME){a[i][b]={name:t.rules[r].title,description:t.rules[r].description,id:t.rules[r].id,audiences:t.rules[r].audiences,categories:t.rules[r].categories,minversion:t.rules[r].minversion,resolution:t.rules[r].resolution,title:t.rules[r].title,libName:a[i].name,check:t.rules[r].check};}}b++;}},_syncTreeTableVieModelTempRule:function(t,a){var r=this.model.getProperty("/editRuleSource");for(var i in a){if(a[i].name===constants.TEMP_RULESETS_NAME){for(var b in a[i]){if(a[i][b].id===r.id){a[i][b]={name:t.title,description:t.description,id:t.id,audiences:t.audiences,categories:t.categories,minversion:t.minversion,resolution:t.resolution,title:t.title,libName:a[i].name,check:t.check};}}}}},onAnalyzeSettings:function(e){CommunicationBus.publish(channelNames.GET_AVAILABLE_COMPONENTS);this._settingsPopover.openBy(e.getSource());},onContextSelect:function(e){if(e.getParameter("selected")){var s=e.getSource(),r=s.getCustomData()[0].getValue(),a=this.model.getProperty("/executionScopes")[r];this.model.setProperty("/analyzeContext",a);}if(this.cookie){this.persistExecutionScope();}},onExecutionContextChange:function(e){var v=e.getSource().getValue();if(v){this.model.setProperty("/subtreeExecutionContextId",v);}if(this.cookie){this.persistExecutionScope();}},persistExecutionScope:function(){var s={analyzeContext:this.model.getProperty("/analyzeContext"),subtreeExecutionContextId:this.model.getProperty("/subtreeExecutionContextId")};storage.setSelectedContext(s);},onScopeComponentSelect:function(e){var s=this.model.getProperty("/executionScopeComponents");if(this.cookie){storage.setSelectedScopeComponents(s);}},onBeforePopoverOpen:function(){if(this.model.getProperty("/executionScopeComponents").length===0){CommunicationBus.publish(channelNames.GET_AVAILABLE_COMPONENTS);}},createNewRulePress:function(e){var a=this.model.getProperty("/newEmptyRule");this.model.setProperty("/selectedSetPreviewKey","availableRules");this.model.setProperty("/newRule",jQuery.extend(true,{},a));this.model.setProperty("/tempLink",{href:"",text:""});this.goToCreateRule();},goToRuleProperties:function(){var n=this.getView().byId("rulesNavContainer");n.to(this.getView().byId("rulesDisplayPage"),"show");},createRuleString:function(r){if(!r){return'';}var s="{\n",c=0,k=Object.keys(r).length;for(var a in r){var v=r[a];c++;s+="\t";s+=a+": ";if(a==="check"){s+=v.split("\n").join("\n\t");}else{s+=JSON.stringify(v);}if(c<k){s+=",";}s+="\n";}s+="}";return s;},updateRule:function(){var o=this.model.getProperty("/editRuleSource/id"),u=this.model.getProperty("/editRule");if(this.checkFunctionString(u.check)){CommunicationBus.publish(channelNames.VERIFY_UPDATE_RULE,{oldId:o,updateObj:RuleSerializer.serialize(u)});}},updatesupportRules:function(d){d=RuleSerializer.deserialize(d);CommunicationBus.publish(channelNames.REQUEST_RULES_MODEL,d);var l=[],t=this,p=this.model.getProperty("/persistingSettings");for(var i in d){var r=[],a=d[i].ruleset._mRules;for(var j in a){var b=a[j];b.libName=i;b.selected=true;r.push(b);}l.push({title:i,type:"library",rules:r});}var f;if(l[0].rules[0]){f=l[0].rules[0];}else{f=l[1].rules[0];}t.placeTemporaryRulesetAtStart(l);t.model.setProperty("/selectedRuleStringify","");t.model.setProperty("/selectedRule",f);t.model.setProperty("/selectedRuleStringify",t.createRuleString(f));t.model.setProperty("/libraries",l);var c=storage.getRules(),e=t.model.getProperty("/loadingAdditionalRuleSets");if(c&&!e&&!this.tempRulesLoaded){this.tempRulesLoaded=true;c.forEach(function(g){CommunicationBus.publish(channelNames.VERIFY_CREATE_RULE,RuleSerializer.serialize(g));});}t.model.setProperty("/loadingAdditionalRuleSets",false);if(p){var s=storage.getSelectedRules();s.forEach(function(g){t.treeTable.setSelectedIndex(g);});}else{this.treeTable.selectAll();}},placeTemporaryRulesetAtStart:function(l){for(var i=0;i<l.length;i++){var r=l[i];if(r.title===constants.TEMP_RULESETS_NAME){var t=r;l.splice(i,1);l.unshift(t);return;}}},addLinkToRule:function(e){var t=this.model.getProperty("/tempLink"),c=jQuery.extend(true,{},t),a=e.getSource().getProperty("text"),r=a==='Add'?"/newRule":"/editRule",u=this.model.getProperty(r+"/resolutionurls");if(u){u.push(c);}else{this.model.setProperty(r+"/resolutionurls","");u.push(c);}this.model.setProperty("/tempLink",{href:"",text:""});this.model.checkUpdate(true,true);},goToCreateRule:function(){var n=this.getView().byId("rulesNavContainer");n.to(this.getView().byId("rulesCreatePage"),"show");},checkFunctionString:function(functionString){try{eval("var testAsignedVar = "+functionString);}catch(err){MessageToast.show("Your check function contains errors, and can't be evaluated:"+err);return false;}return true;},addNewRule:function(){var n=this.model.getProperty("/newRule");if(this.checkFunctionString(n.check)){this.showRuleCreatedToast=true;CommunicationBus.publish(channelNames.VERIFY_CREATE_RULE,RuleSerializer.serialize(n));}},rulesToolbarITHSelect:function(e){if(e.getParameter("key")==="jsonOutput"){var n=this.model.getProperty("/newRule"),s=this.createRuleString(n);this.model.setProperty("/newRuleStringified",s);}},rulesToolbarEditITHSelect:function(e){if(e.getParameter("key")==="jsonOutput"){var n=this.model.getProperty("/editRule"),s=this.createRuleString(n);this.model.setProperty("/updateRuleStringified",s);}},loadMarkedSupportLibraries:function(){var l=this.getView().byId("availableLibrariesSet"),a=l.getSelectedItems().map(function(i){return i.getTitle();});l.getItems().forEach(function(i){i.setSelected(false);});if(a.length>0){this.loadingFromLoadButton=true;CommunicationBus.publish(channelNames.LOAD_RULESETS,{libNames:a});this.model.setProperty("/loadingAdditionalRuleSets",true);}},onCellClick:function(e){if(e.getParameter("rowBindingContext")){var s=e.getParameter("rowBindingContext").getObject(),a;if(s.id){a=this.getMainModelFromTreeViewModel(s);var b=this.createRuleString(a);this.model.setProperty("/selectedRuleStringify",b);}this.model.setProperty("/selectedRule",a);}},getMainModelFromTreeViewModel:function(s){var a=this.model.getProperty("/libraries"),m=null;a.forEach(function(l,i){a[i].rules.forEach(function(e){if(s.id===e.id){m=e;}});});return m;},duplicateRule:function(e){var p=e.getSource().getBindingContext().getPath(),s=this.getView().getModel().getProperty(p),a=this.getMainModelFromTreeViewModel(s),b=jQuery.extend(true,{},a);this.model.setProperty("/newRule",b);this.model.checkUpdate(true,false);this.goToCreateRule();},editRule:function(e){var p=e.getSource().getBindingContext().getPath(),s=this.getView().getModel().getProperty(p),a=this.getMainModelFromTreeViewModel(s);this.model.setProperty("/editRuleSource",a);this.model.setProperty("/editRule",jQuery.extend(true,{},a));this.model.checkUpdate(true,true);var n=this.getView().byId("rulesNavContainer");n.to(this.getView().byId("ruleUpdatePage"),"show");},deleteTemporaryRule:function(e){var s=this.getObjectOnTreeRow(e),t=this.model.getProperty("/treeViewModel"),m=this.model.getProperty("/libraries"),r=[];m.forEach(function(l,b){if(l.title===constants.TEMP_RULESETS_NAME){l.rules.forEach(function(c,d){if(c.id===s.id){l.rules.splice(d,1);return;}else{r.push(c);}});}});for(var i in t){if(t[i].name===constants.TEMP_RULESETS_NAME){for(var a in t[i]){if(t[i][a].id===s.id){delete t[i][a];}}}}this.model.setProperty("/treeViewModel",t);storage.removeSelectedRules(r);},getObjectOnTreeRow:function(e){var p=e.getSource().getBindingContext().getPath(),s=this.getView().getModel().getProperty(p),l=this.model.getProperty("/libraries");l.forEach(function(a,b){a.rules.forEach(function(r){if(r.id===s.id){s.check=r.check;}});});return s;}});});
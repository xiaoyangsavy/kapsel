sap.ui.define(["sap/ui/core/ValueState","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/m/MessageBox"],function(V,F,a,M,b){"use strict";var h={badRequest:"400",unauthorized:"401",forbidden:"403",notFound:"404",methodNotAllowed:"405",preconditionFailed:"428",internalServerError:"500",notImplemented:"501",badGateway:"502",serviceUnavailable:"503",gatewayTimeout:"504",httpVersionNotSupported:"505"};var o={callAction:"callAction",addEntry:"addEntry",saveEntity:"saveEntity",deleteEntity:"deleteEntity",editEntity:"editEntity",modifyEntity:"modifyEntity",activateDraftEntity:"activateDraftEntity",saveAndPrepareDraftEntity:"saveAndPrepareDraftEntity",getCollection:"getCollection"};var m;function g(R){var t=[],f;var j=sap.ui.getCore().getMessageManager();var k=j.getMessageModel().getData();for(var i=0;i<k.length;i++){f=k[i];if(f.getPersistent()){t.push(f);}}jQuery.noop(R);return t;}function c(P,C){var D;D=function(n,f){var i;var j={onMessageDialogClose:function(){f.onMessageDialogClose();i.destroy();}};i=sap.ui.xmlfragment(n,j);if(C){jQuery.sap.syncStyleClass(C,P,i);}P.addDependent(P);return i;};return D;}function d(v,A){var s,t,D,f,j={};var k={onMessageDialogClose:function(){j={};n.removeAllItems();D.close();r();}};var l=function(n,u,w){for(var x in u){var G=new sap.m.GroupHeaderListItem({title:w+" - "+x});switch(w){case sap.ui.core.MessageType.Error:G.addStyleClass("sapSmartTemplatesSLINegative");break;case sap.ui.core.MessageType.Warning:G.addStyleClass("sapSmartTemplatesSLICritical");break;case sap.ui.core.MessageType.Success:G.addStyleClass("sapSmartTemplatesSLIPositive");break;default:G.addStyleClass("sapSmartTemplatesSLINeutral");break;}n.addItem(G);var i=0;var y="";while(i<u[x].length){if(u[x][i]){y=u[x][i];if(y.lastIndexOf("/")>0){y=y.substring(0,y.lastIndexOf("/"));}var E=y.substring(1,y.indexOf('('));var z=f.getODataEntitySet(E);if(z){var B=f.createBindingContext("com.sap.vocabularies.UI.v1.HeaderInfo/Title/Value",f.getMetaContext('/'+E));}}var C=(E==''||!B)?(L.getText("GENERAL_MESSAGE")):sap.ui.model.odata.AnnotationHelper.format(B);var H=new sap.m.StandardListItem({title:C});H.addStyleClass("sapSmartTemplatesSLIBold");H.bindElement(y);n.addItem(H);i++;}}};var T=g();if(T.length===0){return false;}else if(T.length===1&&T[0].type===V.Success){M.show(T[0].message,{onClose:r});}else{if(typeof v=="function"){D=v("sap.ui.generic.app.fragments.MessageDialog",k);}else if(typeof v=="object"){D=c(v.owner,v.contentDensityClass)("sap.ui.generic.app.fragments.MessageDialog",k);}else{return undefined;}for(var i=0;i<T.length;i++){switch(T[i].type){case sap.ui.core.MessageType.Error:if(!j.Error){j.Error={};}if(!j.Error[T[i].message]){j.Error[T[i].message]=[];}if(j.Error[T[i].message].indexOf(T[i].target)===-1){j.Error[T[i].message].push(T[i].target);}break;case sap.ui.core.MessageType.Warning:if(!j.Warning){j.Warning={};}if(!j.Warning[T[i].message]){j.Warning[T[i].message]=[];}if(j.Warning[T[i].message].indexOf(T[i].target)===-1){j.Warning[T[i].message].push(T[i].target);}break;case sap.ui.core.MessageType.Success:if(!j.Success){j.Success={};}if(!j.Success[T[i].message]){j.Success[T[i].message]=[];}if(j.Success[T[i].message].indexOf(T[i].target)===-1){j.Success[T[i].message].push(T[i].target);}break;default:if(!j.Information){j.Information={};}if(!j.Information[T[i].message]){j.Information[T[i].message]=[];}if(j.Information[T[i].message].indexOf(T[i].target)===-1){j.Information[T[i].message].push(T[i].target);}}}var L=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app");var n=D.getContent()[1];if(n.getItems().length>0){n.removeAllItems();}f=D.getModel().getMetaModel();j.Error&&l(n,j.Error,sap.ui.core.MessageType.Error);j.Warning&&l(n,j.Warning,sap.ui.core.MessageType.Warning);j.Success&&l(n,j.Success,sap.ui.core.MessageType.Success);j.Information&&l(n,j.Information,sap.ui.core.MessageType.Information);D.addContent(n);var S=new sap.ui.model.json.JSONModel();D.setModel(S,"settings");S.setProperty("/genericListText",L.getText("LIST_TEXT"));S.setProperty("/closeButtonText",L.getText("DIALOG_CLOSE"));for(var i=0;i<T.length;i++){var q=T[i];if(q.type===sap.ui.core.MessageType.Error){s=sap.ui.core.ValueState.Error;break;}if(q.type===sap.ui.core.MessageType.Warning){s=sap.ui.core.ValueState.Warning;continue;}if(q.type===sap.ui.core.MessageType.Information||q.type===sap.ui.core.MessageType.None){s=sap.ui.core.ValueState.None;continue;}s=sap.ui.core.ValueState.Success;}if(A){t=A;}else{t=L.getText("DIALOG_TITLE");}S.setProperty("/state",s);S.setProperty("/title",t);D.open();}}function r(){var f=sap.ui.getCore().getMessageManager();var t=g();if(t.length>0){f.removeMessages(t);}}function e(s,D,f){var t=new sap.ui.core.message.Message({message:s,description:D,type:sap.ui.core.MessageType.Error,processor:f,target:'',persistent:true});sap.ui.getCore().getMessageManager().addMessages(t);}function p(E){var R;m=E&&E.url;if(m){m="/"+m.substring(0,m.indexOf(")")+1);}var s=sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ERROR_UNKNOWN");var H;if(E instanceof Error){if(E.message){s=E.message;}}else if(E.response){if(E.response.message){s=E.response.message;}if(E.response.statusCode){H=E.response.statusCode;}if(E.response.headers){for(var f in E.response.headers){if(f.toLowerCase()==="content-type"){var i=E.response.headers[f];if(i.toLowerCase().indexOf("application/json")===0){if(E.response.responseText){var O=JSON.parse(E.response.responseText);if(O&&O.error&&O.error.message&&O.error.message.value){s=O.error.message.value;}}}else if(E.message){s=E.message;}break;}}}}var t=g(E);R={httpStatusCode:H,messageText:s,description:null,containsTransientMessage:(t.length===0)?false:true};return R;}return{operations:o,httpStatusCodes:h,handleTransientMessages:d,removeTransientMessages:r,addTransientErrorMessage:e,parseErrorResponse:p};},true);

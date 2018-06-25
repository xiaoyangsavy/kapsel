/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object','sap/ui/core/LocaleData'],function(B,L){"use strict";var U=B.extend("sap.ui.core.date.UniversalDate",{constructor:function(){var b=U.getClass();return this.createDate(b,arguments);}});U.UTC=function(){var b=U.getClass();return b.UTC.apply(b,arguments);};U.now=function(){return Date.now();};U.prototype.createDate=function(b,A){switch(A.length){case 0:return new b();case 1:return new b(A[0]);case 2:return new b(A[0],A[1]);case 3:return new b(A[0],A[1],A[2]);case 4:return new b(A[0],A[1],A[2],A[3]);case 5:return new b(A[0],A[1],A[2],A[3],A[4]);case 6:return new b(A[0],A[1],A[2],A[3],A[4],A[5]);case 7:return new b(A[0],A[1],A[2],A[3],A[4],A[5],A[6]);}};U.getInstance=function(d,C){var b,i;if(d instanceof U){d=d.getJSDate();}if(!C){C=sap.ui.getCore().getConfiguration().getCalendarType();}b=U.getClass(C);i=Object.create(b.prototype);i.oDate=d;i.sCalendarType=C;return i;};U.getClass=function(C){if(!C){C=sap.ui.getCore().getConfiguration().getCalendarType();}return sap.ui.requireSync("sap/ui/core/date/"+C);};["getDate","getMonth","getFullYear","getYear","getDay","getHours","getMinutes","getSeconds","getMilliseconds","getUTCDate","getUTCMonth","getUTCFullYear","getUTCDay","getUTCHours","getUTCMinutes","getUTCSeconds","getUTCMilliseconds","getTime","valueOf","getTimezoneOffset","toString","toDateString","setDate","setFullYear","setYear","setMonth","setHours","setMinutes","setSeconds","setMilliseconds","setUTCDate","setUTCFullYear","setUTCMonth","setUTCHours","setUTCMinutes","setUTCSeconds","setUTCMilliseconds"].forEach(function(n){U.prototype[n]=function(){return this.oDate[n].apply(this.oDate,arguments);};});U.prototype.getJSDate=function(){return this.oDate;};U.prototype.getCalendarType=function(){return this.sCalendarType;};U.prototype.getEra=function(){return U.getEraByDate(this.sCalendarType,this.oDate.getFullYear(),this.oDate.getMonth(),this.oDate.getDate());};U.prototype.setEra=function(E){};U.prototype.getUTCEra=function(){return U.getEraByDate(this.sCalendarType,this.oDate.getUTCFullYear(),this.oDate.getUTCMonth(),this.oDate.getUTCDate());};U.prototype.setUTCEra=function(E){};U.prototype.getWeek=function(){return U.getWeekByDate(this.sCalendarType,this.getFullYear(),this.getMonth(),this.getDate());};U.prototype.setWeek=function(w){var d=U.getFirstDateOfWeek(this.sCalendarType,w.year||this.getFullYear(),w.week);this.setFullYear(d.year,d.month,d.day);};U.prototype.getUTCWeek=function(){return U.getWeekByDate(this.sCalendarType,this.getUTCFullYear(),this.getUTCMonth(),this.getUTCDate());};U.prototype.setUTCWeek=function(w){var d=U.getFirstDateOfWeek(this.sCalendarType,w.year||this.getFullYear(),w.week);this.setUTCFullYear(d.year,d.month,d.day);};U.prototype.getQuarter=function(){return Math.floor((this.getMonth()/3));};U.prototype.getUTCQuarter=function(){return Math.floor((this.getUTCMonth()/3));};U.prototype.getDayPeriod=function(){if(this.getHours()<12){return 0;}else{return 1;}};U.prototype.getUTCDayPeriod=function(){if(this.getUTCHours()<12){return 0;}else{return 1;}};U.prototype.getTimezoneShort=function(){if(this.oDate.getTimezoneShort){return this.oDate.getTimezoneShort();}};U.prototype.getTimezoneLong=function(){if(this.oDate.getTimezoneLong){return this.oDate.getTimezoneLong();}};var m=7*24*60*60*1000;U.getWeekByDate=function(C,y,M,d){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),b=this.getClass(C),f=g(b,y),D=new b(b.UTC(y,M,d)),w,i,n,o,N;if(l.getRegion()==="US"){w=c(f,D);}else{i=y-1;n=y+1;o=g(b,i);N=g(b,n);if(D>=N){y=n;w=0;}else if(D<f){y=i;w=c(o,D);}else{w=c(f,D);}}return{year:y,week:w};};U.getFirstDateOfWeek=function(C,y,w){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),b=this.getClass(C),f=g(b,y),d=new b(f.valueOf()+w*m);if(l.getRegion()==="US"&&w===0&&f.getUTCFullYear()<y){return{year:y,month:0,day:1};}return{year:d.getUTCFullYear(),month:d.getUTCMonth(),day:d.getUTCDate()};};function g(b,y){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),o=L.getInstance(l),M=o.getMinimalDaysInFirstWeek(),f=o.getFirstDayOfWeek(),F=new b(b.UTC(y,0,1)),d=7;while(F.getUTCDay()!==f){F.setUTCDate(F.getUTCDate()-1);d--;}if(d<M){F.setUTCDate(F.getUTCDate()+7);}return F;}function c(f,t){return Math.floor((t.valueOf()-f.valueOf())/m);}var e={};U.getEraByDate=function(C,y,M,d){var E=a(C),t=new Date(0).setUTCFullYear(y,M,d),o;for(var i=E.length-1;i>=0;i--){o=E[i];if(!o){continue;}if(o._start&&t>=o._startInfo.timestamp){return i;}if(o._end&&t<o._endInfo.timestamp){return i;}}};U.getCurrentEra=function(C){var n=new Date();return this.getEraByDate(C,n.getFullYear(),n.getMonth(),n.getDate());};U.getEraStartDate=function(C,E){var b=a(C),o=b[E]||b[0];if(o._start){return o._startInfo;}};function a(C){var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale(),o=L.getInstance(l),E=e[C];if(!E){var E=o.getEraDates(C);if(!E[0]){E[0]={_start:"1-1-1"};}for(var i=0;i<E.length;i++){var b=E[i];if(!b){continue;}if(b._start){b._startInfo=p(b._start);}if(b._end){b._endInfo=p(b._end);}}e[C]=E;}return E;}function p(d){var P=d.split("-"),y,M,D;if(P[0]==""){y=-parseInt(P[1],10);M=parseInt(P[2],10)-1;D=parseInt(P[3],10);}else{y=parseInt(P[0],10);M=parseInt(P[1],10)-1;D=parseInt(P[2],10);}return{timestamp:new Date(0).setUTCFullYear(y,M,D),year:y,month:M,day:D};}return U;});

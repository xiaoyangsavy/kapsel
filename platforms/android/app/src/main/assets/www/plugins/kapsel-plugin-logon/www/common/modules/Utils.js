cordova.define("kapsel-plugin-logon.LogonUtils", function(require, exports, module) {
var logLevel = "ERROR";
var logPerformance = false;

//The logon utils only supports ERROR and DEBUG log levels. Other levels are handled same as ERROR.
var setLogLevel = function(level){
    if (level == "ERROR" || level =="DEBUG"||level =="INFO"||level =="WARN"){
        logLevel = level;
    }
    else{
        log("Invalid log level: " + level);
    }
}

var log = function(message) {
	//the below method will be handled by kapsel logger plugin if logger plugin is enabled.
    console.log(message);
    
    if ((logLevel == "ERROR" || logLevel == "WARN") && sap.Logger){
        //if log level is ERROR or WARN, console.log will not log to native side,
        //force it to do so 
        sap.Logger.error(message);
    }
}

var debug = function(message){
    if (logLevel == "DEBUG"){
        log(message);
    }
}

var formatDate = function(date){
    return ("0" + date.getHours()).slice(-2) +":"+ ("0"+date.getMinutes()).slice(-2)+":"+("0"+date.getSeconds()).slice(-2)+ "." +("00"+date.getMilliseconds()).slice(-3);
};

var logPerformanceMessage = function(message){
    
    if (logPerformance){
        var currentTime = new Date();
        console.log("PerfJ " + formatDate(currentTime) + "	" + message);
        if (device.platform.toLowerCase().indexOf("ios") >= 0) {
            //TODO: remove the if condition after andorid and windows is updateed
            sap.Logger.logRawMessage("PerfJ " + formatDate(currentTime) + "	" + message);
        }
        return currentTime;
    }
    else{
        debug(message);
        return null;
    }
}


var logPerformanceMessageSince = function(message, since){
    return logPerformanceMessageSinceWithMaxLimit(message, since, 0);
}

var logPerformanceMessageSinceWithMaxLimit = function(message, since, limit){
    if (logPerformance){
        var currentTime = new Date();
        var timeDiff = currentTime - since;
        
        if (limit != 0 && timeDiff > limit){
            alert("!!! attention: Perforamance is over maximal allowed limit! " + "PerfJ "+ formatDate(currentTime) +"	"+ message+"	taken: "+ timeDiff );
        }
        
        console.log("PerfJ "+ formatDate(currentTime) +"	"+ message+"	taken: "+ timeDiff );
        if (device.platform.toLowerCase().indexOf("ios") >= 0) {
            sap.Logger.logRawMessage("PerfJ "+ formatDate(currentTime)+ "	"+ message+"	taken: "+ timeDiff );
        }
        return currentTime;
    }
    else{
        debug(message)
        return null;
    }
}

var logJSON = function(obj, msg){
	if (typeof msg === 'string') {
		log(msg);
	}
		var secureContext = removeSecureDataForLoggingFromContext(obj);
		log(JSON.stringify(secureContext));
	}

	var removeSecureDataForLoggingFromContext = function(obj) {

		var copy = clone(obj);
        var replacement = '>>> FILTERED <<<'

		if (copy) {
			if (copy.passcode) {
				copy.passcode = replacement;
			}
            if (copy.afariaPassword) {
                copy.afariaPassword = replacement;
            }
			if (copy.ssoPasscode) {
				copy.ssoPasscode = replacement;
			}
			if (copy.oldPasscode) {
				copy.oldPasscode = replacement;
			}
			if (copy.passcode_CONFIRM) {
				copy.passcode_CONFIRM = replacement;
			}
            if (copy.unlockPasscode) {
				copy.unlockPasscode = replacement;
			}
            if (copy.password) {
				copy.password = replacement;
			}
            if (copy.newPassword) {
				copy.newPassword = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.password) {
				copy.registrationContext.password = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.newPassword) {
				copy.registrationContext.newPassword = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.passcode) {
				copy.registrationContext.passcode = replacement;
			}
			if (copy.registrationContext && copy.registrationContext.unlockPasscode) {
				copy.registrationContext.unlockPasscode = replacement;
			}
		}

		return copy;
}

var debugJSON = function(obj, msg){
    if (logLevel == "DEBUG"){
        logJSON(obj, msg);
    }
}

var logArgs = function(args){
	var argArray = Array.prototype.slice.call(args);
	log(argArray);
}

var debugArgs = function(args){
    if (logLevel == "DEBUG"){
        logArgs(args);
    }
}

var logKeys = function(obj, msg){
	if (typeof msg === 'string') {
		log(msg);
	}
	
	if (typeof obj !== 'object' || obj == null){
		log(obj + "");
		} else {
		log('own:   ' + Object.getOwnPropertyNames(obj));
		log('proto: ' + Object.getOwnPropertyNames(Object.getPrototypeOf(obj)));
	}
}

var debugKeys = function(obj, msg){
    if (logLevel == "DEBUG"){
        logKeys(obj, msg);
    }
}

var clone = function(obj){
		if (null == obj || "object" != typeof obj) {
			return obj;
		}
	//return Object.create(obj); // 'clone' by setting obj as prototype	
	return JSON.parse(JSON.stringify(obj)); //deep copy
}

var forceEval = function(expr){
	return expr;
}

var Error = function(key, param) {
	this.errorKey = key;
	// Don't localize the error message, which is only given to callback functions.
	this.errorMessage = key;
		if (param)
			this.errorMessage = this.errorMessage + ' ' + param;
}

var onError = function(msg, url, line) {
	//                     var idx = url.lastIndexOf("/");
	//                     if(idx > -1)
	//                         url = url.substring(idx+1);
		log("ERROR in " + url + " (line #" + line + "): " + msg);

	return false; //suppressErrorAlert;
};

var regOnerror = function() {
    window.onerror = onError;
	log('regOnerror finished');
}

//skip all invalid port: 0, "0", "", null
//skip 80 and 443 if kSkipDefaultPort is set to true
var getPort = function(port, bSkipDefaultPort){
    if ( port == 0 || port == null || port == "" || port =="0" ){
        return "";
    }
    else {
    	if (bSkipDefaultPort){
    		//theoretically if an app uses 80 for https or 443 for http, then we cannot skip the port.
    		//but assume on one will configure the port in that way. So no need to handle the case.
    		if (port == 80 || port == 443){
    			return "";
    		}
    		else{
    			return ":"+port;
    		}
    	}
    	else{
            return ":"+port;		
    	}
    }
}

function booleanValue(value) {
    if (value === "false") {
        return false;
    }
    else if (value === "true") {
        return true;
    }
    else {
        return value;
    }
}

/**
 *  Returns the path in the format /{path}. Any trailing slash will be removed
 */
function formatPath(path) {
    if (path && path.indexOf("/") !== 0) {
        path = "/" + path;
    }

    if (path && path.lastIndexOf("/") === path.length - 1) {
        path = path.substring(0, path.length - 1);
    }

    return path ? path : "";
}

/*
 * Return the base URL to the server with no slash at the end
 * @param registrationContext The registration context
 */
function getBaseServerURL(registrationContext) {
    var urlSuffix = formatPath(registrationContext.resourcePath) + formatPath(registrationContext.farmId === "0" ? "" : registrationContext.farmId);
    var url = (booleanValue(registrationContext.https) ? "https" : "http")
        + "://" + registrationContext.serverHost
        + ((registrationContext.serverPort === 0 || registrationContext.serverPort == "") ? "" : (":" + registrationContext.serverPort))
        + formatPath(urlSuffix);
    return url;
}

module.exports = {
    log: log,
    debug: debug,
    logJSON: logJSON,
    debugJSON: debugJSON,
    logArgs: logArgs,
    debugArgs: debugArgs,
    logKeys: logKeys,
    debugKeys: debugKeys,
    clone: clone,
    forceEval: forceEval,
    Error: Error,
    onError: onError,
    regOnerror: regOnerror,
    getPort: getPort,
    setLogLevel:setLogLevel,
    logPerformanceMessage:logPerformanceMessage,
    logPerformanceMessageSince:logPerformanceMessageSince,
    logPerformanceMessageSinceWithMaxLimit:logPerformanceMessageSinceWithMaxLimit,
    getBaseServerURL: getBaseServerURL
};
               

});

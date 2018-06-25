cordova.define("kapsel-plugin-authproxy.AuthProxy", function(require, exports, module) {
// 4.0.0
var exec = require('cordova/exec');
var oauth2 = require('./oauth2');
var saml2 = require('./saml2');
var otp = require('./otp');
var utils = require('./utils')

/**
 * The AuthProxy plugin provides the ability to make HTTPS requests with mutual authentication.<br/>
 * <br/>
 * The regular XMLHttpRequest does not
 * support mutual authentication.  The AuthProxy plugin allows you to specify a certificate to include in an HTTPS request
 * to identify the client to the server.  This allows the server to verify the identity of the client.  An example of where you
 * might need mutual authenticaion is the onboarding process to register with an application, or, to access an
 * OData producer. This occurs mostly in Business to Business (B2B) applications. This is different from most business to
 * consumer (B2C) web sites where it is only the server that authenticates itself to the client with a certificate.<br/>
 * <br/>
 * <b>Adding and Removing the AuthProxy Plugin</b><br/>
 * The AuthProxy plugin is added and removed using the
 * <a href="http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface">Cordova CLI</a>.<br/>
 * <br/>
 * To add the AuthProxy plugin to your project, use the following command:<br/>
 * cordova plugin add kapsel-plugin-authproxy<br/>
 * <br/>
 * To remove the AuthProxy plugin from your project, use the following command:<br/>
 * cordova plugin rm kapsel-plugin-authproxy
 * @namespace
 * @alias AuthProxy
 * @memberof sap
 */
var AuthProxy = function () {};


/**
 * Constant definitions for registration methods
 */

/**
 * Constant indicating the operation failed with unknown error. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_UNKNOWN = -1;

/**
 * Constant indicating the operation failed due to an invalid parameter (for example, a string was passed where a number was
 * required). Used as a possible value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant 
 * @type number 
 */
AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE = -2;

/**
 * Constant indicating the operation failed because of a missing parameter. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_MISSING_PARAMETER = -3;

/**
 * Constant indicating there is no such Cordova action for the current service.  When a Cordova plugin calls into native
 * code it specifies an action to perform.  If the action provided by the JavaScript is unknown to the native code this
 * error occurs.  This error should not occur as long as authproxy.js is unmodified. Used as a possible
 * value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_NO_SUCH_ACTION = -100;

/**
 * Constant indicating the certificate from file is not supported on the current platform. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_FILE_CERTIFICATE_SOURCE_UNSUPPORTED = -101;

/**
 * Constant indicating the certificate from the system keystore is not supported on the current platform. Used as a possible value
 * for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SYSTEM_CERTIFICATE_SOURCE_UNSUPPORTED = -102;

/**
 * Constant indicating the certificate with the given alias could not be found. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_ALIAS_NOT_FOUND = -104;

/**
 * Constant indicating the certificate file could not be found. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_FILE_NOT_EXIST = -105;

/**
 * Constant indicating incorrect certificate file format.  Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CERTIFICATE_INVALID_FILE_FORMAT = -106;

/**
 * Constant indicating failure in getting the certificate. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_GET_CERTIFICATE_FAILED = -107;

/**
 * Constant indicating the provided certificate failed validation on the server side. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_CLIENT_CERTIFICATE_VALIDATION = -108;

/**
 * Constant indicating the server certificate failed validation on the client side.  This is likely because the server certificate
 * is self-signed, or not signed by a well-known certificate authority.  This constant is used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SERVER_CERTIFICATE_VALIDATION = -109;

/**
 * Constant indicating the server request failed. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_SERVER_REQUEST_FAILED = -110;

/**
 * Constant indicating the logon manager core library is not available.  Getting this error code means you tried
 * to use Logon plugin features (for example, a certificate from Logon) without adding the Logon plugin to the app.
 * A possible value for the errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number
 */
AuthProxy.prototype.ERR_LOGON_MANAGER_CORE_NOT_AVAILABLE = -111;

/**
 * Constant indicating the logon manager certifciate method is not available. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number
 */
AuthProxy.prototype.ERR_LOGON_MANAGER_CERTIFICATE_METHOD_NOT_AVAILABLE = -112;

/**
 * Constant indicating timeout error while connecting to the server. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_HTTP_TIMEOUT = -120;

/**
 * Constant indicating cordova domain whitelist rejection error while sending request to server. Used as a possible value for the
 * errorCode in {@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type number 
 */
AuthProxy.prototype.ERR_DOMAIN_WHITELIST_REJECTION = -121;

/**
 * Constant indicating a missing required parameter message.  Used as a possible value for the description
 * in (@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type string 
 * @private
 */
AuthProxy.prototype.MSG_MISSING_PARAMETER = "Missing a required parameter: ";

/**
 * Constant indicating invalid parameter value message.  Used as a possible value for the description
 * in (@link sap.AuthProxy~errorCallback}.
 * @constant
 * @type string 
 * @private
 */
AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE = "Invalid Parameter Value for parameter: ";

/**
 * Create certificate source description object for a certificate from a keystore file.  The keystore file must be of type PKCS12
 * (usually a .p12 extention) since that is the only certificate file type that can contain a private key (a private key is needed
 * to authenticate the client to the server).  You might want to use this method if you know the desired certificate resides in a
 * file on the filesystem.
 * @class
 * @param {string} Path The Path of the keystore file.<br/>For iOS clients, it first tries to load the 
 *                 relative file path from the application's Documents folder. If it fails, it then tries
 *                 to load the file path from application's main bundle. In addition, before trying 
 *                 to load the certificate from the file system, the iOS client first checks whether the 
 *                 specified certificate key already exists in the key store. If it does, it loads 
 *                 the existing certificate from key store, instead of loading the certificate from 
 *                 file system.<br/>
 *                 For Android clients, the filepath is first treated as an absolute path. If the certificate
 *                 is not found, then the filepath is treated as relative to the root of the sdcard.
 * @param {string} Password The password of the keystore.
 * @param {string} CertificateKey A unique key (aka: alias) that is used to locate the certificate. 
 * @example
 * // Create the certificate source description object.
 * var fileCert = new sap.AuthProxy.CertificateFromFile("directory/certificateName.p12", "certificatePassword", "certificateKey");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, fileCert);
 * 
 */
AuthProxy.prototype.CertificateFromFile = function (Path, Password, CertificateKey) {
    this.Source = "FILE";
    this.Path = Path;
    this.Password = Password;
    this.CertificateKey = CertificateKey;
};

/**
 * Create a certificate source description object for certificates from the system keystore.  You might want to use a certificate
 * from the system keystore if you know the user's device will have the desired certificate installed on it.<br/>
 * On Android, sending a request with a certificate from the system store results in UI being shown for the user to pick
 * the certificate to use (the certificate with the alias matching the given CertificateKey is pre-selected).  If the user
 * selects a certificate with an alias that does not match the given CertificateKey, then (as long as that request succeededs)
 * that certificate will be used for all subsequent requests with the same CertificateFromStore object until the app restarts.
 * When the app restarts, if the same CertificateFromStore object is used, the Android UI will be displayed again
 * (since it is attempting to get a certificate with a matching alias).  If the CertificateKey parameter is not specified,
 * whatever certificate the user selects will be reused without showing the Android UI, even across app restarts.
 * @class
 * @param {string} [CertificateKey] A unique key (aka: alias) that is used to locate the certificate.  
 * @example
 * // Create the certificate source description object.
 * var systemCert = new sap.AuthProxy.CertificateFromStore("certificatekey");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, systemCert);
 */
AuthProxy.prototype.CertificateFromStore = function (CertificateKey) {
    this.Source = "SYSTEM";
    this.CertificateKey = CertificateKey;
};


/**
 * Create a certificate source description object for certificates from logon manager.  Using the resulting certificate source description
 * object on subsequent calls to AuthProxy.sendRequest or AuthProxy.get will cause AuthProxy to retrieve a certificate from Logon Manager
 * to use for client authentication. The appID parameter is used to indicate which application's certificate to use.<br/>
 * Note that to use a certificate from Logon Manager, the application must have already registered with the server using a certificate from Afaria.
 * @class
 * @param {string} appID application identifier
 * @example
 * // Create the certificate source description object.
 * var logonCert = new sap.AuthProxy.CertificateFromLogonManager("applicationID");
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 * // Make the request with the certificate source description object.
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, null, 0, logonCert);
 */
AuthProxy.prototype.CertificateFromLogonManager = function (appID) {
    this.Source = "LOGON";
    this.AppID = appID;
};


/**
 * Verifies that a certificate source description object (created with {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}) has all the required fields and that the values
 * for those fields are the correct type.  This function verifies only the certificate description object, not the certificate itself.  So, for example,
 * if the certificate source description object was created with {@link sap.AuthProxy#CertificateFromFile} and has a String for the filepath and a
 * String for the key/alias, <b>this function considers it valid even if no certificate actually exists on the filesystem</b>.  If the certificate
 * source description object is valid but the certificate itself is not, then an error occurs during the call to {@link sap.AuthProxy#get} or
 * {@link sap.AuthProxy#sendRequest}.
 * @param {object} certSource The certificate source object.
 * @param {sap.AuthProxy~errorCallback} errorCB The error callback invoked if the certificate source is not valid.  Will have an object with 'errorCode'
 * and 'description' properties.
 * @example
 * var notValidCert = {};
 * var errorCallback = function(error){
 *     alert("certificate not valid!\nError code: " + error.errorCode + "\ndescription: " + error.description);
 * }
 * var isCertValid = sap.AuthProxy.validateCertSource(notValidCert, errorCallback);
 * if( isCertValid ){
 *     // do stuff with the valid certificate source description object
 * } else {
 *     // at this point we know the cert is not valid, and the error callback is invoked with extra information.
 * }
 *
 *
 * Developers are not expected to call this function.
 * @private
 */
AuthProxy.prototype.validateCertSource = function (certSource, errorCB) {
    if (!certSource) {
        // The certificate is not present, so just ignore it.
        return true;
    }

    // errorCB required.
    // First check this one. We may need it to return errors
    if (errorCB && (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        return false;
    }

    try {
        // First check whether it is an object
        if (typeof certSource !== "object") {
            errorCB({
                errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
            });
            return false;
        }

        if (certSource.Source === "FILE") {
            if (!certSource.Path) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "keystore path"
                });
                return false;
            }

            if (typeof certSource.Path !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "keystore path"
                });
                return false;
            }

            if (!certSource.CertificateKey) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "certificate key"
                });
                return false;
            }

            if (typeof certSource.CertificateKey !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certificate key"
                });
                return false;
            }
        } else if (certSource.Source === "SYSTEM") {
            // CertificateKey is optional for SYSTEM certificate, so no need to check for it here.
        } else if (certSource.Source === "LOGON") {
            if (!certSource.AppID) {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "AppID"
                });
                return false;
            }

            if (typeof certSource.AppID !== "string") {
                errorCB({
                    errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                    description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "AppID"
                });
                return false;
            }
        } else {
            errorCB({
                errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
                description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
            });
            return false;
        }

        return true;
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "certSource"
        });
    }
};

/**
 * Send an HTTP(S) request to a remote server.  This function is the centerpiece of the AuthProxy plugin.  It will handle
 * mutual authentication if a certificate source is provided.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked.  The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is therefore
 * important to always check the status property on the object given to the success callback.
 * @param {string} method Standard HTTP request method name.
 * @param {string} url The HTTP URL with format http(s)://hostname[:port]/path.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {string} requestBody Data to send to the server with the request. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [authConfig] authentication configuration object.
 * @param {Object} [forCheckReachability] To check server reachability, set the parameter to an object, otherwise setting it to null
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort function).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a post request to the server, call the method
 * var abortFunction = sap.AuthProxy.sendRequest("POST", "http://www.google.com", null, "THIS IS THE BODY", successCB, errorCB);
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a post request to the server with headers, call the method
 * sap.AuthProxy.sendRequest("POST", url, {HeaderName : "Header value"}, "THIS IS THE BODY", successCB, errorCB);
 *
 * // To send a post request to the server with preset basic authentication configuration, call the method
 * var authConfig = {basic:[{type:"preset", data:{user:"myname", password:"mypassword"}}, {type:"user"}]};
 * sap.AuthProxy.sendRequest("POST", url, headers, "THIS IS THE BODY", successCB, errorCB, null, authConfig);
 *
 * // To send a post request to the server with mutual authentication selected by user, call the method
 * var authConfig = {clientcert:[{type:"user"}]};
 * sap.AuthProxy.sendRequest("POST", "https://hostname", null, "THIS IS THE BODY", successCB, errorCB, null, authConfig);
 */
AuthProxy.prototype.sendRequest2 = function (method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability) {

    // errorCB required.
    // First check this one. We may need it to return errors
    if (!errorCB || (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        // if error callback is invalid, throw an exception to notify the caller
        throw new Error("AuthProxy Error: errorCB is not a function");
    }

    // method required
    if (!method) {
        console.log("AuthProxy Error: method is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "method"
        });
        return;
    }


    // We only support GET, POST, HEAD, PUT, DELETE, PATCH method
    if (method !== "GET" && method !== "POST" && method !== "HEAD" && method !== "PUT" && method !== "DELETE" && method !== "PATCH") {
        console.log("Invalid Parameter Value for parameter: " + method);
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "method"
        });
        return;
    }


    // url required
    if (!url) {
        console.log("AuthProxy Error: url is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "url"
        });
        return;
    }


    // successCB required
    if (!successCB) {
        console.log("AuthProxy Error: successCB is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "successCB"
        });
        return;
    }


    if (typeof successCB !== "function") {
        console.log("AuthProxy Error: successCB is not a function");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "successCB"
        });
        return;
    }

    if (timeout && typeof timeout !== "number") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "timeout"
        });
        return;
    }

    //TODO: validate authConfig data

    try {
        var client = new Client2(method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability);
        return client.send();
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_UNKNOWN,
            description: ex.message
        });
    }

};


/**
 * Send an HTTP(S) request to a remote server.  This function is the centerpiece of the AuthProxy plugin.  It will handle
 * mutual authentication if a certificate source is provided.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked.  The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is therefore
 * important to always check the status property on the object given to the success callback.
 * @param {string} method Standard HTTP request method name.
 * @param {string} url The HTTP URL with format http(s)://[user:password]@hostname[:port]/path.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {string} requestBody Data to send to the server with the request. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {string} [user] User ID for basic authentication.
 * @param {string} [password] User password for basic authentication.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [certSource] Certificate description object. It can be one of {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}.
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort function).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * // callbacks
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     alert("Response: " + JSON.stringify(serverResponse.response));
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a post request to the server, call the method
 * var abortFunction = sap.AuthProxy.sendRequest("POST", "http://www.google.com", null, "THIS IS THE BODY", successCB, errorCB);
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a post request to the server with headers, call the method
 * sap.AuthProxy.sendRequest("POST", url, {HeaderName : "Header value"}, "THIS IS THE BODY", successCB, errorCB);
 *
 * // To send a post request to the server with basic authentication, call the method
 * sap.AuthProxy.sendRequest("POST", url, headers, "THIS IS THE BODY", successCB, errorCB, "username", "password");
 *
 * // To send a post request to the server with mutual authentication, call the method
 * sap.AuthProxy.sendRequest("POST", "https://hostname", headers, "THIS IS THE BODY", successCB, errorCB, null, 
 *     null, 0, new sap.AuthProxy.CertificateFromLogonManager("theAppId"));
 */
AuthProxy.prototype.sendRequest = function (method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource) {

    // errorCB required.
    // First check this one. We may need it to return errors
    if (!errorCB || (typeof errorCB !== "function")) {
        console.log("AuthProxy Error: errorCB is not a function");
        // if error callback is invalid, throw an exception to notify the caller
        throw new Error("AuthProxy Error: errorCB is not a function");
    }

    // method required
    if (!method) {
        console.log("AuthProxy Error: method is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "method"
        });
        return;
    }


    // We only support GET, POST, HEAD, PUT, DELETE, PATCH method
    if (method !== "GET" && method !== "POST" && method !== "HEAD" && method !== "PUT" && method !== "DELETE" && method !== "PATCH") {
        console.log("Invalid Parameter Value for parameter: " + method);
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "method"
        });
        return;
    }


    // url required
    if (!url) {
        console.log("AuthProxy Error: url is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "url"
        });
        return;
    }


    // successCB required
    if (!successCB) {
        console.log("AuthProxy Error: successCB is required");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_MISSING_PARAMETER,
            description: AuthProxy.prototype.MSG_MISSING_PARAMETER + "successCB"
        });
        return;
    }


    if (typeof successCB !== "function") {
        console.log("AuthProxy Error: successCB is not a function");
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "successCB"
        });
        return;
    }


    if (user && typeof user !== "string") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "user"
        });
        return;
    }


    if (password && typeof password !== "string") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "password"
        });
        return;
    }


    if (timeout && typeof timeout !== "number") {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_INVALID_PARAMETER_VALUE,
            description: AuthProxy.prototype.MSG_INVALID_PARAMETER_VALUE + "timeout"
        });
        return;
    }

    if (!this.validateCertSource(certSource, errorCB)) {
        return;
    }


    try {
        //convert the sendRequest method to sendRequest2 method for ios client, as the old ios sendRequest
        //method still use nsurlconnection, which does not support the per app proxy config
        //Android client still needs some extra change for basic auth before replacing sendRequest with the new sendRequest2 method
        //windows client does not have sendRequest2 method, so this change only applies to
        if (cordova.require("cordova/platform").id == "ios" ){
            var config = null;
            //first convert basic auth credential if provided
            if (user || password){
                config = {};
                config.basic = [ {} ]; //we must add the first element as it is accessed right after this line.
                config.basic[0].type = "preset";
                config.basic[0].data= {};
                config.basic[0].data.user = user;
                config.basic[0].data.password = password;
            }
            
            if (certSource){
                if (!config){
                    config = {};
                }
                config.clientCert = [ {} ]; //we must add the first element as it is accessed right after this line.
                if (certSource.Source == "FILE"){
                    config.clientCert[0].type = "file";
                    config.clientCert[0].data = {};
                    config.clientCert[0].data.path = certSource.Path;
                    config.clientCert[0].data.password = certSource.Password;
                    config.clientCert[0].data.certificateKey = certSource.CertificateKey;
                }
                else if (certSource.Source == "SYSTEM"){
                    config.clientCert[0].type = "preset";
                    config.clientCert[0].data = {};
                    config.clientCert[0].data.certificateKey = certSource.CertificateKey;
                }
                else if (certSource.Source == "LOGON"){
                    config.clientCert[0].type = "logon";
                    config.clientCert[0].data = {};
                    config.clientCert[0].data.appid = certSource.AppID;
                }
            }
            return this.sendRequest2(method, url, header, requestBody, successCB, errorCB, timeout, config, false);
        }
        else{
            //windows and android client still uses old version of sendRequest
            var client = new Client(method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource);
            return client.send();
        }
    } catch (ex) {
        errorCB({
            errorCode: AuthProxy.prototype.ERR_UNKNOWN,
            description: ex.message
        });
    }

};

/**
 * Send an HTTP(S) GET request to a remote server.  This is a convenience function that simply calls {@link sap.AuthProxy#sendRequest}
 * with "GET" as the method and null for the request body.  All given parameters are passed as-is to sap.AuthProxy.sendRequest.
 * The success callback is invoked upon any response from the server.  Even responses not generally considered to be
 * successful (such as 404 or 500 status codes) will result in the success callback being invoked. The error callback
 * is reserved for problems that prevent the AuthProxy from creating the request or contacting the server.  It is, therefore,
 * important to always check the status property on the object given to the success callback.
 * @param {string} url The URL against which to make the request.
 * @param {Object} header HTTP header to send to the server. This is an Object. Can be null.
 * @param {sap.AuthProxy~successCallback} successCB Callback method invoked upon a response from the server.
 * @param {sap.AuthProxy~errorCallback} errorCB Callback method invoked in case of failure.
 * @param {string} [user] User ID for basic authentication.
 * @param {string} [password] User password for basic authentication.
 * @param {number} [timeout] Timeout setting in seconds.  Default timeout is 60 seconds.  A value of 0 means there is no timeout.
 * @param {Object} [certSource] Certificate description object. It can be one of {@link sap.AuthProxy#CertificateFromFile},
 * {@link sap.AuthProxy#CertificateFromStore}, or {@link sap.AuthProxy#CertificateFromLogonManager}.
 * @return {function} A JavaScript function object to abort the operation.  Calling the abort function results in neither the success or error
 * callback being invoked for the original request (excepting the case where the success or error callback was invoked before calling the
 * abort functino).  Note that the request itself cannot be unsent, and the server will still receive the request - the JavaScript will just
 * not know the results of that request.
 * @example
 * var successCB = function(serverResponse){
 *     alert("Status: " + JSON.stringify(serverResponse.status));
 *     alert("Headers: " + JSON.stringify(serverResponse.headers));
 *     if (serverResponse.responseText){
 *         alert("Response: " + JSON.stringify(serverResponse.responseText));
 *     }
 * }
 * var errorCB = function(errorObject){
 *     alert("Error making request: " + JSON.stringify(errorObject));
 * }
 *
 * // To send a GET request to server, call the method
 * var abortFunction = sap.AuthProxy.get("http://www.example.com", null, successCB, errorCB);
 *
 * // An example of aborting the request
 * abortFunction();
 *
 * // To send a GET request to the server with headers, call the method
 * sap.AuthProxy.get("http://www.example.com", {HeaderName : "Header value"}, successCB, errorCB);
 *
 * // To send a GET request to the server with basic authentication, call the method
 * sap.AuthProxy.get("https://www.example.com", headers, successCB, errorCB, "username", "password");
 *
 * // To send a GET request to the server with mutual authentication, call the method
 * sap.AuthProxy.get("https://www.example.com", headers, successCB, errorCB, null, null, 0, 
 *     new sap.AuthProxy.CertificateFromLogonManager("theAppId"));
 */
AuthProxy.prototype.get = function (url, header, successCB, errorCB, user, password, timeout, certSource) {
    return this.sendRequest("GET", url, header, null, successCB, errorCB, user, password, timeout, certSource);
};

/**
 * Delete a cached certificate from the keychain. iOS clients always checks the cached certificate first to see if it is available before 
 * loading the certificate from the file system. If the cached certificate is no longer valid, use this method to delete it from the keychain.
 * <br/><b>Only supported on iOS platform, NOT Android.</b> 
 * @param {sap.AuthProxy~deleteCertificateSuccessCallback} successCB Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} [errorCB] Callback method upon failure.
 * @param {string} certificateKey The key of the certificate to be deleted.
 * @example
 * var successCB = function(){
 *     alert("certificate successfully deleted.");
 * }
 * var errorCB = function(error){
 *     alert("error deleting certificate: " + JSON.stringify(error));
 * }
 * sap.AuthProxy.deleteCertificateFromStore(successCB, errorCB, "certificateKeyToDelete");
 */
AuthProxy.prototype.deleteCertificateFromStore = function (successCB, errorCB, certificateKey) {
    cordova.exec(successCB, errorCB, "AuthProxy", "deleteCertificateFromStore", [certificateKey]);
};

/**
 * set configuration for automatically select client certificate
 * <br/><b>Only supported on iOS platform, NOT Android.</b>
 * @param {sap.AuthProxy~successCallback} successCB Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} [errorCB] Callback method upon failure.
 * @param {bool} autoSelectSingleCert - enable or disable automatically select the single client certificate
 * @param {string} authproxyKeychainGroup - optional parameter to specify the keychain group used to load the client certificate. 
 * The values of this parameter can be set as: 
 *      all: loading client cert from all keychain groups;
 *      self: loading client cert only from the default keychain group;
 *      none: do not loading client cert by authproxy
 * @example
 * var successCB = function(){
 *     console.log("setAutoSelectCertificateConfig called successfully.");
 * }
 * var errorCB = function(error){
 *     console.log("error calling setAutoSelectCertificateConfig: " + JSON.stringify(error));
 * }
 * sap.AuthProxy.setAutoSelectCertificateConfig(successCB, errorCB, enableAutoSelectSingleCert);
 */
AuthProxy.prototype.setAutoSelectCertificateConfig = function (successCB, errorCB, enableAutoSelectSingleCert, authproxyKeychainGroup) {
    if (cordova.require("cordova/platform").id == "ios"){
        var param = [enableAutoSelectSingleCert];
        if (authproxyKeychainGroup){
            param.push(authproxyKeychainGroup);
        }
        cordova.exec(successCB, errorCB, "AuthProxy", "setAutoSelectCertificateConfig", param);
    }
    else{
        successCB();
    }
};

/**
 * @private
 */
 
var Client2 = function (method, url, header, requestBody, successCB, errorCB, timeout, authConfig, forCheckReachability) {
    this.Method = method;
    this.Url = url;
    this.Header = header;
    this.RequestBody = requestBody;
    this.SuccessCB = successCB;
    this.ErrorCB = errorCB;
    this.Timeout = timeout;
    this.authConfig = authConfig;
    this.IsAbort = false;
    this.forCheckReachability = forCheckReachability;

    this.abort = function () {
        this.IsAbort = true;
    };

    this.send = function () {
        var me = this;
        
        me.firstAttempt = true;
        me.attemptedOtp = false;

        var execSendRequest = function () {
            //ios plugin parameter does not support object type, convert Header and CertSource to JSON string
            var argHeader = me.Header;
            var argAuthConfig = me.authConfig;

            if (cordova.require("cordova/platform").id == "ios") {
                if (argHeader) {
                    argHeader = JSON.stringify(argHeader);
                }
                if (argAuthConfig) {
                    argAuthConfig = JSON.stringify(argAuthConfig);
                }
            }

            var args = [me.Method, me.Url, argHeader, me.RequestBody, me.Timeout, argAuthConfig, me.forCheckReachability];

            exec(successCallBack, errorCallBack, "AuthProxy", "sendRequest2", args);
        }

        var successCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            if (me.firstAttempt && oauth2.isChallenge(data)) {
                oauth2.authenticate(function(token) {
                    if (token && token.access_token) {
                        // Send request again with token
                        me.firstAttempt = false;
                        me.Header = utils.updateHeader( "Authorization", "Bearer " + token.access_token, me.Header);
                        execSendRequest();
                    }
                    else {
                        successCB(data);
                    }
                }, function(error) {
                    // Return original response
                    successCB(data);
                });
            }
            else if (me.firstAttempt && saml2.isChallenge(data)) {
                saml2.authenticate(function() {
                    // Send request again
                    me.firstAttempt = false;
                    execSendRequest();
                }, function(error) {
                    // Return original response
                    successCB(data);
                });
            }
            else if (!me.attemptedOtp && otp.isChallenge(data)) {
                otp.authenticate(function(){
                    // Send request again
                    me.attemptedOtp = true;
                    execSendRequest();
                }, function(error) {
                    // Return original response
                    successCB(data);
                }, data.responseURL);
            }
            else {
                successCB(data);
            }
        };

        var errorCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            errorCB(data);
        };

        if (oauth2.isProtectedEndpoint(me.Url)) {
            oauth2.getToken(function(token) {
                if (token && token.access_token) {
                    me.Header = utils.updateHeader( "Authorization", "Bearer " + token.access_token, me.Header);
                }
                execSendRequest();
            });
        }
        else {
            execSendRequest();
        }

        return this.abort;
    };
};


var Client = function (method, url, header, requestBody, successCB, errorCB, user, password, timeout, certSource) {
    this.Method = method;
    this.Url = url;
    this.Header = header ;
    this.RequestBody = requestBody;
    this.SuccessCB = successCB;
    this.ErrorCB = errorCB;
    this.User = user;
    this.Password = password;
    this.Timeout = timeout;
    this.CertSource = certSource;
    this.IsAbort = false;

    this.abort = function () {
        this.IsAbort = true;
    };

    this.send = function () {
        var me = this;

        me.firstAttempt = true;

        var execSendRequest = function() {
            //ios plugin parameter does not support object type, convert Header and CertSource to JSON string
            var argHeader = me.Header;
            var argCertSource = me.CertSource;

            if (cordova.require("cordova/platform").id == "ios") {
                if (argHeader) {
                    argHeader = JSON.stringify(argHeader);
                }
                if (argCertSource) {
                    argCertSource = JSON.stringify(argCertSource);
                }
            }

            var args = [me.Method, me.Url, argHeader, me.RequestBody, me.User, me.Password, me.Timeout, argCertSource];

            exec(successCallBack, errorCallBack, "AuthProxy", "sendRequest", args);
        }

        var successCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            if (me.firstAttempt) {
                if (oauth2.isChallenge(data)) {
                    oauth2.authenticate(function(token) {
                        if (token && token.access_token) {
                            // Send request again with token
                            me.firstAttempt = false;
                            me.Header = utils.updateHeader( "Authorization", "Bearer " + token.access_token, me.Header);
                            execSendRequest();
                        }
                        else {
                            successCB(data);
                        }
                    }, function(error) {
                        // Return original response
                        successCB(data);
                    });
                }
                else if (saml2.isChallenge(data)) {
                    saml2.authenticate(function() {
                        // Send request again
                        me.firstAttempt = false;
                        execSendRequest();
                    }, function(error) {
                        // Return original response
                        successCB(data);
                    });
                }
                else {
                    successCB(data);
                }
            }
            else {
                successCB(data);
            }
        };

        var errorCallBack = function (data) {
            if (me.IsAbort === true) {
                return;
            }

            errorCB(data);
        };

        if (oauth2.isProtectedEndpoint(me.Url)) {
            oauth2.getToken(function(token) {
                if (token && token.access_token) {
                    me.Header = utils.updateHeader( "Authorization", "Bearer " + token.access_token, me.Header);
                }
                execSendRequest();
            });
        }
        else {
            execSendRequest();
        }

        return this.abort;
    };
};

/**
 * Generates an OData client that uses the AuthProxy plugin to make requests.  This is useful if you are using Datajs, but want
 * to make use of the certificate features of AuthProxy.  Datajs is a javascript library useful for accessing OData services.
 * Datajs has a concept of an HttpClient, which does the work of making the request.  This function generates an HttpClient that
 * you can specify to Datajs so you can provide client certificates for requests.  If you want to use the generated HTTP client
 * for all future Datajs requests, you can do that by setting the OData.defaultHttpClient property to the return value of this
 * function.  Once that is done, then doing OData stuff with Datajs is almost exactly the same, but you can add a
 * certificateSource to a request.
 * @example
 * OData.defaultHttpClient = sap.AuthProxy.generateODataHttpClient();
 *
 * // Using a certificate from file, for example.
 * fileCert = new sap.AuthProxy.CertificateFromFile("mnt/sdcard/cert.p12", "password", "certKey");
 *
 * // This is the same request object you would have created if you were just using Datajs, but now
 * // you can add the extra 'certificateSource' property.
 * var createRequest = {
 *     requestUri: "http://www.example.com/stuff/etc/example.svc",
 *     certificateSource : fileCert,
 *     user : "username",
 *     password : "password",
 *     method : "POST",
 *     data:
 *     {
 *          Description: "Created Record",
 *          CategoryName: "Created Category"
 *     }
 * }
 *
 * // Use Datajs to send the request.
 * OData.request( createRequest, successCallback, failureCallback );
 * 
 */
AuthProxy.prototype.generateODataHttpClient = function () {
   var httpClient = {
        request: function (request, success, error) {
            var url, requestHeaders, requestBody, statusCode, statusText, responseHeaders;
            var responseBody, requestTimeout, requestUserName, requestPassword, requestCertificate;
            var client, result;

            url = request.requestUri;
            requestHeaders = request.headers;
            requestBody = request.body;

            var successCB = function (data) {
                var response = {
                    requestUri: url,
                    statusCode: data.status,
                    statusText: data.status,
                    headers: data.headers,
                    body: (data.responseText ? data.responseText : data.responseBase64)
                };

                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    if (success) {
                        success(response);
                    }
                } else {
                    if (error) {
                        error({
                            message: "HTTP request failed",
                            request: request,
                            response: response
                        });
                    }
                }
            };

            var errorCB = function (data) {
                if (error) {
                    error({
                        message: data
                    });
                }
            };

            if (request.timeoutMS) {
                requestTimeout = request.timeoutMS / 1000;
            }

            if (request.certificateSource) {
                requestCertificate = request.certificateSource;
            }

            if (request.user) {
                requestUserName = request.user;
            }

            if (request.password) {
                requestPassword = request.password;
            }

            client = AuthProxy.prototype.sendRequest(request.method || "GET", url, requestHeaders, requestBody, successCB, errorCB, requestUserName, requestPassword, requestTimeout, requestCertificate);

            result = {};
            result.abort = function () {
                client.abort();

                if (error) {
                    error({
                        message: "Request aborted"
                    });
                }
            };
            return result;
        }
    };
    return httpClient;
};

/**
 * Generates an OData client that uses the AuthProxy plugin's sendRequest2 method. This method is similar to 
 * sap.AuthProxy.generateODataHttpClient, but it replaces user, password, and certificateSource parameters 
 * with the new authConfig parameter as required by Authproxy's sendRequest2 method.
 
 * @example
 * OData.defaultHttpClient = sap.AuthProxy.generateODataHttpClient2();
 *
 * The below sample use a certificate from file, and a preset user and password.
 * var request = {
 *                   authConfig : {basic:
 *                                   [
 *                                      {type:"preset", data:{user:"smptester", password:"SMP_t3st3r"}}
 *                                   ],
 *                                 clientCert:
 *                                   [
 *                                       {type: "file", data: { path:"cert.p12", password:"password$", certificateKey:"client"}}
 *                                   ]
 *                                 },
 *                   requestUri : "http://www.example.com/stuff/etc/example.svc",
 *                   method : "GET"
 *   };
 *   odatajs.oData.request(request, successCallback, errorCallback, null, httpClient);

 
 * The below sample use a certificate from file, and allow user to input credential at runtime.
 * var request = {
 *                   authConfig : {basic:
 *                                   [
 *                                       {type:"user"}
 *                                   ],
 *                                 clientCert:
 *                                   [
 *                                       {type: "file", data: { path:"cert.p12", password:"password$", certificateKey:"client"}}
 *                                   ]
 *                                 },
 *                   requestUri : "http://www.example.com/stuff/etc/example.svc",
 *                   method : "GET"
 *   };
 *   odatajs.oData.request(request, successCallback, errorCallback, null, httpClient);
 * 
 */

AuthProxy.prototype.generateODataHttpClient2 = function () {
   var httpClient = {
        request: function (request, success, error) {
            var url, requestHeaders, requestBody, statusCode, statusText, responseHeaders;
            var responseBody, requestTimeout, requestAuthConfig;
            var client, result;

            url = request.requestUri;
            requestHeaders = request.headers;
            requestBody = request.body;

            var successCB = function (data) {
                var response = {
                    requestUri: url,
                    statusCode: data.status,
                    statusText: data.status,
                    headers: data.headers,
                    body: (data.responseText ? data.responseText : data.responseBase64)
                };

                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    if (success) {
                        success(response);
                    }
                } else {
                    if (error) {
                        error({
                            message: "HTTP request failed",
                            request: request,
                            response: response
                        });
                    }
                }
            };

            var errorCB = function (data) {
                if (error) {
                    error({
                        message: data
                    });
                }
            };

            if (request.timeoutMS) {
                requestTimeout = request.timeoutMS / 1000;
            }

            if (request.authConfig) {
                requestAuthConfig = request.authConfig;
            }


            client = AuthProxy.prototype.sendRequest2(request.method || "GET", url, requestHeaders, requestBody, successCB, errorCB, requestTimeout, requestAuthConfig);

            result = {};
            result.abort = function () {
                client.abort();

                if (error) {
                    error({
                        message: "Request aborted"
                    });
                }
            };
            return result;
        }
    };
    return httpClient;
};


AuthProxy.prototype.addLogonCookiesToWebview = function(successCallback, errorCallback, url) {
	// The native function should only be invoked on Android
	if (device.platform.toLowerCase().indexOf("android") >= 0) {
		exec(successCallback, errorCallback, "AuthProxy", "putLogonCookiesIntoWebview", [url]);
	} else {
		// The cookies are handled properly on iOS without calling this function, so call the success callback anyway.
		successCallback();
	}
}

AuthProxy.prototype.getSAMLCookiesFromWebview = function(successCallback, errorCallback, url) {
	// The native function should only be invoked on Android
	if (device.platform.toLowerCase().indexOf("android") >= 0) {
		exec(successCallback, errorCallback, "AuthProxy", "getSAMLCookiesFromWebview", [url]);
	} else {
		// This function is only needed on Android.  If it is called on another
		// platform that means something went wrong.
		errorCallback();
	}
}

/**
 * This method is used for handling SAML challenges and only applies to XMLHttpRequest requests.
 * @public
 * @memberof sap.AuthProxy
 * @method setSAMLChallengeHandler
 * @param {sap.AuthProxy~successCallback} successCallback Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} errorCallback Callback method upon failure.
 * @param {sap.AuthProxy~samlChallengeCallback} samlChallengeCallback Callback method upon SAML challenge.
 * @param {Object} samlConfig Configuration for SAML authentication.
 * @example
 * // Below is a sample context variable from which the samlConfig is defined.
 * var context = {
 *   "serverHost" = "example.com",
 *   "https" : "true",
 *   "serverPort" : "8081",
 *   "auth": [ {
 *       "type": "saml2.web.post",
 *       "config": {
 *           "saml2.web.post.authchallengeheader.name": "com.sap.cloud.security.login",
 *           "saml2.web.post.finish.endpoint.uri": "/SAMLAuthLauncher",
 *           "saml2.web.post.finish.endpoint.redirectparam": "finishEndpointParam"
 *       }
 *   } ]
 * };
 *
 * // callbacks
 * var successCallback = function(serverResponse){
 *   console.log("EventLogging: setSAMLChallengeHandler");
 * }
 * var errorCallback = function(errorObject){
 *   console.log("EventLogging: failed to setSAMLChallengeHandler");
 * }
 * var mySAMLHandler = function(url){
 *   console.log("EventLogging: mySAMLHandler with request url " + url);
 * }
 * sap.AuthProxy.setSAMLChallengeHandler(successCallback, errorCallback, mySAMLHandler, context.auth[0].config); 
 * @instance
 * @deprecated
 */

AuthProxy.prototype.setSAMLChallengeHandler = function(successCallback, errorCallback, samlChallengeCallback, samlConfig) {
    if (successCallback) {
        successCallback();
    }
}

var openModified = false;

// Get any HTTPS conversion hosts from Android native side.
document.addEventListener("deviceready", function() {
    if (cordova.require("cordova/platform").id == "ios"){
        (function() {
            var originalOpen = window.XMLHttpRequest.prototype.open;
         
            window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                originalOpen.apply(this, arguments);
                if (user != null && password != null) {
                    this.setRequestHeader("XhrOpenWithCredential", btoa(user)+":"+btoa(password));
                }
            };
         })();
    }
});

// Helper function that uses DOM to extract the Host from a url.
var extractHostFromUrl = function(urlString) {
    var aElement = document.createElement("a");
    aElement.href = urlString;
    return aElement.hostname;
}

/**
 * Clears the client certificate preferences stored in response to proceeding/cancelling client cert requests.
 * Only available for Android.
 * @param {sap.AuthProxy~successCallback} successCallback Callback method upon success.
 * @param {sap.AuthProxy~errorCallback} errorCallback Callback method upon failure.
 */
AuthProxy.prototype.clearClientCertPreferences  = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "AuthProxy", "clearClientCertPreferences", []);
}

var AuthProxyPlugin = new AuthProxy();

module.exports = AuthProxyPlugin;


/**
 * Callback function that is invoked in case of an error.
 *
 * @callback sap.AuthProxy~errorCallback
 *
 * @param {Object} errorObject An object containing two properties: 'errorCode' and 'description.'
 * The 'errorCode' property corresponds to one of the {@link sap.AuthProxy} constants.  The 'description'
 * property is a string with more detailed information of what went wrong.
 *
 * @example
 * function errorCallback(errCode) {
 *    //Set the default error message. Used if an invalid code is passed to the
 *    //function (just in case) but also to cover the
 *    //sap.AuthProxy.ERR_UNKNOWN case as well.
 *    var msg = "Unkown Error";
 *    switch (errCode) {
 *       case sap.AuthProxy.ERR_INVALID_PARAMETER_VALUE:
 *          msg = "Invalid parameter passed to method";
 *          break;
 *       case sap.AuthProxy.ERR_MISSING_PARAMETER:
 *          msg = "A required parameter was missing";
 *          break;
 *       case sap.AuthProxy.ERR_HTTP_TIMEOUT:
 *          msg = "The request timed out";
 *          break;
 *    };
 *    //Write the error to the log
 *    console.error(msg);
 *    //Let the user know what happened
 *    navigator.notification.alert(msg, null, "AuthProxy Error", "OK");
 * };
 */

/**
 * Callback function that is invoked upon a response from the server.
 *
 * @callback sap.AuthProxy~successCallback
 *
 * @param {Object} serverResponse An object containing the response from the server.  Contains a 'headers' property,
 * a 'status' property, and a 'responseText' property.<br/>
 * 'headers' is an object containing all the headers in the response.<br/>
 * 'status' is an integer corresponding to the HTTP status code of the response.  It is important to check the status of
 * the response, since <b>this success callback is invoked upon any response from the server</b> - including responses that are
 * not normally thought of as successes (for example, the status code could be 404 or 500).<br/>
 * 'responseText' is a string containing the body of the response.
 */

/**
 * Callback function that is invoked upon successfully deleting a certificate from the store.
 *
 * @callback sap.AuthProxy~deleteCertificateSuccessCallback
 */

/**
 * Callback function that is invoked when the server indicates to the client that there is a SAML challenge.
 *
 * @callback sap.AuthProxy~samlChallengeCallback
 *
 * @param {string} url The request url.<br/>
 */

});

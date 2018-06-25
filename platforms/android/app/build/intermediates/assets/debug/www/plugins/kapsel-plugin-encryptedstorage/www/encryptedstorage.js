cordova.define("kapsel-plugin-encryptedstorage.Encrypted", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    exec = require("cordova/exec");

/**
 * The EncryptedStorage class is used as a secure local store.  The EncryptedStorage API is based on the
 * W3C web storage API, but it is asynchronous.<br/>
 * <br/>
 * If the datavault managed by the Logon plugin gets deleted (eg: the user forgets their passcode), then all
 * encrypted stores will also be deleted.
 * <br/>
 * <br/>
 * <b>Adding and Removing the EncryptedStorage Plugin</b><br/>
 * The EncryptedStorage plugin is added and removed using the
 * <a href="http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface">Cordova CLI</a>.<br/>
 * <br/>
 * To add the EncryptedStorage plugin to your project, use the following command:<br/>
 * cordova plugin add kapsel-plugin-encryptedstorage<br/>
 * <br/>
 * To remove the EncryptedStorage plugin from your project, use the following command:<br/>
 * cordova plugin rm kapsel-plugin-encryptedstorage
 * @namespace
 * @alias EncryptedStorage
 * @memberof sap
 * @param {String} storeName The name of the store to create.  All stores with different names
 * act independently, while stores with the same name act as the same store.
 * If null or undefined is passed, an empty string is used.
 * @param {String} password The name of the store password. For ios, the store password is automatically managed by Logon plugin, and this parameter is ignored 
 */
EncryptedStorage = function(storeName, password) {
    // private variables
    var that = this;

    var storeName = storeName ? storeName : "";
    var password = password ? password : null;

    var createCallbackHandler = function(outsideCallback) {
        return function(result) {
            // Check if the result was passed as a JSON object of the form
            // {"result": string}
            // This is necessary because on Android null values sometimes get converted
            // to empty strings by the Cordova bridge (see https://issues.apache.org/jira/browse/CB-12218)
			if (outsideCallback) {
				if (result && result.hasOwnProperty("result")) {
					outsideCallback(result.result);
				} else {
					outsideCallback(result);
				}
			}
        }
    }

    // privileged functions

    /**
     * This function gets the length of the store.  The length of a store
     * is the number of key/value pairs that are in the store.
     * @param {sap.EncryptedStorage~lengthSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the length of the store as
     * the parameter.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function length
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(length) {
     *    alert("Length is " + length);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.length(successCallback, errorCallback);
     */

    this.length = function(successCallback, errorCallback) {
        try {
            argscheck.checkArgs('FF', 'EncryptedStorage.length', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, 'EncryptedStorage',
            "length", [storeName, password]);
    }

    /**
     * This function gets the key corresponding to the given index.
     * @param {number} index The index of the store for which to get the key.
     * Valid indices are integers from zero (the first index), up to, but not including,
     * the length of the store.  If the index is out of bounds, then the success
     * callback is invoked with null as the parameter.
     * @param {sap.EncryptedStorage~keySuccessCallback} successCallback If successful,
     * the successCallback is invoked with the key as the parameter.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function key
     * @instance
     * @example
     * // This example shows how to get the key for the last item.
     * var store = new sap.EncryptedStorage("storeName");
     * var errorCallback = function( error ){
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * var keySuccessCallback = function(key) {
     *    alert("Last key is " + key);
     * }
     * var lengthSuccessCallback = function(length) {
     *    store.key(length - 1, keySuccessCallback, errorCallback);
     * }
     * store.length(lengthSuccessCallback, errorCallback);
     */
    this.key = function(index, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('NFF', 'EncryptedStorage.key', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(createCallbackHandler(successCallback), errorCallback, "EncryptedStorage",
            "key", [storeName, index, password]);
    }

    /**
     * This function gets the value corresponding to the given key.  If there is no
     * item with the given key, then the success callback is invoked with null as
     * the parameter.
     * @param {String} key The key of the item for which to get the value.  If null or undefined is
     * passed, "null" is used.
     * @param {sap.EncryptedStorage~getItemSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the value as the parameter (or null if the key
     * did not exist).
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function getItem
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(value) {
     *    alert("Value is " + value);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.getItem("theKey", successCallback, errorCallback);
     */
    this.getItem = function(key, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SFF', 'EncryptedStorage.getItem', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(createCallbackHandler(successCallback), errorCallback, "EncryptedStorage",
            "getItem", [storeName, key, password]);
    }

    /**
     * This function sets an item with the given key and value.  If no item exists with
     * the given key, then a new item is created.  If an item does exist with the
     * the given key, then its value is overwritten with the given value.
     * @param {String} key The key of the item to set.  If null or undefined is passed,
     * "null" is used.
     * @param {String} value The value of the item to set.  If null or undefined is passed,
     * "null" is used.
     * @param {sap.EncryptedStorage~successCallback} successCallback If successful,
     * the successCallback is invoked with no parameters.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function setItem
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function() {
     *    alert("Item has been set.");
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.setItem("somekey", "somevalue", successCallback, errorCallback);
     */
    this.setItem = function(key, value, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SSFF', 'EncryptedStorage.setItem', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "setItem", [storeName, key, value, password]);
    }

    /**
     * This function removes the item corresponding to the given key.  If there is no
     * item with the given key in the first place, that is still counted as a success.
     * @param {String} key The key of the item to remove.  If null or undefined is
     * passed, "null" is used.
     * @param {sap.EncryptedStorage~successCallback} successCallback If successful,
     * the successCallback is invoked with no parameters.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function removeItem
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function() {
     *    alert("Value removed");
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.removeItem("somekey", successCallback, errorCallback);
     */
    this.removeItem = function(key, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SFF', 'EncryptedStorage.removeItem', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "removeItem", [storeName, key, password]);
    }

    /**
     * This function removes all items from the store.  If there are no
     * items in the store in the first place, that is still counted as a success.
     * @param {sap.EncryptedStorage~successCallback} successCallback If successful,
     * the successCallback is invoked with no parameters.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function clear
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function() {
     *    alert("Store cleared!");
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify();
     * }
     * store.clear(successCallback, errorCallback);
     */
    this.clear = function(successCallback, errorCallback) {
        try {
            argscheck.checkArgs('FF', 'EncryptedStorage.clear', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "clear", [storeName, password]);
    }

    /**
     * Due to changes in the implementation of EncryptedStorage, calling this function
     * is exactly equivalent to calling {@link EncryptedStorage.clear}.
     *
     * @param {sap.EncryptedStorage~successCallback} successCallback If successful,
     * the successCallback is invoked with no parameters.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function deleteStore
     * @example
     * var successCallback = function() {
     *    alert("Store deleted!");
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify();
     * }
     * ks = new sap.EncryptedStorage("storename");
     * ks.deleteStore(successCallback, errorCallback);
     */
    this.deleteStore = function(successCallback, errorCallback) {
        try {
            argscheck.checkArgs('FF', 'EncryptedStorage.deleteStore', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "deleteStore", [storeName, password]);
    }
    
    /**
     * This function gets the encrypted file path corresponding to the given path.
     * @param {String} path The path of the decrypted file for which to encrypt.
     * @param {String} a base-64 encoded byte array of length 16, 24, or 32.
     * @param {sap.EncryptedStorage~encryptFileSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the path to the encrypted file as the parameter
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function encryptFile
     * @instance
     * @private
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(encryptedFilePath) {
     *    alert("Encrypted file path is " + encryptedFilePath);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.encryptFile("decryptedFilePath", successCallback, errorCallback);
     */
    this.encryptFile = function(path, encryptionKey, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SSFF', 'EncryptedStorage.encryptFile', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "encryptFile", [path, encryptionKey]);
    }

    /**
     * This function gets the decrypted file path corresponding to the given path.
     * @param {String} path The path of the encrypted file for which to decrypt.
     * @param {String} a base-64 encoded byte array of length 16, 24, or 32.
     * @param {sap.EncryptedStorage~decryptFileSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the path to the decrypted file as the parameter
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function decryptFile
     * @instance
     * @private
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(decryptedFilePath) {
     *    alert("Decrypted file path is " + decryptedFilePath);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.decryptFile("encryptedFilePath", successCallback, errorCallback);
     */
    this.decryptFile = function(path, encryptionKey, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SSFF', 'EncryptedStorage.decryptFile', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "decryptFile", [path, encryptionKey]);
    }

    /**
     * This function encrypts the file at the given path and writes a new encrypted file.
     * @param {String} path The path of the input file for which to encrypt. For ios, it can be file URL (starting with "file"//") or
     *      file full path (starting with "/").
     * @param {String} outputPath The file path or file URL of the encrypted output file. If the parameter is set to null or empty string, then the output file
     *      is saved in the same folder as input file with ".encr" appended to the input filename. If the output file already exists, it will be
     *      deleted first before creating the output file. path and outputPath parameters cannot set to the same value.
     * @param {sap.EncryptedStorage~encryptFileSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the path to the encrypted file path (starting with "/") as the parameter.
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function encryptFileWithStorePassword
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(encryptedFilePath) {
     *    alert("Encrypted file path is " + encryptedFilePath);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.encryptFileWithStorePassword("decryptedFilePath", null, successCallback, errorCallback);
     */
    this.encryptFileWithStorePassword = function(path, outputPath, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SSFF', 'EncryptedStorage.encryptFile', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        if ( path == outputPath ){
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }
        
        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "encryptFileWithPassword", [storeName, path, outputPath, password]);
    }

    /**
     * This function decrypts the file at the given path and writes a new decrypted file.
     * @param {String} path The path of the input file for which to decrypt. For ios, it can be file URL (starting with "file"//") or
     *      file full path (starting with "/").
     * @param {String} outputPath The file path or file URL of the decrypted output file. If the parameter is set to null or empty string, then the output
     *      file is saved in the same folder as input file with the last file extention removed from the input filename. If the output file
     *      already exists, it will be deleted first before creating the output file. path and outputPath parameters cannot have the same value.
     * @param {sap.EncryptedStorage~decryptFileSuccessCallback} successCallback If successful,
     * the successCallback is invoked with the path to the decrypted file (starting with "/") as the parameter
     * @param {sap.EncryptedStorage~errorCallback} errorCallback If there is an error,
     * the errorCallback is invoked with an ErrorInfo object as the parameter.
     * @memberof sap.EncryptedStorage
     * @function decryptFileWithStorePassword
     * @instance
     * @example
     * var store = new sap.EncryptedStorage("storeName");
     * var successCallback = function(decryptedFilePath) {
     *    alert("Decrypted file path is " + decryptedFilePath);
     * }
     * var errorCallback = function(error) {
     *    alert("An error occurred: " + JSON.stringify(error));
     * }
     * store.decryptFileWithStorePassword("encryptedFilePath", null, successCallback, errorCallback);
     */
    this.decryptFileWithStorePassword = function(path, outputPath, successCallback, errorCallback) {
        try {
            argscheck.checkArgs('SSFF', 'EncryptedStorage.decryptFile', arguments);
        } catch (ex) {
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }
        
        if ( path == outputPath ){
            errorCallback(this.ERROR_INVALID_PARAMETER);
            return;
        }

        cordova.exec(successCallback, errorCallback, "EncryptedStorage",
            "decryptFileWithPassword", [storeName, path, outputPath, password]);
    }

};

// Error codes
/**
 * This error code indicates an unknown error occurred.
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_UNKNOWN
 * @constant
 */
EncryptedStorage.prototype.ERROR_UNKNOWN = 0;
/**
 * This error code indicates an invalid parameter was provided.
 * (eg: a string given where a number was required).
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_INVALID_PARAMETER
 * @constant
 */
EncryptedStorage.prototype.ERROR_INVALID_PARAMETER = 1;
/**
 * This error code indicates a wrong password was provided
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_BAD_PASSWORD
 * @constant
 */
EncryptedStorage.prototype.ERROR_BAD_PASSWORD = 2;
/**
 * This error indicates that the datavault managed by the Logon plugin is locked.
 * the Logon plugin must be in an unlocked state to use the EncryptedStorage plugin.
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_DATAVAULT_LOCKED
 * @constant
 */
EncryptedStorage.prototype.ERROR_DATAVAULT_LOCKED = 4;
/**
 * This error indicates that the SQLite database error.
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_DB_ERROR
 * @constant
 */
EncryptedStorage.prototype.ERROR_DB_ERROR = 5;

/**
 * This error indicates that the data vault access error.
 * @memberof sap.EncryptedStorage
 * @name sap.EncryptedStorage#ERROR_DATAVAULT_ACCESS_ERROR
 * @constant
 */
EncryptedStorage.prototype.ERROR_DATAVAULT_ACCESS_ERROR = 6;

module.exports = EncryptedStorage;


/**
 * Callback function that is invoked on a successful call to a function that does
 * not need to return anything.
 *
 * @callback sap.EncryptedStorage~successCallback
 */

/**
 * Callback function that is invoked on a successful call to {@link EncryptedStorage.length}.
 *
 * @callback sap.EncryptedStorage~lengthSuccessCallback
 *
 * @param {number} length The number of key/value pairs in the store.
 */

/**
 * Callback function that is invoked on a successful call to {@link EncryptedStorage.key}.
 * If the key returned is null that means the index passed to {@link EncryptedStorage.key} was out of bounds.
 *
 * @callback sap.EncryptedStorage~keySuccessCallback
 *
 * @param {String} key The key corresponding to the given index.  Will be null if the index passed to
 * {@link EncryptedStorage.key} was out of bounds.
 */

/**
 * Callback function that is invoked on a successful call to {@link EncryptedStorage.getItem}.
 * If the returned value is null, that means the key passed to {@link EncryptedStorage.getItem} did not exist.
 *
 * @callback sap.EncryptedStorage~getItemSuccessCallback
 *
 * @param {String} value The value of the item with the given key.  Will be null if the key passed to
 * {@link EncryptedStorage.getItem} did not exist.
 */

/**
 * Callback function that is invoked in case of an error.
 *
 * @callback sap.EncryptedStorage~errorCallback
 *
 * @param {number} errorCode An error code indicating what went wrong.  Will be one of {@link sap.EncryptedStorage#ERROR_UNKNOWN},
 * {@link sap.EncryptedStorage#ERROR_INVALID_PARAMETER}, {@link sap.EncryptedStorage#ERROR_BAD_PASSWORD}, {@link sap.EncryptedStorage#ERROR_DATAVAULT_LOCKED},
 * {@link sap.EncryptedStorage#ERROR_DB_ERROR}, or {@link sap.EncryptedStorage#ERROR_DATAVAULT_ACCESS_ERROR}.
 *
 * @example
 * function errorCallback(errCode) {
 *    //Set the default error message. Used if an invalid code is passed to the
 *    //function (just in case) but also to cover the
 *    //sap.EncryptedStorage.ERROR_UNKNOWN case as well.
 *    var msg = "Unkown Error";
 *    switch (errCode) {
 *       case sap.EncryptedStorage.prototype.ERROR_INVALID_PARAMETER:
 *          msg = "Invalid parameter passed to method";
 *          break;
 *       case sap.EncryptedStorage.prototype.ERROR_DATAVAULT_LOCKED:
 *          msg = "Datavault locked";
 *          // If we want to we could call sap.Logon.unlock in this case.
 *          break;
 *    };
 *    //Write the error to the log
 *    console.error(msg);
 *    //Let the user know what happened
 *    navigator.notification.alert(msg, null, "EncryptedStorage Error", "OK");
 * };
 */

});

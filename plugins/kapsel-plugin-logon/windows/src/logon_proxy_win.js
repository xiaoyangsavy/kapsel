﻿var appId, context, multiUser;
var noSMPRegistration = false;
var NULL_STRING = "%[NULL]%";
var samlUrl = NULL_STRING;
var RESET_DATA_EVENT = "resetData"; // used by other plugins to cleanup their data.

var transformNull = function (param) {
    if (param == null || param == "") {
        return NULL_STRING;
    }
    return param;
};

var fireEvent = function (eventId, args) {
    WinJS.Application.queueEvent({
        type: eventId,
        detail: {
            'id': eventId,
            'args': args
        }
    });
};

module.exports = {

    initWithSecureStoreId: function (success, fail, args) {
        // pass the certificateSet
        // Called to initialize the DataVault without SMP registration.
        appId = args[0];
        noSMPRegistration = true;
        SAP.Logon.LogonCore.initSecureStore(
            function (s) {
                // does not return a json value.
                success(s);
            }, function (error) {
                fail(error);
            },
        appId);
    },
    initWithApplicationId: function (success, fail, args) {
        // Called to initialize Logon plugin using SMP reg.
        appId = args[0];
        multiUser = (args[4].multiUser && args[4].multiUser == true);

        SAP.Logon.LogonCore.initWithApplicationId(function (msg) {
            var result = false;
            if (msg == "true") {
                result = true;
            }
            // does not return a json value.
            success(true);
        }, function (msg) {
            fail(JSON.parse(msg));
        },
        appId, multiUser);
    },

    registerWithContext: function (success, fail, args) {
        context = args[0];
        var jsonContext = JSON.parse(context);
        samlUrl = jsonContext.samlEndpointUrl;

        if (samlUrl == null || samlUrl === "undefined") {
            samlUrl = NULL_STRING;
        }

        SAP.Logon.LogonCore.registerUserWithContext(
            function (s) {
                var result = JSON.parse(s);
                success(result);
            },
            function (s) {
                fail(JSON.parse(s));
            },
            context
        );
    },
    /**
           * Method for reading the state of logonCore.
           * @param successCallback: this method will be called back if read succeeds with parameter state
           *      state consists of the following fields:
           *          "applicationId":
           *          "status": new / registered / fullRegistered
           *          "secureStoreOpen":
           *          "defaultPasscodeUsed":
           *          "stateClientHub": notAvailable / skipped / availableNoSSOPin / availableInvalidSSOPin / availableValidSSOPin / error
           *          "stateAfaria": initializationNotStarted / initializationInProgress / initializationFailed / initializationSuccessful / credentialNeeded
           *	   	   "isAfariaCredentialsProvided":
           * @param errorCallback: this method will be called back if initialization fails with parameter error
           * Possible error codes for error domains:
           *   Error domain: MAFLogonCoreCDVPlugin
           *       - 2 (plugin not initialized)
           */
    getState: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getStateNoSMP(
                function (result) {
                    success(JSON.parse(result));
                },
                function (error) {
                    fail(JSON.parse(error));
                });

        }
        else {

            SAP.Logon.LogonCore.getState(
                function (result) {
                    success(JSON.parse(result));
                },
                function (s) {
                    fail(JSON.parse(s));
                }
            );
        }

    },
    getContext: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getStateAndContextNoSMP(
                function (result) {
                    success(JSON.parse(result));
                },
                function (error) {
                    fail(JSON.parse(error));
                });

        }
        else {
            SAP.Logon.LogonCore.getContext(
               function (result) {
                   success(JSON.parse(result));
               },
               function (s) {
                   fail(JSON.parse(s));
               }
           );
        }
    },

    persistRegistration: function (success, fail, args) {
        // args[0] is a json string that includes the passcode. 
        // so we dont need to do the conversion.
        var passcode = args[0];
        // call datavault to store the data.
        SAP.Logon.LogonCore.persistRegistration(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (s) {
                fail(JSON.parse(s));
            },
        passcode);

    },

    deleteRegistration: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.deleteSecureStore(
                function (stateAndContext) {
                    noSMPRegistration = false; // reset to original state.
                    var result = JSON.parse(stateAndContext);
                    //Clear the authentication header
                    document.execCommand("ClearAuthenticationCache");
                    fireEvent(RESET_DATA_EVENT);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }
           );
        }
        else {
            SAP.Logon.LogonCore.deleteRegistration(
                function (stateAndContext) {
                    noSMPRegistration = false; // reset to original state.
                    var result = JSON.parse(stateAndContext);
                    //Clear the authentication header
                    document.execCommand("ClearAuthenticationCache");
                    fireEvent(RESET_DATA_EVENT);
                    success(result);
                },
                function (s) {
                    fail(JSON.parse(s));
                }
            );
        }
    },
    /**
         * Method for creating the secure store.
         * @param successCallback(context,state): this method will be called back if persisting succeeds with parameters context and state;
         * @param errorCallback: this method will be called back if persisting fails with parameter error
         * Possible error codes for error domains:
         *   Error domain: MAFLogonCoreCDVPlugin
         *       - 2 (plugin not initialized)
         *       - 3 (no input provided)
         * @param param: an object which must contain the field "passcode" for the store to be created. 
         * Optional field "policyContext" containing the passcode policy parameters described in method getContext.
         */
    createSecureStore: function (success, fail, args) {
        SAP.Logon.LogonCore.createSecureStore(
            function (stateAndContextStr) {
                var state = JSON.parse(stateAndContextStr);
                success(state);
            },
            function (error) {
                fail(JSON.parse(error));
            },
        appId, args[0]);
    },

    lockSecureStore: function (success, fail, args) {
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.lockSecureStoreNoSMP(
               function (resultStr) {
                   var result = JSON.parse(resultStr);
                   success(result);
               },
               function (error) {
                   fail(JSON.parse(error));
               }
          );
        }
        else {
            SAP.Logon.LogonCore.lockSecureStore(
                function (resultStr) {
                    var result = JSON.parse(resultStr);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }
           );
        }
    },

    unlockSecureStore: function (success, fail, args) {
        var code = transformNull(args[0]);
        var passcode =
            {
                "unlockPasscode": code
            }


        if (noSMPRegistration) {
            SAP.Logon.LogonCore.unlockSecureStoreNoSMP(
               function (resultStr) {
                   var result = JSON.parse(resultStr);
                   success(result);
               },
               function (error) {
                   fail(JSON.parse(error));
               },
              JSON.stringify(passcode)
          );
        }
        else {
            SAP.Logon.LogonCore.unlockSecureStore(
                function (resultStr) {
                    var result = JSON.parse(resultStr);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, JSON.stringify(passcode)
           );
        }
    },

    setSecureStoreObject: function (success, fail, args) {
        var key = args[0];
        var value = args[1];

        if (noSMPRegistration) {
            SAP.Logon.LogonCore.setSecureStoreObjectNoSMP(
                function (result) {
                    //does not return a json value.
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key, value);
        }
        else {
            SAP.Logon.LogonCore.setSecureStoreObject(
                function (result) {
                    // does not return a json value.
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key, value);
        }

    },

    getSecureStoreObject: function (success, fail, args) {
        var key = args[0];
        var value = args[1];

        if (noSMPRegistration) {
            SAP.Logon.LogonCore.getSecureStoreObjectNoSMP(
                function (value) {
                    // null value cannot be passed from a WinRT component. 
                    // so disguise the null value as a known string and convert to null.
                    if (value === NULL_STRING) {
                        value = null;
                    }
                    // does not return a json value.
                    success(value);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                key);
        }
        else {
            SAP.Logon.LogonCore.getSecureStoreObject(
               function (value) {
                   // null value cannot be passed from a WinRT component. 
                   // so disguise the null value as a known string and convert to null.
                   if (value === NULL_STRING) {
                       value = null;
                   }

                   // does not return json.
                   success(value);
               },
               function (error) {
                   fail(JSON.parse(error));
               },
               key);
        }
    },

    skipClientHub: function (success, fail) {
        // TODO: Implement when logoncore support this method.
        // MAFLogonCoreCDVPlugin.logonCore.skipSSOPasscode();

        success(true);
    },

    /*
    Checks if the application is already registered.
    */
    isRegistered: function (successCallback, errorCallback, args) {
        var appId = args[0];
        SAP.Logon.LogonCore.isRegisteredWithAppId(
            function (result) {
                if (typeof result === 'boolean') {
                    successCallback(result);
                }
                else {
                    successCallback(false);
                }
            },
            function (errorObject) {
                errorCallback(JSON.parse(errorObject));
            },
            appId
        );
    },

    /*
    Get back the name of the application
    */
    getNativeAppName: function (successCallback, errorCallback, args) {
        var appName;
        try {
            appName = Windows.ApplicationModel.Package.current.displayName;
            if (typeof appName !== "undefined" && appName != null) {
                successCallback(appName);
            } else {
                errorCallback("Application name is not available");
            }
        }
        catch (e) {
            errorCallback(e);
        }
    },

    getPasswordPolicyForUser: function (successCallback, errorCallback, args) {
        var userName = args[0];
        SAP.Logon.LogonCore.getPasswordPolicyForUser(successCallback, errorCallback, userName);
    },

    /*
    Provisions the certificate from the given certificate provider.
    */
    provisionCertificate: function provisionCertificate(successCallback, errorCallback, args) {
        var certName = args[0];
        SAP.Logon.LogonCore.provisionCertificate(successCallback, errorCallback, certName);
    },

    changePasscode: function (success, fail, args) {
        var oldPasscode = transformNull(args[0]);
        var newPasscode = transformNull(args[1]);



        if (noSMPRegistration) {
            SAP.Logon.LogonCore.changePasscodeNoSMP(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                oldPasscode, newPasscode);
        }
        else {
            SAP.Logon.LogonCore.changePasscode(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                oldPasscode, newPasscode);
        }
    },

    applyLocalPasscodePolicy: function (success, fail, args) {
        var passcodePolicy = args[0].passcodePolicy;
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.applyLocalPasscodePolicy(
                function (result) {
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                },
                passcodePolicy
                );
        }
    },

    changePassword: function (success, fail, newPassword) {

        SAP.Logon.LogonCore.changePassword(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                fireEvent("resetSettings");
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            },
            newPassword);
    },
    reset: function (success, fail) {
        if (samlUrl && samlUrl != NULL_STRING) {
            var resourceAddress = new Windows.Foundation.Uri(samlUrl);
            var filter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
            var cookieCollection = filter.cookieManager.getCookies(resourceAddress);

            cookieCollection.forEach(function (value, index, traversedObject) {
                filter.cookieManager.deleteCookie(value);
            });
        }

        // Reset application settings (the key is used by the apppreferences plugins)
        if (Windows.Storage.ApplicationData.current.localSettings.containers.hasKey('com.sap.mp.settings')) {
            Windows.Storage.ApplicationData.current.localSettings.deleteContainer('com.sap.mp.settings');
        }

        success && success();
    },


    checkServerPasscodePolicyUpdate: function (success, fail) {
        SAP.Logon.LogonCore.checkPasscodePolicyChange(function (state) {
            var result = JSON.parse(state);
            success(result)
        }, function (error) {
            fail(JSON.parse(error));
        });
    },


    onEvent: function (success, fail, args) {
        var eventId = args[0];
        if (noSMPRegistration) {
            SAP.Logon.LogonCore.onEventNoSMP(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, eventId
             );
        }
        else {
            // smp registration
            SAP.Logon.LogonCore.onEvent(
                function (stateAndContext) {
                    var result = JSON.parse(stateAndContext);
                    success(result);
                },
                function (error) {
                    fail(JSON.parse(error));
                }, eventId
             );
        }

    },
    activateSecureStoreForUser: function (success, fail, args) {
        var passcode = transformNull(args[0]);
        var userId = transformNull(args[1]);
        SAP.Logon.LogonCore.unlockSecureStore(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            }, passcode, userId
        );
    },
    deactivateCurrentUser: function (success, fail) {
        SAP.Logon.LogonCore.logout(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            }
        );
    },
    removeDeviceUser: function (success, fail, args) {
        var userId = transformNull(args[0]);
        SAP.Logon.LogonCore.unregister(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            }, userId
        );
    },
    removeAllDeviceUsers: function (success, fail) {
        SAP.Logon.LogonCore.unregisterAllDeviceUsers(
            function (stateAndContext) {
                var result = JSON.parse(stateAndContext);
                success(result);
            },
            function (error) {
                fail(JSON.parse(error));
            }
        );
    }
};

// This should be the service name used in cordova exec that this class is proxying. 
require("cordova/exec/proxy").add("MAFLogonCoreCDVPluginJS", module.exports);

cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-camera.Camera",
    "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "Camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverOptions",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverOptions"
    ]
  },
  {
    "id": "cordova-plugin-camera.camera",
    "file": "plugins/cordova-plugin-camera/www/Camera.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "navigator.camera"
    ]
  },
  {
    "id": "cordova-plugin-camera.CameraPopoverHandle",
    "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
    "pluginId": "cordova-plugin-camera",
    "clobbers": [
      "CameraPopoverHandle"
    ]
  },
  {
    "id": "kapsel-plugin-inappbrowser.inappbrowser",
    "file": "plugins/kapsel-plugin-inappbrowser/www/inappbrowser.js",
    "pluginId": "kapsel-plugin-inappbrowser",
    "clobbers": [
      "cordova.InAppBrowser.open",
      "window.open"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  },
  {
    "id": "kapsel-plugin-i18n.i18n",
    "file": "plugins/kapsel-plugin-i18n/www/i18n.js",
    "pluginId": "kapsel-plugin-i18n"
  },
  {
    "id": "kapsel-plugin-authproxy.AuthProxy",
    "file": "plugins/kapsel-plugin-authproxy/www/authproxy.js",
    "pluginId": "kapsel-plugin-authproxy",
    "clobbers": [
      "sap.AuthProxy"
    ]
  },
  {
    "id": "kapsel-plugin-authproxy.oauth2",
    "file": "plugins/kapsel-plugin-authproxy/www/oauth2.js",
    "pluginId": "kapsel-plugin-authproxy",
    "clobbers": [
      "sap.AuthProxy.OAuth2"
    ]
  },
  {
    "id": "kapsel-plugin-authproxy.saml2",
    "file": "plugins/kapsel-plugin-authproxy/www/saml2.js",
    "pluginId": "kapsel-plugin-authproxy",
    "clobbers": [
      "sap.AuthProxy.SAML2"
    ]
  },
  {
    "id": "kapsel-plugin-authproxy.otp",
    "file": "plugins/kapsel-plugin-authproxy/www/otp.js",
    "pluginId": "kapsel-plugin-authproxy",
    "clobbers": [
      "sap.AuthProxy.OTP"
    ]
  },
  {
    "id": "kapsel-plugin-authproxy.datajsClient",
    "file": "plugins/kapsel-plugin-authproxy/www/datajsClient.js",
    "pluginId": "kapsel-plugin-authproxy",
    "runs": true
  },
  {
    "id": "kapsel-plugin-authproxy.utils",
    "file": "plugins/kapsel-plugin-authproxy/www/utils.js",
    "pluginId": "kapsel-plugin-authproxy",
    "runs": true
  },
  {
    "id": "kapsel-plugin-authproxy.webStrategies",
    "file": "plugins/kapsel-plugin-authproxy/www/webStrategies.js",
    "pluginId": "kapsel-plugin-authproxy",
    "runs": true
  },
  {
    "id": "cordova-plugin-dialogs.notification",
    "file": "plugins/cordova-plugin-dialogs/www/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "cordova-plugin-dialogs.notification_android",
    "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
    "pluginId": "cordova-plugin-dialogs",
    "merges": [
      "navigator.notification"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonCore",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/MAFLogonCorePlugin.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.Core"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonLocalStorage",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/LogonCoreLocalStorage.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.CoreLocalStorage"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonUtils",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/Utils.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.Utils"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonStaticScreens",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/StaticScreens.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.StaticScreens"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonDynamicScreens",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/DynamicScreens.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.DynamicScreens"
    ]
  },
  {
    "id": "kapsel-plugin-logon.Logon",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/LogonController.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.Logon"
    ]
  },
  {
    "id": "kapsel-plugin-logon.LogonJsView",
    "file": "plugins/kapsel-plugin-logon/www/common/modules/LogonJsView.js",
    "pluginId": "kapsel-plugin-logon",
    "clobbers": [
      "sap.logon.LogonJsView",
      "sap.logon.IabUi"
    ]
  },
  {
    "id": "kapsel-plugin-appupdate.AppUpdate",
    "file": "plugins/kapsel-plugin-appupdate/www/appupdate.js",
    "pluginId": "kapsel-plugin-appupdate",
    "clobbers": [
      "sap.AppUpdate"
    ]
  },
  {
    "id": "kapsel-plugin-logger.Logging",
    "file": "plugins/kapsel-plugin-logger/www/logger.js",
    "pluginId": "kapsel-plugin-logger",
    "clobbers": [
      "sap.Logger"
    ]
  },
  {
    "id": "kapsel-plugin-encryptedstorage.Encrypted",
    "file": "plugins/kapsel-plugin-encryptedstorage/www/encryptedstorage.js",
    "pluginId": "kapsel-plugin-encryptedstorage",
    "clobbers": [
      "sap.EncryptedStorage"
    ]
  },
  {
    "id": "cordova-plugin-file.DirectoryEntry",
    "file": "plugins/cordova-plugin-file/www/DirectoryEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.DirectoryReader",
    "file": "plugins/cordova-plugin-file/www/DirectoryReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.DirectoryReader"
    ]
  },
  {
    "id": "cordova-plugin-file.Entry",
    "file": "plugins/cordova-plugin-file/www/Entry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Entry"
    ]
  },
  {
    "id": "cordova-plugin-file.File",
    "file": "plugins/cordova-plugin-file/www/File.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.File"
    ]
  },
  {
    "id": "cordova-plugin-file.FileEntry",
    "file": "plugins/cordova-plugin-file/www/FileEntry.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileEntry"
    ]
  },
  {
    "id": "cordova-plugin-file.FileError",
    "file": "plugins/cordova-plugin-file/www/FileError.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileError"
    ]
  },
  {
    "id": "cordova-plugin-file.FileReader",
    "file": "plugins/cordova-plugin-file/www/FileReader.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileReader"
    ]
  },
  {
    "id": "cordova-plugin-file.FileSystem",
    "file": "plugins/cordova-plugin-file/www/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadOptions",
    "file": "plugins/cordova-plugin-file/www/FileUploadOptions.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadOptions"
    ]
  },
  {
    "id": "cordova-plugin-file.FileUploadResult",
    "file": "plugins/cordova-plugin-file/www/FileUploadResult.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileUploadResult"
    ]
  },
  {
    "id": "cordova-plugin-file.FileWriter",
    "file": "plugins/cordova-plugin-file/www/FileWriter.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.FileWriter"
    ]
  },
  {
    "id": "cordova-plugin-file.Flags",
    "file": "plugins/cordova-plugin-file/www/Flags.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Flags"
    ]
  },
  {
    "id": "cordova-plugin-file.LocalFileSystem",
    "file": "plugins/cordova-plugin-file/www/LocalFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.LocalFileSystem"
    ],
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.Metadata",
    "file": "plugins/cordova-plugin-file/www/Metadata.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.Metadata"
    ]
  },
  {
    "id": "cordova-plugin-file.ProgressEvent",
    "file": "plugins/cordova-plugin-file/www/ProgressEvent.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.ProgressEvent"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems",
    "file": "plugins/cordova-plugin-file/www/fileSystems.js",
    "pluginId": "cordova-plugin-file"
  },
  {
    "id": "cordova-plugin-file.requestFileSystem",
    "file": "plugins/cordova-plugin-file/www/requestFileSystem.js",
    "pluginId": "cordova-plugin-file",
    "clobbers": [
      "window.requestFileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.resolveLocalFileSystemURI",
    "file": "plugins/cordova-plugin-file/www/resolveLocalFileSystemURI.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "window"
    ]
  },
  {
    "id": "cordova-plugin-file.isChrome",
    "file": "plugins/cordova-plugin-file/www/browser/isChrome.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.androidFileSystem",
    "file": "plugins/cordova-plugin-file/www/android/FileSystem.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "FileSystem"
    ]
  },
  {
    "id": "cordova-plugin-file.fileSystems-roots",
    "file": "plugins/cordova-plugin-file/www/fileSystems-roots.js",
    "pluginId": "cordova-plugin-file",
    "runs": true
  },
  {
    "id": "cordova-plugin-file.fileSystemPaths",
    "file": "plugins/cordova-plugin-file/www/fileSystemPaths.js",
    "pluginId": "cordova-plugin-file",
    "merges": [
      "cordova"
    ],
    "runs": true
  },
  {
    "id": "cordova-plugin-http.CordovaHttpPlugin",
    "file": "plugins/cordova-plugin-http/www/cordovaHTTP.js",
    "pluginId": "cordova-plugin-http",
    "clobbers": [
      "CordovaHttpPlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-camera": "4.0.3",
  "kapsel-plugin-corelibs": "4.0.0",
  "kapsel-plugin-inappbrowser": "4.0.0",
  "cordova-plugin-device": "2.0.2",
  "kapsel-plugin-i18n": "4.0.0",
  "kapsel-plugin-authproxy": "4.0.0",
  "kapsel-plugin-ui5": "4.0.0",
  "cordova-plugin-dialogs": "2.0.1",
  "kapsel-plugin-logon": "4.0.0",
  "kapsel-plugin-appupdate": "4.0.0",
  "kapsel-plugin-logger": "4.0.0",
  "kapsel-plugin-encryptedstorage": "4.0.0",
  "cordova-plugin-file": "6.0.1",
  "cordova-plugin-http": "1.2.0"
};
// BOTTOM OF METADATA
});
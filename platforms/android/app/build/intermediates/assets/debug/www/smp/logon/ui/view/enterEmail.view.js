sap.ui.jsview("view.enterEmail", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
            if (!window.idIterator) {
                window.idIterator = 1;
            }
            var maxRuleWidth = 1;
            var jsView = this;
            var passcodeValid = false;
            var valueStateErrorControl = null;

            var isObjectEmpty = function(object) {
                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }

            var checkBoolean = function(anObject, key) {
                if (anObject && anObject.hasOwnProperty(key) && anObject[key]) {
                    if (typeof anObject[key] == "string") {
                        // It is a string.  If the string is "false" then return false.
                        return anObject[key].toLowerCase() != "false";
                    } else {
                        return true;
                    }
                }
                return false;
            }

            var data = window.iab.context;
            
            // create JSON model instance
            var oModel = new sap.ui.model.json.JSONModel();
            // set the data for the model
            oModel.setData(data);
            // set the model to the core
            sap.ui.getCore().setModel(oModel);

            // This function calculates how wide the vbox containing all the controls should be.
            var calculateDisplayWidth = function(totalWidth) {
                var displayWidth = 0;
                if (totalWidth <= 360) {
                    displayWidth = totalWidth*0.9;
                } else {
                    // On a wide screen, use a little more space
                    displayWidth = 324 + ((totalWidth - 360)*0.1);
                }
                return Math.round(displayWidth);
            }

            var vbox = new sap.m.VBox('enterEmailScreen');
            
            var appName = window.iab.context.appName;
            if (!appName){
                appName = window.iab.context._defaultAppName;
            }
            
            var emailLabel = new sap.m.Label( 'email_header_toolbar_label', {
                text: getLocalizedString("SCR_ENTER_EMAIL_HEADER_TEXT")
            });
            var panelVBox = new sap.m.VBox('panel_vbox', {
                items: [emailLabel]
            });
            var panel = new sap.m.Panel( 'email_header_panel', {
                content: [panelVBox],
                backgroundDesign: sap.m.BackgroundDesign.Solid
            });
            
            var inputEmail = new sap.m.Input( 'Email_item', {
                type:sap.m.InputType.Email,
                value:"{/email}",
                placeholder: getLocalizedString("FLD_EMAIL_LABEL"),
                liveChange:function() {
                    inputEmail.setValueState(sap.ui.core.ValueState.None);
                }
            });
            
            var buttonOKPress = function(){
                window.iab.busy.open();
                data.email = inputEmail.getValue();
                window.iab.triggerEventForJsView("SUBMIT", data);
            }
            var buttonOK = new sap.m.Button( 'button_ok', {
                type:sap.m.ButtonType.Emphasized,
                text:getLocalizedString("BUTTON_OK"),
                width:"100%",
                press : buttonOKPress
            });
            
            var buttonCancel = new sap.m.Button( 'button_cancel', {
                text:getLocalizedString("BUTTON_CANCEL"),
                width:"100%",
                press:function(){
                    window.iab.busy.open();
                    window.iab.triggerEventForJsView("CANCEL", data);
                }
            });

            var vboxPlaceholder1 = new sap.m.HBox( 'vbox_placeholder1', {
                height:"25px"
            });

            var vboxPlaceholder2 = new sap.m.HBox( 'vbox_placeholder2', {
                height:"10px"
            });

            var vboxPlaceholder3 = new sap.m.HBox( 'vbox_placeholder3', {
                height:"25px"
            });

            vbox.addItem(vboxPlaceholder1);
            vbox.addItem(panel);
            vbox.addItem(vboxPlaceholder2);
            vbox.addItem(inputEmail);
            vbox.addItem(vboxPlaceholder3);
            vbox.addItem(buttonOK);
            vbox.addItem(buttonCancel);

            vboxPageContent = new sap.m.VBox('vbox_content', {
                alignItems:sap.m.FlexAlignItems.Center,
                justifyContent:sap.m.FlexJustifyContent.Start,
                items:[vbox]
            });

            var logoPath;
            if (data.custom && data.custom.copyrightLogo) {
                logoPath = data.custom.copyrightLogo;
            } else {
                logoPath = "img/sapLogo.png";
            }
            var logo = new sap.m.Image( 'logo', {
                src: logoPath,
                height:"40px"
            });

            var cprMsg1, cprMsg2;
            if (data.custom && data.custom.copyrightMsg) {
                cprMsg1 = data.custom.copyrightMsg[0];
                cprMsg2 = data.custom.copyrightMsg[1];
            } else {
                cprMsg1 = getLocalizedString("COPYRIGHT_1");
                cprMsg2 = getLocalizedString("COPYRIGHT_2");
            }

            var copyright1 = new sap.m.Text( 'copyright1', {
                text: cprMsg1
            });

            var copyright2 = new sap.m.Text( 'copyright2', {
                text: cprMsg2
            });

            var copyright = new sap.m.VBox('copyright', {
                items: [copyright1, copyright2]
            });

            var footerHBox = new sap.m.HBox('panel_footer_hbox', {
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                width: "90%",
                items: [logo, copyright],
                visible: !(data && data.custom && data.custom.hideLogoCopyright && data.custom.hideLogoCopyright.toString() == "true")
            });

            vboxOuter = new sap.m.FlexBox('vbox_outer', {
                direction:sap.m.FlexDirection.Column,
                justifyContent:sap.m.FlexJustifyContent.SpaceBetween,
                alignItems:sap.m.FlexAlignItems.Center,
                items:[vboxPageContent, footerHBox],
                fitContainer: true
            });

            // If the screen width is available, pre-calculate how wide the vbox should be
            // so that the user can't see it draw as the wrong size then quickly redraw as
            // the correct size.
            if ($(window).width()) {
                vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
            }

            sap.ui.core.ResizeHandler.register(vboxOuter, function(e){
                vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
                jsView.setHeight(null);
                var domRef = jsView.getDomRef();
                if( $(window).height() && $(window).height() > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    jsView.setHeight($(window).height() + "px");
                }
            });

            vboxOuter.onAfterRendering = function() {
                var inputs = this.$().find(':input');
                inputs.attr('autocapitalize', 'off');
                inputs.attr('autocorrect', 'off');
                inputs.attr('autocomplete', 'off');
                if (valueStateErrorControl != null) {
                    valueStateErrorControl.focus();
                } 
            }
            window.iab.page.setShowHeader(false);
            this.onAfterRendering = function() {
                var domRef = this.getDomRef();
                var newHeight = $(window).height();
                if (!(jQuery.device.is.ipad || jQuery.device.is.iphone)){
                    if (window.iab.heightWithoutKeyboard != null) {
                        // If we know the height of the screen without the keyboard, use that
                        // (since the keyboard will affect $(window).height()).
                        newHeight = window.iab.heightWithoutKeyboard;
                    }
                }
                if( newHeight && newHeight > domRef.offsetHeight) {
                    // The view is not taking up the whole screen height, force it.
                    this.setHeight(newHeight + "px");
                }
                
            }
            return vboxOuter;

    }
});

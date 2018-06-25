sap.ui.jsview("view.enterFioriConfiguration", {

    getControllerName: function() {
        return null;
    },

    /**
     * 
     * @param oController may be null
     * @returns {sap.ui.cre.Control}
     */
    createContent: function(oController) {
        var jsView = this;
        var data = window.iab.context;
        if (data.fioriConfiguration == null) {
            data.fioriConfiguration = "";
        }

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
                displayWidth = totalWidth * 0.9;
            } else {
                // On a wide screen, use a little more space
                displayWidth = 324 + ((totalWidth - 360) * 0.1);
            }
            return Math.round(displayWidth);
        }
        
        // calculate the width depending on whether barcode scanner plugin is available or not
        var calculateDisplayWidthMinusBarcodeScannerButton = function () {
            var width;

            if (data.isBarcodescannerPluginAvailable == true) {
                width = (calculateDisplayWidth($(window).width()) - 48) + "px";
            } else {
                width = "100%";
            }

            return width;
        }

        var vbox = new sap.m.VBox('EnterFioriConfiguration');

        var inputConfiguration = new sap.m.ComboBox('configuration_input', {
            name: "Enter SAP Fiori URL or work email",
            value: "{/fioriConfiguration}",
            placeholder: getLocalizedString("SCR_ENTER_FIORI_CONFIG_ENTER_URL"),
            width: calculateDisplayWidthMinusBarcodeScannerButton(),
            liveChange: function() {
                inputConfiguration.setValueState(sap.ui.core.ValueState.None);
                valueStateErrorControl = null;
            }
        });


        if (data.isBarcodescannerPluginAvailable == true) {
            var buttonBarcodeScan = new sap.m.Button('button_barcodescan', {
                icon: sap.ui.core.IconPool.getIconURI("bar-code"),
                width: "48px",
                press: function () {
                    //Making a deep copy since the barcode scan should not be modified globally
                    tempdata = JSON.parse(JSON.stringify(data));
                    tempdata.barcodescan = true;
                    window.iab.triggerEventForJsView("SUBMIT", tempdata);
                }
            });

            buttonBarcodeScan.addAriaLabelledBy(buttonBarcodeScan.getId()+"-label");


            var barcodescanlabel = new sap.m.Label(buttonBarcodeScan.getId()+"-label", {
                text : getLocalizedString("BTN_QRCODE"),
            });

            barcodescanlabel.addStyleClass("sapUiInvisibleText");

            var inputHBox = new sap.m.HBox('input_hbox', {
                justifyContent: sap.m.FlexJustifyContent.End,
                items: [inputConfiguration, buttonBarcodeScan, barcodescanlabel]
            });
        }



        if (data.previous_fiori_urls) {
            // The urls are delimited with the "^" character.
            var previousURLs = data.previous_fiori_urls.split("^");
            for (var i = 0; i < previousURLs.length; i++) {
                var prevUrlItem = new sap.ui.core.ListItem('previousURL' + i, {
                    text: previousURLs[i]
                });
                inputConfiguration.addItem(prevUrlItem);
            }
        }
        var valueStateErrorControl = null;
        if (data.valueStateText != null) {
            inputConfiguration.setValueStateText(data.valueStateText);
            inputConfiguration.setValueState(sap.ui.core.ValueState.Error);
            valueStateErrorControl = inputConfiguration;
        }

        var helpText = new sap.m.Text('configuration_text', {
            text: getLocalizedString("SCR_ENTER_FIORI_CONFIG_INSTRUCTIONS")
        });
        var panel = new sap.m.Panel('configuration_text_panel', {
            content: [helpText],
            backgroundDesign: sap.m.BackgroundDesign.Solid
        });

        var buttonOKPress = function() {
            data.cancelled = false;
            window.iab.busy.open();

            if (inputConfiguration.getValue()) {
                inputConfiguration.setValue(inputConfiguration.getValue().trim());
			}
 
            setTimeout(function() {
                // fix bcp issue: error message shows up and then disappear in ios by moving validation to here
                // we would need to refactor or clean up later
                function isEmail(emailAddress) {
                    if (typeof(emailAddress) !== 'string') {
                        return false;
                    }
                    var regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
                    var result = regexp.test(emailAddress);
                    console.log("check email format: " + result);
                    return result;
                };

                function isUrl(url) {
                    if (typeof(url) !== 'string') {
                        return false;
                    }

                    var regexp = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;

                    var result = regexp.test(url);
                    if (result) {
                        try {
                            var decoded = decodeURI(url);
                            if (decoded.indexOf('>') > -1 || decoded.indexOf('<') > -1) {
                                // Less than and greater than characters are not allowed.
                                result = false;
                            }
                        } catch (e) {
                            console.log("Error during decoding the URL: " + e);
                            result = false;
                        }
                    }
                    console.log("check URL format: " + result);
                    return result;
                };
                if (!(isUrl(inputConfiguration.getValue()) || isEmail(inputConfiguration.getValue()))) {
                    inputConfiguration.setValueStateText(getLocalizedString("SCR_ENTER_FIORI_CONFIG_INVALID_URL"));
                    inputConfiguration.setValueState(sap.ui.core.ValueState.Error);
                    // Do the work in a setTimeout because otherwise the focus gets stolen
                    // away (and if the focus is not on the input control then the value
                    // state text is not visible).
                    setTimeout(function() {
                        inputConfiguration.focus();
                    }, 400);
                    window.iab.busy.close();
                    return;
                }
                data.fioriConfiguration = inputConfiguration.getValue();
                window.iab.triggerEventForJsView("SUBMIT", data);
            }, 500);
        }
        var buttonOK = new sap.m.Button('button_ok', {
            type: sap.m.ButtonType.Emphasized,
            text: getLocalizedString("BUTTON_OK"),
            width: "100%",
            press: buttonOKPress
        });

        // The cancel button takes the user back to the chooseDemoMode screen.
        var buttonCancel = new sap.m.Button('button_cancel', {
            text: getLocalizedString("BUTTON_CANCEL"),
            width: "100%",
            press: function() {
                window.iab.busy.open();
                data.cancelled = true;
                inputConfiguration.setValue("");
                inputConfiguration.setValueState(sap.ui.core.ValueState.None);
                valueStateErrorControl = null;
                data.valueStateText = null;
                window.iab.triggerEventForJsView("SUBMIT", data);
            }
        });

        var vboxPlaceholder1 = new sap.m.HBox('vbox_placeholder1', {
            height: "75px"
        });

        var vboxPlaceholder2 = new sap.m.HBox('vbox_placeholder2', {
            height: "25px"
        });

        var vboxPlaceholder3 = new sap.m.HBox('vbox_placeholder3', {
            height: "25px"
        });

        vbox.addItem(vboxPlaceholder1);
              
        if(data.isBarcodescannerPluginAvailable == true) {
            vbox.addItem(inputHBox); // for adding barcode button
        } else {
            vbox.addItem(inputConfiguration); // without barcode button
        }
              
        vbox.addItem(vboxPlaceholder2);
        vbox.addItem(panel);
        vbox.addItem(vboxPlaceholder3);
        vbox.addItem(buttonOK);
        vbox.addItem(buttonCancel);

        vboxPageContent = new sap.m.VBox('vbox_content', {
            alignItems: sap.m.FlexAlignItems.Center,
            justifyContent: sap.m.FlexJustifyContent.Start,
            items: [vbox]
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

        var footerHBox = new sap.m.HBox('panel_hbox', {
            justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
            alignItems: sap.m.FlexAlignItems.Start,
            width: "90%",
            items: [logo, copyright],
            visible: !(data && data.custom && data.custom.hideLogoCopyright && data.custom.hideLogoCopyright.toString() == "true")
        });

        vboxOuter = new sap.m.FlexBox('vbox_outer', {
            direction: sap.m.FlexDirection.Column,
            justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
            alignItems: sap.m.FlexAlignItems.Center,
            items: [vboxPageContent, footerHBox],
            fitContainer: true
        });

        // If the screen width is available, pre-calculate how wide the vbox should be
        // so that the user can't see it draw as the wrong size then quickly redraw as
        // the correct size.
        if ($(window).width()) {
            vbox.setWidth(calculateDisplayWidth($(window).width()) + "px");
        }

        sap.ui.core.ResizeHandler.register(vboxOuter, function(e) {
            vbox.setWidth(calculateDisplayWidth(e.size.width) + "px");
            inputConfiguration.setWidth( calculateDisplayWidthMinusBarcodeScannerButton() );
            jsView.setHeight(null);
            var domRef = jsView.getDomRef();
            if($(window).height() && $(window).height() > domRef.offsetHeight) {
                // The view is not taking up the whole screen height, force it.
                jsView.setHeight($(window).height() + "px");
            }
        });

        vboxPageContent.onAfterRendering = function() {
            var inputs = this.$().find(':input');
            inputs.attr('autocapitalize', 'off');
            inputs.attr('autocorrect', 'off');
            inputs.attr('autocomplete', 'off');
            if (valueStateErrorControl != null) {
                // Do the work in a setTimeout because otherwise the focus gets stolen
                // away (and if the focus is not on the input control then the value
                // state text is not visible).
                setTimeout(function() {
                    valueStateErrorControl.focus();
                }, 400);
            }
        }
        window.iab.page.setShowHeader(false);
        window.iab.heightWithoutKeyboard = null;
        this.onAfterRendering = function() {
            var domRef = this.getDomRef();
            if ($(window).height() && $(window).height() > domRef.offsetHeight) {
                // The view is not taking up the whole screen height, force it.
                this.setHeight($(window).height() + "px");
                window.iab.heightWithoutKeyboard = $(window).height();
            }
        }

        window.onkeyup = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;

            if (key == 13) {
                // GO button pressed on Android keyboard
                buttonOKPress();
            }
        }

        return vboxOuter;
    }
});

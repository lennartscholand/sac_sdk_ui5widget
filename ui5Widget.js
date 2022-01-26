(function() { 
	let _shadowRoot;
	let _id;
	let _password;

	let template = document.createElement("template");
	template.innerHTML = `
        <style>
        </style>
        <div id="ui5_content" name="ui5_content">
        <slot name="content"></slot>
        </div>
        <script id="oView" name="oView" type="sapui5/xmlview">
            <mvc:View
                controllerName="myView.Template"
                xmlns:l="sap.ui.layout"
                xmlns:u="sap.ui.unified"
                xmlns:mvc="sap.ui.core.mvc"
                xmlns="sap.m">
                <l:VerticalLayout
                    class="sapUiContentPadding"
                    width="100%">
                     <l:content>
                        <u:Calendar
                            id="calendar"
                            select="handleCalendarSelect" />
                    </l:content>
                </l:VerticalLayout>
            </mvc:View>
        </script>
	`;


	customElements.define("com-conet-widget-inputpassword1", class InputPassword extends HTMLElement {
		constructor() {
			super(); 
			_shadowRoot = this.attachShadow({mode: "open"});
			_shadowRoot.appendChild(template.content.cloneNode(true));

			_id=createGuid();
			_shadowRoot.querySelector("#oView").id = _id + "_oView";

		}


        onCustomWidgetAfterUpdate(changedProperties) {
            loadWidget(this);
        }

        _firePropertiesChanged() {
            this.password = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        password: this.password
                    }
                }
            }));
        }

    });


    function loadWidget(that) {
        var that_ = that;
      
        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller"
            ], function(jQuery, Controller) {
                "use strict";

                return Controller.extend("myView.Template", {
                    onInputLiveChange: function(oEvent) {
                        _password = oView.byId("passwordInput").getValue();
                        that._firePropertiesChanged();
                        console.log(_password);

                        this.settings = {};
                        this.settings.password = "";

                        that.dispatchEvent(new CustomEvent("onStart", {
                            detail: {
                                settings: this.settings
                            }
                        }));
                    } 
                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView  = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
            });
            oView.placeAt(content);

        });
    }

	function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }  


})();
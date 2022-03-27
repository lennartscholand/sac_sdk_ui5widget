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

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
         }

        onCustomWidgetAfterUpdate(changedProperties) {
            if ("selectedDate" in changedProperties) {
				debugger;
			}

            if ("width" in changedProperties) {
                debugger;
				this.style["background-color"] = changedProperties["color"];
			}


            loadWidget(this);
        }

        loadWidget(that) {
      
            //Einfügen neues Div-Element in HTML-Template
            let content = document.createElement('div');
            content.slot = "content";
            that.appendChild(content);
    
            //SAPUI5 Logik
            sap.ui.getCore().attachInit(function() {
                "use strict";
    
                //### Controller ###
                sap.ui.define([
                    "jquery.sap.global",
                    "sap/ui/core/mvc/Controller",
                    'sap/ui/unified/DateRange',
                    'sap/ui/core/format/DateFormat',
                    'sap/ui/core/library'
                ], function(jQuery, Controller, DateRange, DateFormat, coreLibrary) {
                    "use strict";
    
                    var CalendarType = coreLibrary.CalendarType;
    
                    return Controller.extend("myView.Template", {
                        oFormatYyyymmdd: null,
    
                        onInit: function() {
                            this.oFormatYyyymmdd = DateFormat.getInstance({pattern: "yyyy-MM-dd", calendarType: CalendarType.Gregorian});
                        },
                        
                        handleCalendarSelect: function(oEvent){
                            let oDate = oEvent.oSource.getSelectedDates()[0].getStartDate();
                            this.selectedDate = this.oFormatYyyymmdd.format(oDate);
                            console.log("NewDate: " + this.selectedDate);
                            this.dispatchEvent(new CustomEvent("propertiesChanged", { 
                                detail: { 
                                   properties: { 
                                    selectedDate: this.selectedDate 
                                   } 
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

    });


    /* function loadWidget(that) {
      
        //Einfügen neues Div-Element in HTML-Template
        let content = document.createElement('div');
        content.slot = "content";
        that.appendChild(content);

        //SAPUI5 Logik
        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                'sap/ui/unified/DateRange',
                'sap/ui/core/format/DateFormat',
                'sap/ui/core/library'
            ], function(jQuery, Controller, DateRange, DateFormat, coreLibrary) {
                "use strict";

                var CalendarType = coreLibrary.CalendarType;

                return Controller.extend("myView.Template", {
                    oFormatYyyymmdd: null,

                    onInit: function() {
                        this.oFormatYyyymmdd = DateFormat.getInstance({pattern: "yyyy-MM-dd", calendarType: CalendarType.Gregorian});
                    },
                    
                    handleCalendarSelect: function(oEvent){
                        let oDate = oEvent.oSource.getSelectedDates()[0].getStartDate();
                        this.selectedDate = this.oFormatYyyymmdd.format(oDate);
                        console.log("NewDate: " + this.selectedDate);
                        this.dispatchEvent(new CustomEvent("propertiesChanged", { 
                            detail: { 
                               properties: { 
                                selectedDate: this.selectedDate 
                               } 
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
    } */

	function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }  


})();
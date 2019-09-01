sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast"
], function (BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("my.customworklist.CustomWorklist.controller.Add", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf my.customworklist.CustomWorklist.view.Add
		 */
		onInit: function () {
			this.getRouter().getRoute("add").attachPatternMatched(this._onRouteMatched, this);
			console.log('Add - onInit');
		},

		_onRouteMatched: function () {
			var oModel = this.getModel();
			oModel.metadataLoaded().then(this._onMetadataLoaded.bind(this));
			console.log('Add - onRouteMatched');
		},

		_onMetadataLoaded: function() {
			// default values in the new entry
			var oProperties = {
				ProductID: "" + parseInt(Math.random()*100000, 10),
				TypeCode: "PR",
				TaxTarifCode: 1,
				CurrencyCode: "EUR",
				MeasureUnit: "EA"
			};
			
			// create new entry in the model
			this._oContext = this.getModel().createEntry("/ProductSet", {
				properties: oProperties,
				success: this._onCreateSuccess.bind(this)
			});
			
			// bind the view to the new entry
			this.getView().setBindingContext(this._oContext);
		},
		
		_onCreateSuccess: function(oProduct) {
			// navigate to the new product object view
			var sID = oProduct.ProductID;
			this.getRouter().navTo("object", {
				objectId: sID
			}, true);
			
			// unbind the view to not show this object again
			this.getView().unbindObject();
			
			// show success message
			var sMessage = "The product " + oProduct.Name + " has been added.";
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation: false
			});
		},
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf my.customworklist.CustomWorklist.view.Add
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf my.customworklist.CustomWorklist.view.Add
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf my.customworklist.CustomWorklist.view.Add
		 */
		//	onExit: function() {
		//
		//	}
		
		onNavBack: function() {
			this.getModel().deleteCreatedEntry(this._oContext);
			history.back();
		},
		
		onCancel: function() {
			this.onNavBack();
		},
		
		onSave: function() {
			this.getModel().submitChanges();
		}
	});

});
sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.veh_pagos.controller.App", {
      	onInit: function () {
      		sessionStorage.urlGlobal = "/SRV_RESTVEHICULOS";
      		// sessionStorage.urlGlobal = "http://tdperpdev.toyotaperu.com.pe:8001/sap/bc/zvehiculo/zdp_vehiculoloc";
            // sessionStorage.usuarioName = "C_T77";
             var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
            userModel.attachRequestCompleted(function() {
               sessionStorage.usuarioName = userModel.getData().name;
            });
			// var oViewModel,
			// 	fnSetAppNotBusy,
			// 	iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			// oViewModel = new sap.ui.model.json.JSONModel({
			// 	busy: true,
			// 	delay: 0
			// });
			// this.getView().setModel(oViewModel, "appView");

			// fnSetAppNotBusy = function() {
			// 	oViewModel.setProperty("/busy", false);
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// };

			// this.getOwnerComponent().getModel().metadataLoaded().
			// then(fnSetAppNotBusy);

			// // apply content density mode to root view
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
   });
});
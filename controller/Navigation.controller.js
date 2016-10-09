sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "es/irregularity/model/textFormatter"
], function(Controller, textFormatter) {
    "use strict";
    return Controller.extend("es.irregularity.controller.Navigation", {

      _getRouter : function () {
			     return sap.ui.core.UIComponent.getRouterFor(this);
		  },

      openOverview: function(oEvent) {
        this._getRouter().navTo("overview");
      },

      startQuiz: function(oEvent) {
			  this._getRouter().navTo("quiz");
      }

    });

});

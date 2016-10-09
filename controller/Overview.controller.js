sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "es/irregularity/model/textFormatter"
], function(Controller, textFormatter) {
    "use strict";
    return Controller.extend("es.irregularity.controller.Overview", {
      textFormatter: textFormatter,

      onInit: function () {

        var oTable = this.getView().byId("verbTable");
        oTable.addEventDelegate({
          onAfterRendering: function(e) {
            sap.ui.table.Table.prototype.onAfterRendering.call(this, e);
            this.selectAll(true);
          }
        },oTable);
      },

      onSelectChange: function() {
        var aVerbs = this.getView().getModel("verb").getData().Verben;
        if (!aVerbs) {
          return;
        }
        var oText = this.getView().byId("tableSummary");
        var oTable = this.getView().byId("verbTable");
        var aSelectedWords = oTable.getSelectedIndices();
        aVerbs.map(function(value, index) {
          if (aSelectedWords.indexOf(index) > -1) {
            value.study = true;
          } else {
            value.study = false;
          }
        });

        var oBundle = this.getView().getModel("i18n").getResourceBundle();
        var sMsg = oBundle.getText("overview.summary", [aSelectedWords.length]);
        oText.setText(sMsg);
      },

    });

});

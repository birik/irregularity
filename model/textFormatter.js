sap.ui.define([], function() {
  "use strict"

  var that = this;
  var textFormatter = {

    getI18nText: function(sPrefix, sProp) {
      var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
      return resourceBundle.getText(sPrefix.concat('.').concat(sProp));
    },
    getI18nVerbTranslate: function(sWord) {
      var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
      return resourceBundle.getText('verb.'.concat(sWord));
    }
  };
  return textFormatter;
});

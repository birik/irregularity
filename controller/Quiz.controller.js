sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
		"use strict";
		return Controller.extend("es.irregularity.controller.Quiz", {

						onInit: function() {
								this._iQuestionsCount = 0;
								this._iCorrectAnswerCount = 0;
								this._aVowels = ['e', 'u', 'i', 'o', 'a'];
								this._aLetters = ['ie', 'i', 'o', 'a', 'u', 'e'];
								this._wordsToLearn = [];

								//listen to open view again
								var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
								oRouter.attachRouteMatched(this._updateVariables, this);

								var aAllVerbs = this.getOwnerComponent().getModel("verb").getData().Verben;
								if (aAllVerbs) {
										this._wordsToLearn = aAllVerbs.filter(function(value) {
												return value.study;
										});
								}
								var oQuestion = this._getNewQuestion();
								var oModel = new JSONModel(oQuestion);
								this.getView().setModel(oModel, "question");

				},

				_updateVariables: function(oEvent) {
					if (oEvent.getParameter("name") === 'quiz') {
						var aAllVerbs = this.getView().getModel("verb").getData().Verben;
						if (aAllVerbs) {
							this._wordsToLearn = aAllVerbs.filter(function(value) {
									return value.study;
							});
						} else {
							this._wordsToLearn = [];
						}
					}

					this._resetResult();
					this.nextQuestion();
				},

				_resetResult: function() {
					this._iCorrectAnswerCount = 0;
					this._iQuestionsCount = 0;
					this.getView().byId("resultQuiz").setText("");
				},

				_getNewQuestion: function() {
						if (this._wordsToLearn.length === 0) {
								return {
										error: true
								};
						}
						var oNewWord = this._getNextWord();
						var aNewOptions = this._getOptions(oNewWord);
						this._shaffle(aNewOptions);
						return {
								word: oNewWord.Infinitiv,
								options: aNewOptions
						};
				},

				_getNextWord: function() {
						var iNewIndex = Math.floor(Math.random() * this._wordsToLearn.length);
						if (iNewIndex === this._lastIndex) {
								iNewIndex = (iNewIndex + 1) % this._wordsToLearn.length;
						}
						this._lastIndex = iNewIndex;
						return this._wordsToLearn[iNewIndex];
				},

				_getOptions: function(oWord) {
						var sCorrectWord = oWord.Praeteritum;

						var iStartIndex = 0;
						var iLength = 0;
						//find first vowel and length
						//TODO: change search and make simpler
						for (var i = 0; i < sCorrectWord.length; i++) {
								var sCharacter = sCorrectWord.charAt(i);
								if (this._aVowels.indexOf(sCorrectWord.charAt(i)) > -1) {
										iStartIndex = i;
										if (this._aVowels.indexOf(sCorrectWord.charAt(iStartIndex + 1)) > -1) {
												iLength = 2;
										} else {
												iLength = 1;
										}
										break;
								}
						}

						var sFirstWordVowel = sCorrectWord.substr(iStartIndex, iLength);
						var oResult = [];
						oResult.push({
								text: sCorrectWord,
								correct: true
						});

						var iIndexOptions = this._aLetters.indexOf(sFirstWordVowel);
						for (var i = 1; i < 4; i++) {
								var nextIndex = (iIndexOptions + i) % 6;
								var option = String(sCorrectWord).replace(sFirstWordVowel, this._aLetters[nextIndex]);
								oResult.push({
										text: option,
										correct: false
								});
						}

						return oResult;
				},



				_shaffle: function(array) {
						var currentIndex = array.length,
								temporaryValue, randomIndex;
						while (0 !== currentIndex) {
								randomIndex = Math.floor(Math.random() * currentIndex);
								currentIndex = currentIndex - 1;
								temporaryValue = array[currentIndex];
								array[currentIndex] = array[randomIndex];
								array[randomIndex] = temporaryValue;
						}
						return array;
				},

				_setAllButtonEnabled: function(bValue) {
					var aButtons = this.getView().getControlsByFieldGroupId("answerButton");
					aButtons.forEach(function(button) {
						button.setEnabled(bValue);
					})
				},

				_removeHelpClasses: function() {
					var aButtons = this.getView().getControlsByFieldGroupId("answerButton");
					aButtons.forEach(function(button) {
						button.removeStyleClass("quiz-button-success");
						button.removeStyleClass("quiz-button-error");
					})
				},

				onAnswer: function(oEvent) {
						this._iQuestionsCount = this._iQuestionsCount + 1;

						var timer = 1000;
						var oPressedButton = oEvent.getSource();
						var sButtonId = oPressedButton.getId();
						var oModelOptions = this.getView().getModel("question").getData().options;

						if (oModelOptions[parseInt(sButtonId.split("option_")[1])].correct) {
								this._iCorrectAnswerCount = this._iCorrectAnswerCount + 1;
								oPressedButton.addStyleClass("quiz-button-success");
						} else {
							oPressedButton.addStyleClass("quiz-button-error");
							for (var i = 0; i < oModelOptions.length; i++) {
								if (oModelOptions[i].correct) {
									this.getView().byId("option_" + i).addStyleClass("quiz-button-success");
									timer = 2500;
									break;
								}
							}
						}
						this._setAllButtonEnabled(false);

						var oBundle = this.getView().getModel("i18n").getResourceBundle();
		        var sMsg = oBundle.getText("quiz.result", [this._iCorrectAnswerCount, this._iQuestionsCount]);
						this.getView().byId("resultQuiz").setText(sMsg);

						setTimeout(this.nextQuestion.bind(this), timer);
				},

				nextQuestion: function() {
						this._removeHelpClasses();
						this._setAllButtonEnabled(true);
						var oNewQuestion = this._getNewQuestion();
						this.getView().getModel("question").setData(oNewQuestion, false);
				},

				handleToOverview: function(oEvent) {
					sap.ui.core.UIComponent.getRouterFor(this).navTo("overview");
				}

		});

});

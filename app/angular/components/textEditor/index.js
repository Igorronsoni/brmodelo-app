import angular from "angular";
import template from "./index.html";
import codeMirror from "./codeMirror";
import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple.js";
import "./index.scss";

const textEditor = function ($scope, $timeout) {
	this.cmdText = "";
	let debounceTimeout = null;
	
  this.$onInit = () => {
		this.modeName = "customMode_" + Math.random().toString(36).substr(2, 5);

		const tokens = Array.isArray(this.tokens) ? this.tokens : [];

		CodeMirror.defineSimpleMode(this.modeName, {
			start: tokens
				.map((t) => ({
					regex: new RegExp(t.regex),
					token: t.token,
				}))
				.concat([
					{
						regex: /\s+/,
						token: null,
					},
					{
						regex: /./,
						token: null,
					},
				]),
		});

		this.modeToUse = this.modeName;
	};

	this.onCmdChange = function () {
		if (debounceTimeout) {
      $timeout.cancel(debounceTimeout);
    }

    debounceTimeout = $timeout(() => {
      this.interpret(this.cmdText);
    }, 1000);
	};

  this.interpret = function(code) {
    console.log("Interpretando código:", code);
  };

};
textEditor.$inject = ["$scope", "$timeout"];

export default angular
	.module("app.textEditor", [codeMirror])
	.component("textEditor", {
		template,
		controller: textEditor,
		bindings: {
			tokens: "<",
		},
	}).name;

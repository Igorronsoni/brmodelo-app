import angular from "angular";
import template from "./index.html";
import codeMirror from "./codeMirror";
import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple.js";
import "./index.scss";
const nearley = require("nearley");

const textEditor = function ($scope, $timeout) {
	this.text = "";
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
						regex: /\/\/.*/,
						token: "comment",
					},
					{
						regex: /\/\*/,
						token: "comment",
						next: "commentBlock",
					},
					{
						regex: /\s+/,
						token: null,
					},
					{
						regex: /./,
						token: null,
					},
				]),

			commentBlock: [
				{
					regex: /.*?\*\//,
					token: "comment",
					next: "start",
				},
				{
					regex: /.*/,
					token: "comment",
				},
			],
		});

		if (this.grammar) {
			try {
				this.myGrammar = nearley.Grammar.fromCompiled(this.grammar);
				this.lexer = this.myGrammar.lexer;
			} catch (e) {
				console.error("Erro ao carregar o grammar:", e.message);
			}
		}

		this.modeToUse = this.modeName;
	};

	this.onChange = function () {
		if (debounceTimeout) {
			$timeout.cancel(debounceTimeout);
		}

		debounceTimeout = $timeout(() => {
			if (this.interpreter && this.grammar) {
				let result = null;
				try {
					const parser = new nearley.Parser(this.myGrammar, {
						lexer: this.lexer,
					});
					parser.feed(this.text);
					result = { data: parser.results[0], error: false };
				} catch (e) {
          result = { data: null, error: true };
				}
				return this.interpreter(result);
			}
		}, 1000);
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
			interpreter: "<",
			grammar: "<",
		},
	}).name;

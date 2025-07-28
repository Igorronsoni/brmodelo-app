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
	let clearErrorTimeout = null;

	this.$onInit = () => {
		this.modeName = "customMode_" + Math.random().toString(36).substr(2, 5);
		this.syntaxError = null;

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
					this.syntaxError = null;
				} catch (e) {
					const formatted = this.formatError(e);
					this.syntaxError = formatted;
					this.resetError();
					result = { data: this.formatError(e), error: true };
				}
				if (this.interpreter) {
					this.interpreter(result);
				}
				$scope.$applyAsync();
			}
		}, 1000);
	};

	this.formatError = function (err) {
		if (err.token && err.token.line && err.token.col) {
			return `Syntax error at line ${err.token.line} col ${
				err.token.col
			}:\nUnexpected ${err.token.type} token: "${
				err.token.text || err.token.value
			}"`;
		}

		return `Syntax error: Unexpected token "${err.token && err.token.value}"`;
	};

	this.resetError = function () {
		if (clearErrorTimeout) {
			$timeout.cancel(clearErrorTimeout);
		}
		clearErrorTimeout = $timeout(() => {
			this.syntaxError = null;
			$scope.$applyAsync();
		}, 5000);
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

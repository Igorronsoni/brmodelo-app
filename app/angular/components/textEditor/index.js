import angular from "angular";
import template from "./index.html";
import "./index.scss";
import codeMirror from "./codeMirror";

const textEditor = function ($scope) {
	this.cmdText = "";

  this.onCmdChange = function () {
    console.log(this.cmdText);
  };
	
};
textEditor.$inject = ["$scope"];

export default angular.module("app.textEditor", [codeMirror]).component("textEditor", {
	template,
	controller: textEditor,
}).name;

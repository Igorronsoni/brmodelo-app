import angular from "angular";

const codeMirror = angular.module('app.codeMirror', [])
  .directive('codeMirror', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: {
        mode: '@?',
        theme: '@?',
        options: '<?'
      },
      template: '<textarea></textarea>',
      link: function(scope, element, attrs, ngModel) {
        const textarea = element.find('textarea')[0];
        const config = angular.extend({
          lineNumbers: true,
          mode: scope.mode || 'javascript',
          lineWrapping: true,
          theme: scope.theme || 'default'
        }, scope.options);

        const editor = CodeMirror.fromTextArea(textarea, config);
        editor.getWrapperElement().classList.add('my-code-mirror');

        $timeout(() => {
          editor.refresh();
        }, 0);

        editor.on('change', function(cm) {
          scope.$applyAsync(() => {
            ngModel.$setViewValue(cm.getValue());
          });
        });

        ngModel.$render = function() {
          const safeValue = ngModel.$viewValue || '';
          if (safeValue !== editor.getValue()) {
            editor.setValue(safeValue);
          }
        };
      }
    };
  }]);

export default codeMirror.name;

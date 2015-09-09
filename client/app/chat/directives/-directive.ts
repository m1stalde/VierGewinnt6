///<reference path='../../../typings/tsd.d.ts' />
module  {
  'use strict';

  /**
  * @ngdoc directive
  * @name chat.directive:
  * @restrict EA
  * @element
  *
  * @description
  *
  * @example
    <example module="chat">
      <file name="index.html">
        <></>
      </file>
    </example>
  *
  */
  angular
    .module('chat')
    .directive('', );

  function (): ng.IDirective {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'chat/directives/-directive.tpl.html',
      replace: false,
      controllerAs: '',
      controller: function () {
        var vm = this;
        vm.name = '';
      },
      link: function (scope: ng.IScope, element: JQuery, attrs: any) {
        /*jshint unused:false */
        /*eslint "no-unused-vars": [2, {"args": "none"}]*/
      }
    };
  }
}

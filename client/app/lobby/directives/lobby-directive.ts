module lobby.directives {
  "use strict";
  export class StopEvent implements ng.IDirective{
    restrict = 'A';

    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }

    public static factory(): ng.IDirectiveFactory {
      var directive = () => new StopEvent();
      //directive.$inject = [];
      return directive;
    }
  }
}

angular
  .module('lobby')
  .directive('stopEvent', lobby.directives.StopEvent.factory());

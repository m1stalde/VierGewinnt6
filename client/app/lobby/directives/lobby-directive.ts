module lobby.directives {
  "use strict";
  export class StopEvent implements ng.IDirective{
    public restrict = 'A';

    public static DirectoryName = "stopEvent";

    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }

    public static factory(): ng.IDirectiveFactory {
      var directive = () => new StopEvent();
      return directive;
    }
  }

  export class RoomValidator implements ng.IDirective{
    public restrict = 'A';
    public require = 'ngModel';

    public static DirectoryName = "room";

    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl : IRoomValidation) => {
      ctrl.$validators.room = function(modelValue, viewValue) {
        var ROOM_REGEXP = /^\w+$/;

      if (ROOM_REGEXP.test(viewValue)) {
          return true;
        }

        return false;
      };
    }


    public static factory(): ng.IDirectiveFactory {
      var directive = () => new RoomValidator();
      return directive;
    }
  }

  export class ActionMessageDisplay implements ng.IDirective{
    public restrict = 'E';
    public transclude = true;
    public scope = {}
    public templateUrl = "/lobby/directives/action-message.html"

    public static DirectoryName = "actionMessageDisplay";

    public link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl : IRoomValidation) => {
        var k = 4;
    }

    public static factory(): ng.IDirectiveFactory {
      var directive = () => new ActionMessageDisplay();
      return directive;
    }
  }

  interface IRoomValidation extends ng.INgModelController {
    $validators : {
      room(modelValue : string, viewValue : string);
    }
  }
}

angular
  .module('lobby')
  .directive(lobby.directives.StopEvent.DirectoryName, lobby.directives.StopEvent.factory())
  .directive(lobby.directives.RoomValidator.DirectoryName, lobby.directives.RoomValidator.factory())
  .directive(lobby.directives.ActionMessageDisplay.DirectoryName, lobby.directives.ActionMessageDisplay.factory());




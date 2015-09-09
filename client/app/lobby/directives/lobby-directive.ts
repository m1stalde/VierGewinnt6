module lobby.directives {
  "use strict";
  export class StopEvent implements ng.IDirective {
    public restrict = 'A';
    public static DirectoryName = "stopEvent";

    public link = (scope:ng.IScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {
      element.bind('click', function (e) {
        e.stopPropagation();
      });
    }

    public static factory():ng.IDirectiveFactory {
      var directive = () => new StopEvent();
      return directive;
    }
  }

  export class RoomValidator implements ng.IDirective {
    public restrict = 'A';
    public require = 'ngModel';
    public static DirectoryName = "room";

    public link = (scope:ng.IScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ctrl:IRoomValidation) => {
      ctrl.$validators.room = function (modelValue, viewValue) {
        var ROOM_REGEXP = /^\w+$/;

        if (ROOM_REGEXP.test(viewValue)) {
          return true;
        }

        return false;
      };
    }


    public static factory():ng.IDirectiveFactory {
      var directive = () => new RoomValidator();
      return directive;
    }
  }

  export class ActionMessageDisplay implements ng.IDirective {
    public restrict = 'E';
    public static DirectoryName = "actionMessageDisplay";
    public transclude = true;
    public templateUrl = "/lobby/directives/action-message.html";
    private $timeout;

    constructor($timeout) {
      this.$timeout = $timeout;
    }

    public link = ($scope:lobby.controllers.ILobby, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ctrl:IRoomValidation) => {
      $scope.$watch(() => {
        return $scope.lobby.actionMessage;
      }, (newValue:lobby.controllers.IActionMessage, oldValue:lobby.controllers.IActionMessage) => {
        if (oldValue.isError === null && newValue.isError !== null) {
          if (newValue.isError) { // Error
            element.find('div:first').addClass('message-panel-error');
          } else if (!newValue.isError) {
            element.find('div:last').addClass('message-panel-success');
          }
          this.$timeout(function () {
            $scope.lobby.actionMessage.isError = null;
          }, 5000)
        }
      })
    }

    public static factory():ng.IDirectiveFactory {
      var directive = ($timeout) => new ActionMessageDisplay($timeout);
      directive.$inject = ['$timeout'];
      return directive;
    }
  }

  interface IRoomValidation extends ng.INgModelController {
    $validators : ICustomValidator;
  }

  interface ICustomValidator extends ng.IModelValidators {
    room(modelValue:string, viewValue:string) : boolean;
  }
}

angular
  .module('lobby')
  .directive(lobby.directives.StopEvent.DirectoryName, lobby.directives.StopEvent.factory())
  .directive(lobby.directives.RoomValidator.DirectoryName, lobby.directives.RoomValidator.factory())
  .directive(lobby.directives.ActionMessageDisplay.DirectoryName, lobby.directives.ActionMessageDisplay.factory());




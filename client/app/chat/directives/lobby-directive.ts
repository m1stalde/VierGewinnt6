module chat.directives {
  "use strict";
  export class ChatWindow implements ng.IDirective {
    public restrict = 'E'
    public static DirectoryName = "chatWindow";
    private messageService : Common.Services.IMessageService;

    constructor(messageService : Common.Services.IMessageService){
      this.messageService = messageService;
    }

    public link = (scope:ng.IScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) => {

    }

    public static factory():ng.IDirectiveFactory {
      var directive = (messageService) => new ChatWindow(messageService);
      directive.$inject = ['MessageService'];
      return directive;
    }
  }
}

angular
  .module('lobby')
  .directive(chat.directives.ChatWindow.DirectoryName, chat.directives.ChatWindow.factory());



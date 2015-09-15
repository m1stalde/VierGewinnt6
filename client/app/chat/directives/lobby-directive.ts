module chat.directives {
  "use strict";
  export class ChatWindow implements ng.IDirective {
    public restrict = 'E'
    public static DirectoryName = "chatWindow";
    public scope =  {
      chatModel : '=',
      chatSection : '='
    }

    constructor(){}

    public link(scope : chat.controllers.IChatScope, element : ng.IAugmentedJQuery, attrs : ng.IAttributes) {

      // Subscribe the chat for the particular section
      scope.chatModel.subscribeToChatSection("Chat" + scope.chatSection)
    }

    public static factory():ng.IDirectiveFactory {
      var directive = () => new ChatWindow();
      directive.$inject = [];
      return directive;
    }
  }
}

angular
  .module('chat')
  .directive(chat.directives.ChatWindow.DirectoryName, chat.directives.ChatWindow.factory());



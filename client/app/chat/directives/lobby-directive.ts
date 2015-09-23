module chat.directives {
  "use strict";
  export class ChatWindow implements ng.IDirective {
    public restrict = 'E'
    public static DirectoryName = "chatWindow";
    public scope = {
      chatModel: '=',
      chatSection: '@chatSection'
    }

    // template function => replaces the content of the directory with its return value => hack to enable dynamic template loading
    // in response triggers the getTemplateUrl() function of the scope
    public template(element : ng.IAugmentedJQuery, attrs : IChatWindowAtributes) {
      return '<div ng-include="getTemplateUrl()"></div>';
    }

    constructor() {
    }

    public link(scope:chat.controllers.IChatScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) {

      // Store the section in the controller
      scope.chatModel.storeChatSectionInCtrl(scope.chatSection);

      // Subscribe the chat for the particular section
      scope.chatModel.subscribeToChatSectionEvents(scope.chatSection);

      // Retrieve the chat history
      scope.chatModel.fetchChatHistory(scope.chatSection);

      // retrieve the template for the chat
      scope.getTemplateUrl = () => {
        return "/chat/directives/" + scope.chatSection + "-chat-window-template.html";
      }
    }


    public static factory():ng.IDirectiveFactory {
      var directive = () => new ChatWindow();
      directive.$inject = [];
      return directive;
    }
  }

  interface IChatWindowAtributes extends ng.IAttributes {
    chatSection : string;
  }

  angular
    .module('chat')
    .directive(chat.directives.ChatWindow.DirectoryName, chat.directives.ChatWindow.factory());
}



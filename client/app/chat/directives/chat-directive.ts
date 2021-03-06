module chat.directives {
  "use strict";
  export class ChatWindow implements ng.IDirective {
    public restrict = 'E'
    public static DirectoryName = "chatWindow";
    public scope = {
      chatModel: '=',
      chatSection: '@chatSection',
      id: '='
    }

    public templateUrl = "chat/views/chat-window-template.html";
    public currentMessage : chat.controllers.IChatMessage;

    public link(scope:chat.controllers.IChatScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes) {

      scope.sendMessage = function(message : chat.controllers.IChatMessage){
        scope.chatModel.sendMessage(message);
        this.currentMessage = "";
      };

      scope.inputBoxKeypress = function(e){
        if( e.which === 13) // Enter
        {
          var chatMsg = {
            message : $('#msgInput').val()
          };

          $('#msgInput').val('');
          scope.chatModel.sendMessage(chatMsg);
        }
      };

      // For directive implementations which don't use an attribute of id
      scope.id = angular.isUndefined(scope.id) ? "" : scope.id;

      // Store the section in the controller
      scope.chatModel.storeChatSectionDataInCtrl(scope.chatSection, scope.id);

      // Subscribe the chat for the particular section
      scope.chatModel.subscribeToChatSectionEvents(scope.chatSection);

      // Retrieve the chat history
      scope.chatModel.fetchChatHistory(scope.chatSection, scope.id);

      // Gets triggered as soon as the directive gets destroyed
      scope.$on('$destroy', function() {
        // Subscribe the chat for the particular section
        scope.chatModel.unsubscribeToChatSectionEvents(scope.chatSection, scope.id);
      });

      scope.$watchCollection(
        function(){
          return scope.chatModel.chatHistory
        },
        function(newChatHistory :  Array<chat.controllers.IChatMessage>, oldChatHistory :  Array<chat.controllers.IChatMessage>){
          // Delete existing records
          var chatWindowDiv : JQuery = $('.chat-output');

          if(newChatHistory !== oldChatHistory){
            // Load the whole chat history
            if(oldChatHistory.length === 0){
              chatWindowDiv.empty();

              for (var i = 0; i < newChatHistory.length; ++i) {
                chatWindowDiv.append($('<span><strong>[' +  newChatHistory[i].creationDate + '&nbsp' + newChatHistory[i].from + ']</strong>&nbsp' +  newChatHistory[i].message + '<br></span>'));
              }
            } else { // Just add a single message to the chat history
              var index = newChatHistory.length - 1;
              chatWindowDiv.append($('<span><strong>[' +  newChatHistory[index].creationDate + '&nbsp' + newChatHistory[index].from + ']</strong>&nbsp' +  newChatHistory[index].message + '<br></span>'));
            }
          }
        })
    }

    public static factory():ng.IDirectiveFactory {
      var directive = () => new ChatWindow();
      directive.$inject = [];
      return directive;
    }
  }

  angular
    .module('chat')
    .directive(chat.directives.ChatWindow.DirectoryName, chat.directives.ChatWindow.factory());
}

interface IChatWindowAtributes extends ng.IAttributes {
  chatSection : string;
}



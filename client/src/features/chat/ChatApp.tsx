'use client'

import { useChat } from './hooks/useChat'
import { ChatHeader } from './ui/ChatHeader'
import { MessageList } from './ui/MessageList'
import { ChatInput } from './ui/ChatInput'

export const ChatApp = () => {
  const {
    messages,
    inputText,
    setInputText,
    language,
    setLanguage,
    isProcessing,
    messagesEndRef,
    sendMessage,
    handleKeyPress,
    clearChat,
  } = useChat()

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHeader
        language={language}
        setLanguage={setLanguage}
        onClearChat={clearChat}
      />
      
      <MessageList
        messages={messages}
        messagesEndRef={messagesEndRef}
      />
      
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
        isProcessing={isProcessing}
      />
    </div>
  )
} 
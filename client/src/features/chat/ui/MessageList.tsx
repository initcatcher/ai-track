import { Message } from '../entities'
import { MessageBubble } from './Bubble'

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-lg">AI와 채팅을 시작하세요!</p>
            <p className="text-sm mt-2">궁금한 것을 무엇이든 물어보세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 
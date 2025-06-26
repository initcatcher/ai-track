'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  timestamp: Date
  isUser: boolean
  isLoading?: boolean
}

interface Language {
  code: string
  name: string
}

const LANGUAGES: Language[] = [
  { code: 'Korean', name: '한국어' },
  { code: 'English', name: 'English' },
  { code: 'Japanese', name: '日本語' },
  { code: 'Chinese', name: '中문' },
  { code: 'French', name: 'Français' },
  { code: 'German', name: 'Deutsch' },
  { code: 'Spanish', name: 'Español' },
  { code: 'Russian', name: 'Русский' },
]

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [language, setLanguage] = useState('Korean')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessageToAI = async (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const controller = new AbortController()
      let aiResponse = ''

      fetch(`${API_BASE_URL}/api/chat/stream-sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
        }),
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          if (!response.body) {
            throw new Error('Response body is null')
          }

          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          const readStream = async () => {
            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                resolve(aiResponse.trim())
                break
              }

              const chunk = decoder.decode(value, { stream: true })
              const lines = chunk.split('\n')

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6).trim()
                  if (data && data !== '[DONE]') {
                    aiResponse += data
                  }
                }
              }
            }
          }

          readStream().catch(reject)
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            resolve(aiResponse.trim() || 'AI 응답이 중단되었습니다.')
          } else {
            reject(err)
          }
        })
    })
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return

    const userMessageId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const userMessage: Message = {
      id: userMessageId,
      text: inputText.trim(),
      timestamp: new Date(),
      isUser: true,
    }

    setMessages((prev) => [...prev, userMessage])
    const originalText = inputText.trim()
    setInputText('')
    setIsProcessing(true)

    try {
      // AI 응답 메시지 추가 (로딩 상태)
      const aiMessageId =
        Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const aiMessage: Message = {
        id: aiMessageId,
        text: '',
        timestamp: new Date(),
        isUser: false,
        isLoading: true,
      }

      setMessages((prev) => [...prev, aiMessage])

      // AI 응답 생성
      const aiResponseText = await sendMessageToAI(originalText)

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: aiResponseText, isLoading: false }
            : msg
        )
      )
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id && !msg.isUser && msg.isLoading) {
            return {
              ...msg,
              text: 'AI 응답 중 오류가 발생했습니다.',
              isLoading: false,
            }
          }
          return msg
        })
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="홈으로"
            >
              ← 홈
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI 채팅
            </h1>
          </div>

          {/* 언어 선택 */}
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                채팅 언어:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearChat}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              채팅 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-lg">AI와 채팅을 시작하세요!</p>
              <p className="text-sm mt-2">궁금한 것을 무엇이든 물어보세요.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg p-3 shadow-md ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {/* 발신자 표시 */}
                  <div
                    className={`text-xs mb-1 ${
                      message.isUser
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.isUser ? '나' : 'AI'}
                  </div>

                  {/* 메시지 내용 */}
                  <div className="font-medium">
                    {message.isLoading ? (
                      <div
                        className={`flex items-center space-x-2 ${
                          message.isUser
                            ? 'text-blue-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <div
                          className={`animate-spin w-4 h-4 border-2 rounded-full ${
                            message.isUser
                              ? 'border-blue-200 border-t-transparent'
                              : 'border-gray-300 border-t-transparent dark:border-gray-500'
                          }`}
                        ></div>
                        <span className="text-sm">AI가 답변 중...</span>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>

                  {/* 시간 정보 */}
                  <div
                    className={`text-xs mt-2 ${
                      message.isUser
                        ? 'text-blue-200'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-end"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>전송</span>
                </div>
              ) : (
                '전송'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

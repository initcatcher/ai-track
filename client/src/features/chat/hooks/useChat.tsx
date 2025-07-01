'use client'
import { useState, useRef, useEffect } from 'react'
import { Message } from '../entities'
import { sendMessageToAI } from '../api'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [language, setLanguage] = useState('Korean')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
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

      // AI 응답 생성 (스트리밍)
      const aiResponseText = await sendMessageToAI(
        { message: originalText, language },
        (partialResponse) => {
          // 실시간으로 메시지 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: partialResponse, isLoading: false }
                : msg
            )
          )
        }
      )

      // 최종 응답으로 한 번 더 업데이트 (완료 상태)
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
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  return {
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
  }
}

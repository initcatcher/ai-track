'use client'
import Link from "next/link"
import { useState } from "react"

export const Homepage = () => {
    const [message, setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: 라우팅 로직 구현 예정
        console.log("메시지:", message)
    }

    const exampleQuestions = [
        "오늘 하루는 어땠어?",
        "요즘 어떤 일로 바빠?",
        "주말에 뭐 하고 싶어?",
        "좋아하는 음식이 뭐야?",
        "스트레스 받을 때는 어떻게 해?",
        "꿈이 뭐야?"
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
            <div className="max-w-4xl w-full">
                {/* 헤더 영역 */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💕</div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        연애인 유재석
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        국민 MC와 편안하고 재미있는 대화를 나눠보세요
                    </p>
                </div>

                {/* 메인 입력 영역 */}
                <div className="mb-8">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="유재석에게 하고 싶은 말을 적어보세요..."
                                className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         resize-none min-h-[120px] text-base
                                         placeholder-gray-500 dark:placeholder-gray-400"
                                rows={4}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="absolute bottom-3 right-3 p-2 bg-blue-500 hover:bg-blue-600 
                                         disabled:bg-gray-300 disabled:cursor-not-allowed
                                         text-white rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* 예시 질문들 */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                        이런 것들을 물어보세요
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {exampleQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => setMessage(question)}
                                className="p-3 text-left bg-white dark:bg-gray-800 rounded-lg 
                                         border border-gray-200 dark:border-gray-700
                                         hover:bg-gray-50 dark:hover:bg-gray-700
                                         transition-colors duration-200 text-sm
                                         text-gray-700 dark:text-gray-300"
                            >
                                "{question}"
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하단 정보 */}
                <div className="text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl mb-2">🎤</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    자연스러운 대화
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    유재석의 말투와 유머로 대화
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">😊</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    긍정적인 에너지
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    따뜻하고 유쾌한 대화 상대
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl mb-2">💝</div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                    연애 상담
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    경험 많은 MC의 조언
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
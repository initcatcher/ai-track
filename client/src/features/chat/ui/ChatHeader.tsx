import Link from 'next/link'
import { LANGUAGES, Language } from '../entities'

interface ChatHeaderProps {
  language: string
  setLanguage: (language: string) => void
  onClearChat: () => void
}

export const ChatHeader = ({ language, setLanguage, onClearChat }: ChatHeaderProps) => {
  return (
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
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💕</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                연애인 유재석
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                국민 MC와 따뜻한 대화를 나눠보세요
              </p>
            </div>
          </div>
        </div>

        {/* 언어 선택 */}
        <div className="flex items-center space-x-4 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              대화 언어:
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
            onClick={onClearChat}
            className="ml-auto px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
          >
            대화 초기화
          </button>
        </div>
      </div>
    </div>
  )
} 
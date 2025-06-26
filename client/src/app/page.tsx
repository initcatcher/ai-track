import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI 서비스
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          번역, 채팅, 개발 도구를 하나의 플랫폼에서
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 번역기 카드 */}
          <Link href="/translate" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🌍</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                실시간 번역기
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                텍스트를 입력하면 실시간으로 원하는 언어로 번역
              </p>
              <div className="text-blue-500 group-hover:text-blue-600 font-medium">
                번역하기 →
              </div>
            </div>
          </Link>

          {/* 채팅 카드 */}
          <Link href="/chat" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">💬</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI 채팅
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                AI와 자연스럽게 대화하며 궁금한 것을 물어보세요
              </p>
              <div className="text-blue-500 group-hover:text-blue-600 font-medium">
                채팅하기 →
              </div>
            </div>
          </Link>

          {/* 데모 페이지 카드 */}
          <Link href="/demo" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔧</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                API 데모 & 테스트
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                SSE와 스트리밍 API의 작동을 확인할 수 있는 개발자 도구
              </p>
              <div className="text-blue-500 group-hover:text-blue-600 font-medium">
                데모 보기 →
              </div>
            </div>
          </Link>
        </div>

        {/* 기능 소개 */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            주요 기능
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-medium text-gray-900 dark:text-white">
                실시간 처리
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                스트리밍으로 즉시 결과 확인
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🌍</div>
              <div className="font-medium text-gray-900 dark:text-white">
                다국어 지원
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                8개 주요 언어 완벽 지원
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-900 dark:text-white">
                고품질 AI
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                GPT-4o 기반 정확한 처리
              </div>
            </div>
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
            시작하기
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-300">
            <div className="text-center">
              <div className="font-medium mb-1">1. 서비스 선택</div>
              <div>번역, 채팅, 개발 도구 중 원하는 기능을 선택하세요</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">2. 언어 설정</div>
              <div>사용할 언어를 선택하고 설정을 조정하세요</div>
            </div>
            <div className="text-center">
              <div className="font-medium mb-1">3. 바로 사용</div>
              <div>텍스트를 입력하면 즉시 결과를 확인할 수 있습니다</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

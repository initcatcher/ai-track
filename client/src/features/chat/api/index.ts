// chat 관련 api 모음

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface SendMessageRequest {
  message: string
  language: string
}

export const sendMessageToAI = async (
  request: SendMessageRequest,
  onChunk: (chunk: string) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const controller = new AbortController()
    let aiResponse = ''

    fetch(`${API_BASE_URL}/api/chat/stream-sse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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
                  // 실시간으로 UI 업데이트
                  onChunk(aiResponse)
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
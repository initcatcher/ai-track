# AI Track - 실시간 AI 번역 및 채팅 애플리케이션

AI 번역과 채팅 기능을 제공하는 풀스택 웹 애플리케이션입니다. FastAPI 백엔드와 Next.js 프론트엔드로 구성되어 있으며, OpenAI GPT 모델을 활용한 실시간 스트리밍 기능을 제공합니다.

## 📋 프로젝트 개요

- **백엔드**: FastAPI + Python (UV 패키지 매니저)
- **프론트엔드**: Next.js 15 + React 19 + TypeScript
- **AI 모델**: OpenAI GPT-4o-mini (LangChain 통합)
- **실시간 통신**: Server-Sent Events (SSE)
- **스타일링**: Tailwind CSS 4.0

## 🚀 빠른 시작

### 1️⃣ 사전 준비사항

다음 도구들이 설치되어 있어야 합니다:

- **Node.js 18+** (프론트엔드용)
- **Python 3.12+** (백엔드용)
- **UV** (Python 패키지 매니저)
- **PNPM** (Node.js 패키지 매니저)
- **OpenAI API 키**

#### UV 설치 (Python 패키지 매니저)

```bash
# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

#### PNPM 설치 (Node.js 패키지 매니저)

```bash
npm install -g pnpm
```

### 2️⃣ 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# .env
OPENAI_API_KEY=your_openai_api_key_here
```

> ⚠️ **중요**: OpenAI API 키가 없으면 애플리케이션이 작동하지 않습니다. [OpenAI 플랫폼](https://platform.openai.com/api-keys)에서 발급받으세요.

### 3️⃣ 백엔드 서버 설정 및 실행

```bash
# server 디렉토리로 이동
cd server

# 의존성 설치 (uv가 자동으로 가상환경 생성)
uv sync

# 서버 실행
uv run main.py
```

서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:

```
메모리 캐시가 활성화되었습니다.
FastAPI 애플리케이션이 시작되었습니다.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 4️⃣ 프론트엔드 클라이언트 설정 및 실행

새 터미널을 열고:

```bash
# client 디렉토리로 이동
cd client

# 의존성 설치
pnpm install

# 개발 서버 실행 (Turbopack 사용)
pnpm dev
```

브라우저에서 http://localhost:3000 으로 접속하세요.

## 🌐 API 엔드포인트

### 백엔드 서버 (http://localhost:8000)

- `GET /` - API 정보 및 엔드포인트 목록
- `GET /api/health` - 헬스 체크
- `POST /api/translate/stream-sse` - 실시간 번역 (SSE)
- `POST /api/chat/stream-sse` - AI 채팅 (SSE)
- `GET /docs` - Swagger UI 문서

### 프론트엔드 페이지 (http://localhost:3000)

- `/` - 메인 페이지
- `/translate` - 번역 기능
- `/chat` - AI 채팅 기능
- `/demo` - 데모 페이지

## 🛠️ 개발 가이드

### 프로젝트 구조

```
ai-track/
├── client/                 # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/           # App Router 페이지
│   │   └── components/    # 재사용 가능한 컴포넌트
│   ├── public/            # 정적 파일
│   └── package.json       # 프론트엔드 의존성
│
├── server/                 # FastAPI 백엔드
│   ├── main.py           # 메인 애플리케이션
│   ├── pyproject.toml    # Python 프로젝트 설정
│   └── uv.lock           # 의존성 락 파일
│
└── README.md              # 이 파일
```

### 백엔드 개발

#### 새로운 의존성 추가

```bash
cd server
uv add 패키지명
```

#### 개발 모드로 서버 실행

```bash
cd server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 환경 확인

- Python 버전: `python --version` (3.12+ 필요)
- UV 버전: `uv --version`
- 의존성 확인: `uv pip list`

### 프론트엔드 개발

#### 새로운 의존성 추가

```bash
cd client
pnpm add 패키지명
```

#### 개발 도구

```bash
cd client

# 타입 체크
pnpm build

# 린팅
pnpm lint

# 프로덕션 빌드
pnpm build && pnpm start
```

#### 환경 변수 설정 (클라이언트)

`client/.env.local` 파일을 생성하여 환경별 설정:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 문제 해결

### 자주 발생하는 문제들

#### 1. OpenAI API 키 오류

```
경고: OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.
```

**해결방법**: 프로젝트 루트에 `.env` 파일을 생성하고 유효한 OpenAI API 키를 입력하세요.

#### 2. 포트 충돌 문제

```
Error: listen EADDRINUSE: address already in use :::8000
```

**해결방법**: 다른 프로세스가 포트를 사용 중입니다. 포트를 변경하거나 프로세스를 종료하세요.

#### 3. CORS 오류

**해결방법**: 백엔드에서 이미 CORS가 설정되어 있습니다. 브라우저 캐시를 삭제해보세요.

#### 4. UV 명령어를 찾을 수 없음

```
'uv' is not recognized as an internal or external command
```

**해결방법**: UV를 재설치하고 PATH 환경변수를 확인하세요.

### 로그 확인

#### 백엔드 로그

서버 터미널에서 실시간으로 요청/응답 로그를 확인할 수 있습니다.

#### 프론트엔드 로그

브라우저 개발자 도구(F12) → Console 탭에서 확인할 수 있습니다.

## 📦 배포

### 프로덕션 환경 설정

1. **환경 변수 설정**

   ```bash
   export OPENAI_API_KEY=your_actual_api_key
   ```

2. **백엔드 배포**

   ```bash
   cd server
   uv sync
   uv run uvicorn main:app --host 0.0.0.0 --port 8000
   ```

3. **프론트엔드 빌드 및 배포**
   ```bash
   cd client
   pnpm install
   pnpm build
   pnpm start
   ```

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋하세요 (`git commit -am '새기능 추가'`)
4. 브랜치에 푸시하세요 (`git push origin feature/새기능`)
5. Pull Request를 생성하세요

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

🚀 **즐거운 개발되세요!** 질문이나 문제가 있으시면 이슈를 생성해주세요.

import os
from typing import AsyncGenerator
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

app = FastAPI(title="AI Translation Streaming API", version="1.0.0")

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영환경에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 메모리 캐시 설정
set_llm_cache(InMemoryCache())

class TranslationRequest(BaseModel):
    text: str
    source_language: str = "English"
    target_language: str = "French"

class ChatRequest(BaseModel):
    message: str
    language: str = "Korean"

@app.on_event("startup")
async def startup_event():
    """애플리케이션 시작 시 OpenAI API 키 확인"""
    if not os.environ.get("OPENAI_API_KEY"):
        # 서버 환경에서는 환경 변수로만 설정
        print("경고: OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
    else:
        print("메모리 캐시가 활성화되었습니다.")
        print("FastAPI 애플리케이션이 시작되었습니다.")

async def generate_translation_stream(text: str, source_lang: str, target_lang: str) -> AsyncGenerator[str, None]:
    """번역 스트리밍 생성기"""
    if not os.environ.get("OPENAI_API_KEY"):
        yield "data: {'error': 'OpenAI API key not configured'}\n\n"
        return
    
    try:
        llm = ChatOpenAI(
            model="o4-mini",
            service_tier="flex",
        )

        messages = [
            (
                "system",
                f"You are a helpful assistant that translates {source_lang} to {target_lang}. Translate the user text accurately and naturally. Only provide the translation, no additional text.",
            ),
            ("human", text),
        ]
        
        # 스트리밍 시작
        async for chunk in llm.astream(messages):
            if chunk.content:
                # Server-Sent Events 형식으로 전송
                yield f"data: {chunk.content}\n\n"
                
    except Exception as e:
        yield f"data: {{'error': '{str(e)}'}}\n\n"

async def generate_chat_stream(message: str, language: str) -> AsyncGenerator[str, None]:
    """AI 채팅 스트리밍 생성기"""
    if not os.environ.get("OPENAI_API_KEY"):
        yield "data: {'error': 'OpenAI API key not configured'}\n\n"
        return
    
    try:
        llm = ChatOpenAI(
            model="o4-mini",
            service_tier="flex",
        )

        messages = [
            (
                "system",
                f"You are a helpful and friendly AI assistant. Respond naturally and conversationally in {language}. Be helpful, engaging, and maintain a pleasant conversation.",
            ),
            ("human", message),
        ]
        
        # 스트리밍 시작
        async for chunk in llm.astream(messages):
            if chunk.content:
                # Server-Sent Events 형식으로 전송
                yield f"data: {chunk.content}\n\n"
                
    except Exception as e:
        yield f"data: {{'error': '{str(e)}'}}\n\n"

@app.post("/api/translate/stream")
async def stream_translation(request: TranslationRequest):
    """텍스트 번역 스트리밍 엔드포인트"""
    return StreamingResponse(
        generate_translation_stream(request.text, request.source_language, request.target_language),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )

@app.post("/api/translate/stream-sse")
async def stream_translation_sse(request: TranslationRequest):
    """Server-Sent Events 형식으로 번역 스트리밍"""
    return StreamingResponse(
        generate_translation_stream(request.text, request.source_language, request.target_language),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )

@app.post("/api/chat/stream-sse")
async def stream_chat_sse(request: ChatRequest):
    """AI 채팅 스트리밍 엔드포인트"""
    return StreamingResponse(
        generate_chat_stream(request.message, request.language),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )

@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "AI Translation & Chat Streaming API", 
        "endpoints": {
            "translate_stream": "/api/translate/stream",
            "translate_sse": "/api/translate/stream-sse",
            "chat_sse": "/api/chat/stream-sse",
            "docs": "/docs"
        }
    }

@app.get("/api/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "cache_enabled": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

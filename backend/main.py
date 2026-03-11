"""
Physical AI Textbook - RAG Chatbot Backend
FastAPI server with Qdrant vector DB and OpenAI ChatKit integration
"""

import os
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI Textbook Chatbot API",
    description="RAG-based chatbot API for the Physical AI & Humanoid Robotics textbook",
    version="1.0.0"
)

# CORS middleware - allow requests from Docusaurus site
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-github-username.github.io",
        "*"  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # For embeddings only
DATABASE_URL = os.getenv("DATABASE_URL")

# Use OpenRouter if available, otherwise fallback to OpenAI
USE_OPENROUTER = bool(OPENROUTER_API_KEY)

# Request/Response Models
class ChatMessage(BaseModel):
    message: str
    selected_text: Optional[str] = None
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[dict]
    conversation_id: str
    selected_text_used: bool = False

class DocumentChunk(BaseModel):
    text: str
    source: str
    chapter: str
    page_url: str

class IngestRequest(BaseModel):
    documents: List[DocumentChunk]

class HealthResponse(BaseModel):
    status: str
    qdrant_connected: bool
    openai_connected: bool
    database_connected: bool
    timestamp: str


# Initialize Database (SQLAlchemy)
try:
    from sqlalchemy import create_engine, text
    from sqlalchemy.orm import sessionmaker, declarative_base, Session

    if DATABASE_URL:
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        Base = declarative_base()
        DATABASE_CONNECTED = True
    else:
        engine = None
        SessionLocal = None
        Base = None
        DATABASE_CONNECTED = False
except Exception as e:
    print(f"Database connection failed: {e}")
    engine = None
    SessionLocal = None
    Base = None
    DATABASE_CONNECTED = False


def get_db() -> Session:
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Initialize Qdrant client
try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models
    
    qdrant_client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    QDRANT_CONNECTED = True
except Exception as e:
    print(f"Qdrant connection failed: {e}")
    qdrant_client = None
    QDRANT_CONNECTED = False

# Initialize OpenAI client (for embeddings and optionally chat)
try:
    from openai import OpenAI

    # OpenAI client for embeddings (required)
    openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
    
    # OpenRouter client for chat (uses OpenAI-compatible API)
    if USE_OPENROUTER:
        openrouter_client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1"
        )
    else:
        openrouter_client = None
    
    OPENAI_CONNECTED = True
except Exception as e:
    print(f"OpenAI/OpenRouter connection failed: {e}")
    openai_client = None
    openrouter_client = None
    OPENAI_CONNECTED = False

# Collection name for textbook content
COLLECTION_NAME = "physical_ai_textbook"
EMBEDDING_DIM = 1536  # OpenAI text-embedding-ada-002 dimension


def get_embedding(text: str) -> List[float]:
    """Generate embedding using OpenRouter or OpenAI"""
    # Use OpenRouter for embeddings if available, otherwise use OpenAI
    client_to_use = openrouter_client if USE_OPENROUTER else openai_client
    
    if not client_to_use:
        raise HTTPException(status_code=503, detail="No embedding service available")

    # Use OpenRouter embedding model or OpenAI's
    model_to_use = "openai/text-embedding-ada-002" if USE_OPENROUTER else "text-embedding-ada-002"
    
    response = client_to_use.embeddings.create(
        input=text,
        model=model_to_use
    )
    return response.data[0].embedding


def create_collection():
    """Create Qdrant collection if it doesn't exist"""
    if not qdrant_client:
        return
    
    try:
        collections = qdrant_client.get_collections().collections
        collection_names = [c.name for c in collections]
        
        if COLLECTION_NAME not in collection_names:
            qdrant_client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=models.VectorParams(
                    size=EMBEDDING_DIM,
                    distance=models.Distance.COSINE
                )
            )
            # Create payload indexes for faster filtering
            qdrant_client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="chapter",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
            qdrant_client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="source",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
    except Exception as e:
        print(f"Error creating collection: {e}")


# Initialize collection on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables and Qdrant collection"""
    # Create database tables
    if DATABASE_CONNECTED and engine:
        from models import Base as ModelsBase
        ModelsBase.metadata.create_all(bind=engine)
        print("SUCCESS: Database tables created")

    # Create Qdrant collection
    create_collection()
    print("SUCCESS: Server startup complete")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        qdrant_connected=QDRANT_CONNECTED,
        openai_connected=OPENAI_CONNECTED,
        database_connected=DATABASE_CONNECTED,
        timestamp=datetime.utcnow().isoformat()
    )


@app.get("/db/test")
async def test_database():
    """Test database connection"""
    if not DATABASE_CONNECTED:
        raise HTTPException(status_code=503, detail="Database not connected")

    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return {"status": "connected", "message": "Database connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database test failed: {str(e)}")


@app.post("/ingest")
async def ingest_documents(request: IngestRequest):
    """Ingest document chunks into vector database"""
    if not qdrant_client:
        raise HTTPException(status_code=503, detail="Vector database not available")
    
    points = []
    for idx, doc in enumerate(request.documents):
        try:
            embedding = get_embedding(doc.text)
            points.append(
                models.PointStruct(
                    id=idx,
                    vector=embedding,
                    payload={
                        "text": doc.text,
                        "source": doc.source,
                        "chapter": doc.chapter,
                        "page_url": doc.page_url
                    }
                )
            )
        except Exception as e:
            print(f"Error processing document {idx}: {e}")
            continue
    
    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
    
    return {"status": "success", "ingested_count": len(points)}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """
    Chat endpoint with RAG capabilities
    - Uses selected text if provided
    - Retrieves relevant context from vector DB
    - Generates response using OpenAI
    """
    # Check if either OpenAI or OpenRouter is available
    if not openai_client and not openrouter_client:
        raise HTTPException(status_code=503, detail="AI service not available")
    
    conversation_id = request.conversation_id or f"conv_{datetime.utcnow().timestamp()}"
    selected_text_used = False
    
    # Build context from selected text (if provided)
    context = ""
    if request.selected_text:
        context = f"Selected text from the textbook:\n\n{request.selected_text}\n\n"
        selected_text_used = True
    
    # Retrieve relevant documents from Qdrant
    sources = []
    if qdrant_client and QDRANT_CONNECTED:
        try:
            query_embedding = get_embedding(request.message)
            
            search_results = qdrant_client.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_embedding,
                limit=5,
                score_threshold=0.5
            )
            
            if search_results:
                context += "\n\nRelevant textbook content:\n"
                for result in search_results:
                    context += f"\nFrom {result.payload.get('chapter', 'Unknown')}:\n{result.payload.get('text', '')}\n"
                    sources.append({
                        "source": result.payload.get('source', 'Unknown'),
                        "chapter": result.payload.get('chapter', 'Unknown'),
                        "page_url": result.payload.get('page_url', ''),
                        "relevance_score": result.score
                    })
        except Exception as e:
            print(f"Search error: {e}")
    
    # Build messages for OpenAI
    system_message = """You are a helpful AI assistant for the Physical AI & Humanoid Robotics textbook. 
You help students understand concepts from the textbook. Always base your answers on the provided context 
from the textbook. If the context doesn't contain enough information, say so honestly.
Be concise, educational, and encourage further learning."""

    user_message = f"{context}\n\nStudent question: {request.message}"
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message}
    ]
    
    # Generate response using OpenRouter or OpenAI
    try:
        # Use OpenRouter if available, otherwise use OpenAI
        client_to_use = openrouter_client if USE_OPENROUTER else openai_client
        
        if not client_to_use:
            raise HTTPException(status_code=503, detail="No AI service available")
        
        # Use OpenRouter model if using OpenRouter, otherwise use OpenAI model
        model_to_use = "openai/gpt-4o-mini" if USE_OPENROUTER else "gpt-4o-mini"
        
        response = client_to_use.chat.completions.create(
            model=model_to_use,
            messages=messages,
            max_tokens=1000,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI generation failed: {str(e)}")
    
    return ChatResponse(
        response=ai_response,
        sources=sources,
        conversation_id=conversation_id,
        selected_text_used=selected_text_used
    )


@app.get("/api/chapters")
async def get_chapters():
    """Get list of all chapters for content indexing"""
    chapters = [
        {"id": "intro-physical-ai", "title": "Introduction to Physical AI", "url": "/docs/modules/intro-physical-ai"},
        {"id": "ros2-core", "title": "ROS 2 Core Concepts", "url": "/docs/modules/module-1-ros2/chapters/chapter-ros2-core-concepts"},
        {"id": "urdf-modeling", "title": "Humanoid URDF Modeling", "url": "/docs/modules/module-1-ros2/chapters/chapter-humanoid-urdf-modeling"},
        {"id": "gazebo-twin", "title": "Gazebo Digital Twins", "url": "/docs/modules/module-2-digital-twin/chapters/chapter-gazebo-digital-twins"},
        {"id": "unity-hri", "title": "Unity HRI", "url": "/docs/modules/module-2-digital-twin/chapters/chapter-unity-hri"},
        {"id": "isaac-sim", "title": "Isaac Sim & Synthetic Data", "url": "/docs/modules/module-3-nvidia-isaac/chapters/chapter-isaac-sim-synthetic-data"},
        {"id": "isaac-ros", "title": "Isaac ROS Navigation & SLAM", "url": "/docs/modules/module-3-nvidia-isaac/chapters/chapter-isaac-ros-navigation-slam"},
        {"id": "bipedal-isaac", "title": "Bipedal Planning with Isaac", "url": "/docs/modules/module-3-nvidia-isaac/chapters/chapter-bipedal-planning-isaac"},
        {"id": "vla-systems", "title": "VLA Systems", "url": "/docs/modules/module-4-vision-language-action/chapters/chapter-vla-systems"},
        {"id": "capstone-pipeline", "title": "Capstone Humanoid Pipeline", "url": "/docs/modules/module-4-vision-language-action/chapters/chapter-capstone-humanoid-pipeline"},
    ]
    return {"chapters": chapters}


# Include authentication routes (import at the end to avoid circular dependency)
def setup_routes():
    """Setup API routes"""
    from auth_routes import auth_router
    app.include_router(auth_router)

# Setup routes
setup_routes()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000))
    )

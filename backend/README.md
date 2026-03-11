# Physical AI Textbook - RAG Chatbot Backend

FastAPI-based backend server for the RAG (Retrieval-Augmented Generation) chatbot that powers the Physical AI textbook assistant.

## Features

- **RAG Chatbot**: AI-powered Q&A using textbook content
- **Vector Search**: Qdrant vector database for semantic search
- **OpenAI Integration**: GPT-4o-mini for response generation
- **Text Selection**: Answer questions about selected text from the textbook
- **Conversation History**: Maintain context across multiple messages
- **Source Attribution**: Show relevant textbook sections for each answer

## Prerequisites

- Python 3.9+
- OpenAI API Key
- Qdrant Cloud account (or local Qdrant)
- Neon Postgres account (for auth)

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-openai-api-key
QDRANT_URL=https://your-qdrant-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET_KEY=your-secret-key-change-in-production
```

## Running the Server

### Development Mode

```bash
# Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using the Python script
python main.py
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```
GET /health
```

Returns server health status including Qdrant and OpenAI connectivity.

### Chat
```
POST /chat
```

Send a message and get an AI response based on textbook content.

**Request Body:**
```json
{
  "message": "What is ROS 2?",
  "selected_text": "Optional text selected from the textbook",
  "conversation_id": "Optional conversation ID for context"
}
```

**Response:**
```json
{
  "response": "ROS 2 is a middleware for robotic communication...",
  "sources": [
    {
      "source": "Module 1: ROS 2",
      "chapter": "ROS 2 Core Concepts",
      "page_url": "/docs/modules/module-1-ros2/chapters/chapter-ros2-core-concepts",
      "relevance_score": 0.89
    }
  ],
  "conversation_id": "conv_1234567890",
  "selected_text_used": false
}
```

### Ingest Documents
```
POST /ingest
```

Add textbook content to the vector database.

**Request Body:**
```json
{
  "documents": [
    {
      "text": "Content text...",
      "source": "Chapter Title",
      "chapter": "Module/Chapter ID",
      "page_url": "/path/to/chapter"
    }
  ]
}
```

### Get Chapters
```
GET /api/chapters
```

Returns list of all chapters for indexing.

## Indexing Textbook Content

To index the textbook content for the chatbot:

```bash
python scripts/index_content.py
```

This script:
1. Reads all MDX files from `docs/modules/`
2. Splits content into chunks
3. Generates embeddings using OpenAI
4. Stores in Qdrant vector database

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
flake8
```

## Deployment

### Deploy to Cloud Run / AWS Lambda / Azure Functions

1. Build Docker image (see `Dockerfile`)
2. Deploy to your cloud provider
3. Set environment variables
4. Configure CORS for your frontend domain

### Docker Deployment

```bash
docker build -t physical-ai-chatbot .
docker run -p 8000:8000 --env-file .env physical-ai-chatbot
```

## Troubleshooting

### Qdrant Connection Failed
- Check QDRANT_URL is correct
- Verify QDRANT_API_KEY is valid
- Ensure your IP is whitelisted in Qdrant Cloud

### OpenAI API Errors
- Verify OPENAI_API_KEY is valid
- Check API quota and billing
- Ensure model name is correct

### CORS Errors
- Update `allow_origins` in `main.py` to include your frontend domain
- For development, `*` allows all origins

## License

MIT License - See LICENSE file for details

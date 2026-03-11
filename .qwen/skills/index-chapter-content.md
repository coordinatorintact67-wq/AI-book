# Agent Skill: Chapter Content Indexer

**Skill Name:** `indexChapterContent`

**Purpose:** Automatically index chapter content for the RAG chatbot.

**Trigger:** When a new chapter or section is created or updated.

**Actions:**
1. Read the MDX chapter file
2. Extract text content (excluding code blocks and metadata)
3. Split into logical chunks (by section/heading)
4. Generate embeddings using OpenAI API
5. Store chunks in Qdrant vector database
6. Update chapter index

**Usage:**
```
Use the indexChapterContent skill to index chapter content for the chatbot.
```

**Configuration:**
- Backend URL: http://localhost:8000
- Collection: physical_ai_textbook
- Embedding model: text-embedding-ada-002
- Chunk size: 500-1000 tokens
- Overlap: 100 tokens

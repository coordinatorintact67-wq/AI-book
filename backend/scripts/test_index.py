"""
Quick test - Index a single chapter into Qdrant
"""

import os
import sys
import hashlib
from dotenv import load_dotenv

load_dotenv()

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models

# Config
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
COLLECTION_NAME = "physical_ai_textbook"

print("Connecting to Qdrant and OpenRouter...")

qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

openrouter_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

print("[OK] Connected!")

# Test embedding
print("\nTesting embedding generation...")
try:
    response = openrouter_client.embeddings.create(
        input="What is ROS 2?",
        model="openai/text-embedding-ada-002"
    )
    embedding = response.data[0].embedding
    print(f"[OK] Generated embedding: {len(embedding)} dimensions")
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)

# Create collection
print(f"\nCreating collection: {COLLECTION_NAME}...")
try:
    collections = qdrant_client.get_collections().collections
    collection_names = [c.name for c in collections]
    
    if COLLECTION_NAME not in collection_names:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(
                size=1536,
                distance=models.Distance.COSINE
            )
        )
        print("[OK] Collection created!")
    else:
        print("[OK] Collection exists!")
except Exception as e:
    print(f"[ERROR] {e}")
    sys.exit(1)

# Read one chapter
print("\nReading chapter: ROS 2 Core Concepts...")
chapter_path = "../docs/modules/module-1-ros2/chapters/chapter-ros2-core-concepts.mdx"
with open(chapter_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"[OK] Read {len(content)} characters")

# Simple chunking
chunks = []
chunk_size = 500
overlap = 50

for i in range(0, len(content), chunk_size - overlap):
    chunk = content[i:i + chunk_size].strip()
    if len(chunk) > 50:
        chunks.append(chunk)

print(f"Split into {len(chunks)} chunks")

# Index first 3 chunks as test
print("\nIndexing first 3 chunks...")
points = []
for i, chunk in enumerate(chunks[:3]):
    print(f"  Processing chunk {i+1}...")
    try:
        embedding = openrouter_client.embeddings.create(
            input=chunk,
            model="openai/text-embedding-ada-002"
        ).data[0].embedding
        
        points.append(
            models.PointStruct(
                id=hashlib.md5(f"ros2-{i}".encode()).hexdigest(),
                vector=embedding,
                payload={
                    "text": chunk[:200] + "...",
                    "source": "ROS 2 Core Concepts",
                    "chapter": "module-1-ros2",
                    "page_url": "/docs/modules/module-1-ros2/chapters/chapter-ros2-core-concepts",
                    "chunk_index": i
                }
            )
        )
    except Exception as e:
        print(f"  [WARN] Chunk {i} failed: {e}")

if points:
    print(f"\nUploading {len(points)} points to Qdrant...")
    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )
    print("[OK] Uploaded successfully!")
    
    # Test search
    print("\nTesting search...")
    query_embedding = openrouter_client.embeddings.create(
        input="What is ROS 2?",
        model="openai/text-embedding-ada-002"
    ).data[0].embedding
    
    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=2
    )
    
    print(f"\n[OK] Search found {len(results.points)} results:")
    for r in results.points:
        print(f"  - Score: {r.score:.3f}")
        print(f"    Text: {r.payload['text'][:100]}...")
        print()

print("\n" + "=" * 50)
print("TEST COMPLETE!")
print("=" * 50)

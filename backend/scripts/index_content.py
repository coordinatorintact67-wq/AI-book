"""
Index Textbook Content into Qdrant Vector Database

This script:
1. Reads all MDX chapters from docs/modules/
2. Splits content into chunks
3. Generates embeddings via OpenRouter
4. Stores in Qdrant vector database
"""

import os
import sys
import hashlib
from pathlib import Path
from typing import List, Dict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models

# Configuration
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
COLLECTION_NAME = "physical_ai_textbook"
EMBEDDING_DIM = 1536
CHUNK_SIZE = 500  # Characters per chunk
CHUNK_OVERLAP = 50  # Overlap between chunks

# Initialize clients
print("Initializing clients...")
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

openrouter_client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

def get_embedding(text: str) -> List[float]:
    """Generate embedding using OpenRouter"""
    response = openrouter_client.embeddings.create(
        input=text,
        model="openai/text-embedding-ada-002"
    )
    return response.data[0].embedding

def read_mdx_file(filepath: str) -> str:
    """Read MDX file and return content"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def extract_frontmatter(content: str) -> Dict[str, str]:
    """Extract frontmatter metadata from MDX"""
    metadata = {
        'title': '',
        'description': '',
        'chapter': ''
    }
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            for line in frontmatter.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower()
                    value = value.strip()
                    if key == 'title':
                        metadata['title'] = value
                    elif key == 'description':
                        metadata['description'] = value
                    elif key == 'sidebar_label':
                        metadata['chapter'] = value
    
    return metadata

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks"""
    # Remove frontmatter
    if text.startswith('---'):
        parts = text.split('---', 2)
        if len(parts) >= 3:
            text = parts[2]
    
    # Remove markdown code blocks for cleaner chunks
    lines = text.split('\n')
    clean_text = []
    in_code_block = False
    
    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue
        if not in_code_block:
            clean_text.append(line)
    
    text = '\n'.join(clean_text)
    
    # Split into chunks
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary
        if end < text_length:
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > chunk_size // 2:
                chunk = chunk[:break_point + 1]
        
        chunk = chunk.strip()
        if len(chunk) > 50:  # Skip very small chunks
            chunks.append(chunk)
        
        start += chunk_size - overlap
    
    return chunks

def get_all_mdx_files() -> List[Path]:
    """Find all MDX files in docs/modules/"""
    docs_dir = Path(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) / 'docs' / 'modules'
    mdx_files = list(docs_dir.rglob('*.mdx'))
    return mdx_files

def create_url_from_path(filepath: Path, base_path: Path) -> str:
    """Convert file path to Docusaurus URL"""
    relative = filepath.relative_to(base_path.parent)
    # Convert path to URL
    url_parts = []
    for part in relative.parts:
        if part.endswith('.mdx'):
            part = part[:-4]
            if part != 'index':
                url_parts.append(part)
        else:
            url_parts.append(part)
    
    return '/docs/' + '/'.join(url_parts)

def index_content():
    """Main indexing function"""
    print("=" * 60)
    print("Physical AI Textbook - Content Indexer")
    print("=" * 60)
    
    # Create collection if not exists
    print(f"\n1. Creating/verifying collection: {COLLECTION_NAME}")
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
            print("   [OK] Collection created")
        else:
            print("   [OK] Collection exists")
            
        # Create indexes
        try:
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
            print("   [OK] Payload indexes created")
        except Exception as e:
            print(f"   [WARN] Indexes may already exist: {e}")
            
    except Exception as e:
        print(f"   [ERROR] Error: {e}")
        return
    
    # Get all MDX files
    print("\n2. Finding MDX files...")
    mdx_files = get_all_mdx_files()
    print(f"   Found {len(mdx_files)} MDX files")
    
    # Process each file
    base_path = Path(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))) / 'docs' / 'modules'
    total_chunks = 0
    successful_chunks = 0
    
    for idx, filepath in enumerate(mdx_files, 1):
        print(f"\n3.{idx}/{len(mdx_files)} Processing: {filepath.name}")
        
        try:
            # Read file
            content = read_mdx_file(str(filepath))
            metadata = extract_frontmatter(content)
            
            # Generate URL
            page_url = create_url_from_path(filepath, base_path)
            
            # Chunk content
            chunks = chunk_text(content)
            print(f"   Split into {len(chunks)} chunks")
            
            # Process chunks
            points = []
            for chunk_idx, chunk in enumerate(chunks):
                try:
                    embedding = get_embedding(chunk)
                    
                    point = models.PointStruct(
                        id=hashlib.md5(f"{filepath}:{chunk_idx}".encode()).hexdigest(),
                        vector=embedding,
                        payload={
                            "text": chunk,
                            "source": metadata.get('title', filepath.stem),
                            "chapter": metadata.get('chapter', filepath.stem),
                            "page_url": page_url,
                            "file_path": str(filepath),
                            "chunk_index": chunk_idx
                        }
                    )
                    points.append(point)
                    successful_chunks += 1
                except Exception as e:
                    print(f"   [WARN] Chunk {chunk_idx} failed: {e}")
                    continue
            
            # Upload to Qdrant
            if points:
                qdrant_client.upsert(
                    collection_name=COLLECTION_NAME,
                    points=points
                )
                print(f"   [OK] Uploaded {len(points)} chunks")
                total_chunks += len(points)
                
        except Exception as e:
            print(f"   [ERROR] Error processing file: {e}")
            continue
    
    # Summary
    print("\n" + "=" * 60)
    print("INDEXING COMPLETE")
    print("=" * 60)
    print(f"Files processed: {len(mdx_files)}")
    print(f"Total chunks: {total_chunks}")
    print(f"Successful chunks: {successful_chunks}")
    print(f"Collection: {COLLECTION_NAME}")
    print("=" * 60)


if __name__ == "__main__":
    index_content()

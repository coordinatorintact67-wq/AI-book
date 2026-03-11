from dotenv import load_dotenv
load_dotenv()
import os
from qdrant_client import QdrantClient

client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

info = client.get_collection("physical_ai_textbook")
print(f"Collection: physical_ai_textbook")
print(f"Total vectors: {info.points_count}")
print(f"Collection info: {info}")

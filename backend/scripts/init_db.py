"""
Database Initialization Script
Creates all tables in the PostgreSQL database
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file")
    exit(1)

print(f"Connecting to database...")
print(f"   URL: {DATABASE_URL[:50]}...")

try:
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("SUCCESS: Database connection established")
    
    # Import models and create tables
    print("\nCreating tables...")
    from models import Base, User, Session, UserProgress, Conversation, ChatMessage
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("SUCCESS: Tables created:")
    print("   - users")
    print("   - sessions")
    print("   - user_progress")
    print("   - conversations")
    print("   - chat_messages")
    
    # Verify tables
    print("\nVerifying tables...")
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """))
        tables = [row[0] for row in result.fetchall()]
        print(f"   Tables in database: {', '.join(tables)}")
    
    print("\nDatabase initialization complete!")
    
except Exception as e:
    print(f"\nERROR: {e}")
    print("\nTroubleshooting:")
    print("1. Check your DATABASE_URL in .env file")
    print("2. Ensure PostgreSQL database is accessible")
    print("3. Verify SSL mode is set correctly (?sslmode=require)")
    exit(1)

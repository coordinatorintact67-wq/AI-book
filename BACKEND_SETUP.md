# Backend Setup Guide - Physical AI Textbook

Complete guide to setting up the backend for full authentication, chatbot, and personalization features.

---

## 🎯 What You Get With Backend Setup

| Feature | Without Backend | With Backend |
|---------|----------------|--------------|
| **Textbook Content** | ✅ Full Access | ✅ Full Access |
| **Auth UI** | ✅ Demo Mode | ✅ Full Authentication |
| **Chatbot** | ❌ Not Available | ✅ AI-Powered Q&A |
| **Personalization** | ⚠️ Local Storage | ✅ Database-Backed |
| **Urdu Translation** | ✅ Available | ✅ Available |
| **User Progress** | ❌ Not Saved | ✅ Tracked |

---

## 📋 Prerequisites

1. **Python 3.9+** - Already installed (3.14.2)
2. **PostgreSQL Database** - Neon (free tier)
3. **Vector Database** - Qdrant Cloud (free tier)
4. **AI API** - OpenAI (requires billing)

---

## 🔧 Step-by-Step Setup

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Important:** Set billing limit to avoid surprise charges

**Cost:** $0.002 per 1K tokens (very cheap for testing)

---

### Step 2: Get Qdrant Cloud (Vector Database)

1. Go to https://cloud.qdrant.io/
2. Sign up with GitHub
3. Create new cluster (Free tier: 1GB)
4. Copy:
   - **URL** (e.g., `https://xxx-xxx.cloud.qdrant.io`)
   - **API Key**

**Cost:** FREE (1GB storage, enough for textbook)

---

### Step 3: Get Neon Postgres (User Database)

1. Go to https://neon.tech/
2. Sign up with GitHub
3. Create new project
4. Copy connection string:
   ```
   postgresql://user:password@host.neon.tech/dbname?sslmode=require
   ```

**Cost:** FREE (0.5 GB storage, 10 projects)

---

### Step 4: Configure Backend

1. **Navigate to backend folder:**
   ```bash
   cd D:\Coding\Hacathons\AI-book\backend
   ```

2. **Copy environment template:**
   ```bash
   copy .env.example .env
   ```

3. **Edit `.env` file:**
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-actual-key-here
   
   # Qdrant Cloud Configuration
   QDRANT_URL=https://your-cluster.qdrant.tech
   QDRANT_API_KEY=your-qdrant-api-key
   
   # Neon Postgres Configuration
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
   
   # JWT Settings (generate your own secret)
   JWT_SECRET_KEY=your-super-secret-key-change-this
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Server Settings
   HOST=0.0.0.0
   PORT=8000
   ```

---

### Step 5: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed fastapi-0.109.0 uvicorn-0.27.0 qdrant-client-1.7.0 ...
```

---

### Step 6: Start Backend Server

```bash
# Option 1: Development mode (auto-reload)
npm run backend:start

# Option 2: Direct Python
cd backend
python main.py
```

**Expected Output:**
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

### Step 7: Test Backend

Open browser or use curl:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "qdrant_connected": true,
  "openai_connected": true,
  "timestamp": "2025-..."
}
```

---

### Step 8: Index Textbook Content

Create `backend/scripts/index_content.py`:

```python
import requests
import os
from pathlib import Path

BACKEND_URL = "http://localhost:8000"
DOCS_PATH = Path("../docs/modules")

def extract_text_from_mdx(file_path):
    """Extract text content from MDX file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Remove frontmatter and code blocks
    import re
    content = re.sub(r'---.*?---', '', content, flags=re.DOTALL)
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    return content.strip()

def index_all_chapters():
    documents = []
    
    for mdx_file in DOCS_PATH.rglob("*.mdx"):
        text = extract_text_from_mdx(mdx_file)
        if text:
            documents.append({
                "text": text[:5000],  # Limit chunk size
                "source": mdx_file.parent.name,
                "chapter": mdx_file.stem,
                "page_url": f"/docs/{mdx_file.relative_to(Path('../docs'))}".replace('\\', '/')
            })
    
    response = requests.post(
        f"{BACKEND_URL}/ingest",
        json={"documents": documents}
    )
    
    print(f"Indexed {len(documents)} chapters")
    print(response.json())

if __name__ == "__main__":
    index_all_chapters()
```

Run the indexer:
```bash
cd backend/scripts
python index_content.py
```

---

## 🎉 Verify Full Setup

### 1. Test Chatbot

1. Open http://localhost:3000
2. Click chat button (bottom-right)
3. Ask: "What is ROS 2?"
4. Should get AI response with sources

### 2. Test Authentication

1. Go to http://localhost:3000/auth
2. Fill in email and password
3. Complete background questionnaire
4. Should save to database

### 3. Test Personalization

1. Open any chapter
2. Click "Personalize" button
3. Adjust preferences
4. Click "Save"
5. Preferences saved to database

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `ModuleNotFoundError`
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**Error:** `Address already in use`
```bash
# Solution: Use different port
python main.py --port 8001
```

### Qdrant Connection Failed

1. Check URL format: `https://xxx-xxx.cloud.qdrant.io`
2. Verify API key is correct
3. Check IP whitelist in Qdrant dashboard

### OpenAI API Errors

1. Verify API key starts with `sk-`
2. Check billing is set up at https://platform.openai.com/account/billing
3. Test key: https://platform.openai.com/api-keys

### Database Connection Failed

1. Check connection string format
2. Verify SSL mode: `?sslmode=require`
3. Check Neon dashboard for connection details

---

## 💰 Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| OpenAI | $0 (pay per use) | ~$5 for testing |
| Qdrant | 1GB FREE | $0 for textbook |
| Neon | 0.5GB FREE | $0 for user data |
| **Total** | **$0** | **~$5 for testing** |

---

## 🔒 Security Notes

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Change JWT_SECRET_KEY** - Use a random string
3. **Enable rate limiting** - Add to backend in production
4. **Use HTTPS** - Required for production

---

## 📞 Support

If you encounter issues:

1. Check backend logs for errors
2. Verify all API keys are correct
3. Test each service independently
4. Check firewall settings

---

## ✅ Quick Checklist

- [ ] OpenAI API key obtained
- [ ] Qdrant Cloud cluster created
- [ ] Neon Postgres database created
- [ ] `.env` file configured
- [ ] Python dependencies installed
- [ ] Backend server starts without errors
- [ ] Health endpoint returns healthy status
- [ ] Textbook content indexed
- [ ] Chatbot responds to questions
- [ ] Authentication saves users

---

**Status:** Ready for full-stack deployment! 🚀

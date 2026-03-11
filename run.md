# Run Commands - Physical AI Textbook

Complete guide to running all components of the Physical AI & Humanoid Robotics textbook project.

---

## Prerequisites

Before running any commands, ensure you have:

- **Node.js** >= 20.0 ([Download](https://nodejs.org/))
- **Python** >= 3.9 ([Download](https://python.org/))
- **pip** (Python package manager)
- **Git** ([Download](https://git-scm.com/))

---

## Quick Start (Frontend Only)

If you just want to view the textbook without the chatbot:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run start

# Open http://localhost:3000 in your browser
```

---

## Full Setup (Frontend + Backend + Chatbot)

### Step 1: Install Frontend Dependencies

```bash
npm install
```

### Step 2: Install Backend Dependencies

```bash
# Option A: Using npm script
npm run backend:install

# Option B: Manual installation
cd backend
pip install -r requirements.txt
cd ..
```

### Step 3: Configure Environment Variables

```bash
# Copy environment template
cd backend
cp .env.example .env

# Edit .env file with your API keys
# Use any text editor (nano, vim, notepad, etc.)
```

**Required API Keys:**

1. **OpenAI API Key**
   - Get from: https://platform.openai.com/api-keys
   - Format: `sk-...`

2. **Qdrant Cloud URL & API Key**
   - Get from: https://cloud.qdrant.io/
   - Free tier available

3. **Neon Postgres Database URL**
   - Get from: https://neon.tech/
   - Free tier available

**Example `.env` file:**
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key-here
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
```

### Step 4: Run Backend Server

Open **Terminal 1**:

```bash
# Option A: Using npm script
npm run backend:start

# Option B: Direct Python command
cd backend
python main.py
```

Backend will start at: http://localhost:8000

**Verify backend is running:**
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "qdrant_connected": true,
  "openai_connected": true,
  "timestamp": "2025-..."
}
```

### Step 5: Run Frontend Server

Open **Terminal 2**:

```bash
npm run start
```

Frontend will start at: http://localhost:3000

### Step 6: Run Both Simultaneously (Optional)

```bash
# Install concurrently if not already installed
npm install concurrently

# Run both frontend and backend
npm run dev:all
```

---

## Development Commands

### Frontend Commands

```bash
# Start development server with hot-reload
npm run start

# Build for production
npm run build

# Serve production build locally
npm run serve

# Run TypeScript type checking
npm run typecheck

# Clear Docusaurus cache
npm run clear

# Generate glossary from MDX terms
npm run glossary:gen

# Write heading IDs for i18n
npm run write-heading-ids

# Write translations
npm run write-translations
```

### Backend Commands

```bash
# Install Python dependencies
npm run backend:install

# Start backend with auto-reload (development)
npm run backend:start

# Start backend without auto-reload (production)
npm run backend:dev
```

### Combined Commands

```bash
# Run both frontend and backend together
npm run dev:all
```

---

## Testing Commands

### Test Frontend Build

```bash
# Type check
npm run typecheck

# Build (will also generate glossary)
npm run build

# If build succeeds, test locally
npm run serve
```

### Test Backend API

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chapters endpoint
curl http://localhost:8000/api/chapters

# Test chat endpoint (requires running backend)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is ROS 2?"}'
```

### Test Glossary Generation

```bash
npm run glossary:gen
```

Check `docs/glossary.md` for generated content.

---

## Deployment Commands

### Deploy to GitHub Pages

**Before deploying, update `docusaurus.config.ts`:**

```typescript
// Change these lines with YOUR GitHub username
url: 'https://your-github-username.github.io',
organizationName: 'your-github-username',
```

**Method 1: Manual Deploy**

```bash
GIT_USER=your-github-username npm run deploy
```

**Method 2: GitHub Actions (Recommended)**

1. Push to main branch:
```bash
git add .
git commit -m "Update content"
git push origin main
```

2. GitHub Actions will automatically deploy

**Enable GitHub Pages:**
1. Go to your GitHub repo Settings
2. Navigate to Pages section
3. Select Source: GitHub Actions
4. Workflow will deploy automatically

---

## Indexing Content for Chatbot

After backend is running, index textbook content:

### Option 1: Using the Chapters API

```bash
# Get list of chapters
curl http://localhost:8000/api/chapters

# Then ingest content (create a script or use this format)
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "text": "Your chapter content here...",
        "source": "Module 1: ROS 2",
        "chapter": "ROS 2 Core Concepts",
        "page_url": "/docs/modules/module-1-ros2/chapters/chapter-ros2-core-concepts"
      }
    ]
  }'
```

### Option 2: Create Index Script

Create `backend/scripts/index_content.py`:

```python
import os
import requests
from pathlib import Path

BACKEND_URL = "http://localhost:8000"
DOCS_PATH = Path("../docs/modules")

def index_all_chapters():
    # Read all MDX files and send to backend
    # Implementation depends on your needs
    pass

if __name__ == "__main__":
    index_all_chapters()
```

---

## Troubleshooting

### Frontend Issues

**Port 3000 already in use:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run start
```

**Build fails:**
```bash
# Clear cache
npm run clear

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Backend Issues

**Port 8000 already in use:**
```bash
# Use different port
npm run backend:start -- --port 8001
```

**Module not found:**
```bash
# Reinstall Python dependencies
cd backend
pip install -r requirements.txt --force-reinstall
```

**Qdrant connection failed:**
- Check QDRANT_URL is correct
- Verify QDRANT_API_KEY is valid
- Ensure your IP is whitelisted in Qdrant Cloud dashboard

**OpenAI API errors:**
- Verify OPENAI_API_KEY is correct (no extra spaces)
- Check API quota at https://platform.openai.com/usage
- Ensure you have billing set up

### CORS Issues

If chatbot can't connect to backend:

1. Check backend is running at http://localhost:8000
2. Verify CORS origins in `backend/main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "https://your-github-username.github.io",
    "*"
]
```

---

## File Structure Reference

```
AI-book/
├── docs/                    # Textbook content
├── src/                     # React components
│   ├── components/
│   │   ├── Chatbot/
│   │   ├── Auth/
│   │   ├── Personalization/
│   │   └── Translation/
│   └── pages/
├── backend/                 # FastAPI backend
│   ├── main.py
│   ├── auth.ts
│   ├── requirements.txt
│   └── .env
├── .qwen/                   # Claude Code subagents
├── package.json
└── run.md                  # This file
```

---

## Environment Variables Reference

### Frontend (.env in root - optional)

```env
REACT_APP_CHATBOT_URL=http://localhost:8000
```

### Backend (backend/.env - required)

```env
OPENAI_API_KEY=sk-...
QDRANT_URL=https://...
QDRANT_API_KEY=...
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=...
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
HOST=0.0.0.0
PORT=8000
```

---

## Success Checklist

After running all commands, verify:

- [ ] Frontend loads at http://localhost:3000
- [ ] All textbook modules are accessible
- [ ] Backend health check returns healthy status
- [ ] Chatbot button appears (bottom-right)
- [ ] Auth page accessible at /auth
- [ ] Personalization button appears on chapters
- [ ] Translation button appears on chapters
- [ ] Glossary generates without errors
- [ ] Build completes without errors

---

## Additional Resources

- **Docusaurus Docs:** https://docusaurus.io/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Qdrant Docs:** https://qdrant.tech/documentation/
- **OpenAI API:** https://platform.openai.com/docs
- **Better Auth:** https://better-auth.com/

---

## Support

For issues:
1. Check this run.md file
2. Review backend/README.md
3. Check SETUP.md for detailed setup
4. Review error logs in console

Good luck! 🚀

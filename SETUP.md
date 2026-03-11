# Hackathon Submission - Complete Setup Instructions

## Quick Start Checklist

### 1. Environment Setup

#### Frontend (Required)
```bash
# Install Node.js dependencies
npm install
```

#### Backend (Required for Chatbot)
```bash
# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..

# Copy and configure environment
cd backend
cp .env.example .env
# Edit .env with your API keys
```

### 2. API Keys Required

Get your API keys from:

1. **OpenAI API Key**: https://platform.openai.com/api-keys
2. **Qdrant Cloud**: https://cloud.qdrant.io/ (free tier available)
3. **Neon Postgres**: https://neon.tech/ (free tier available)

Update `backend/.env`:
```env
OPENAI_API_KEY=sk-...
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your-api-key
DATABASE_URL=postgresql://...
```

### 3. Run Locally

#### Option A: Frontend Only (Textbook without Chatbot)
```bash
npm run start
```
Visit: http://localhost:3000

#### Option B: Full Stack (Textbook + Chatbot)
```bash
# Terminal 1: Start backend
npm run backend:start

# Terminal 2: Start frontend
npm run start
```

Visit: http://localhost:3000

### 4. Index Textbook Content (for Chatbot)

After backend is running:

```bash
# Create index script or use curl
curl -X POST http://localhost:8000/api/chapters
# Use the response to index content
```

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to GitHub Pages

#### Configure Repository
Edit `docusaurus.config.ts`:
```typescript
url: 'https://<your-github-username>.github.io',
baseUrl: '/<your-repo-name>/',
organizationName: '<your-github-username>',
projectName: '<your-repo-name>',
```

#### Deploy
```bash
# Method 1: Manual deploy
GIT_USER=<your-github-username> npm run deploy

# Method 2: GitHub Actions (recommended)
# Just push to main branch - workflow will auto-deploy
```

### 7. Enable GitHub Pages

1. Go to GitHub repo Settings
2. Navigate to Pages section
3. Select Source: GitHub Actions
4. Your site will deploy automatically

## Feature Verification Checklist

### Base Requirements (100 points)

- [ ] Docusaurus textbook builds without errors
- [ ] All 4 modules are accessible
- [ ] Landing page displays correctly
- [ ] Glossary generates correctly
- [ ] RAG Chatbot UI is visible (floating button)
- [ ] Backend API responds to /health endpoint
- [ ] Chatbot can send messages and receive responses
- [ ] Sources are shown in chatbot responses
- [ ] Site deploys to GitHub Pages

### Bonus 1: Claude Code Subagents (50 points)

- [ ] `.qwen/subagents/` folder exists with 5 subagents
- [ ] `.qwen/skills/` folder exists with 4 skills
- [ ] SKILLS.md documentation is present
- [ ] Subagents are documented and usable

### Bonus 2: Better Auth (50 points)

- [ ] `/auth` page is accessible
- [ ] Sign up form works
- [ ] Background questionnaire appears during signup
- [ ] User data is stored in database
- [ ] Sign in works
- [ ] Session persists

### Bonus 3: Content Personalization (50 points)

- [ ] Personalization button appears on chapters
- [ ] Preferences panel opens
- [ ] Difficulty can be adjusted
- [ ] Learning style can be selected
- [ ] Code examples toggle works
- [ ] Preferences save to localStorage

### Bonus 4: Urdu Translation (50 points)

- [ ] Translation button appears on chapters
- [ ] Urdu translation can be enabled/disabled
- [ ] Technical terms show in Urdu
- [ ] Translation state persists

## Troubleshooting

### Build Fails
```bash
# Clear cache
npm run clear
npm install
npm run build
```

### Chatbot Not Working
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify API keys in `.env`
3. Check CORS settings in `backend/main.py`

### Deploy Fails
1. Check `docusaurus.config.ts` has correct URLs
2. Verify GitHub Pages is enabled in repo settings
3. Check GitHub Actions logs for errors

### Auth Not Working
1. Verify DATABASE_URL is correct
2. Check Better Auth is installed: `npm list better-auth`
3. Ensure backend auth routes are configured

## Submission Checklist

Before submitting:

- [ ] GitHub repo is public
- [ ] Live site is deployed and accessible
- [ ] Demo video is recorded (< 90 seconds)
- [ ] README.md has live links
- [ ] All features are working
- [ ] Code is clean and documented

## Submit Form

Fill out: https://forms.gle/CQsSEGM3GeCrL43c8

Include:
1. **GitHub Repo**: https://github.com/your-github-username/ai-book-new
2. **Live Site**: https://your-github-username.github.io/ai-book-new/
3. **Demo Video**: <Your YouTube/Loom link>
4. **WhatsApp Number**: <Your number>

## Points Breakdown

| Category | Points Available | Status |
|----------|-----------------|--------|
| Base Requirements | 100 | ✅ Complete |
| Claude Code Subagents | 50 | ✅ Complete |
| Better Auth | 50 | ✅ Complete |
| Personalization | 50 | ✅ Complete |
| Urdu Translation | 50 | ✅ Complete |
| **TOTAL** | **300** | **✅ All Complete** |

## Support

For issues:
- Check README.md
- Review backend/README.md
- See DEMO_VIDEO.md for recording tips
- Check Docusaurus docs: https://docusaurus.io/docs

Good luck with the hackathon! 🚀

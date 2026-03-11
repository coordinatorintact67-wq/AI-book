# Physical AI & Humanoid Robotics Textbook

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-blue.svg)](https://docusaurus.io/)
[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://python.org/)

**The Embodied Intelligence Textbook** - A comprehensive, open-source resource for learning Physical AI, ROS 2, Gazebo, Unity, NVIDIA Isaac, and Vision-Language-Action systems.

🌐 **Live Site:** https://your-github-username.github.io/ai-book-new/

## 🚀 Features

### Core Textbook
- ✅ **4 Comprehensive Modules** covering ROS 2, Digital Twin, NVIDIA Isaac, and VLA
- ✅ **Interactive MDX Content** with code examples, diagrams, and exercises
- ✅ **Auto-generated Glossary** from textbook terms
- ✅ **Dark/Light Mode** with premium theme
- ✅ **Responsive Design** for all devices

### AI-Powered Features (Hackathon Bonus)
- ✅ **RAG Chatbot** - AI assistant powered by OpenAI GPT-4o-mini and Qdrant vector DB
- ✅ **Text Selection Q&A** - Ask questions about selected textbook text
- ✅ **User Authentication** - Better Auth with signup/signin
- ✅ **Background Questionnaire** - Personalize based on user experience
- ✅ **Content Personalization** - Per-chapter preferences for difficulty and learning style
- ✅ **Urdu Translation** - Translate content to Urdu with technical term dictionary

### Developer Tools
- ✅ **5 Claude Code Subagents** for content creation
- ✅ **4 Agent Skills** for automated workflows
- ✅ **Spec-Kit Plus** methodology with PHRs and ADRs

## 📚 Modules

1. **Module 1: The Robotic Nervous System (ROS 2)**
   - ROS 2 Core Concepts
   - Humanoid URDF Modeling

2. **Module 2: The Digital Twin (Gazebo & Unity)**
   - Gazebo Digital Twins
   - Unity HRI

3. **Module 3: The AI Robot Brain (NVIDIA Isaac)**
   - Isaac Sim & Synthetic Data
   - Isaac ROS Navigation & SLAM
   - Bipedal Planning with Isaac

4. **Module 4: Vision–Language–Action (VLA)**
   - VLA Systems
   - Capstone Humanoid Pipeline

## 🏃 Quick Start

### Prerequisites
- Node.js >= 20.0
- Python 3.9+ (for backend)
- npm or yarn

### Installation

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (optional - for chatbot)
cd backend
pip install -r requirements.txt
cd ..
```

### Local Development

```bash
# Start frontend dev server
npm run start

# In another terminal, start backend (optional)
npm run backend:start
```

Open http://localhost:3000 to view the textbook.

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
# Configure your GitHub repo in docusaurus.config.ts
# Then run:
GIT_USER=<Your GitHub username> npm run deploy
```

## 🤖 RAG Chatbot Setup

The chatbot requires:
1. OpenAI API Key
2. Qdrant Cloud account (free tier available)
3. Backend server running

### Backend Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys
nano .env

# Start the backend
npm run backend:start
```

### Index Textbook Content

```bash
# After backend is running, index all chapters
curl -X POST http://localhost:8000/ingest \
  -H "Content-Type: application/json" \
  -d @scripts/index-payload.json
```

## 📁 Project Structure

```
AI-book/
├── docs/                      # Textbook content (MDX)
│   ├── modules/               # Module content
│   ├── hardware-architecture/ # Hardware requirements
│   ├── templates/             # Page templates
│   ├── index.mdx              # Landing page
│   └── glossary.md            # Auto-generated glossary
├── src/
│   ├── components/            # React components
│   │   ├── Chatbot/           # RAG chatbot UI
│   │   ├── Auth/              # Authentication forms
│   │   ├── Personalization/   # User preferences
│   │   └── Translation/       # Urdu translation
│   ├── pages/                 # Custom pages
│   ├── css/                   # Global styles
│   └── theme/                 # Theme overrides
├── backend/                   # FastAPI RAG backend
│   ├── main.py                # Main API server
│   ├── auth.ts                # Better Auth config
│   └── requirements.txt       # Python dependencies
├── .qwen/
│   ├── subagents/             # Claude Code subagents
│   └── skills/                # Agent skills
├── scripts/                   # Build utilities
├── specs/                     # Spec-Kit Plus specs
└── history/                   # Prompt History Records
```

## 🎯 Hackathon Submission

This project is submitted for **Hackathon I: Physical AI & Humanoid Robotics Textbook**

### Base Requirements (100 points)
- ✅ Docusaurus textbook with 4 modules
- ✅ RAG Chatbot with OpenAI + Qdrant
- ✅ GitHub Pages deployment ready

### Bonus Features (200 points)
- ✅ Claude Code Subagents (50 pts) - 5 subagents + 4 skills
- ✅ Better Auth with questionnaire (50 pts)
- ✅ Content personalization (50 pts)
- ✅ Urdu translation (50 pts)

### Demo Video Script
See `DEMO_VIDEO.md` for the 90-second demo script.

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run start` | Start dev server |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run backend:start` | Start FastAPI backend |
| `npm run backend:install` | Install Python deps |
| `npm run glossary:gen` | Generate glossary |
| `npm run typecheck` | TypeScript check |
| `npm run dev:all` | Run frontend + backend |

## 📖 Documentation

- [Backend API Documentation](backend/README.md)
- [Agent Skills Guide](.qwen/skills/SKILLS.md)
- [Spec-Kit Plus](https://github.com/panaversity/spec-kit-plus/)
- [Docusaurus Docs](https://docusaurus.io/docs)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- Physical AI Textbook Project
- Panaversity Hackathon I Submission

## 🙏 Acknowledgments

- Panaversity for organizing the hackathon
- Docusaurus team for the amazing framework
- OpenAI for the GPT API
- Qdrant for vector database

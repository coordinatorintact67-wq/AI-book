# QWEN.md - Project Context

## Project Overview

**Physical AI & Humanoid Robotics — The Embodied Intelligence Textbook**

This is a Docusaurus-based open-source textbook for teaching advanced AI and robotics students about Physical AI, ROS 2, Gazebo, Unity, NVIDIA Isaac, Humanoid Control, and Vision-Language-Action (VLA) systems.

**Tech Stack:**
- **Framework:** Docusaurus v3.9.2 (React/TypeScript/MDX)
- **Language:** TypeScript, MDX
- **Deployment:** GitHub Pages
- **Node:** >=20.0

**Project Goal:** Create a comprehensive, modular textbook covering:
1. Module 1: ROS 2 (Robotic Nervous System)
2. Module 2: Digital Twin (Gazebo & Unity)
3. Module 3: NVIDIA Isaac (AI Robot Brain)
4. Module 4: Vision-Language-Action (VLA)

## Directory Structure

```
AI-book/
├── docs/                      # Textbook content (MDX)
│   ├── modules/               # Module content organized by topic
│   ├── hardware-architecture/ # Hardware requirements and setup
│   ├── templates/             # Page metadata templates
│   ├── index.mdx              # Landing page
│   └── glossary.md            # Auto-generated glossary
├── src/                       # Custom React components & theme
│   ├── components/            # Reusable React components
│   ├── css/                   # Global styles (custom.css)
│   ├── pages/                 # Custom pages
│   └── theme/                 # Docusaurus theme overrides
├── static/                    # Static assets (images, favicon)
├── scripts/                   # Build utilities
│   └── glossary-generator.js  # Auto-generates glossary from MDX
├── specs/                     # Spec-Kit Plus specifications
├── history/                   # Prompt History Records (PHRs)
├── blog/                      # Docusaurus blog posts
├── package.json               # Dependencies & scripts
├── docusaurus.config.ts       # Docusaurus configuration
├── sidebars.ts                # Sidebar navigation config
└── tsconfig.json              # TypeScript configuration
```

## Building and Running

### Installation
```bash
npm install
# or
yarn
```

### Local Development
```bash
npm run start
# or
yarn start
```
Starts dev server with hot-reload at `http://localhost:3000`

### Build (Production)
```bash
npm run build
# or
yarn build
```
Generates static content to `build/` directory. Note: This also runs `glossary:gen` first.

### Serve Production Build Locally
```bash
npm run serve
# or
yarn serve
```

### Deploy to GitHub Pages
```bash
# With SSH
USE_SSH=true npm run deploy

# Without SSH
GIT_USER=<Your GitHub username> npm run deploy
```

### Utility Commands
| Command | Description |
|---------|-------------|
| `npm run clear` | Clear Docusaurus cache |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run glossary:gen` | Generate glossary from MDX terms |
| `npm run write-heading-ids` | Generate heading IDs for i18n |

## Development Conventions

### Content Structure
- All textbook content lives in `/docs/` as `.mdx` files
- Module hierarchy: `/docs/modules/<module-slug>/chapters/<chapter-slug>/<section>.mdx`
- Each content page must include `ri.PageMetadata` frontmatter:
  ```yaml
  ---
  title: "Page Title"
  description: "SEO description (20+ chars)"
  keywords: ["keyword1", "keyword2", "keyword3"]
  sidebar_label: "Short Label"
  sidebar_position: 1
  slug: "url-slug"
  ---
  ```

### Code Standards
- **TypeScript:** Strict mode enabled via `@docusaurus/tsconfig`
- **Formatting:** Follow existing code style (see `custom.css` for theme)
- **Naming:** PascalCase for components, camelCase for variables/functions
- **Imports:** Use absolute paths from root (configured in `tsconfig.json`)

### Content Formatting (from Constitution)
- Paragraphs: 2-4 lines max
- Code blocks must specify language: \`\`\`python, \`\`\`xml, \`\`\`bash
- Use emoji callouts: 💡 Tip, ⚠️ Warning, 📌 Note, 🧪 Code Example, 🔬 Research
- Math: Use KaTeX for equations
- Images: Store in `/static/img/` with module/chapter numbered filenames
- All technical claims must be verifiable with references

### Reusable Intelligence Patterns
The project uses standardized templates:
- `ri.PageMetadata` - Frontmatter metadata
- `ri.CodeExampleTemplate` - Standardized code examples
- `ri.WarningBlock` - Safety/important notices
- `ri.RobotDiagram` - Standard robot diagrams
- `ri.ExerciseTemplate` - End-of-chapter exercises
- `ri.LabTask` - Lab assignments
- `ri.CapstoneMilestone` - Capstone project milestones

### Glossary System
Terms are defined inline using:
```mdx
<GlossaryTerm term="Term Name" definition="Definition text" />
```
Run `npm run glossary:gen` to auto-generate `/docs/glossary.md`

### Spec-Driven Development
This project uses **Spec-Kit Plus** methodology:
- `specs/<feature>/` - Specifications, plans, tasks
- `history/prompts/` - Prompt History Records (PHRs)
- `history/adr/` - Architectural Decision Records

After significant changes, create a PHR in the appropriate subdirectory under `history/prompts/`.

### Git Workflow
- Feature branches: `<feature-name>` or `<module-number>-<feature>`
- Main deployment branch: `main`
- Deployments via `npm run deploy` to GitHub Pages

## Key Configuration Files

### `docusaurus.config.ts`
- Site title: "Physical AI & Humanoid Robotics"
- Base URL: `/ai-book-new/`
- Organization: `your-github-username` (update with your GitHub username)
- Theme: Classic preset with custom CSS
- Navbar: Links to Textbook, GitHub, Community

### `sidebars.ts`
Defines the `textbookSidebar` with categories for each module and hardware architecture section.

### `src/css/custom.css`
Premium "Relaxing Educational" theme with:
- Primary color: Red palette (`#E53935`)
- Dark mode support
- Custom typography (Inter, Roboto, Open Sans)
- Smooth transitions and shadows

## Testing & Quality Gates

### Pre-commit Checklist
- [ ] All MDX files have valid frontmatter
- [ ] All internal links work
- [ ] Code examples are tested/verified
- [ ] Images have alt text
- [ ] Glossary terms use correct syntax

### Build Validation
```bash
npm run build && npm run typecheck
```
Must complete without errors or warnings.

### Deployment Requirements
- Page load < 1 second
- Good Lighthouse SEO score
- Good accessibility score
- All links functional

## Additional Resources

- **Docusaurus Docs:** https://docusaurus.io/docs
- **Spec-Kit Plus:** https://github.com/panaversity/spec-kit-plus/
- **Project Specs:** See `/specs/1-physical-ai-textbook/` for detailed specifications

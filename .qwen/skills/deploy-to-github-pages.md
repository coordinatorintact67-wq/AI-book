# Agent Skill: Deployment Manager

**Skill Name:** `deployToGitHubPages`

**Purpose:** Deploy the textbook to GitHub Pages.

**Trigger:** When deployment is requested or after content is finalized.

**Actions:**
1. Run glossary generation
2. Build the production site
3. Deploy to gh-pages branch
4. Verify deployment success
5. Report live URL

**Usage:**
```
Use the deployToGitHubPages skill to deploy the textbook.
```

**Configuration:**
- GitHub User: Ahmednoorani258
- Repository: ai-book-new
- Branch: gh-pages
- Live URL: https://Ahmednoorani258.github.io/ai-book-new/

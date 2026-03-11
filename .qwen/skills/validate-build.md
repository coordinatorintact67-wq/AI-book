# Agent Skill: Build Validator

**Skill Name:** `validateBuild`

**Purpose:** Validate that the Docusaurus site builds correctly without errors.

**Trigger:** Before committing changes or after significant content updates.

**Actions:**
1. Run `npm run typecheck` for TypeScript validation
2. Run `npm run build` for Docusaurus build
3. Check for broken links
4. Validate all MDX frontmatter
5. Verify images and assets exist
6. Report any errors or warnings

**Usage:**
```
Use the validateBuild skill to ensure the site builds correctly.
```

**Configuration:**
- Commands: typecheck, build
- Fail on: errors or warnings
- Output: Build report with issues

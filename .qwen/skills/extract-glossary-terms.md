# Agent Skill: Glossary Term Extractor

**Skill Name:** `extractGlossaryTerms`

**Purpose:** Automatically extract and validate glossary terms from chapter content.

**Trigger:** When glossary generation is requested or chapter content is updated.

**Actions:**
1. Scan MDX files for `<GlossaryTerm>` components
2. Extract term and definition pairs
3. Validate definitions meet quality standards
4. Check for duplicate terms
5. Sort alphabetically
6. Update glossary.md file

**Usage:**
```
Use the extractGlossaryTerms skill to generate or update the glossary.
```

**Configuration:**
- Source directory: docs/modules
- Output file: docs/glossary.md
- Format: Alphabetically sorted markdown

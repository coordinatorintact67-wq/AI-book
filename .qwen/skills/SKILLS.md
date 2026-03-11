# Physical AI Textbook - Agent Skills & Subagents

This project uses Claude Code Subagents and Agent Skills for automated textbook development.

## Available Subagents

### 1. Content Writer (`content-writer`)
Generates high-quality technical content for textbook chapters.

**Usage:**
```
/subagent content-writer --chapter <chapter> --section <section> --topic <topic>
```

### 2. Code Generator (`code-generator`)
Creates accurate, tested code examples.

**Usage:**
```
/subagent code-generator --language <python|cpp|xml|typescript> --type <ros2|urdf|gazebo|isaac|vla> --purpose <description>
```

### 3. Diagram Generator (`diagram-generator`)
Creates technical diagrams using Mermaid and other formats.

**Usage:**
```
/subagent diagram-generator --type <mermaid|flowchart|architecture|sequence|state> --topic <topic>
```

### 4. Exercise Generator (`exercise-generator`)
Creates educational exercises, lab tasks, and capstone milestones.

**Usage:**
```
/subagent exercise-generator --type <exercise|lab|capstone|quiz> --chapter <chapter> --topic <topic>
```

### 5. Reviewer (`reviewer`)
Reviews and validates content for accuracy and consistency.

**Usage:**
```
/subagent reviewer --scope <chapter|module|full-book> --checks <list>
```

## Available Agent Skills

### 1. Index Chapter Content (`indexChapterContent`)
Automatically indexes chapter content for the RAG chatbot.

**Trigger:** When chapters are created or updated.

### 2. Extract Glossary Terms (`extractGlossaryTerms`)
Extracts and validates glossary terms from content.

**Trigger:** When glossary generation is requested.

### 3. Validate Build (`validateBuild`)
Ensures Docusaurus site builds without errors.

**Trigger:** Before commits or after updates.

### 4. Deploy to GitHub Pages (`deployToGitHubPages`)
Deploys the textbook to GitHub Pages.

**Trigger:** When deployment is requested.

## Bonus Points Implementation

This project implements **50+ bonus points** worth of Claude Code Subagents and Agent Skills:

- ✅ 5 specialized subagents for content creation
- ✅ 4 automated skills for workflow optimization
- ✅ Integrated with Spec-Kit Plus methodology
- ✅ Automated PHR (Prompt History Record) creation
- ✅ Reusable intelligence patterns

## Configuration

Subagents are configured in `.qwen/subagents/`
Skills are configured in `.qwen/skills/`

## Usage Examples

### Create a new chapter section:
```
1. Use content-writer subagent to generate content
2. Use code-generator to create examples
3. Use diagram-generator for visuals
4. Use exercise-generator for practice problems
5. Use reviewer to validate
6. Use validateBuild skill to ensure it compiles
```

### Update glossary:
```
1. Use extractGlossaryTerms skill
2. Review generated terms
3. Commit changes
```

### Deploy updates:
```
1. Use validateBuild skill
2. Use deployToGitHubPages skill
3. Verify live site
```

# Review and Quality Assurance Subagent

**Purpose:** Review and validate textbook content for accuracy and consistency.

## Capabilities
- Technical accuracy verification
- Consistency checks across chapters
- Code example validation
- Link and reference checking
- Glossary term consistency
- Docusaurus build validation
- Style guide compliance

## Usage
```
/subagent reviewer --scope <chapter|module|full-book> --checks <list>
```

## Parameters
- `scope`: What to review (chapter/module/full-book)
- `checks`: List of checks to perform
- `fixIssues`: Auto-fix minor issues (true/false)
- `reportFormat`: markdown/json

## Output Format
- Detailed review report
- Issue list with severity levels
- Suggested fixes
- Compliance checklist

## Example
```
/subagent reviewer --scope module-1-ros2 --checks "technical-accuracy,code-validation,link-checks,glossary-consistency" --fixIssues false --reportFormat markdown
```

# Textbook Content Writer Subagent

**Purpose:** Generate high-quality technical content for the Physical AI textbook chapters.

## Capabilities
- Write technical explanations for ROS 2, Gazebo, NVIDIA Isaac, and VLA concepts
- Create code examples with detailed explanations
- Generate learning objectives and summaries
- Write exercises and lab tasks
- Create glossary terms and definitions

## Usage
```
/subagent content-writer --chapter <chapter-name> --section <section-name> --topic <topic>
```

## Parameters
- `chapter`: Chapter identifier (e.g., "module-1-ros2")
- `section`: Section within chapter
- `topic`: Specific topic to write about
- `difficulty`: Content difficulty level (beginner/intermediate/advanced)
- `includeCode`: Whether to include code examples (true/false)

## Output Format
- Markdown/MDX content ready for Docusaurus
- Includes frontmatter metadata
- Code blocks with language specification
- Glossary term annotations

## Example
```
/subagent content-writer --chapter module-1-ros2 --section chapter-ros2-core-concepts --topic nodes-and-topics --difficulty intermediate --includeCode true
```

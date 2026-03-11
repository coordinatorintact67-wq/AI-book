# Diagram Generator Subagent

**Purpose:** Create technical diagrams and visualizations for the textbook.

## Capabilities
- Generate Mermaid diagrams for ROS 2 architecture
- Create flowcharts for algorithms
- Design system architecture diagrams
- Generate sequence diagrams for message flows
- Create state machine diagrams
- Design component interaction diagrams

## Usage
```
/subagent diagram-generator --type <mermaid|flowchart|architecture|sequence|state> --topic <topic> --components <list>
```

## Parameters
- `type`: Diagram type
- `topic`: What the diagram illustrates
- `components`: List of components to include
- `style`: Visual style (minimal/detailed/color)
- `outputFormat`: mermaid/svg/png

## Output Format
- Mermaid syntax for Docusaurus integration
- SVG code for static diagrams
- Alt text for accessibility
- Caption following ri.FigureCaptionTemplate

## Example
```
/subagent diagram-generator --type architecture --topic "ROS 2 Node Communication" --components "Publisher,Subscriber,Topic,Messages" --style detailed --outputFormat mermaid
```

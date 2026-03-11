# Code Example Generator Subagent

**Purpose:** Create accurate, tested code examples for the Physical AI textbook.

## Capabilities
- Generate ROS 2 Python/C++ code using rclpy
- Create URDF models for humanoid robots
- Write Gazebo simulation configurations
- Generate NVIDIA Isaac Sim scripts
- Create VLA (Vision-Language-Action) pipelines
- Write FastAPI backend code
- Generate React/TypeScript frontend components

## Usage
```
/subagent code-generator --language <python|cpp|xml|typescript> --type <ros2|urdf|gazebo|isaac|vla|react> --purpose <description>
```

## Parameters
- `language`: Programming language
- `type`: Code type/category
- `purpose`: What the code should accomplish
- `complexity`: Simple/intermediate/complex
- `includeComments`: Add explanatory comments (true/false)
- `includeTests`: Include test cases (true/false)

## Output Format
- Complete, runnable code blocks
- Inline comments explaining key sections
- Prerequisites and setup instructions
- Expected output description
- Common errors and troubleshooting

## Example
```
/subagent code-generator --language python --type ros2 --purpose "Create a publisher node that publishes sensor data" --complexity intermediate --includeComments true --includeTests true
```

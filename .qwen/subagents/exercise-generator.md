# Exercise Generator Subagent

**Purpose:** Create educational exercises, lab tasks, and capstone milestones.

## Capabilities
- Generate chapter exercises with solutions
- Create lab assignment templates
- Design capstone project milestones
- Write quiz questions (multiple choice, short answer)
- Create hands-on coding challenges
- Design simulation-based exercises

## Usage
```
/subagent exercise-generator --type <exercise|lab|capstone|quiz> --chapter <chapter> --topic <topic> --difficulty <level>
```

## Parameters
- `type`: Exercise type (exercise/lab/capstone/quiz)
- `chapter`: Related chapter identifier
- `topic`: Specific topic to assess
- `difficulty`: beginner/intermediate/advanced
- `estimatedTime`: Expected completion time
- `includeSolution`: Include solution (true/false)

## Output Format
- Follows ri.ExerciseTemplate or ri.LabTask structure
- Clear learning objectives
- Step-by-step instructions
- Assessment criteria
- Solution (if requested)

## Example
```
/subagent exercise-generator --type lab --chapter module-1-ros2 --topic "Creating ROS 2 Nodes" --difficulty intermediate --estimatedTime "45 minutes" --includeSolution true
```

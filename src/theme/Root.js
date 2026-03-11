import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import Chatbot from '../components/Chatbot/Chatbot';
import {AuthProvider} from '../components/Auth/AuthContext';

// Import your custom components
import RobotDiagram from '../docusaurus-theme/components/RobotDiagram';
import WarningBlock from '../docusaurus-theme/components/WarningBlock';
import CodeExample from '../docusaurus-theme/components/CodeExample';
import GlossaryTerm from '../docusaurus-theme/components/GlossaryTerm';
import Exercise from '../docusaurus-theme/components/Exercise';
import LabTask from '../docusaurus-theme/components/LabTask';
import CapstoneMilestone from '../docusaurus-theme/components/CapstoneMilestone';

const components = {
  RobotDiagram,
  WarningBlock,
  CodeExample,
  GlossaryTerm,
  Exercise,
  LabTask,
  CapstoneMilestone,
};

export default function Root({children}) {
  return (
    <AuthProvider>
      <MDXProvider components={components}>
        {children}
        <Chatbot apiUrl="http://localhost:8000" />
      </MDXProvider>
    </AuthProvider>
  );
}

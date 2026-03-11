import React from 'react';
import Chatbot from '../Chatbot/Chatbot';
import PersonalizationPanel from '../Personalization/PersonalizationPanel';
import TranslationPanel from '../Translation/TranslationPanel';
import { AuthProvider } from '../Auth/AuthContext';
import styles from './ChapterLayout.module.css';

interface ChapterLayoutProps {
  children: React.ReactNode;
  chapterId: string;
  chapterTitle: string;
}

export default function ChapterLayout({ 
  children, 
  chapterId, 
  chapterTitle 
}: ChapterLayoutProps) {
  return (
    <AuthProvider>
      <div className={styles.chapterLayout}>
        {/* Chapter Header with Controls */}
        <div className={styles.chapterHeader}>
          <div className={styles.chapterInfo}>
            <h1>{chapterTitle}</h1>
          </div>
          <div className={styles.chapterControls}>
            <PersonalizationPanel chapterId={chapterId} />
            <TranslationPanel chapterId={chapterId} />
          </div>
        </div>

        {/* Chapter Content */}
        <div className={styles.chapterContent}>
          {children}
        </div>

        {/* Chatbot (always visible) */}
        <Chatbot apiUrl={process.env.REACT_APP_CHATBOT_URL || 'http://localhost:8000'} />
      </div>
    </AuthProvider>
  );
}

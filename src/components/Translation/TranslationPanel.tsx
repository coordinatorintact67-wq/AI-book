import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import styles from './TranslationPanel.module.css';

// Translation dictionary for common technical terms
const technicalTermsDictionary: Record<string, string> = {
  'ROS 2': 'آر او ایس 2',
  'Robot': 'روبوٹ',
  'Artificial Intelligence': 'مصنوعی ذہانت',
  'Machine Learning': 'مشین لرننگ',
  'Sensor': 'سینسر',
  'Algorithm': 'الگورتھم',
  'Programming': 'پروگرامنگ',
  'Python': 'پائتھن',
  'Node': 'نوڈ',
  'Topic': 'ٹاپک',
  'Service': 'سروس',
  'Message': 'پیغام',
  'Publisher': 'پبلشر',
  'Subscriber': 'سبسکرائبر',
  'Simulation': 'سمولیشن',
  'Digital Twin': 'ڈیجیٹل ٹون',
  'Vision': 'ویژن',
  'Language': 'زبان',
  'Action': 'ایکشن',
  'Humanoid': 'ہیومینوائڈ',
  'Robotics': 'روبوٹکس',
};

interface TranslationPanelProps {
  chapterId: string;
  onTranslationToggle?: (enabled: boolean) => void;
}

export default function TranslationPanel({ 
  chapterId,
  onTranslationToggle 
}: TranslationPanelProps) {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load translation preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`translation_${chapterId}`);
    if (saved === 'true') {
      setIsEnabled(true);
      onTranslationToggle?.(true);
    }
  }, [chapterId, onTranslationToggle]);

  const toggleTranslation = async () => {
    if (!isEnabled) {
      setIsLoading(true);
      // Simulate loading translation
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsEnabled(true);
      localStorage.setItem(`translation_${chapterId}`, 'true');
      onTranslationToggle?.(true);
      setIsLoading(false);
    } else {
      setIsEnabled(false);
      localStorage.setItem(`translation_${chapterId}`, 'false');
      onTranslationToggle?.(false);
    }
  };

  const translateTerm = (term: string): string => {
    return technicalTermsDictionary[term] || term;
  };

  // This would integrate with a translation API in production
  const translateText = async (text: string): Promise<string> => {
    // In production, call Google Translate API or similar
    // For now, return text with translated technical terms
    let translated = text;
    Object.entries(technicalTermsDictionary).forEach(([en, ur]) => {
      translated = translated.replace(
        new RegExp(`\\b${en}\\b`, 'g'),
        `${ur} (${en})`
      );
    });
    return translated;
  };

  if (!user) {
    return (
      <div className={styles.translationPanel}>
        <div className={styles.loginPrompt}>
          <p>🔐 Sign in to enable Urdu translation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.translationPanel}>
      <button
        className={`${styles.toggleButton} ${isEnabled ? styles.enabled : ''}`}
        onClick={toggleTranslation}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className={styles.loadingSpinner}></span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
          </svg>
        )}
        {isEnabled ? 'اردو Enabled' : 'Translate to اردو'}
      </button>

      {isEnabled && (
        <div className={styles.translationInfo}>
          <p className={styles.infoText}>
            📝 Urdu translation is enabled. Technical terms will be shown in both English and Urdu.
          </p>
          <button 
            className={styles.disableButton}
            onClick={() => toggleTranslation()}
          >
            Disable Translation
          </button>
        </div>
      )}
    </div>
  );
}

// Higher Order Component for translating content
export function withTranslation<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function TranslatedComponent(props: P) {
    const [translationEnabled, setTranslationEnabled] = useState(false);
    
    return (
      <>
        <WrappedComponent {...props} />
        {translationEnabled && (
          <div className="urdu-translation-overlay">
            {/* Translation overlay would be implemented here */}
          </div>
        )}
      </>
    );
  };
}

// Hook for using translation in components
export function useTranslation() {
  const [isEnabled, setIsEnabled] = useState(false);
  
  const translateTerm = (term: string): string => {
    if (!isEnabled) return term;
    return technicalTermsDictionary[term] || term;
  };

  return { isEnabled, setIsEnabled, translateTerm, technicalTermsDictionary };
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import styles from './PersonalizationPanel.module.css';

interface PersonalizationPreferences {
  contentDifficulty: 'beginner' | 'intermediate' | 'advanced';
  showCodeExamples: boolean;
  showDetailedExplanations: boolean;
  preferredLearningStyle: 'theoretical' | 'practical' | 'balanced';
}

interface PersonalizationPanelProps {
  chapterId: string;
  onPreferencesChange?: (prefs: PersonalizationPreferences) => void;
}

const defaultPreferences: PersonalizationPreferences = {
  contentDifficulty: 'intermediate',
  showCodeExamples: true,
  showDetailedExplanations: true,
  preferredLearningStyle: 'balanced',
};

export default function PersonalizationPanel({ 
  chapterId, 
  onPreferencesChange 
}: PersonalizationPanelProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<PersonalizationPreferences>(defaultPreferences);
  const [isSaved, setIsSaved] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`prefs_${chapterId}`);
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load preferences:', e);
      }
    }
  }, [chapterId]);

  // Notify parent of preference changes
  useEffect(() => {
    onPreferencesChange?.(preferences);
  }, [preferences, onPreferencesChange]);

  const handlePreferenceChange = (
    key: keyof PersonalizationPreferences,
    value: boolean | string
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem(`prefs_${chapterId}`, JSON.stringify(preferences));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem(`prefs_${chapterId}`);
  };

  if (!user) {
    return (
      <div className={styles.personalizationPanel}>
        <div className={styles.loginPrompt}>
          <p>🔐 Sign in to personalize your learning experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.personalizationPanel}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
        Personalize
      </button>

      {isOpen && (
        <div className={styles.panelContent}>
          <div className={styles.panelHeader}>
            <h4>Chapter Preferences</h4>
            <div className={styles.headerActions}>
              {isSaved && <span className={styles.savedIndicator}>✓ Saved</span>}
              <button onClick={resetPreferences} className={styles.resetButton}>
                Reset
              </button>
            </div>
          </div>

          <div className={styles.preferenceGroup}>
            <label>Content Difficulty</label>
            <div className={styles.buttonGroup}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  className={`${styles.difficultyBtn} ${
                    preferences.contentDifficulty === level ? styles.active : ''
                  }`}
                  onClick={() => handlePreferenceChange('contentDifficulty', level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.preferenceGroup}>
            <label>Learning Style</label>
            <div className={styles.buttonGroup}>
              {(['theoretical', 'practical', 'balanced'] as const).map((style) => (
                <button
                  key={style}
                  className={`${styles.difficultyBtn} ${
                    preferences.preferredLearningStyle === style ? styles.active : ''
                  }`}
                  onClick={() => handlePreferenceChange('preferredLearningStyle', style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.toggleGroup}>
            <div className={styles.toggleItem}>
              <span>Show Code Examples</span>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences.showCodeExamples}
                  onChange={(e) =>
                    handlePreferenceChange('showCodeExamples', e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.toggleItem}>
              <span>Detailed Explanations</span>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={preferences.showDetailedExplanations}
                  onChange={(e) =>
                    handlePreferenceChange('showDetailedExplanations', e.target.checked)
                  }
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>

          <button onClick={savePreferences} className={styles.saveButton}>
            {isSaved ? '✓ Saved!' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
}

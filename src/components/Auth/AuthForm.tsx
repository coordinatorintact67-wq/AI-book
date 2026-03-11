import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from '../../pages/auth.module.css';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    roboticsBackground: '',
    softwareExperience: '',
    hardwareExperience: '',
    learningGoals: '',
    educationLevel: '',
  });

  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signUp(email, password, formData);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(e);
  };

  return (
    <div className={styles.authContainer}>
      {!isSignUp ? (
        // Sign In Form
        <form onSubmit={handleSignIn} className={styles.authForm}>
          <div className={styles.formHeader}>
            <h2>Welcome Back</h2>
            <p>Sign in to continue learning</p>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className={styles.switchForm}>
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className={styles.linkButton}>
                Sign Up
              </button>
            </p>
          </div>
        </form>
      ) : step === 1 ? (
        // Sign Up - Step 1
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className={styles.authForm}>
          <div className={styles.formHeader}>
            <h2>Create Account</h2>
            <p>Join the Physical AI learning community</p>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            Next: Tell Us About Yourself
          </button>
          <div className={styles.switchForm}>
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className={styles.linkButton}>
                Sign In
              </button>
            </p>
          </div>
        </form>
      ) : (
        // Sign Up - Step 2 (Background Questionnaire)
        <form onSubmit={handleBackgroundSubmit} className={styles.authForm}>
          <div className={styles.formHeader}>
            <h3>Your Background</h3>
            <p>Help us personalize your learning experience</p>
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label>Education Level</label>
            <select
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
              required
              disabled={isLoading}
            >
              <option value="">Select...</option>
              <option value="high-school">High School</option>
              <option value="undergraduate">Undergraduate Student</option>
              <option value="graduate">Graduate Student</option>
              <option value="professional">Working Professional</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Robotics Background</label>
            <select
              value={formData.roboticsBackground}
              onChange={(e) => setFormData({ ...formData, roboticsBackground: e.target.value })}
              required
              disabled={isLoading}
            >
              <option value="">Select...</option>
              <option value="none">No prior experience</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Software Experience</label>
            <textarea
              value={formData.softwareExperience}
              onChange={(e) => setFormData({ ...formData, softwareExperience: e.target.value })}
              required
              rows={3}
              placeholder="Describe your programming experience..."
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hardware Experience</label>
            <textarea
              value={formData.hardwareExperience}
              onChange={(e) => setFormData({ ...formData, hardwareExperience: e.target.value })}
              required
              rows={3}
              placeholder="Describe any hardware/electronics experience..."
              disabled={isLoading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Learning Goals</label>
            <textarea
              value={formData.learningGoals}
              onChange={(e) => setFormData({ ...formData, learningGoals: e.target.value })}
              required
              rows={3}
              placeholder="What do you hope to achieve with Physical AI?"
              disabled={isLoading}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => setStep(1)} className={styles.secondaryButton} disabled={isLoading}>
              Back
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.features}>
        <h3>Why Sign In?</h3>
        <ul>
          <li>📚 Personalize your learning experience</li>
          <li>🌐 Enable Urdu translation</li>
          <li>💬 Get AI-powered help from the chatbot</li>
          <li>📊 Track your progress across chapters</li>
        </ul>
      </div>
    </div>
  );
}

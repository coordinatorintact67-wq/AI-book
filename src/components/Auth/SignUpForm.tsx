import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './AuthForms.module.css';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Background questions
    roboticsBackground: '',
    softwareExperience: '',
    hardwareExperience: '',
    learningGoals: '',
    educationLevel: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        roboticsBackground: formData.roboticsBackground,
        softwareExperience: formData.softwareExperience,
        hardwareExperience: formData.hardwareExperience,
        learningGoals: formData.learningGoals,
        educationLevel: formData.educationLevel,
      });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.authForm}>
      <div className={styles.formHeader}>
        <h2>Create Account</h2>
        <p>Join the Physical AI learning community</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {step === 1 && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={styles.submitButton}
          >
            Next: Tell Us About Yourself
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className={styles.backgroundSection}>
            <h3>Your Background</h3>
            <p>Help us personalize your learning experience</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="educationLevel">Education Level</label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="high-school">High School</option>
              <option value="undergraduate">Undergraduate Student</option>
              <option value="graduate">Graduate Student</option>
              <option value="professional">Working Professional</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="roboticsBackground">Robotics Background</label>
            <select
              id="roboticsBackground"
              name="roboticsBackground"
              value={formData.roboticsBackground}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="none">No prior experience</option>
              <option value="beginner">Beginner (taken 1-2 courses)</option>
              <option value="intermediate">Intermediate (built projects)</option>
              <option value="advanced">Advanced (professional experience)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="softwareExperience">Software Experience</label>
            <textarea
              id="softwareExperience"
              name="softwareExperience"
              value={formData.softwareExperience}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe your programming experience (Python, C++, etc.)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="hardwareExperience">Hardware Experience</label>
            <textarea
              id="hardwareExperience"
              name="hardwareExperience"
              value={formData.hardwareExperience}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe any hardware/electronics experience"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="learningGoals">Learning Goals</label>
            <textarea
              id="learningGoals"
              name="learningGoals"
              value={formData.learningGoals}
              onChange={handleChange}
              required
              rows={3}
              placeholder="What do you hope to achieve with Physical AI?"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => setStep(1)}
              className={styles.secondaryButton}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}

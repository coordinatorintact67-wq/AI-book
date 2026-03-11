import React from 'react';
import Layout from '@theme/Layout';
import AuthForm from '../components/Auth/AuthForm';
import styles from './auth.module.css';

export default function AuthPage() {
  return (
    <Layout title="Authentication" description="Sign in or create an account">
      <div className={styles.authPage}>
        <AuthForm />
      </div>
    </Layout>
  );
}

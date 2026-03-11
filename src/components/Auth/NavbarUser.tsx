import React from 'react';
import { useAuth } from './AuthContext';
import styles from './NavbarUser.module.css';

export default function NavbarUser() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.userContainer}>
      <span className={styles.userName}>
        👤 {user.name || user.email}
      </span>
      <button onClick={handleSignOut} className={styles.signOutButton}>
        Sign Out
      </button>
    </div>
  );
}

import React from 'react';
import { useAuth } from '@site/src/components/Auth/AuthContext';

export default function AuthNavbarItem() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <a href="/auth" className="navbar__item navbar__link">
        Sign In
      </a>
    );
  }

  return (
    <div className="navbar__item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        👤 {user.name || user.email}
      </span>
      <button
        onClick={handleSignOut}
        style={{
          padding: '6px 14px',
          background: '#E53935',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

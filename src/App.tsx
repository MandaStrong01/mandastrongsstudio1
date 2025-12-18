import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'black',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading MandaStrong Studio...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'black',
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>MANDASTRONG'S STUDIO</h1>
      <p style={{ fontSize: '20px', marginBottom: '20px' }}>
        {user ? `Welcome ${user.email}!` : 'Please sign in to continue'}
      </p>
      <button
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '12px 24px',
          fontSize: '18px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
        onClick={() => alert('App is working!')}
      >
        Click Me to Test
      </button>
    </div>
  );
}

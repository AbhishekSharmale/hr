import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const demoUsers = [
    { email: 'admin@techstart.com', password: 'admin123', role: 'Admin' },
    { email: 'hr@techstart.com', password: 'hr123', role: 'HR Manager' },
    { email: 'manager@techstart.com', password: 'manager123', role: 'Manager' },
    { email: 'employee@techstart.com', password: 'emp123', role: 'Employee' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect based on role
        switch (result.user.role) {
          case 'employee':
            router.push('/employee-dashboard');
            break;
          case 'manager':
            router.push('/manager-dashboard');
            break;
          case 'hr':
          case 'admin':
            router.push('/reports/analytics');
            break;
          default:
            router.push('/');
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user) => {
    setCredentials({ email: user.email, password: user.password });
  };

  return (
    <>
      <Head>
        <title>Login - HR SaaS Platform</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>
              HR SaaS Platform
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
              Demo Accounts - Click to auto-fill:
            </p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {demoUsers.map(user => (
                <button
                  key={user.email}
                  onClick={() => quickLogin(user)}
                  style={{
                    padding: '8px 12px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseOut={(e) => e.target.style.background = '#f8fafc'}
                >
                  <strong>{user.role}</strong> - {user.email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
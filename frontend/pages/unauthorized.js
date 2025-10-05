import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Unauthorized() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <Head>
        <title>Unauthorized - HR SaaS Platform</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚫</div>
          <h1 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            Access Denied
          </h1>
          <p style={{ margin: '0 0 24px 0', color: '#64748b', lineHeight: '1.6' }}>
            You don't have permission to access this page. Please contact your administrator or login with appropriate credentials.
          </p>
          <button
            onClick={logout}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </>
  );
}
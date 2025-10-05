import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      // Redirect based on role
      switch (user.role) {
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
          router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
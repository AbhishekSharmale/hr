import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Reports() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.data))
      .catch(err => console.error('Error:', err));
  }, []);

  const downloadEmployeeReport = () => {
    const csvData = employees.map(emp => 
      `${emp.name},${emp.email},${emp.department},${emp.designation}`
    ).join('\n');
    const blob = new Blob([`Name,Email,Department,Designation\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee-report.csv';
    a.click();
  };

  const downloadLeaveReport = () => {
    const leaveData = employees.map(emp => {
      const casual = Math.floor(Math.random() * 12) + 1;
      const sick = Math.floor(Math.random() * 10) + 1;
      const earned = Math.floor(Math.random() * 15) + 5;
      return `${emp.name},${emp.department},${casual},${sick},${earned}`;
    }).join('\n');
    const blob = new Blob([`Employee,Department,Casual Leave,Sick Leave,Earned Leave\n${leaveData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leave-balance-report.csv';
    a.click();
  };

  return (
    <>
      <Head>
        <title>Reports - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Reports & Analytics</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Employee Reports */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Employee Reports</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Download comprehensive employee data and analytics</p>
            <button 
              onClick={downloadEmployeeReport}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📊 Download Employee List (CSV)
            </button>
          </div>

          {/* Leave Reports */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Leave Balance Reports</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Track leave balances and usage across teams</p>
            <button 
              onClick={downloadLeaveReport}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: '#16a34a', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📈 Download Leave Report (CSV)
            </button>
          </div>

          {/* Attendance Reports */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Attendance Summary</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Monthly attendance and productivity metrics</p>
            <button 
              onClick={() => alert('Attendance report - Coming soon!')}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📅 Download Attendance Report
            </button>
          </div>

          {/* Hiring Reports */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>Hiring Pipeline</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Recruitment metrics and candidate analytics</p>
            <button 
              onClick={() => alert('Hiring pipeline report - Coming soon!')}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: '#7c3aed', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              💼 Download Hiring Report
            </button>
          </div>

        </div>
        
        <button 
          onClick={() => window.history.back()}
          style={{ 
            marginTop: '30px',
            padding: '10px 20px', 
            background: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}
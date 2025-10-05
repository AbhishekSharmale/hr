import { useState } from 'react';
import Head from 'next/head';
import { useCompany } from '../context/CompanyContext';

export default function Settings() {
  const { company, updateCompany } = useCompany();
  const [size] = useState('25 employees');

  const [leaveTypes] = useState([
    { id: 1, name: 'Casual Leave', quota: 12, color: '#3b82f6' },
    { id: 2, name: 'Sick Leave', quota: 10, color: '#ef4444' },
    { id: 3, name: 'Earned Leave', quota: 15, color: '#10b981' },
    { id: 4, name: 'Work From Home', quota: 24, color: '#f59e0b' }
  ]);

  const handleSave = () => {
    console.log('Current company state:', company);
    alert('Settings saved successfully!');
  };

  return (
    <>
      <Head>
        <title>Settings - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Company Settings</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Company Profile */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Company Profile</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Company Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  background: company.logoUrl ? `url(${company.logoUrl})` : company.primaryColor,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {!company.logoUrl && company.name.substring(0, 2).toUpperCase()}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => updateCompany({logoUrl: e.target.result});
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    flex: 1
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Company Name</label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => {
                  console.log('Updating company name to:', e.target.value);
                  updateCompany({name: e.target.value});
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Industry</label>
              <select
                value={company.industry}
                onChange={(e) => updateCompany({industry: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Location</label>
              <input
                type="text"
                value={company.location}
                onChange={(e) => updateCompany({location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <button 
              onClick={handleSave}
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
              Save Changes
            </button>
          </div>

          {/* Leave Policies */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Leave Policies</h2>
            
            {leaveTypes.map(leave => (
              <div key={leave.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: leave.color 
                  }} />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{leave.name}</span>
                </div>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{leave.quota} days/year</span>
              </div>
            ))}

            <button 
              onClick={() => alert('Edit leave policies - Coming soon!')}
              style={{ 
                width: '100%',
                marginTop: '20px',
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
              Edit Leave Policies
            </button>
          </div>

        </div>

        {/* Additional Settings */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Additional Settings</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button 
              onClick={() => alert('User management - Coming soon!')}
              style={{ 
                padding: '15px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              👥 User Management
            </button>
            
            <button 
              onClick={() => alert('Holiday calendar - Coming soon!')}
              style={{ 
                padding: '15px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📅 Holiday Calendar
            </button>
            
            <button 
              onClick={() => alert('Billing & subscription - Coming soon!')}
              style={{ 
                padding: '15px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💳 Billing & Subscription
            </button>
            
            <button 
              onClick={() => alert('Integrations - Coming soon!')}
              style={{ 
                padding: '15px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔗 Integrations
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
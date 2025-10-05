import { useState } from 'react';
import Head from 'next/head';

export default function Settings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'TechStart Solutions',
    industry: 'Technology',
    size: '25 employees',
    location: 'Bangalore, India',
    logoUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#f3f4f6'
  });

  const [leaveTypes] = useState([
    { id: 1, name: 'Casual Leave', quota: 12, color: '#3b82f6' },
    { id: 2, name: 'Sick Leave', quota: 10, color: '#ef4444' },
    { id: 3, name: 'Earned Leave', quota: 15, color: '#10b981' },
    { id: 4, name: 'Work From Home', quota: 24, color: '#f59e0b' }
  ]);

  const [logoFile, setLogoFile] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleSave = async () => {
    try {
      // If logo file selected, upload it first
      if (logoFile) {
        setUploadingLogo(true);
        // Simulate logo upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        const logoUrl = `https://storage.example.com/logos/${Date.now()}-${logoFile.name}`;
        setCompanyInfo(prev => ({ ...prev, logoUrl }));
        setLogoFile(null);
        setUploadingLogo(false);
      }
      
      // Save company settings
      alert('Company branding updated successfully!');
      
      // Apply branding immediately
      document.documentElement.style.setProperty('--brand-primary', companyInfo.primaryColor);
      document.documentElement.style.setProperty('--brand-secondary', companyInfo.secondaryColor);
      
    } catch (error) {
      alert('Failed to save settings. Please try again.');
      setUploadingLogo(false);
    }
  };
  
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Logo file must be smaller than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setLogoFile(file);
    }
  };

  return (
    <>
      <Head>
        <title>Settings - HR SaaS Platform</title>
        <style jsx global>{`
          :root {
            --brand-primary: ${companyInfo.primaryColor};
            --brand-secondary: ${companyInfo.secondaryColor};
          }
        `}</style>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Company Settings</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* Company Profile & Branding */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Company Profile & Branding</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Company Name *</label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #2563eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                placeholder="Enter your company name"
              />
              <p style={{ fontSize: '12px', color: '#64748b', margin: '5px 0 0 0' }}>This will appear in your dashboard header and employee portal</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Industry</label>
              <select
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
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
                value={companyInfo.location}
                onChange={(e) => setCompanyInfo({...companyInfo, location: e.target.value})}
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
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Company Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {companyInfo.logoUrl && (
                  <img 
                    src={companyInfo.logoUrl} 
                    alt="Company logo" 
                    style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                )}
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('logo-upload').click()}
                  disabled={uploadingLogo}
                  style={{
                    padding: '8px 16px',
                    background: uploadingLogo ? '#9ca3af' : '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: uploadingLogo ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {uploadingLogo ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      📎 {logoFile ? logoFile.name : 'Upload Logo'}
                    </>
                  )}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '5px 0 0 0' }}>PNG, JPG up to 2MB. Recommended: 200x200px</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Primary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={companyInfo.primaryColor}
                    onChange={(e) => setCompanyInfo({...companyInfo, primaryColor: e.target.value})}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={companyInfo.primaryColor}
                    onChange={(e) => setCompanyInfo({...companyInfo, primaryColor: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Secondary Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="color"
                    value={companyInfo.secondaryColor}
                    onChange={(e) => setCompanyInfo({...companyInfo, secondaryColor: e.target.value})}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={companyInfo.secondaryColor}
                    onChange={(e) => setCompanyInfo({...companyInfo, secondaryColor: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: companyInfo.primaryColor, 
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

        {/* Branding Preview */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '30px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Branding Preview</h2>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#64748b' }}>Here's how your branding will appear in the dashboard:</p>
            
            {/* Mock Sidebar Header */}
            <div style={{ 
              background: 'white', 
              padding: '16px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {companyInfo.logoUrl ? (
                <img 
                  src={companyInfo.logoUrl} 
                  alt="Logo preview" 
                  style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  background: companyInfo.primaryColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {companyInfo.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                </div>
              )}
              <span style={{ fontSize: '18px', fontWeight: '700', color: companyInfo.primaryColor }}>
                {companyInfo.name || 'Your Company Name'}
              </span>
            </div>
            
            {/* Mock Button */}
            <div style={{ marginTop: '15px' }}>
              <button style={{
                padding: '8px 16px',
                background: companyInfo.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Sample Button
              </button>
            </div>
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
              onClick={() => alert('Holiday calendar - Coming soon!'))}
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
            background: companyInfo.primaryColor, 
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
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useCompany } from '../context/CompanyContext';

export default function ITDashboard() {
  const { company } = useCompany();
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(null);
  const [emailForm, setEmailForm] = useState({ companyEmail: '', tempPassword: '' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const fetchPendingAccounts = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/onboarding/pending-it');
      const data = await res.json();
      setPendingAccounts(data.data);
    } catch (error) {
      console.error('Error fetching pending accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmail = async (employeeId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/onboarding/mark-email-created/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm)
      });
      
      if (res.ok) {
        setToast('Email account created successfully!');
        setShowCreateModal(null);
        setEmailForm({ companyEmail: '', tempPassword: '' });
        fetchPendingAccounts();
        setTimeout(() => setToast(''), 3000);
      }
    } catch (error) {
      console.error('Error creating email:', error);
    }
  };

  const generateEmail = (name) => {
    return name.toLowerCase().replace(/\s+/g, '.') + '@' + company.name.toLowerCase().replace(/\s+/g, '') + '.com';
  };

  return (
    <>
      <Head>
        <title>IT Dashboard - {company.name}</title>
      </Head>
      
      <div style={{ display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Sidebar */}
        <div style={{ width: '240px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '20px 0' }}>
          <div style={{ padding: '0 20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '6px', background: company.primaryColor,
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '600'
            }}>
              {company.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <h2 style={{ color: company.primaryColor, margin: 0, fontSize: '16px', fontWeight: '700' }}>{company.name}</h2>
          </div>
          <nav>
            <div style={{ padding: '8px 20px', background: '#eff6ff', borderRight: '3px solid #2563eb', color: '#2563eb', fontSize: '14px', fontWeight: '500' }}>IT Tasks</div>
            <div style={{ padding: '8px 20px', color: '#64748b', fontSize: '14px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>← Back to Dashboard</div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '20px' }}>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ color: '#1e293b', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>IT Dashboard</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Manage email accounts and IT setup for new employees</p>
          </header>

          {/* Accounts to Create */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e293b', margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Accounts to Create ({pendingAccounts.length})
              </h2>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading...</div>
            ) : pendingAccounts.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ color: '#1e293b', margin: '0 0 8px 0' }}>All caught up!</h3>
                <p style={{ color: '#64748b', margin: 0 }}>No pending email accounts to create.</p>
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Employee</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Suggested Email</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAccounts.map((employee) => (
                      <tr key={employee.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '14px', fontWeight: '600', color: '#64748b'
                            }}>
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: '#1e293b' }}>{employee.name}</div>
                              <div style={{ fontSize: '13px', color: '#64748b' }}>{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: '500', color: '#1e293b' }}>{employee.department}</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>{employee.designation}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                            {generateEmail(employee.name)}
                          </code>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button
                            onClick={() => {
                              setShowCreateModal(employee);
                              setEmailForm({ companyEmail: generateEmail(employee.name), tempPassword: 'Welcome123!' });
                            }}
                            style={{
                              padding: '8px 16px', background: '#16a34a', color: 'white',
                              border: 'none', borderRadius: '6px', cursor: 'pointer',
                              fontSize: '14px', fontWeight: '500'
                            }}
                          >
                            Create Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Create Email Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '12px',
            width: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Create Email Account</h2>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' }}>
              Creating company email for <strong>{showCreateModal.name}</strong>
            </p>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Company Email *</label>
              <input
                type="email"
                value={emailForm.companyEmail}
                onChange={(e) => setEmailForm({...emailForm, companyEmail: e.target.value})}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '6px', fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Temporary Password</label>
              <input
                type="text"
                value={emailForm.tempPassword}
                onChange={(e) => setEmailForm({...emailForm, tempPassword: e.target.value})}
                style={{
                  width: '100%', padding: '10px', border: '1px solid #d1d5db',
                  borderRadius: '6px', fontSize: '14px'
                }}
                placeholder="Optional - for employee reference"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(null)}
                style={{
                  padding: '10px 20px', border: '1px solid #d1d5db',
                  backgroundColor: 'white', color: '#374151',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateEmail(showCreateModal.id)}
                style={{
                  padding: '10px 20px', border: 'none',
                  backgroundColor: '#16a34a', color: 'white',
                  borderRadius: '6px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '500'
                }}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#10b981', color: 'white', padding: '12px 20px',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1001, fontSize: '14px', fontWeight: '500'
        }}>
          ✓ {toast}
        </div>
      )}
    </>
  );
}
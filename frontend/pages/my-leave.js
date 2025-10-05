import { useState } from 'react';
import Head from 'next/head';

export default function MyLeave() {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'WFH Request', dates: 'Dec 10', reason: 'Internet maintenance at home', status: 'Approved', appliedDate: '2024-12-08' },
    { id: 2, type: 'Casual Leave', dates: 'Dec 15-16', reason: 'Family function', status: 'Pending', appliedDate: '2024-12-12' }
  ]);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [leaveBalance] = useState({
    casual: { used: 1, total: 12 },
    sick: { used: 0, total: 10 },
    earned: { used: 0, total: 15 }
  });

  const handleSubmitLeave = () => {
    if (!newRequest.type || !newRequest.startDate || !newRequest.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const request = {
      id: leaveRequests.length + 1,
      ...newRequest,
      dates: newRequest.endDate ? `${newRequest.startDate} - ${newRequest.endDate}` : newRequest.startDate,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([request, ...leaveRequests]);
    setNewRequest({ type: '', startDate: '', endDate: '', reason: '' });
    setShowApplyForm(false);

    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
    toast.textContent = '✓ Leave request submitted successfully!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  return (
    <>
      <Head>
        <title>My Leave - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '600' }}>My Leave Management</h1>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              padding: '8px 16px', 
              background: '#f1f5f9', 
              color: '#64748b', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          
          {/* Leave Balance */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>Leave Balance</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>Casual Leave</span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{leaveBalance.casual.total - leaveBalance.casual.used}/{leaveBalance.casual.total} days</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#10b981', 
                  height: '100%', 
                  width: `${((leaveBalance.casual.total - leaveBalance.casual.used) / leaveBalance.casual.total) * 100}%`
                }} />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>Sick Leave</span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{leaveBalance.sick.total - leaveBalance.sick.used}/{leaveBalance.sick.total} days</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#ef4444', 
                  height: '100%', 
                  width: `${((leaveBalance.sick.total - leaveBalance.sick.used) / leaveBalance.sick.total) * 100}%`
                }} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>Earned Leave</span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>{leaveBalance.earned.total - leaveBalance.earned.used}/{leaveBalance.earned.total} days</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                <div style={{ 
                  background: '#3b82f6', 
                  height: '100%', 
                  width: `${((leaveBalance.earned.total - leaveBalance.earned.used) / leaveBalance.earned.total) * 100}%`
                }} />
              </div>
            </div>

            <button 
              onClick={() => setShowApplyForm(true)}
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
              + Apply for Leave
            </button>
          </div>

          {/* Quick Info */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>Leave Policy</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>Annual Allocation</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#64748b' }}>
                <li>Casual Leave: 12 days</li>
                <li>Sick Leave: 10 days</li>
                <li>Earned Leave: 15 days</li>
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>Important Notes</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#64748b' }}>
                <li>Apply at least 2 days in advance</li>
                <li>Sick leave requires medical certificate for 3+ days</li>
                <li>Casual leave cannot be carried forward</li>
              </ul>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: '8px', padding: '12px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#1e40af' }}>
                💡 <strong>Tip:</strong> Plan your leaves in advance and check team calendar to avoid conflicts.
              </p>
            </div>
          </div>
        </div>

        {/* Leave History */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>My Leave History</h2>
          
          {leaveRequests.map(request => (
            <div key={request.id} style={{ 
              padding: '16px', 
              borderBottom: '1px solid #f1f5f9', 
              marginBottom: '12px',
              borderLeft: `4px solid ${request.status === 'Approved' ? '#10b981' : request.status === 'Rejected' ? '#ef4444' : '#f59e0b'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '500' }}>{request.type}</h3>
                    <span style={{ 
                      background: request.status === 'Approved' ? '#dcfce7' : request.status === 'Rejected' ? '#fef2f2' : '#fef3c7', 
                      color: request.status === 'Approved' ? '#166534' : request.status === 'Rejected' ? '#dc2626' : '#92400e',
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                    <strong>Dates:</strong> {request.dates}
                  </p>
                  <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p style={{ margin: '4px 0', color: '#64748b', fontSize: '12px' }}>
                    Applied on: {new Date(request.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {leaveRequests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>No leave requests yet. Apply for your first leave above!</p>
            </div>
          )}
        </div>

        {/* Apply Leave Modal */}
        {showApplyForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              width: '400px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Apply for Leave</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Leave Type *</label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({...newRequest, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave ({leaveBalance.casual.total - leaveBalance.casual.used} days left)</option>
                  <option value="Sick Leave">Sick Leave ({leaveBalance.sick.total - leaveBalance.sick.used} days left)</option>
                  <option value="Earned Leave">Earned Leave ({leaveBalance.earned.total - leaveBalance.earned.used} days left)</option>
                  <option value="WFH Request">Work From Home</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Start Date *</label>
                <input
                  type="date"
                  value={newRequest.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
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
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>End Date (optional)</label>
                <input
                  type="date"
                  value={newRequest.endDate}
                  min={newRequest.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewRequest({...newRequest, endDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Reason *</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                  placeholder="Brief reason for leave request..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowApplyForm(false)}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLeave}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
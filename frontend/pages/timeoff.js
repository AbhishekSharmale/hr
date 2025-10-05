import { useState } from 'react';
import Head from 'next/head';

export default function TimeOff() {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'Rahul Sharma', type: 'Casual Leave', dates: 'Dec 15-16', reason: 'Family function', status: 'Pending', casualBalance: 8, sickBalance: 10 },
    { id: 2, employee: 'Amit Kumar', type: 'Sick Leave', dates: 'Dec 18', reason: 'Medical appointment', status: 'Pending', casualBalance: 12, sickBalance: 7 },
    { id: 3, employee: 'Amit Kumar', type: 'WFH Request', dates: 'Dec 20-22', reason: 'Home renovation', status: 'Pending', casualBalance: 12, sickBalance: 7 }
  ]);
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [processingRequest, setProcessingRequest] = useState(null);

  const handleApprove = async (id) => {
    setProcessingRequest(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLeaveRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'Approved' } : req
      ));
      
      const request = leaveRequests.find(req => req.id === id);
      
      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = `✅ ${request.employee}'s ${request.type} approved`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      alert('Failed to approve request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled
    
    setProcessingRequest(id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLeaveRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'Rejected', rejectionReason: reason } : req
      ));
      
      const request = leaveRequests.find(req => req.id === id);
      
      // Show rejection toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = `❌ ${request.employee}'s ${request.type} rejected`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      alert('Failed to reject request. Please try again.');
    } finally {
      setProcessingRequest(null);
    }
  };

  const [leaveErrors, setLeaveErrors] = useState({});
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const validateLeaveRequest = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!newLeaveRequest.type) {
      newErrors.type = 'Please select a leave type';
    }
    
    if (!newLeaveRequest.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (newLeaveRequest.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    
    if (newLeaveRequest.endDate && newLeaveRequest.endDate < newLeaveRequest.startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    if (!newLeaveRequest.reason.trim()) {
      newErrors.reason = 'Please provide a reason for your leave';
    } else if (newLeaveRequest.reason.trim().length < 10) {
      newErrors.reason = 'Please provide a more detailed reason (at least 10 characters)';
    }
    
    // Check leave balance
    if (newLeaveRequest.type === 'Casual Leave') {
      const casualUsed = 12 - 11; // 1 day used
      if (casualUsed >= 12) {
        newErrors.type = 'You have no casual leave balance remaining';
      }
    }
    
    setLeaveErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyLeave = async () => {
    if (!validateLeaveRequest()) return;
    
    setIsSubmittingLeave(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRequest = {
        id: leaveRequests.length + 1,
        employee: 'Priya Patel (You)',
        ...newLeaveRequest,
        dates: newLeaveRequest.endDate ? `${newLeaveRequest.startDate} - ${newLeaveRequest.endDate}` : newLeaveRequest.startDate,
        status: 'Pending',
        casualBalance: 11,
        sickBalance: 9
      };
      
      setLeaveRequests([...leaveRequests, newRequest]);
      setNewLeaveRequest({ type: '', startDate: '', endDate: '', reason: '' });
      setLeaveErrors({});
      setShowApplyLeave(false);
      
      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = '✓ Leave request submitted successfully!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      setLeaveErrors({ submit: 'Failed to submit leave request. Please try again.' });
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  return (
    <>
      <Head>
        <title>Time Off - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Time Off Management</h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Leave Requests ({leaveRequests.filter(req => req.status === 'Pending').length} pending)</h2>
            <button 
              onClick={() => setShowApplyLeave(true)}
              style={{ 
                padding: '10px 20px', 
                background: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              + Apply for Leave
            </button>
          </div>
          
          {leaveRequests.map(request => (
            <div key={request.id} style={{ 
              padding: '20px', 
              borderBottom: '1px solid #e2e8f0', 
              marginBottom: '15px',
              background: request.status === 'Approved' ? '#f0fdf4' : request.status === 'Rejected' ? '#fef2f2' : 'white',
              borderLeft: request.status === 'Approved' ? '4px solid #10b981' : request.status === 'Rejected' ? '4px solid #ef4444' : '4px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>{request.employee}</h3>
                    <span style={{ 
                      background: request.status === 'Approved' ? '#10b981' : request.status === 'Rejected' ? '#ef4444' : '#f59e0b', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {request.status}
                    </span>
                  </div>
                  <p style={{ margin: '5px 0', color: '#64748b' }}><strong>{request.type}</strong> • {request.dates}</p>
                  <p style={{ margin: '5px 0', color: '#64748b' }}>Reason: {request.reason}</p>
                  {(request.casualBalance !== undefined) && (
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#64748b' }}>
                      Leave Balance: Casual {request.casualBalance}/12 • Sick {request.sickBalance}/10
                    </p>
                  )}
                  {request.rejectionReason && (
                    <p style={{ margin: '5px 0', fontSize: '12px', color: '#ef4444' }}>Rejection reason: {request.rejectionReason}</p>
                  )}
                </div>
                {request.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleApprove(request.id)}
                      disabled={processingRequest === request.id}
                      style={{ 
                        padding: '8px 16px', 
                        background: processingRequest === request.id ? '#9ca3af' : '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: processingRequest === request.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        minWidth: '80px',
                        justifyContent: 'center'
                      }}
                    >
                      {processingRequest === request.id ? (
                        <>
                          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                          ...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </button>
                    <button 
                      onClick={() => handleReject(request.id)}
                      disabled={processingRequest === request.id}
                      style={{ 
                        padding: '8px 16px', 
                        background: processingRequest === request.id ? '#9ca3af' : '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: processingRequest === request.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        minWidth: '70px'
                      }}
                    >
                      {processingRequest === request.id ? '...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Apply Leave Modal */}
        {showApplyLeave && (
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
                  value={newLeaveRequest.type}
                  onChange={(e) => {
                    setNewLeaveRequest({...newLeaveRequest, type: e.target.value});
                    if (leaveErrors.type) setLeaveErrors({...leaveErrors, type: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${leaveErrors.type ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave (11/12 remaining)</option>
                  <option value="Sick Leave">Sick Leave (9/10 remaining)</option>
                  <option value="Earned Leave">Earned Leave (15/15 remaining)</option>
                  <option value="WFH Request">Work From Home</option>
                </select>
                {leaveErrors.type && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{leaveErrors.type}</p>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Start Date *</label>
                <input
                  type="date"
                  value={newLeaveRequest.startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setNewLeaveRequest({...newLeaveRequest, startDate: e.target.value});
                    if (leaveErrors.startDate) setLeaveErrors({...leaveErrors, startDate: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${leaveErrors.startDate ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {leaveErrors.startDate && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{leaveErrors.startDate}</p>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>End Date (optional)</label>
                <input
                  type="date"
                  value={newLeaveRequest.endDate}
                  min={newLeaveRequest.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setNewLeaveRequest({...newLeaveRequest, endDate: e.target.value});
                    if (leaveErrors.endDate) setLeaveErrors({...leaveErrors, endDate: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${leaveErrors.endDate ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {leaveErrors.endDate && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{leaveErrors.endDate}</p>}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Reason *</label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) => {
                    setNewLeaveRequest({...newLeaveRequest, reason: e.target.value});
                    if (leaveErrors.reason) setLeaveErrors({...leaveErrors, reason: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${leaveErrors.reason ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                  placeholder="Brief reason for leave request..."
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  {leaveErrors.reason && <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{leaveErrors.reason}</p>}
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0, marginLeft: 'auto' }}>{newLeaveRequest.reason.length}/200</p>
                </div>
              </div>

              {leaveErrors.submit && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 15px 0', textAlign: 'center' }}>{leaveErrors.submit}</p>}
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowApplyLeave(false)}
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
                  onClick={handleApplyLeave}
                  disabled={isSubmittingLeave}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: isSubmittingLeave ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: isSubmittingLeave ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmittingLeave && <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>}
                  {isSubmittingLeave ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => window.history.back()}
          style={{ 
            marginTop: '20px',
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
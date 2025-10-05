import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function HROnboarding() {
  const [onboardingEmployees, setOnboardingEmployees] = useState([]);
  const [readyToInitiate, setReadyToInitiate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    try {
      const [employeesRes] = await Promise.all([
        fetch('http://localhost:5001/api/employees')
      ]);
      
      const employeesData = await employeesRes.json();
      const employees = employeesData.data;
      
      // Filter employees by onboarding status
      const readyEmployees = employees.filter(emp => emp.onboarding_status === 'it_done');
      const activeEmployees = employees.filter(emp => 
        emp.onboarding_status === 'onboarding_initiated' || 
        emp.onboarding_status === 'employee_in_progress'
      );
      
      setReadyToInitiate(readyEmployees);
      setOnboardingEmployees(activeEmployees.map(emp => ({
        ...emp,
        progress: Math.floor(Math.random() * 80) + 20,
        completedTasks: Math.floor(Math.random() * 5) + 2,
        totalTasks: 7,
        pendingReviews: Math.floor(Math.random() * 2),
        overdueTasks: Math.floor(Math.random() * 2)
      })));
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateOnboarding = async (employeeId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/onboarding/initiate/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: 1, role: 'HR' })
      });
      
      if (res.ok) {
        const data = await res.json();
        setToast(`Onboarding initiated for ${data.employee.name}!`);
        fetchOnboardingData(); // Refresh data
        setTimeout(() => setToast(''), 3000);
      }
    } catch (error) {
      console.error('Error initiating onboarding:', error);
    }
  };

  const mockOnboardingEmployees = [
    {
      id: 1,
      name: 'Amit Kumar',
      role: 'Marketing Lead',
      department: 'Marketing',
      startDate: 'Dec 1',
      progress: 43,
      completedTasks: 3,
      totalTasks: 7,
      status: 'In Progress',
      pendingReviews: 1,
      overdueTasks: 0
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      role: 'UI Designer',
      department: 'Design',
      startDate: 'Dec 8',
      progress: 14,
      completedTasks: 1,
      totalTasks: 7,
      status: 'In Progress',
      pendingReviews: 0,
      overdueTasks: 3
    },
    {
      id: 3,
      name: 'Rahul Sharma',
      role: 'Senior Developer',
      department: 'Engineering',
      startDate: 'Nov 28',
      progress: 100,
      completedTasks: 7,
      totalTasks: 7,
      status: 'Complete',
      pendingReviews: 0,
      overdueTasks: 0
    }
  ]);

  const activeEmployees = onboardingEmployees.filter(emp => emp.status !== 'Complete');
  const completedEmployees = onboardingEmployees.filter(emp => emp.status === 'Complete');

  const [pendingDocuments, setPendingDocuments] = useState([
    {
      id: 1,
      employeeName: 'Amit Kumar',
      documentType: 'Offer Letter',
      uploadedDate: '2 hours ago',
      fileName: 'offer-letter-signed.pdf'
    },
    {
      id: 2,
      employeeName: 'Sarah Wilson',
      documentType: 'PAN Card',
      uploadedDate: 'Dec 10',
      fileName: 'pan-card-sarah.jpg'
    }
  ]);
  
  const [processingDoc, setProcessingDoc] = useState(null);

  const handleApproveDocument = async (docId) => {
    setProcessingDoc(docId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doc = pendingDocuments.find(d => d.id === docId);
      
      // Remove from pending documents
      setPendingDocuments(prev => prev.filter(d => d.id !== docId));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = `✓ ${doc.employeeName}'s ${doc.documentType} approved!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      alert('Failed to approve document. Please try again.');
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleRejectDocument = async (docId) => {
    const reason = prompt('Reason for rejection (required):');
    if (!reason || reason.trim() === '') {
      alert('Please provide a reason for rejection.');
      return;
    }
    
    setProcessingDoc(docId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const doc = pendingDocuments.find(d => d.id === docId);
      
      // Remove from pending documents
      setPendingDocuments(prev => prev.filter(d => d.id !== docId));
      
      // Show rejection toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#ef4444;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = `✗ ${doc.employeeName}'s ${doc.documentType} rejected`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      alert('Failed to reject document. Please try again.');
    } finally {
      setProcessingDoc(null);
    }
  };

  const handleSendReminder = (employeeId) => {
    alert('Reminder email sent to employee about overdue tasks.');
  };

  return (
    <>
      <Head>
        <title>HR Onboarding Management - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '600' }}>Onboarding Management</h1>
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

        {/* Ready to Initiate Section */}
        {readyToInitiate.length > 0 && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
              Ready to Initiate Onboarding ({readyToInitiate.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {readyToInitiate.map(employee => (
                <div key={employee.id} style={{
                  padding: '20px', border: '2px solid #fbbf24', borderRadius: '12px',
                  background: '#fefbf3', transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px', fontWeight: '500' }}>
                        {employee.name}
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>
                        {employee.designation} • {employee.department}
                      </p>
                      <p style={{ margin: 0, color: '#92400e', fontSize: '13px', fontWeight: '500' }}>
                        ✅ IT Setup Complete • Email: {employee.company_email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInitiateOnboarding(employee.id)}
                    style={{
                      width: '100%', padding: '12px', background: '#f59e0b',
                      color: 'white', border: 'none', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '14px', fontWeight: '500'
                    }}
                  >
                    🚀 Initiate Onboarding
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Active Onboardings</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{onboardingEmployees.length}</p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Pending Reviews</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>{pendingDocuments.length}</p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Overdue Tasks</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', margin: 0 }}>
              {activeEmployees.reduce((sum, emp) => sum + emp.overdueTasks, 0)}
            </p>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Completed This Month</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: 0 }}>0</p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Rahul completed Nov 30</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          
          {/* Active Onboardings */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
              Active Onboardings ({onboardingEmployees.filter(emp => emp.status !== 'Complete').length})
            </h2>
            
            {onboardingEmployees.map(employee => (
              <div key={employee.id} style={{ 
                padding: '20px', 
                borderBottom: '1px solid #f1f5f9', 
                marginBottom: '16px',
                borderLeft: `4px solid ${employee.status === 'Complete' ? '#10b981' : employee.overdueTasks > 0 ? '#ef4444' : '#f59e0b'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px', fontWeight: '500' }}>
                      {employee.name}
                    </h3>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>
                      {employee.role} • {employee.department} • Started {employee.startDate}
                    </p>
                    
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Progress</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                          {employee.completedTasks}/{employee.totalTasks} complete
                        </span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ 
                          background: employee.progress === 100 ? '#10b981' : '#f59e0b', 
                          height: '100%', 
                          width: `${employee.progress}%`,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    {/* Status Indicators */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {employee.pendingReviews > 0 && (
                        <span style={{ 
                          background: '#fef3c7', 
                          color: '#92400e', 
                          padding: '2px 6px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {employee.pendingReviews} pending review
                        </span>
                      )}
                      {employee.overdueTasks > 0 && (
                        <span style={{ 
                          background: '#fef2f2', 
                          color: '#dc2626', 
                          padding: '2px 6px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {employee.overdueTasks} overdue
                        </span>
                      )}
                      {employee.status === 'Complete' && (
                        <span style={{ 
                          background: '#dcfce7', 
                          color: '#166534', 
                          padding: '2px 6px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          ✓ Complete
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <button 
                      onClick={() => alert(`View ${employee.name}'s detailed onboarding checklist`)}
                      style={{ 
                        padding: '6px 12px', 
                        background: '#2563eb', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      View Checklist
                    </button>
                    
                    {employee.pendingReviews > 0 && (
                      <button 
                        onClick={() => alert(`Review ${employee.name}'s uploaded documents`)}
                        style={{ 
                          padding: '6px 12px', 
                          background: '#f59e0b', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Review Docs
                      </button>
                    )}
                    
                    {employee.overdueTasks > 0 && (
                      <button 
                        onClick={() => handleSendReminder(employee.id)}
                        style={{ 
                          padding: '6px 12px', 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Document Review Queue */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
              Document Review Queue ({pendingDocuments.length})
            </h2>
            
            {pendingDocuments.map(doc => (
              <div key={doc.id} style={{ 
                padding: '16px', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px', 
                marginBottom: '16px',
                background: '#fefbf3'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>
                    {doc.employeeName}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' }}>
                    {doc.documentType} • Uploaded {doc.uploadedDate}
                  </p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                    📎 {doc.fileName}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => alert(`Viewing ${doc.fileName} - Document viewer would open here`)}
                    style={{ 
                      padding: '6px 12px', 
                      background: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    View Doc
                  </button>
                  <button 
                    onClick={() => handleApproveDocument(doc.id)}
                    style={{ 
                      padding: '6px 12px', 
                      background: '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleRejectDocument(doc.id)}
                    style={{ 
                      padding: '6px 12px', 
                      background: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            
            {pendingDocuments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>✅ No documents pending review</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
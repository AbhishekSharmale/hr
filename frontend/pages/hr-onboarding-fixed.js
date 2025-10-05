import { useState } from 'react';
import Head from 'next/head';

export default function HROnboarding() {
  const [onboardingEmployees] = useState([
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

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Active Onboardings</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{activeEmployees.length}</p>
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
            <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Completed (Dec 2024)</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', margin: 0 }}>0</p>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Rahul completed Nov 30</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          
          {/* Active Onboardings */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
              Active Onboardings ({activeEmployees.length})
            </h2>
            
            {activeEmployees.map(employee => (
              <div key={employee.id} style={{ 
                padding: '20px', 
                borderBottom: '1px solid #f1f5f9', 
                marginBottom: '16px',
                borderLeft: `4px solid ${employee.overdueTasks > 0 ? '#ef4444' : '#f59e0b'}`
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
                          {employee.completedTasks}/{employee.totalTasks} complete ({employee.progress}%)
                        </span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ 
                          background: '#f59e0b', 
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
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <button 
                      onClick={() => window.location.href = `/hr-employee-checklist?employee=${employee.name}`}
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
                        onClick={() => alert(`Review ${employee.name}'s uploaded documents`))}
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
                        Review Docs ({employee.pendingReviews})
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
            
            {/* Recently Completed Section */}
            {completedEmployees.length > 0 && (
              <>
                <h3 style={{ margin: '30px 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  Recently Completed ({completedEmployees.length})
                </h3>
                
                {completedEmployees.map(employee => (
                  <div key={employee.id} style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid #f1f5f9', 
                    marginBottom: '12px',
                    borderLeft: '4px solid #10b981',
                    background: '#f8fafc',
                    opacity: 0.8
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '14px', fontWeight: '500' }}>
                          {employee.name} ✓
                        </h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                          {employee.role} • Completed Nov 30 • 100% done
                        </p>
                      </div>
                      <button 
                        onClick={() => alert(`View ${employee.name}'s completed onboarding details`)}
                        style={{ 
                          padding: '6px 12px', 
                          background: '#10b981', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
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
                    Task 4: {doc.documentType} • Uploaded {doc.uploadedDate}
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
                    disabled={processingDoc === doc.id}
                    style={{ 
                      padding: '6px 12px', 
                      background: processingDoc === doc.id ? '#9ca3af' : '#10b981', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: processingDoc === doc.id ? 'not-allowed' : 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minWidth: '60px',
                      justifyContent: 'center'
                    }}
                  >
                    {processingDoc === doc.id ? (
                      <>
                        <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                        ...
                      </>
                    ) : (
                      'Approve'
                    )}
                  </button>
                  <button 
                    onClick={() => handleRejectDocument(doc.id)}
                    disabled={processingDoc === doc.id}
                    style={{ 
                      padding: '6px 12px', 
                      background: processingDoc === doc.id ? '#9ca3af' : '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: processingDoc === doc.id ? 'not-allowed' : 'pointer',
                      fontSize: '11px',
                      fontWeight: '500',
                      minWidth: '50px'
                    }}
                  >
                    {processingDoc === doc.id ? '...' : 'Reject'}
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
    </>
  );
}
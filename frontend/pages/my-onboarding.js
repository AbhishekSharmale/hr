import { useState } from 'react';
import Head from 'next/head';

export default function MyOnboarding() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Upload Aadhar Card', type: 'document', completed: true, required: true, dueDate: 'Dec 10', completedDate: 'Dec 8', reviewStatus: 'approved' },
    { id: 2, title: 'Upload PAN Card', type: 'document', completed: true, required: true, dueDate: 'Dec 10', completedDate: 'Dec 9', reviewStatus: 'pending' },
    { id: 3, title: 'Fill Emergency Contact Form', type: 'form', completed: true, required: true, dueDate: 'Dec 12', completedDate: 'Dec 10', reviewStatus: 'approved' },
    { id: 4, title: 'Sign Offer Letter', type: 'document', completed: false, required: true, dueDate: 'Dec 15', daysRemaining: 2 },
    { id: 5, title: 'Read Employee Handbook', type: 'acknowledgment', completed: false, required: true, dueDate: 'Dec 18', daysRemaining: 5 },
    { id: 6, title: 'IT Setup - Laptop & Email', type: 'external', completed: false, required: true, dueDate: 'Dec 16', daysRemaining: 3 },
    { id: 7, title: 'Schedule Meeting with Manager', type: 'meeting', completed: false, required: false, dueDate: 'Dec 20', daysRemaining: 7 }
  ]);

  const [uploadingTask, setUploadingTask] = useState(null);
  const [showForm, setShowForm] = useState(null);

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  const handleFileUpload = async (taskId, file) => {
    setUploadingTask(taskId);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: true, uploadedFile: file.name } : task
      ));
      
      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = '✓ Document uploaded successfully!';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingTask(null);
    }
  };

  const handleAcknowledgment = (taskId) => {
    const confirmed = confirm('I confirm that I have read and understood the Employee Handbook in its entirety.');
    if (!confirmed) return;
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true, completedDate: 'Today' } : task
    ));
    
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
    toast.textContent = '✓ Handbook acknowledgment completed!';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
  };

  const renderTaskAction = (task) => {
    if (task.completed) {
      let statusText, statusColor;
      if (task.reviewStatus === 'approved') {
        statusText = `✓ Approved ${task.completedDate}`;
        statusColor = '#10b981';
      } else if (task.reviewStatus === 'pending') {
        statusText = `⏳ Pending HR Review`;
        statusColor = '#f59e0b';
      } else if (task.reviewStatus === 'rejected') {
        statusText = `❌ Rejected - Reupload Required`;
        statusColor = '#ef4444';
      } else {
        statusText = `✓ Completed ${task.completedDate}`;
        statusColor = '#10b981';
      }
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '12px', color: statusColor, fontWeight: '500' }}>{statusText}</span>
          <button
            onClick={() => alert(`View/Edit ${task.title} - Coming soon!`)}
            style={{
              fontSize: '11px',
              color: '#64748b',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '2px'
            }}
          >
            View/Edit
          </button>
        </div>
      );
    }

    switch (task.type) {
      case 'document':
        return (
          <div>
            <input
              type="file"
              id={`file-${task.id}`}
              style={{ display: 'none' }}
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileUpload(task.id, e.target.files[0]);
                }
              }}
            />
            <button
              onClick={() => document.getElementById(`file-${task.id}`).click()}
              disabled={uploadingTask === task.id}
              style={{
                padding: '8px 16px',
                background: uploadingTask === task.id ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: uploadingTask === task.id ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {uploadingTask === task.id ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⟳</span>
                  Uploading...
                </>
              ) : (
                '📎 Upload File'
              )}
            </button>
          </div>
        );

      case 'acknowledgment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={() => window.open('/employee-handbook.pdf', '_blank')}
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
              📖 View Handbook
            </button>
            <button
              onClick={() => handleAcknowledgment(task.id)}
              style={{
                padding: '8px 16px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              ✓ Confirm I've Read It
            </button>
          </div>
        );

      case 'external':
        return (
          <button
            onClick={() => {
              const email = 'mailto:it@techstart.com?subject=Laptop Setup Request - Amit Kumar&body=Hi IT Team,%0A%0AI need to set up my laptop and email access for my onboarding. Please let me know when I can come by or if you need any information from me.%0A%0AThanks,%0AAmit Kumar';
              window.location.href = email;
            }}
            style={{
              padding: '8px 16px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            📧 Email IT (it@techstart.com)
          </button>
        );

      case 'meeting':
        return (
          <button
            onClick={() => {
              const email = 'mailto:priya@techstart.com?subject=Onboarding Meeting Request - Amit Kumar&body=Hi Priya,%0A%0AI would like to schedule my onboarding meeting with you. Please let me know your availability for next week.%0A%0AThank you,%0AAmit Kumar';
              window.location.href = email;
            }}
            style={{
              padding: '8px 16px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            📧 Request Meeting
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>My Onboarding - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ color: '#1e293b', margin: 0, fontSize: '24px', fontWeight: '600' }}>
              Your Onboarding Checklist
            </h1>
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
          
          {/* Progress Bar */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#64748b' }}>Progress</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{completedTasks}/{tasks.length} complete</span>
            </div>
            <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
              <div style={{ 
                background: progress === 100 ? '#10b981' : '#f59e0b', 
                height: '100%', 
                width: `${progress}%`,
                transition: 'all 0.3s ease'
              }} />
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#64748b' }}>
              {progress}% complete {progress === 100 && '🎉'}
            </p>
          </div>

          {progress === 100 && (
            <div style={{ 
              background: '#dcfce7', 
              border: '1px solid #22c55e', 
              borderRadius: '8px', 
              padding: '12px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '16px', color: '#16a34a', fontWeight: '600' }}>
                🎉 Congratulations! Your onboarding is complete!
              </span>
            </div>
          )}
        </div>

        {/* Task List */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {tasks.map((task, index) => (
            <div 
              key={task.id} 
              style={{ 
                padding: '20px', 
                borderBottom: index < tasks.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: task.completed ? '#f8fafc' : 'white',
                opacity: task.completed ? 0.8 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: task.completed ? '#10b981' : '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: task.completed ? 'white' : '#64748b',
                      fontWeight: '600'
                    }}>
                      {task.completed ? '✓' : index + 1}
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: task.completed ? '#64748b' : '#1e293b',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        {task.title}
                        {task.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                      </h3>
                      {!task.completed && task.dueDate && (
                        <p style={{ 
                          margin: '4px 0 0 0', 
                          fontSize: '12px', 
                          color: task.daysRemaining <= 1 ? '#ef4444' : task.daysRemaining <= 3 ? '#f59e0b' : '#64748b',
                          fontWeight: task.daysRemaining <= 1 ? '600' : '500',
                          background: task.daysRemaining <= 1 ? '#fef2f2' : task.daysRemaining <= 3 ? '#fef3c7' : 'transparent',
                          padding: task.daysRemaining <= 3 ? '2px 6px' : '0',
                          borderRadius: task.daysRemaining <= 3 ? '4px' : '0',
                          display: 'inline-block'
                        }}>
                          {task.daysRemaining <= 1 ? '🔴' : task.daysRemaining <= 3 ? '⚠️' : ''} Due: {task.dueDate} {task.daysRemaining <= 1 ? `(${task.daysRemaining === 0 ? 'DUE TODAY!' : '1 DAY LEFT!'})` : task.daysRemaining <= 3 ? `(${task.daysRemaining} days left)` : `(${task.daysRemaining} days remaining)`}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {task.uploadedFile && (
                    <p style={{ margin: '0 0 0 36px', fontSize: '12px', color: '#10b981' }}>
                      📎 {task.uploadedFile}
                    </p>
                  )}
                  
                  <div style={{ margin: '0 0 0 36px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      color: '#64748b',
                      background: '#f1f5f9',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {task.type.toUpperCase()}
                    </span>
                    {task.required && (
                      <span style={{ 
                        fontSize: '11px', 
                        color: '#ef4444',
                        background: '#fef2f2',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        marginLeft: '6px'
                      }}>
                        REQUIRED
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ marginLeft: '20px' }}>
                  {renderTaskAction(task)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div style={{ background: '#eff6ff', border: '1px solid #3b82f6', borderRadius: '12px', padding: '20px', marginTop: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '16px', fontWeight: '600' }}>
            Need Help?
          </h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#1e40af' }}>
            If you're having trouble with any task, don't hesitate to reach out:
          </p>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => alert('Contact HR: hr@techstart.com')}
              style={{ 
                padding: '8px 16px', 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              📧 Contact HR
            </button>
            <button 
              onClick={() => alert('IT Support: it@techstart.com')}
              style={{ 
                padding: '8px 16px', 
                background: 'white', 
                color: '#3b82f6', 
                border: '1px solid #3b82f6', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              💻 IT Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
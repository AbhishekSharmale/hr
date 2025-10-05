import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useCompany } from '../context/CompanyContext';

export default function EmployeeOnboarding() {
  const { company } = useCompany();
  const [employee] = useState({
    id: 3,
    name: 'Amit Kumar',
    designation: 'Marketing Lead',
    department: 'Marketing',
    company_email: 'amit@techstart.com',
    buddy: { name: 'Priya Patel', role: 'HR Manager' }
  });

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Personal Information Form', description: 'Fill out your personal details, emergency contacts, and banking information', completed: true, category: 'Documentation' },
    { id: 2, title: 'Upload Profile Photo', description: 'Upload a professional headshot for your employee profile', completed: true, category: 'Profile' },
    { id: 3, title: 'Review Company Handbook', description: 'Read through our company policies, values, and guidelines', completed: true, category: 'Orientation' },
    { id: 4, title: 'Set Up Direct Deposit', description: 'Provide your bank account details for salary payments', completed: false, category: 'Finance', dueDate: 'Today' },
    { id: 5, title: 'Complete IT Security Training', description: 'Watch security videos and complete the quiz (30 minutes)', completed: false, category: 'Training', dueDate: 'Dec 15' },
    { id: 6, title: 'Schedule 1:1 with Manager', description: 'Book your first meeting with your direct manager', completed: false, category: 'Meetings', dueDate: 'Dec 16' },
    { id: 7, title: 'Join Team Slack Channels', description: 'Get added to relevant team communication channels', completed: false, category: 'Communication', dueDate: 'Dec 17' }
  ]);

  const [toast, setToast] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(null);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const handleCompleteTask = async (taskId) => {
    // Optimistic update
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));

    setToast('Task marked as complete!');
    setTimeout(() => setToast(''), 3000);

    // Check if all tasks are completed
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    if (updatedTasks.every(task => task.completed)) {
      setTimeout(() => {
        setToast('🎉 Onboarding completed! Welcome to the team!');
        // In real app: call API to mark onboarding as complete
        // fetch('/api/onboarding/complete/3', { method: 'POST' })
      }, 1000);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Documentation': return '📋';
      case 'Profile': return '👤';
      case 'Orientation': return '📖';
      case 'Finance': return '💰';
      case 'Training': return '🎓';
      case 'Meetings': return '📅';
      case 'Communication': return '💬';
      default: return '✅';
    }
  };

  const getPriorityColor = (dueDate) => {
    if (dueDate === 'Today') return '#ef4444';
    if (dueDate === 'Dec 15') return '#f59e0b';
    return '#64748b';
  };

  return (
    <>
      <Head>
        <title>My Onboarding - {company.name}</title>
      </Head>
      
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '8px',
                background: company.logoUrl ? `url(${company.logoUrl})` : company.primaryColor,
                backgroundSize: 'cover', backgroundPosition: 'center',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '600'
              }}>
                {!company.logoUrl && company.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 style={{ color: '#1e293b', margin: 0, fontSize: '20px', fontWeight: '600' }}>Welcome to {company.name}!</h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Complete your onboarding checklist</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b' }}>Hello, {employee.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{employee.designation}</p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px 20px' }}>
          {/* Progress Overview */}
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ color: '#1e293b', margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Your Onboarding Progress</h2>
                <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>{completedTasks} of {totalTasks} tasks completed</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: progress === 100 ? '#10b981' : '#f59e0b', marginBottom: '4px' }}>
                  {progress}%
                </div>
                {progress === 100 && <div style={{ fontSize: '24px' }}>🎉</div>}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ background: '#f1f5f9', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{
                background: progress === 100 ? '#10b981' : '#f59e0b',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.5s ease',
                borderRadius: '8px'
              }} />
            </div>

            {/* Buddy Info */}
            {employee.buddy && (
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b' }}>Your Onboarding Buddy</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
                  👋 {employee.buddy.name} - {employee.buddy.role}
                </p>
              </div>
            )}
          </div>

          {/* Task Categories */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#1e293b', margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Onboarding Checklist</h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {tasks.map(task => (
                <div key={task.id} style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: task.completed ? '2px solid #10b981' : task.dueDate === 'Today' ? '2px solid #ef4444' : '2px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  opacity: task.completed ? 0.8 : 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{getCategoryIcon(task.category)}</span>
                        <div>
                          <h4 style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '500',
                            color: task.completed ? '#10b981' : '#1e293b',
                            textDecoration: task.completed ? 'line-through' : 'none'
                          }}>
                            {task.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <span style={{
                              background: task.completed ? '#dcfce7' : '#f1f5f9',
                              color: task.completed ? '#166534' : '#64748b',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {task.category}
                            </span>
                            {task.dueDate && !task.completed && (
                              <span style={{
                                color: getPriorityColor(task.dueDate),
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                Due: {task.dueDate}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p style={{ margin: '8px 0 0 32px', color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
                        {task.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {task.completed ? (
                        <div style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ✓ Complete
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setShowTaskModal(task)}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '500'
                            }}
                          >
                            Mark Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1e293b', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Need Help?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <button
                onClick={() => alert('Opening chat with your buddy...')}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Chat with Buddy</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Get help from {employee.buddy?.name}</div>
              </button>
              
              <button
                onClick={() => alert('Opening HR support...')}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🆘</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Contact HR</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Get support from HR team</div>
              </button>
              
              <button
                onClick={() => alert('Opening knowledge base...')}
                style={{
                  padding: '16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>📚</div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Knowledge Base</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Browse help articles</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '12px',
            width: '500px', maxWidth: '90vw', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '24px' }}>{getCategoryIcon(showTaskModal.category)}</span>
              <h2 style={{ margin: 0, color: '#1e293b' }}>{showTaskModal.title}</h2>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
              {showTaskModal.description}
            </p>

            {showTaskModal.dueDate && (
              <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                  📅 Due: {showTaskModal.dueDate}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTaskModal(null)}
                style={{
                  padding: '10px 20px', border: '1px solid #d1d5db',
                  backgroundColor: 'white', color: '#374151',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCompleteTask(showTaskModal.id);
                  setShowTaskModal(null);
                }}
                style={{
                  padding: '10px 20px', border: 'none',
                  backgroundColor: '#2563eb', color: 'white',
                  borderRadius: '6px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '500'
                }}
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: toast.includes('🎉') ? '#10b981' : '#2563eb',
          color: 'white', padding: '12px 20px',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1001, fontSize: '14px', fontWeight: '500'
        }}>
          {toast}
        </div>
      )}
    </>
  );
}
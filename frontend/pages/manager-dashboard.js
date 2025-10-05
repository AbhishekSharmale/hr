import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function ManagerDashboard() {
  const [directReports, setDirectReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reviewData, setReviewData] = useState({ status: 'approved', notes: '', goals: [] });

  const managerId = 1; // Mock manager ID

  useEffect(() => {
    fetchDirectReports();
  }, []);

  const fetchDirectReports = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/manager/direct-reports/${managerId}`);
      const result = await response.json();
      if (result.success) {
        setDirectReports(result.data);
      } else {
        console.error('API returned error:', result.error);
        setDirectReports([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Failed to fetch direct reports:', error);
      setDirectReports([]); // Set empty array on network error
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (employee) => {
    setSelectedEmployee(employee);
    setShowReviewModal(true);
    setReviewData({ status: 'approved', notes: '', goals: [{ title: '', description: '', target_date: '' }] });
  };

  const submitReview = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/onboarding/review/${selectedEmployee.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewData, managerId })
      });
      
      const result = await response.json();
      if (result.success) {
        setShowReviewModal(false);
        fetchDirectReports();
        alert(`Review ${reviewData.status} successfully!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const addGoal = () => {
    setReviewData(prev => ({
      ...prev,
      goals: [...prev.goals, { title: '', description: '', target_date: '' }]
    }));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: darkMode ? '#0f172a' : '#f8fafc'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Manager Dashboard - HR SaaS Platform</title>
      </Head>
      
      <div style={{ 
        padding: '20px', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        background: darkMode ? '#0f172a' : '#f8fafc', 
        minHeight: '100vh',
        color: darkMode ? '#f1f5f9' : '#1e293b'
      }}>
        
        <header style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: darkMode ? '#f1f5f9' : '#1e293b', margin: '0 0 5px 0', fontSize: '24px', fontWeight: '600' }}>
              Manager Dashboard 👨💼
            </h1>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '14px' }}>
              Manage your direct reports and their onboarding progress
            </p>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: darkMode ? '#374151' : '#f3f4f6',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* Direct Reports */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>
            Direct Reports & Onboarding Status
          </h2>
          
          {directReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: darkMode ? '#94a3b8' : '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>No Direct Reports Yet</div>
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                You currently have 0 direct reports. Once assigned, you'll see their onboarding progress,<br/>
                leave summary, and performance metrics here.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {directReports.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{
                    padding: '20px',
                    background: darkMode ? '#374151' : '#f8fafc',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {employee.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                        {employee.name}
                      </div>
                      <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
                        {employee.designation} • {employee.department}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          background: employee.status === 'Active' ? '#10b981' : 
                                     employee.onboarding_status === 'completed' ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {employee.status}
                        </span>
                        {employee.goalsCount > 0 && (
                          <span style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Goals: {employee.completedGoals}/{employee.goalsCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {employee.pendingReview && (
                      <button
                        onClick={() => handleReview(employee)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Review Onboarding
                      </button>
                    )}
                    
                    <button
                      onClick={() => alert('View Profile - Coming soon!')}
                      style={{
                        background: 'transparent',
                        color: '#3b82f6',
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Team Analytics & Actions */}
        {directReports.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          {/* Team Progress Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Team Progress Overview</h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {directReports.map(employee => {
                const progressPercent = employee.status === 'Active' ? 100 : 
                                       employee.onboarding_status === 'completed' ? 85 : 
                                       employee.onboarding_status === 'onboarding_initiated' ? 60 : 30;
                return (
                  <div key={employee.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ minWidth: '80px', fontSize: '14px', fontWeight: '500' }}>
                      {employee.name.split(' ')[0]}
                    </div>
                    <div style={{ flex: 1, background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ 
                          background: progressPercent === 100 ? '#10b981' : progressPercent >= 60 ? '#f59e0b' : '#ef4444', 
                          height: '100%'
                        }} 
                      />
                    </div>
                    <div style={{ minWidth: '40px', fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {progressPercent}%
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
          
          {/* Pending Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Pending Actions</h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{
                padding: '12px',
                background: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>Onboarding Reviews</div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Employees awaiting approval</div>
                </div>
                <div style={{
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {directReports.filter(e => e.pendingReview).length}
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                background: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>Leave Requests</div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Pending your approval</div>
                </div>
                <div style={{
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  2
                </div>
              </div>
              
              <div style={{
                padding: '12px',
                background: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>Check-ins Due</div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Weekly team check-ins</div>
                </div>
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {directReports.length}
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
        )}
        
        {/* Quick Manager Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Quick Actions</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button 
              onClick={() => alert('Schedule Team Check-in - Coming soon!')}
              style={{ 
                padding: '16px', 
                background: darkMode ? '#374151' : '#f8fafc', 
                border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`, 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📅</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Schedule Check-ins</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Weekly team meetings</div>
            </button>
            
            <button 
              onClick={() => alert('Send Welcome Message - Coming soon!')}
              style={{ 
                padding: '16px', 
                background: darkMode ? '#374151' : '#f8fafc', 
                border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`, 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💬</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Send Welcome Message</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>To new team members</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/reports/analytics'}
              style={{ 
                padding: '16px', 
                background: darkMode ? '#374151' : '#f8fafc', 
                border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`, 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Team Analytics</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>View detailed reports</div>
            </button>
            
            <button 
              onClick={() => alert('Approve Leave Requests - Coming soon!')}
              style={{ 
                padding: '16px', 
                background: darkMode ? '#374151' : '#f8fafc', 
                border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`, 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>✅</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Approve Requests</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Leave & expense approvals</div>
            </button>
          </div>
        </motion.div>

        {/* Review Modal */}
        {showReviewModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}
            >
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
                Review Onboarding: {selectedEmployee?.name}
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Review Decision
                </label>
                <select
                  value={reviewData.status}
                  onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: darkMode ? '#374151' : 'white',
                    color: darkMode ? '#f1f5f9' : '#1e293b'
                  }}
                >
                  <option value="approved">✅ Approve & Set Goals</option>
                  <option value="rework">❌ Request Rework</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Notes
                </label>
                <textarea
                  value={reviewData.notes}
                  onChange={(e) => setReviewData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any feedback or comments..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: darkMode ? '#374151' : 'white',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              {reviewData.status === 'approved' && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontWeight: '500' }}>Initial Goals (up to 3)</label>
                    <button
                      onClick={addGoal}
                      disabled={reviewData.goals.length >= 3}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: reviewData.goals.length >= 3 ? 'not-allowed' : 'pointer',
                        opacity: reviewData.goals.length >= 3 ? 0.5 : 1
                      }}
                    >
                      + Add Goal
                    </button>
                  </div>
                  
                  {reviewData.goals.map((goal, index) => (
                    <div key={index} style={{ marginBottom: '16px', padding: '12px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '8px' }}>
                      <input
                        type="text"
                        placeholder="Goal title"
                        value={goal.title}
                        onChange={(e) => {
                          const newGoals = [...reviewData.goals];
                          newGoals[index].title = e.target.value;
                          setReviewData(prev => ({ ...prev, goals: newGoals }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                          borderRadius: '6px',
                          background: darkMode ? '#1e293b' : 'white',
                          color: darkMode ? '#f1f5f9' : '#1e293b',
                          marginBottom: '8px'
                        }}
                      />
                      <textarea
                        placeholder="Goal description"
                        value={goal.description}
                        onChange={(e) => {
                          const newGoals = [...reviewData.goals];
                          newGoals[index].description = e.target.value;
                          setReviewData(prev => ({ ...prev, goals: newGoals }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                          borderRadius: '6px',
                          background: darkMode ? '#1e293b' : 'white',
                          color: darkMode ? '#f1f5f9' : '#1e293b',
                          minHeight: '60px',
                          marginBottom: '8px'
                        }}
                      />
                      <input
                        type="date"
                        value={goal.target_date}
                        onChange={(e) => {
                          const newGoals = [...reviewData.goals];
                          newGoals[index].target_date = e.target.value;
                          setReviewData(prev => ({ ...prev, goals: newGoals }));
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                          borderRadius: '6px',
                          background: darkMode ? '#1e293b' : 'white',
                          color: darkMode ? '#f1f5f9' : '#1e293b'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowReviewModal(false)}
                  style={{
                    background: 'transparent',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  style={{
                    background: reviewData.status === 'approved' ? '#10b981' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
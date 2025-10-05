import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

export default function EmployeeDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [socket, setSocket] = useState(null);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSupportDrawer, setShowSupportDrawer] = useState(false);
  
  const employeeId = 3; // Mock employee ID
  
  useEffect(() => {
    fetchDashboardData();
    setupWebSocket();
    
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/dashboard/employee/${employeeId}`);
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('API returned error:', result.error);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Show fallback data to prevent blank screen
      if (!dashboardData) {
        setDashboardData({
          employee: { name: 'Employee', department: 'Unknown', designation: 'Unknown' },
          onboardingProgress: { completed: 0, total: 7, percentage: 0, nextStep: 'Loading...' },
          leaveBalance: { casual: { used: 0, total: 12 }, sick: { used: 0, total: 10 }, earned: { used: 0, total: 15 } },
          notifications: [],
          tasks: [],
          goals: [],
          buddy: null,
          unreadNotifications: 0
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const setupWebSocket = () => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);
    
    newSocket.emit('join_employee_room', employeeId);
    
    newSocket.on(`notification_${employeeId}`, (notification) => {
      showToast(notification.title, notification.message, 'info');
      setTimeout(() => fetchDashboardData(), 500); // Slight delay for better UX
    });
    
    newSocket.on(`task_${employeeId}`, (task) => {
      showToast('New Task', task.title, 'info');
      setTimeout(() => fetchDashboardData(), 500);
    });
    
    newSocket.on(`dashboard_update_${employeeId}`, (update) => {
      setTimeout(() => fetchDashboardData(), 500);
    });
  };
  
  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:5001/api/notifications/${notificationId}/read`, {
        method: 'POST'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const completeTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5001/api/tasks/${taskId}/complete`, {
        method: 'POST'
      });
      showToast('Task Completed', 'Great job! Task marked as complete.', 'success');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
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
  
  if (!dashboardData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: darkMode ? '#0f172a' : '#f8fafc',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Unable to load dashboard</div>
        <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Please check your connection and try again</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Retry
        </button>
      </div>
    );
  }
  
  const { employee, onboardingProgress, leaveBalance, notifications, tasks, goals, buddy, unreadNotifications } = dashboardData;
  
  const completeGoal = async (goalId) => {
    try {
      await fetch(`http://localhost:5001/api/goals/${goalId}/complete`, {
        method: 'POST'
      });
      showToast('Goal Completed', 'Congratulations! Goal marked as complete.', 'success');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to complete goal:', error);
    }
  };

  return (
    <>
      <Head>
        <title>My Dashboard - HR SaaS Platform</title>
      </Head>
      
      <div style={{ 
        padding: '20px', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        background: darkMode ? '#0f172a' : '#f8fafc', 
        minHeight: '100vh',
        color: darkMode ? '#f1f5f9' : '#1e293b'
      }}>
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
                color: 'white',
                padding: '16px 20px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                zIndex: 1000,
                maxWidth: '300px'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{toast.title}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{toast.message}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            marginBottom: '20px'
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Your Onboarding Journey</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
            {[
              { step: 'Offer Letter', status: 'completed', icon: '📄' },
              { step: 'Email Created', status: onboardingProgress.percentage >= 14 ? 'completed' : 'pending', icon: '📧' },
              { step: 'Onboarding Started', status: onboardingProgress.percentage >= 29 ? 'completed' : 'pending', icon: '🚀' },
              { step: 'Tasks Complete', status: onboardingProgress.percentage >= 85 ? 'completed' : 'active', icon: '✅' },
              { step: 'Welcome!', status: onboardingProgress.percentage === 100 ? 'completed' : 'pending', icon: '🎉' }
            ].map((step, index) => (
              <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: step.status === 'completed' ? '#10b981' : step.status === 'active' ? '#f59e0b' : (darkMode ? '#374151' : '#f1f5f9'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  border: step.status === 'active' ? '2px solid #f59e0b' : 'none'
                }}>
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{step.step}</div>
                </div>
                {index < 4 && (
                  <div style={{ color: darkMode ? '#4b5563' : '#e2e8f0', fontSize: '16px', margin: '0 8px' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
        
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
              Welcome back, {employee.name}! 👋
            </h1>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '14px' }}>
              {employee.designation} • {employee.department} • TechStart Solutions
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                background: darkMode ? '#374151' : '#f3f4f6'
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  background: darkMode ? '#374151' : '#f3f4f6',
                  position: 'relative'
                }}
              >
                🔔
                {unreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: darkMode ? '#1e293b' : 'white',
                      border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      width: '350px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 100,
                      marginTop: '8px'
                    }}
                  >
                    <div style={{ padding: '16px', borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}` }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: darkMode ? '#94a3b8' : '#64748b' }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          style={{
                            padding: '12px 16px',
                            borderBottom: `1px solid ${darkMode ? '#374151' : '#f1f5f9'}`,
                            cursor: 'pointer',
                            background: notification.read ? 'transparent' : (darkMode ? '#374151' : '#f8fafc'),
                            opacity: notification.read ? 0.7 : 1
                          }}
                        >
                          <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                            {notification.title}
                          </div>
                          <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {notification.message}
                          </div>
                          <div style={{ fontSize: '11px', color: darkMode ? '#6b7280' : '#9ca3af', marginTop: '4px' }}>
                            {new Date(notification.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Announcements Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            border: '2px solid #8b5cf6'
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>📢 Company Updates</h3>
          
          <div style={{ display: 'grid', gap: '8px' }}>
            <div style={{ padding: '8px 12px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
              🎉 Welcome our new designer, Riya! She'll be joining the Product team.
            </div>
            <div style={{ padding: '8px 12px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
              📅 Office closed on Oct 12 for Dussehra festival. Enjoy the holiday!
            </div>
          </div>
        </motion.div>
        
        {/* Next Task Hint */}
        {tasks && tasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              color: 'white',
              padding: '16px 20px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ fontSize: '24px' }}>💡</div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Next Recommended Task</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                {tasks[0].title} → due {new Date(tasks[0].due_date).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => tasks[0].link && (window.location.href = tasks[0].link)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              Start Now
            </button>
          </motion.div>
        )}
        
        {/* Gamification Badge */}
        {onboardingProgress.percentage >= 43 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b, #f97316)', 
              color: 'white',
              padding: '12px 16px', 
              borderRadius: '12px', 
              marginBottom: '20px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌟</div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              {onboardingProgress.percentage === 100 ? 'Onboarding Champion!' : 'Great Progress!'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {onboardingProgress.percentage === 100 ? 
                'All tasks completed on time! Welcome to the team!' :
                `${onboardingProgress.completed}/${onboardingProgress.total} tasks completed - Keep it up!`
              }
            </div>
          </motion.div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* Onboarding Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
              border: onboardingProgress.percentage === 100 ? '2px solid #10b981' : '2px solid #f59e0b'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Onboarding Progress</h2>
              <span style={{ 
                background: onboardingProgress.percentage === 100 ? '#d1fae5' : '#fef3c7', 
                color: onboardingProgress.percentage === 100 ? '#065f46' : '#92400e', 
                padding: '4px 8px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                fontWeight: '600' 
              }}>
                {onboardingProgress.percentage === 100 ? 'COMPLETED' : 'IN PROGRESS'}
              </span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${onboardingProgress.percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ 
                    background: onboardingProgress.percentage === 100 ? '#10b981' : '#f59e0b', 
                    height: '100%'
                  }} 
                />
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                {onboardingProgress.completed} of {onboardingProgress.total} tasks complete ({onboardingProgress.percentage}%)
              </p>
            </div>
            
            <button 
              onClick={() => window.location.href = '/my-onboarding'}
              style={{ 
                width: '100%',
                padding: '12px', 
                background: onboardingProgress.percentage === 100 ? '#10b981' : '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {onboardingProgress.nextStep}
            </button>
          </motion.div>

          {/* Leave Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: darkMode ? '#1e293b' : 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            <h2 style={{ margin: '0 0 16px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Leave Balance</h2>
            
            <div style={{ marginBottom: '12px' }} title={`You've used ${leaveBalance.casual.used} of ${leaveBalance.casual.total} casual leaves`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Casual Leave</span>
                <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>{leaveBalance.casual.total - leaveBalance.casual.used}/{leaveBalance.casual.total}</span>
              </div>
              <div style={{ background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((leaveBalance.casual.total - leaveBalance.casual.used) / leaveBalance.casual.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ 
                    background: '#10b981', 
                    height: '100%'
                  }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }} title={`You've used ${leaveBalance.sick.used} of ${leaveBalance.sick.total} sick leaves`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Sick Leave</span>
                <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>{leaveBalance.sick.total - leaveBalance.sick.used}/{leaveBalance.sick.total}</span>
              </div>
              <div style={{ background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((leaveBalance.sick.total - leaveBalance.sick.used) / leaveBalance.sick.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ 
                    background: '#ef4444', 
                    height: '100%'
                  }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }} title={`You've used ${leaveBalance.earned.used} of ${leaveBalance.earned.total} earned leaves`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Earned Leave</span>
                <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>{leaveBalance.earned.total - leaveBalance.earned.used}/{leaveBalance.earned.total}</span>
              </div>
              <div style={{ background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((leaveBalance.earned.total - leaveBalance.earned.used) / leaveBalance.earned.total) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{ 
                    background: '#3b82f6', 
                    height: '100%'
                  }} 
                />
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/my-leave'}
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
              Apply for Leave
            </button>
          </motion.div>

          {/* Enhanced Buddy System Widget */}
          {buddy ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '2px solid #8b5cf6'
              }}
            >
              <h2 style={{ margin: '0 0 16px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>👥 Your Buddy</h2>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#8b5cf6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  marginRight: '12px'
                }}>
                  {buddy.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{buddy.name}</div>
                  <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>{buddy.designation}</div>
                  <div style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '2px' }}>🟢 Available for chat</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => window.location.href = `mailto:${buddy.email}`}
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    background: '#8b5cf6', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  💬 Message
                </button>
                <button 
                  onClick={() => alert('Book Intro Meeting - Coming soon!')}
                  style={{ 
                    flex: 1,
                    padding: '10px', 
                    background: 'transparent', 
                    color: '#8b5cf6', 
                    border: '2px solid #8b5cf6', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  📅 Book Intro
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ 
                background: darkMode ? '#1e293b' : 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
                border: '2px dashed #e2e8f0'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '4px' }}>Buddy Assignment</div>
              <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>A buddy will be assigned to help with your onboarding</div>
            </motion.div>
          )}
        </div>
        
        {/* My Goals Section */}
        {goals && goals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>My Goals</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  style={{
                    padding: '16px',
                    background: darkMode ? '#374151' : '#f8fafc',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        background: goal.status === 'completed' ? '#10b981' : goal.status === 'overdue' ? '#ef4444' : '#3b82f6',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        marginRight: '8px',
                        textTransform: 'uppercase'
                      }}>
                        {goal.status.replace('_', ' ')}
                      </span>
                      <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{goal.title}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
                      {goal.description}
                    </div>
                    <div style={{ fontSize: '12px', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                      Target: {new Date(goal.target_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {goal.status === 'in_progress' && (
                    <button
                      onClick={() => completeGoal(goal.id)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginLeft: '12px'
                      }}
                    >
                      Complete
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* My Tasks Section */}
        {tasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>My Tasks</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => task.link && (window.location.href = task.link)}
                  style={{
                    padding: '16px',
                    background: darkMode ? '#374151' : '#f8fafc',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    cursor: task.link ? 'pointer' : 'default',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{
                        background: task.task_type === 'onboarding' ? '#f59e0b' : task.task_type === 'hr' ? '#3b82f6' : '#10b981',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        marginRight: '8px',
                        textTransform: 'uppercase'
                      }}>
                        {task.task_type}
                      </span>
                      <span style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>{task.title}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '12px', color: darkMode ? '#6b7280' : '#9ca3af' }}>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      completeTask(task.id);
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      marginLeft: '12px'
                    }}
                  >
                    Complete
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: darkMode ? '#1e293b' : 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Quick Actions</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button 
              onClick={() => window.location.href = '/team-directory'}
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
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Team Directory</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>View your colleagues</div>
            </button>
            
            <button 
              onClick={() => alert('My Documents - Coming soon!')}
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
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📄</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>My Documents</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>View & download</div>
            </button>
            
            <button 
              onClick={() => alert('Update Profile - Coming soon!')}
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
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚙️</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Update Profile</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Emergency contacts</div>
            </button>
            
            <button 
              onClick={() => setShowSupportDrawer(true)}
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
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>❓</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Help & Support</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Get assistance</div>
            </button>
          </div>
        </motion.div>
        
        {/* Support Drawer */}
        {showSupportDrawer && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '400px',
            background: darkMode ? '#1e293b' : 'white',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Help & Support</h3>
              <button
                onClick={() => setShowSupportDrawer(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ flex: 1, padding: '20px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Quick Help</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <button style={{ padding: '12px', textAlign: 'left', background: darkMode ? '#374151' : '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    📋 Onboarding Checklist
                  </button>
                  <button style={{ padding: '12px', textAlign: 'left', background: darkMode ? '#374151' : '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    🏢 Office Information
                  </button>
                  <button style={{ padding: '12px', textAlign: 'left', background: darkMode ? '#374151' : '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    💻 IT Support
                  </button>
                  <button style={{ padding: '12px', textAlign: 'left', background: darkMode ? '#374151' : '#f8fafc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    📞 HR Contact
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Need Help?</h4>
                <textarea
                  placeholder="Describe your question or issue..."
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '12px',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: darkMode ? '#374151' : 'white',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    resize: 'vertical'
                  }}
                />
                <button style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Send Message
                </button>
              </div>
              
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b', textAlign: 'center' }}>
                💬 Live chat available Mon-Fri, 9 AM - 6 PM
              </div>
            </div>
          </div>
        )}
        
        {/* Support Drawer Overlay */}
        {showSupportDrawer && (
          <div 
            onClick={() => setShowSupportDrawer(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 999
            }}
          />
        )}
      </div>
    </>
  );
}
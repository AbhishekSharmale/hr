import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Mock funnel data
  const funnelData = {
    applied: 20,
    hired: 8,
    started: 6,
    completed: 5
  };
  
  // Mock time trends
  const timeTrends = {
    thisMonth: { joined: 3, completed: 5, avgDays: 7 },
    lastMonth: { joined: 2, completed: 4, avgDays: 9 }
  };
  
  const exportAnalytics = () => {
    const csvData = `Metric,Value\nActive Employees,${analytics?.activeEmployees}\nOnboarding Employees,${analytics?.onboardingEmployees}\nAvg Onboarding Days,${analytics?.avgOnboardingDays}\nPending Reviews,${analytics?.pendingReviews}`;
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr-analytics.csv';
    a.click();
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/analytics/dashboard');
      const result = await response.json();
      if (result.success) {
        setAnalytics(result.data);
      } else {
        console.error('API returned error:', result.error);
        // Set fallback data
        setAnalytics({
          activeEmployees: 0,
          onboardingEmployees: 0,
          avgOnboardingDays: 0,
          pendingReviews: 0,
          completionByDept: [],
          recentActivity: [],
          totalEmployees: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Set fallback data on network error
      setAnalytics({
        activeEmployees: 0,
        onboardingEmployees: 0,
        avgOnboardingDays: 0,
        pendingReviews: 0,
        completionByDept: [],
        recentActivity: [],
        totalEmployees: 0
      });
    } finally {
      setLoading(false);
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

  if (!analytics) {
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
        <div style={{ fontSize: '18px', fontWeight: '600' }}>Unable to load analytics</div>
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

  return (
    <>
      <Head>
        <title>HR Analytics Dashboard - HR SaaS Platform</title>
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
              HR Analytics Dashboard 📊
            </h1>
            <p style={{ color: darkMode ? '#94a3b8' : '#64748b', margin: 0, fontSize: '14px' }}>
              Employee onboarding and performance insights
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

        {/* Tab Navigation */}
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          display: 'flex',
          gap: '20px'
        }}>
          {['overview', 'trends', 'funnel'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : (darkMode ? '#94a3b8' : '#64748b'),
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
          
          <button
            onClick={exportAnalytics}
            style={{
              marginLeft: 'auto',
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Export CSV
          </button>
        </div>

        {activeTab === 'overview' && (
        <>
        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #10b981',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div 
              style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}
              onMouseEnter={() => setShowTooltip('active')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {analytics.activeEmployees}
            </div>
            <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Active Employees</div>
            {showTooltip === 'active' && (
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1e293b',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                zIndex: 10
              }}>
                Employees who completed onboarding
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #f59e0b'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {analytics.onboardingEmployees}
            </div>
            <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>In Onboarding</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #3b82f6'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏱️</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
              {analytics.avgOnboardingDays}
            </div>
            <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Avg. Onboarding Days</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '2px solid #ef4444'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
              {analytics.pendingReviews}
            </div>
            <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Pending Reviews</div>
          </motion.div>

        </div>

        {/* Conversion Funnel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>
            Hiring Conversion Funnel
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
            {[
              { label: 'Applied', value: funnelData.applied, color: '#3b82f6' },
              { label: 'Hired', value: funnelData.hired, color: '#10b981' },
              { label: 'Started', value: funnelData.started, color: '#f59e0b' },
              { label: 'Completed', value: funnelData.completed, color: '#8b5cf6' }
            ].map((stage, index) => (
              <div key={stage.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: stage.color,
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  minWidth: '80px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{stage.value}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{stage.label}</div>
                </div>
                {index < 3 && (
                  <div style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '18px' }}>→</div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '16px', fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b', textAlign: 'center' }}>
            Overall conversion: {Math.round((funnelData.completed / funnelData.applied) * 100)}% 
            • Drop-off rate: {Math.round(((funnelData.applied - funnelData.completed) / funnelData.applied) * 100)}%
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          {/* Completion Rate by Department */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>
              Completion Rate by Department
            </h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {analytics.completionByDept.map((dept, index) => (
                <div key={dept.department} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', color: darkMode ? '#f1f5f9' : '#1e293b', fontWeight: '500' }}>
                      {dept.department}
                    </span>
                    <span style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {dept.completed}/{dept.total} ({dept.rate}%)
                    </span>
                  </div>
                  <div style={{ background: darkMode ? '#374151' : '#f1f5f9', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.rate}%` }}
                      transition={{ duration: 1, delay: 0.7 + (index * 0.1) }}
                      style={{ 
                        background: dept.rate >= 80 ? '#10b981' : dept.rate >= 60 ? '#f59e0b' : '#ef4444', 
                        height: '100%'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Overdue Tasks Heatmap */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Overdue Tasks by Department</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { dept: 'Engineering', overdue: 2, total: 8, severity: 'low' },
                { dept: 'Marketing', overdue: 5, total: 6, severity: 'high' },
                { dept: 'HR', overdue: 1, total: 4, severity: 'low' },
                { dept: 'Sales', overdue: 3, total: 5, severity: 'medium' }
              ].map(item => (
                <div key={item.dept} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: item.severity === 'high' ? '#fef2f2' : item.severity === 'medium' ? '#fefbf2' : '#f0fdf4',
                  border: `1px solid ${item.severity === 'high' ? '#fecaca' : item.severity === 'medium' ? '#fed7aa' : '#bbf7d0'}`,
                  borderRadius: '8px'
                }}>
                  <span style={{ fontWeight: '500', color: '#1e293b' }}>{item.dept}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: item.severity === 'high' ? '#dc2626' : item.severity === 'medium' ? '#d97706' : '#16a34a',
                      fontWeight: '600'
                    }}>
                      {item.overdue} overdue
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>/ {item.total} total</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
        </>
        )}
        
        {activeTab === 'trends' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Trends Over Time</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                  {timeTrends.thisMonth.joined} vs {timeTrends.lastMonth.joined}
                </div>
                <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Employees Joined</div>
                <div style={{ fontSize: '12px', color: timeTrends.thisMonth.joined > timeTrends.lastMonth.joined ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  {timeTrends.thisMonth.joined > timeTrends.lastMonth.joined ? '↗️' : '↘️'} 
                  {Math.abs(timeTrends.thisMonth.joined - timeTrends.lastMonth.joined)} from last month
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                  {timeTrends.thisMonth.completed} vs {timeTrends.lastMonth.completed}
                </div>
                <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Onboarding Completed</div>
                <div style={{ fontSize: '12px', color: timeTrends.thisMonth.completed > timeTrends.lastMonth.completed ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  {timeTrends.thisMonth.completed > timeTrends.lastMonth.completed ? '↗️' : '↘️'} 
                  {Math.abs(timeTrends.thisMonth.completed - timeTrends.lastMonth.completed)} from last month
                </div>
              </div>
              
              <div style={{ textAlign: 'center', padding: '20px', background: darkMode ? '#374151' : '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
                  {timeTrends.thisMonth.avgDays} vs {timeTrends.lastMonth.avgDays}
                </div>
                <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>Avg. Days to Complete</div>
                <div style={{ fontSize: '12px', color: timeTrends.thisMonth.avgDays < timeTrends.lastMonth.avgDays ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                  {timeTrends.thisMonth.avgDays < timeTrends.lastMonth.avgDays ? '↗️ Faster' : '↘️ Slower'} 
                  by {Math.abs(timeTrends.thisMonth.avgDays - timeTrends.lastMonth.avgDays)} days
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'funnel' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>Detailed Conversion Analysis</h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { from: 'Applied', to: 'Hired', fromVal: 20, toVal: 8, rate: 40 },
                { from: 'Hired', to: 'Started', fromVal: 8, toVal: 6, rate: 75 },
                { from: 'Started', to: 'Completed', fromVal: 6, toVal: 5, rate: 83 }
              ].map(conversion => (
                <div key={`${conversion.from}-${conversion.to}`} style={{
                  padding: '16px',
                  background: darkMode ? '#374151' : '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {conversion.from} → {conversion.to}
                    </div>
                    <div style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {conversion.fromVal} → {conversion.toVal} candidates
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: conversion.rate >= 70 ? '#10b981' : conversion.rate >= 50 ? '#f59e0b' : '#ef4444'
                  }}>
                    {conversion.rate}%
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            padding: '24px', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: darkMode ? '#f1f5f9' : '#1e293b', fontSize: '18px', fontWeight: '600' }}>
            Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button 
              onClick={() => window.location.href = '/employees'}
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
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>👥</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>View All Employees</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Manage employee records</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/hiring'}
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
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎯</div>
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Hiring Pipeline</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Track recruitment</div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/reports'}
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
              <div style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#1e293b' }}>Detailed Reports</div>
              <div style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#64748b' }}>Export analytics</div>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
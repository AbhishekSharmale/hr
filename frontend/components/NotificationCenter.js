import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter({ 
  notifications, 
  showNotifications, 
  setShowNotifications, 
  markNotificationAsRead,
  darkMode 
}) {
  return (
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
          <div style={{ 
            padding: '16px', 
            borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: darkMode ? '#94a3b8' : '#64748b'
              }}
            >
              ×
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: darkMode ? '#94a3b8' : '#64748b' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
              <div>No notifications yet</div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                You'll see updates here when they arrive
              </div>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => markNotificationAsRead(notification.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: `1px solid ${darkMode ? '#374151' : '#f1f5f9'}`,
                    cursor: 'pointer',
                    background: notification.read ? 'transparent' : (darkMode ? '#374151' : '#f8fafc'),
                    opacity: notification.read ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{ backgroundColor: darkMode ? '#4b5563' : '#f1f5f9' }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                      {notification.title}
                    </div>
                    {!notification.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        marginLeft: '8px',
                        marginTop: '3px'
                      }} />
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: darkMode ? '#94a3b8' : '#64748b',
                    marginBottom: '4px'
                  }}>
                    {notification.message}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: darkMode ? '#6b7280' : '#9ca3af',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                    <span style={{
                      background: notification.type === 'onboarding' ? '#f59e0b' : 
                                 notification.type === 'announcement' ? '#8b5cf6' : '#10b981',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '9px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {notification.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
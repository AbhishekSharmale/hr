import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: getColor(toast.type),
          color: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: '350px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '20px' }}>{getIcon(toast.type)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.4' }}>
            {toast.message}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            opacity: 0.7,
            padding: '0',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
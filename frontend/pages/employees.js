import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    designation: ''
  });

  useEffect(() => {
    fetch('http://localhost:5001/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data.data))
      .catch(err => console.error('Error:', err));
  }, []);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmployee = () => {
    const newErrors = {};
    
    if (!newEmployee.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newEmployee.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (employees.some(emp => emp.email.toLowerCase() === newEmployee.email.toLowerCase())) {
      newErrors.email = 'An employee with this email already exists';
    }
    
    if (!newEmployee.department) {
      newErrors.department = 'Please select a department';
    }
    
    if (!newEmployee.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    if (!validateEmployee()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employee = {
        id: employees.length + 1,
        ...newEmployee
      };
      
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', email: '', department: '', designation: '' });
      setErrors({});
      setShowAddEmployee(false);
      
      // Show success toast instead of alert
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 20px;border-radius:8px;z-index:1002;font-size:14px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
      toast.textContent = `✓ ${employee.name} added successfully!`;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
      
    } catch (error) {
      setErrors({ submit: 'Failed to add employee. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employees - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Employee Management</h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>All Employees ({employees.length})</h2>
            <button 
              onClick={() => setShowAddEmployee(true)}
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
              + Add Employee
            </button>
          </div>
          
          {employees.map(emp => (
            <div 
              key={emp.id} 
              onClick={() => alert(`${emp.name}'s Full Profile:\n\n• ${emp.designation || 'No designation'} in ${emp.department || 'No department'}\n• Email: ${emp.email}\n• Employee ID: EMP${emp.id.toString().padStart(3, '0')}\n• Join Date: Jan 2023\n• Manager: Priya Patel\n\n[Click to edit profile - Coming soon]`)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid #e2e8f0', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: '#e2e8f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#64748b'
                }}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>{emp.name}</h3>
                  <p style={{ margin: '5px 0', color: '#64748b' }}>{emp.email} • {emp.department || 'No department'}</p>
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#64748b' }}>{emp.designation || 'No designation'} • EMP{emp.id.toString().padStart(3, '0')}</p>
                </div>
              </div>
              <span style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '12px', 
                fontSize: '12px' 
              }}>
                Active
              </span>
            </div>
          ))}
        </div>

        {/* Add Employee Modal */}
        {showAddEmployee && (
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
              <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Add New Employee</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Full Name *</label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => {
                    setNewEmployee({...newEmployee, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter full name"
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => {
                    setNewEmployee({...newEmployee, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter email address"
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Department</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => {
                    setNewEmployee({...newEmployee, department: e.target.value});
                    if (errors.department) setErrors({...errors, department: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.department ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Finance">Finance</option>
                </select>
                {errors.department && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.department}</p>}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>Designation</label>
                <input
                  type="text"
                  value={newEmployee.designation}
                  onChange={(e) => {
                    setNewEmployee({...newEmployee, designation: e.target.value});
                    if (errors.designation) setErrors({...errors, designation: ''});
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: `1px solid ${errors.designation ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g. Senior Developer, Marketing Manager"
                />
                {errors.designation && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.designation}</p>}
              </div>

              {errors.submit && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 15px 0', textAlign: 'center' }}>{errors.submit}</p>}
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddEmployee(false)}
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
                  onClick={handleAddEmployee}
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting && <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>}
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
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
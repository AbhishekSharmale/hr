const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const companies = [
  { id: 1, name: 'TechStart Solutions', employees: 25 }
];

const employees = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@techstart.com', department: 'Engineering', designation: 'Senior Developer', status: 'Active', onboarding_status: 'completed', manager_id: null, buddy_id: null },
  { id: 2, name: 'Priya Patel', email: 'priya@techstart.com', department: 'HR', designation: 'HR Manager', status: 'Active', onboarding_status: 'completed', manager_id: null, buddy_id: null },
  { id: 3, name: 'Amit Kumar', email: 'amit@techstart.com', department: 'Marketing', designation: 'Marketing Lead', status: 'Onboarding', onboarding_status: 'onboarding_initiated', company_email: null, manager_id: 1, buddy_id: 1 },
  { id: 4, name: 'Sarah Johnson', email: 'sarah.j@gmail.com', department: 'Engineering', designation: 'Frontend Developer', status: 'Onboarding', onboarding_status: 'it_done', company_email: 'sarah@techstart.com', manager_id: 1, buddy_id: null }
];

const onboardingEvents = [];
const employeeNotifications = [];
const employeeTasks = [];
const employeeGoals = [];
const managerReviews = [];
const activityLog = [];

// Mock data for enhanced features
const mockNotifications = [
  { id: '1', employee_id: 3, type: 'onboarding', title: 'Welcome to TechStart!', message: 'Complete your profile setup to get started.', read: false, created_at: new Date().toISOString() },
  { id: '2', employee_id: 3, type: 'announcement', title: 'Holiday Notice', message: 'Office will be closed on Oct 12 for Dussehra.', read: false, created_at: new Date(Date.now() - 86400000).toISOString() }
];

const mockTasks = [
  { id: '1', employee_id: 3, title: 'Upload PAN Card', description: 'Please upload a clear photo of your PAN card', due_date: '2024-01-15', status: 'pending', link: '/my-onboarding', task_type: 'onboarding', created_at: new Date().toISOString() },
  { id: '2', employee_id: 3, title: 'Complete Bank Details', description: 'Add your bank account information for salary processing', due_date: '2024-01-16', status: 'pending', link: '/my-onboarding', task_type: 'hr', created_at: new Date().toISOString() },
  { id: '3', employee_id: 3, title: 'Confirm Email Setup', description: 'Verify your company email is working correctly', due_date: '2024-01-14', status: 'pending', link: '/settings', task_type: 'it', created_at: new Date().toISOString() }
];

employeeNotifications.push(...mockNotifications);
employeeTasks.push(...mockTasks);

// Enhanced notification system
const sendNotification = (employeeId, type, title, message, link = null) => {
  const notification = {
    id: Date.now().toString(),
    employee_id: employeeId,
    type,
    title,
    message,
    link,
    read: false,
    created_at: new Date().toISOString()
  };
  
  employeeNotifications.push(notification);
  
  // Send real-time update via WebSocket
  io.emit(`notification_${employeeId}`, notification);
  
  console.log(`📧 Notification to employee ${employeeId}: ${title}`);
  return notification;
};

const createTask = (employeeId, title, description, dueDate, taskType = 'general', link = null, createdBy = 1) => {
  const task = {
    id: Date.now().toString(),
    employee_id: employeeId,
    title,
    description,
    due_date: dueDate,
    status: 'pending',
    link,
    task_type: taskType,
    created_by: createdBy,
    created_at: new Date().toISOString()
  };
  
  employeeTasks.push(task);
  
  // Send real-time update via WebSocket
  io.emit(`task_${employeeId}`, task);
  
  return task;
};

const logActivity = (employeeId, actorId, role, action, description, metadata = {}, deviceInfo = '') => {
  const activity = {
    id: activityLog.length + 1,
    employee_id: employeeId,
    actor_id: actorId,
    role,
    action,
    description,
    metadata,
    device_info: deviceInfo,
    created_at: new Date().toISOString()
  };
  
  activityLog.push(activity);
  return activity;
};

const createGoal = (employeeId, title, description, targetDate, createdBy) => {
  const goal = {
    id: Date.now().toString(),
    employee_id: employeeId,
    title,
    description,
    target_date: targetDate,
    status: 'in_progress',
    created_by: createdBy,
    created_at: new Date().toISOString()
  };
  
  employeeGoals.push(goal);
  
  // Notify employee
  const employee = employees.find(e => e.id === employeeId);
  const manager = employees.find(e => e.id === createdBy);
  sendNotification(employeeId, 'goal', 'New Goal Assigned', `${manager?.name || 'Your manager'} assigned you a new goal: ${title}`, '/goals');
  
  // Log activity
  logActivity(employeeId, createdBy, 'manager', 'goal_assigned', `Goal assigned: ${title}`);
  
  return goal;
};

const createManagerReview = (employeeId, managerId) => {
  const review = {
    id: Date.now().toString(),
    employee_id: employeeId,
    manager_id: managerId,
    review_type: 'onboarding_completion',
    status: 'pending',
    notes: '',
    created_at: new Date().toISOString()
  };
  
  managerReviews.push(review);
  
  // Notify manager
  const employee = employees.find(e => e.id === employeeId);
  sendNotification(managerId, 'review', 'Onboarding Review Required', `Please review ${employee?.name}'s completed onboarding`, '/manager/reviews');
  
  return review;
};

const logOnboardingEvent = (employeeId, actorId, role, eventType, message) => {
  const event = {
    id: onboardingEvents.length + 1,
    employee_id: employeeId,
    actor_id: actorId,
    role,
    event_type: eventType,
    message,
    created_at: new Date().toISOString()
  };
  onboardingEvents.push(event);
  return event;
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'HR SaaS API is running!', timestamp: new Date().toISOString() });
});

app.get('/api/employees', (req, res) => {
  res.json({ success: true, data: employees });
});

// Unified Employee Dashboard API
app.get('/api/dashboard/employee/:id', (req, res) => {
  const { id } = req.params;
  const employee = employees.find(e => e.id == id);
  
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  
  // Get onboarding progress
  const getOnboardingProgress = (status) => {
    switch (status) {
      case 'awaiting_it': return { completed: 0, total: 7, percentage: 0, nextStep: 'Awaiting IT setup' };
      case 'it_done': return { completed: 1, total: 7, percentage: 14, nextStep: 'Awaiting HR confirmation' };
      case 'onboarding_initiated': return { completed: 2, total: 7, percentage: 29, nextStep: 'Continue Onboarding' };
      case 'employee_in_progress': return { completed: 4, total: 7, percentage: 57, nextStep: 'Continue Onboarding' };
      case 'completed': return { completed: 7, total: 7, percentage: 100, nextStep: '🎉 Onboarding completed! Explore your company resources.' };
      default: return { completed: 0, total: 7, percentage: 0, nextStep: 'Continue Onboarding' };
    }
  };
  
  // Get leave balance (mock data)
  const leaveBalance = {
    casual: { used: 2, total: 12 },
    sick: { used: 0, total: 10 },
    earned: { used: 1, total: 15 }
  };
  
  // Get notifications
  const notifications = employeeNotifications
    .filter(n => n.employee_id == id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
  
  // Get tasks
  const tasks = employeeTasks
    .filter(t => t.employee_id == id && t.status === 'pending')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  
  // Get goals
  const goals = employeeGoals
    .filter(g => g.employee_id == id)
    .sort((a, b) => new Date(a.target_date) - new Date(b.target_date));
  
  // Get buddy info
  const buddy = employee.buddy_id ? employees.find(e => e.id === employee.buddy_id) : null;
  
  const dashboardData = {
    employee: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      status: employee.status
    },
    onboardingProgress: getOnboardingProgress(employee.onboarding_status),
    leaveBalance,
    notifications,
    tasks,
    goals,
    buddy: buddy ? {
      id: buddy.id,
      name: buddy.name,
      designation: buddy.designation,
      email: buddy.email
    } : null,
    unreadNotifications: notifications.filter(n => !n.read).length
  };
  
  // Log dashboard view
  logActivity(id, id, 'employee', 'dashboard_viewed', `${employee.name} viewed dashboard`);
  
  res.json({ success: true, data: dashboardData });
});

app.get('/api/dashboard', (req, res) => {
  const pendingOnboarding = employees.filter(e => 
    e.onboarding_status === 'onboarding_initiated' || 
    e.onboarding_status === 'employee_in_progress'
  ).length;
  
  res.json({
    success: true,
    data: {
      totalEmployees: employees.length,
      pendingOnboarding,
      pendingLeaveRequests: 3,
      openPositions: 1
    }
  });
});

// Onboarding API Routes
app.post('/api/onboarding/initiate/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { actorId = 1, role = 'HR' } = req.body; // Mock HR user
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  if (employee.onboarding_status !== 'it_done') {
    return res.status(400).json({ error: 'IT setup must be completed first' });
  }
  
  employee.onboarding_status = 'onboarding_initiated';
  logOnboardingEvent(employeeId, actorId, role, 'onboarding_initiated', `Onboarding initiated for ${employee.name}`);
  
  // Send notifications
  sendNotification(employee.id, 'onboarding', 'Onboarding Started', 'Your onboarding has started. Please log in to complete your tasks.', '/my-onboarding');
  if (employee.buddy_id) {
    sendNotification(employee.buddy_id, 'buddy', 'Buddy Assignment', `You've been assigned as buddy for ${employee.name}`, '/buddy-dashboard');
  }
  
  res.json({ success: true, employee, message: 'Onboarding initiated successfully' });
});

app.post('/api/onboarding/mark-email-created/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { companyEmail, tempPassword, actorId = 2, role = 'IT' } = req.body; // Mock IT user
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  if (employee.onboarding_status !== 'awaiting_it') {
    return res.status(400).json({ error: 'Employee not in awaiting_it status' });
  }
  
  employee.company_email = companyEmail;
  employee.onboarding_status = 'it_done';
  logOnboardingEvent(employeeId, actorId, role, 'email_created', `Company email created: ${companyEmail}`);
  
  // Notify HR
  sendNotification(1, 'it', 'IT Setup Complete', `Email setup complete for ${employee.name}. Ready to initiate onboarding.`, '/employees');
  
  res.json({ success: true, employee, message: 'Email created successfully' });
});

app.post('/api/onboarding/complete/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { actorId, role = 'EMPLOYEE' } = req.body;
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  employee.onboarding_status = 'completed';
  employee.status = 'Active';
  logOnboardingEvent(employeeId, actorId || employeeId, role, 'completed', `${employee.name} completed onboarding`);
  
  // Notify HR and manager
  sendNotification(1, 'onboarding', 'Onboarding Complete', `${employee.name} has completed onboarding`, '/employees');
  if (employee.manager_id) {
    sendNotification(employee.manager_id, 'onboarding', 'Team Member Ready', `${employee.name} has completed onboarding and is ready to start`, '/manager-dashboard');
  }
  
  res.json({ success: true, employee, message: 'Onboarding completed successfully' });
});

app.get('/api/onboarding/events/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const events = onboardingEvents.filter(e => e.employee_id == employeeId);
  res.json({ success: true, data: events });
});

app.get('/api/onboarding/pending-it', (req, res) => {
  const pendingIT = employees.filter(e => e.onboarding_status === 'awaiting_it');
  res.json({ success: true, data: pendingIT });
});

app.get('/api/onboarding/activity-log', (req, res) => {
  const recentEvents = onboardingEvents
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map(event => {
      const employee = employees.find(e => e.id === event.employee_id);
      return {
        ...event,
        employee_name: employee?.name || 'Unknown'
      };
    });
  res.json({ success: true, data: recentEvents });
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const { name, email, department, designation } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newEmployee = {
    id: employees.length + 1,
    name,
    email,
    department,
    designation,
    status: 'Onboarding',
    onboarding_status: 'awaiting_it',
    company_email: null,
    manager_id: null,
    buddy_id: null
  };
  
  employees.push(newEmployee);
  
  // Log the creation event
  logOnboardingEvent(newEmployee.id, 1, 'HR', 'created', `New employee ${name} added to system`);
  
  // Notify IT
  sendNotification(2, 'it', 'New Employee Setup', `Please create email account for ${name}`, '/it-dashboard');
  
  res.json({ success: true, employee: newEmployee, message: 'Employee added successfully' });
});

// Notification Management APIs
app.get('/api/notifications/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const notifications = employeeNotifications
    .filter(n => n.employee_id == employeeId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json({ success: true, data: notifications });
});

app.post('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notification = employeeNotifications.find(n => n.id === id);
  
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  notification.read = true;
  
  // Log activity
  logActivity(notification.employee_id, notification.employee_id, 'employee', 'notification_read', `Marked notification as read: ${notification.title}`);
  
  res.json({ success: true, notification });
});

// Task Management APIs
app.get('/api/tasks/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const tasks = employeeTasks
    .filter(t => t.employee_id == employeeId)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  
  res.json({ success: true, data: tasks });
});

app.post('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const task = employeeTasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.status = 'completed';
  task.completed_at = new Date().toISOString();
  
  // Send notification
  const employee = employees.find(e => e.id === task.employee_id);
  sendNotification(task.employee_id, 'task_completed', 'Task Completed', `You completed: ${task.title}`);
  
  // Log activity
  logActivity(task.employee_id, task.employee_id, 'employee', 'task_completed', `Completed task: ${task.title}`);
  
  res.json({ success: true, task });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_employee_room', (employeeId) => {
    socket.join(`employee_${employeeId}`);
    console.log(`Employee ${employeeId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Manager Review APIs
app.post('/api/onboarding/review/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { status, notes, goals = [], managerId } = req.body;
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  const review = managerReviews.find(r => r.employee_id == employeeId && r.status === 'pending');
  if (!review) return res.status(404).json({ error: 'No pending review found' });
  
  review.status = status;
  review.notes = notes;
  review.reviewed_at = new Date().toISOString();
  
  if (status === 'approved') {
    employee.status = 'Active';
    
    // Create goals
    goals.forEach(goal => {
      createGoal(employeeId, goal.title, goal.description, goal.target_date, managerId);
    });
    
    // Notify employee and HR
    sendNotification(employeeId, 'review', 'Onboarding Approved! 🎉', 'Your manager has approved your onboarding. Welcome to the team!', '/goals');
    sendNotification(1, 'review', 'Onboarding Approved', `${employee.name}'s onboarding has been approved by their manager`);
    
    logActivity(employeeId, managerId, 'manager', 'onboarding_approved', `Onboarding approved with ${goals.length} initial goals`);
  } else {
    sendNotification(employeeId, 'review', 'Onboarding Needs Attention', 'Your manager has requested some rework on your onboarding', '/my-onboarding');
    logActivity(employeeId, managerId, 'manager', 'onboarding_rework', `Onboarding requires rework: ${notes}`);
  }
  
  res.json({ success: true, review, message: `Onboarding ${status} successfully` });
});

// Goal Management APIs
app.get('/api/goals/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const goals = employeeGoals.filter(g => g.employee_id == employeeId);
  res.json({ success: true, data: goals });
});

app.post('/api/goals/:id/complete', (req, res) => {
  const { id } = req.params;
  const goal = employeeGoals.find(g => g.id === id);
  
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  
  goal.status = 'completed';
  goal.completed_at = new Date().toISOString();
  
  const employee = employees.find(e => e.id === goal.employee_id);
  const manager = employees.find(e => e.id === goal.created_by);
  
  // Notify manager and HR
  sendNotification(goal.created_by, 'goal', 'Goal Completed', `${employee?.name} completed: ${goal.title}`);
  sendNotification(1, 'goal', 'Goal Completed', `${employee?.name} completed goal: ${goal.title}`);
  
  logActivity(goal.employee_id, goal.employee_id, 'employee', 'goal_completed', `Completed goal: ${goal.title}`);
  
  res.json({ success: true, goal });
});

// HR Analytics Dashboard
app.get('/api/analytics/dashboard', (req, res) => {
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const onboardingEmployees = employees.filter(e => e.status === 'Onboarding').length;
  
  // Calculate avg onboarding duration (mock data)
  const avgOnboardingDays = 7;
  
  // Completion rate by department
  const departments = [...new Set(employees.map(e => e.department))];
  const completionByDept = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const completed = deptEmployees.filter(e => e.onboarding_status === 'completed').length;
    return {
      department: dept,
      total: deptEmployees.length,
      completed,
      rate: deptEmployees.length > 0 ? Math.round((completed / deptEmployees.length) * 100) : 0
    };
  });
  
  // Pending manager reviews
  const pendingReviews = managerReviews.filter(r => r.status === 'pending').length;
  
  // Recent activity
  const recentActivity = activityLog
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10)
    .map(activity => {
      const employee = employees.find(e => e.id === activity.employee_id);
      return {
        ...activity,
        employee_name: employee?.name || 'Unknown'
      };
    });
  
  res.json({
    success: true,
    data: {
      activeEmployees,
      onboardingEmployees,
      avgOnboardingDays,
      completionByDept,
      pendingReviews,
      recentActivity,
      totalEmployees: employees.length
    }
  });
});

// Manager Dashboard APIs
app.get('/api/manager/direct-reports/:managerId', (req, res) => {
  const { managerId } = req.params;
  
  const directReports = employees.filter(e => e.manager_id == managerId);
  const reportsWithStatus = directReports.map(employee => {
    const pendingReview = managerReviews.find(r => r.employee_id === employee.id && r.status === 'pending');
    const goals = employeeGoals.filter(g => g.employee_id === employee.id);
    
    return {
      ...employee,
      pendingReview: !!pendingReview,
      goalsCount: goals.length,
      completedGoals: goals.filter(g => g.status === 'completed').length
    };
  });
  
  res.json({ success: true, data: reportsWithStatus });
});

// Enhanced onboarding complete API
app.post('/api/onboarding/complete/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { actorId, role = 'EMPLOYEE' } = req.body;
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  employee.onboarding_status = 'completed';
  logOnboardingEvent(employeeId, actorId || employeeId, role, 'completed', `${employee.name} completed onboarding`);
  
  // Create manager review task if manager exists
  if (employee.manager_id) {
    createManagerReview(employeeId, employee.manager_id);
  } else {
    // No manager, auto-approve
    employee.status = 'Active';
    sendNotification(employeeId, 'onboarding', 'Welcome to the Team! 🎉', 'Your onboarding is complete. Welcome aboard!', '/employee-dashboard');
  }
  
  // Notify HR
  sendNotification(1, 'onboarding', 'Onboarding Complete', `${employee.name} has completed onboarding`, '/employees');
  
  // Real-time update
  io.emit(`dashboard_update_${employeeId}`, { type: 'onboarding_completed' });
  
  res.json({ success: true, employee, message: 'Onboarding completed successfully' });
});

app.post('/api/onboarding/initiate/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const { actorId = 1, role = 'HR' } = req.body;
  
  const employee = employees.find(e => e.id == employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee not found' });
  
  if (employee.onboarding_status !== 'it_done') {
    return res.status(400).json({ error: 'IT setup must be completed first' });
  }
  
  employee.onboarding_status = 'onboarding_initiated';
  logOnboardingEvent(employeeId, actorId, role, 'onboarding_initiated', `Onboarding initiated for ${employee.name}`);
  
  // Send notifications and create tasks
  sendNotification(employee.id, 'onboarding', 'Onboarding Started', 'Your onboarding has started. Please log in to complete your tasks.', '/my-onboarding');
  
  createTask(employee.id, 'Complete Personal Information', 'Fill in your personal details and emergency contacts', '2024-01-15', 'onboarding', '/my-onboarding');
  createTask(employee.id, 'Upload Documents', 'Upload required documents (PAN, Aadhaar, etc.)', '2024-01-16', 'onboarding', '/my-onboarding');
  
  if (employee.buddy_id) {
    sendNotification(employee.buddy_id, 'buddy', 'Buddy Assignment', `You've been assigned as buddy for ${employee.name}`, '/buddy-dashboard');
  }
  
  // Real-time update
  io.emit(`dashboard_update_${employeeId}`, { type: 'onboarding_initiated' });
  
  res.json({ success: true, employee, message: 'Onboarding initiated successfully' });
});

// Performance Timeline API
app.get('/api/performance/timeline/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  
  const timeline = activityLog
    .filter(a => a.employee_id == employeeId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(activity => {
      const actor = employees.find(e => e.id === activity.actor_id);
      return {
        ...activity,
        actor_name: actor?.name || 'System'
      };
    });
  
  res.json({ success: true, data: timeline });
});

server.listen(PORT, () => {
  console.log(`🚀 HR SaaS Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for real-time updates`);
  console.log(`📊 Manager Review & Analytics APIs ready`);
});
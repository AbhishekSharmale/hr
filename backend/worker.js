// Cloudflare Worker for HR SaaS Platform
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Mock users with different roles
const users = {
  'admin@techstart.com': { id: 1, name: 'Admin User', role: 'admin', password: 'admin123' },
  'hr@techstart.com': { id: 2, name: 'Priya Patel', role: 'hr', password: 'hr123' },
  'manager@techstart.com': { id: 3, name: 'Rahul Sharma', role: 'manager', password: 'manager123' },
  'employee@techstart.com': { id: 4, name: 'Amit Kumar', role: 'employee', password: 'emp123' }
};

// Auth functions
function authenticate(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = JSON.parse(atob(token));
    return users[payload.email] || null;
  } catch {
    return null;
  }
}

function generateToken(user) {
  return btoa(JSON.stringify({ email: user.email, role: user.role, exp: Date.now() + 86400000 }));
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Auth endpoints
    if (path === '/api/auth/login' && request.method === 'POST') {
      const { email, password } = await request.json();
      const user = users[email];
      
      if (!user || user.password !== password) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const token = generateToken({ email, role: user.role });
      return new Response(JSON.stringify({
        success: true,
        token,
        user: { id: user.id, name: user.name, email, role: user.role }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (path === '/api/auth/me' && request.method === 'GET') {
      const user = authenticate(request);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ success: true, user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Dashboard endpoints
    if (path.startsWith('/api/dashboard/') && request.method === 'GET') {
      const user = authenticate(request);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const role = path.split('/')[3];
      if (user.role !== role && user.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      let dashboardData = {};
      
      switch (role) {
        case 'employee':
          dashboardData = {
            employee: { id: user.id, name: user.name, department: 'Marketing', designation: 'Marketing Lead', status: 'Onboarding' },
            onboardingProgress: { completed: 5, total: 7, percentage: 71, nextStep: 'Complete final review' },
            leaveBalance: { casual: { used: 2, total: 12 }, sick: { used: 0, total: 10 }, earned: { used: 1, total: 15 } },
            tasks: [
              { id: '1', title: 'Complete Profile', description: 'Fill remaining details', due_date: '2024-01-20', status: 'pending', task_type: 'onboarding' }
            ],
            goals: [
              { id: '1', title: 'Learn Platform', description: 'Complete onboarding', target_date: '2024-01-25', status: 'in_progress' }
            ],
            notifications: [
              { id: '1', type: 'onboarding', title: 'Welcome!', message: 'Complete your setup', read: false, created_at: new Date().toISOString() }
            ],
            unreadNotifications: 1,
            buddy: { id: 1, name: 'Rahul Sharma', designation: 'Senior Developer', email: 'rahul@techstart.com' }
          };
          break;
          
        case 'manager':
          dashboardData = [
            { id: 4, name: 'Amit Kumar', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', pendingReview: false, goalsCount: 2, completedGoals: 1 }
          ];
          break;
          
        case 'hr':
          dashboardData = {
            activeEmployees: 3,
            onboardingEmployees: 1,
            avgOnboardingDays: 7,
            pendingReviews: 0,
            completionByDept: [
              { department: 'Engineering', total: 2, completed: 2, rate: 100 },
              { department: 'Marketing', total: 1, completed: 0, rate: 0 }
            ],
            recentActivity: [
              { id: 1, employee_name: 'Amit Kumar', description: 'completed onboarding task', created_at: new Date().toISOString() }
            ]
          };
          break;
          
        default:
          return new Response(JSON.stringify({ error: 'Invalid role' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
      
      return new Response(JSON.stringify({ success: true, data: dashboardData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Health check
    if (path === '/api/health') {
      return new Response(JSON.stringify({ 
        status: 'HR SaaS API is running on Cloudflare!', 
        timestamp: new Date().toISOString() 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // 404 handler
    return new Response('Not Found', { status: 404 });
  }
};
// Test script to verify the complete HR SaaS flow
const baseUrl = 'http://localhost:5001';

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const result = await response.json();
    console.log(`✅ ${method} ${endpoint}:`, result.success ? 'SUCCESS' : 'FAILED');
    return result;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing HR SaaS Platform Flow...\n');
  
  // 1. Test health check
  await testAPI('/api/health');
  
  // 2. Test employee dashboard
  await testAPI('/api/dashboard/employee/3');
  
  // 3. Test manager dashboard
  await testAPI('/api/manager/direct-reports/1');
  
  // 4. Test analytics dashboard
  await testAPI('/api/analytics/dashboard');
  
  // 5. Test notifications
  await testAPI('/api/notifications/3');
  
  // 6. Test tasks
  await testAPI('/api/tasks/3');
  
  // 7. Test goals
  await testAPI('/api/goals/3');
  
  // 8. Test onboarding initiation
  await testAPI('/api/onboarding/initiate/4', 'POST', { actorId: 1, role: 'HR' });
  
  // 9. Test onboarding completion
  await testAPI('/api/onboarding/complete/3', 'POST', { actorId: 3, role: 'EMPLOYEE' });
  
  // 10. Test manager review (should fail - no pending review)
  await testAPI('/api/onboarding/review/3', 'POST', { 
    status: 'approved', 
    notes: 'Great work!', 
    goals: [{ title: 'Learn React', description: 'Complete React tutorial', target_date: '2024-02-01' }],
    managerId: 1 
  });
  
  console.log('\n🎯 Flow test completed!');
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { testAPI, runTests };
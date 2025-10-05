// Test the Cloudflare Worker locally
const worker = require('./backend/worker.js');

async function testWorker() {
  console.log('🧪 Testing Cloudflare Worker locally...\n');
  
  // Test health endpoint
  const healthRequest = new Request('http://localhost/api/health');
  const healthResponse = await worker.default.fetch(healthRequest);
  const healthData = await healthResponse.json();
  console.log('✅ Health Check:', healthData);
  
  // Test login
  const loginRequest = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@techstart.com', password: 'admin123' })
  });
  const loginResponse = await worker.default.fetch(loginRequest);
  const loginData = await loginResponse.json();
  console.log('✅ Login Test:', loginData.success ? 'SUCCESS' : 'FAILED');
  
  if (loginData.success) {
    // Test authenticated endpoint
    const dashboardRequest = new Request('http://localhost/api/dashboard/hr', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    const dashboardResponse = await worker.default.fetch(dashboardRequest);
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard Test:', dashboardData.success ? 'SUCCESS' : 'FAILED');
  }
  
  console.log('\n🎯 Worker tests completed!');
}

testWorker().catch(console.error);
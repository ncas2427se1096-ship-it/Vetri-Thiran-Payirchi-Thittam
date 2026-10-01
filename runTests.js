const app = require('../app');
const http = require('http');

let server;
const PORT = 5099;

const runTests = async () => {
  console.log('🧪 Starting AI WeatherWise Automated API Test Suite...\n');

  server = http.createServer(app);
  await new Promise(resolve => server.listen(PORT, resolve));
  const baseUrl = `http://127.0.0.1:${PORT}`;

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
      failed++;
    }
  };

  try {
    // 1. Test Health Endpoint
    console.log('1. Testing System Health & Server Connectivity:');
    const healthRes = await fetch(`${baseUrl}/api/health`).then(r => r.json());
    assert(healthRes.status === 'UP', 'Health check returns UP status');

    // 2. Test Registration & Authentication
    console.log('\n2. Testing Authentication & JWT Token Generation:');
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Runner', email: testEmail, password: 'password123' }),
    }).then(r => r.json());

    assert(regRes.success === true && Boolean(regRes.token), 'Register returns JWT token');
    const userToken = regRes.token;

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' }),
    }).then(r => r.json());

    assert(loginRes.success === true && loginRes.user.email === testEmail, 'Login succeeds with valid credentials');

    // 3. Test Weather API & Fallback Mode
    console.log('\n3. Testing Real-Time Weather & Forecast Services (with Fallback):');
    const weatherRes = await fetch(`${baseUrl}/api/weather/current?city=Paris`, {
      headers: { Authorization: `Bearer ${userToken}` },
    }).then(r => r.json());

    assert(weatherRes.success === true && weatherRes.data.locationName === 'Paris', 'Weather endpoint returns current weather data for Paris');
    assert(Array.isArray(weatherRes.data.forecastData), 'Weather response includes multi-day forecast array');

    const analyticsRes = await fetch(`${baseUrl}/api/weather/analytics?city=Tokyo`).then(r => r.json());
    assert(analyticsRes.success === true && analyticsRes.analytics.currentTemp !== undefined, 'Weather Analytics endpoint returns temperature trends');

    // 4. Test AI Insight Generation
    console.log('\n4. Testing AI Insights & Personalized Recommendations Engine:');
    const aiRes = await fetch(`${baseUrl}/api/ai/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ city: 'Tokyo', promptType: 'general' }),
    }).then(r => r.json());

    assert(aiRes.success === true && Boolean(aiRes.insights.summary), 'AI Insights endpoint returns summary');
    assert(Array.isArray(aiRes.insights.clothingRecommendations), 'AI Insights contains clothing recommendations');
    assert(Array.isArray(aiRes.insights.travelPrecautions), 'AI Insights contains travel precautions');
    assert(Array.isArray(aiRes.insights.activitySuggestions), 'AI Insights contains activity suggestions');

    // 5. Test Favorite Locations Management
    console.log('\n5. Testing Favorite Locations CRUD:');
    const addFavRes = await fetch(`${baseUrl}/api/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ locationName: 'Sydney', country: 'AU', notes: 'Beach destination' }),
    }).then(r => r.json());

    assert(addFavRes.success === true, 'Successfully added Sydney to favorites');

    const getFavRes = await fetch(`${baseUrl}/api/favorites`, {
      headers: { Authorization: `Bearer ${userToken}` },
    }).then(r => r.json());

    assert(getFavRes.success === true && getFavRes.favorites.some(f => f.locationName === 'Sydney'), 'Favorites list includes added location with live weather');

    // Summary
    console.log('\n==================================================');
    console.log(`📊 Test Suite Finished: ${passed} Passed, ${failed} Failed`);
    console.log('==================================================\n');
  } catch (error) {
    console.error('Test Suite Exception:', error);
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
};

runTests();

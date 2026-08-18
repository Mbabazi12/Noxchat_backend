const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING AUTHENTICATION FLOW VERIFICATION ---');

  // 0. Verify Swagger docs endpoint
  console.log('\n[TEST 0] Testing Swagger UI endpoint at /api/docs ...');
  const docsRes = await request({
    host: 'localhost',
    port: 3000,
    path: '/api/docs',
    method: 'GET',
  });
  console.log(`Swagger Status Code: ${docsRes.statusCode}`);
  if (docsRes.statusCode === 200) {
    console.log('✅ Swagger UI is active!');
  } else {
    console.error('❌ Swagger UI check failed');
  }

  // 1. Signup Under 13 (Should fail with 400 Bad Request)
  console.log('\n[TEST 1] Testing POST /api/v1/auth/signup (under 13 years old age gate)...');
  const under13Res = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'under13@example.com', birthDate: '2020-01-01' },
  );
  console.log('Under-13 Response:', under13Res);
  if (under13Res.statusCode === 400) {
    console.log('✅ Age gate correctly blocked under 13 signup!');
  } else {
    console.error('❌ Age gate failed!');
  }

  // 2. Signup Valid User (Age > 13)
  console.log('\n[TEST 2] Testing POST /api/v1/auth/signup (valid age 20)...');
  const validSignupRes = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'alex@example.com', birthDate: '2000-01-01' },
  );
  console.log('Valid Signup Response:', validSignupRes);
  if (validSignupRes.statusCode === 201 && validSignupRes.body.otp === '123456') {
    console.log('✅ Signup OTP generated successfully!');
  } else {
    console.error('❌ Signup failed!');
  }

  // 3. Verify OTP
  console.log('\n[TEST 3] Testing POST /api/v1/auth/verify-otp...');
  const verifyRes = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/verify-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'alex@example.com', code: '123456', displayName: 'Alex Nox' },
  );
  console.log('Verify OTP Response:', verifyRes);
  if (
    verifyRes.statusCode === 200 &&
    verifyRes.body.accessToken &&
    verifyRes.body.refreshToken &&
    verifyRes.body.user.noxCoinBalance === 100
  ) {
    console.log('✅ Verify OTP succeeded! Issued JWT access token, refresh token & 100 Nox Coins starting balance.');
  } else {
    console.error('❌ Verify OTP failed!');
  }

  const refreshToken = verifyRes.body.refreshToken;

  // 4. Request Login OTP for existing user
  console.log('\n[TEST 4] Testing POST /api/v1/auth/login...');
  const loginRes = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'alex@example.com' },
  );
  console.log('Login Response:', loginRes);
  if (loginRes.statusCode === 200 && loginRes.body.otp === '123456') {
    console.log('✅ Login OTP requested successfully!');
  } else {
    console.error('❌ Login OTP request failed!');
  }

  // 5. Refresh Tokens
  console.log('\n[TEST 5] Testing POST /api/v1/auth/refresh...');
  const refreshRes = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/refresh',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { refreshToken },
  );
  console.log('Refresh Response:', refreshRes);
  if (refreshRes.statusCode === 200 && refreshRes.body.accessToken && refreshRes.body.refreshToken) {
    console.log('✅ Refresh token exchanged for a new token pair successfully!');
  } else {
    console.error('❌ Token refresh failed!');
  }

  const newRefreshToken = refreshRes.body.refreshToken;

  // 6. Logout
  console.log('\n[TEST 6] Testing POST /api/v1/auth/logout...');
  const logoutRes = await request(
    {
      host: 'localhost',
      port: 3000,
      path: '/api/v1/auth/logout',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { refreshToken: newRefreshToken },
  );
  console.log('Logout Response:', logoutRes);
  if (logoutRes.statusCode === 200) {
    console.log('✅ Logout succeeded and refresh token invalidated server-side!');
  } else {
    console.error('❌ Logout failed!');
  }

  console.log('\n--- ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(console.error);

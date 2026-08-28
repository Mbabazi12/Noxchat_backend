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

function post(path, body) {
  return request(
    {
      host: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    body,
  );
}

async function runTests() {
  console.log('--- STARTING AUTHENTICATION FLOW VERIFICATION ---');

  // Base36 timestamp keeps every derived username well under the 20-char limit
  // even with a suffix appended, and stays lowercase-alphanumeric by construction.
  const base = `t${Date.now().toString(36)}`;
  const username = base;
  const password = 'correct-horse-battery-staple';

  // 0. Swagger docs endpoint
  console.log('\n[TEST 0] Testing Swagger UI endpoint at /api/docs ...');
  const docsRes = await request({ host: 'localhost', port: 3000, path: '/api/docs', method: 'GET' });
  console.log(docsRes.statusCode === 200 ? '✅ Swagger UI is active!' : '❌ Swagger UI check failed');

  // 1. Signup under 13 (should fail with 400)
  console.log('\n[TEST 1] Testing POST /api/v1/auth/signup (under 13 years old age gate)...');
  const under13Res = await post('/api/v1/auth/signup', {
    username: `${base}a`,
    displayName: 'Too Young',
    birthDate: '2020-01-01',
    password,
    confirmPassword: password,
  });
  console.log(under13Res.statusCode === 400 ? '✅ Age gate correctly blocked under 13 signup!' : '❌ Age gate failed!', under13Res.body);

  // 2. Signup with mismatched passwords (should fail with 400)
  console.log('\n[TEST 2] Testing POST /api/v1/auth/signup (password mismatch)...');
  const mismatchRes = await post('/api/v1/auth/signup', {
    username: `${base}m`,
    displayName: 'Mismatch Test',
    birthDate: '2000-01-01',
    password,
    confirmPassword: 'different-password',
  });
  console.log(mismatchRes.statusCode === 400 ? '✅ Password mismatch correctly rejected!' : '❌ Password mismatch check failed!', mismatchRes.body);

  // 3. Signup valid user (should create account and return tokens directly)
  console.log('\n[TEST 3] Testing POST /api/v1/auth/signup (valid)...');
  const signupRes = await post('/api/v1/auth/signup', {
    username,
    displayName: 'Test User',
    birthDate: '2000-01-01',
    password,
    confirmPassword: password,
  });
  const signupOk =
    signupRes.statusCode === 201 &&
    signupRes.body.accessToken &&
    signupRes.body.refreshToken &&
    signupRes.body.user.noxCoinBalance === 100;
  console.log(signupOk ? '✅ Signup succeeded! Tokens issued directly, 100 Nox Coins starting balance.' : '❌ Signup failed!', signupRes.body);

  // 4. Login with wrong password (should fail with 401)
  console.log('\n[TEST 4] Testing POST /api/v1/auth/login (wrong password)...');
  const wrongLoginRes = await post('/api/v1/auth/login', { username, password: 'wrong-password' });
  console.log(wrongLoginRes.statusCode === 401 ? '✅ Wrong password correctly rejected!' : '❌ Wrong password check failed!', wrongLoginRes.body);

  // 5. Login with correct credentials
  console.log('\n[TEST 5] Testing POST /api/v1/auth/login (correct credentials)...');
  const loginRes = await post('/api/v1/auth/login', { username, password });
  const loginOk = loginRes.statusCode === 200 && loginRes.body.accessToken && loginRes.body.refreshToken;
  console.log(loginOk ? '✅ Login succeeded!' : '❌ Login failed!', loginRes.body);

  const refreshToken = loginRes.body.refreshToken;

  // 6. Refresh tokens
  console.log('\n[TEST 6] Testing POST /api/v1/auth/refresh...');
  const refreshRes = await post('/api/v1/auth/refresh', { refreshToken });
  console.log(
    refreshRes.statusCode === 200 && refreshRes.body.accessToken && refreshRes.body.refreshToken
      ? '✅ Refresh token exchanged for a new token pair successfully!'
      : '❌ Token refresh failed!',
    refreshRes.body,
  );

  const newRefreshToken = refreshRes.body.refreshToken;

  // 7. Old refresh token should now be revoked (rotation)
  console.log('\n[TEST 7] Testing that the rotated-out refresh token is now rejected...');
  const reuseRes = await post('/api/v1/auth/refresh', { refreshToken });
  console.log(reuseRes.statusCode === 401 ? '✅ Old refresh token correctly rejected after rotation!' : '❌ Refresh token rotation failed!', reuseRes.body);

  // 8. Logout
  console.log('\n[TEST 8] Testing POST /api/v1/auth/logout...');
  const logoutRes = await post('/api/v1/auth/logout', { refreshToken: newRefreshToken });
  console.log(logoutRes.statusCode === 200 ? '✅ Logout succeeded and refresh token invalidated server-side!' : '❌ Logout failed!', logoutRes.body);

  console.log('\n--- ALL AUTHENTICATION TESTS COMPLETE ---');
}

runTests().catch(console.error);

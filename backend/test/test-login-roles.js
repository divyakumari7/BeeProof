const http = require('http');

function login(username, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ username, password });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 8080,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getDashboardPathForUser(loggedUser) {
  // Exact frontend AuthModal & AuthContext logic:
  const roles = Array.isArray(loggedUser.roles)
    ? loggedUser.roles
    : (loggedUser.role ? [loggedUser.role] : [loggedUser.primaryRole]);

  if (roles.includes('ADMIN_KVIC')) return '/admin';
  if (roles.includes('BEEKEEPER')) return '/beekeeper';
  if (roles.includes('PROCESSOR')) return '/processor';
  if (roles.includes('QUALITY_LAB')) return '/quality-lab';
  if (roles.includes('DISTRIBUTOR')) return '/distributor';
  return '/';
}

async function run() {
  const accounts = [
    { name: 'Beekeeper', email: 'beekeeper1@beeproof.org', expected: '/beekeeper' },
    { name: 'Processor', email: 'processor@beeproof.org', expected: '/processor' },
    { name: 'Quality Lab', email: 'lab@beeproof.org', expected: '/quality-lab' },
    { name: 'Distributor', email: 'distributor@beeproof.org', expected: '/distributor' },
    { name: 'Admin (KVIC)', email: 'admin@beeproof.org', expected: '/admin' }
  ];

  console.log('===============================================================');
  console.log('       TESTING AUTHENTICATION & REDIRECT FOR ALL 5 ROLES       ');
  console.log('===============================================================\n');

  let allOk = true;
  for (const acc of accounts) {
    const res = await login(acc.email, 'BeeProof@2026!');
    if (res.status !== 200 || !res.data.success) {
      console.error(`❌ FAILED login for ${acc.name}:`, res.data);
      allOk = false;
      continue;
    }

    const user = res.data.data.user;
    const token = res.data.data.token;
    const redirectPath = getDashboardPathForUser(user);

    const hasRolesArray = Array.isArray(user.roles) && user.roles.length > 0;
    const redirectMatches = redirectPath === acc.expected;
    const tokenValid = typeof token === 'string' && token.length > 20;

    console.log(`[${acc.name}]`);
    console.log(`  - Email: ${acc.email}`);
    console.log(`  - Role: ${user.role}`);
    console.log(`  - Roles Array: ${JSON.stringify(user.roles)} (valid array: ${hasRolesArray})`);
    console.log(`  - Primary Role: ${user.primaryRole}`);
    console.log(`  - Token Length: ${token.length} chars (valid: ${tokenValid})`);
    console.log(`  - Target Dashboard: ${redirectPath} (expected: ${acc.expected}, match: ${redirectMatches ? '✅ PASS' : '❌ FAIL'})\n`);

    if (!hasRolesArray || !redirectMatches || !tokenValid) {
      allOk = false;
    }
  }

  console.log('===============================================================');
  if (allOk) {
    console.log('🎉 ALL 5 DEMO ROLES AUTHENTICATE & REDIRECT WITH 100% SUCCESS!');
  } else {
    console.log('❌ SOME ROLES FAILED AUTHENTICATION OR REDIRECT');
    process.exit(1);
  }
  console.log('===============================================================');
}

run().catch(console.error);

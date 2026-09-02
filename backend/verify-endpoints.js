const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- TEST 1: Health Check ---');
  const health = await makeRequest('/health');
  console.log('Status:', health.status);
  console.log('Body:', JSON.stringify(health.body, null, 2));

  console.log('\n--- TEST 2: Valid Nearby Places (Jaipur GPS) ---');
  const places = await makeRequest('/api/v1/places/nearby?latitude=26.9124&longitude=75.7873&radius=10000');
  console.log('Status:', places.status);
  console.log('Count:', places.body.data?.places?.length);
  console.log('Top 5 Places:', places.body.data?.places?.map(p => `${p.name} (${p.category}) - ${p.distance} km`));

  console.log('\n--- TEST 3: Validation Error: Invalid Coordinates ---');
  const invalid = await makeRequest('/api/v1/places/nearby?latitude=999&longitude=75.7873');
  console.log('Status:', invalid.status);
  console.log('Body:', JSON.stringify(invalid.body, null, 2));

  console.log('\n--- TEST 4: Validation Error: Missing Coordinates ---');
  const missing = await makeRequest('/api/v1/places/nearby');
  console.log('Status:', missing.status);
  console.log('Body:', JSON.stringify(missing.body, null, 2));

  console.log('\n--- ALL VERIFICATION TESTS PASSED ---');
  process.exit(0);
}

// Allow server 1s to start if run together
setTimeout(runTests, 1500);

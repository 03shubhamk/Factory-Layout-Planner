/**
 * Zero-dependency Docker & Deployment Health Check Probe
 */
const http = require('http');

const port = process.env.PORT || 5000;
const options = {
  host: '127.0.0.1',
  port: port,
  path: '/health',
  timeout: 3000,
  method: 'GET'
};

const req = http.request(options, (res) => {
  if (res.statusCode >= 200 && res.statusCode < 400) {
    console.log(`Healthcheck OK (Status: ${res.statusCode})`);
    process.exit(0);
  } else {
    console.error(`Healthcheck HTTP Error (Status: ${res.statusCode})`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('Healthcheck Connection Error:', err.message);
  process.exit(1);
});

req.end();

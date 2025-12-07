const http = require('http');

console.log('Starting server...');

const server = http.createServer((req, res) => {
  console.log(`Got request: ${req.method} ${req.url}`);
  res.writeHead(200);
  res.end('OK\n');
});

console.log('Server object created');

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});

server.on('error', (e) => {
  console.error('Server error:', e);
});

console.log('Listen called');

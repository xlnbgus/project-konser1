const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../src/app');

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

function uniqueEmail(prefix = 'user') {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`;
}

test('GET /health returns success payload', async () => {
  const { server, port } = await startServer();
  try {
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/health' }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }).on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
  } finally {
    server.close();
  }
});

test('POST /api/auth/login allows direct admin login', async () => {
  const { server, port } = await startServer();
  try {
    const payload = JSON.stringify({
      email: 'admin@konserojol.com',
      password: 'Admin12345',
    });

    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.user.role, 'admin');
  } finally {
    server.close();
  }
});

test('GET /api/admin/events returns data for admin', async () => {
  const { server, port } = await startServer();
  try {
    const loginPayload = JSON.stringify({ email: 'admin@konserojol.com', password: 'Admin12345' });
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(loginPayload);
      req.end();
    });

    const { token } = JSON.parse(loginResponse.body);
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/api/admin/events', headers: { Authorization: `Bearer ${token}` } }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }).on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.events));
  } finally {
    server.close();
  }
});

test('PATCH /api/admin/orders/:id/status updates order status', async () => {
  const { server, port } = await startServer();
  try {
    const loginPayload = JSON.stringify({ email: 'admin@konserojol.com', password: 'Admin12345' });
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(loginPayload);
      req.end();
    });

    const { token } = JSON.parse(loginResponse.body);
    const checkoutPayload = JSON.stringify({ eventId: 1, quantity: 1, paymentMethod: 'debit' });
    const checkoutResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/checkout', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(checkoutPayload), Authorization: `Bearer ${token}` } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(checkoutPayload);
      req.end();
    });

    const { order } = JSON.parse(checkoutResponse.body);
    const updatePayload = JSON.stringify({ status: 'paid' });
    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: `/api/admin/orders/${order.id}/status`, method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(updatePayload), Authorization: `Bearer ${token}` } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(updatePayload);
      req.end();
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.order.status, 'paid');
  } finally {
    server.close();
  }
});

test('GET /api/admin/categories returns ticket categories for admin', async () => {
  const { server, port } = await startServer();
  try {
    const loginPayload = JSON.stringify({ email: 'admin@konserojol.com', password: 'Admin12345' });
    const loginResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(loginPayload);
      req.end();
    });

    const { token } = JSON.parse(loginResponse.body);
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/api/admin/categories', headers: { Authorization: `Bearer ${token}` } }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }).on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.categories));
  } finally {
    server.close();
  }
});

test('POST /api/auth/register creates a user', async () => {
  const { server, port } = await startServer();
  try {
    const email = uniqueEmail('budi');
    const payload = JSON.stringify({
      name: 'Budi',
      email,
      password: 'Password123',
      phone: '08123456789',
    });

    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    assert.equal(response.statusCode, 201);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.user.email, email);
  } finally {
    server.close();
  }
});

test('GET /api/promos returns available promo codes', async () => {
  const { server, port } = await startServer();
  try {
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/api/promos' }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }).on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.promos));
    assert.ok(body.promos.length > 0);
  } finally {
    server.close();
  }
});

test('GET /api/payment-methods returns supported payment options', async () => {
  const { server, port } = await startServer();
  try {
    const response = await new Promise((resolve, reject) => {
      http.get({ hostname: '127.0.0.1', port, path: '/api/payment-methods' }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }).on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.deepEqual(body.paymentMethods.map((method) => method.value), ['debit', 'bank', 'e-wallet', 'qris']);
  } finally {
    server.close();
  }
});

test('POST /api/checkout creates order summary with promo', async () => {
  const { server, port } = await startServer();
  try {
    const email = uniqueEmail('citra');
    const registerPayload = JSON.stringify({
      name: 'Citra',
      email,
      password: 'Password123',
      phone: '08111111111',
    });

    const registerResponse = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(registerPayload) } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(registerPayload);
      req.end();
    });

    const { token } = JSON.parse(registerResponse.body);
    const checkoutPayload = JSON.stringify({ eventId: 1, quantity: 2, promoCode: 'EARLYBIRD30' });

    const response = await new Promise((resolve, reject) => {
      const req = http.request(
        { hostname: '127.0.0.1', port, path: '/api/checkout', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(checkoutPayload), Authorization: `Bearer ${token}` } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
        }
      );
      req.on('error', reject);
      req.write(checkoutPayload);
      req.end();
    });

    assert.equal(response.statusCode, 201);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.order.promoCode, 'EARLYBIRD30');
    assert.ok(body.order.total < body.order.subtotal);
  } finally {
    server.close();
  }
});

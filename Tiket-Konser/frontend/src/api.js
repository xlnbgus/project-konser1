const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || 'Permintaan gagal');
  }

  return data;
}

export const authApi = {
  login: (payload) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  me: (token) => request('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};

export const checkoutApi = {
  paymentMethods: () => request('/api/payment-methods'),
  checkout: (token, payload) => request('/api/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
  }),
};

export const adminApi = {
  getOrders: (token) => request('/api/admin/orders', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  getCategories: (token) => request('/api/admin/categories', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  createCategory: (token, payload) => request('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  updateCategory: (token, id, payload) => request(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  deleteCategory: (token, id) => request(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),
  getArtists: (token) => request('/api/admin/artists', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  createArtist: (token, payload) => request('/api/admin/artists', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  updateArtist: (token, id, payload) => request(`/api/admin/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  deleteArtist: (token, id) => request(`/api/admin/artists/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),
  getAnalytics: (token) => request('/api/admin/analytics', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  getSales: (token) => request('/api/admin/sales', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  toggleSales: (token, payload) => request('/api/admin/sales', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  updateOrderStatus: (token, id, status) => request(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
    headers: { Authorization: `Bearer ${token}` },
  }),
  getEvents: (token) => request('/api/admin/events', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  createEvent: (token, payload) => request('/api/admin/events', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  updateEvent: (token, id, payload) => request(`/api/admin/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  deleteEvent: (token, id) => request(`/api/admin/events/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),
  getPromos: (token) => request('/api/admin/promos', {
    headers: { Authorization: `Bearer ${token}` },
  }),
  createPromo: (token, payload) => request('/api/admin/promos', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  updatePromo: (token, id, payload) => request(`/api/admin/promos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  }),
  deletePromo: (token, id) => request(`/api/admin/promos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }),
};

export { API_BASE_URL };
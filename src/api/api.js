const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(BASE_URL + path, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchClients() {
  const data = await request('/users');
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    phone: u.phone.split(' x')[0],
    email: u.email.toLowerCase(),
    city: u.address.city,
  }));
}

export async function syncOrders(orders) {
  return request('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ title: 'fixtrack-orders', body: JSON.stringify(orders), userId: 1 }),
  });
}

const PHONE_RE = /^\+?[0-9\s\-()]{10,18}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidDate(value) {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!m) return false;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d && y >= 2000 && y <= 2100;
}

export function formatToday() {
  const n = new Date();
  const dd = String(n.getDate()).padStart(2, '0');
  const mm = String(n.getMonth() + 1).padStart(2, '0');
  return dd + '.' + mm + '.' + n.getFullYear();
}

export function validateOrder(v) {
  const errors = {};
  if (v.client.trim().length < 2) errors.client = 'short';
  if (!PHONE_RE.test(v.phone.trim())) errors.phone = 'phone';
  if (v.device.trim().length < 2) errors.device = 'short';
  if (v.service.trim().length < 3) errors.service = 'short';
  if (!isValidDate(v.date)) errors.date = 'date';
  return errors;
}

export function validateProfile(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = 'short';
  if (!PHONE_RE.test(v.phone.trim())) errors.phone = 'phone';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'email';
  return errors;
}

export function getOrCreateDeviceToken() {
  let token = localStorage.getItem('device_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('device_token', token);
  }
  return token;
}
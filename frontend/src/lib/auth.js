export function signOut() {
  localStorage.removeItem('access_token');
  window.location.href = '/faculty';
}
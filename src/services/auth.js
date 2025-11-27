export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.roles && user.roles.includes('ROLE_ADMIN');
} 
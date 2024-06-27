export const KEY_ADMIN_TOKEN = "jwt_admin_token";
export const OAUTH_ADMIN_TOKEN = "oauth_admin_token";
export const OAUTH_ACCESS_TOKEN = "oauth_access_token";

export function getItem(key) {
  return localStorage.getItem(key);
}
export function setItem(key, value) {
  return localStorage.setItem(key, value);
}

export function removeItem(key) {
  return localStorage.removeItem(key);
}

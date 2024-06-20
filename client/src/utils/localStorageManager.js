export const KEY_ACCESS_TOKEN = "jwt_access_token";
export const GOOGLE_ACCESS_TOKEN = "google_access_token";

export function getItem(key) {
  return localStorage.getItem(key);
}
export function setItem(key, value) {
  return localStorage.setItem(key, value);
}

export function removeItem(key) {
  return localStorage.removeItem(key);
}

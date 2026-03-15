const TOKEN_KEY = "SWP391_TOKEN";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthed() {
  return !!getToken();
}

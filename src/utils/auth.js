// This is a front-end-only demo auth store. Accounts and sessions live in the
// browser's localStorage so a login "sticks" across reloads without a backend.
//
// IMPORTANT: obfuscate() is base64, not hashing — it only keeps the password
// from sitting in localStorage as literal plain text. This is NOT secure and
// must be replaced with real password hashing on a real server before this
// code handles any real user's credentials.

const USERS_KEY = "PathFinder_users";
const SESSION_KEY = "PathFinder_session";

function obfuscate(password) {
  return btoa(unescape(encodeURIComponent(password)));
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/** Reads the cached session on app start, so a returning user skips login entirely. */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Creates a new account with a role locked in for good, then caches the session.
 * Returns { session } on success or { error } on failure.
 */
export function register(name, password, role) {
  const key = name.trim().toLowerCase();
  if (!key) return { error: "Enter your name." };
  if (!password) return { error: "Enter a password." };
  if (!role) return { error: "Choose a role to continue." };

  const users = loadUsers();
  if (users[key]) {
    return { error: "An account with this name already exists — try logging in instead." };
  }

  users[key] = { name: name.trim(), password: obfuscate(password), role };
  saveUsers(users);

  const session = { name: name.trim(), role };
  persistSession(session);
  return { session };
}

/**
 * Verifies credentials against the stored account and caches the session on success.
 * Returns { session } on success or { error } on failure.
 */
export function login(name, password) {
  const key = name.trim().toLowerCase();
  const users = loadUsers();
  const user = users[key];

  if (!user || user.password !== obfuscate(password)) {
    return { error: "Name or password is incorrect." };
  }

  const session = { name: user.name, role: user.role };
  persistSession(session);
  return { session };
}

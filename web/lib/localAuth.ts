/** Простая учётка только в браузере (localStorage). Для localhost / демо, не для production. */

export type LocalUser = {
  id: string;
  username: string;
  password: string;
  createdAt: string;
};

export type LocalSession = {
  userId: string;
  username: string;
  loggedInAt: string;
};

const USERS_KEY = "kon_local_users";
const SESSION_KEY = "kon_local_session";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readUsers(): LocalUser[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (u): u is LocalUser =>
        u &&
        typeof u === "object" &&
        typeof (u as LocalUser).id === "string" &&
        typeof (u as LocalUser).username === "string" &&
        typeof (u as LocalUser).password === "string",
    );
  } catch {
    return [];
  }
}

function writeUsers(users: LocalUser[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function readLocalSession(): LocalSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as LocalSession;
    if (!s?.userId || !s?.username) return null;
    const exists = readUsers().some((u) => u.id === s.userId && u.username === s.username);
    return exists ? s : null;
  } catch {
    return null;
  }
}

function writeSession(session: LocalSession | null): void {
  if (!canUseStorage()) return;
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function registerLocalUser(username: string, password: string): { ok: true } | { ok: false; error: string } {
  const name = username.trim();
  const pass = password;

  if (name.length < 3) {
    return { ok: false, error: "Логин — минимум 3 символа" };
  }
  if (pass.length < 4) {
    return { ok: false, error: "Пароль — минимум 4 символа" };
  }

  const users = readUsers();
  if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "Такой логин уже занят" };
  }

  const user: LocalUser = {
    id: crypto.randomUUID(),
    username: name,
    password: pass,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  writeSession({ userId: user.id, username: user.username, loggedInAt: new Date().toISOString() });
  return { ok: true };
}

export function loginLocalUser(username: string, password: string): { ok: true } | { ok: false; error: string } {
  const name = username.trim();
  const user = readUsers().find((u) => u.username.toLowerCase() === name.toLowerCase());

  if (!user || user.password !== password) {
    return { ok: false, error: "Неверный логин или пароль" };
  }

  writeSession({ userId: user.id, username: user.username, loggedInAt: new Date().toISOString() });
  return { ok: true };
}

export function logoutLocalUser(): void {
  writeSession(null);
}

// ============================================
// DRESSVINTAGE — auth & permissions
// ============================================
// Roles, mock users, permission helpers, demo auth API.
// The Auth + UserStore shapes are the migration boundary:
// replace internals with fetch('/api/auth/...') without changing call sites.

// ---- Roles ----
const ROLES = {
  USER:       "user",
  ADMIN:      "admin",
  SUPERADMIN: "superadmin",
};

const ROLE_LABELS = {
  [ROLES.USER]:       "Usuario",
  [ROLES.ADMIN]:      "Admin",
  [ROLES.SUPERADMIN]: "Superadmin",
};

// ---- Mock users (initial seed; persisted in UserStore after first write) ----
const MOCK_USERS = [
  {
    id:        "usr-001",
    name:      "Demo User",
    email:     "user@dressvintage.com",
    role:      ROLES.USER,
    status:    "active",
    createdAt: "2026-05-19",
  },
  {
    id:        "usr-002",
    name:      "Admin Demo",
    email:     "admin@dressvintage.com",
    role:      ROLES.ADMIN,
    status:    "active",
    createdAt: "2026-05-19",
  },
  {
    id:        "usr-003",
    name:      "Superadmin Demo",
    email:     "superadmin@dressvintage.com",
    role:      ROLES.SUPERADMIN,
    status:    "active",
    createdAt: "2026-05-19",
  },
];

// ============================================
// PERMISSIONS — single source of truth
// ============================================
const Perms = {
  isLogged:         (u) => !!u,
  isBanned:         (u) => !!u && u.status === "banned",
  isUser:           (u) => !!u && u.role === ROLES.USER,
  isAdmin:          (u) =>
    !!u && (u.role === ROLES.ADMIN || u.role === ROLES.SUPERADMIN) && u.status !== "banned",
  isSuperadmin:     (u) =>
    !!u && u.role === ROLES.SUPERADMIN && u.status !== "banned",

  canManageProducts: (u) => Perms.isAdmin(u),
  canManageOutfits:  (u) => Perms.isSuperadmin(u),
  canManageUsers:    (u) => Perms.isSuperadmin(u),
  canManageLanding:  (u) => Perms.isSuperadmin(u),
  canManageOrders:   (u) => Perms.isAdmin(u),
  canCheckout:       (u) => !Perms.isBanned(u),
  canAccessAdmin:    (u) => Perms.isAdmin(u),
};

// ============================================
// USER STORE — localStorage CRUD
// ============================================
const _USERS_KEY = "dv-users";

const UserStore = {
  list() {
    const stored = JSON.parse(localStorage.getItem(_USERS_KEY) || "null");
    if (Array.isArray(stored) && stored.length) return stored;
    return MOCK_USERS.map(u => ({ ...u }));
  },
  save(users) {
    localStorage.setItem(_USERS_KEY, JSON.stringify(users));
  },
  get(id) {
    return UserStore.list().find(u => u.id === id) || null;
  },
  update(id, patch) {
    const list = UserStore.list();
    const i = list.findIndex(u => u.id === id);
    if (i < 0) return null;
    list[i] = { ...list[i], ...patch };
    UserStore.save(list);
    return list[i];
  },
  findByEmail(email) {
    const e = String(email || "").toLowerCase();
    return UserStore.list().find(u => u.email.toLowerCase() === e) || null;
  },
  reset() {
    localStorage.removeItem(_USERS_KEY);
  },
};

// ============================================
// AUTH — demo session API
// ============================================
const _SESSION_KEY = "dv-current-user-id";

const Auth = {
  // Login by user id (or by role — picks first user with that role from the live store)
  login(idOrRole) {
    const users = UserStore.list();
    const u = users.find(x => x.id === idOrRole) ||
              users.find(x => x.role === idOrRole);
    if (!u) return null;
    localStorage.setItem(_SESSION_KEY, u.id);
    return u;
  },
  logout() {
    localStorage.removeItem(_SESSION_KEY);
  },
  current() {
    const id = localStorage.getItem(_SESSION_KEY);
    if (!id) return null;
    return UserStore.get(id);
  },
};

// ============================================
// EXPORTS
// ============================================
Object.assign(window, {
  ROLES,
  ROLE_LABELS,
  MOCK_USERS,
  Perms,
  UserStore,
  Auth,
});

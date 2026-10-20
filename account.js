// ---------- Accounts (demo) ----------
// Accounts live in memory and are saved to this browser's localStorage. When the page runs inside the
// claude.ai viewer they are also saved to the artifact's private per-viewer database, so they follow the
// viewer across browsers and devices. Nothing is sent anywhere else.
// Card numbers are never stored in full: only brand, last 4 digits and expiry. CVVs are never stored.
const USERS_KEY = "gymbros-users";
const SESSION_KEY = "gymbros-session";

const PAY_TYPES = {
  credito: { label: "Tarjeta de crédito", kind: "card" },
  debito: { label: "Tarjeta de débito", kind: "card" },
  amex: { label: "American Express", kind: "card" },
  paypal: { label: "PayPal", kind: "wallet" },
  mercadopago: { label: "Mercado Pago", kind: "wallet" },
  regalo: { label: "Tarjeta de regalo", kind: "gift" },
};

const MX_STATES = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
  "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco",
  "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
  "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"];
const PREF_SIZES = ["S", "M", "L", "XL", "XXL"];

// ---------- Storage ----------
const DELETED_KEY = "gymbros-deleted";
const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
const localStorageWorks = (() => {
  try { localStorage.setItem("gymbros-test", "1"); localStorage.removeItem("gymbros-test"); return true; } catch { return false; }
})();

// The in-memory copy is the source of truth for this page load
const store = { users: readLocal(USERS_KEY, {}), session: readLocal(SESSION_KEY, null), deleted: readLocal(DELETED_KEY, {}) };
let remote = null; // { ref } once the viewer's private database is connected

function readJSON(key, fallback) {
  const v = key === USERS_KEY ? store.users : key === SESSION_KEY ? store.session : readLocal(key, fallback);
  return clone(v) ?? fallback;
}
function writeJSON(key, value) {
  if (key === USERS_KEY) store.users = clone(value);
  else if (key === SESSION_KEY) store.session = value;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  if (key === USERS_KEY || key === SESSION_KEY) saveRemote();
}
const getUsers = () => readJSON(USERS_KEY, {});
const sessionEmail = () => store.session;

function markDeleted(email) {
  store.deleted[email] = Date.now();
  try { localStorage.setItem(DELETED_KEY, JSON.stringify(store.deleted)); } catch { /* storage unavailable */ }
}

// Writes to the database go one at a time; a burst of changes becomes one write
let remoteBusy = false, remoteDirty = false;
async function saveRemote() {
  if (!remote) return;
  if (remoteBusy) { remoteDirty = true; return; }
  remoteBusy = true;
  try {
    do {
      remoteDirty = false;
      await remote.ref.set({ users: store.users, session: store.session, deleted: store.deleted, savedAt: Date.now() });
    } while (remoteDirty);
  } catch (e) {
    console.warn("No se pudo guardar la cuenta en la base de datos", e?.code || e);
  } finally { remoteBusy = false; }
}

// Merge two copies of the accounts: the newer copy of each account wins, deletions win over older copies
function mergeAccounts(a, b) {
  const deleted = { ...a.deleted };
  for (const [k, t] of Object.entries(b.deleted || {})) deleted[k] = Math.max(deleted[k] || 0, t);
  const users = {};
  for (const src of [a.users || {}, b.users || {}]) {
    for (const [email, u] of Object.entries(src)) {
      const have = users[email];
      if (!have || (u.updatedAt || 0) > (have.updatedAt || 0)) users[email] = u;
    }
  }
  for (const [email, t] of Object.entries(deleted)) {
    if (users[email] && (users[email].updatedAt || 0) <= t) delete users[email];
  }
  return { users, deleted };
}

async function connectRemote() {
  if (!window.claude?.use) return;
  try {
    const [db, viewer] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    const uid = db && viewer ? await viewer.id() : null;
    if (!uid) return;
    const ref = db.doc(`data/users/${uid}/gymbros`);
    const snap = await ref.get();
    const saved = snap.exists ? snap.data() : {};
    const merged = mergeAccounts(store, saved);
    store.users = merged.users;
    store.deleted = merged.deleted;
    if (!store.session && saved.session && store.users[saved.session]) store.session = saved.session;
    if (store.session && !store.users[store.session]) store.session = null;
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(store.users));
      localStorage.setItem(SESSION_KEY, JSON.stringify(store.session));
      localStorage.setItem(DELETED_KEY, JSON.stringify(store.deleted));
    } catch { /* storage unavailable */ }
    remote = { ref };
    if (JSON.stringify(saved.users || {}) !== JSON.stringify(store.users) || saved.session !== store.session) saveRemote();
    notifyAccountChange();
    if (accountDialog.open) renderAccount();
  } catch (e) {
    console.warn("Base de datos de cuentas no disponible", e?.code || e);
  }
}
const accountsSync = () => (remote ? "remote" : localStorageWorks ? "local" : "memory");

function getCurrentUser() {
  const email = sessionEmail();
  return email ? getUsers()[email] || null : null;
}
function saveCurrentUser(user) {
  user.updatedAt = Date.now();
  const users = getUsers();
  users[user.email] = user;
  writeJSON(USERS_KEY, users);
  notifyAccountChange();
}

const accountListeners = [];
function onAccountChange(fn) { accountListeners.push(fn); }
function notifyAccountChange() {
  const user = getCurrentUser();
  const initial = document.getElementById("accountInitial");
  initial.hidden = !user;
  initial.textContent = user ? user.name.trim().charAt(0).toUpperCase() : "";
  document.getElementById("accountBtn").setAttribute("aria-label", user ? `Mi cuenta (${user.name})` : "Iniciar sesión o crear cuenta");
  accountListeners.forEach((fn) => fn(user));
}

// ---------- Helpers ----------
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const normEmail = (e) => e.trim().toLowerCase();
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const digits = (s) => s.replace(/\D/g, "");

function djb2(text) {
  let h = 5381;
  for (const ch of text) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return `djb2-${h.toString(16)}`;
}
// SHA-256 where SubtleCrypto exists; a simple hash otherwise (it is marked so it can be checked later)
async function hashPassword(email, pw) {
  const text = `gymbros:${email}:${pw}`;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return djb2(text);
  }
}
// Check a password with the same method that created its hash
async function checkPassword(user, pw) {
  if (user.passHash.startsWith("djb2-")) return user.passHash === djb2(`gymbros:${user.email}:${pw}`);
  return user.passHash === await hashPassword(user.email, pw);
}

// ---------- Cards ----------
function luhn(num) {
  let sum = 0;
  [...num].reverse().forEach((d, i) => {
    let n = +d;
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return num.length >= 13 && sum % 10 === 0;
}
function cardBrand(num) {
  if (/^3[47]/.test(num)) return "American Express";
  if (/^4/.test(num)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(num)) return "Mastercard";
  return "Tarjeta";
}
// Returns an error message, or null when the card looks valid.
function validateCard(type, { holder, number, exp, cvv }, needCvv = true) {
  const num = digits(number || "");
  if (!holder || holder.trim().length < 3) return "Escribe el nombre como aparece en la tarjeta.";
  const isAmex = /^3[47]/.test(num);
  if (type === "amex" && !isAmex) return "Ese número no es de American Express (empieza con 34 o 37).";
  if (type !== "amex" && isAmex) return "Para tarjetas American Express elige la opción American Express.";
  if (num.length !== (isAmex ? 15 : 16) || !luhn(num)) return "Revisa el número de la tarjeta.";
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(exp || "");
  if (!m || +m[1] < 1 || +m[1] > 12) return "Escribe la fecha de vencimiento como MM/AA.";
  const now = new Date();
  const expEnd = new Date(2000 + +m[2], +m[1], 0, 23, 59);
  if (expEnd < now) return "Esa tarjeta ya venció.";
  if (needCvv && digits(cvv || "").length !== (isAmex ? 4 : 3)) return `El código de seguridad tiene ${isAmex ? 4 : 3} dígitos.`;
  return null;
}
function validateGift({ code, pin }) {
  const c = (code || "").replace(/[\s-]/g, "").toUpperCase();
  if (!/^[A-Z0-9]{16}$/.test(c)) return "El código de la tarjeta de regalo tiene 16 letras o números.";
  if (!/^\d{4}$/.test(pin || "")) return "El PIN tiene 4 dígitos.";
  return null;
}
function payBadge(m) {
  if (m.kind === "card") return { Visa: "VISA", Mastercard: "MC", "American Express": "AMEX" }[m.brand] || "CARD";
  return { paypal: "PP", mercadopago: "MP", regalo: "GIFT", oxxo: "OXXO" }[m.type] || "PAY";
}
function payLabel(m) {
  if (m.kind === "card") return `${m.brand} •••• ${m.last4}`;
  if (m.kind === "wallet") return `${PAY_TYPES[m.type].label} (${m.email})`;
  if (m.kind === "gift") return `Tarjeta de regalo •••• ${m.last4}`;
  return PAY_TYPES[m.type]?.label || "Método de pago";
}

// Auto-format card fields as the user types (works for any form in the page)
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.name === "number") {
    const d = digits(t.value).slice(0, 16);
    t.value = /^3[47]/.test(d) ? d.slice(0, 15).replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "))
      : d.replace(/(\d{4})(?=\d)/g, "$1 ");
  } else if (t.name === "exp") {
    const d = digits(t.value).slice(0, 4);
    t.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  } else if (t.name === "cvv" || t.name === "pin" || t.name === "cp") {
    t.value = digits(t.value).slice(0, t.name === "cp" ? 5 : 4);
  } else if (t.name === "phone") {
    t.value = digits(t.value).slice(0, 10);
  } else if (t.name === "code" && t.closest("[data-gift]")) {
    t.value = t.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 16).replace(/(.{4})(?=.)/g, "$1-");
  }
});

// Shared markup for payment-method fields (used here and in checkout)
function payFieldsHtml(type, prefix = "") {
  const kind = PAY_TYPES[type]?.kind;
  if (kind === "card") {
    const amex = type === "amex";
    return `<div class="form-grid">
      <label class="field span-2"><span>Nombre en la tarjeta</span><input name="holder" id="${prefix}holder" autocomplete="cc-name" required></label>
      <label class="field span-2"><span>Número de tarjeta</span><input name="number" id="${prefix}number" inputmode="numeric" autocomplete="cc-number" placeholder="${amex ? "3782 822463 10005" : "4242 4242 4242 4242"}" required></label>
      <label class="field"><span>Vencimiento</span><input name="exp" id="${prefix}exp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" required></label>
      <label class="field"><span>CVV</span><input name="cvv" id="${prefix}cvv" inputmode="numeric" autocomplete="cc-csc" placeholder="${amex ? "4 dígitos" : "3 dígitos"}" required></label>
    </div>`;
  }
  if (kind === "wallet") {
    return `<label class="field"><span>Correo de tu cuenta ${PAY_TYPES[type].label}</span><input name="email" id="${prefix}walletEmail" type="email" autocomplete="email" required></label>
      <p class="hint">En la tienda real te llevaríamos a ${PAY_TYPES[type].label} para autorizar el pago.</p>`;
  }
  if (kind === "gift") {
    return `<div class="form-grid" data-gift>
      <label class="field span-2"><span>Código de la tarjeta de regalo</span><input name="code" id="${prefix}giftCode" placeholder="XXXX-XXXX-XXXX-XXXX" autocomplete="off" required></label>
      <label class="field"><span>PIN</span><input name="pin" id="${prefix}giftPin" inputmode="numeric" placeholder="4 dígitos" required></label>
    </div>`;
  }
  return "";
}

// Builds a storable method from form data, or returns { error }
function methodFromForm(type, data) {
  const kind = PAY_TYPES[type].kind;
  if (kind === "card") {
    const error = validateCard(type, data, false);
    if (error) return { error };
    const num = digits(data.number);
    return { id: `pm-${Date.now().toString(36)}`, type, kind, brand: cardBrand(num), last4: num.slice(-4), exp: data.exp, holder: data.holder.trim() };
  }
  if (kind === "wallet") {
    if (!isEmail(data.email || "")) return { error: "Escribe un correo válido." };
    return { id: `pm-${Date.now().toString(36)}`, type, kind, email: normEmail(data.email) };
  }
  const error = validateGift(data);
  if (error) return { error };
  return { id: `pm-${Date.now().toString(36)}`, type, kind, last4: data.code.replace(/[\s-]/g, "").slice(-4).toUpperCase() };
}

// ---------- Dialog helpers (shared by every modal) ----------
document.addEventListener("click", (e) => {
  const closer = e.target.closest("[data-close]");
  if (closer) closer.closest("dialog")?.close();
  if (e.target instanceof HTMLDialogElement) e.target.close(); // click on backdrop
});
function setFormError(form, msg) {
  let el = form.querySelector(".form-error");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-error";
    el.setAttribute("role", "alert");
    const actions = form.querySelector(".form-actions");
    if (actions) actions.before(el); else form.append(el);
  }
  el.textContent = msg || "";
  el.hidden = !msg;
}
const formData = (form) => Object.fromEntries(new FormData(form).entries());

// ---------- Account dialog ----------
const accountDialog = document.getElementById("accountDialog");
const accountBody = document.getElementById("accountBody");
const accountTitle = document.getElementById("accountTitle");
let accountView = "login";
let confirmingDelete = false;

function openAccount(view) {
  const user = getCurrentUser();
  accountView = user ? (["profile", "payments", "orders", "settings"].includes(view) ? view : "profile") : (view === "register" ? "register" : "login");
  confirmingDelete = false;
  renderAccount();
  if (!accountDialog.open) accountDialog.showModal();
}

function renderAccount() {
  const user = getCurrentUser();
  if (!user) {
    accountTitle.textContent = accountView === "register" ? "Crear cuenta" : "Iniciar sesión";
    accountBody.innerHTML = accountView === "register" ? registerHtml() : loginHtml();
    return;
  }
  accountTitle.textContent = `Hola, ${user.name.split(" ")[0]}`;
  const tabs = [["profile", "Perfil"], ["payments", "Pagos"], ["orders", "Pedidos"], ["settings", "Configuración"]];
  accountBody.innerHTML = `
    <div class="tabs" role="tablist">${tabs.map(([id, label]) =>
      `<button type="button" role="tab" class="tab ${id === accountView ? "active" : ""}" aria-selected="${id === accountView}" data-view="${id}">${label}</button>`).join("")}</div>
    <div class="tab-panel">${{ profile: profileHtml, payments: paymentsHtml, orders: ordersHtml, settings: settingsHtml }[accountView](user)}</div>`;
}

function storageNotice() {
  const mode = accountsSync();
  if (mode === "remote") return `<p class="hint sync-ok">Tu cuenta se guarda en tu perfil de claude.ai y funciona en cualquier dispositivo.</p>`;
  if (mode === "local") return `<p class="hint">Demo: tu cuenta se guarda solo en este navegador.</p>`;
  return `<p class="notice warn">Este navegador no permite que la página guarde datos, así que tu cuenta solo durará mientras la página esté abierta.</p>`;
}

const loginHtml = () => `
  <form class="stack" id="loginForm" novalidate>
    <p class="muted">Entra para ver tus pedidos, tus métodos de pago guardados y tu perfil.</p>
    ${storageNotice()}
    <label class="field"><span>Correo electrónico</span><input name="email" id="loginEmail" type="email" autocomplete="email" required></label>
    <label class="field"><span>Contraseña</span><span class="pw-wrap"><input name="password" id="loginPassword" type="password" autocomplete="current-password" required><button type="button" class="pw-toggle" data-pw aria-label="Mostrar contraseña">Mostrar</button></span></label>
    <div class="form-actions"><button class="btn btn-primary btn-block" type="submit">Iniciar sesión</button></div>
    <p class="switch">¿No tienes cuenta? <button type="button" class="link-btn" data-view="register">Crear cuenta</button></p>
  </form>`;

const registerHtml = () => `
  <form class="stack" id="registerForm" novalidate>
    <p class="muted">Guarda tu dirección, tus métodos de pago, tu talla favorita y el historial de tus pedidos.</p>
    ${storageNotice()}
    <label class="field"><span>Nombre completo</span><input name="name" id="regName" autocomplete="name" required></label>
    <label class="field"><span>Correo electrónico</span><input name="email" id="regEmail" type="email" autocomplete="email" required></label>
    <div class="form-grid">
      <label class="field"><span>Contraseña</span><span class="pw-wrap"><input name="password" id="regPassword" type="password" autocomplete="new-password" minlength="8" required><button type="button" class="pw-toggle" data-pw aria-label="Mostrar contraseña">Mostrar</button></span></label>
      <label class="field"><span>Confirmar contraseña</span><input name="confirm" id="regConfirm" type="password" autocomplete="new-password" required></label>
    </div>
    <p class="hint">Mínimo 8 caracteres.</p>
    <label class="check"><input type="checkbox" name="newsletter" id="regNewsletter" checked> Quiero recibir novedades y mi 10% de descuento</label>
    <div class="form-actions"><button class="btn btn-primary btn-block" type="submit">Crear cuenta</button></div>
    <p class="switch">¿Ya tienes cuenta? <button type="button" class="link-btn" data-view="login">Iniciar sesión</button></p>
  </form>`;

function profileHtml(u) {
  const a = u.address || {};
  return `
  <form class="stack" id="profileForm" novalidate>
    <div class="form-grid">
      <label class="field span-2"><span>Nombre completo</span><input name="name" id="profName" value="${esc(u.name)}" autocomplete="name" required></label>
      <label class="field"><span>Correo electrónico</span><input id="profEmail" value="${esc(u.email)}" disabled></label>
      <label class="field"><span>Teléfono (10 dígitos)</span><input name="phone" id="profPhone" inputmode="tel" value="${esc(u.phone)}" autocomplete="tel"></label>
    </div>
    <fieldset class="group">
      <legend>Dirección de envío</legend>
      <div class="form-grid">
        <label class="field span-2"><span>Calle y número</span><input name="street" id="profStreet" value="${esc(a.street)}" autocomplete="address-line1"></label>
        <label class="field"><span>Colonia</span><input name="colonia" id="profColonia" value="${esc(a.colonia)}" autocomplete="address-line2"></label>
        <label class="field"><span>Código postal</span><input name="cp" id="profCp" inputmode="numeric" value="${esc(a.cp)}" autocomplete="postal-code"></label>
        <label class="field"><span>Ciudad</span><input name="city" id="profCity" value="${esc(a.city)}" autocomplete="address-level2"></label>
        <label class="field"><span>Estado</span><select name="state" id="profState"><option value="">Elige…</option>${
          MX_STATES.map((s) => `<option ${s === a.state ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      </div>
    </fieldset>
    <label class="field"><span>Talla favorita</span><select name="prefSize" id="profSize"><option value="">Sin preferencia</option>${
      PREF_SIZES.map((s) => `<option ${s === u.prefSize ? "selected" : ""}>${s}</option>`).join("")}</select></label>
    <p class="hint">La tienda elegirá esta talla por ti en la ropa.</p>
    <div class="form-actions"><button class="btn btn-primary" type="submit">Guardar perfil</button></div>
  </form>`;
}

function paymentsHtml(u) {
  const list = u.payments || [];
  return `
  <div class="stack">
    ${list.length ? `<ul class="pm-list">${list.map((m) => `
      <li class="pm" data-id="${m.id}">
        <span class="pm-icon pm-${m.type}" aria-hidden="true">${payBadge(m)}</span>
        <div class="pm-info"><strong>${esc(payLabel(m))}</strong><span class="muted">${esc(PAY_TYPES[m.type].label)}${m.exp ? ` · vence ${esc(m.exp)}` : ""}</span></div>
        <div class="pm-actions">${m.id === u.defaultPayment ? `<span class="pill">Predeterminado</span>`
          : `<button type="button" class="link-btn" data-pm="default">Predeterminar</button>`}
          <button type="button" class="link-btn danger" data-pm="remove">Eliminar</button></div>
      </li>`).join("")}</ul>` : `<p class="empty">Aún no tienes métodos de pago guardados.</p>`}
    <form class="stack add-pm" id="addPaymentForm" novalidate>
      <h4>Agregar método de pago</h4>
      <div class="pay-options">${Object.entries(PAY_TYPES).map(([id, t], i) =>
        `<label class="pay-option"><input type="radio" name="type" value="${id}" ${i === 0 ? "checked" : ""}><span>${t.label}</span></label>`).join("")}</div>
      <div id="pmFields">${payFieldsHtml("credito", "pm-")}</div>
      <p class="hint">Demo: guardamos solo la marca y los últimos 4 dígitos. No ingreses datos reales.</p>
      <div class="form-actions"><button class="btn btn-primary" type="submit">Guardar método</button></div>
    </form>
  </div>`;
}

function ordersHtml(u) {
  const orders = (u.orders || []).slice().reverse();
  if (!orders.length) return `<p class="empty">Aún no tienes pedidos. Cuando compres, aparecerán aquí.</p>`;
  return `<ul class="orders">${orders.map((o) => `
    <li class="order">
      <div class="order-head"><strong>Pedido ${esc(o.id)}</strong><span class="pill">${esc(o.status)}</span></div>
      <p class="muted">${new Date(o.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })} · ${esc(o.payment)}</p>
      <ul class="order-items">${o.items.map((i) => `<li><span>${i.qty} × ${esc(i.name)}${i.variant ? ` <span class="muted">(${esc(i.variant)})</span>` : ""}</span><span>${money(i.price * i.qty)}</span></li>`).join("")}</ul>
      ${o.discount ? `<p class="order-line"><span>Descuento (${esc(o.code)})</span><span>−${money(o.discount)}</span></p>` : ""}
      <p class="order-line"><span>Envío</span><span>${o.shipping ? money(o.shipping) : "Gratis"}</span></p>
      <p class="order-line total"><span>Total</span><span>${money(o.total)}</span></p>
    </li>`).join("")}</ul>`;
}

function settingsHtml(u) {
  const p = u.prefs || {};
  return `
  <div class="stack">
    <form class="stack" id="prefsForm">
      <h4>Notificaciones por correo</h4>
      <label class="check"><input type="checkbox" name="newsletter" id="prefNews" ${p.newsletter ? "checked" : ""}> Novedades y lanzamientos</label>
      <label class="check"><input type="checkbox" name="restock" id="prefRestock" ${p.restock ? "checked" : ""}> Avisos de reabastecimiento</label>
      <label class="check"><input type="checkbox" name="seasonal" id="prefSeasonal" ${p.seasonal ? "checked" : ""}> Ediciones limitadas, como Pumpkin Spice</label>
      <div class="form-actions"><button class="btn btn-ghost" type="submit">Guardar preferencias</button></div>
    </form>
    <form class="stack" id="passwordForm" novalidate>
      <h4>Cambiar contraseña</h4>
      <label class="field"><span>Contraseña actual</span><input name="current" id="pwCurrent" type="password" autocomplete="current-password" required></label>
      <div class="form-grid">
        <label class="field"><span>Nueva contraseña</span><input name="next" id="pwNext" type="password" autocomplete="new-password" required></label>
        <label class="field"><span>Confirmar</span><input name="confirm" id="pwConfirm" type="password" autocomplete="new-password" required></label>
      </div>
      <div class="form-actions"><button class="btn btn-ghost" type="submit">Cambiar contraseña</button></div>
    </form>
    <div class="danger-zone">
      <button type="button" class="btn btn-ghost" data-action="logout">Cerrar sesión</button>
      ${confirmingDelete
        ? `<p class="form-error">Se borrarán tu perfil, tus pagos y tus pedidos. Esto no se puede deshacer.</p>
           <div class="row"><button type="button" class="btn btn-danger" data-action="delete-confirm">Sí, eliminar mi cuenta</button>
           <button type="button" class="btn btn-ghost" data-action="delete-cancel">Cancelar</button></div>`
        : `<button type="button" class="link-btn danger" data-action="delete">Eliminar mi cuenta</button>`}
    </div>
  </div>`;
}

// ---------- Account events ----------
accountBody.addEventListener("click", (e) => {
  const pw = e.target.closest("[data-pw]");
  if (pw) {
    const input = pw.previousElementSibling;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    pw.textContent = show ? "Ocultar" : "Mostrar";
    pw.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
    return;
  }
  const viewBtn = e.target.closest("[data-view]");
  if (viewBtn) { accountView = viewBtn.dataset.view; confirmingDelete = false; renderAccount(); return; }

  const pmBtn = e.target.closest("[data-pm]");
  if (pmBtn) {
    const user = getCurrentUser();
    const id = pmBtn.closest(".pm").dataset.id;
    if (pmBtn.dataset.pm === "default") user.defaultPayment = id;
    if (pmBtn.dataset.pm === "remove") {
      user.payments = user.payments.filter((m) => m.id !== id);
      if (user.defaultPayment === id) user.defaultPayment = user.payments[0]?.id || null;
      toast("Método de pago eliminado");
    }
    saveCurrentUser(user);
    renderAccount();
    return;
  }

  const action = e.target.closest("[data-action]")?.dataset.action;
  if (action === "logout") {
    writeJSON(SESSION_KEY, null);
    notifyAccountChange();
    accountDialog.close();
    toast("Cerraste sesión");
  } else if (action === "delete") { confirmingDelete = true; renderAccount(); }
  else if (action === "delete-cancel") { confirmingDelete = false; renderAccount(); }
  else if (action === "delete-confirm") {
    const users = getUsers();
    markDeleted(sessionEmail());
    delete users[sessionEmail()];
    writeJSON(USERS_KEY, users);
    writeJSON(SESSION_KEY, null);
    notifyAccountChange();
    accountDialog.close();
    toast("Tu cuenta fue eliminada");
  }
});

accountBody.addEventListener("change", (e) => {
  if (e.target.name === "type" && e.target.closest("#addPaymentForm")) {
    document.getElementById("pmFields").innerHTML = payFieldsHtml(e.target.value, "pm-");
  }
});

accountBody.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = formData(form);

  if (form.id === "loginForm" || form.id === "registerForm") await waitForAccounts();

  if (form.id === "loginForm") {
    const email = normEmail(data.email || "");
    if (!isEmail(email)) return setFormError(form, "Escribe un correo válido.");
    const user = getUsers()[email];
    if (!user) {
      return setFormError(form, accountsSync() === "remote"
        ? "No hay una cuenta con ese correo. Revisa que esté bien escrito o crea una cuenta."
        : "No hay una cuenta con ese correo en este navegador. Las cuentas de esta demo se guardan en el navegador donde las creaste: si la creaste en otro navegador, otro dispositivo o abriendo la página de otra forma, entra desde ahí o crea una nueva.");
    }
    if (!(await checkPassword(user, data.password || ""))) {
      return setFormError(form, "La contraseña no es correcta. Toca \"Mostrar\" para revisar lo que escribiste.");
    }
    writeJSON(SESSION_KEY, email);
    notifyAccountChange();
    toast(`¡Hola de nuevo, ${user.name.split(" ")[0]}!`);
    accountView = "profile";
    renderAccount();
  }

  if (form.id === "registerForm") {
    const email = normEmail(data.email || "");
    if ((data.name || "").trim().length < 2) return setFormError(form, "Escribe tu nombre.");
    if (!isEmail(email)) return setFormError(form, "Escribe un correo válido.");
    if (getUsers()[email]) return setFormError(form, "Ya existe una cuenta con ese correo. Inicia sesión.");
    if ((data.password || "").length < 8) return setFormError(form, "La contraseña debe tener al menos 8 caracteres.");
    if (data.password !== data.confirm) return setFormError(form, "Las contraseñas no coinciden.");
    const user = {
      name: data.name.trim(), email, passHash: await hashPassword(email, data.password), phone: "", address: {},
      prefSize: "", prefs: { newsletter: !!data.newsletter, restock: false, seasonal: !!data.newsletter },
      payments: [], defaultPayment: null, orders: [], createdAt: new Date().toISOString(), updatedAt: Date.now(),
    };
    delete store.deleted[email];
    const users = getUsers();
    users[email] = user;
    writeJSON(USERS_KEY, users);
    writeJSON(SESSION_KEY, email);
    notifyAccountChange();
    toast(`¡Bienvenido a GYM BRO'S, ${user.name.split(" ")[0]}!`);
    accountView = "profile";
    renderAccount();
  }

  if (form.id === "profileForm") {
    const user = getCurrentUser();
    if ((data.name || "").trim().length < 2) return setFormError(form, "Escribe tu nombre.");
    if (data.phone && data.phone.length !== 10) return setFormError(form, "El teléfono debe tener 10 dígitos.");
    if (data.cp && data.cp.length !== 5) return setFormError(form, "El código postal tiene 5 dígitos.");
    user.name = data.name.trim();
    user.phone = data.phone;
    user.address = { street: data.street.trim(), colonia: data.colonia.trim(), cp: data.cp, city: data.city.trim(), state: data.state };
    user.prefSize = data.prefSize;
    saveCurrentUser(user);
    setFormError(form, "");
    toast("Perfil guardado");
    renderAccount();
  }

  if (form.id === "addPaymentForm") {
    const user = getCurrentUser();
    const method = methodFromForm(data.type, data);
    if (method.error) return setFormError(form, method.error);
    user.payments = [...(user.payments || []), method];
    if (!user.defaultPayment) user.defaultPayment = method.id;
    saveCurrentUser(user);
    toast(`Método de pago guardado: ${payLabel(method)}`);
    renderAccount();
  }

  if (form.id === "prefsForm") {
    const user = getCurrentUser();
    user.prefs = { newsletter: !!data.newsletter, restock: !!data.restock, seasonal: !!data.seasonal };
    saveCurrentUser(user);
    toast("Preferencias guardadas");
  }

  if (form.id === "passwordForm") {
    const user = getCurrentUser();
    if (!(await checkPassword(user, data.current || ""))) return setFormError(form, "La contraseña actual no es correcta.");
    if ((data.next || "").length < 8) return setFormError(form, "La nueva contraseña debe tener al menos 8 caracteres.");
    if (data.next !== data.confirm) return setFormError(form, "Las contraseñas nuevas no coinciden.");
    user.passHash = await hashPassword(user.email, data.next);
    saveCurrentUser(user);
    form.reset();
    setFormError(form, "");
    toast("Contraseña actualizada");
  }
});

document.getElementById("accountBtn").addEventListener("click", () => openAccount());
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-account]");
  if (link) openAccount(link.dataset.account);
});

notifyAccountChange();
// Login and sign-up wait (briefly) for the saved accounts to arrive from the database
const remoteReady = connectRemote();
const waitForAccounts = () => Promise.race([remoteReady, new Promise((r) => setTimeout(r, 4000))]);

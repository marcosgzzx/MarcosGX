// ---------- Single-use discount codes ----------
// Every newsletter sign-up and every new account gets its own random 10% code that works once, ever.
// Inside the claude.ai viewer the codes live in the artifact's shared database ("promo/<CODE>"), so a code
// used anywhere is used everywhere; elsewhere they fall back to this browser's localStorage.
const PROMO_PERCENT = 10;
const PROMO_KEY = "gymbros-codes";
const NEWSLETTER_KEY = "gymbros-newsletter";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I to avoid typos

const promoDb = window.claude?.use ? window.claude.use("db").catch(() => null) : Promise.resolve(null);
const promoDbReady = () => Promise.race([promoDb, new Promise((r) => setTimeout(() => r(null), 4000))]);

const normCode = (c) => (c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function formatCode(raw) {
  const c = normCode(raw);
  return c.startsWith("BROS") && c.length === 12 ? `BROS-${c.slice(4, 8)}-${c.slice(8)}` : c;
}
function randomCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `BROS-${chars.slice(0, 4)}-${chars.slice(4)}`;
}
const docIdFor = (code) => normCode(code); // e.g. BROSAB12CD34

const localCodes = () => readLocal(PROMO_KEY, {});
function saveLocalCodes(codes) {
  try { localStorage.setItem(PROMO_KEY, JSON.stringify(codes)); } catch { /* storage unavailable */ }
}

// Creates and registers a new unused code. source: "newsletter" | "cuenta"
async function createPromoCode(source) {
  const db = await promoDbReady();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const rec = { code, percent: PROMO_PERCENT, source, used: false, createdAt: Date.now() };
    if (db) {
      const ref = db.doc(`promo/${docIdFor(code)}`);
      if ((await ref.get()).exists) continue; // astronomically rare collision: try another
      await ref.set(rec);
    } else {
      const codes = localCodes();
      if (codes[docIdFor(code)]) continue;
      codes[docIdFor(code)] = rec;
      saveLocalCodes(codes);
    }
    return code;
  }
  throw new Error("No se pudo generar un código");
}

// { ok: true, percent } or { ok: false, reason: "missing" | "used" }
async function checkPromoCode(code) {
  const id = docIdFor(code);
  if (!/^BROS[A-Z0-9]{8}$/.test(id)) return { ok: false, reason: "missing" };
  const db = await promoDbReady();
  const rec = db ? ((await db.doc(`promo/${id}`).get()).data()) : localCodes()[id];
  if (!rec) return { ok: false, reason: "missing" };
  if (rec.used) return { ok: false, reason: "used" };
  return { ok: true, percent: rec.percent || PROMO_PERCENT };
}

// Marks a code used for an order. Holds a short lease so two orders can't use the same code at once.
async function redeemPromoCode(code, orderId) {
  const id = docIdFor(code);
  const db = await promoDbReady();
  if (!db) {
    const codes = localCodes();
    if (!codes[id] || codes[id].used) return false;
    codes[id] = { ...codes[id], used: true, usedAt: Date.now(), order: orderId };
    saveLocalCodes(codes);
    return true;
  }
  const ref = db.doc(`promo/${id}`);
  const lease = await ref.acquire({ holder: `${orderId}-${Math.random().toString(36).slice(2)}`, ttlMs: 5000 });
  if (!lease.acquired) return false;
  const snap = await ref.get();
  if (!snap.exists || snap.data().used) return false;
  await ref.update({ used: true, usedAt: Date.now(), order: orderId });
  return true;
}

// Newsletter: one code per email. Emails are stored only as a hash.
async function emailKey(email) {
  const text = `gymbros-news:${normEmail(email)}`;
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return djb2(text).replace("djb2-", "h");
  }
}
// { code } for a new subscriber, or { already: true } if this email already got its code
async function subscribeNewsletter(email) {
  const key = await emailKey(email);
  const db = await promoDbReady();
  if (db) {
    const ref = db.doc(`newsletter/${key}`);
    if ((await ref.get()).exists) return { already: true };
    const code = await createPromoCode("newsletter");
    await ref.set({ subscribedAt: Date.now() });
    return { code };
  }
  const subs = readLocal(NEWSLETTER_KEY, {});
  if (subs[key]) return { already: true };
  const code = await createPromoCode("newsletter");
  subs[key] = Date.now();
  try { localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs)); } catch { /* storage unavailable */ }
  return { code };
}

// Copy buttons for codes anywhere on the page
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    toast(`Código ${btn.dataset.copy} copiado`);
  } catch {
    const code = btn.parentElement.querySelector(".promo-code");
    if (code) getSelection().selectAllChildren(code);
    toast("Selecciona el código para copiarlo");
  }
});
const promoChip = (code) =>
  `<span class="promo"><strong class="promo-code">${code}</strong><button type="button" class="link-btn" data-copy="${code}">Copiar</button></span>`;

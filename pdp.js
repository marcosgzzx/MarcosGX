// ---------- Wishlist ----------
const WISH_KEY = "gymbros-wishlist";
let wishlist = (() => { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch { return []; } })()
  .filter((id) => products.some((p) => p.id === id));

function saveWishlist() {
  try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch { /* storage unavailable */ }
  document.getElementById("wishCount").textContent = wishlist.length;
  document.getElementById("wishCount").hidden = !wishlist.length;
}
function heartHtml(p) {
  const on = wishlist.includes(p.id);
  return `<button type="button" class="heart${on ? " on" : ""}" data-wish="${p.id}" aria-pressed="${on}" aria-label="${on ? "Quitar de" : "Agregar a"} favoritos: ${p.name}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-8.6C1.2 8.3 3 4.5 6.6 4.5c2 0 3.4 1.1 4.4 2.6 1-1.5 2.4-2.6 4.4-2.6 3.6 0 5.4 3.8 3.8 6.9C19 15.6 12 20 12 20z"/></svg>
  </button>`;
}
function toggleWish(id) {
  const p = products.find((x) => x.id === id);
  const on = !wishlist.includes(id);
  wishlist = on ? [...wishlist, id] : wishlist.filter((x) => x !== id);
  saveWishlist();
  document.querySelectorAll(`[data-wish="${id}"]`).forEach((b) => {
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", `${on ? "Quitar de" : "Agregar a"} favoritos: ${p.name}`);
  });
  toast(on ? `Guardado en favoritos: ${p.name}` : "Quitado de favoritos");
  if (wishDialog.open) renderWishlist();
}

const wishDialog = document.getElementById("wishDialog");
function renderWishlist() {
  const body = document.getElementById("wishBody");
  body.innerHTML = wishlist.length ? `<ul class="wish-list">${wishlist.map((id) => {
    const p = products.find((x) => x.id === id), sel = selection[id] || {};
    return `<li><span class="co-thumb">${media(p, { ...sel, color: sel.color || p.colors?.[0], slide: 0 })}</span>
      <span class="co-name"><strong>${p.name}</strong><span class="muted">${BRANDS[p.brand].name} · desde ${money(priceOf(p, sel))}</span></span>
      <span class="wish-actions"><button type="button" class="btn btn-ghost" data-open="${id}">Ver</button>
      <button type="button" class="link-btn danger" data-wish="${id}">Quitar</button></span></li>`;
  }).join("")}</ul>` : `<p class="empty">Aún no tienes favoritos. Toca el ♥ de un producto para guardarlo.</p>`;
}
document.getElementById("wishBtn").addEventListener("click", () => { renderWishlist(); wishDialog.showModal(); });

// ---------- Product page ----------
const pdpDialog = document.getElementById("pdpDialog");
const pdpBody = document.getElementById("pdpBody");

const REVIEWS_KEY = "gymbros-reviews";
const localReviews = () => { try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || {}; } catch { return {}; } };
// Reviews are shared through the artifact database when available, else kept in this browser
async function loadReviews(id) {
  const db = await promoDbReady();
  if (db) {
    const snap = await db.doc(`reviews/${id}`).get().catch(() => null);
    return snap?.exists ? snap.data().items || [] : [];
  }
  return localReviews()[id] || [];
}
async function addReview(id, review) {
  const db = await promoDbReady();
  if (db) {
    const ref = db.doc(`reviews/${id}`);
    const snap = await ref.get();
    const items = [...(snap.exists ? snap.data().items || [] : []), review].slice(-100);
    await ref.set({ items });
    return;
  }
  const all = localReviews();
  all[id] = [...(all[id] || []), review].slice(-100);
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(all)); } catch { /* storage unavailable */ }
}
const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

function relatedOf(p) {
  const score = (q) => (q.category === p.category ? 2 : 0) + (q.gender && q.gender === p.gender ? 1 : 0) + (q.brand === p.brand ? 1 : 0);
  return products.filter((q) => q.id !== p.id).sort((a, b) => score(b) - score(a)).slice(0, 3);
}

function detailsHtml(p) {
  const rows = [
    ["Marca", BRANDS[p.brand].name],
    p.gender && ["Para", GENDERS[p.gender]],
    p.colors && ["Colores", p.colors.map((c) => COLORS[c].name).join(", ")],
    p.sizes && [p.sizeLabel || "Tallas", p.sizes.map((x) => (p.soldOut || []).includes(x) ? `${x} (agotada)` : x).join(", ")],
    p.packs && [p.packLabel || "Tamaños", p.packs.map((k) => k.name).join(", ")],
    p.flavors && ["Sabores", p.flavors.map((f) => f.name + (f.limited ? " (edición limitada)" : "")).join(", ")],
    p.sizePricing && ["Precio", `El precio mostrado es el de la talla ${p.sizePricing.base}; cambia ${money(p.sizePricing.step)} por talla.`],
    ["Envío", `Gratis desde ${money(FREE_SHIP)}. Devoluciones en 30 días.`],
  ].filter(Boolean);
  return `<dl class="pdp-details">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`;
}

async function openProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  if (!selection[id]) { renderGrid(); }
  document.getElementById("pdpTitle").textContent = `${BRANDS[p.brand].name} · ${p.name}`;
  pdpBody.innerHTML = cardHtml(p, 0, { pdp: true, extra: detailsHtml(p) }) + `
    <section class="pdp-section">
      <h4>Opiniones</h4>
      <div id="pdpReviews"><p class="muted">Cargando opiniones…</p></div>
      <form class="stack review-form" id="reviewForm" novalidate>
        <div class="rating" role="radiogroup" aria-label="Calificación">${[1, 2, 3, 4, 5].map((n) =>
          `<label><input type="radio" name="rating" value="${n}" ${n === 5 ? "checked" : ""}><span aria-hidden="true">★</span><span class="sr-only">${n} estrellas</span></label>`).join("")}</div>
        <label class="field"><span>Tu nombre</span><input name="name" id="reviewName" maxlength="40" value="${esc(getCurrentUser()?.name.split(" ")[0] || "")}" required></label>
        <label class="field"><span>Tu opinión</span><textarea name="text" id="reviewText" rows="3" maxlength="600" required></textarea></label>
        <div class="form-actions"><button class="btn btn-ghost" type="submit">Publicar opinión</button></div>
      </form>
    </section>
    <section class="pdp-section">
      <h4>También te puede gustar</h4>
      <div class="related">${relatedOf(p).map((q) => `<button type="button" class="related-card" data-open="${q.id}">
        <span class="related-media">${media(q, { ...(selection[q.id] || {}), color: selection[q.id]?.color || q.colors?.[0], slide: 0 })}</span>
        <span class="related-name">${q.name}</span><span class="muted">${BRANDS[q.brand].name} · ${money(priceOf(q, selection[q.id] || {}))}</span>
      </button>`).join("")}</div>
    </section>`;
  pdpBody.scrollTop = 0;
  if (!pdpDialog.open) pdpDialog.showModal();
  renderReviews(id);
}

async function renderReviews(id) {
  const box = document.getElementById("pdpReviews");
  const items = await loadReviews(id).catch(() => []);
  if (!box.isConnected || pdpBody.querySelector(".card")?.dataset.id !== id) return;
  if (!items.length) { box.innerHTML = `<p class="muted">Aún no hay opiniones. Sé el primero en opinar.</p>`; return; }
  const avg = items.reduce((s, r) => s + r.rating, 0) / items.length;
  box.innerHTML = `<p class="rating-avg"><span class="stars">${stars(Math.round(avg))}</span> ${avg.toFixed(1)} de 5 · ${items.length} opinion${items.length === 1 ? "" : "es"}</p>
    <ul class="reviews">${items.slice().reverse().map((r) => `<li><p><span class="stars">${stars(r.rating)}</span> <strong>${esc(r.name)}</strong>
      <span class="muted">${new Date(r.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</span></p><p>${esc(r.text)}</p></li>`).join("")}</ul>`;
}

pdpBody.addEventListener("click", (e) => {
  if (e.target.closest("[data-open]")) return; // handled below
  onCardClick(e);
});
pdpBody.addEventListener("submit", async (e) => {
  if (e.target.id !== "reviewForm") return;
  e.preventDefault();
  const form = e.target, data = formData(form);
  const id = pdpBody.querySelector(".card").dataset.id;
  if ((data.name || "").trim().length < 2) return setFormError(form, "Escribe tu nombre.");
  if ((data.text || "").trim().length < 5) return setFormError(form, "Escribe tu opinión.");
  const btn = form.querySelector("button[type=submit]"); btn.disabled = true;
  try {
    await addReview(id, { name: data.name.trim(), text: data.text.trim(), rating: Math.min(5, Math.max(1, +data.rating || 5)), date: new Date().toISOString() });
    form.reset(); setFormError(form, "");
    toast("¡Gracias por tu opinión!");
    renderReviews(id);
  } catch { setFormError(form, "No pudimos publicar tu opinión. Intenta de nuevo."); }
  finally { btn.disabled = false; }
});
pdpDialog.addEventListener("close", () => renderGrid());

// Open buttons and hearts anywhere on the page (cards, wishlist, related, search, assistant)
document.addEventListener("click", (e) => {
  const wish = e.target.closest("[data-wish]");
  if (wish) { e.stopPropagation(); toggleWish(wish.dataset.wish); return; }
  const open = e.target.closest("[data-open]");
  if (open) {
    wishDialog.open && wishDialog.close();
    openProduct(open.dataset.open);
    return;
  }
  // tapping a product photo in the grid opens its page
  const photo = e.target.closest("#productGrid .card-media");
  if (photo && !e.target.closest("button")) openProduct(photo.closest(".card").dataset.id);
}, true);

saveWishlist();
renderGrid();

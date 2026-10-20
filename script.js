// ---------- Product art (inline SVG for apparel; supplements use product photos) ----------
const art = {
  tee: (c) => `<svg viewBox="0 0 100 100"><path fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round" d="M36 14l-20 9-10 20 13 6 6-9v46h50V40l6 9 13-6-10-20-20-9c-2 6-8 10-14 10s-12-4-14-10z"/></svg>`,
  shorts: (c) => `<svg viewBox="0 0 100 100"><path fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round" d="M18 18h64l8 62-32 4-8-34-8 34-32-4z"/><path d="M18 26h64" stroke="rgba(0,0,0,.35)" stroke-width="2"/><path d="M47 30l3 4 3-4" fill="none" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/></svg>`,
  socks: (c) => `<svg viewBox="0 0 100 100"><g stroke="rgba(0,0,0,.35)" stroke-width="1.5" stroke-linejoin="round"><path fill="${c}" opacity=".7" d="M44 10h22v44c0 10 2 14 10 18s8 18-4 20-30-6-34-14-2-14 6-20z"/><path fill="${c}" d="M30 14h22v44c0 10 2 14 10 18s8 18-4 20-30-6-34-14-2-14 6-20z"/><path fill="rgba(0,0,0,.25)" d="M30 14h22v8H30z"/></g></svg>`,
};

// ---------- Catalog ----------
const COLORS = {
  black: { name: "Negro", hex: "#1c1c1c" },
  bone: { name: "Hueso", hex: "#e9e3d5" },
  lime: { name: "Neón", hex: "#d4ff3a" },
  grey: { name: "Gris jaspeado", hex: "#8d8d8d" },
  navy: { name: "Azul marino", hex: "#22304f" },
  olive: { name: "Olivo", hex: "#5d6340" },
  white: { name: "Blanco", hex: "#f7f7f5" },
  "negro-azul": { name: "Negro/Azul", hex: "linear-gradient(135deg, #111 50%, #1d9c95 50%)" },
  "negro-rojo": { name: "Negro/Rojo", hex: "linear-gradient(135deg, #111 50%, #b3141e 50%)" },
};
const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];

// Apparel brand names and prices are placeholders: swap in the real brands GYM BRO'S stocks.
// Prices are in Mexican pesos (MXN). A flavor can override its product's price.
const BRANDS = {
  gymshark: { name: "Gymshark", kind: "Ropa", blurb: "Playeras de entrenamiento sin costuras, corte muscle fit." },
  ironclad: { name: "Ironclad Athletics", kind: "Ropa", blurb: "Playeras de algodón grueso hechas para el gym." },
  northlift: { name: "Northlift", kind: "Ropa", blurb: "Shorts elásticos y playeras de entrenamiento." },
  repsupply: { name: "Rep Supply Co.", kind: "Ropa", blurb: "Calcetas acolchadas que no se bajan." },
  birdman: { name: "Birdman", kind: "Suplementos", blurb: "Proteína vegetal Falcon y creatina monohidratada." },
};

const products = [
  { id: "gymshark-onyx-5", brand: "gymshark", name: "Onyx 5.0 Seamless Muscle Fit", category: "tees", price: 1450, tag: "Nuevo",
    desc: "Playera sin costuras de corte muscle fit, entallada al cuerpo.",
    colors: ["negro-azul", "negro-rojo"], sizes: APPAREL_SIZES,
    packLabel: "Manga", packs: [{ name: "Manga corta", price: 1450 }, { name: "Manga larga", price: 1600 }],
    // Photo per color and sleeve length
    photos: {
      "negro-azul": { "Manga corta": "assets/products/gymshark-onyx-negro-azul-corta.webp",
                      "Manga larga": "assets/products/gymshark-onyx-negro-azul-larga.webp" },
      "negro-rojo": { "Manga corta": "assets/products/gymshark-onyx-negro-rojo-corta.webp",
                      "Manga larga": "assets/products/gymshark-onyx-negro-rojo-larga.webp" },
    } },
  { id: "ironclad-essential-tee", brand: "ironclad", name: "Playera Essential", category: "tees", price: 599, art: "tee", tag: "Más vendido",
    desc: "Algodón grueso de 240 g/m². Corte atlético, talla normal.",
    colors: ["black", "bone", "grey", "lime"], sizes: APPAREL_SIZES },
  { id: "ironclad-pump-cover", brand: "ironclad", name: "Playera Oversized Pump Cover", category: "tees", price: 699, art: "tee",
    desc: "Corte holgado con hombro caído para calentar. Talla grande.",
    colors: ["grey", "black", "olive"], sizes: APPAREL_SIZES },
  { id: "northlift-dry-tee", brand: "northlift", name: "Playera de entrenamiento DryLift", category: "tees", price: 649, art: "tee", tag: "Nuevo",
    desc: "Tejido ligero que absorbe el sudor. Corte slim, talla normal.",
    colors: ["navy", "black", "white"], sizes: APPAREL_SIZES },
  { id: "northlift-short-5", brand: "northlift", name: 'Short de entrenamiento 5"', category: "shorts", price: 799, art: "shorts",
    desc: "Elástico en 4 direcciones, con licra interior y bolsillo con cierre para el celular.",
    colors: ["black", "navy", "olive"], sizes: APPAREL_SIZES },
  { id: "northlift-short-7", brand: "northlift", name: 'Short de pesas 7"', category: "shorts", price: 849, art: "shorts",
    desc: "Entrepierna reforzada para sentadillas, tela que absorbe el sudor y espacio para las piernas.",
    colors: ["grey", "black", "lime"], sizes: APPAREL_SIZES },
  { id: "repsupply-crew-3", brand: "repsupply", name: "Calcetas Crew, paquete de 3", category: "socks", price: 349, art: "socks",
    desc: "Planta acolchada, soporte en el arco y puño que no se baja.",
    colors: ["white", "black", "lime"], sizes: ["S/M", "L/XL"] },
  { id: "birdman-falcon-performance", brand: "birdman", name: "Falcon Performance", category: "protein", alsoIn: ["creatine"],
    price: 1053, tag: "Proteína + Creatina",
    desc: "Proteína vegetal con creatina. Por porción de 46 g:",
    // Each pack size has its own price; flavor photos are keyed by pack.
    packs: [{ name: "Lata 1140 g", price: 1053 }, { name: "Bolsa 1.9 kg", price: 1355 }],
    flavors: [
      { name: "Choco Bronze", facts: ["30 g proteína", "5 g creatina", "5.5 g BCAAs"],
        img: { "Lata 1140 g": "assets/products/falcon-performance-choco-bronze.webp",
               "Bolsa 1.9 kg": "assets/products/falcon-performance-1-9kg-choco-bronze.webp" } },
      { name: "Golden Vanilla", facts: ["30 g proteína", "5 g creatina", "5.6 g BCAAs"],
        img: { "Lata 1140 g": "assets/products/falcon-performance-golden-vanilla.webp",
               "Bolsa 1.9 kg": "assets/products/falcon-performance-1-9kg-golden-vanilla.webp" } },
    ] },
  { id: "birdman-falcon-vegetal", brand: "birdman", name: "Falcon Proteína Vegetal · 480 g", category: "protein",
    price: 480, tag: "Proteína vegetal",
    desc: "Proteína vegetal con 0 g de azúcar añadida. Por porción de 32 g:",
    flavors: [
      { name: "Vainilla", img: "assets/products/falcon-vegetal-vainilla.webp", facts: ["24 g proteína", "119 calorías", "5 ingredientes"] },
      { name: "Natural", img: "assets/products/falcon-vegetal-natural.webp", facts: ["25 g proteína", "119 calorías", "3 ingredientes"] },
      { name: "Chocolate", img: "assets/products/falcon-vegetal-chocolate.webp", facts: ["23 g proteína", "118 calorías", "6 ingredientes"] },
      { name: "Fresa", img: "assets/products/falcon-vegetal-fresa.webp", facts: ["23 g proteína", "118 calorías", "5 ingredientes"] },
      { name: "Pumpkin Spice", img: "assets/products/falcon-vegetal-pumpkin-spice.webp", facts: ["23 g proteína", "117 calorías", "4 ingredientes"], price: 600,
        limited: "Edición especial limitada: solo disponible en otoño." },
    ] },
  { id: "birdman-creatina", brand: "birdman", name: "Creatina Monohidratada · 450 g", category: "creatine",
    price: 450, tag: "Performance Series",
    desc: "Creatina monohidratada en polvo, micronizada y de alta pureza.",
    flavors: [{ name: "Sin saborizantes", img: "assets/products/birdman-creatina-450g.webp",
      facts: ["Micronizada", "Alta pureza", "CreaClean®"] }] },
];

const GROUPS = { apparel: ["tees", "shorts", "socks"], supplements: ["protein", "creatine"] };
const FREE_SHIP = 1000;
const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const money = (n) => mxn.format(n);
const packOf = (p, sel) => p.packs && (p.packs.find((k) => k.name === sel.pack) || p.packs[0]);
const priceOf = (p, sel) => (p.flavors && flavorOf(p, sel).price) || packOf(p, sel)?.price || p.price;

// ---------- State ----------
const selection = {}; // product id -> { color, size, flavor }
let cart = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem("gymbros-cart")) || [];
    return saved.filter((i) => products.some((p) => p.id === i.id));
  } catch { return []; }
}
function save() {
  try { localStorage.setItem("gymbros-cart", JSON.stringify(cart)); } catch { /* storage unavailable */ }
}

// ---------- Product grid ----------
const grid = document.getElementById("productGrid");

function media(p, sel) {
  if (p.photos) {
    const pack = packOf(p, sel);
    return `<img class="media photo" src="${p.photos[sel.color][pack.name]}" alt="${p.name}, ${COLORS[sel.color].name}, ${pack.name}">`;
  }
  if (!p.colors) {
    const f = flavorOf(p, sel);
    const pack = packOf(p, sel);
    const src = pack ? f.img[pack.name] : f.img;
    return `<img class="media photo" src="${src}" alt="${[p.name, pack?.name, f.name].filter(Boolean).join(", ")}">`;
  }
  return art[p.art](COLORS[sel.color].hex).replace("<svg", '<svg class="media"');
}

function flavorOf(p, sel) {
  return p.flavors.find((f) => f.name === sel.flavor) || p.flavors[0];
}

function factsHtml(p, sel) {
  if (!p.flavors) return "";
  const f = flavorOf(p, sel);
  return `<div class="card-facts-wrap"><ul class="card-facts">${f.facts.map((x) => `<li>${x}</li>`).join("")}</ul>${
    f.limited ? `<p class="card-limited">${f.limited}</p>` : ""}</div>`;
}


function matches(p, filter) {
  if (filter === "all") return true;
  if (filter.startsWith("brand:")) return p.brand === filter.slice(6);
  const cats = GROUPS[filter] || [filter];
  return [p.category, ...(p.alsoIn || [])].some((c) => cats.includes(c));
}

function renderGrid(filter = "all") {
  const list = products.filter((p) => matches(p, filter));
  const status = document.getElementById("shopStatus");
  status.textContent = filter.startsWith("brand:")
    ? `${list.length} de ${BRANDS[filter.slice(6)].name} · `
    : `${list.length} productos`;
  if (filter.startsWith("brand:")) status.insertAdjacentHTML("beforeend", `<button class="link-btn" data-filter="all">Ver todo</button>`);

  grid.innerHTML = list.map((p, i) => {
    const sel = selection[p.id] ||= {
      color: p.colors?.[0], size: p.sizes?.[Math.min(1, p.sizes.length - 1)], flavor: p.flavors?.[0].name, pack: p.packs?.[0].name,
    };
    const colorRow = p.colors ? `<div class="option-row" aria-label="Color">${p.colors.map((c) =>
      `<button class="swatch ${c === sel.color ? "active" : ""}" style="background:${COLORS[c].hex}" data-color="${c}" title="${COLORS[c].name}" aria-label="${COLORS[c].name}"></button>`).join("")}</div>` : "";
    const sizeRow = p.sizes ? `<div class="option-row" aria-label="Talla">${p.sizes.map((s) =>
      `<button class="size ${s === sel.size ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : "";
    const packRow = p.packs ? `<div class="option-row" aria-label="${p.packLabel || "Tamaño"}">${p.packs.map((k) =>
      `<button class="size ${k.name === sel.pack ? "active" : ""}" data-pack="${k.name}">${k.name}</button>`).join("")}</div>` : "";
    const flavorRow = p.flavors ? `<div class="option-row" aria-label="Sabor">${p.flavors.map((f) =>
      `<button class="size ${f.name === sel.flavor ? "active" : ""}${f.limited ? " limited" : ""}" data-flavor="${f.name}"${
        f.limited ? ' title="Edición limitada de otoño"' : ""}>${f.name}${f.limited ? '<span class="limited-dot" aria-label="edición limitada"></span>' : ""}</button>`).join("")}</div>` : "";

    return `
      <article class="card" data-id="${p.id}" style="animation-delay:${i * 40}ms">
        <div class="card-media">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${media(p, sel)}</div>
        <div class="card-body">
          <p class="card-brand">${BRANDS[p.brand].name}</p>
          <div class="card-top"><h3 class="card-title">${p.name}</h3><span class="price">${money(priceOf(p, sel))}</span></div>
          <p class="card-desc">${p.desc}</p>
          ${factsHtml(p, sel)}
          ${colorRow}${sizeRow}${packRow}${flavorRow}
          <button class="btn btn-primary add">Agregar al carrito</button>
        </div>
      </article>`;
  }).join("");
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = products.find((x) => x.id === card.dataset.id);
  const sel = selection[p.id];
  const b = e.target.closest("button");
  if (!b) return;

  const key = ["color", "size", "pack", "flavor"].find((k) => b.dataset[k]);
  if (key) {
    sel[key] = b.dataset[key];
    b.parentElement.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
    card.querySelector(".card-media .media").outerHTML = media(p, sel);
    if (p.flavors) card.querySelector(".card-facts-wrap").outerHTML = factsHtml(p, sel);
    card.querySelector(".price").textContent = money(priceOf(p, sel));
  } else if (b.classList.contains("add")) {
    addToCart(p, sel);
  }
});

// ---------- Filters ----------
function setFilter(filter) {
  document.querySelectorAll("#filters .chip, .brand-card").forEach((c) =>
    c.classList.toggle("active", c.dataset.filter === filter));
  renderGrid(filter);
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-filter]");
  if (!el) return;
  setFilter(el.dataset.filter);
  if (!el.closest("#filters")) document.getElementById("shop").scrollIntoView();
  closeMenu();
});

// ---------- Cart ----------
const cartEl = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const countEl = document.getElementById("cartCount");

function variantLabel(item) {
  return [item.color && COLORS[item.color].name, item.size, item.pack, item.flavor].filter(Boolean).join(" · ");
}

function addToCart(p, sel) {
  const variant = { color: sel.color, size: sel.size, pack: sel.pack, flavor: sel.flavor };
  const key = [p.id, variant.color, variant.size, variant.pack, variant.flavor].join("|");
  const existing = cart.find((i) => i.key === key);
  if (existing) existing.qty++;
  else cart.push({ key, id: p.id, qty: 1, ...variant });
  save();
  renderCart();
  countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
  toast(`Agregado: ${p.name}`);
}

function renderCart() {
  const items = document.getElementById("cartItems");
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * priceOf(products.find((p) => p.id === i.id), i), 0);
  countEl.textContent = count;

  items.innerHTML = cart.length ? cart.map((i) => {
    const p = products.find((x) => x.id === i.id);
    return `
      <div class="cart-item" data-key="${i.key}">
        <div class="cart-thumb">${media(p, i)}</div>
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${BRANDS[p.brand].name}</div>
          <div class="meta">${variantLabel(i)}</div>
          <div class="qty"><button data-act="dec" aria-label="Quitar uno">−</button><span>${i.qty}</span><button data-act="inc" aria-label="Agregar uno">+</button></div>
        </div>
        <div><div class="line-price">${money(priceOf(p, i) * i.qty)}</div><button class="remove" data-act="rm">Eliminar</button></div>
      </div>`;
  }).join("") : `<p class="cart-empty">Tu carrito está vacío.<br>Hora de equiparte.</p>`;

  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("shipBar").style.width = `${Math.min(100, (total / FREE_SHIP) * 100)}%`;
  document.getElementById("shipMsg").textContent = total >= FREE_SHIP
    ? "¡Ya tienes envío gratis! 💪"
    : `Te faltan ${money(FREE_SHIP - total)} para el envío gratis`;
  document.getElementById("checkoutBtn").disabled = !cart.length;
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  if (!act) return;
  const item = cart.find((i) => i.key === e.target.closest(".cart-item").dataset.key);
  if (act === "inc") item.qty++;
  if (act === "dec") item.qty--;
  if (act === "rm" || item.qty < 1) cart = cart.filter((i) => i !== item);
  save();
  renderCart();
});

function openCart() {
  cartEl.classList.add("open");
  cartEl.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}
function closeCart() {
  cartEl.classList.remove("open");
  cartEl.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

document.getElementById("checkoutBtn").addEventListener("click", () => {
  cart = [];
  save();
  renderCart();
  closeCart();
  toast("¡Pedido realizado, gracias bro! (pago de prueba)");
});

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") closeMenu(); });

// ---------- Newsletter ----------
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formMsg").textContent = "¡Listo! Revisa tu correo para tu 10% de descuento.";
  e.target.reset();
});

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- Brand sections ----------
const brandIds = Object.keys(BRANDS);
document.getElementById("brandList").innerHTML = brandIds.map((id) => {
  const n = products.filter((p) => p.brand === id).length;
  return `<button class="brand-card" data-filter="brand:${id}">
    <span class="brand-kind">${BRANDS[id].kind}</span>
    <span class="brand-name">${BRANDS[id].name}</span>
    <span class="brand-blurb">${BRANDS[id].blurb}</span>
    <span class="brand-link">Ver ${n} producto${n === 1 ? "" : "s"} →</span>
  </button>`;
}).join("");
const tickerItems = brandIds.map((id) => `<span>${BRANDS[id].name.toUpperCase()}</span><span>★</span>`).join("");
document.getElementById("tickerTrack").innerHTML = tickerItems.repeat(4);
document.getElementById("supplementBrand").textContent = BRANDS.birdman.name;
document.querySelectorAll("[data-count]").forEach((el) => {
  const n = products.filter((p) => matches(p, el.dataset.count)).length;
  el.textContent = `${n} producto${n === 1 ? "" : "s"}`;
});

renderGrid();
renderCart();

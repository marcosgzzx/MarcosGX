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
  "negro-gris": { name: "Negro/Gris", hex: "linear-gradient(135deg, #111 50%, #8a8a8a 50%)" },
};
const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
// Shoe sizes in cm, US 7 to US 11. In Mexico the size is the foot length in cm, so MX = cm.
const SHOE_SIZES = ["25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29"];
// Approximate US men's equivalents for the size guide
const SHOE_US = { 25: "7", 25.5: "7.5", 26: "8", 26.5: "8.5", 27: "9", 27.5: "9.5", 28: "10", 28.5: "10.5", 29: "11" };

// Apparel brand names and prices are placeholders: swap in the real brands GYM BRO'S stocks.
// Prices are in Mexican pesos (MXN). A flavor can override its product's price.
const BRANDS = {
  gymshark: { name: "Gymshark", kind: "Ropa", blurb: "Playeras de entrenamiento sin costuras, corte muscle fit." },
  on: { name: "On", kind: "Tenis", blurb: "Tenis de entrenamiento con suela CloudTec." },
  ironclad: { name: "Ironclad Athletics", kind: "Ropa", blurb: "Playeras de algodón grueso hechas para el gym." },
  northlift: { name: "Northlift", kind: "Ropa", blurb: "Shorts elásticos y playeras de entrenamiento." },
  repsupply: { name: "Rep Supply Co.", kind: "Ropa", blurb: "Calcetas acolchadas que no se bajan." },
  birdman: { name: "Birdman", kind: "Suplementos", blurb: "Proteína vegetal Falcon y creatina monohidratada." },
};

const products = [
  { id: "gymshark-onyx-5", brand: "gymshark", name: "Onyx 5.0 Seamless Muscle Fit", category: "tees", price: 1450, tag: "Nuevo",
    desc: "Playera sin costuras de corte muscle fit, entallada al cuerpo.",
    colors: ["negro-azul", "negro-rojo", "negro-gris"], sizes: APPAREL_SIZES,
    packLabel: "Manga", defaultPack: "Manga corta",
    packs: [{ name: "Sin mangas", price: 1300 }, { name: "Manga corta", price: 1450 }, { name: "Manga larga", price: 1600 }],
    // Pack prices are for size M; each size below M costs $100 less, each size above $100 more
    sizePricing: { base: "M", step: 100 },
    // Photo per color and sleeve length
    photos: {
      "negro-azul": { "Sin mangas": "assets/products/gymshark-onyx-negro-azul-sinmangas.webp",
                      "Manga corta": "assets/products/gymshark-onyx-negro-azul-corta.webp",
                      "Manga larga": "assets/products/gymshark-onyx-negro-azul-larga.webp" },
      "negro-rojo": { "Sin mangas": "assets/products/gymshark-onyx-negro-rojo-sinmangas.webp",
                      "Manga corta": "assets/products/gymshark-onyx-negro-rojo-corta.webp",
                      "Manga larga": "assets/products/gymshark-onyx-negro-rojo-larga.webp" },
      "negro-gris": { "Sin mangas": "assets/products/gymshark-onyx-negro-gris-sinmangas.webp",
                      "Manga corta": "assets/products/gymshark-onyx-negro-gris-corta.webp",
                      "Manga larga": "assets/products/gymshark-onyx-negro-gris-larga.webp" },
    } },
  { id: "on-cloud-x5", brand: "on", name: "Cloud X 5", category: "shoes", price: 3300, tag: "Nuevo",
    desc: "Tenis de entrenamiento. Tallas mexicanas (cm), de US 7 a US 11.",
    colors: ["white", "black"], sizes: SHOE_SIZES, sizeLabel: "Talla MX (cm)",
    // Price is for 27.5 cm; each half size below is $100 less, each half size above $100 more
    sizePricing: { base: "27.5", step: 100 },
    // Photos per color; the size guide is always the last slide
    gallery: {
      white: ["assets/products/on-cloud-x5-blanco-lado.webp", "assets/products/on-cloud-x5-blanco-par.webp",
              "assets/products/on-cloud-x5-blanco-interior.webp"],
      black: ["assets/products/on-cloud-x5-negro-interior.webp", "assets/products/on-cloud-x5-negro-par.webp",
              "assets/products/on-cloud-x5-negro-lado.webp"],
    },
    sizeGuide: true },
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

const GROUPS = { apparel: ["tees", "shorts", "socks", "shoes"], supplements: ["protein", "creatine"] };
const FREE_SHIP = 1200; // free shipping from this product subtotal (MXN)
const MAX_ITEMS = 10; // most products allowed in one order
const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const money = (n) => mxn.format(n);
const packOf = (p, sel) => p.packs && (p.packs.find((k) => k.name === (sel.pack || p.defaultPack)) || p.packs[0]);
const sizeAdjust = (p, sel) => {
  if (!p.sizePricing || !sel.size) return 0;
  return (p.sizes.indexOf(sel.size) - p.sizes.indexOf(p.sizePricing.base)) * p.sizePricing.step;
};
const priceOf = (p, sel) => ((p.flavors && flavorOf(p, sel).price) || packOf(p, sel)?.price || p.price) + sizeAdjust(p, sel);

// ---------- State ----------
const selection = {}; // product id -> { color, size, flavor }
let cart = load();
let currentFilter = "all";
let currentSort = "featured";

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

const photosOf = (p, sel) => Array.isArray(p.gallery) ? p.gallery : p.gallery[sel.color] || Object.values(p.gallery)[0];
const slideCount = (p, sel = {}) => p.gallery ? photosOf(p, sel).length + (p.sizeGuide ? 1 : 0) : 1;

function sizeGuideHtml() {
  const rows = (list) => list.map((cm) => `<tr><td>${cm}</td><td>${cm}</td><td>${SHOE_US[cm]}</td></tr>`).join("");
  const head = `<thead><tr><th>cm</th><th>MX</th><th>US</th></tr></thead>`;
  return `<div class="media size-guide">
    <strong>Guía de tallas</strong>
    <p>Mide tu pie del talón a la punta del dedo más largo. En México esa medida en cm es tu talla.</p>
    <div class="sg-tables">
      <table>${head}<tbody>${rows(SHOE_SIZES.slice(0, 5))}</tbody></table>
      <table>${head}<tbody>${rows(SHOE_SIZES.slice(5))}</tbody></table>
    </div>
    <small>US hombre, aproximado. Si estás entre dos tallas, elige la mayor.</small>
  </div>`;
}

function galleryControls(p, sel) {
  const n = slideCount(p, sel), cur = sel.slide || 0;
  return `<button type="button" class="gal-btn prev" data-slide="prev" aria-label="Foto anterior">‹</button>
    <button type="button" class="gal-btn next" data-slide="next" aria-label="Foto siguiente">›</button>
    <div class="gal-dots">${Array.from({ length: n }, (_, k) => {
      const guide = p.sizeGuide && k === n - 1;
      return `<button type="button" class="gal-dot ${k === cur ? "active" : ""}${guide ? " guide" : ""}" data-slide="${k}" aria-label="${guide ? "Guía de tallas" : `Foto ${k + 1}`}">${guide ? "cm" : ""}</button>`;
    }).join("")}</div>`;
}

function media(p, sel) {
  if (p.gallery) {
    const photos = photosOf(p, sel), k = sel.slide || 0;
    if (k >= photos.length) return sizeGuideHtml();
    const color = sel.color && COLORS[sel.color] ? `, ${COLORS[sel.color].name}` : "";
    return `<img class="media photo" src="${photos[k]}" alt="${p.name}${color}, foto ${k + 1} de ${photos.length}">`;
  }
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

function defaultSize(p) {
  if (!p.sizes) return undefined;
  const fav = getCurrentUser()?.prefSize;
  if (p.sizes.includes(fav)) return fav;
  return p.sizePricing?.base || p.sizes[Math.min(1, p.sizes.length - 1)];
}

const SORTS = {
  featured: () => 0,
  "price-asc": (a, b) => priceOf(a, selection[a.id] || {}) - priceOf(b, selection[b.id] || {}),
  "price-desc": (a, b) => priceOf(b, selection[b.id] || {}) - priceOf(a, selection[a.id] || {}),
  name: (a, b) => a.name.localeCompare(b.name, "es"),
};

function renderGrid(filter = currentFilter) {
  currentFilter = filter;
  const list = products.filter((p) => matches(p, filter)).sort(SORTS[currentSort]);
  const status = document.getElementById("shopStatus");
  status.textContent = filter.startsWith("brand:")
    ? `${list.length} de ${BRANDS[filter.slice(6)].name} · `
    : `${list.length} productos`;
  if (filter.startsWith("brand:")) status.insertAdjacentHTML("beforeend", `<button class="link-btn" data-filter="all">Ver todo</button>`);

  grid.innerHTML = list.map((p, i) => {
    const sel = selection[p.id] ||= {
      color: p.colors?.[0], size: defaultSize(p), flavor: p.flavors?.[0].name, pack: p.defaultPack || p.packs?.[0].name,
    };
    const colorRow = p.colors ? `<div class="option-row" aria-label="Color">${p.colors.map((c) =>
      `<button class="swatch ${c === sel.color ? "active" : ""}" style="background:${COLORS[c].hex}" data-color="${c}" title="${COLORS[c].name}" aria-label="${COLORS[c].name}"></button>`).join("")}</div>` : "";
    const sizeLabel = p.sizeLabel ? `<p class="option-label">${p.sizeLabel}${p.sizeGuide ? ` · <button type="button" class="link-btn" data-slide="guide">Guía de tallas</button>` : ""}</p>` : "";
    const sizeRow = p.sizes ? `${sizeLabel}<div class="option-row" aria-label="${p.sizeLabel || "Talla"}">${p.sizes.map((s) =>
      `<button class="size ${s === sel.size ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : "";
    const packRow = p.packs ? `<div class="option-row" aria-label="${p.packLabel || "Tamaño"}">${p.packs.map((k) =>
      `<button class="size ${k.name === sel.pack ? "active" : ""}" data-pack="${k.name}">${k.name}</button>`).join("")}</div>` : "";
    const flavorRow = p.flavors ? `<div class="option-row" aria-label="Sabor">${p.flavors.map((f) =>
      `<button class="size ${f.name === sel.flavor ? "active" : ""}${f.limited ? " limited" : ""}" data-flavor="${f.name}"${
        f.limited ? ' title="Edición limitada de otoño"' : ""}>${f.name}${f.limited ? '<span class="limited-dot" aria-label="edición limitada"></span>' : ""}</button>`).join("")}</div>` : "";

    return `
      <article class="card" data-id="${p.id}" style="animation-delay:${i * 40}ms">
        <div class="card-media${p.sizeGuide && (sel.slide || 0) === slideCount(p, sel) - 1 ? " on-guide" : ""}">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${media(p, sel)}${p.gallery ? galleryControls(p, sel) : ""}</div>
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

  if (b.dataset.slide) {
    const n = slideCount(p, sel), cur = sel.slide || 0, v = b.dataset.slide;
    sel.slide = v === "prev" ? (cur - 1 + n) % n : v === "next" ? (cur + 1) % n : v === "guide" ? n - 1 : +v;
    card.querySelector(".card-media .media").outerHTML = media(p, sel);
    card.querySelectorAll(".gal-dot").forEach((d, k) => d.classList.toggle("active", k === sel.slide));
    card.querySelector(".card-media").classList.toggle("on-guide", p.sizeGuide && sel.slide === n - 1);
    return;
  }
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
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderGrid();
});

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
  const p = products.find((x) => x.id === item.id);
  const size = item.size && (p?.sizes === SHOE_SIZES ? `${item.size} cm` : item.size);
  return [item.color && COLORS[item.color].name, size, item.pack, item.flavor].filter(Boolean).join(" · ");
}

const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
const cartSubtotal = () => cart.reduce((s, i) => s + i.qty * priceOf(products.find((p) => p.id === i.id), i), 0);
function clearCart() {
  cart = [];
  save();
  renderCart();
}

function addToCart(p, sel) {
  if (cartCount() >= MAX_ITEMS) {
    toast(`Máximo ${MAX_ITEMS} productos por pedido`);
    return;
  }
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
  const count = cartCount();
  const total = cartSubtotal();
  const full = count >= MAX_ITEMS;
  countEl.textContent = count;

  items.innerHTML = cart.length ? cart.map((i) => {
    const p = products.find((x) => x.id === i.id);
    return `
      <div class="cart-item" data-key="${i.key}">
        <div class="cart-thumb">${media(p, { ...i, slide: 0 })}</div>
        <div>
          <h4>${p.name}</h4>
          <div class="meta">${BRANDS[p.brand].name}</div>
          <div class="meta">${variantLabel(i)}</div>
          <div class="qty"><button data-act="dec" aria-label="Quitar uno">−</button><span>${i.qty}</span><button data-act="inc" aria-label="Agregar uno" ${full ? "disabled" : ""}>+</button></div>
        </div>
        <div><div class="line-price">${money(priceOf(p, i) * i.qty)}</div><button class="remove" data-act="rm">Eliminar</button></div>
      </div>`;
  }).join("") : `<p class="cart-empty">Tu carrito está vacío.<br>Hora de equiparte.</p>`;

  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("shipBar").style.width = `${Math.min(100, (total / FREE_SHIP) * 100)}%`;
  document.getElementById("shipMsg").textContent = total >= FREE_SHIP
    ? "¡Ya tienes envío gratis! 💪"
    : `Te faltan ${money(FREE_SHIP - total)} para el envío gratis`;
  const limit = document.getElementById("cartLimit");
  limit.textContent = full ? `Llegaste al máximo de ${MAX_ITEMS} productos por pedido.` : `${count} de ${MAX_ITEMS} productos`;
  limit.classList.toggle("full", full);
  document.getElementById("checkoutBtn").disabled = !cart.length;
}

document.getElementById("cartItems").addEventListener("click", (e) => {
  const act = e.target.dataset.act;
  if (!act) return;
  const item = cart.find((i) => i.key === e.target.closest(".cart-item").dataset.key);
  if (act === "inc") {
    if (cartCount() >= MAX_ITEMS) return toast(`Máximo ${MAX_ITEMS} productos por pedido`);
    item.qty++;
  }
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
document.getElementById("newsletterForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById("formMsg");
  const email = form.querySelector("#email").value;
  const btn = form.querySelector("button");
  btn.disabled = true;
  try {
    const res = await subscribeNewsletter(email);
    msg.innerHTML = res.already
      ? "Ese correo ya está suscrito y ya recibió su código de bienvenida."
      : `¡Listo! Tu código de ${PROMO_PERCENT}% es ${promoChip(res.code)} Úsalo al pagar; funciona una sola vez.`;
    form.reset();
  } catch {
    msg.textContent = "No pudimos generar tu código. Intenta de nuevo en un momento.";
  } finally { btn.disabled = false; }
});

// ---------- Toast ----------
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  // As a popover the toast sits in the top layer, above any open dialog
  if (t.showPopover) {
    try { if (t.matches(":popover-open")) t.hidePopover(); t.showPopover(); } catch { /* popover unsupported */ }
  }
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => { if (!t.classList.contains("show") && t.matches?.(":popover-open")) t.hidePopover(); }, 300);
  }, 2400);
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

// ---------- Hero background clips ----------
// Only use clips you have the right to use (your own, or free-license stock such as Pexels or Pixabay).
// A credit is shown in the corner of the hero for each clip. With no clips the hero stays plain white.
const HERO_CLIPS = [
  // { src: ["assets/hero/entrenamiento-1.webm", "assets/hero/entrenamiento-1.mp4"],
  //   author: "Nombre del autor", source: "Pexels", url: "https://www.pexels.com/video/..." },
];

function startHeroClips() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!HERO_CLIPS.length || reduceMotion) return;
  const hero = document.getElementById("hero");
  const box = document.getElementById("heroMedia");
  const video = document.getElementById("heroVideo");
  const credit = document.getElementById("heroCredit");
  const failed = new Set();
  let i = 0;

  const play = () => {
    if (failed.size === HERO_CLIPS.length) { // every clip failed: back to the plain hero
      hero.classList.remove("has-video"); box.hidden = true; credit.hidden = true;
      return;
    }
    while (failed.has(i)) i = (i + 1) % HERO_CLIPS.length;
    const clip = HERO_CLIPS[i];
    // Use the first file this browser can play (e.g. WebM for Chromium, MP4 for Safari)
    const types = { webm: 'video/webm; codecs="vp9"', mp4: 'video/mp4; codecs="avc1.42E01E"' };
    const src = [clip.src].flat().find((f) => video.canPlayType(types[f.split(".").pop()] || "")) ;
    if (!src) { failed.add(i); i = (i + 1) % HERO_CLIPS.length; return play(); }
    video.src = src;
    video.loop = HERO_CLIPS.length === 1;
    credit.innerHTML = `Video: ${clip.url ? `<a href="${clip.url}" target="_blank" rel="noopener">${clip.author}</a>` : clip.author}${clip.source ? ` · ${clip.source}` : ""}`;
    video.play().catch(() => { /* autoplay blocked: the first frame still shows */ });
  };
  video.addEventListener("loadeddata", () => {
    hero.classList.add("has-video"); box.hidden = false; credit.hidden = false;
  });
  video.addEventListener("ended", () => { i = (i + 1) % HERO_CLIPS.length; play(); });
  video.addEventListener("error", () => { failed.add(i); i = (i + 1) % HERO_CLIPS.length; play(); });
  play();
}
startHeroClips();

// ---------- Search ----------
const searchDialog = document.getElementById("searchDialog");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const CATEGORY_WORDS = { tees: "playera playeras camiseta", shorts: "short shorts", socks: "calcetas calcetines",
  shoes: "tenis zapatos zapatillas calzado sneakers",
  protein: "proteína proteina", creatine: "creatina" };
const fold = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function searchText(p) {
  return fold([p.name, BRANDS[p.brand].name, BRANDS[p.brand].kind, p.desc, p.tag, CATEGORY_WORDS[p.category],
    ...(p.alsoIn || []).map((c) => CATEGORY_WORDS[c]), ...(p.colors || []).map((c) => COLORS[c].name),
    ...(p.packs || []).map((k) => k.name), ...(p.flavors || []).map((f) => f.name)].filter(Boolean).join(" "));
}

function runSearch() {
  const terms = fold(searchInput.value.trim()).split(/\s+/).filter(Boolean);
  document.getElementById("searchSuggest").hidden = terms.length > 0;
  if (!terms.length) { searchResults.innerHTML = ""; return; }
  const hits = products.filter((p) => { const t = searchText(p); return terms.every((w) => t.includes(w)); });
  searchResults.innerHTML = hits.length ? hits.map((p) => {
    const sel = selection[p.id] || {};
    // If the query names a flavor or size/sleeve, show (and open) the product with that option
    // The option matching the most query words wins; a tie picks nothing
    const pick = (opts) => {
      if (!opts || opts.length < 2) return undefined;
      const scored = opts.map((o) => [o, terms.filter((t) => fold(o.name).includes(t)).length]).sort((a, b) => b[1] - a[1]);
      return scored[0][1] > 0 && scored[0][1] > scored[1][1] ? scored[0][0] : undefined;
    };
    const flavor = pick(p.flavors), pack = pick(p.packs), color = pick(p.colors?.map((c) => ({ key: c, name: COLORS[c].name })));
    const view = { ...sel, slide: 0, color: color?.key || sel.color || p.colors?.[0], ...(flavor && { flavor: flavor.name }), ...(pack && { pack: pack.name }) };
    const extra = [color?.name, flavor?.name, pack?.name].filter(Boolean).join(" · ");
    return `<li><button type="button" class="result" data-id="${p.id}"${flavor ? ` data-flavor="${flavor.name}"` : ""}${pack ? ` data-pack="${pack.name}"` : ""}${color ? ` data-color="${color.key}"` : ""}>
      <span class="result-thumb">${media(p, view)}</span>
      <span class="result-text"><strong>${p.name}</strong><span>${BRANDS[p.brand].name}${extra ? ` · ${extra}` : ""}</span></span>
      <span class="result-price">${money(priceOf(p, view))}</span>
    </button></li>`;
  }).join("") : `<li class="no-results">No encontramos "${searchInput.value.replace(/[<>&"]/g, "")}". Prueba con una marca, categoría o sabor.</li>`;
}

function openSearch() {
  searchDialog.showModal();
  searchInput.select();
  runSearch();
}

function goToProduct(id, flavor, pack, color) {
  searchDialog.close();
  setFilter("all");
  if (flavor) selection[id].flavor = flavor;
  if (pack) selection[id].pack = pack;
  if (color) selection[id].color = color;
  renderGrid();
  const card = grid.querySelector(`.card[data-id="${id}"]`);
  card.scrollIntoView({ block: "center" });
  card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash");
}

document.getElementById("searchBtn").addEventListener("click", openSearch);
searchInput.addEventListener("input", runSearch);
// In a search input, Escape would only clear the text; close the search instead
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { e.preventDefault(); searchDialog.close(); }
});
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const first = searchResults.querySelector(".result");
  if (first) goToProduct(first.dataset.id, first.dataset.flavor, first.dataset.pack, first.dataset.color);
});
searchDialog.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-q]");
  if (chip) { searchInput.value = chip.dataset.q; runSearch(); searchInput.focus(); }
  const result = e.target.closest(".result");
  if (result) goToProduct(result.dataset.id, result.dataset.flavor, result.dataset.pack, result.dataset.color);
});
document.addEventListener("keydown", (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
  if (e.key === "/" && !typing && !document.querySelector("dialog[open]")) { e.preventDefault(); openSearch(); }
});

// A new favourite size (or logging in/out) changes the default size on apparel cards
let sizeKey = `${getCurrentUser()?.email}|${getCurrentUser()?.prefSize}`;
onAccountChange((user) => {
  const key = `${user?.email}|${user?.prefSize}`;
  if (key === sizeKey) return;
  sizeKey = key;
  products.forEach((p) => { if (p.sizes && selection[p.id]) selection[p.id].size = defaultSize(p); });
  if (grid.children.length) renderGrid();
});

renderGrid();
renderCart();

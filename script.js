// ---------- Catalog ----------
const COLORS = {
  black: { name: "Negro", hex: "#1c1c1c" },
  white: { name: "Blanco", hex: "#f7f7f5" },
  "negro-blanco": { name: "Negro/Blanco", hex: "linear-gradient(135deg, #111 50%, #f7f7f5 50%)" },
  "azul-marino": { name: "Azul marino", hex: "#262a63" },
  morado: { name: "Morado", hex: "#4e3a6b" },
  "negro-azul": { name: "Negro/Azul", hex: "linear-gradient(135deg, #111 50%, #1d9c95 50%)" },
  "negro-rojo": { name: "Negro/Rojo", hex: "linear-gradient(135deg, #111 50%, #b3141e 50%)" },
  "negro-gris": { name: "Negro/Gris", hex: "linear-gradient(135deg, #111 50%, #8a8a8a 50%)" },
};
const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL"];
// Shoe sizes in cm, US 7 to US 11. In Mexico the size is the foot length in cm, so MX = cm.
const SHOE_SIZES = ["25", "25.5", "26", "26.5", "27", "27.5", "28", "28.5", "29"];
// Approximate US men's equivalents for the size guide
const SHOE_US = { 25: "7", 25.5: "7.5", 26: "8", 26.5: "8.5", 27: "9", 27.5: "9.5", 28: "10", 28.5: "10.5", 29: "11" };

// Prices are in Mexican pesos (MXN). A flavor can override its product's price.
const BRANDS = {
  gymshark: { name: "Gymshark", kind: "Ropa", blurb: "Playeras de entrenamiento sin costuras, corte muscle fit." },
  adidas: { name: "adidas", kind: "Ropa", blurb: "Tops deportivos de mujer para entrenar." },
  on: { name: "On", kind: "Tenis", blurb: "Tenis de entrenamiento con suela CloudTec." },
  birdman: { name: "Birdman", kind: "Suplementos", blurb: "Proteína vegetal Falcon y creatina monohidratada." },
};

const products = [
  { id: "gymshark-onyx-5", brand: "gymshark", gender: "hombre", name: "Onyx 5.0 Seamless Muscle Fit", category: "tees", price: 1450, tag: "Nuevo",
    desc: "Playera sin costuras de corte muscle fit, entallada al cuerpo.",
    colors: ["negro-azul", "negro-rojo", "negro-gris"], sizes: APPAREL_SIZES,
    soldOut: ["XXL"], lowStock: ["S"], // demo stock
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
  { id: "adidas-top-deportivo", brand: "adidas", gender: "mujer", name: "Top deportivo", category: "tops", price: 750, tag: "Nuevo",
    desc: "Top deportivo con tirantes cruzados en la espalda. Tallas de mujer.",
    colors: ["morado", "black"], sizes: WOMEN_SIZES,
    soldOut: ["XS"], lowStock: ["XL"], // demo stock
    sizePricing: { base: "M", step: 100 }, // price is for M; $100 less per size below, $100 more per size above
    gallery: {
      morado: ["assets/products/adidas-top-morado.webp", { src: "assets/products/adidas-top-morado-puesto.webp", full: true }],
      black: ["assets/products/adidas-top-negro.webp", { src: "assets/products/adidas-top-negro-puesto.webp", full: true }],
    } },
  { id: "on-cloud-x5", brand: "on", gender: "hombre", name: "Cloud X 5", category: "shoes", price: 3300, tag: "Nuevo",
    desc: "Tenis de entrenamiento. Tallas mexicanas (cm), de US 7 a US 11.",
    colors: ["white", "black"], sizes: SHOE_SIZES, sizeLabel: "Talla MX (cm)",
    soldOut: ["25"], lowStock: ["29"], // demo stock
    // Price is for US 8 (26 cm); each half size below is $100 less, each half size above $100 more
    sizePricing: { base: "26", step: 100 },
    // Photos per color; the size guide is always the last slide
    gallery: {
      white: ["assets/products/on-cloud-x5-blanco-lado.webp", "assets/products/on-cloud-x5-blanco-par.webp",
              "assets/products/on-cloud-x5-blanco-interior.webp"],
      black: ["assets/products/on-cloud-x5-negro-interior.webp", "assets/products/on-cloud-x5-negro-par.webp",
              "assets/products/on-cloud-x5-negro-lado.webp"],
    },
    sizeGuide: true },
  { id: "on-cloud-6", brand: "on", gender: "hombre", name: "Cloud 6", category: "shoes", price: 2700, tag: "Nuevo",
    desc: "Tenis para el día a día y el gym. Tallas mexicanas (cm), de US 7 a US 11.",
    colors: ["negro-blanco", "azul-marino"], sizes: SHOE_SIZES, sizeLabel: "Talla MX (cm)",
    lowStock: ["26.5"], // demo stock
    sizePricing: { base: "26", step: 100 }, // price is for US 8 (26 cm)
    gallery: {
      "negro-blanco": ["assets/products/on-cloud-6-negro-lado.webp"],
      "azul-marino": ["assets/products/on-cloud-6-azul-lado.webp", { src: "assets/products/on-cloud-6-azul-puesto.webp", full: true }],
    },
    sizeGuide: true },
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

const GENDERS = { hombre: "Hombre", mujer: "Mujer" };
const GROUPS = { apparel: ["tees", "tops", "shorts", "socks", "shoes"], supplements: ["protein", "creatine"] };
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
    const shot = typeof photos[k] === "string" ? { src: photos[k] } : photos[k]; // { full: true } = photo with its own background
    return `<img class="media ${shot.full ? "photo-full" : "photo"}" src="${shot.src}" alt="${p.name}${color}, foto ${k + 1} de ${photos.length}">`;
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
  return `<div class="media"></div>`;
}

// Stock (demo data): sizes in p.soldOut can't be picked; sizes in p.lowStock show a warning
function stockHtml(p, sel) {
  const low = (p.lowStock || []).includes(sel.size);
  return `<p class="stock-note" data-stock${low ? "" : " hidden"}>¡Últimas piezas en talla ${sel.size}!</p>`;
}
function addButtonHtml(p, sel) {
  const out = p.soldOut === true;
  return `<button class="btn btn-primary add"${out ? " disabled" : ""}>${out ? "Agotado" : "Agregar al carrito"}</button>`;
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
  if (filter.startsWith("gender:")) return p.gender === filter.slice(7);
  const cats = GROUPS[filter] || [filter];
  return [p.category, ...(p.alsoIn || [])].some((c) => cats.includes(c));
}

function defaultSize(p) {
  if (!p.sizes) return undefined;
  const fav = getCurrentUser()?.prefSize;
  const available = p.sizes.filter((x) => !(p.soldOut || []).includes(x));
  if (available.includes(fav)) return fav;
  const base = p.sizePricing?.base || p.sizes[Math.min(1, p.sizes.length - 1)];
  return available.includes(base) ? base : available[0];
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
    : filter.startsWith("gender:") ? `${list.length} producto${list.length === 1 ? "" : "s"} de ${GENDERS[filter.slice(7)].toLowerCase()}`
    : `${list.length} productos`;
  if (filter.startsWith("brand:")) status.insertAdjacentHTML("beforeend", `<button class="link-btn" data-filter="all">Ver todo</button>`);

  if (!list.length) {
    grid.innerHTML = `<div class="grid-empty">
      <p><strong>No hay productos disponibles.</strong></p>
      <p class="muted">Pronto tendremos productos en esta categoría.</p>
      <button type="button" class="btn btn-ghost" data-filter="all">Ver todos los productos</button>
    </div>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => cardHtml(p, i)).join("");
}

// One product card. The product page (pdp.js) reuses it with { pdp: true } and its own extra sections.
function cardHtml(p, i = 0, opts = {}) {
    const sel = selection[p.id] ||= {
      color: p.colors?.[0], size: defaultSize(p), flavor: p.flavors?.[0].name, pack: p.defaultPack || p.packs?.[0].name,
    };
    const colorRow = p.colors ? `<div class="option-row" aria-label="Color">${p.colors.map((c) =>
      `<button class="swatch ${c === sel.color ? "active" : ""}" style="background:${COLORS[c].hex}" data-color="${c}" title="${COLORS[c].name}" aria-label="${COLORS[c].name}"></button>`).join("")}</div>` : "";
    const sizeLabel = p.sizeLabel ? `<p class="option-label">${p.sizeLabel}${p.sizeGuide ? ` · <button type="button" class="link-btn" data-slide="guide">Guía de tallas</button>` : ""}</p>` : "";
    const sizeRow = p.sizes ? `${sizeLabel}<div class="option-row" aria-label="${p.sizeLabel || "Talla"}">${p.sizes.map((s) =>
      (p.soldOut || []).includes(s)
        ? `<button class="size soldout" disabled title="Agotado" aria-label="${s}, agotado">${s}</button>`
        : `<button class="size ${s === sel.size ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : "";
    const packRow = p.packs ? `<div class="option-row" aria-label="${p.packLabel || "Tamaño"}">${p.packs.map((k) =>
      `<button class="size ${k.name === sel.pack ? "active" : ""}" data-pack="${k.name}">${k.name}</button>`).join("")}</div>` : "";
    const flavorRow = p.flavors ? `<div class="option-row" aria-label="Sabor">${p.flavors.map((f) =>
      `<button class="size ${f.name === sel.flavor ? "active" : ""}${f.limited ? " limited" : ""}" data-flavor="${f.name}"${
        f.limited ? ' title="Edición limitada de otoño"' : ""}>${f.name}${f.limited ? '<span class="limited-dot" aria-label="edición limitada"></span>' : ""}</button>`).join("")}</div>` : "";

    return `
      <article class="card${opts.pdp ? " pdp" : ""}" data-id="${p.id}" style="animation-delay:${opts.pdp ? 0 : i * 40}ms">
        ${typeof heartHtml === "function" ? heartHtml(p) : ""}
        <div class="card-media${p.sizeGuide && (sel.slide || 0) === slideCount(p, sel) - 1 ? " on-guide" : ""}">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${media(p, sel)}${p.gallery ? galleryControls(p, sel) : ""}</div>
        <div class="card-body">
          <p class="card-brand">${BRANDS[p.brand].name}${p.gender ? ` · ${GENDERS[p.gender]}` : ""}</p>
          <div class="card-top"><h3 class="card-title">${opts.pdp ? p.name : `<button type="button" class="title-link" data-open="${p.id}">${p.name}</button>`}</h3><span class="price">${money(priceOf(p, sel))}</span></div>
          <p class="card-desc">${p.desc}</p>
          ${factsHtml(p, sel)}
          ${colorRow}${sizeRow}${stockHtml(p, sel)}${packRow}${flavorRow}
          ${addButtonHtml(p, sel)}
          ${opts.pdp ? "" : `<button type="button" class="link-btn details-link" data-open="${p.id}">Ver detalles</button>`}
          ${opts.extra || ""}
        </div>
      </article>`;
}

function onCardClick(e) {
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
    const wasOnGuide = p.sizeGuide && (sel.slide || 0) === slideCount(p, sel) - 1;
    sel[key] = b.dataset[key];
    b.parentElement.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
    if (p.gallery) {
      // Colors can have different numbers of photos: stay on the guide if it was open, else on a photo of this color
      const photos = photosOf(p, sel).length;
      sel.slide = wasOnGuide ? photos : Math.min(sel.slide || 0, photos - 1);
      const box = card.querySelector(".card-media");
      box.innerHTML = `${p.tag ? `<span class="tag">${p.tag}</span>` : ""}${media(p, sel)}${galleryControls(p, sel)}`;
      box.classList.toggle("on-guide", p.sizeGuide && (sel.slide || 0) === slideCount(p, sel) - 1);
    } else card.querySelector(".card-media .media").outerHTML = media(p, sel);
    if (p.flavors) card.querySelector(".card-facts-wrap").outerHTML = factsHtml(p, sel);
    card.querySelector(".price").textContent = money(priceOf(p, sel));
    card.querySelector("[data-stock]").outerHTML = stockHtml(p, sel);
  } else if (b.classList.contains("add")) {
    addToCart(p, sel);
  }
}
grid.addEventListener("click", onCardClick);

// ---------- Filters ----------
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderGrid();
});

function setFilter(filter) {
  document.querySelectorAll("#filters .chip, #audience .chip, .brand-card").forEach((c) =>
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
  el.textContent = n ? `${n} producto${n === 1 ? "" : "s"}` : "Sin productos";
  el.closest(".cat-card").classList.toggle("empty", !n);
});

// ---------- Hero photo collage ----------
// Stock photos: confirm the license (or replace with your own) before launch.
const HERO_PHOTOS = ["peso-muerto-pie", "press-banca", "grupo-mancuernas", "sentadilla", "prensa-piernas", "peso-muerto"];
const PHOTO_RATIO = 1.5; // the photos are 3:2

// Picks the grid whose cells are closest to the photos' shape for the hero's current size,
// so the photos are cropped as little as possible on any screen.
function layoutCollage() {
  const box = document.getElementById("heroCollage");
  const { width: W, height: H } = box.getBoundingClientRect();
  if (!W || !H) return;
  let best = null;
  for (let rows = 1; rows <= 4; rows++) {
    for (let cols = 1; cols <= 5; cols++) {
      const n = rows * cols;
      if (n < (W >= 700 ? 6 : 4) || n > 15 || W / cols < 150) continue; // at least 6 photos on larger screens
      const fit = Math.abs(Math.log((W / cols) / (H / rows) / PHOTO_RATIO));
      const score = fit + n * 0.01; // prefer fewer, bigger photos when the fit is similar
      if (!best || score < best.score) best = { rows, cols, score };
    }
  }
  const { rows, cols } = best;
  if (box.dataset.grid === `${cols}x${rows}`) return;
  box.dataset.grid = `${cols}x${rows}`;
  box.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  box.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  // Shifting each row by 3 keeps a repeated photo away from its neighbours, diagonals included
  let html = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    html += `<div class="cell"><img src="assets/hero/${HERO_PHOTOS[(c + r * 3) % HERO_PHOTOS.length]}.webp" alt=""></div>`;
  }
  box.innerHTML = html;
}
// Parallax sizing: the fixed collage starts under the sticky header and reaches down to the ticker
function sizeParallax() {
  const hero = document.getElementById("hero");
  const headerH = document.querySelector(".site-header").offsetHeight;
  const tickerH = hero.querySelector(".ticker").offsetHeight;
  const announceH = document.querySelector(".announce").offsetHeight;
  hero.style.setProperty("--hero-media-top", `${headerH}px`);
  // At the top of the page the hero starts below the announcement bar, so cover that extra strip too
  hero.style.setProperty("--hero-media-h", `${hero.offsetHeight - tickerH + announceH}px`);
  hero.classList.add("parallax");
}
sizeParallax();
window.addEventListener("resize", sizeParallax);
layoutCollage();
if (window.ResizeObserver) new ResizeObserver(layoutCollage).observe(document.getElementById("heroCollage"));
else window.addEventListener("resize", layoutCollage);

// ---------- Hero background clips ----------
// Only use clips you have the right to use (your own, or free-license stock such as Pexels or Pixabay).
// A credit is shown in the corner of the hero for each clip. With no clips the photo collage shows instead.
const HERO_CLIPS = [
  // { src: ["assets/hero/entrenamiento-1.webm", "assets/hero/entrenamiento-1.mp4"],
  //   author: "Nombre del autor", source: "Pexels", url: "https://www.pexels.com/video/..." },
];

function startHeroClips() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!HERO_CLIPS.length || reduceMotion) return;
  const hero = document.getElementById("hero");
  const video = document.getElementById("heroVideo");
  const credit = document.getElementById("heroCredit");
  const failed = new Set();
  let i = 0;

  const play = () => {
    if (failed.size === HERO_CLIPS.length) { // every clip failed: back to the plain hero
      video.hidden = true; credit.hidden = true; // the photo collage stays behind
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
    video.hidden = false; credit.hidden = false;
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
const CATEGORY_WORDS = { tees: "playera playeras camiseta", tops: "top tops bra brasier sosten sostén deportivo", shorts: "short shorts", socks: "calcetas calcetines",
  shoes: "tenis zapatos zapatillas calzado sneakers",
  hombre: "hombre caballero", mujer: "mujer dama",
  protein: "proteína proteina", creatine: "creatina" };
const fold = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function searchText(p) {
  return fold([p.name, BRANDS[p.brand].name, BRANDS[p.brand].kind, p.desc, p.tag, CATEGORY_WORDS[p.category],
    ...(p.alsoIn || []).map((c) => CATEGORY_WORDS[c]), CATEGORY_WORDS[p.gender], ...(p.colors || []).map((c) => COLORS[c].name),
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

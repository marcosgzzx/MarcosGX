// ---------- Marcos GX · Cuestionario para nuevos proyectos ----------
// Las respuestas se quedan en el navegador del cliente hasta que las manda por WhatsApp.
const WHATSAPP_NUMBER = "528125980531";
const PRICES_DOC = "https://claude.ai/artifact/53iAYFUTSxSc1n7oF1EkW6";
const STORE_KEY = "marcosgx-cuestionario";

const PACKAGES = {
  servicios: {
    name: "Página de servicios",
    price: 5850,
    why: "Tu negocio vende por pedido, cotización o mensaje, así que lo que más te sirve es una página profesional que muestre tus trabajos y precios y haga fácil que te escriban.",
    includes: ["Diseño con tu marca", "Galería de trabajos", "Paquetes y precios", "Formulario de cotización", "WhatsApp y link de pago de anticipo", "Dominio propio y publicación"],
    weeks: "2–3 semanas",
  },
  tienda: {
    name: "Tienda en línea",
    price: 11200,
    why: "Vendes productos y quieres que tus clientes compren y paguen en línea sin tener que escribirte uno por uno.",
    includes: ["Tienda en Tiendanube o Shopify con tu diseño", "Hasta 30 productos cargados", "Pagos con tarjeta, OXXO y Mercado Pago", "Configuración de envíos", "Páginas legales", "Dominio propio y publicación"],
    weeks: "3–5 semanas",
  },
  medida: {
    name: "Tienda a la medida",
    price: 15350,
    why: "Tu negocio maneja varios productos, variantes o pedidos y necesita su propia tienda con funciones avanzadas, que tú puedas administrar desde tu panel.",
    includes: ["Tienda propia desarrollada a la medida", "Variantes, precios por talla e inventario", "Pagos en línea y códigos de descuento", "Cuentas de cliente con inicio de sesión con Google", "Panel para que administres productos y pedidos", "Dominio propio y publicación"],
    weeks: "5–8 semanas",
  },
  pro: {
    name: "Tienda Pro",
    price: 22670,
    why: "Tu negocio ya está establecido y vende constantemente. Con la Tienda Pro tienes una tienda completa y yo me encargo de hacer los cambios para que tú solo te enfoques en vender.",
    includes: ["Todo lo de Tienda a la medida", "Asistente con inteligencia artificial", "Administración incluida: yo hago los cambios en tu sitio", "Productos nuevos, precios y fotos", "Promociones de temporada"],
    weeks: "5–8 semanas",
  },
};

// ---------- Preguntas ----------
// type: text | email | tel | textarea | choice (una opción) | multi (varias)
const STEPS = [
  {
    title: "Tus datos",
    questions: [
      { id: "nombre", label: "Tu nombre", type: "text", required: true, autocomplete: "name" },
      { id: "negocio", label: "Nombre del negocio", type: "text", required: true, autocomplete: "organization" },
      { id: "whatsapp", label: "WhatsApp", type: "tel", required: true, hint: "10 dígitos", autocomplete: "tel-national" },
      { id: "correo", label: "Correo", type: "email", autocomplete: "email" },
      { id: "ciudad", label: "Ciudad", type: "text", required: true, autocomplete: "address-level2" },
    ],
  },
  {
    title: "Tu negocio",
    questions: [
      { id: "giro", label: "¿A qué se dedica tu negocio?", type: "choice", required: true, other: true,
        options: ["Ropa y accesorios", "Comida y repostería", "Eventos y decoración", "Belleza y cuidado personal", "Servicios profesionales", "Salud y deporte"] },
      { id: "descripcion", label: "Cuéntame en pocas palabras qué vendes y a quién", type: "textarea", required: true },
      { id: "antiguedad", label: "¿Cuánto tiempo lleva tu negocio?", type: "choice", required: true,
        options: ["Estoy empezando", "Menos de 1 año", "1 a 3 años", "Más de 3 años"] },
      { id: "ventaHoy", label: "¿Cómo vendes hoy?", type: "multi", required: true,
        options: ["WhatsApp", "Instagram o Facebook", "Local o tienda física", "Mercado Libre o Amazon", "Ya tengo página web", "Todavía no vendo"] },
      { id: "redes", label: "Links de tus redes o página actual", type: "text", hint: "Opcional" },
    ],
  },
  {
    title: "Lo que necesitas",
    questions: [
      { id: "objetivo", label: "¿Qué quieres lograr con tu sitio?", type: "choice", required: true,
        options: ["Que me conozcan y me pidan cotización o pedidos por WhatsApp", "Vender mis productos en línea", "Una tienda completa con funciones avanzadas (cuentas de cliente, inventario, panel propio)", "No estoy seguro"] },
      { id: "tipoVenta", label: "¿Qué vendes principalmente?", type: "choice", required: true,
        options: ["Servicios o trabajos por pedido", "Productos con existencias", "Las dos cosas"] },
      { id: "productos", label: "¿Cuántos productos diferentes vendes?", type: "choice", required: true,
        options: ["No vendo productos", "1 a 30", "31 a 100", "Más de 100"] },
      { id: "variantes", label: "¿Tus productos tienen tallas, colores, sabores o tamaños?", type: "choice", required: true,
        options: ["Sí", "No", "No aplica"] },
      { id: "pagos", label: "¿Cómo quieres que te paguen?", type: "choice", required: true,
        options: ["Transferencia o en persona (me escriben por WhatsApp)", "Un anticipo en línea y el resto después", "Pago completo en línea con tarjeta, OXXO o Mercado Pago"] },
      { id: "envios", label: "¿Haces envíos?", type: "choice", required: true,
        options: ["No, entrego en persona o recogen", "Solo en mi ciudad", "A todo México"] },
      { id: "pedidos", label: "¿Cuántos pedidos o clientes tienes al mes?", type: "choice", required: true,
        options: ["Menos de 20", "20 a 100", "100 a 500", "Más de 500"] },
      { id: "funciones", label: "¿Qué te gustaría que tuviera tu sitio?", type: "multi", hint: "Elige las que quieras",
        options: ["Galería de trabajos", "Formulario de cotización", "Agenda de citas o reservaciones", "Carrito y pago en línea", "Cuentas de cliente", "Códigos de descuento", "Control de inventario", "Asistente con inteligencia artificial", "Panel para administrar productos y pedidos", "Blog o noticias"] },
    ],
  },
  {
    title: "Material y cuentas",
    questions: [
      { id: "logo", label: "¿Tienes logo y colores de marca?", type: "choice", required: true, options: ["Sí, logo y colores", "Solo logo", "No tengo"] },
      { id: "fotos", label: "¿Tienes fotos de tus productos o trabajos?", type: "choice", required: true, options: ["Sí, profesionales", "Sí, del celular", "No tengo"] },
      { id: "contenido", label: "¿Tienes lista de productos o servicios con precios?", type: "choice", required: true, options: ["Sí, completa", "Más o menos", "No"] },
      { id: "dominio", label: "¿Ya tienes dominio (por ejemplo, tunegocio.com)?", type: "choice", required: true, options: ["Sí", "No", "No sé qué es"] },
      { id: "cobros", label: "¿Tienes RFC o cuenta para cobrar en línea (Mercado Pago, Stripe, PayPal)?", type: "choice", required: true, options: ["Sí", "No", "No sé"] },
    ],
  },
  {
    title: "Presupuesto y tiempos",
    questions: [
      { id: "presupuesto", label: "¿Cuánto tienes pensado invertir en la creación del sitio?", type: "choice", required: true,
        options: ["Menos de $6,000", "$6,000 a $12,000", "$12,000 a $16,000", "$16,000 a $25,000", "Más de $25,000", "No sé todavía"] },
      { id: "fecha", label: "¿Para cuándo lo necesitas?", type: "choice", required: true, options: ["Lo antes posible", "En un mes", "En 2 o 3 meses", "Sin prisa"] },
      { id: "mantenimiento", label: "¿Quién quieres que haga los cambios de tu sitio (productos, precios, promociones)?", type: "choice", required: true,
        options: ["Que tú te encargues de todo", "Sí, el Básico ($500 al mes)", "Sí, el Activo ($1,000 al mes)", "Yo lo actualizo", "No sé todavía"] },
      { id: "referencias", label: "Sitios web que te gusten (links)", type: "textarea", hint: "Opcional" },
      { id: "comentarios", label: "¿Algo más que deba saber?", type: "textarea", hint: "Opcional" },
    ],
  },
];
const ALL_QUESTIONS = STEPS.flatMap((s) => s.questions);

// ---------- Recomendación ----------
const PRO_FEATURES = ["Cuentas de cliente", "Control de inventario", "Asistente con inteligencia artificial", "Panel para administrar productos y pedidos"];
const STORE_FEATURES = ["Carrito y pago en línea", "Códigos de descuento"];

function recommend(a) {
  const features = a.funciones || [];
  const has = (list) => features.some((f) => list.includes(f));
  const sellsProducts = a.productos !== "No vendo productos" || a.tipoVenta === "Productos con existencias";
  const paysOnline = (a.pagos || "").startsWith("Pago completo");

  // Necesita tienda propia con funciones avanzadas
  const advanced = a.objetivo?.startsWith("Una tienda completa") || has(PRO_FEATURES) || a.productos === "Más de 100" || a.pedidos === "Más de 500" ||
    (a.productos === "31 a 100" && a.pedidos === "100 a 500");
  // La Pro es solo para negocios establecidos que quieren que Marcos administre el sitio
  const established = ["1 a 3 años", "Más de 3 años"].includes(a.antiguedad) && ["100 a 500", "Más de 500"].includes(a.pedidos);
  const wantsManagement = a.mantenimiento === "Que tú te encargues de todo" || a.mantenimiento?.startsWith("Sí, el Activo");

  let key = "servicios";
  if (advanced) {
    key = established && wantsManagement ? "pro" : "medida";
  } else if (a.objetivo === "Vender mis productos en línea" || (sellsProducts && (paysOnline || has(STORE_FEATURES) || a.envios === "A todo México"))) {
    key = "tienda";
  }

  // Notas para el cliente sobre lo que hará falta
  const notes = [];
  const budgetCap = { "Menos de $6,000": 6000, "$6,000 a $12,000": 12000, "$12,000 a $16,000": 16000, "$16,000 a $25,000": 25000 }[a.presupuesto];
  if (budgetCap && PACKAGES[key].price > budgetCap) notes.push("Este paquete está arriba de tu presupuesto. Podemos empezar con algo más sencillo y crecerlo después, o ver pagos en partes.");
  if (key === "tienda" && a.productos === "31 a 100") notes.push("Tienes más de 30 productos: los adicionales se cotizan aparte ($50 c/u).");
  if (a.dominio !== "Sí") notes.push("Hará falta comprar un dominio (aprox. $250–$500 al año). Te ayudo a elegirlo.");
  if (key !== "servicios" && a.cobros !== "Sí") notes.push("Para cobrar en línea necesitarás abrir una cuenta de Mercado Pago, Stripe o PayPal a nombre de tu negocio.");
  if (key === "medida" || key === "pro") notes.push("El servidor y la base de datos de tu tienda empiezan gratis y después cuestan aprox. $200–$1,000 al mes según tus ventas y visitas.");
  if (key === "tienda") notes.push("La plataforma de la tienda (Tiendanube o Shopify) tiene un plan gratis o desde aprox. $500 al mes.");
  if (a.fotos === "No tengo") notes.push("Unas buenas fotos hacen la diferencia: te doy tips para tomarlas con el celular.");
  if (features.includes("Agenda de citas o reservaciones")) notes.push("La agenda de citas se cotiza como extra.");

  const maintenance = key === "pro" ? "Incluido"
    : a.mantenimiento?.startsWith("Sí, el ") ? a.mantenimiento.replace(/^Sí, el /, "").replace(/ \(.*/, "")
    : (key !== "servicios" || a.pedidos === "100 a 500" || a.pedidos === "Más de 500") ? "Activo" : "Básico";
  if (key === "medida" && advanced && !established && wantsManagement) notes.push("Quieres que yo administre tu sitio: con la Tienda a la medida + mantenimiento Activo lo cubrimos. La Tienda Pro es para negocios ya establecidos.");

  return { key, pkg: PACKAGES[key], notes, maintenance };
}

// ---------- Estado ----------
let answers = {};
let step = 0;
try { const saved = JSON.parse(localStorage.getItem(STORE_KEY)); if (saved) ({ answers = {}, step = 0 } = saved); } catch {}
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify({ answers, step })); } catch {} };

const form = document.getElementById("quizForm");
const stepEl = document.getElementById("quizStep");
const errorEl = document.getElementById("quizError");
const resultEl = document.getElementById("result");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = (n) => "$" + n.toLocaleString("en-US");

function fieldHtml(q) {
  const label = `${esc(q.label)}${q.required ? "" : ` <span class="optional">${esc(q.hint || "Opcional")}</span>`}`;
  const hint = q.required && q.hint ? `<span class="hint">${esc(q.hint)}</span>` : "";
  const v = answers[q.id];
  if (q.type === "choice" || q.type === "multi") {
    const multi = q.type === "multi";
    const opts = q.options.map((o) => {
      const on = multi ? (v || []).includes(o) : v === o;
      return `<label class="option"><input type="${multi ? "checkbox" : "radio"}" name="${q.id}" value="${esc(o)}"${on ? " checked" : ""}><span>${esc(o)}</span></label>`;
    }).join("");
    const isOther = !multi && q.other && v && !q.options.includes(v);
    const other = q.other ? `<label class="option option-other"><input type="radio" name="${q.id}" value="__other"${isOther ? " checked" : ""}><span>Otro:</span><input type="text" class="other-input" data-other="${q.id}" value="${isOther ? esc(v) : ""}" aria-label="Otro"></label>` : "";
    return `<fieldset class="q" data-q="${q.id}"><legend>${label}</legend>${hint}<div class="options${q.options.length > 4 ? " options-grid" : ""}">${opts}${other}</div></fieldset>`;
  }
  const attrs = `id="q-${q.id}" name="${q.id}" ${q.autocomplete ? `autocomplete="${q.autocomplete}"` : ""}`;
  const input = q.type === "textarea"
    ? `<textarea ${attrs} rows="3">${esc(v)}</textarea>`
    : `<input ${attrs} type="${q.type}" value="${esc(v)}"${q.type === "tel" ? ' inputmode="numeric" maxlength="14"' : ""}>`;
  return `<div class="q" data-q="${q.id}"><label for="q-${q.id}">${label}</label>${hint}${input}</div>`;
}

function render() {
  const done = step >= STEPS.length;
  form.hidden = done;
  resultEl.hidden = !done;
  document.getElementById("quizIntro").hidden = done;
  document.getElementById("progressBar").style.width = `${Math.min(step, STEPS.length) / STEPS.length * 100}%`;
  document.getElementById("progressLabel").textContent = done ? "¡Listo!" : `Paso ${step + 1} de ${STEPS.length} · ${STEPS[step].title}`;
  errorEl.hidden = true;
  if (done) return renderResult();
  const s = STEPS[step];
  stepEl.innerHTML = `<h2>${esc(s.title)}</h2>${s.questions.map(fieldHtml).join("")}`;
  prevBtn.hidden = step === 0;
  nextBtn.textContent = step === STEPS.length - 1 ? "Ver mi recomendación" : "Siguiente";
}

function collect() {
  for (const q of STEPS[step].questions) {
    if (q.type === "multi") {
      answers[q.id] = [...form.querySelectorAll(`input[name="${q.id}"]:checked`)].map((i) => i.value);
    } else if (q.type === "choice") {
      const sel = form.querySelector(`input[name="${q.id}"]:checked`)?.value;
      answers[q.id] = sel === "__other" ? form.querySelector(`[data-other="${q.id}"]`).value.trim() : sel || "";
    } else {
      answers[q.id] = form.querySelector(`[name="${q.id}"]`).value.trim();
    }
  }
  save();
}

function validate() {
  form.querySelectorAll(".q.invalid").forEach((el) => el.classList.remove("invalid"));
  const bad = [];
  for (const q of STEPS[step].questions) {
    const v = answers[q.id];
    let ok = !q.required || (Array.isArray(v) ? v.length > 0 : !!v);
    if (ok && q.type === "tel" && v) ok = v.replace(/\D/g, "").length === 10;
    if (ok && q.type === "email" && v) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) bad.push(q);
  }
  bad.forEach((q) => form.querySelector(`[data-q="${q.id}"]`).classList.add("invalid"));
  if (bad.length) {
    const q = bad[0];
    errorEl.textContent = q.type === "tel" && answers[q.id] ? "Revisa tu WhatsApp: deben ser 10 dígitos."
      : q.type === "email" && answers[q.id] ? "Revisa tu correo." : "Contesta las preguntas marcadas para continuar.";
    errorEl.hidden = false;
    form.querySelector(`[data-q="${q.id}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
  }
  return !bad.length;
}

function summaryText(r) {
  const lines = [`Hola Marcos, contesté el cuestionario para mi sitio web.`, ``, `*Paquete recomendado:* ${r.pkg.name} (${money(r.pkg.price)} MXN)`, `*Mantenimiento sugerido:* ${r.maintenance}`, ``];
  for (const s of STEPS) {
    lines.push(`*${s.title}*`);
    for (const q of s.questions) {
      const v = answers[q.id];
      const text = Array.isArray(v) ? v.join(", ") : v;
      if (text) lines.push(`• ${q.label}: ${text}`);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}

function renderResult() {
  const r = recommend(answers);
  const first = (answers.nombre || "").split(" ")[0];
  const others = Object.entries(PACKAGES).filter(([k]) => k !== r.key);
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summaryText(r))}`;
  resultEl.innerHTML = `
    <p class="kicker">Tu recomendación</p>
    <h1>${first ? esc(first) + ", te" : "Te"} recomiendo la <em>${esc(r.pkg.name)}</em>.</h1>
    <article class="result-card">
      <div class="result-main">
        <p class="price">${money(r.pkg.price)} <span>MXN · pago único</span></p>
        <p>${esc(r.pkg.why)}</p>
        <ul>${r.pkg.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>
      <dl class="result-meta">
        <div><dt>Tiempo de entrega</dt><dd>${r.pkg.weeks}</dd></div>
        <div><dt>${r.key === "pro" ? "Administración" : "Mantenimiento sugerido"}</dt><dd>${r.key === "pro" ? "Incluida: yo hago los cambios" : `${esc(r.maintenance)} · ${r.maintenance === "Activo" ? "$1,000" : "$500"} al mes`}</dd></div>
        <div><dt>Forma de pago</dt><dd>50% para empezar, 50% al entregar</dd></div>
      </dl>
    </article>
    ${r.notes.length ? `<div class="result-notes"><h3>Toma en cuenta</h3><ul>${r.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>` : ""}
    <div class="result-send">
      <div>
        <h3>Último paso: mándame tus respuestas</h3>
        <p>Se abre WhatsApp con tus respuestas ya escritas. Solo dale enviar y te contesto con tu cotización final.</p>
      </div>
      <a class="btn btn-dark" href="${wa}" target="_blank" rel="noopener" id="sendWa">Enviar por WhatsApp</a>
    </div>
    <p class="result-others">Otras opciones: ${others.map(([, p]) => `${esc(p.name)} (${money(p.price)})`).join(" · ")}. <a href="${PRICES_DOC}" target="_blank" rel="noopener">Ver todos los detalles</a></p>
    <div class="quiz-nav">
      <button type="button" class="btn btn-ghost" id="editBtn">Cambiar respuestas</button>
      <button type="button" class="link-back" id="copyBtn">Copiar mis respuestas</button>
    </div>`;
  document.getElementById("editBtn").onclick = () => { step = 0; save(); render(); scrollTo({ top: 0 }); };
  document.getElementById("copyBtn").onclick = async (e) => {
    try { await navigator.clipboard.writeText(summaryText(r)); e.target.textContent = "¡Copiadas!"; } catch { e.target.textContent = "No se pudo copiar"; }
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  collect();
  if (!validate()) return;
  step++;
  save();
  render();
  scrollTo({ top: 0, behavior: "smooth" });
});
prevBtn.addEventListener("click", () => { collect(); step = Math.max(0, step - 1); save(); render(); scrollTo({ top: 0, behavior: "smooth" }); });
// Typing in "Otro" selects that option
form.addEventListener("input", (e) => {
  if (e.target.matches(".other-input")) form.querySelector(`input[name="${e.target.dataset.other}"][value="__other"]`).checked = true;
  e.target.closest(".q")?.classList.remove("invalid");
});
form.addEventListener("change", (e) => e.target.closest(".q")?.classList.remove("invalid"));

document.getElementById("year").textContent = new Date().getFullYear();
render();

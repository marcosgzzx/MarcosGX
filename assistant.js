// ---------- GymBro AI: the store assistant ----------
// Inside the claude.ai viewer it answers with Claude (the `sample` capability, on the visitor's own Claude
// account, asking their permission first). Elsewhere it falls back to quick answers from the store's own data.
const assistantEl = document.getElementById("assistant");
const assistantBtn = document.getElementById("assistantBtn");
const assistantLog = document.getElementById("assistantLog");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const assistantSend = document.getElementById("assistantSend");
const assistantMode = document.getElementById("assistantMode");

const aiPromise = window.claude?.use ? window.claude.use("sample").catch(() => null) : Promise.resolve(null);
let aiAvailable = null; // null = not known yet
aiPromise.then((s) => { aiAvailable = !!s; assistantMode.textContent = s ? "Responde con IA" : "Respuestas rápidas"; });

const chat = []; // {role, content} turns shown in the log (assistant turns are Claude's real replies)
let aiCtl = null;

// What the assistant knows: the live catalog and store policies, generated from the page's own data
function storeFacts() {
  const items = products.map((p) => {
    const sizes = p.sizes ? `tallas ${p.sizes.join(", ")}${p.soldOut?.length ? ` (agotadas: ${p.soldOut.join(", ")})` : ""}${p.lowStock?.length ? ` (últimas piezas: ${p.lowStock.join(", ")})` : ""}` : "";
    const pricing = p.sizePricing ? `precio ${money(priceOfBase(p))} en talla ${p.sizePricing.base}, cambia ${money(p.sizePricing.step)} por talla` : "";
    const packs = p.packs ? `presentaciones: ${p.packs.map((k) => `${k.name} ${money(k.price)}`).join(", ")}` : "";
    const flavors = p.flavors ? `sabores: ${p.flavors.map((f) => `${f.name}${f.price ? ` (${money(f.price)})` : ""}${f.limited ? " [edición limitada de otoño]" : ""} – ${f.facts.join(", ")}`).join("; ")}` : "";
    const colors = p.colors ? `colores: ${p.colors.map((c) => COLORS[c].name).join(", ")}` : "";
    return `- id=${p.id} | ${BRANDS[p.brand].name} ${p.name} | ${p.gender ? `para ${p.gender}` : "suplemento"} | categoría ${p.category}${p.alsoIn ? ` y ${p.alsoIn.join(", ")}` : ""} | ${p.desc} | ${[pricing || (!p.packs && !p.sizePricing ? `precio ${money(p.price)}` : ""), packs, colors, sizes, flavors].filter(Boolean).join(" | ")}`;
  }).join("\n");
  return `PRODUCTOS (precios en MXN):
${items}

POLÍTICAS:
- Envío gratis desde ${money(FREE_SHIP)} en productos; si no, cuesta ${money(SHIPPING_FEE)}.
- Devoluciones en 30 días: ropa y tenis sin usar con etiquetas, suplementos sellados. Primer cambio de talla gratis.
- Máximo ${MAX_ITEMS} productos por pedido.
- Pagos: tarjeta de crédito o débito, American Express, PayPal, Mercado Pago, efectivo en OXXO y tarjeta de regalo.
- Códigos de descuento: cada correo que se une al boletín ("Únete a los bros") y cada cuenta nueva recibe un código único de ${PROMO_PERCENT}% que funciona una sola vez.
- Tallas de tenis: talla mexicana = largo del pie en cm. Equivalencias: ${SHOE_SIZES.map((cm) => `${cm} cm = US ${SHOE_US[cm]}`).join(", ")}. Si está entre dos tallas, la mayor.
- La ropa de hombre es corte muscle fit (Gymshark Onyx); el top adidas usa tallas de mujer XS a XL.
- Esta tienda es un PROYECTO DE DEMOSTRACIÓN: no cobra ni envía pedidos y no está afiliada a las marcas.
- El sitio lo diseñó y desarrolló @marcossgzz__. Si preguntan quién lo hizo o cómo tener un sitio así, invítalos a escribirle por WhatsApp al +52 81 2598 0531 o por Instagram @marcossgzz__ (hay un botón verde de WhatsApp en la página).`;
}
const priceOfBase = (p) => priceOf(p, { size: p.sizePricing?.base, pack: p.defaultPack || p.packs?.[0]?.name, flavor: p.flavors?.[0]?.name, color: p.colors?.[0] });

const RULES = () => `Eres "GymBro", el asistente de la tienda en línea GYM BRO'S (ropa de gym, tenis y suplementos, en México). Responde en español mexicano, con buena onda pero claro y breve: 1 a 4 oraciones o una lista corta.

Reglas:
- Usa SOLO la información de la tienda de abajo. No inventes productos, precios, existencias, promociones ni fechas de entrega. Si no sabes algo, dilo y sugiere escribir al correo de contacto de la tienda.
- Cuando menciones un producto, agrega su etiqueta exacta {{id}} después de su nombre (por ejemplo: Cloud 6 {{on-cloud-6}}) para que la página muestre un botón para verlo.
- Para tallas, pregunta la medida si hace falta y usa la tabla de equivalencias.
- Sobre suplementos, da solo la información de la etiqueta que aparece abajo. No des consejos médicos ni de dosis; si preguntan por salud, embarazo, enfermedades o medicamentos, recomienda consultar a un médico.
- No puedes hacer pedidos, ver pedidos ni cambiar el carrito: explica cómo hacerlo en la página (botón "Agregar al carrito", luego el carrito y "Pagar").
- Si preguntan algo que no tiene que ver con la tienda o el entrenamiento, regresa amablemente al tema de la tienda.
- Si preguntan si es una tienda real, explica que es un proyecto de demostración.

INFORMACIÓN DE LA TIENDA:
${storeFacts()}`;

// ---------- Fallback answers (no AI available) ----------
function quickAnswer(q) {
  const t = fold(q);
  const has = (...w) => w.some((x) => t.includes(x));
  if (has("quien hizo", "quien creo", "quien diseno", "sitio asi", "pagina asi", "contratar", "desarrollador", "contacto"))
    return "Este sitio lo hizo @marcossgzz__. Si quieres uno así, escríbele por WhatsApp al +52 81 2598 0531 o por Instagram @marcossgzz__.";
  if (has("envio", "envia", "llega", "entrega")) return `El envío es gratis desde ${money(FREE_SHIP)} en productos; si no, cuesta ${money(SHIPPING_FEE)}. Esta tienda es una demostración, así que no se envían pedidos.`;
  if (has("devol", "cambio", "regres")) return "Tienes 30 días para devolver ropa y tenis sin usar, o suplementos sellados. El primer cambio de talla es gratis.";
  if (has("pago", "pagar", "tarjeta", "oxxo", "paypal", "mercado")) return "Aceptamos tarjeta de crédito o débito, American Express, PayPal, Mercado Pago, efectivo en OXXO y tarjeta de regalo.";
  if (has("codigo", "descuento", "cupon", "promo")) return `Al unirte a los bros o al crear tu cuenta recibes un código único de ${PROMO_PERCENT}%. Cada código funciona una sola vez.`;
  if (has("talla", "medida", "cm")) {
    const cm = (t.match(/(\d{2}(?:[.,]5)?)\s*cm/) || [])[1]?.replace(",", ".");
    if (cm && SHOE_US[cm]) return `Si tu pie mide ${cm} cm, tu talla de tenis es ${cm} MX (US ${SHOE_US[cm]}). Revisa la guía de tallas en las fotos de los tenis.`;
    return "En tenis, la talla mexicana es el largo de tu pie en cm (por ejemplo 26 cm = US 8). En las fotos de cada tenis está la guía de tallas.";
  }
  const hits = products.filter((p) => { const s = searchText(p); return fold(q).split(/\s+/).filter((w) => w.length > 2).some((w) => s.includes(w)); }).slice(0, 3);
  if (hits.length) return `Esto puede interesarte: ${hits.map((p) => `${BRANDS[p.brand].name} ${p.name} {{${p.id}}}`).join(", ")}.`;
  return "No encontré una respuesta para eso. Prueba a preguntar por un producto, tallas, envíos, pagos o devoluciones.";
}

// ---------- Rendering ----------
function renderMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg msg-${role === "user" ? "user" : "ai"}`;
  setMessageText(div, text);
  assistantLog.append(div);
  assistantLog.scrollTop = assistantLog.scrollHeight;
  return div;
}
// Text is escaped; **bold**, line breaks and {{product-id}} buttons are the only formatting
function setMessageText(div, text) {
  const links = [];
  let html = esc(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  html = html.replace(/\{\{([a-z0-9-]+)\}\}/g, (_, id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return "";
    links.push(id);
    return "";
  });
  div.innerHTML = html.replace(/\s+([.,;:!?])/g, "$1");
  const unique = [...new Set(links)];
  if (unique.length) {
    div.insertAdjacentHTML("beforeend", `<div class="msg-products">${unique.map((id) => {
      const p = products.find((x) => x.id === id);
      return `<button type="button" class="msg-product" data-open="${id}">Ver ${esc(p.name)}</button>`;
    }).join("")}</div>`);
  }
}

function openAssistant() {
  assistantEl.hidden = false;
  assistantBtn.setAttribute("aria-expanded", "true");
  assistantBtn.hidden = true;
  if (!assistantLog.children.length) {
    renderMessage("assistant", "¡Qué onda! Soy GymBro, el asistente de la tienda. Pregúntame por productos, tallas, envíos o pagos.");
  }
  assistantInput.focus();
}
function closeAssistant() {
  assistantEl.hidden = true;
  assistantBtn.hidden = false;
  assistantBtn.setAttribute("aria-expanded", "false");
  aiCtl?.abort();
}

async function ask(question) {
  question = question.trim().slice(0, 500);
  if (!question || aiCtl) return;
  document.getElementById("assistantSuggest").hidden = true;
  renderMessage("user", question);
  chat.push({ role: "user", content: question });
  const bubble = renderMessage("assistant", "Pensando…");
  bubble.classList.add("thinking");
  assistantSend.textContent = "Detener";
  assistantInput.value = "";

  const sample = await aiPromise;
  if (!sample) {
    const text = quickAnswer(question);
    bubble.classList.remove("thinking"); setMessageText(bubble, text);
    chat.push({ role: "assistant", content: text });
    assistantSend.textContent = "Enviar";
    return;
  }
  aiCtl = new AbortController();
  try {
    // Standing instructions + the last few turns of the conversation (the page keeps the chat)
    const turns = [{ role: "user", content: RULES() }, ...chat.slice(-10)];
    const { text } = await sample(turns, {
      modelTier: "quick", cache: false, signal: aiCtl.signal,
      onText: ({ text }) => { bubble.classList.remove("thinking"); setMessageText(bubble, text); assistantLog.scrollTop = assistantLog.scrollHeight; },
    });
    chat.push({ role: "assistant", content: text });
  } catch (e) {
    bubble.classList.remove("thinking");
    const kept = e.code === "refused" ? "" : e.text || "";
    const why = {
      cancelled: "",
      not_granted: "Para usar a GymBro con IA hay que darle permiso a la página. Mientras, te contesto con respuestas rápidas:",
      sampling_disabled: "La IA no está disponible en esta cuenta. Te contesto con respuestas rápidas:",
      rate_limited: "Hay muchas preguntas en este momento. Intenta de nuevo en un rato.",
      refused: "No puedo responder eso. Pregúntame sobre la tienda.",
    }[e.code] ?? "Algo falló al contestar. Intenta de nuevo.";
    if (["not_granted", "sampling_disabled", "capability_disabled", "not_declared"].includes(e.code)) {
      aiAvailable = false; assistantMode.textContent = "Respuestas rápidas";
      const text = quickAnswer(question);
      setMessageText(bubble, `${why}\n\n${text}`);
      chat.push({ role: "assistant", content: text });
    } else {
      setMessageText(bubble, [kept, why].filter(Boolean).join("\n\n") || "Respuesta detenida.");
      if (kept) chat.push({ role: "assistant", content: kept });
      else chat.pop(); // drop the unanswered question so the next call starts clean
    }
  } finally {
    aiCtl = null;
    assistantSend.textContent = "Enviar";
  }
}

assistantBtn.addEventListener("click", openAssistant);
document.getElementById("assistantClose").addEventListener("click", closeAssistant);
assistantForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (aiCtl) { aiCtl.abort(); return; } // the send button doubles as Stop while answering
  ask(assistantInput.value);
});
document.getElementById("assistantSuggest").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-ask]");
  if (chip) ask(chip.dataset.ask);
});
assistantEl.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAssistant(); });

/**
 * Marcos GX · Cuestionario para nuevos proyectos (Google Forms + Apps Script)
 *
 * Cómo usarlo:
 * 1. Entra a https://script.google.com con tu cuenta de Google y crea un "Proyecto nuevo".
 * 2. Borra lo que trae, pega todo este archivo y guarda.
 * 3. Arriba elige la función "crearCuestionario" y dale "Ejecutar". Acepta los permisos.
 * 4. En "Registro de ejecución" aparecen los links del formulario y de la hoja de respuestas.
 *
 * Cada vez que alguien conteste:
 * - Le llega un correo con el paquete que le recomiendas.
 * - A ti te llega un resumen con todas sus respuestas.
 * - La recomendación se guarda en la pestaña "Recomendaciones" de la hoja.
 *
 * Si cambias el texto de una pregunta aquí, vuelve a ejecutar crearCuestionario (crea un formulario nuevo).
 */

// ---------- Tus datos ----------
const MARCA = "Marcos GX";
const LEMA = "Website Creation and Management";
const WHATSAPP = "https://wa.me/528125980531";
const INSTAGRAM = "https://www.instagram.com/marcossgzz__/";
const PORTAFOLIO = "https://marcosgzzx.github.io/MarcosGX/portfolio/";
const PRECIOS = "https://claude.ai/artifact/53iAYFUTSxSc1n7oF1EkW6";

const PAQUETES = {
  servicios: {
    nombre: "Página de servicios",
    precio: "$5,850 MXN",
    porque: "Tu negocio vende por pedido o cotización, así que lo más útil es una página que muestre tus trabajos y precios y haga fácil pedirte una cotización por WhatsApp.",
    incluye: ["Diseño con tu marca", "Galería de trabajos", "Paquetes y precios", "Formulario de cotización", "WhatsApp y link de pago de anticipo", "Dominio propio y publicación"],
  },
  tienda: {
    nombre: "Tienda en línea",
    precio: "$11,200 MXN",
    porque: "Vendes productos y quieres que tus clientes compren y paguen en línea sin tener que escribirte uno por uno.",
    incluye: ["Tienda en Tiendanube o Shopify con tu diseño", "Hasta 30 productos cargados", "Pagos con tarjeta, OXXO y Mercado Pago", "Configuración de envíos", "Páginas legales", "Dominio propio y publicación"],
  },
  medida: {
    nombre: "Tienda a la medida",
    precio: "$15,350 MXN",
    porque: "Tu negocio maneja varios productos, variantes o pedidos y necesita su propia tienda con funciones avanzadas, que tú puedas administrar desde tu panel.",
    incluye: ["Tienda propia desarrollada a la medida", "Variantes, precios por talla e inventario", "Pagos en línea y códigos de descuento", "Cuentas de cliente con inicio de sesión con Google", "Panel para que administres productos y pedidos", "Dominio propio y publicación"],
  },
  pro: {
    nombre: "Tienda Pro",
    precio: "$22,670 MXN",
    porque: "Tu negocio ya está establecido y vende constantemente. Con la Tienda Pro tienes una tienda completa y yo me encargo de hacer los cambios para que tú solo te enfoques en vender.",
    incluye: ["Todo lo de Tienda a la medida", "Asistente con inteligencia artificial", "Administración básica incluida: yo hago los cambios en tu sitio", "Productos nuevos, precios, fotos y promociones de temporada", "Administración activa por $1,500 más (pago único)"],
  },
};

// ---------- Preguntas ----------
// Los títulos se usan para leer las respuestas: si cambias uno, cámbialo también en P.
const P = {
  nombre: "Tu nombre",
  negocio: "Nombre del negocio",
  whatsapp: "WhatsApp (10 dígitos)",
  ciudad: "Ciudad",
  giro: "¿A qué se dedica tu negocio?",
  descripcion: "Cuéntame en pocas palabras qué vendes y a quién",
  antiguedad: "¿Cuánto tiempo lleva tu negocio?",
  ventaHoy: "¿Cómo vendes hoy?",
  redes: "Links de tus redes sociales o página actual (si tienes)",
  objetivo: "¿Qué quieres lograr con tu sitio web?",
  tipoVenta: "¿Qué vendes principalmente?",
  productos: "¿Cuántos productos diferentes vendes?",
  variantes: "¿Tus productos tienen tallas, colores, sabores o tamaños?",
  pagos: "¿Cómo quieres que te paguen?",
  envios: "¿Haces envíos?",
  pedidos: "¿Cuántos pedidos o clientes tienes al mes, aproximadamente?",
  funciones: "¿Qué te gustaría que tuviera tu sitio?",
  logo: "¿Tienes logo y colores de marca?",
  fotos: "¿Tienes fotos de tus productos o trabajos?",
  contenido: "¿Tienes lista de productos o servicios con precios?",
  dominio: "¿Ya tienes dominio (por ejemplo, tunegocio.com)?",
  cobros: "¿Tienes RFC o cuenta para cobrar en línea (Mercado Pago, Stripe, PayPal)?",
  presupuesto: "¿Cuánto tienes pensado invertir en la creación del sitio?",
  fecha: "¿Para cuándo lo necesitas?",
  mantenimiento: "¿Quién quieres que haga los cambios de tu sitio (productos, precios, promociones)?",
  referencias: "Sitios web que te gusten (links), si tienes",
  comentarios: "¿Algo más que deba saber?",
};

const OPC = {
  objetivo: [
    "Que me conozcan y me pidan cotización o pedidos por WhatsApp",
    "Vender mis productos en línea",
    "Una tienda completa con funciones avanzadas (cuentas de cliente, inventario, panel propio)",
    "No estoy seguro",
  ],
  tipoVenta: [
    "Servicios o trabajos por pedido (eventos, decoración, repostería, servicios profesionales)",
    "Productos con existencias (ropa, accesorios, alimentos empacados)",
    "Las dos cosas",
  ],
  productos: ["No vendo productos", "1 a 30", "31 a 100", "Más de 100"],
  pedidos: ["Menos de 20", "20 a 100", "100 a 500", "Más de 500"],
  funciones: [
    "Galería de trabajos",
    "Formulario de cotización",
    "Agenda de citas o reservaciones",
    "Carrito y pago en línea",
    "Cuentas de cliente",
    "Códigos de descuento",
    "Control de inventario",
    "Asistente con inteligencia artificial",
    "Panel para administrar productos y pedidos",
    "Blog o noticias",
  ],
  presupuesto: ["Menos de $6,000", "$6,000 a $12,000", "$12,000 a $16,000", "$16,000 a $25,000", "Más de $25,000", "No sé todavía"],
  mantenimiento: ["Que tú te encargues de todo", "Sí, el Básico ($500 al mes)", "Sí, el Activo ($1,000 al mes)", "Yo lo actualizo", "No sé todavía"],
};

// Funciones que solo cubre bien la Tienda Pro
const FUNCIONES_PRO = ["Cuentas de cliente", "Control de inventario", "Asistente con inteligencia artificial", "Panel para administrar productos y pedidos"];
const FUNCIONES_TIENDA = ["Carrito y pago en línea", "Códigos de descuento"];

// ---------- Crear el formulario ----------
function crearCuestionario() {
  const form = FormApp.create(`${MARCA} · Cuestionario para tu sitio web`);
  form.setDescription(
    `¡Gracias por tu interés! Este cuestionario toma unos 5 minutos. Con tus respuestas preparo tu propuesta y te recomiendo el paquete que más le conviene a tu negocio.\n\n` +
    `Al terminar te llega la recomendación a tu correo.`
  );
  form.setCollectEmail(true);
  form.setProgressBar(true);
  form.setConfirmationMessage(`¡Listo! En unos minutos te llega a tu correo el paquete que te recomiendo. Si no lo ves, revisa tu carpeta de spam. Te contactaré por WhatsApp para platicar tu proyecto. — ${MARCA}`);

  const req = (item) => item.setRequired(true);

  // 1. Contacto
  req(form.addTextItem().setTitle(P.nombre));
  req(form.addTextItem().setTitle(P.negocio));
  req(form.addTextItem().setTitle(P.whatsapp).setValidation(
    FormApp.createTextValidation().setHelpText("Escribe 10 dígitos, sin espacios.").requireTextMatchesPattern("^[0-9]{10}$").build()
  ));
  req(form.addTextItem().setTitle(P.ciudad));

  // 2. Tu negocio
  form.addPageBreakItem().setTitle("Tu negocio");
  req(form.addMultipleChoiceItem().setTitle(P.giro)
    .setChoiceValues(["Ropa y accesorios", "Comida y repostería", "Eventos y decoración", "Belleza y cuidado personal", "Servicios profesionales", "Salud y deporte"])
    .showOtherOption(true));
  req(form.addParagraphTextItem().setTitle(P.descripcion));
  req(form.addMultipleChoiceItem().setTitle(P.antiguedad).setChoiceValues(["Estoy empezando", "Menos de 1 año", "1 a 3 años", "Más de 3 años"]));
  req(form.addCheckboxItem().setTitle(P.ventaHoy)
    .setChoiceValues(["WhatsApp", "Instagram o Facebook", "Local o tienda física", "Mercado Libre o Amazon", "Ya tengo página web", "Todavía no vendo"]));
  form.addTextItem().setTitle(P.redes);

  // 3. Lo que necesitas
  form.addPageBreakItem().setTitle("Lo que necesitas");
  req(form.addMultipleChoiceItem().setTitle(P.objetivo).setChoiceValues(OPC.objetivo));
  req(form.addMultipleChoiceItem().setTitle(P.tipoVenta).setChoiceValues(OPC.tipoVenta));
  req(form.addMultipleChoiceItem().setTitle(P.productos).setChoiceValues(OPC.productos));
  req(form.addMultipleChoiceItem().setTitle(P.variantes).setChoiceValues(["Sí", "No", "No aplica"]));
  req(form.addMultipleChoiceItem().setTitle(P.pagos).setChoiceValues([
    "Por transferencia o en persona (me escriben por WhatsApp)",
    "Un anticipo en línea y el resto después",
    "Pago completo en línea con tarjeta, OXXO o Mercado Pago",
  ]));
  req(form.addMultipleChoiceItem().setTitle(P.envios).setChoiceValues(["No, entrego en persona o recogen", "Solo en mi ciudad", "A todo México"]));
  req(form.addMultipleChoiceItem().setTitle(P.pedidos).setChoiceValues(OPC.pedidos));
  form.addCheckboxItem().setTitle(P.funciones).setChoiceValues(OPC.funciones).showOtherOption(true);

  // 4. Material y cuentas
  form.addPageBreakItem().setTitle("Material y cuentas")
    .setHelpText("No pasa nada si todavía no tienes algo: te ayudo a conseguirlo.");
  req(form.addMultipleChoiceItem().setTitle(P.logo).setChoiceValues(["Sí, logo y colores", "Solo logo", "No tengo"]));
  req(form.addMultipleChoiceItem().setTitle(P.fotos).setChoiceValues(["Sí, fotos profesionales", "Sí, tomadas con el celular", "No tengo"]));
  req(form.addMultipleChoiceItem().setTitle(P.contenido).setChoiceValues(["Sí, completa", "Más o menos", "No"]));
  req(form.addMultipleChoiceItem().setTitle(P.dominio).setChoiceValues(["Sí", "No", "No sé qué es"]));
  req(form.addMultipleChoiceItem().setTitle(P.cobros).setChoiceValues(["Sí", "No", "No sé"]));

  // 5. Presupuesto y tiempos
  form.addPageBreakItem().setTitle("Presupuesto y tiempos");
  req(form.addMultipleChoiceItem().setTitle(P.presupuesto).setChoiceValues(OPC.presupuesto));
  req(form.addMultipleChoiceItem().setTitle(P.fecha).setChoiceValues(["Lo antes posible", "En un mes", "En 2 o 3 meses", "Sin prisa"]));
  req(form.addMultipleChoiceItem().setTitle(P.mantenimiento).setChoiceValues(OPC.mantenimiento));
  form.addParagraphTextItem().setTitle(P.referencias);
  form.addParagraphTextItem().setTitle(P.comentarios);

  // Hoja de respuestas y aviso al recibir cada respuesta
  const hoja = SpreadsheetApp.create(`${MARCA} · Respuestas del cuestionario`);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, hoja.getId());
  const recs = hoja.insertSheet("Recomendaciones");
  recs.appendRow(["Fecha", "Nombre", "Negocio", "Correo", "WhatsApp", "Paquete recomendado", "Notas"]);
  recs.setFrozenRows(1);
  PropertiesService.getScriptProperties().setProperty("HOJA_ID", hoja.getId());

  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("alRecibirRespuesta").forForm(form).onFormSubmit().create();

  Logger.log("Formulario para compartir: " + form.getPublishedUrl());
  Logger.log("Editar formulario: " + form.getEditUrl());
  Logger.log("Hoja de respuestas: " + hoja.getUrl());
}

// ---------- Recomendación ----------
// Recibe las respuestas como { título de la pregunta: respuesta } y regresa el paquete y notas para ti.
function recomendar(r) {
  const funciones = [].concat(r[P.funciones] || []);
  const tiene = (lista) => funciones.some((f) => lista.includes(f));
  const objetivo = r[P.objetivo] || "";
  const productos = r[P.productos] || "";
  const pedidos = r[P.pedidos] || "";
  const vendeProductos = productos !== OPC.productos[0] || (r[P.tipoVenta] || "").startsWith("Productos");
  const pagoCompleto = (r[P.pagos] || "").startsWith("Pago completo");

  const avanzada =
    objetivo === OPC.objetivo[2] ||
    tiene(FUNCIONES_PRO) ||
    productos === "Más de 100" ||
    pedidos === "Más de 500" ||
    (productos === "31 a 100" && pedidos === "100 a 500");
  // La Pro es solo para negocios establecidos que quieren que tú administres el sitio
  const establecido = ["1 a 3 años", "Más de 3 años"].includes(r[P.antiguedad]) && ["100 a 500", "Más de 500"].includes(pedidos);
  const quiereAdmin = r[P.mantenimiento] === OPC.mantenimiento[0] || String(r[P.mantenimiento] || "").startsWith("Sí, el Activo");

  // Un negocio que apenas empieza o tiene menos de 1 año recibe como máximo la Tienda en línea
  const empezando = ["Estoy empezando", "Menos de 1 año"].includes(r[P.antiguedad]);

  let clave;
  if (avanzada && !empezando) {
    clave = establecido && quiereAdmin ? "pro" : "medida";
  } else if (
    objetivo === OPC.objetivo[1] ||
    (vendeProductos && (avanzada || pagoCompleto || tiene(FUNCIONES_TIENDA) || (r[P.envios] || "") === "A todo México"))
  ) {
    clave = "tienda";
  } else {
    clave = "servicios";
  }
  if (empezando && (clave === "medida" || clave === "pro")) clave = vendeProductos ? "tienda" : "servicios";
  // Tienda a la medida y Tienda Pro están en "próximamente": todavía no se recomiendan
  const proximamente = clave === "medida" || clave === "pro" ? PAQUETES[clave].nombre : null;
  if (proximamente) clave = vendeProductos ? "tienda" : "servicios";

  const notas = [];
  if (proximamente) notas.push(`Le convendría ${proximamente} (próximamente); se le recomendó ${PAQUETES[clave].nombre} mientras.`);
  if (empezando && avanzada) notas.push("Negocio empezando o con menos de 1 año: se le recomendó máximo Tienda en línea; ofrecer tienda a la medida cuando crezca.");
  const tope = { "Menos de $6,000": 6000, "$6,000 a $12,000": 12000, "$12,000 a $16,000": 16000, "$16,000 a $25,000": 25000 }[r[P.presupuesto]];
  const precio = { servicios: 5850, tienda: 11200, medida: 15350, pro: 22670 }[clave];
  if (tope && precio > tope) notas.push("Presupuesto menor al paquete: ofrecer empezar con uno más sencillo o pago en partes.");
  if (clave === "tienda" && productos === "31 a 100") notas.push("Más de 30 productos: cotizar productos extra.");
  if ((r[P.cobros] || "") !== "Sí" && clave !== "servicios") notas.push("Necesita abrir cuenta de cobro en línea (RFC/ID, CLABE).");
  if ((r[P.fotos] || "") === "No tengo") notas.push("No tiene fotos: considerar sesión o fotos con celular.");
  if ((r[P.dominio] || "") !== "Sí") notas.push("Hay que comprar dominio.");
  if (tiene(["Agenda de citas o reservaciones"])) notas.push("Pidió agenda de citas: cotizar como extra.");

  const mant = clave === "pro" ? "Administración básica incluida en la Tienda Pro (activa por $1,500 más, pago único)"
    : String(r[P.mantenimiento] || "").startsWith("Sí, el ") ? r[P.mantenimiento]
    : (clave !== "servicios" || pedidos === "100 a 500" || pedidos === "Más de 500") ? "Sugerir mantenimiento Activo" : "Sugerir mantenimiento Básico";
  notas.push(mant);

  return { clave, paquete: PAQUETES[clave], notas };
}

// ---------- Al recibir una respuesta ----------
function alRecibirRespuesta(e) {
  const resp = e.response;
  const r = {};
  resp.getItemResponses().forEach((ir) => { r[ir.getItem().getTitle()] = ir.getResponse(); });
  const correo = resp.getRespondentEmail();
  const { paquete, notas } = recomendar(r);
  const nombre = String(r[P.nombre] || "").trim().split(" ")[0] || "Hola";

  // Correo para el cliente
  if (correo) {
    MailApp.sendEmail({
      to: correo,
      name: MARCA,
      replyTo: Session.getEffectiveUser().getEmail(),
      subject: `${nombre}, este es el paquete que te recomiendo para ${r[P.negocio] || "tu negocio"}`,
      htmlBody: correoCliente(nombre, r[P.negocio], paquete),
    });
  }

  // Resumen para ti
  const filas = Object.keys(r).map((t) => `<tr><td style="padding:6px 12px 6px 0;color:#6a6862;vertical-align:top">${esc(t)}</td><td style="padding:6px 0">${esc([].concat(r[t]).join(", "))}</td></tr>`).join("");
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: `Nuevo cuestionario: ${r[P.negocio] || r[P.nombre]} → ${paquete.nombre}`,
    htmlBody:
      `<p><b>Paquete recomendado:</b> ${paquete.nombre} (${paquete.precio})</p>` +
      `<p><b>Notas:</b><br>${notas.map(esc).join("<br>")}</p>` +
      `<p><b>Correo:</b> ${esc(correo || "—")} · <b>WhatsApp:</b> <a href="https://wa.me/52${esc(r[P.whatsapp])}">${esc(r[P.whatsapp])}</a></p>` +
      `<table style="border-collapse:collapse;font-size:14px">${filas}</table>`,
  });

  // Guardar en la hoja
  const id = PropertiesService.getScriptProperties().getProperty("HOJA_ID");
  if (id) {
    SpreadsheetApp.openById(id).getSheetByName("Recomendaciones")
      .appendRow([new Date(), r[P.nombre], r[P.negocio], correo, r[P.whatsapp], paquete.nombre, notas.join(" · ")]);
  }
}

function correoCliente(nombre, negocio, paquete) {
  const lista = paquete.incluye.map((i) => `<li style="margin:4px 0">${esc(i)}</li>`).join("");
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#141414;line-height:1.55">
    <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#6a6862;margin:0">${MARCA} · ${LEMA}</p>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:30px;margin:12px 0 16px">¡Gracias, ${esc(nombre)}!</h1>
    <p>Con lo que me contaste sobre <b>${esc(negocio || "tu negocio")}</b>, este es el paquete que te recomiendo:</p>
    <div style="border:1px solid #dedbd3;border-radius:10px;padding:20px 24px;margin:20px 0;background:#fff">
      <p style="font-family:Georgia,serif;font-size:24px;margin:0">${paquete.nombre}</p>
      <p style="font-size:20px;margin:6px 0 12px;color:#2b4acb">${paquete.precio} <span style="font-size:13px;color:#6a6862">pago único</span></p>
      <p style="margin:0 0 12px;color:#444">${esc(paquete.porque)}</p>
      <ul style="padding-left:20px;margin:0">${lista}</ul>
    </div>
    <p>Esta es una recomendación inicial. Te escribo por WhatsApp para platicar los detalles y mandarte tu cotización final.</p>
    <p>
      <a href="${WHATSAPP}" style="display:inline-block;background:#141414;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px">Escríbeme por WhatsApp</a>
    </p>
    <p style="font-size:14px;color:#6a6862">
      <a href="${PRECIOS}" style="color:#2b4acb">Ver servicios, precios y condiciones</a> ·
      <a href="${PORTAFOLIO}" style="color:#2b4acb">Ver mi portafolio</a> ·
      <a href="${INSTAGRAM}" style="color:#2b4acb">Instagram</a>
    </p>
  </div>`;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

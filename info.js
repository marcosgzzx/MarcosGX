// ---------- Info pages: about this project and legal templates ----------
// The legal texts are sample templates for a demo store. A real store must have them reviewed by a lawyer.
const TEMPLATE_NOTE = `<p class="notice">Plantilla de ejemplo para esta tienda de demostración. Una tienda real debe revisarla con un abogado.</p>`;

const INFO_PAGES = {
  about: {
    title: "Sobre este proyecto",
    html: () => `
      <p>GYM BRO'S es una <strong>tienda en línea de demostración</strong> hecha para mostrar lo que se puede construir para un negocio real. No vende ni envía productos, y no está afiliada a las marcas que aparecen.</p>
      <h4>Lo que incluye</h4>
      <ul class="feature-list">
        <li><strong>Catálogo con variantes:</strong> colores, tallas, sabores y tamaños, cada uno con su foto y su precio.</li>
        <li><strong>Precios por talla</strong> y guía de tallas con equivalencias MX y US.</li>
        <li><strong>Inventario:</strong> tallas agotadas y avisos de "últimas piezas".</li>
        <li><strong>Página de producto</strong> con galería, detalles, opiniones de clientes y productos relacionados.</li>
        <li><strong>Búsqueda</strong> que entiende marcas, categorías, sabores y colores, y filtros por categoría, marca y público.</li>
        <li><strong>Carrito</strong> con límite por pedido y barra de envío gratis.</li>
        <li><strong>Pago en 3 pasos</strong> con códigos de descuento de un solo uso, tarjeta, Amex, PayPal, Mercado Pago, OXXO y tarjeta de regalo (en modo demostración).</li>
        <li><strong>Cuentas de cliente:</strong> perfil, direcciones, métodos de pago guardados, historial de pedidos y favoritos.</li>
        <li><strong>GymBro AI:</strong> asistente con inteligencia artificial que responde dudas sobre productos, tallas y envíos.</li>
        <li><strong>Diseño adaptable</strong> a celular, tableta y computadora, con fondo de fotos en movimiento al deslizar.</li>
      </ul>
      <h4>Para una tienda real se agrega</h4>
      <ul class="feature-list">
        <li>Cobros reales con Mercado Pago, Stripe o PayPal.</li>
        <li>Dominio propio, inicio de sesión con Google o Apple y base de datos en línea.</li>
        <li>Panel para que el dueño administre productos, precios, inventario y pedidos.</li>
        <li>Fotos, textos y páginas legales propias del negocio.</li>
      </ul>`,
  },
  privacy: {
    title: "Aviso de privacidad",
    html: () => `${TEMPLATE_NOTE}
      <p><strong>Responsable.</strong> GYM BRO'S (el "Responsable") es responsable del tratamiento de tus datos personales.</p>
      <p><strong>Datos que recabamos.</strong> Nombre, correo electrónico, teléfono, dirección de envío, historial de pedidos y, en su caso, preferencias de talla y sexo. No almacenamos números completos de tarjeta ni códigos de seguridad: los pagos los procesa un proveedor certificado.</p>
      <p><strong>Finalidades.</strong> Procesar y enviar tus pedidos, atender aclaraciones y devoluciones y, si lo autorizas, enviarte novedades y promociones.</p>
      <p><strong>Transferencias.</strong> Compartimos los datos necesarios con empresas de paquetería y procesadores de pago únicamente para cumplir tu pedido.</p>
      <p><strong>Derechos ARCO.</strong> Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos, o revocar tu consentimiento, escribiendo al correo de contacto de la tienda. Desde Mi cuenta puedes editar tu perfil o eliminar tu cuenta.</p>
      <p><strong>Cambios.</strong> Cualquier cambio a este aviso se publicará en esta página.</p>`,
  },
  terms: {
    title: "Términos y condiciones",
    html: () => `${TEMPLATE_NOTE}
      <p><strong>Precios.</strong> Todos los precios están en pesos mexicanos (MXN) e incluyen IVA. Algunos productos cambian de precio según la talla o el tamaño; el precio final se muestra antes de pagar.</p>
      <p><strong>Pedidos.</strong> Un pedido puede incluir hasta ${MAX_ITEMS} productos. El pedido se confirma cuando el pago es aprobado; los pagos en OXXO se confirman al registrarse el pago.</p>
      <p><strong>Envíos.</strong> El envío es gratis en pedidos desde ${money(FREE_SHIP)} en productos; en pedidos menores cuesta ${money(SHIPPING_FEE)}.</p>
      <p><strong>Códigos de descuento.</strong> Cada código de bienvenida es personal, vale ${PROMO_PERCENT}% y se puede usar una sola vez. No es acumulable ni canjeable por dinero.</p>
      <p><strong>Suplementos.</strong> Los suplementos no son medicamentos. Consulta a un profesional de la salud antes de consumirlos si tienes alguna condición médica.</p>
      <p><strong>Disponibilidad.</strong> Las existencias pueden cambiar sin aviso. Si un producto se agota después de tu compra, te ofreceremos un cambio o el reembolso completo.</p>`,
  },
  returns: {
    title: "Cambios y devoluciones",
    html: () => `${TEMPLATE_NOTE}
      <p><strong>Plazo.</strong> Tienes 30 días naturales desde que recibes tu pedido para solicitar un cambio o devolución.</p>
      <p><strong>Condiciones.</strong> La ropa y los tenis deben estar sin usar, con etiquetas y en su empaque original. Los suplementos deben estar sellados y sin abrir.</p>
      <p><strong>Cambios de talla.</strong> El primer cambio de talla es gratis, sujeto a disponibilidad. Si la nueva talla tiene otro precio, se cobra o reembolsa la diferencia.</p>
      <p><strong>Reembolsos.</strong> Se hacen al mismo método de pago en un plazo de 5 a 10 días hábiles después de recibir y revisar el producto.</p>
      <p><strong>Cómo solicitarlo.</strong> Desde Mi cuenta → Pedidos, o escribiendo al correo de contacto de la tienda con tu número de pedido.</p>`,
  },
};

const infoDialog = document.getElementById("infoDialog");
function openInfo(key) {
  const page = INFO_PAGES[key];
  if (!page) return;
  document.getElementById("infoTitle").textContent = page.title;
  document.getElementById("infoBody").innerHTML = page.html();
  document.getElementById("infoBody").scrollTop = 0;
  if (!infoDialog.open) infoDialog.showModal();
}
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-info]");
  if (link) openInfo(link.dataset.info);
});

// ---------- Demo test data ----------
// Card fields come pre-filled with a standard test card, so nobody types a real one into the demo.
const DEMO_CARD = { holder: "Cliente Demo", number: "4242 4242 4242 4242", amexNumber: "3782 822463 10005", exp: "12/30", cvv: "123", amexCvv: "1234" };
function prefillDemoCard(root) {
  root.querySelectorAll('input[name="number"]').forEach((input) => {
    const form = input.closest("form");
    const amex = form.querySelector('input[name="type"]:checked, input[name="method"]:checked')?.value === "amex";
    const set = (name, v) => { const el = form.querySelector(`input[name="${name}"]`); if (el && !el.value) el.value = v; };
    set("holder", DEMO_CARD.holder);
    set("number", amex ? DEMO_CARD.amexNumber : DEMO_CARD.number);
    set("exp", DEMO_CARD.exp);
    set("cvv", amex ? DEMO_CARD.amexCvv : DEMO_CARD.cvv);
    if (!form.querySelector(".demo-card-note")) {
      input.closest(".form-grid")?.insertAdjacentHTML("afterend", `<p class="hint demo-card-note">Tarjeta de prueba ya escrita. Esta tienda es una demostración: no escribas datos reales.</p>`);
    }
  });
  root.querySelectorAll('input[name="pin"]').forEach((el) => { if (!el.value) el.value = "1234"; });
  root.querySelectorAll('input[name="code"]').forEach((el) => { if (!el.value && el.closest("[data-gift]")) el.value = "DEMO-GIFT-CARD-0001"; });
}
// Checkout and account forms are re-rendered often: fill in whatever card fields appear
new MutationObserver(() => {
  prefillDemoCard(document.getElementById("checkoutBody"));
  prefillDemoCard(document.getElementById("accountBody"));
}).observe(document.body, { childList: true, subtree: true });

// ---------- Checkout (demo: no payment is processed) ----------
// Demo discount codes: edit or add codes here.
const DISCOUNTS = {
  BROS10: { type: "percent", value: 10, label: "10% de descuento" },
  ENVIOGRATIS: { type: "shipping", label: "Envío gratis" },
};
const SHIPPING_FEE = 149; // MXN, charged below FREE_SHIP

const CHECKOUT_TYPES = { ...PAY_TYPES, oxxo: { label: "Efectivo en OXXO", kind: "cash" } };
const NEW_METHOD_ORDER = ["credito", "debito", "amex", "paypal", "mercadopago", "oxxo", "regalo"];

const checkoutDialog = document.getElementById("checkoutDialog");
const checkoutBody = document.getElementById("checkoutBody");
const stepper = document.getElementById("stepper");
const co = { step: "summary", code: null, shipping: null, method: null, order: null };

function totals() {
  const subtotal = cartSubtotal();
  const d = co.code && DISCOUNTS[co.code];
  const discount = d?.type === "percent" ? Math.round(subtotal * d.value) / 100 : 0;
  const shipping = subtotal >= FREE_SHIP || d?.type === "shipping" ? 0 : SHIPPING_FEE;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

function totalsHtml() {
  const t = totals();
  return `<dl class="totals">
    <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
    ${t.discount ? `<div class="discount"><dt>Descuento (${co.code})</dt><dd>−${money(t.discount)}</dd></div>` : ""}
    <div><dt>Envío</dt><dd>${t.shipping ? money(t.shipping) : "Gratis"}</dd></div>
    <div class="grand"><dt>Total (MXN)</dt><dd>${money(t.total)}</dd></div>
  </dl>`;
}

function openCheckout() {
  if (!cart.length) return;
  closeCart();
  co.step = "summary";
  co.order = null;
  renderCheckout();
  checkoutDialog.showModal();
}

function renderCheckout() {
  const steps = ["summary", "shipping", "payment"];
  stepper.hidden = co.step === "done";
  stepper.querySelectorAll("li").forEach((li) => {
    const i = steps.indexOf(li.dataset.step), cur = steps.indexOf(co.step);
    li.classList.toggle("active", i === cur);
    li.classList.toggle("done", i < cur);
  });
  document.getElementById("checkoutTitle").textContent = co.step === "done" ? "¡Pedido confirmado!" : "Pagar";
  checkoutBody.innerHTML = { summary: summaryHtml, shipping: shippingHtml, payment: paymentHtml, done: doneHtml }[co.step]();
  checkoutBody.scrollTop = 0;
}

function summaryHtml() {
  const d = co.code && DISCOUNTS[co.code];
  return `
    <ul class="co-items">${cart.map((i) => {
      const p = products.find((x) => x.id === i.id);
      return `<li><span class="co-thumb">${media(p, i)}</span>
        <span class="co-name"><strong>${p.name}</strong><span class="muted">${variantLabel(i)} · ${i.qty} ${i.qty === 1 ? "pieza" : "piezas"}</span></span>
        <span class="co-price">${money(priceOf(p, i) * i.qty)}</span></li>`;
    }).join("")}</ul>
    <form class="discount-form" id="discountForm" novalidate>
      <label class="field"><span>Código de descuento</span>
        <div class="input-row"><input name="discount" id="discountCode" placeholder="Escribe tu código" autocomplete="off" value="${co.code || ""}" ${d ? "disabled" : ""}>
        ${d ? `<button type="button" class="btn btn-ghost" data-co="remove-code">Quitar</button>` : `<button class="btn btn-ghost" type="submit">Aplicar</button>`}</div>
      </label>
      ${d ? `<p class="code-ok">Código ${co.code} aplicado: ${d.label}.</p>` : ""}
    </form>
    ${totalsHtml()}
    ${totals().shipping ? `<p class="hint">Te faltan ${money(FREE_SHIP - totals().subtotal)} para el envío gratis.</p>` : ""}
    <div class="co-actions">
      <button type="button" class="btn btn-ghost" data-close>Seguir comprando</button>
      <button type="button" class="btn btn-primary" data-co="to-shipping">Continuar</button>
    </div>`;
}

function shippingHtml() {
  const user = getCurrentUser();
  const s = co.shipping || {
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "", ...(user?.address || {}),
  };
  return `
    ${user ? "" : `<div class="notice">¿Ya tienes cuenta? <button type="button" class="link-btn" data-co="login">Inicia sesión</button> para usar tu dirección y tus pagos guardados. También puedes seguir como invitado.</div>`}
    <form class="stack" id="shippingForm" novalidate>
      <div class="form-grid">
        <label class="field span-2"><span>Nombre completo</span><input name="name" id="shipName" value="${esc(s.name)}" autocomplete="name" required></label>
        <label class="field"><span>Correo electrónico</span><input name="email" id="shipEmail" type="email" value="${esc(s.email)}" autocomplete="email" required></label>
        <label class="field"><span>Teléfono (10 dígitos)</span><input name="phone" id="shipPhone" inputmode="tel" value="${esc(s.phone)}" autocomplete="tel" required></label>
        <label class="field span-2"><span>Calle y número</span><input name="street" id="shipStreet" value="${esc(s.street)}" autocomplete="address-line1" required></label>
        <label class="field"><span>Colonia</span><input name="colonia" id="shipColonia" value="${esc(s.colonia)}" autocomplete="address-line2" required></label>
        <label class="field"><span>Código postal</span><input name="cp" id="shipCp" inputmode="numeric" value="${esc(s.cp)}" autocomplete="postal-code" required></label>
        <label class="field"><span>Ciudad</span><input name="city" id="shipCity" value="${esc(s.city)}" autocomplete="address-level2" required></label>
        <label class="field"><span>Estado</span><select name="state" id="shipState" required><option value="">Elige…</option>${
          MX_STATES.map((x) => `<option ${x === s.state ? "selected" : ""}>${x}</option>`).join("")}</select></label>
      </div>
      ${user ? `<label class="check"><input type="checkbox" name="saveAddress" id="shipSave" checked> Guardar esta dirección en mi perfil</label>` : ""}
      <div class="co-actions form-actions">
        <button type="button" class="btn btn-ghost" data-co="to-summary">Atrás</button>
        <button class="btn btn-primary" type="submit">Continuar al pago</button>
      </div>
    </form>`;
}

function paymentHtml() {
  const user = getCurrentUser();
  const saved = user?.payments || [];
  if (!co.method) co.method = saved.length ? `saved:${user.defaultPayment || saved[0].id}` : "credito";
  const options = [
    ...saved.map((m) => [`saved:${m.id}`, payLabel(m), "Guardado"]),
    ...NEW_METHOD_ORDER.map((id) => [id, CHECKOUT_TYPES[id].label, saved.length ? "Nuevo" : ""]),
  ];
  return `
    <form class="stack" id="paymentForm" novalidate>
      <fieldset class="group">
        <legend>¿Cómo quieres pagar?</legend>
        <div class="pay-options">${options.map(([value, label, note]) =>
          `<label class="pay-option"><input type="radio" name="method" value="${value}" ${value === co.method ? "checked" : ""}>
            <span>${esc(label)}${note ? `<small>${note}</small>` : ""}</span></label>`).join("")}</div>
      </fieldset>
      <div id="coFields">${methodFieldsHtml()}</div>
      ${totalsHtml()}
      <p class="hint">Demo: no se cobra nada y no se guardan números completos de tarjeta. No ingreses datos reales.</p>
      <div class="co-actions form-actions">
        <button type="button" class="btn btn-ghost" data-co="to-shipping">Atrás</button>
        <button class="btn btn-primary" type="submit">Pagar ${money(totals().total)}</button>
      </div>
    </form>`;
}

function methodFieldsHtml() {
  const user = getCurrentUser();
  if (co.method.startsWith("saved:")) {
    const m = user.payments.find((x) => `saved:${x.id}` === co.method);
    if (m.kind === "card") {
      const amex = m.brand === "American Express";
      return `<label class="field narrow"><span>CVV de tu ${esc(m.brand)} •••• ${esc(m.last4)}</span>
        <input name="cvv" id="coSavedCvv" inputmode="numeric" placeholder="${amex ? "4 dígitos" : "3 dígitos"}" required></label>`;
    }
    if (m.kind === "gift") return `<label class="field narrow"><span>PIN de la tarjeta de regalo</span><input name="pin" id="coSavedPin" inputmode="numeric" placeholder="4 dígitos" required></label>`;
    return `<p class="hint">Pagarás con tu cuenta ${esc(PAY_TYPES[m.type].label)} (${esc(m.email)}).</p>`;
  }
  if (co.method === "oxxo") return `<p class="hint">Al confirmar te daremos una referencia para pagar en efectivo en cualquier tienda OXXO. Tu pedido se envía cuando se registre el pago.</p>`;
  return payFieldsHtml(co.method, "co-") + (user
    ? `<label class="check"><input type="checkbox" name="saveMethod" id="coSaveMethod"> Guardar este método en mi cuenta</label>` : "");
}

function doneHtml() {
  const o = co.order;
  return `
    <div class="done">
      <div class="done-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <p class="done-lead">Gracias, ${esc(o.customer.split(" ")[0])}. Tu pedido <strong>${o.id}</strong> está confirmado.</p>
      ${o.oxxoRef ? `<div class="oxxo-ref"><span>Referencia OXXO</span><strong>${o.oxxoRef}</strong><small>Paga ${money(o.total)} en efectivo en cualquier OXXO.</small></div>` : ""}
      <dl class="totals">
        <div><dt>Productos</dt><dd>${o.items.reduce((n, i) => n + i.qty, 0)}</dd></div>
        <div><dt>Pago</dt><dd>${esc(o.payment)}</dd></div>
        <div><dt>Envío a</dt><dd>${esc(o.shipTo)}</dd></div>
        <div class="grand"><dt>Total (MXN)</dt><dd>${money(o.total)}</dd></div>
      </dl>
      <p class="hint">Demo: no se realizó ningún cobro.</p>
      ${o.saved ? `<p class="muted">Puedes ver este pedido en Mi cuenta → Pedidos.</p>`
        : `<p class="muted"><button type="button" class="link-btn" data-co="register">Crea una cuenta</button> para guardar tus próximos pedidos.</p>`}
      <div class="co-actions"><button type="button" class="btn btn-primary" data-close>Seguir comprando</button></div>
    </div>`;
}

function placeOrder(paymentLabel, extra = {}) {
  const user = getCurrentUser();
  const t = totals();
  const s = co.shipping;
  const order = {
    id: `GB-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    date: new Date().toISOString(),
    customer: s.name,
    shipTo: `${s.street}, ${s.colonia}, ${s.cp} ${s.city}, ${s.state}`,
    items: cart.map((i) => {
      const p = products.find((x) => x.id === i.id);
      return { name: p.name, variant: variantLabel(i), qty: i.qty, price: priceOf(p, i) };
    }),
    subtotal: t.subtotal, discount: t.discount, code: t.discount || DISCOUNTS[co.code]?.type === "shipping" ? co.code : null,
    shipping: t.shipping, total: t.total, payment: paymentLabel,
    status: extra.oxxoRef ? "Pendiente de pago" : "Confirmado", ...extra,
  };
  if (user) {
    user.orders = [...(user.orders || []), order];
    saveCurrentUser(user);
    order.saved = true;
  }
  co.order = order;
  co.code = null;
  co.method = null;
  clearCart();
  co.step = "done";
  renderCheckout();
}

// ---------- Checkout events ----------
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

checkoutBody.addEventListener("click", (e) => {
  const act = e.target.closest("[data-co]")?.dataset.co;
  if (!act) return;
  if (act === "remove-code") { co.code = null; renderCheckout(); }
  if (act === "to-summary") { co.step = "summary"; renderCheckout(); }
  if (act === "to-shipping") { co.step = "shipping"; renderCheckout(); }
  if (act === "login") openAccount("login");
  if (act === "register") { checkoutDialog.close(); openAccount("register"); }
});

checkoutBody.addEventListener("change", (e) => {
  if (e.target.name === "method") {
    co.method = e.target.value;
    document.getElementById("coFields").innerHTML = methodFieldsHtml();
  }
});

checkoutBody.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const data = formData(form);

  if (form.id === "discountForm") {
    const code = (data.discount || "").trim().toUpperCase();
    if (!code) return setFormError(form, "Escribe un código.");
    if (!DISCOUNTS[code]) return setFormError(form, `El código "${code.replace(/[<>&"]/g, "")}" no existe o ya venció.`);
    co.code = code;
    toast(`Código ${code} aplicado`);
    renderCheckout();
  }

  if (form.id === "shippingForm") {
    const missing = ["name", "email", "phone", "street", "colonia", "cp", "city", "state"].find((k) => !(data[k] || "").trim());
    if (missing) return setFormError(form, "Completa todos los campos de envío.");
    if (!isEmail(data.email)) return setFormError(form, "Escribe un correo válido.");
    if (data.phone.length !== 10) return setFormError(form, "El teléfono debe tener 10 dígitos.");
    if (data.cp.length !== 5) return setFormError(form, "El código postal tiene 5 dígitos.");
    co.shipping = { ...data, name: data.name.trim(), email: normEmail(data.email) };
    const user = getCurrentUser();
    if (user && data.saveAddress) {
      user.phone ||= data.phone;
      user.address = { street: data.street.trim(), colonia: data.colonia.trim(), cp: data.cp, city: data.city.trim(), state: data.state };
      saveCurrentUser(user);
    }
    co.step = "payment";
    renderCheckout();
  }

  if (form.id === "paymentForm") {
    const user = getCurrentUser();
    if (co.method.startsWith("saved:")) {
      const m = user.payments.find((x) => `saved:${x.id}` === co.method);
      if (m.kind === "card" && digits(data.cvv || "").length !== (m.brand === "American Express" ? 4 : 3)) return setFormError(form, "Escribe el código de seguridad (CVV).");
      if (m.kind === "gift" && !/^\d{4}$/.test(data.pin || "")) return setFormError(form, "El PIN tiene 4 dígitos.");
      return placeOrder(payLabel(m));
    }
    if (co.method === "oxxo") {
      const ref = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join("").replace(/(\d{4})(?=\d)/g, "$1 ");
      return placeOrder("Efectivo en OXXO", { oxxoRef: ref });
    }
    const kind = PAY_TYPES[co.method].kind;
    const error = kind === "card" ? validateCard(co.method, data, true) : kind === "gift" ? validateGift(data)
      : isEmail(data.email || "") ? null : "Escribe un correo válido.";
    if (error) return setFormError(form, error);
    const method = methodFromForm(co.method, data);
    if (user && data.saveMethod) {
      user.payments = [...(user.payments || []), method];
      if (!user.defaultPayment) user.defaultPayment = method.id;
      saveCurrentUser(user);
    }
    placeOrder(payLabel(method));
  }
});

// Logging in from the shipping step fills in the saved address (only on login/logout, not on every save)
let checkoutEmail = getCurrentUser()?.email || null;
onAccountChange((user) => {
  const email = user?.email || null;
  if (email === checkoutEmail) return;
  checkoutEmail = email;
  // Never carry one person's address or payment choice over to another session
  co.shipping = null;
  co.method = null;
  if (checkoutDialog.open && co.step !== "done") renderCheckout();
});

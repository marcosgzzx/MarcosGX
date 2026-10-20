# GYM BRO'S

Static storefront prototype (in Spanish) for GYM BRO'S, an online shop that sells gym clothes (tees, shorts, socks) from several brands and Birdman supplements: Falcon protein and creatine monohydrate.

Prices are in Mexican pesos (MXN). The apparel brand names and prices in `script.js` are placeholders. Replace them with the real brands and prices the shop stocks.

## Run

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Files

- `index.html`: page structure (hero, categories, shop, brands, about, FAQ, newsletter, cart drawer, search/account/checkout dialogs)
- `assets/products/`: Birdman Falcon product photos with the background removed
- `assets/logo-dark.png`: the GYM BRO'S logo in black on a transparent background
- `styles.css`: styling and responsive layout
- `script.js`: brands, product catalog, filtering, sorting, search, variant selection and the cart (max 10 items), saved in `localStorage`
- `account.js`: demo accounts: sign up, log in, profile and address, favorite size, saved payment methods (credit, debit, Amex, PayPal, Mercado Pago, gift card), order history and settings
- `checkout.js`: three-step checkout (summary with discount code, shipping, payment) and the order confirmation. Demo discount codes live in `DISCOUNTS`

## Hero background clips

The hero can play short silent clips behind the headline, with a credit in the corner. Add clips to `HERO_CLIPS` in `script.js`; with none, the hero stays plain white.

Only use footage you have the right to use: your own, or stock with a free commercial license (Pexels, Pixabay, Mixkit). A credit does not make copyrighted clips (for example influencers' posts) usable, and recognizable people need to have agreed to appear in ads.

Prepare each clip with `tools/hero-clip.sh original.mp4 nombre [segundo-inicial]`, which writes a 720p, 12-second, silent WebM and MP4 to `assets/hero/`.

Accounts, payments, orders and the newsletter signup are demo-only: everything is stored in the visitor's browser and nothing is sent anywhere or charged. Passwords are stored hashed, card numbers only as brand + last 4 digits, and CVVs are never stored. A real store needs a backend and a payment provider (for example Stripe, Mercado Pago or PayPal) before taking real orders.

# GYM BRO'S

**Demo project:** a concept store built as a portfolio sample. It is not a real store and is not affiliated with Gymshark, adidas, On or Birdman; their names and product photos are used only as examples.

Static storefront prototype (in Spanish) for GYM BRO'S, an online shop that sells Gymshark training tees, On sneakers and Birdman supplements (Falcon protein and creatine monohydrate).

Prices are in Mexican pesos (MXN). Products and brands live in `products` and `BRANDS` in `script.js`; a category with no products shows "No hay productos disponibles".

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
- `checkout.js`: three-step checkout (summary with discount code, shipping, payment) and the order confirmation. Free shipping from a $1,200 product subtotal (`FREE_SHIP` in `script.js`); reusable demo codes live in `DISCOUNTS`
- `pdp.js`: product page (gallery, details, reviews, related products) and the wishlist
- `info.js`: "Sobre este proyecto", legal page templates (privacy, terms, returns) and the pre-filled test card for the demo checkout
- `assistant.js`: GymBro AI, the store assistant. Inside the claude.ai viewer it answers with Claude using the live catalog and store policies; elsewhere it falls back to quick answers built from the same data
- `promo.js`: single-use 10% codes (`BROS-XXXX-XXXX`), one per newsletter email and one per new account. Inside the claude.ai viewer they are kept in the artifact's shared database so each works only once anywhere; elsewhere they are kept in the browser

## Hero background clips

The hero can play short silent clips behind the headline, with a credit in the corner. Add clips to `HERO_CLIPS` in `script.js`; with none, the hero stays plain white.

Only use footage you have the right to use: your own, or stock with a free commercial license (Pexels, Pixabay, Mixkit). A credit does not make copyrighted clips (for example influencers' posts) usable, and recognizable people need to have agreed to appear in ads.

Prepare each clip with `tools/hero-clip.sh original.mp4 nombre [segundo-inicial]`, which writes a 720p, 12-second, silent WebM and MP4 to `assets/hero/`.

Accounts, payments, orders and the newsletter signup are demo-only and nothing is charged. Accounts are saved in the visitor's browser (`localStorage`, which is separate for every browser and device); when the page runs inside the claude.ai viewer they are also saved to the artifact's private per-viewer database, so they work on any device signed in to the same claude.ai account. Passwords are stored hashed, card numbers only as brand + last 4 digits, and CVVs are never stored. A real store needs a backend and a payment provider (for example Stripe, Mercado Pago or PayPal) before taking real orders.

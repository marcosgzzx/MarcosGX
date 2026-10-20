# GYM BRO'S

Static storefront prototype for GYM BRO'S, an online shop that sells gym clothes (tees, shorts, socks) from several brands and Birdman Falcon protein and creatine supplements.

The apparel brand names in `script.js` (`BRANDS`) are placeholders. Replace them with the real brands the shop stocks.

## Run

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Files

- `index.html`: page structure (hero, categories, shop, brands, FAQ, newsletter, cart drawer)
- `assets/products/`: Birdman Falcon product photos with the background removed
- `assets/logo-light.png`: the GYM BRO'S logo, recolored for the dark background
- `styles.css`: styling and responsive layout
- `script.js`: brands, product catalog, filtering by category or brand, variant selection and a cart saved in `localStorage`

Checkout and newsletter signup are demo-only; nothing is sent anywhere.

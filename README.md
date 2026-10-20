# GYM bros

Static storefront prototype for GYM bros, a gym clothing and supplements brand selling tees, shorts, socks, organic protein powder and creatine.

## Run

No build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Files

- `index.html`: page structure (hero, categories, shop, about, FAQ, newsletter, cart drawer)
- `styles.css`: styling and responsive layout
- `script.js`: product catalog, filtering, variant selection and a cart saved in `localStorage`

Checkout and newsletter signup are demo-only; nothing is sent anywhere.

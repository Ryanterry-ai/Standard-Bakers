# Standard Bakers — Standalone Website

Zero runtime dependencies. Deploy the entire folder as-is.

## Deploy to Vercel
```
npm i -g vercel
cd standard-bakers
vercel --prod
```

## Deploy to Hostinger / any static host
Upload the entire `standard-bakers/` folder contents to `public_html/`.

## File structure
```
index.html        ← entry point
css/style.css     ← all styles
js/data.js        ← product data, outlet config, offers
js/app.js         ← all interactions
vercel.json       ← cache + security headers
```

## Update products
Edit `js/data.js` → `PRODUCTS` array.
Each product: id, name, price, original (nullable), category, badge, outlets[], emoji.

## Update offers
Edit `js/data.js` → `SITE.offer`:
- Set `active: false` to hide the banner.
- Set `expires` date to auto-hide.

## Update WhatsApp numbers
Edit `js/data.js` → `SITE.outlets[].whatsapp` per outlet.

## Add real product photos
Replace emoji in `product-img` div with:
```html
<img src="images/black-forest.webp" alt="Black Forest Cake" width="160" height="96" loading="lazy">
```
Images should be WebP, max 80kb each.

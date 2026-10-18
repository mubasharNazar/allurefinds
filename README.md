# AllureFinds

A fast, elegant static storefront for **AllureFinds** — custom gifts, corporate hampers, printing and event management.

Built with plain HTML, CSS and JavaScript (no build step), so it runs on GitHub Pages as-is.

## Features

- Home page with hero, category bento grid, bestsellers, event showcase, animated stats, client marquee, testimonials and a quote form
- Shop with category pills, live search, sorting and deep-linkable URLs (`shop.html?cat=mugs`, `shop.html?q=pen`)
- Product pages with image gallery and hover zoom, finish/branding options, personalisation notes, quantity-based bulk pricing tiers
- Bag (cart) drawer and cart page saved in `localStorage`; checkout sends an itemised order to WhatsApp
- Wishlist, site-wide search overlay (press `/`), event gallery with filters and lightbox
- About (story, values, FAQ), Contact (quote form + map) and Legal (privacy, terms, cookies) pages
- Responsive, accessible, respects reduced-motion

## Customise

Everything content-related lives in [`assets/js/data.js`](assets/js/data.js):

- `SITE` — business name, **WhatsApp number**, phone, email, addresses, hours, socials
- `CATEGORIES`, `PRODUCTS` — catalogue, prices, options and images
- `EVENTS`, `CLIENTS`, `TESTIMONIALS`

> Replace the placeholder WhatsApp number (`923000000000`) and contact details before going live.

## Run locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

Photos are from [Unsplash](https://unsplash.com).

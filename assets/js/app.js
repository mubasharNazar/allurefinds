/* =========================================================
   AllureFinds — shared layout, cart, wishlist & page logic
   Depends on data.js (SITE, CATEGORIES, PRODUCTS, EVENTS ...)
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const page = document.body.dataset.page || "";
  const params = new URLSearchParams(location.search);
  const fmt = (n) => `${SITE.currency} ${Math.round(n).toLocaleString("en-PK")}`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
  const productById = (id) => PRODUCTS.find((p) => p.id === id);
  const tiersFor = (p) => p.tiers || DEFAULT_TIERS;
  const tierFor = (p, qty) => tiersFor(p).filter((t) => qty >= t.min).pop() || tiersFor(p)[0];
  const unitPrice = (p, qty) => p.price * (1 - tierFor(p, qty).off / 100);
  const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
    }
  };

  /* ---------- Icons ---------- */
  const I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.7 4 7.1 4c2 0 3.6 1.1 4.9 2.8C13.3 5.1 14.9 4 16.9 4c3.4 0 5.7 3.4 4.4 6.8C19.5 15.4 12 20 12 20Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16M4 16h10"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m15 6-6 6 6 6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8ZM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.4V11H7v4h3v9h4v-9h3l.5-4H14V8.7c0-.5.3-.7.7-.7Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v7h14v-7M12 8v12M12 8S10.5 3 8 4s-1 4 4 4c5 0 6.5-3 4-4s-4 4-4 4"/></svg>'
  };

  /* ---------- Cart & wishlist state ---------- */
  const CART_KEY = "allure_cart_v1";
  const WISH_KEY = "allure_wish_v1";
  let cart = store.get(CART_KEY, []).filter((i) => productById(i.id));
  let wish = store.get(WISH_KEY, []).filter((id) => productById(id));

  const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => cart.reduce((s, i) => s + unitPrice(productById(i.id), i.qty) * i.qty, 0);
  const cartSubtotal = () => cart.reduce((s, i) => s + productById(i.id).price * i.qty, 0);

  function saveCart() {
    store.set(CART_KEY, cart);
    updateBadges(true);
    renderMiniCart();
    if (page === "cart") renderCartPage();
  }
  function addToCart(id, qty = 1, opts = {}) {
    const p = productById(id);
    if (!p) return;
    const finish = opts.finish || (p.options.finish || [])[0] || "";
    const branding = opts.branding || (p.options.branding || [])[0] || "";
    const note = opts.note || "";
    const key = [id, finish, branding, note].join("|");
    const existing = cart.find((i) => i.key === key);
    if (existing) existing.qty += qty;
    else cart.push({ key, id, qty, finish, branding, note });
    saveCart();
    toast(`<img src="${IMG(p.img[0], 120)}" alt=""><span><b>${esc(p.name)}</b> added to your bag</span><a href="cart.html">View bag</a>`);
  }
  function setQty(key, qty) {
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, Math.min(10000, qty | 0));
    saveCart();
  }
  function removeItem(key) {
    cart = cart.filter((i) => i.key !== key);
    saveCart();
  }
  function toggleWish(id) {
    const on = !wish.includes(id);
    wish = on ? [...wish, id] : wish.filter((w) => w !== id);
    store.set(WISH_KEY, wish);
    $$(`[data-wish="${id}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    updateBadges();
    if (on) toast(`<span>Saved to your wishlist</span><a href="wishlist.html">View</a>`);
    if (page === "wishlist") renderWishlist();
  }
  function updateBadges(bump = false) {
    const c = cart.length, w = wish.length;
    $$("[data-cart-count]").forEach((b) => {
      b.textContent = c > 99 ? "99+" : c;
      b.classList.toggle("show", c > 0);
      if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    });
    $$("[data-wish-count]").forEach((b) => { b.textContent = w; b.classList.toggle("show", w > 0); });
  }

  function orderMessage(extra = {}) {
    const lines = [`Hello ${SITE.name}! I'd like to place an order:`, ""];
    cart.forEach((i, n) => {
      const p = productById(i.id);
      lines.push(`${n + 1}. ${p.name} × ${i.qty}`);
      lines.push(`   Finish: ${i.finish} · Branding: ${i.branding}`);
      if (i.note) lines.push(`   Note: ${i.note}`);
      lines.push(`   ${fmt(unitPrice(p, i.qty))} each = ${fmt(unitPrice(p, i.qty) * i.qty)}`);
    });
    lines.push("", `Estimated total: ${fmt(cartTotal())}`);
    if (extra.name) lines.push("", `Name: ${extra.name}`);
    if (extra.phone) lines.push(`Phone: ${extra.phone}`);
    if (extra.city) lines.push(`City: ${extra.city}`);
    if (extra.date) lines.push(`Needed by: ${extra.date}`);
    if (extra.notes) lines.push(`Notes: ${extra.notes}`);
    return lines.join("\n");
  }

  /* ---------- Toasts ---------- */
  function toast(html) {
    let stack = $(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; stack.setAttribute("role", "status"); document.body.append(stack); }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = html;
    stack.append(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 400); }, 3200);
  }

  /* ---------- Shared layout ---------- */
  function logo() {
    return `<a href="index.html" class="logo" aria-label="${SITE.name} home">
      <span class="logo-mark">A</span>
      <span><span class="logo-text">Allure<em>Finds</em></span><span class="logo-sub">Gifts · Print · Events</span></span>
    </a>`;
  }

  function renderLayout() {
    const navItems = [
      ["index.html", "Home", "home"],
      ["shop.html", "Shop", "shop"],
      ["events.html", "Events", "events"],
      ["about.html", "About", "about"],
      ["contact.html", "Contact", "contact"]
    ];
    const mega = `<div class="mega">${CATEGORIES.map((c) => `
      <a href="shop.html?cat=${c.slug}"><img src="${IMG(c.img, 120)}" alt="" loading="lazy"><span><strong>${c.name}</strong><small>${c.blurb}</small></span></a>`).join("")}</div>`;

    const msg = `Ordering in bulk? <a href="contact.html#quote">Get a quote</a> — the bigger the order, the better the price`;
    const msgs = [msg, "Free logo mock-up with every order", "Countrywide delivery across Pakistan", "Single pieces to 10,000+ units"];
    const track = [...msgs, ...msgs, ...msgs, ...msgs].map((m) => `<span>${m}</span>`).join("");

    const header = document.createElement("div");
    header.innerHTML = `
      <div class="announce" role="region" aria-label="Announcements"><div class="announce-track">${track}</div></div>
      <header class="site-header">
        <div class="container header-inner">
          <button class="icon-btn menu-toggle" data-open="menu" aria-label="Open menu">${I.menu}</button>
          ${logo()}
          <nav class="nav" aria-label="Main">
            ${navItems.map(([href, label, key]) => key === "shop"
              ? `<div class="has-mega"><a href="${href}" class="${page === key || page === "product" ? "active" : ""}">${label}</a>${mega}</div>`
              : `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`).join("")}
          </nav>
          <div class="header-actions">
            <button class="icon-btn" data-open="search" aria-label="Search">${I.search}</button>
            <a class="icon-btn wish-link" href="wishlist.html" aria-label="Wishlist">${I.heart}<span class="badge-count" data-wish-count>0</span></a>
            <button class="icon-btn" data-open="cart" aria-label="Open bag">${I.bag}<span class="badge-count" data-cart-count>0</span></button>
            <a href="contact.html#quote" class="btn btn-sm header-cta">Get a Quote</a>
          </div>
        </div>
      </header>`;
    document.body.prepend(...header.children);

    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-about">
            ${logo()}
            <p>${SITE.tagline}. Thoughtfully branded gifts and end-to-end corporate events — designed in Islamabad, delivered countrywide.</p>
            <ul class="footer-contact">
              <li><a href="tel:+${SITE.whatsapp}">${SITE.phoneDisplay}</a></li>
              <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
              ${SITE.addresses.map((a) => `<li>${a}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h5>Shop</h5>
            <ul class="footer-links">${CATEGORIES.map((c) => `<li><a href="shop.html?cat=${c.slug}">${c.name}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul class="footer-links">
              <li><a href="about.html">About Us</a></li>
              <li><a href="events.html">Event Gallery</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="contact.html#quote">Request a Quote</a></li>
              <li><a href="wishlist.html">Wishlist</a></li>
            </ul>
            <h5 style="margin-top:2rem">Legal</h5>
            <ul class="footer-links">
              <li><a href="legal.html#privacy">Privacy Policy</a></li>
              <li><a href="legal.html#terms">Terms &amp; Conditions</a></li>
              <li><a href="legal.html#cookies">Cookies Policy</a></li>
            </ul>
          </div>
          <div>
            <h5>The Allure Letter</h5>
            <p>New collections, festive gifting guides and bulk-order offers. No spam, ever.</p>
            <form class="newsletter" data-newsletter>
              <label class="sr-only" for="nl-email">Email</label>
              <input id="nl-email" type="email" placeholder="Your email" required>
              <button class="btn btn-gold btn-sm" type="submit">Join</button>
            </form>
            <div class="socials">
              <a href="${SITE.socials.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}</a>
              <a href="${SITE.socials.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.facebook}</a>
              <a href="${SITE.socials.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${I.linkedin}</a>
              <a href="${waLink("Hello AllureFinds!")}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.whatsapp}</a>
            </div>
          </div>
        </div>
        <div class="footer-giant" aria-hidden="true">AllureFinds</div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</span>
          <span><a href="legal.html#privacy">Privacy</a> · <a href="legal.html#terms">Terms</a> · <a href="legal.html#cookies">Cookies</a></span>
        </div>
      </div>`;
    document.body.append(footer);

    const overlays = document.createElement("div");
    overlays.innerHTML = `
      <div class="drawer-backdrop" data-close></div>
      <aside class="drawer drawer-left" id="menu-drawer" aria-label="Menu" aria-hidden="true">
        <div class="drawer-head">${logo()}<button class="icon-btn" data-close aria-label="Close menu">${I.close}</button></div>
        <div class="drawer-body mobile-nav">
          <a href="index.html">Home ${I.arrow}</a>
          <a href="shop.html">Shop all ${I.arrow}</a>
          <div class="sub">${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.slug}">${c.name}</a>`).join("")}</div>
          <a href="events.html">Event Gallery ${I.arrow}</a>
          <a href="about.html">About ${I.arrow}</a>
          <a href="contact.html">Contact ${I.arrow}</a>
          <a href="wishlist.html">Wishlist ${I.arrow}</a>
        </div>
        <div class="drawer-foot"><a href="contact.html#quote" class="btn btn-block">Get a Quote</a></div>
      </aside>
      <aside class="drawer drawer-right" id="cart-drawer" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer-head"><h3>Your Bag</h3><button class="icon-btn" data-close aria-label="Close bag">${I.close}</button></div>
        <div class="drawer-body" data-mini-cart></div>
        <div class="drawer-foot" data-mini-foot></div>
      </aside>
      <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
        <div class="container search-box">
          <div class="search-input-wrap">
            ${I.search.replace("<svg", '<svg width="34" height="34"')}
            <input type="search" placeholder="Search gifts…" aria-label="Search products" data-search-input>
            <button class="icon-btn" data-close aria-label="Close search">${I.close}</button>
          </div>
          <div class="search-hint" data-search-hint>Popular:
            ${["Pen", "Hamper", "Diary", "Hoodie", "Mug", "Bottle"].map((t) => `<button type="button" data-term="${t}">${t}</button>`).join("")}
          </div>
          <div class="search-results product-grid cols-4" data-search-results></div>
        </div>
      </div>
      <a class="wa-float" href="${waLink("Hello AllureFinds! I'd like to know more about your custom gifts.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.whatsapp}</a>
      <button class="to-top" aria-label="Back to top">${I.arrowUp}</button>`;
    document.body.append(...overlays.children);
  }

  /* ---------- Overlays (drawers, search) ---------- */
  let openPanel = null;
  function openOverlay(name) {
    closeOverlay();
    const el = name === "menu" ? $("#menu-drawer") : name === "cart" ? $("#cart-drawer") : $("#search-overlay");
    if (!el) return;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    if (name !== "search") $(".drawer-backdrop").classList.add("open");
    document.body.style.overflow = "hidden";
    openPanel = el;
    if (name === "search") setTimeout(() => $("[data-search-input]").focus(), 60);
    if (name === "cart") renderMiniCart();
  }
  function closeOverlay() {
    if (!openPanel) return;
    openPanel.classList.remove("open");
    openPanel.setAttribute("aria-hidden", "true");
    $(".drawer-backdrop").classList.remove("open");
    document.body.style.overflow = "";
    openPanel = null;
  }

  function renderMiniCart() {
    const body = $("[data-mini-cart]"), foot = $("[data-mini-foot]");
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = `<div class="empty-state">${I.gift}<h3>Your bag is empty</h3><p>Discover gifts your team and clients will treasure.</p><a href="shop.html" class="btn">Start shopping</a></div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = cart.map((i) => {
      const p = productById(i.id);
      return `<div class="mini-item">
        <img src="${IMG(p.img[0], 160)}" alt="${esc(p.name)}">
        <div><h4>${esc(p.name)}</h4><small>${esc(i.finish)} · ${esc(i.branding)}</small>
          <div class="qty sm" style="margin-top:.4rem"><button data-dec="${esc(i.key)}" aria-label="Decrease">−</button><input value="${i.qty}" data-qty="${esc(i.key)}" inputmode="numeric" aria-label="Quantity"><button data-inc="${esc(i.key)}" aria-label="Increase">+</button></div>
        </div>
        <div style="text-align:right"><div class="price">${fmt(unitPrice(p, i.qty) * i.qty)}</div><button class="remove-btn" data-remove="${esc(i.key)}">Remove</button></div>
      </div>`;
    }).join("");
    const savings = cartSubtotal() - cartTotal();
    foot.innerHTML = `
      ${savings > 0 ? `<div class="totals-row" style="color:var(--success)"><span>Bulk savings</span><span>− ${fmt(savings)}</span></div>` : ""}
      <div class="totals-row grand"><span>Estimated total</span><span>${fmt(cartTotal())}</span></div>
      <div style="display:grid;gap:.6rem">
        <a href="cart.html" class="btn btn-block">Review &amp; checkout</a>
        <a href="${waLink(orderMessage())}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">${I.whatsapp} Order via WhatsApp</a>
      </div>`;
  }

  /* ---------- Product card ---------- */
  function productCard(p, i = 0) {
    const cat = catBySlug(p.cat);
    const on = wish.includes(p.id);
    const tag = p.badge ? `<span class="product-tag ${["Premium", "Signature"].includes(p.badge) ? "dark" : ""}">${p.badge}</span>` : "";
    return `<article class="product-card reveal reveal-delay-${i % 4}">
      <div class="product-media">
        ${tag}
        <button class="wish-btn ${on ? "on" : ""}" data-wish="${p.id}" aria-pressed="${on}" aria-label="Save ${esc(p.name)} to wishlist">${I.heart}</button>
        <a href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
          <img class="main" src="${IMG(p.img[0], 700)}" alt="${esc(p.name)}" loading="lazy">
          ${p.img[1] ? `<img class="alt" src="${IMG(p.img[1], 700)}" alt="" loading="lazy">` : ""}
        </a>
        <div class="quick-add"><button class="btn btn-block btn-sm" data-add="${p.id}">${I.bag.replace("<svg", '<svg width="16" height="16"')} Add to bag</button></div>
      </div>
      <div class="product-info">
        <span class="cat">${cat ? cat.name : ""}</span>
        <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="price"><small>from</small> ${fmt(p.price)}</div>
      </div>
    </article>`;
  }

  /* ---------- Global events ---------- */
  function bindGlobal() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open],[data-close],[data-add],[data-wish],[data-inc],[data-dec],[data-remove],[data-term],.to-top");
      if (!t) return;
      if (t.dataset.open) { e.preventDefault(); openOverlay(t.dataset.open); }
      else if (t.hasAttribute("data-close")) closeOverlay();
      else if (t.dataset.add) { e.preventDefault(); addToCart(t.dataset.add, 1); }
      else if (t.dataset.wish) { e.preventDefault(); toggleWish(t.dataset.wish); }
      else if (t.dataset.inc) { const it = cart.find((c) => c.key === t.dataset.inc); setQty(it.key, it.qty + 1); }
      else if (t.dataset.dec) { const it = cart.find((c) => c.key === t.dataset.dec); setQty(it.key, it.qty - 1); }
      else if (t.dataset.remove) removeItem(t.dataset.remove);
      else if (t.dataset.term) { const inp = $("[data-search-input]"); inp.value = t.dataset.term; inp.dispatchEvent(new Event("input")); }
      else if (t.classList.contains("to-top")) window.scrollTo({ top: 0 });
    });
    document.addEventListener("change", (e) => {
      if (e.target.dataset.qty) setQty(e.target.dataset.qty, parseInt(e.target.value, 10) || 1);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeOverlay(); closeLightbox(); }
      if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openOverlay("search"); }
    });

    const input = $("[data-search-input]");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const results = $("[data-search-results]");
      if (!q) { results.innerHTML = ""; return; }
      const hits = PRODUCTS.filter((p) => (p.name + " " + p.desc + " " + catBySlug(p.cat).name).toLowerCase().includes(q));
      results.innerHTML = hits.length
        ? hits.map(productCard).join("")
        : `<div class="no-results"><h3>No matches for “${esc(input.value)}”</h3><p>Looking for something bespoke? <a class="link-arrow" href="contact.html#quote">Ask for a custom quote</a></p></div>`;
      $$(".reveal", results).forEach((el) => el.classList.add("in"));
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) location.href = `shop.html?q=${encodeURIComponent(input.value.trim())}`;
    });

    const nl = $("[data-newsletter]");
    nl.addEventListener("submit", (e) => { e.preventDefault(); nl.reset(); toast("<span>Thank you — you're on the list ✦</span>"); });

    const header = $(".site-header"), toTop = $(".to-top");
    const onScroll = () => {
      header.classList.toggle("scrolled", scrollY > 10);
      toTop.classList.toggle("show", scrollY > 700);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal & counters ---------- */
  let io;
  function observeReveals(root = document) {
    if (!("IntersectionObserver" in window)) { $$(".reveal", root).forEach((el) => el.classList.add("in")); return; }
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal:not(.in)", root).forEach((el) => io.observe(el));
  }
  function initCounters() {
    const els = $$("[data-count]");
    if (!els.length) return;
    const run = (el) => {
      const end = +el.dataset.count, dur = 1800, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        el.textContent = v.toLocaleString() + (el.dataset.suffix || "");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const co = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } }), { threshold: 0.5 });
    els.forEach((el) => co.observe(el));
  }

  /* ---------- Quote form (WhatsApp) ---------- */
  function initQuoteForms() {
    $$("[data-quote-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let ok = true;
        $$("[required]", form).forEach((inp) => {
          const field = inp.closest(".field");
          const valid = inp.type === "tel" ? /^[+\d][\d\s-]{6,}$/.test(inp.value.trim()) : inp.checkValidity() && inp.value.trim() !== "";
          field && field.classList.toggle("invalid", !valid);
          if (!valid) ok = false;
        });
        if (!ok) { $(".field.invalid input, .field.invalid textarea", form)?.focus(); return; }
        const d = Object.fromEntries(new FormData(form));
        const interests = new FormData(form).getAll("interest");
        const text = [
          `Hello ${SITE.name}! I'd like a quote.`,
          "",
          `Name: ${d.name}`,
          d.company ? `Company: ${d.company}` : "",
          `Phone: ${d.phone}`,
          d.email ? `Email: ${d.email}` : "",
          interests.length ? `Interested in: ${interests.join(", ")}` : "",
          d.quantity ? `Approx. quantity: ${d.quantity}` : "",
          "",
          `Message: ${d.message}`
        ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
        window.open(waLink(text), "_blank", "noopener");
        toast("<span>Opening WhatsApp with your request ✦</span>");
      });
      form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
    });
  }

  /* ---------- Pages ---------- */
  function initHome() {
    const cats = $("[data-home-cats]");
    if (cats) {
      cats.innerHTML = CATEGORIES.slice(0, 8).map((c, i) => `
        <a href="shop.html?cat=${c.slug}" class="cat-card reveal reveal-delay-${i % 4}">
          <span class="count">${PRODUCTS.filter((p) => p.cat === c.slug).length} pieces</span>
          <img src="${IMG(c.img, i === 0 ? 1200 : 700)}" alt="${c.name}" loading="lazy">
          <div class="cat-card-body"><div><h3>${c.name}</h3><small>${c.blurb}</small></div><span class="arrow">${I.arrow}</span></div>
        </a>`).join("");
    }
    const best = $("[data-bestsellers]");
    if (best) {
      const picks = PRODUCTS.filter((p) => p.badge).slice(0, 8);
      best.innerHTML = picks.map(productCard).join("");
    }
    const clients = $("[data-clients]");
    if (clients) {
      const row = CLIENTS.map((c) => `<span class="client"><i></i>${c}</span>`).join("");
      clients.innerHTML = row + row;
    }
    const tm = $("[data-testimonials]");
    if (tm) {
      tm.innerHTML = TESTIMONIALS.map((t, i) => `<figure class="testimonial reveal reveal-delay-${i}"><blockquote>${esc(t.quote)}</blockquote>
        <figcaption class="who"><span>${t.name[0]}</span><div><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></div></figcaption></figure>`).join("");
    }
    $$("[data-since]").forEach((el) => (el.textContent = SITE.since));
    $$("[data-years]").forEach((el) => (el.dataset.count = new Date().getFullYear() - SITE.since));
  }

  function initShop() {
    const grid = $("[data-shop-grid]");
    const pills = $("[data-cat-pills]");
    const countEl = $("[data-shop-count]");
    const sortEl = $("[data-sort]");
    const qEl = $("[data-shop-q]");
    let cat = params.get("cat") || "all";
    if (cat !== "all" && !catBySlug(cat)) cat = "all";
    qEl.value = params.get("q") || "";

    pills.innerHTML = `<button class="cat-pill all" data-cat="all">All gifts</button>` +
      CATEGORIES.map((c) => `<button class="cat-pill" data-cat="${c.slug}"><img src="${IMG(c.img, 80)}" alt="">${c.name}</button>`).join("");

    const render = () => {
      $$(".cat-pill", pills).forEach((b) => b.classList.toggle("active", b.dataset.cat === cat));
      const c = catBySlug(cat);
      $("[data-shop-title]").innerHTML = c ? c.name : `The <em class="accent">Collection</em>`;
      $("[data-shop-lead]").textContent = c ? `${c.blurb}. Every piece can be personalised with your logo, name or message.` : "Thoughtfully made gifts, ready to carry your brand. Browse by category or search for something specific.";
      $("[data-crumb]").textContent = c ? c.name : "All gifts";
      document.title = `${c ? c.name : "Shop"} · ${SITE.name}`;

      const q = qEl.value.trim().toLowerCase();
      let list = PRODUCTS.filter((p) => (cat === "all" || p.cat === cat) && (!q || (p.name + " " + p.desc).toLowerCase().includes(q)));
      const s = sortEl.value;
      if (s === "low") list.sort((a, b) => a.price - b.price);
      if (s === "high") list.sort((a, b) => b.price - a.price);
      if (s === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      countEl.textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}${q ? ` matching “${qEl.value.trim()}”` : ""}`;
      grid.innerHTML = list.length ? list.map(productCard).join("")
        : `<div class="no-results"><h3>Nothing here yet</h3><p>We create bespoke items too — tell us what you have in mind.</p><a href="contact.html#quote" class="btn">Request a custom quote</a></div>`;
      observeReveals(grid);

      const url = new URL(location.href);
      cat === "all" ? url.searchParams.delete("cat") : url.searchParams.set("cat", cat);
      q ? url.searchParams.set("q", qEl.value.trim()) : url.searchParams.delete("q");
      history.replaceState(null, "", url);
    };
    pills.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      cat = b.dataset.cat;
      render();
      b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    });
    sortEl.addEventListener("change", render);
    qEl.addEventListener("input", render);
    render();
  }

  function initProduct() {
    const p = productById(params.get("id")) || PRODUCTS[0];
    const cat = catBySlug(p.cat);
    document.title = `${p.name} · ${SITE.name}`;
    const root = $("[data-pdp]");
    const opt = (name, values) => values && values.length ? `
      <div class="opt-group"><span class="opt-title">${name}</span><div class="chips">
        ${values.map((v, i) => `<label class="chip"><input type="radio" name="${name.toLowerCase()}" value="${esc(v)}" ${i === 0 ? "checked" : ""}><span>${esc(v)}</span></label>`).join("")}
      </div></div>` : "";

    root.innerHTML = `
      <div class="pdp-gallery">
        <div class="pdp-main" data-zoom><img src="${IMG(p.img[0], 1200)}" alt="${esc(p.name)}" data-main-img></div>
        ${p.img.length > 1 ? `<div class="pdp-thumbs">${p.img.map((im, i) => `<button class="${i === 0 ? "active" : ""}" data-thumb="${im}" aria-label="View image ${i + 1}"><img src="${IMG(im, 200)}" alt=""></button>`).join("")}</div>` : ""}
      </div>
      <div class="pdp-info">
        <div class="breadcrumbs left"><a href="index.html">Home</a>/<a href="shop.html">Shop</a>/<a href="shop.html?cat=${cat.slug}">${cat.name}</a></div>
        ${p.badge ? `<span class="eyebrow">${p.badge}</span>` : ""}
        <h1>${esc(p.name)}</h1>
        <div class="pdp-price" data-unit-price>${fmt(p.price)} <small>/ piece</small></div>
        <div class="pdp-save" data-save></div>
        <p class="pdp-desc">${esc(p.desc)}</p>
        <span class="opt-title">Bulk pricing</span>
        <div class="tiers">${tiersFor(p).map((t) => `<div class="tier" data-tier="${t.min}"><small>${t.min}+ pcs</small><strong>${fmt(p.price * (1 - t.off / 100))}</strong><em>${t.off ? `Save ${t.off}%` : "Base"}</em></div>`).join("")}</div>
        <form data-pdp-form>
          ${opt("Finish", p.options.finish)}
          ${opt("Branding", p.options.branding)}
          <div class="opt-group field">
            <label for="pdp-note">Personalisation (name, text or logo notes)</label>
            <input id="pdp-note" name="note" maxlength="120" placeholder="e.g. ‘Team Meridian 2027’ in gold">
          </div>
          <label class="upload-zone opt-group">${I.upload}<span data-file-label>Have a logo? Attach it now — we'll ask for it on WhatsApp too.</span><input type="file" accept="image/*,.pdf,.ai,.eps,.svg" data-file></label>
          <div class="pdp-actions">
            <div class="qty"><button type="button" data-q="-1" aria-label="Decrease">−</button><input name="qty" value="1" inputmode="numeric" aria-label="Quantity" data-pdp-qty><button type="button" data-q="1" aria-label="Increase">+</button></div>
            <button class="btn" type="submit">${I.bag.replace("<svg", '<svg width="18" height="18"')} Add to bag · <span data-line-total>${fmt(p.price)}</span></button>
          </div>
          <div class="pdp-actions-2">
            <a class="btn btn-whatsapp" target="_blank" rel="noopener" data-wa-buy>${I.whatsapp} Order on WhatsApp</a>
            <button type="button" class="btn btn-outline ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save to wishlist" style="padding-inline:1.1rem">${I.heart.replace("<svg", '<svg width="18" height="18"')}</button>
          </div>
        </form>
        <div class="accordion">
          <details open><summary>Customisation &amp; proofs</summary><div>Share your logo (AI, PDF, SVG or high-res PNG). We'll send a free digital mock-up for approval before anything goes to print — revisions included.</div></details>
          <details><summary>Production &amp; delivery</summary><div>Standard production takes 5–7 working days after proof approval; express options are available for urgent orders. We deliver countrywide, with same-day delivery in Islamabad &amp; Rawalpindi for ready stock.</div></details>
          <details><summary>Minimum order</summary><div>Single pieces welcome on most items. The more you order, the lower the unit price — see the bulk pricing tiers above, or request a custom quote for 1,000+ units.</div></details>
        </div>
      </div>`;

    const form = $("[data-pdp-form]", root);
    const qtyEl = $("[data-pdp-qty]", root);
    const getQty = () => Math.max(1, Math.min(10000, parseInt(qtyEl.value, 10) || 1));
    const update = () => {
      const q = getQty(), u = unitPrice(p, q), t = tierFor(p, q);
      $("[data-unit-price]", root).innerHTML = `${fmt(u)} <small>/ piece</small>`;
      $("[data-save]", root).textContent = t.off ? `You save ${t.off}% with ${t.min}+ pieces` : "";
      $("[data-line-total]", root).textContent = fmt(u * q);
      $$("[data-tier]", root).forEach((el) => el.classList.toggle("active", +el.dataset.tier === t.min));
      const d = new FormData(form);
      $("[data-wa-buy]", root).href = waLink(`Hello ${SITE.name}! I'm interested in:\n\n${p.name} × ${q}\nFinish: ${d.get("finish") || "-"}\nBranding: ${d.get("branding") || "-"}${d.get("note") ? `\nNote: ${d.get("note")}` : ""}\nEstimated: ${fmt(u * q)}\n\n${location.href}`);
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-q]");
      if (b) { qtyEl.value = Math.max(1, getQty() + +b.dataset.q); update(); }
      const th = e.target.closest("[data-thumb]");
      if (th) {
        $("[data-main-img]", root).src = IMG(th.dataset.thumb, 1200);
        $$("[data-thumb]", root).forEach((x) => x.classList.toggle("active", x === th));
      }
    });
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    $("[data-file]", root).addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (f) $("[data-file-label]", root).textContent = `Attached: ${f.name} — please also send it on WhatsApp after ordering.`;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      addToCart(p.id, getQty(), { finish: d.get("finish"), branding: d.get("branding"), note: (d.get("note") || "").trim() });
    });

    const zoom = $("[data-zoom]", root), zimg = $("[data-main-img]", root);
    zoom.addEventListener("mousemove", (e) => {
      const r = zoom.getBoundingClientRect();
      zimg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      zimg.style.transform = "scale(1.8)";
    });
    zoom.addEventListener("mouseleave", () => { zimg.style.transform = ""; });
    update();

    const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id);
    const more = [...related, ...PRODUCTS.filter((x) => x.cat !== p.cat && x.badge)].slice(0, 4);
    $("[data-related]").innerHTML = more.map(productCard).join("");
  }

  function renderCartPage() {
    const list = $("[data-cart-list]"), sum = $("[data-cart-summary]");
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = `<div class="empty-state">${I.gift}<h3>Your bag is empty</h3><p>Browse our collection and add the pieces you love.</p><a href="shop.html" class="btn">Explore the collection</a></div>`;
      sum.hidden = true;
      return;
    }
    sum.hidden = false;
    list.innerHTML = cart.map((i) => {
      const p = productById(i.id), t = tierFor(p, i.qty);
      return `<div class="cart-row">
        <a href="product.html?id=${p.id}"><img src="${IMG(p.img[0], 200)}" alt="${esc(p.name)}"></a>
        <div>
          <h4><a href="product.html?id=${p.id}">${esc(p.name)}</a></h4>
          <div class="meta">Finish: ${esc(i.finish)} · Branding: ${esc(i.branding)}${i.note ? `<br>Note: ${esc(i.note)}` : ""}<br>${fmt(unitPrice(p, i.qty))} each${t.off ? ` <span style="color:var(--success)">(−${t.off}% bulk)</span>` : ""}</div>
          <div class="row-bottom">
            <div class="qty sm"><button data-dec="${esc(i.key)}" aria-label="Decrease">−</button><input value="${i.qty}" data-qty="${esc(i.key)}" inputmode="numeric" aria-label="Quantity"><button data-inc="${esc(i.key)}" aria-label="Increase">+</button></div>
            <button class="remove-btn" data-remove="${esc(i.key)}">Remove</button>
            <span class="line-total">${fmt(unitPrice(p, i.qty) * i.qty)}</span>
          </div>
        </div>
      </div>`;
    }).join("");
    const savings = cartSubtotal() - cartTotal();
    $("[data-sum-sub]").textContent = fmt(cartSubtotal());
    $("[data-sum-save]").textContent = savings > 0 ? `− ${fmt(savings)}` : fmt(0);
    $("[data-sum-total]").textContent = fmt(cartTotal());
    $("[data-sum-items]").textContent = `${cartCount().toLocaleString()} piece${cartCount() === 1 ? "" : "s"}`;
  }
  function initCart() {
    renderCartPage();
    const form = $("[data-checkout]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach((inp) => {
        const valid = inp.value.trim() !== "" && inp.checkValidity();
        inp.closest(".field").classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok || !cart.length) return;
      const d = Object.fromEntries(new FormData(form));
      window.open(waLink(orderMessage(d)), "_blank", "noopener");
      toast("<span>Opening WhatsApp to confirm your order ✦</span>");
    });
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
    $("[data-clear-cart]").addEventListener("click", () => { cart = []; saveCart(); });
  }

  function renderWishlist() {
    const grid = $("[data-wish-grid]");
    const items = wish.map(productById).filter(Boolean);
    grid.innerHTML = items.length ? items.map(productCard).join("")
      : `<div class="no-results">${I.heart.replace("<svg", '<svg width="48" height="48" style="color:var(--gold);margin:0 auto 1rem"')}<h3>No saved pieces yet</h3><p>Tap the heart on any product to keep it here for later.</p><a href="shop.html" class="btn">Browse the collection</a></div>`;
    observeReveals(grid);
  }

  /* ---------- Gallery & lightbox ---------- */
  let lbItems = [], lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    const lb = $(".lightbox");
    const it = lbItems[i];
    $("img", lb).src = IMG(it.img, 1600);
    $("img", lb).alt = it.title;
    $(".cap", lb).textContent = `${it.title} · ${it.type}`;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const lb = $(".lightbox");
    if (lb && lb.classList.contains("open")) { lb.classList.remove("open"); document.body.style.overflow = ""; }
  }
  function initGallery() {
    const grid = $("[data-gallery]");
    if (!grid) return;
    const limit = +grid.dataset.limit || EVENTS.length;
    const items = EVENTS.slice(0, limit);
    grid.innerHTML = items.map((e, i) => `<button class="g-item reveal" data-type="${e.type}" data-lb="${i}"><figure style="margin:0"><img src="${IMG(e.img, 800)}" alt="${esc(e.title)}" loading="lazy"><figcaption><small>${e.type}</small><strong>${esc(e.title)}</strong></figcaption></figure></button>`).join("");

    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `<div><img alt=""><div class="cap"></div></div>
      <button class="lb-btn lb-close" aria-label="Close">${I.close.replace("<svg", '<svg width="22" height="22"')}</button>
      <button class="lb-btn lb-prev" aria-label="Previous">${I.chevL}</button>
      <button class="lb-btn lb-next" aria-label="Next">${I.chevR}</button>`;
    document.body.append(lb);

    const visible = () => $$(".g-item:not(.hide)", grid).map((el) => items[+el.dataset.lb]);
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lb]");
      if (!b) return;
      lbItems = visible();
      openLightbox(lbItems.indexOf(items[+b.dataset.lb]));
    });
    lb.addEventListener("click", (e) => {
      if (e.target.closest(".lb-close") || e.target === lb) closeLightbox();
      if (e.target.closest(".lb-prev")) openLightbox((lbIndex - 1 + lbItems.length) % lbItems.length);
      if (e.target.closest(".lb-next")) openLightbox((lbIndex + 1) % lbItems.length);
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "ArrowLeft") openLightbox((lbIndex - 1 + lbItems.length) % lbItems.length);
      if (e.key === "ArrowRight") openLightbox((lbIndex + 1) % lbItems.length);
    });

    const tabs = $("[data-gallery-tabs]");
    if (tabs) {
      const types = ["All", ...new Set(items.map((e) => e.type))];
      tabs.innerHTML = types.map((t, i) => `<button class="${i === 0 ? "active" : ""}" data-filter="${t}">${t}</button>`).join("");
      tabs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-filter]");
        if (!b) return;
        $$("button", tabs).forEach((x) => x.classList.toggle("active", x === b));
        $$(".g-item", grid).forEach((g) => g.classList.toggle("hide", b.dataset.filter !== "All" && g.dataset.type !== b.dataset.filter));
      });
    }
  }

  function initContactInfo() {
    $$("[data-contact-list]").forEach((ul) => {
      ul.innerHTML = `
        <li><span class="ic">${I.phone}</span><div><small>Call or WhatsApp</small><a href="tel:+${SITE.whatsapp}">${SITE.phoneDisplay}</a></div></li>
        <li><span class="ic">${I.mail}</span><div><small>Email</small><a href="mailto:${SITE.email}">${SITE.email}</a></div></li>
        <li><span class="ic">${I.pin}</span><div><small>Studios</small>${SITE.addresses.join("<br>")}</div></li>
        <li><span class="ic">${I.clock}</span><div><small>Hours</small>${SITE.hours}</div></li>`;
    });
    $$("[data-interest-chips]").forEach((wrap) => {
      wrap.innerHTML = [...CATEGORIES.map((c) => c.name), "Event Management"].map((n) => `<label class="chip"><input type="checkbox" name="interest" value="${n}"><span>${n}</span></label>`).join("");
    });
    $$("[data-wa-direct]").forEach((a) => { a.href = waLink(`Hello ${SITE.name}!`); });
  }

  function initLegal() {
    const links = $$(".legal-nav a");
    const secs = $$(".legal-content section");
    const setActive = (id) => links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    if ("IntersectionObserver" in window) {
      const lo = new IntersectionObserver((entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)), { rootMargin: "-30% 0px -60% 0px" });
      secs.forEach((s) => lo.observe(s));
    }
    setActive((location.hash || "#privacy").slice(1));
    $$("[data-site-name]").forEach((el) => (el.textContent = SITE.name));
    $$("[data-site-email]").forEach((el) => { el.textContent = SITE.email; el.href = `mailto:${SITE.email}`; });
  }

  /* ---------- Boot ---------- */
  renderLayout();
  bindGlobal();
  updateBadges();
  initContactInfo();
  initQuoteForms();
  if (page === "home") initHome();
  if (page === "shop") initShop();
  if (page === "product") initProduct();
  if (page === "cart") initCart();
  if (page === "wishlist") renderWishlist();
  if (page === "legal") initLegal();
  initGallery();
  initCounters();
  observeReveals();

  // keep tabs in sync
  addEventListener("storage", (e) => {
    if (e.key === CART_KEY) { cart = store.get(CART_KEY, []).filter((i) => productById(i.id)); updateBadges(); renderMiniCart(); if (page === "cart") renderCartPage(); }
    if (e.key === WISH_KEY) { wish = store.get(WISH_KEY, []); updateBadges(); }
  });
})();

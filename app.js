/* Standard Bakers — Main App */
(function () {
  "use strict";

  /* ── State ── */
  let activeOutlet = "tantura";
  let activeCat = "all";
  let activePriceFilter = "all";
  let searchQuery = "";
  let enquiryList = [];
  let searchTimer = null;

  /* ── Init ── */
  document.addEventListener("DOMContentLoaded", () => {
    loadOutlet();
    renderCategories();
    renderPriceFilters();
    renderProducts();
    renderOutlets();
    initSearch();
    initOfferBanner();
    initCartBadge();
    initOutletSwitcher();
    initOrderSheet();
  });

  /* ── Outlet ── */
  function loadOutlet() {
    const saved = localStorage.getItem("sb_outlet");
    if (saved && SITE.outlets.find(o => o.id === saved)) activeOutlet = saved;
    updateOutletUI();
  }

  function setOutlet(id) {
    activeOutlet = id;
    localStorage.setItem("sb_outlet", id);
    updateOutletUI();
    renderProducts();
    closeOutletDropdown();
  }

  function updateOutletUI() {
    const o = getOutlet();
    const el = document.getElementById("current-outlet");
    if (el) el.textContent = o.name + " ▾";
  }

  function getOutlet() {
    return SITE.outlets.find(o => o.id === activeOutlet) || SITE.outlets[0];
  }

  function initOutletSwitcher() {
    const btn = document.getElementById("outlet-btn");
    const drop = document.getElementById("outlet-drop");
    if (!btn || !drop) return;
    SITE.outlets.forEach(o => {
      const item = document.createElement("button");
      item.className = "outlet-item";
      item.textContent = o.name + " — " + o.address;
      item.onclick = () => setOutlet(o.id);
      drop.appendChild(item);
    });
    btn.addEventListener("click", e => {
      e.stopPropagation();
      drop.classList.toggle("open");
    });
    document.addEventListener("click", () => closeOutletDropdown());
  }

  function closeOutletDropdown() {
    const drop = document.getElementById("outlet-drop");
    if (drop) drop.classList.remove("open");
  }

  /* ── Categories ── */
  function renderCategories() {
    const row = document.getElementById("cat-row");
    if (!row) return;
    CATEGORIES.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "cat-pill" + (cat.id === activeCat ? " active" : "");
      btn.textContent = cat.label;
      btn.dataset.id = cat.id;
      btn.addEventListener("click", () => {
        activeCat = cat.id;
        row.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts();
      });
      row.appendChild(btn);
    });
  }

  /* ── Price Filters ── */
  function renderPriceFilters() {
    const row = document.getElementById("price-filter-row");
    if (!row) return;
    PRICE_FILTERS.forEach(f => {
      const btn = document.createElement("button");
      btn.className = "price-pill" + (f.id === activePriceFilter ? " active" : "");
      btn.textContent = f.label;
      btn.dataset.id = f.id;
      btn.addEventListener("click", () => {
        activePriceFilter = f.id;
        row.querySelectorAll(".price-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts();
      });
      row.appendChild(btn);
    });
  }

  /* ── Search ── */
  function initSearch() {
    const input = document.getElementById("search-input");
    if (!input) return;
    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchQuery = input.value.trim().toLowerCase();
        renderProducts();
      }, 200);
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") { input.value = ""; searchQuery = ""; renderProducts(); }
    });
  }

  /* ── Products ── */
  function getFilteredProducts() {
    const priceFilter = PRICE_FILTERS.find(f => f.id === activePriceFilter);
    return PRODUCTS.filter(p => {
      if (!p.outlets.includes(activeOutlet)) return false;
      if (activeCat !== "all" && p.category !== activeCat) return false;
      if (!priceFilter.fn(p)) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery)) return false;
      return true;
    });
  }

  function renderProducts() {
    const grid = document.getElementById("product-grid");
    const empty = document.getElementById("no-results");
    if (!grid) return;
    const products = getFilteredProducts();
    grid.innerHTML = "";
    if (products.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";
    products.forEach(p => {
      const card = buildProductCard(p);
      grid.appendChild(card);
    });
  }

  function buildProductCard(p) {
    const inList = enquiryList.find(i => i.id === p.id);
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <div class="product-img" role="img" aria-label="${p.name}">
        <span class="product-emoji" aria-hidden="true">${p.emoji}</span>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${badgeLabel(p.badge)}</span>` : ""}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price-wrap">
            <span class="product-price">₹${p.price}</span>
            ${p.original ? `<span class="product-original">₹${p.original}</span>` : ""}
          </div>
          <button class="add-btn ${inList ? "added" : ""}" 
            aria-label="${inList ? "Added" : "Add " + p.name + " to enquiry"}"
            data-id="${p.id}">
            ${inList ? "✓ Added" : "+ Add"}
          </button>
        </div>
      </div>`;
    div.querySelector(".add-btn").addEventListener("click", e => {
      e.stopPropagation();
      toggleEnquiry(p);
      renderProducts();
      updateCartBadge();
    });
    return div;
  }

  function badgeLabel(badge) {
    return { popular: "Popular", quick: "Quick", new: "New" }[badge] || badge;
  }

  /* ── Enquiry / Cart ── */
  function toggleEnquiry(p) {
    const idx = enquiryList.findIndex(i => i.id === p.id);
    if (idx === -1) {
      enquiryList.push({ id: p.id, name: p.name, price: p.price });
      showToast(`${p.name} added — enquire via WhatsApp`);
    } else {
      enquiryList.splice(idx, 1);
      showToast(`${p.name} removed`);
    }
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    if (enquiryList.length > 0) {
      badge.textContent = enquiryList.length;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  function initCartBadge() {
    const btn = document.getElementById("cart-btn");
    if (btn) btn.addEventListener("click", openEnquirySheet);
  }

  function openEnquirySheet() {
    const sheet = document.getElementById("enquiry-sheet");
    const content = document.getElementById("enquiry-content");
    if (!sheet || !content) return;
    content.innerHTML = "";
    if (enquiryList.length === 0) {
      content.innerHTML = `<p class="sheet-empty">No items added yet.<br>Tap + Add on any product.</p>`;
    } else {
      const total = enquiryList.reduce((s, i) => s + i.price, 0);
      enquiryList.forEach(item => {
        const row = document.createElement("div");
        row.className = "enquiry-row";
        row.innerHTML = `
          <span class="enquiry-name">${item.name}</span>
          <span class="enquiry-price">₹${item.price}</span>
          <button class="enquiry-remove" aria-label="Remove ${item.name}" data-id="${item.id}">✕</button>`;
        row.querySelector(".enquiry-remove").addEventListener("click", () => {
          enquiryList = enquiryList.filter(i => i.id !== item.id);
          renderProducts();
          updateCartBadge();
          openEnquirySheet();
        });
        content.appendChild(row);
      });
      const totalRow = document.createElement("div");
      totalRow.className = "enquiry-total";
      totalRow.innerHTML = `<span>Approx. total</span><span>₹${total}</span>`;
      content.appendChild(totalRow);
    }
    sheet.classList.add("open");
    document.body.classList.add("sheet-open");
  }

  /* ── WhatsApp ── */
  window.openWhatsApp = function (type) {
    const o = getOutlet();
    let msg = "";
    if (type === "enquiry" && enquiryList.length > 0) {
      const lines = enquiryList.map(i => `• ${i.name} (₹${i.price})`).join("\n");
      msg = `Hi Standard Bakers!\nI'd like to order:\n${lines}\n\nPlease confirm availability and delivery.`;
    } else if (type === "custom") {
      msg = `Hi Standard Bakers!\nI'd like to order a custom cake.\n\nOccasion: \nFlavour: \nSize: \nDate needed: \n\nPlease share price and availability.`;
    } else {
      msg = `Hi Standard Bakers! I'd like to place an order. Please help.`;
    }
    window.open(`https://wa.me/${o.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  window.closeEnquirySheet = function () {
    const sheet = document.getElementById("enquiry-sheet");
    if (sheet) sheet.classList.remove("open");
    document.body.classList.remove("sheet-open");
  };

  /* ── Order Sheet (Swiggy / Zomato) ── */
  function initOrderSheet() {
    const overlay = document.getElementById("sheet-overlay");
    if (overlay) overlay.addEventListener("click", () => {
      window.closeEnquirySheet();
      window.closeOrderSheet();
    });
  }

  window.openOrderSheet = function () {
    const sheet = document.getElementById("order-sheet");
    if (sheet) sheet.classList.add("open");
    document.body.classList.add("sheet-open");
  };

  window.closeOrderSheet = function () {
    const sheet = document.getElementById("order-sheet");
    if (sheet) sheet.classList.remove("open");
    document.body.classList.remove("sheet-open");
  };

  window.openPlatform = function (platform) {
    const o = getOutlet();
    const url = platform === "swiggy" ? o.swiggy : o.zomato;
    window.open(url, "_blank");
    window.closeOrderSheet();
  };

  /* ── Outlets ── */
  function renderOutlets() {
    const container = document.getElementById("outlets-container");
    if (!container) return;
    SITE.outlets.forEach(o => {
      const card = document.createElement("div");
      card.className = "outlet-card";
      card.innerHTML = `
        <div class="outlet-name">${o.name}</div>
        <div class="outlet-address">${o.address}</div>
        <div class="outlet-hours">Open: ${o.hours}</div>
        <div class="outlet-actions">
          <a href="tel:+${o.phone}" class="outlet-action-btn">Call</a>
          <a href="${o.maps}" target="_blank" rel="noopener" class="outlet-action-btn">Directions</a>
          <button class="outlet-action-btn" onclick="openWhatsApp('general')">WhatsApp</button>
        </div>`;
      container.appendChild(card);
    });
  }

  /* ── Offer Banner ── */
  function initOfferBanner() {
    const banner = document.getElementById("offer-banner");
    if (!banner) return;
    const o = SITE.offer;
    if (!o.active) { banner.style.display = "none"; return; }
    if (o.expires && new Date(o.expires) < new Date()) { banner.style.display = "none"; return; }
    banner.querySelector(".offer-text").textContent = o.text;
  }

  /* ── Toast ── */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    const text = document.getElementById("toast-text");
    if (!toast || !text) return;
    text.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ── Call ── */
  window.callNow = function () {
    const o = getOutlet();
    window.location.href = `tel:+${o.phone}`;
  };

})();

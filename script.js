(function () {
  "use strict";

  const PRICE_ESTIMATE = 89;

  /** Hero slider */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  let heroIndex = 0;
  let heroTimer;

  function showSlide(i) {
    heroIndex = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("active", j === heroIndex));
    dots.forEach((d, j) => {
      d.classList.toggle("active", j === heroIndex);
      d.setAttribute("aria-selected", j === heroIndex ? "true" : "false");
    });
  }

  function nextSlide() {
    showSlide(heroIndex + 1);
  }

  function startHeroAutoplay() {
    clearInterval(heroTimer);
    heroTimer = setInterval(nextSlide, 6500);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showSlide(i);
      startHeroAutoplay();
    });
  });

  if (slides.length) startHeroAutoplay();

  /** Star ratings from data-rating (rounded to nearest half-star visually via full + empty) */
  document.querySelectorAll(".rating[data-rating]").forEach((el) => {
    const val = parseFloat(el.getAttribute("data-rating"), 10);
    const full = Math.min(5, Math.round(val));
    const empty = 5 - full;
    const starsEl = el.querySelector(".stars");
    if (!starsEl) return;
    starsEl.textContent = "★".repeat(full) + "☆".repeat(empty);
  });

  /** Mobile nav */
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle?.addEventListener("click", () => {
    header?.classList.toggle("nav-open");
    const open = header?.classList.contains("nav-open");
    navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle?.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
  });

  mainNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      header?.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /** Search bar */
  const searchBtn = document.getElementById("searchBtn");
  const searchBar = document.getElementById("searchBar");
  const searchClose = document.getElementById("searchClose");

  searchBtn?.addEventListener("click", () => {
    if (!searchBar) return;
    searchBar.hidden = !searchBar.hidden;
    if (!searchBar.hidden) searchBar.querySelector("input")?.focus();
  });

  searchClose?.addEventListener("click", () => {
    if (searchBar) searchBar.hidden = true;
  });

  /** Tabs */
  const tabButtons = document.querySelectorAll(".tabs .tab");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-tab");
      tabButtons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        const match = panel.id === `panel-${id}`;
        panel.toggleAttribute("hidden", !match);
        panel.classList.toggle("active", match);
      });
    });
  });

  /** Cart state */
  let cart = [];

  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  function openCart() {
    cartDrawer?.classList.add("is-open");
    cartDrawer?.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
  }

  function closeCart() {
    cartDrawer?.classList.remove("is-open");
    cartDrawer?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
  }

  cartBtn?.addEventListener("click", openCart);
  cartOverlay?.addEventListener("click", closeCart);
  cartClose?.addEventListener("click", closeCart);

  function renderCart() {
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

    if (cartCount) cartCount.textContent = String(totalItems);
    if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    if (!cartItems || !cartEmpty) return;

    cartItems.innerHTML = "";
    if (cart.length === 0) {
      cartEmpty.hidden = false;
      return;
    }
    cartEmpty.hidden = true;

    cart.forEach((line) => {
      const li = document.createElement("li");
      li.className = "cart-line";
      const left = document.createElement("div");
      left.className = "cart-line-info";
      left.innerHTML = `<strong>${escapeHtml(line.title)}</strong><span class="cart-line-qty">× ${line.qty}</span>`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn-text cart-remove";
      remove.textContent = "Xóa";
      remove.addEventListener("click", () => {
        cart = cart.filter((c) => c.title !== line.title);
        renderCart();
      });
      left.appendChild(remove);
      const price = document.createElement("span");
      price.className = "cart-line-price";
      price.textContent = `$${(line.price * line.qty).toFixed(2)}`;
      li.appendChild(left);
      li.appendChild(price);
      cartItems.appendChild(li);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title") || "Product";
      const existing = cart.find((c) => c.title === title);
      if (existing) existing.qty += 1;
      else cart.push({ title, qty: 1, price: PRICE_ESTIMATE });
      renderCart();
      openCart();
    });
  });

  renderCart();

  /** Newsletter */
  document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã đăng ký! (Demo)");
    e.target.reset();
  });
})();

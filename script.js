    const products = [
      { id: 1, name: "Everyday relaxed cotton shirt", category: "Clothing", price: 189, oldPrice: 249, rating: "4.8", reviews: 124, discount: 24, deal: true, image: "photo-1598033129183-c4f50c736f10" },
      { id: 2, name: "Classic low-top everyday sneakers", category: "Shoes", price: 329, oldPrice: 420, rating: "4.7", reviews: 86, discount: 22, deal: true, image: "photo-1542291026-7eec264c27ff" },
      { id: 3, name: "Minimal crossbody day bag", category: "Accessories", price: 149, oldPrice: 199, rating: "4.9", reviews: 58, discount: 25, deal: true, image: "photo-1548036328-c9fa89d128fa" },
      { id: 4, name: "Soft-knit weekend sweatshirt", category: "Clothing", price: 219, oldPrice: 280, rating: "4.6", reviews: 91, discount: 22, deal: true, image: "photo-1556821840-3a63f95609a7" },
      { id: 5, name: "Smart-casual linen blend trousers", category: "Clothing", price: 235, oldPrice: 299, rating: "4.7", reviews: 43, discount: 21, deal: false, newIn: true, image: "photo-1473966968600-fa801b869a1a" },
      { id: 6, name: "Cushioned sport running shoes", category: "Shoes", price: 389, oldPrice: 480, rating: "4.8", reviews: 112, discount: 19, deal: false, image: "photo-1542291026-7eec264c27ff" },
      { id: 7, name: "Everyday classic watch", category: "Accessories", price: 275, oldPrice: 340, rating: "4.5", reviews: 67, discount: 19, deal: false, newIn: true, image: "photo-1524805444758-089113d48a6d" },
      { id: 8, name: "Essential heavyweight cotton tee", category: "Clothing", price: 119, oldPrice: 155, rating: "4.8", reviews: 203, discount: 23, deal: false, image: "photo-1521572163474-6864f9cf17ab" },
      { id: 9, name: "Lightweight everyday sunglasses", category: "Accessories", price: 99, oldPrice: 135, rating: "4.6", reviews: 74, discount: 27, deal: false, newIn: true, image: "photo-1511499767150-a48a237f0083" },
      { id: 10, name: "Comfort-fit casual loafers", category: "Shoes", price: 299, oldPrice: 370, rating: "4.7", reviews: 39, discount: 19, deal: false, newIn: true, image: "photo-1533867617858-e7b97e060509" },
      { id: 11, name: "Weekend canvas tote bag", category: "Accessories", price: 89, oldPrice: 120, rating: "4.6", reviews: 51, discount: 26, deal: false, newIn: true, image: "photo-1590874103328-eac38a683ce7" },
      { id: 12, name: "Easy-fit denim jacket", category: "Clothing", price: 345, oldPrice: 430, rating: "4.9", reviews: 97, discount: 20, deal: false, newIn: true, image: "photo-1543076447-215ad9ba6923" }
    ];
    const cart = new Map();
    let activeCategory = "All";
    let searchQuery = "";
    let toastTimer;
    const money = value => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(value);
    const photo = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=650&q=80`;

    function productCard(product) {
      return `<article class="product-card">
        <div class="product-image">
          <img src="${photo(product.image)}" alt="${product.name}" loading="lazy">
          <span class="discount">-${product.discount}%</span>
          <button class="favorite" type="button" aria-label="Save ${product.name}" aria-pressed="false">♡</button>
        </div>
        <div class="product-info">
          <p class="product-name">${product.name}</p>
          <div class="product-rating" aria-label="${product.rating} out of 5 stars">★★★★★ <span>(${product.reviews})</span></div>
          <div class="price-row"><span class="price">${money(product.price)}</span><span class="old-price">${money(product.oldPrice)}</span></div>
          ${product.deal ? '<div class="stock-note">⚡ Limited-time deal</div>' : ""}
          <button class="add-button" type="button" data-add="${product.id}">Add to cart</button>
        </div>
      </article>`;
    }

    function renderProducts() {
      const matches = products.filter(product => {
        const categoryMatch = activeCategory === "All" || activeCategory === "Sale" || (activeCategory === "New In" ? product.newIn : product.category === activeCategory);
        const textMatch = `${product.name} ${product.category}`.toLowerCase().includes(searchQuery);
        return categoryMatch && textMatch;
      });
      document.getElementById("grid-title").textContent = searchQuery ? `Search results (${matches.length})` : activeCategory === "All" ? "Picked for you" : activeCategory === "Sale" ? "Sale picks" : activeCategory === "New In" ? "New in" : activeCategory;
      document.getElementById("product-grid").innerHTML = matches.length ? matches.map(productCard).join("") : '<div class="empty-state">No products match that search. Try another name or category.</div>';
      document.getElementById("deal-products").innerHTML = products.filter(product => product.deal).slice(0, 4).map(productCard).join("");
    }

    function updateCart() {
      const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
      document.getElementById("cart-count").textContent = count;
      const bottomCount = document.getElementById("bottom-cart-count");
      bottomCount.textContent = count;
      bottomCount.hidden = count === 0;
    }

    document.addEventListener("click", event => {
      const addButton = event.target.closest("[data-add]");
      if (addButton) {
        const id = Number(addButton.dataset.add);
        cart.set(id, (cart.get(id) || 0) + 1);
        updateCart();
        const product = products.find(item => item.id === id);
        const toast = document.getElementById("cart-toast");
        toast.textContent = `${product.name} added to your cart`;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
        return;
      }
      const favorite = event.target.closest(".favorite");
      if (favorite) {
        favorite.classList.toggle("selected");
        favorite.setAttribute("aria-pressed", favorite.classList.contains("selected"));
        favorite.textContent = favorite.classList.contains("selected") ? "♥" : "♡";
        return;
      }
      const categoryButton = event.target.closest("[data-category]");
      if (categoryButton) {
        activeCategory = categoryButton.dataset.category;
        document.querySelectorAll(".category-link").forEach(button => button.classList.toggle("active", button === categoryButton));
        renderProducts();
        document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const bottom = event.target.closest("[data-bottom]");
      if (bottom) {
        document.querySelectorAll(".bottom-link").forEach(button => button.classList.toggle("active", button === bottom));
        if (bottom.dataset.bottom === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        if (bottom.dataset.bottom === "categories") document.querySelector(".category-nav").scrollIntoView({ behavior: "smooth" });
        if (bottom.dataset.bottom === "you") document.getElementById("profile-panel").classList.toggle("open");
        if (bottom.dataset.bottom === "cart") {
          const items = [...cart.entries()];
          if (!items.length) showToast("Your cart is ready for something good.");
          else {
            const summary = items.map(([id, quantity]) => `${quantity} × ${products.find(item => item.id === id).name}`).join("\\n");
            const total = items.reduce((sum, [id, quantity]) => sum + products.find(item => item.id === id).price * quantity, 0);
            const message = `Hi Alvin Apparel! I'd like to order:\\n${summary}\\nTotal: ${money(total)}. Please confirm availability and delivery.`;
            window.open(`https://wa.me/233539189466?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
          }
        }
        return;
      }
      const footerCategory = event.target.closest("[data-footer-category]");
      if (footerCategory) {
        activeCategory = footerCategory.dataset.footerCategory;
        document.querySelectorAll(".category-link").forEach(button => button.classList.toggle("active", button.dataset.category === activeCategory));
        renderProducts();
        return;
      }
      const scrollTarget = event.target.closest("[data-scroll]");
      if (scrollTarget) {
        document.getElementById(scrollTarget.dataset.scroll).scrollIntoView({ behavior: "smooth" });
        return;
      }
    });

    function showToast(message) {
      const toast = document.getElementById("cart-toast");
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
    }

    document.getElementById("search-form").addEventListener("submit", event => {
      event.preventDefault();
      searchQuery = document.getElementById("search-input").value.trim().toLowerCase();
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.getElementById("search-input").addEventListener("input", event => {
      if (!event.target.value) {
        searchQuery = "";
        renderProducts();
      }
    });
    document.getElementById("clear-filters").addEventListener("click", () => {
      activeCategory = "All";
      searchQuery = "";
      document.getElementById("search-input").value = "";
      document.querySelectorAll(".category-link").forEach(button => button.classList.toggle("active", button.dataset.category === "All"));
      renderProducts();
    });
    document.getElementById("chat-button").addEventListener("click", () => document.getElementById("chat-panel").classList.toggle("open"));
    document.getElementById("chat-close").addEventListener("click", () => document.getElementById("chat-panel").classList.remove("open"));
    document.getElementById("profile-button").addEventListener("click", () => document.getElementById("profile-panel").classList.toggle("open"));
    document.getElementById("profile-close").addEventListener("click", () => document.getElementById("profile-panel").classList.remove("open"));
    document.getElementById("cart-button").addEventListener("click", () => document.querySelector('[data-bottom="cart"]').click());
    document.getElementById("newsletter-form").addEventListener("submit", event => {
      event.preventDefault();
      showToast("Thanks for your interest! Newsletter signup is coming soon.");
      event.target.reset();
    });
    document.getElementById("copy-number").addEventListener("click", async event => {
      try {
        await navigator.clipboard.writeText("+233539189466");
        event.target.textContent = "Number copied!";
      } catch {
        event.target.textContent = "Number: +233 53 918 9466";
      }
      setTimeout(() => { event.target.textContent = "Copy payment number"; }, 2200);
    });

    let remaining = 5 * 60 * 60;
    setInterval(() => {
      remaining = remaining > 0 ? remaining - 1 : 5 * 60 * 60;
      document.getElementById("hours").textContent = String(Math.floor(remaining / 3600)).padStart(2, "0");
      document.getElementById("minutes").textContent = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
      document.getElementById("seconds").textContent = String(remaining % 60).padStart(2, "0");
    }, 1000);
    document.getElementById("year").textContent = new Date().getFullYear();
    renderProducts();

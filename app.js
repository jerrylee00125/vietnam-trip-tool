(function () {
  "use strict";

  const DEFAULT_RATE = 1.3;
  const RATE_STORAGE_KEY = "vietnam-shopping-rate-v1";
  const CART_STORAGE_KEY = "vietnam-shopping-cart-v1";
  const CHANGE_DENOMINATIONS = [500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000];
  const BANKNOTES = [
    { amount: 500000, short: "500k", type: "聚合物鈔票", image: "./assets/denominations/500000.jpg" },
    { amount: 200000, short: "200k", type: "聚合物鈔票", image: "./assets/denominations/200000.jpg" },
    { amount: 100000, short: "100k", type: "聚合物鈔票", image: "./assets/denominations/100000.jpg" },
    { amount: 50000, short: "50k", type: "聚合物鈔票", image: "./assets/denominations/50000.jpg" },
    { amount: 20000, short: "20k", type: "聚合物鈔票", image: "./assets/denominations/20000.jpg" },
    { amount: 10000, short: "10k", type: "聚合物鈔票", image: "./assets/denominations/10000.jpg" },
    { amount: 5000, short: "5k", type: "棉質紙鈔", image: "./assets/denominations/5000.jpg" },
    { amount: 2000, short: "2k", type: "棉質紙鈔", image: "./assets/denominations/2000.jpg" },
    { amount: 1000, short: "1k", type: "棉質紙鈔", image: "./assets/denominations/1000.jpg" },
  ];

  const elements = {
    conversionTab: document.getElementById("conversionTab"),
    shoppingTab: document.getElementById("shoppingTab"),
    conversionPanel: document.getElementById("conversionPanel"),
    shoppingPanel: document.getElementById("shoppingPanel"),
    conversionInput: document.getElementById("conversionInput"),
    clearConversionButton: document.getElementById("clearConversionButton"),
    conversionError: document.getElementById("conversionError"),
    conversionNote: document.getElementById("conversionNote"),
    twdEstimate: document.getElementById("twdEstimate"),
    rateInput: document.getElementById("rateInput"),
    rateError: document.getElementById("rateError"),
    itemForm: document.getElementById("itemForm"),
    itemName: document.getElementById("itemName"),
    itemPrice: document.getElementById("itemPrice"),
    itemQuantity: document.getElementById("itemQuantity"),
    priceError: document.getElementById("priceError"),
    quantityError: document.getElementById("quantityError"),
    formStatus: document.getElementById("formStatus"),
    cartList: document.getElementById("cartList"),
    emptyState: document.getElementById("emptyState"),
    cartTotal: document.getElementById("cartTotal"),
    cartTotalTwd: document.getElementById("cartTotalTwd"),
    shoppingRateSummary: document.getElementById("shoppingRateSummary"),
    goToRateButton: document.getElementById("goToRateButton"),
    restoredCartNotice: document.getElementById("restoredCartNotice"),
    restoredCartSummary: document.getElementById("restoredCartSummary"),
    startNewPurchaseButton: document.getElementById("startNewPurchaseButton"),
    shoppingNoteSuggestion: document.getElementById("shoppingNoteSuggestion"),
    shoppingNoteList: document.getElementById("shoppingNoteList"),
    clearCartButton: document.getElementById("clearCartButton"),
    paymentTotal: document.getElementById("paymentTotal"),
    paymentInput: document.getElementById("paymentInput"),
    clearPaymentButton: document.getElementById("clearPaymentButton"),
    banknoteGrid: document.getElementById("banknoteGrid"),
    changePanel: document.getElementById("changePanel"),
  };

  let rate = readRate();
  let cart = readCart();
  let isUsingRestoredCart = cart.length > 0;
  let banknoteCounts = {};

  function setActiveTab(tabName, moveFocus = false) {
    const isConversion = tabName === "conversion";
    const activeTab = isConversion ? elements.conversionTab : elements.shoppingTab;

    elements.conversionPanel.hidden = !isConversion;
    elements.shoppingPanel.hidden = isConversion;

    [elements.conversionTab, elements.shoppingTab].forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (moveFocus) activeTab.focus();
  }

  function handleTabKeydown(event) {
    const tabs = [elements.conversionTab, elements.shoppingTab];
    const currentIndex = tabs.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveTab(nextIndex === 0 ? "conversion" : "shopping", true);
  }

  function parseVnd(value) {
    const source = String(value ?? "").trim().toLowerCase();
    if (!source) return null;

    let multiplier = 1;
    let numericPart = source;
    if (source.endsWith("k")) {
      multiplier = 1000;
      numericPart = source.slice(0, -1).trim();
    } else if (source.endsWith("m")) {
      multiplier = 1000000;
      numericPart = source.slice(0, -1).trim();
    }

    numericPart = numericPart.replace(/,/g, "");
    if (multiplier === 1 && /^\d{1,3}(?:\.\d{3})+$/.test(numericPart)) {
      numericPart = numericPart.replace(/\./g, "");
    }

    if (!/^\d+(?:\.\d+)?$/.test(numericPart)) return null;
    const parsed = Number(numericPart) * multiplier;
    if (!Number.isSafeInteger(Math.round(parsed)) || parsed < 0) return null;
    return Math.round(parsed);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(Math.round(value));
  }

  function formatVnd(value) {
    return `₫${formatNumber(value)}`;
  }

  function formatTwd(value) {
    return `NT$${formatNumber(value)}`;
  }

  function getBanknote(amount) {
    return BANKNOTES.find((note) => note.amount === amount);
  }

  function renderBanknoteGuide() {
    elements.banknoteGrid.innerHTML = BANKNOTES.map((note) => `
      <button
        class="banknote-card"
        type="button"
        data-banknote-cash="${note.amount}"
        aria-label="加入 ${note.short} 越南盾付款"
      >
        <div class="banknote-image-wrap">
          <img
            class="banknote-image"
            src="${note.image}"
            alt="越南 ${formatNumber(note.amount)} đồng 鈔票正面官方樣張"
            loading="lazy"
            decoding="async"
          />
          <span class="banknote-quantity" data-banknote-quantity="${note.amount}" aria-hidden="true"></span>
        </div>
        <div class="banknote-card-footer">
          <strong>${note.short}</strong>
          <span>${note.type}</span>
        </div>
      </button>
    `).join("");
  }

  function updateBanknoteCount(amount) {
    const note = getBanknote(amount);
    const card = elements.banknoteGrid.querySelector(`[data-banknote-cash="${amount}"]`);
    if (!note || !card) return;

    const count = banknoteCounts[amount] || 0;
    card.classList.toggle("has-quantity", count > 0);
    card.setAttribute(
      "aria-label",
      count > 0 ? `已加入 ${count} 張 ${note.short} 越南盾` : `加入 ${note.short} 越南盾付款`,
    );
    const quantity = card.querySelector(`[data-banknote-quantity="${amount}"]`);
    if (quantity) quantity.textContent = `${count} 張`;
  }

  function resetBanknoteCounts() {
    banknoteCounts = {};
    BANKNOTES.forEach((note) => updateBanknoteCount(note.amount));
  }

  function readRate() {
    try {
      const stored = Number.parseFloat(localStorage.getItem(RATE_STORAGE_KEY));
      return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_RATE;
    } catch (_error) {
      return DEFAULT_RATE;
    }
  }

  function saveRate() {
    try {
      localStorage.setItem(RATE_STORAGE_KEY, String(rate));
    } catch (_error) {
      // Private browsing modes may block storage; the app still works in memory.
    }
  }

  function updateShoppingRateSummary() {
    elements.shoppingRateSummary.textContent = `1,000 越南盾 ≈ NT$${rate.toFixed(2)}`;
  }

  function readCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isSafeInteger(item.price) &&
        item.price > 0 &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0,
      );
    } catch (_error) {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (_error) {
      // Private browsing modes may block storage; the app still works in memory.
    }
  }

  function clearError(element) {
    element.textContent = "";
  }

  function showError(element, message) {
    element.textContent = message;
  }

  function getRate() {
    const value = Number.parseFloat(elements.rateInput.value);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function updateConversion() {
    const rawValue = elements.conversionInput.value;
    clearError(elements.conversionError);
    const amount = parseVnd(rawValue);

    if (!rawValue.trim()) {
      elements.twdEstimate.textContent = "—";
      elements.conversionNote.textContent = `目前匯率：1,000 越南盾 = NT$${rate.toFixed(2)}`;
      elements.conversionInput.removeAttribute("aria-invalid");
      return;
    }

    if (amount === null || amount === 0) {
      elements.twdEstimate.textContent = "—";
      elements.conversionNote.textContent = "請輸入有效的越南盾金額";
      elements.conversionInput.setAttribute("aria-invalid", "true");
      if (rawValue.trim()) showError(elements.conversionError, "可輸入 150000、150k 或 1.2m。");
      return;
    }

    elements.conversionInput.removeAttribute("aria-invalid");
    elements.twdEstimate.textContent = formatTwd((amount / 1000) * rate);
    elements.conversionNote.textContent = `${formatVnd(amount)} ÷ 1,000 × ${rate.toFixed(2)}`;
  }

  function updateRate() {
    const value = getRate();
    clearError(elements.rateError);

    if (value === null) {
      elements.rateInput.setAttribute("aria-invalid", "true");
      showError(elements.rateError, "請輸入大於 0 的匯率。");
      return;
    }

    elements.rateInput.removeAttribute("aria-invalid");
    rate = value;
    saveRate();
    updateShoppingRateSummary();
    updateConversion();
    updatePayment();
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function updateRestoredCartNotice() {
    const shouldShow = isUsingRestoredCart && cart.length > 0;
    elements.restoredCartNotice.hidden = !shouldShow;
    elements.restoredCartSummary.textContent = shouldShow
      ? `共 ${cart.length} 筆商品，合計 ${formatVnd(getCartTotal())}`
      : "";
  }

  function renderCart() {
    elements.cartList.innerHTML = "";
    elements.emptyState.classList.toggle("is-hidden", cart.length > 0);
    elements.clearCartButton.disabled = cart.length === 0;

    cart.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "cart-item";

      const main = document.createElement("div");
      main.className = "cart-item-main";

      const name = document.createElement("p");
      name.className = "cart-item-name";
      name.textContent = item.name;

      const detail = document.createElement("p");
      detail.className = "cart-item-detail";
      detail.textContent = `${formatVnd(item.price)} × ${item.quantity}`;

      const total = document.createElement("strong");
      total.className = "cart-item-total";
      total.textContent = formatVnd(item.price * item.quantity);

      const removeButton = document.createElement("button");
      removeButton.className = "remove-button";
      removeButton.type = "button";
      removeButton.dataset.removeId = item.id;
      removeButton.setAttribute("aria-label", `移除 ${item.name}`);
      removeButton.textContent = "×";

      main.append(name, detail);
      listItem.append(main, total, removeButton);
      elements.cartList.appendChild(listItem);
    });

    elements.cartTotal.textContent = formatVnd(getCartTotal());
    elements.paymentTotal.textContent = formatVnd(getCartTotal());
    updateRestoredCartNotice();
    updatePayment();
  }

  function startNewPurchase() {
    isUsingRestoredCart = false;
    cart = [];
    saveCart();

    elements.itemName.value = "";
    elements.itemPrice.value = "";
    elements.itemQuantity.value = "1";
    clearError(elements.priceError);
    clearError(elements.quantityError);

    elements.paymentInput.value = "";
    resetBanknoteCounts();
    renderCart();
    elements.formStatus.textContent = "已開始新一筆購物";
    elements.itemName.focus();
  }

  function addItem(event) {
    event.preventDefault();
    clearError(elements.priceError);
    clearError(elements.quantityError);
    elements.formStatus.textContent = "";

    const price = parseVnd(elements.itemPrice.value);
    const quantity = Number.parseInt(elements.itemQuantity.value, 10);
    let invalid = false;

    if (price === null || price === 0) {
      showError(elements.priceError, "請輸入有效的單價，例如 150k。");
      invalid = true;
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      showError(elements.quantityError, "數量至少要是 1。");
      invalid = true;
    }
    if (invalid) return;

    const name = elements.itemName.value.trim() || `商品 ${cart.length + 1}`;
    cart.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      price,
      quantity,
    });
    saveCart();
    renderCart();
    elements.itemName.value = "";
    elements.itemPrice.value = "";
    elements.itemQuantity.value = "1";
    elements.formStatus.textContent = `已加入「${name}」`;
    elements.itemName.focus();
  }

  function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    if (cart.length === 0) isUsingRestoredCart = false;
    saveCart();
    renderCart();
  }

  function breakdownChange(amount) {
    let remaining = amount;
    return CHANGE_DENOMINATIONS.reduce((notes, denomination) => {
      const count = Math.floor(remaining / denomination);
      if (count > 0) {
        notes.push({ denomination, count });
        remaining -= denomination * count;
      }
      return notes;
    }, []);
  }

  function renderShoppingNoteSuggestion(total) {
    if (total === 0) {
      elements.shoppingNoteSuggestion.classList.add("is-hidden");
      elements.shoppingNoteList.innerHTML = "";
      return;
    }

    const noteList = breakdownChange(total)
      .map((note) => {
        const banknote = getBanknote(note.denomination);
        if (!banknote) return "";
        return `
          <div class="shopping-note-card" role="listitem">
            <div class="shopping-note-image-wrap">
              <img
                class="shopping-note-image"
                src="${banknote.image}"
                alt="越南 ${formatNumber(note.denomination)} đồng 鈔票正面官方樣張"
                loading="lazy"
                decoding="async"
              />
              <span class="shopping-note-quantity" aria-hidden="true">${note.count} 張</span>
            </div>
            <div class="banknote-card-footer shopping-note-copy">
              <strong>${banknote.short}</strong>
              <span>${banknote.type}</span>
            </div>
          </div>
        `;
      })
      .join("");

    elements.shoppingNoteList.innerHTML = noteList;
    elements.shoppingNoteSuggestion.classList.toggle("is-hidden", noteList === "");
  }

  function renderChange(change) {
    const noteList = breakdownChange(change)
      .map((note) => {
        const banknote = getBanknote(note.denomination);
        if (!banknote) return "";
        return `
          <div class="shopping-note-card change-note-card" role="listitem">
            <div class="shopping-note-image-wrap">
              <img
                class="shopping-note-image"
                src="${banknote.image}"
                alt="越南 ${formatNumber(note.denomination)} đồng 找零鈔票正面官方樣張"
                loading="lazy"
                decoding="async"
              />
              <span class="shopping-note-quantity" aria-hidden="true">${note.count} 張</span>
            </div>
            <div class="banknote-card-footer shopping-note-copy">
              <strong>${banknote.short} × ${note.count}</strong>
              <span>${formatVnd(note.denomination)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    elements.changePanel.innerHTML = `
      <div class="change-content">
        <p class="change-status-label">應找回</p>
        <p class="change-amount">${formatVnd(change)}</p>
        <p class="change-twd">約 ${formatTwd((change / 1000) * rate)}</p>
        <p class="note-breakdown-label">鈔票建議（由大到小）</p>
        <div class="change-note-list" role="list" aria-label="找零的鈔票建議">${noteList}</div>
      </div>
    `;
  }

  function updatePayment() {
    const total = getCartTotal();
    const rawPayment = elements.paymentInput.value;
    const payment = parseVnd(rawPayment);
    elements.cartTotal.textContent = formatVnd(total);
    elements.cartTotalTwd.textContent = `約 ${formatTwd((total / 1000) * rate)}`;
    elements.paymentTotal.textContent = formatVnd(total);
    renderShoppingNoteSuggestion(total);

    if (total === 0) {
      elements.changePanel.innerHTML = `
        <div class="change-panel-placeholder">
          <span class="placeholder-mark" aria-hidden="true">₫</span>
          <p>加入商品後，這裡會告訴你要找多少錢。</p>
        </div>
      `;
      return;
    }

    if (!rawPayment.trim()) {
      elements.changePanel.innerHTML = `
        <div class="change-panel-placeholder">
          <span class="placeholder-mark" aria-hidden="true">₫</span>
          <p>輸入你準備拿出的金額，就能看到找零。</p>
        </div>
      `;
      return;
    }

    if (payment === null || payment === 0) {
      elements.changePanel.innerHTML = `
        <div class="change-panel-placeholder">
          <span class="placeholder-mark" aria-hidden="true">!</span>
          <p>請輸入有效的付款金額。</p>
        </div>
      `;
      return;
    }

    if (payment < total) {
      const shortage = total - payment;
      elements.changePanel.innerHTML = `
        <div class="change-content change-status is-short">
          <p class="change-status-label">還差</p>
          <p class="change-amount">${formatVnd(shortage)}</p>
          <p class="change-twd">約 ${formatTwd((shortage / 1000) * rate)}</p>
        </div>
      `;
      return;
    }

    if (payment === total) {
      elements.changePanel.innerHTML = `
        <div class="change-content change-status is-exact">
          <p class="change-status-label">付款剛剛好</p>
          <p class="change-amount">不用找零</p>
          <p class="change-twd">可以直接確認付款。</p>
        </div>
      `;
      return;
    }

    renderChange(payment - total);
  }

  function setConversionAmount(amount) {
    elements.conversionInput.value = String(amount);
    updateConversion();
    elements.conversionInput.focus();
  }

  function addCash(amount) {
    const current = parseVnd(elements.paymentInput.value) || 0;
    elements.paymentInput.value = String(current + amount);
    if (getBanknote(amount)) {
      banknoteCounts[amount] = (banknoteCounts[amount] || 0) + 1;
      updateBanknoteCount(amount);
    }
    updatePayment();
  }

  elements.conversionTab.addEventListener("click", () => setActiveTab("conversion"));
  elements.shoppingTab.addEventListener("click", () => setActiveTab("shopping"));
  elements.conversionTab.addEventListener("keydown", handleTabKeydown);
  elements.shoppingTab.addEventListener("keydown", handleTabKeydown);
  elements.goToRateButton.addEventListener("click", () => {
    setActiveTab("conversion");
    elements.rateInput.focus();
  });
  elements.startNewPurchaseButton.addEventListener("click", startNewPurchase);
  elements.clearConversionButton.addEventListener("click", () => {
    elements.conversionInput.value = "";
    updateConversion();
    elements.conversionInput.focus();
  });
  elements.conversionInput.addEventListener("input", updateConversion);
  elements.rateInput.addEventListener("input", updateRate);
  elements.itemForm.addEventListener("submit", addItem);
  elements.cartList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");
    if (button) removeItem(button.dataset.removeId);
  });
  elements.clearCartButton.addEventListener("click", () => {
    if (cart.length === 0) return;
    isUsingRestoredCart = false;
    cart = [];
    saveCart();
    renderCart();
    elements.formStatus.textContent = "已清除購物清單";
  });
  elements.paymentInput.addEventListener("input", updatePayment);
  elements.banknoteGrid.addEventListener("click", (event) => {
    const banknote = event.target.closest("[data-banknote-cash]");
    if (banknote) addCash(Number(banknote.dataset.banknoteCash));
  });
  elements.clearPaymentButton.addEventListener("click", () => {
    elements.paymentInput.value = "";
    resetBanknoteCounts();
    updatePayment();
    elements.paymentInput.focus();
  });
  document.querySelectorAll("[data-amount]").forEach((button) => {
    button.addEventListener("click", () => setConversionAmount(Number(button.dataset.amount)));
  });
  elements.rateInput.value = rate.toFixed(2);
  updateShoppingRateSummary();
  setActiveTab("conversion");
  renderBanknoteGuide();
  renderCart();
  updateConversion();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js?v=21").catch(() => {
        // The calculator remains fully usable if a local server does not support PWA registration.
      });
    });
  }
})();

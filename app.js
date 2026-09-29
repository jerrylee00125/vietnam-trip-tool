(function () {
  "use strict";

  const DEFAULT_RATE = 1.3;
  const RATE_STORAGE_KEY = "vietnam-shopping-rate-v1";
  const CART_STORAGE_KEY = "vietnam-shopping-cart-v1";
  const PHRASE_FAVORITES_STORAGE_KEY = "vietnam-phrase-favorites-v1";
  const PHRASE_OPEN_CATEGORY_STORAGE_KEY = "vietnam-phrase-open-category-v1";
  const PHRASE_CATEGORIES = [
    {
      id: "shopping",
      icon: "🛍️",
      label: "購物付款",
      phrases: [
        { id: "shopping-price", chinese: "這個多少錢？", vietnamese: "Cái này bao nhiêu tiền vậy ạ?" },
        { id: "shopping-total", chinese: "總共多少錢？", vietnamese: "Tổng cộng hết bao nhiêu vậy ạ?" },
        { id: "shopping-discount", chinese: "可以便宜一點嗎？", vietnamese: "Có thể giảm giá cho tôi được không ạ?" },
        { id: "shopping-buy", chinese: "我買這個", vietnamese: "Tôi lấy cái này ạ." },
        { id: "shopping-cancel", chinese: "我不要了", vietnamese: "Tôi không lấy nữa ạ." },
        { id: "shopping-card", chinese: "可以刷卡嗎？", vietnamese: "Tôi dùng thẻ được không ạ?" },
        { id: "shopping-cash", chinese: "我用現金付", vietnamese: "Tôi sẽ trả bằng tiền mặt." },
        { id: "shopping-separate", chinese: "可以分開結帳嗎？", vietnamese: "Có thể thanh toán riêng được không ạ?" },
        { id: "shopping-receipt", chinese: "請給我收據", vietnamese: "Cho tôi xin hóa đơn ạ." },
        { id: "shopping-bag", chinese: "請給我一個袋子，謝謝", vietnamese: "Cho tôi xin một cái túi, cảm ơn." },
        { id: "shopping-change", chinese: "請幫我確認找零", vietnamese: "Vui lòng kiểm tra lại tiền thừa giúp tôi." },
        { id: "shopping-color", chinese: "有其他顏色嗎？", vietnamese: "Có màu khác không ạ?" },
        { id: "shopping-size", chinese: "有其他尺寸嗎？", vietnamese: "Cái này có kích cỡ khác không ạ?" },
        { id: "shopping-no-bag", chinese: "不用袋子，謝謝", vietnamese: "Không cần túi, cảm ơn." },
      ],
    },
    {
      id: "dining",
      icon: "🍜",
      label: "餐飲",
      phrases: [
        { id: "dining-no-spicy", chinese: "不要辣，謝謝", vietnamese: "Không cay, cảm ơn." },
        { id: "dining-less-spicy", chinese: "少辣，謝謝", vietnamese: "Ít cay, cảm ơn." },
        { id: "dining-no-ice", chinese: "去冰，謝謝", vietnamese: "Không đá, cảm ơn." },
        { id: "dining-less-ice", chinese: "少冰，謝謝", vietnamese: "Ít đá, cảm ơn." },
        { id: "dining-less-sugar", chinese: "少糖，謝謝", vietnamese: "Ít đường, cảm ơn." },
        { id: "dining-takeaway", chinese: "外帶，謝謝", vietnamese: "Mang về, cảm ơn." },
        { id: "dining-here", chinese: "在這裡吃", vietnamese: "Ăn tại đây." },
        { id: "dining-pork", chinese: "這個有豬肉嗎？", vietnamese: "Món này có thịt heo không?" },
        { id: "dining-meat", chinese: "這是什麼肉？", vietnamese: "Đây là thịt gì?" },
        { id: "dining-no-coriander", chinese: "不要香菜，謝謝", vietnamese: "Không cho rau mùi, cảm ơn." },
        { id: "dining-ice-separate", chinese: "冰另外放，謝謝", vietnamese: "Cho đá riêng, cảm ơn." },
        { id: "dining-restroom", chinese: "廁所在哪裡？", vietnamese: "Nhà vệ sinh ở đâu ạ?" },
      ],
    },
    {
      id: "transport",
      icon: "🚕",
      label: "交通",
      phrases: [
        { id: "transport-address", chinese: "請帶我到這個地址", vietnamese: "Làm ơn đưa tôi đến địa chỉ này." },
        { id: "transport-where-address", chinese: "請問，您知道這個地址在哪裡嗎？", vietnamese: "Cho tôi hỏi, địa chỉ này ở đâu ạ?" },
        { id: "transport-airport", chinese: "我想去機場", vietnamese: "Tôi muốn đến sân bay." },
        { id: "transport-stop", chinese: "請在這裡停車", vietnamese: "Dừng ở đây, cảm ơn." },
        { id: "transport-wait", chinese: "請稍等一下", vietnamese: "Vui lòng chờ một chút." },
        { id: "transport-call-car", chinese: "請幫我叫車", vietnamese: "Làm ơn gọi xe giúp tôi." },
        { id: "transport-guide", chinese: "我需要找導遊", vietnamese: "Tôi cần tìm hướng dẫn viên." },
        { id: "transport-meeting", chinese: "這裡是集合地點嗎？", vietnamese: "Đây có phải là điểm tập trung không ạ?" },
        { id: "transport-finding-address", chinese: "我在找這個地址", vietnamese: "Tôi đang tìm địa chỉ này." },
        { id: "transport-correct-address", chinese: "這是正確的地址嗎？", vietnamese: "Đây có phải là địa chỉ đúng không ạ?" },
        { id: "transport-get-off", chinese: "我們在這裡下車，謝謝", vietnamese: "Cho chúng tôi xuống ở đây, cảm ơn." },
        { id: "transport-pick-up", chinese: "請在這裡接我們", vietnamese: "Vui lòng đón chúng tôi ở đây." },
      ],
    },
    {
      id: "help",
      icon: "🆘",
      label: "溝通求助",
      phrases: [
        { id: "help-hello", chinese: "你好", vietnamese: "Xin chào" },
        { id: "help-thanks", chinese: "謝謝", vietnamese: "Cảm ơn" },
        { id: "help-sorry", chinese: "不好意思", vietnamese: "Xin lỗi" },
        { id: "help-no-vietnamese", chinese: "我不懂越南語", vietnamese: "Tôi không hiểu tiếng Việt." },
        { id: "help-slowly", chinese: "請說慢一點", vietnamese: "Vui lòng nói chậm hơn một chút." },
        { id: "help-write", chinese: "你可以寫給我看嗎？", vietnamese: "Vui lòng viết ra giúp tôi." },
        { id: "help-me", chinese: "請幫幫我", vietnamese: "Làm ơn giúp tôi." },
        { id: "help-no-network", chinese: "我的手機沒有網路", vietnamese: "Điện thoại của tôi không có mạng." },
        { id: "help-lost-wallet", chinese: "我的錢包不見了", vietnamese: "Tôi bị mất ví." },
      ],
    },
  ];
  const ALL_PHRASES = PHRASE_CATEGORIES.flatMap((category) => category.phrases);
  const PHRASE_BY_ID = new Map(ALL_PHRASES.map((phrase) => [phrase.id, phrase]));
  const DEFAULT_FAVORITE_PHRASE_IDS = [
    "help-hello",
    "help-thanks",
    "shopping-price",
    "shopping-card",
    "shopping-bag",
    "dining-no-ice",
    "transport-address",
    "help-no-vietnamese",
  ];
  const PHRASE_CATEGORY_IDS = new Set(["favorites", ...PHRASE_CATEGORIES.map((category) => category.id)]);
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
  const CONVERSION_PRESETS = {
    "vnd-to-twd": [
      { value: 50000, label: "50k" },
      { value: 100000, label: "100k" },
      { value: 200000, label: "200k" },
      { value: 500000, label: "500k" },
    ],
    "twd-to-vnd": [
      { value: 100, label: "NT$100" },
      { value: 500, label: "NT$500" },
      { value: 1000, label: "NT$1,000" },
      { value: 2000, label: "NT$2,000" },
    ],
  };

  const elements = {
    conversionTab: document.getElementById("conversionTab"),
    shoppingTab: document.getElementById("shoppingTab"),
    phrasesTab: document.getElementById("phrasesTab"),
    conversionPanel: document.getElementById("conversionPanel"),
    shoppingPanel: document.getElementById("shoppingPanel"),
    phrasesPanel: document.getElementById("phrasesPanel"),
    phraseCategoryList: document.getElementById("phraseCategoryList"),
    phraseStatus: document.getElementById("phraseStatus"),
    phraseViewDialog: document.getElementById("phraseViewDialog"),
    phraseViewChinese: document.getElementById("phraseViewChinese"),
    phraseViewVietnamese: document.getElementById("phraseViewVietnamese"),
    phraseViewCloseButton: document.getElementById("phraseViewCloseButton"),
    phraseViewDoneButton: document.getElementById("phraseViewDoneButton"),
    phraseConfirmDialog: document.getElementById("phraseConfirmDialog"),
    phraseConfirmTitle: document.getElementById("phraseConfirmTitle"),
    phraseConfirmDescription: document.getElementById("phraseConfirmDescription"),
    phraseConfirmCancelButton: document.getElementById("phraseConfirmCancelButton"),
    phraseConfirmActionButton: document.getElementById("phraseConfirmActionButton"),
    cartStepButton: document.getElementById("cartStepButton"),
    paymentStepButton: document.getElementById("paymentStepButton"),
    paymentStepHint: document.getElementById("paymentStepHint"),
    cartStepPanel: document.getElementById("cartStepPanel"),
    paymentStepPanel: document.getElementById("paymentStepPanel"),
    shoppingTitle: document.getElementById("shoppingTitle"),
    paymentTitle: document.getElementById("paymentTitle"),
    vndToTwdButton: document.getElementById("vndToTwdButton"),
    twdToVndButton: document.getElementById("twdToVndButton"),
    conversionInputLabel: document.getElementById("conversionInputLabel"),
    conversionCurrencyPrefix: document.getElementById("conversionCurrencyPrefix"),
    conversionInput: document.getElementById("conversionInput"),
    clearConversionButton: document.getElementById("clearConversionButton"),
    conversionHint: document.getElementById("conversionHint"),
    conversionError: document.getElementById("conversionError"),
    conversionNote: document.getElementById("conversionNote"),
    conversionResultLabel: document.getElementById("conversionResultLabel"),
    conversionQuickGrid: document.getElementById("conversionQuickGrid"),
    twdEstimate: document.getElementById("twdEstimate"),
    rateOnboarding: document.getElementById("rateOnboarding"),
    onboardingActualRateButton: document.getElementById("onboardingActualRateButton"),
    onboardingDirectRateButton: document.getElementById("onboardingDirectRateButton"),
    onboardingDefaultRateButton: document.getElementById("onboardingDefaultRateButton"),
    rateSettingsCard: document.getElementById("rateSettingsCard"),
    rateSettingsSummary: document.getElementById("rateSettingsSummary"),
    directRateModeButton: document.getElementById("directRateModeButton"),
    actualRateModeButton: document.getElementById("actualRateModeButton"),
    directRatePanel: document.getElementById("directRatePanel"),
    actualRatePanel: document.getElementById("actualRatePanel"),
    rateInput: document.getElementById("rateInput"),
    rateError: document.getElementById("rateError"),
    rateSetupStatus: document.getElementById("rateSetupStatus"),
    actualTwdInput: document.getElementById("actualTwdInput"),
    actualVndInput: document.getElementById("actualVndInput"),
    actualTwdError: document.getElementById("actualTwdError"),
    actualVndError: document.getElementById("actualVndError"),
    actualExchangeResult: document.getElementById("actualExchangeResult"),
    actualRateResult: document.getElementById("actualRateResult"),
    actualRateStatus: document.getElementById("actualRateStatus"),
    applyActualRateButton: document.getElementById("applyActualRateButton"),
    denominationReferenceGrid: document.getElementById("denominationReferenceGrid"),
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
    shoppingNoteCount: document.getElementById("shoppingNoteCount"),
    shoppingNoteList: document.getElementById("shoppingNoteList"),
    goToPaymentButton: document.getElementById("goToPaymentButton"),
    backToCartButton: document.getElementById("backToCartButton"),
    clearCartButton: document.getElementById("clearCartButton"),
    paymentTotal: document.getElementById("paymentTotal"),
    paymentTotalTwd: document.getElementById("paymentTotalTwd"),
    paymentInput: document.getElementById("paymentInput"),
    clearPaymentButton: document.getElementById("clearPaymentButton"),
    banknoteGrid: document.getElementById("banknoteGrid"),
    changePanel: document.getElementById("changePanel"),
  };

  let rate = readRate();
  let cart = readCart();
  let isUsingRestoredCart = cart.length > 0;
  let banknoteCounts = {};
  let activeShoppingStep = "cart";
  let conversionDirection = "vnd-to-twd";
  let hasPlayedRestoredNoticeEffect = false;
  let calculatedActualRate = null;
  let shouldShowRateOnboarding = !hasStoredRate();
  let rateSettingsMode = "direct";
  let favoritePhraseIds = readFavoritePhraseIds();
  let openPhraseCategoryId = readOpenPhraseCategoryId();
  let phraseViewReturnFocus = null;
  let phraseConfirmReturnFocus = null;
  let pendingPhraseAction = null;

  function updateRateOnboardingAttention() {
    const shouldAnimate = !elements.rateOnboarding.hidden && !elements.conversionPanel.hidden;
    elements.rateOnboarding.classList.toggle("is-attention", shouldAnimate);
  }

  function setActiveTab(tabName, moveFocus = false) {
    const tabs = [
      { name: "conversion", tab: elements.conversionTab, panel: elements.conversionPanel },
      { name: "shopping", tab: elements.shoppingTab, panel: elements.shoppingPanel },
      { name: "phrases", tab: elements.phrasesTab, panel: elements.phrasesPanel },
    ];
    const activeItem = tabs.find((item) => item.name === tabName) || tabs[0];

    tabs.forEach((item) => {
      const isActive = item === activeItem;
      item.panel.hidden = !isActive;
      item.tab.classList.toggle("is-active", isActive);
      item.tab.setAttribute("aria-selected", String(isActive));
      item.tab.tabIndex = isActive ? 0 : -1;
    });

    if (moveFocus) activeItem.tab.focus();
    if (activeItem.name === "conversion") {
      elements.restoredCartNotice.classList.remove("is-attention");
      updateRateOnboardingAttention();
    } else if (activeItem.name === "shopping") {
      elements.rateOnboarding.classList.remove("is-attention");
      playRestoredCartNoticeEffect();
    } else {
      elements.rateOnboarding.classList.remove("is-attention");
      elements.restoredCartNotice.classList.remove("is-attention");
    }
  }

  function playRestoredCartNoticeEffect() {
    if (
      hasPlayedRestoredNoticeEffect ||
      !isUsingRestoredCart ||
      cart.length === 0 ||
      elements.restoredCartNotice.hidden ||
      elements.shoppingPanel.hidden
    ) return;

    hasPlayedRestoredNoticeEffect = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    elements.restoredCartNotice.classList.add("is-attention");
  }

  function dismissRestoredCartNoticeEffect() {
    hasPlayedRestoredNoticeEffect = true;
    elements.restoredCartNotice.classList.remove("is-attention");
  }

  function setShoppingStep(stepName, moveFocus = false) {
    const isPayment = stepName === "payment";
    if (isPayment && cart.length === 0) return;

    activeShoppingStep = isPayment ? "payment" : "cart";
    elements.shoppingPanel.classList.toggle("is-payment-step", isPayment);
    elements.cartStepPanel.hidden = isPayment;
    elements.paymentStepPanel.hidden = !isPayment;

    [elements.cartStepButton, elements.paymentStepButton].forEach((button) => {
      const isActive = button === (isPayment ? elements.paymentStepButton : elements.cartStepButton);
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (moveFocus) {
      const target = isPayment ? elements.paymentTitle : elements.shoppingTitle;
      target.focus();
    }
  }

  function updateShoppingStepAvailability() {
    const hasItems = cart.length > 0;
    elements.paymentStepButton.disabled = !hasItems;
    elements.goToPaymentButton.disabled = !hasItems;
    elements.paymentStepHint.classList.toggle("is-hidden", hasItems);

    [elements.paymentStepButton, elements.goToPaymentButton].forEach((button) => {
      if (hasItems) {
        button.removeAttribute("aria-describedby");
      } else {
        button.setAttribute("aria-describedby", "paymentStepHint");
      }
    });

    if (!hasItems && activeShoppingStep === "payment") setShoppingStep("cart");
  }

  function handleTabKeydown(event) {
    const tabs = [
      { name: "conversion", tab: elements.conversionTab },
      { name: "shopping", tab: elements.shoppingTab },
      { name: "phrases", tab: elements.phrasesTab },
    ];
    const currentIndex = tabs.findIndex((item) => item.tab === event.currentTarget);
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
    setActiveTab(tabs[nextIndex].name, true);
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

  function parseTwd(value) {
    const source = String(value ?? "").trim();
    if (!source) return null;
    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(source)) return null;

    const parsed = Number(source.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > Number.MAX_SAFE_INTEGER) return null;
    return parsed;
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

  function renderDenominationReference() {
    elements.denominationReferenceGrid.innerHTML = BANKNOTES.map((note) => {
      const twdValue = (note.amount / 1000) * rate;
      return `
        <div
          class="denomination-reference-card"
          role="listitem"
          aria-label="${note.short} 越南盾，約 ${formatTwd(twdValue)}"
        >
          <img
            class="banknote-image"
            src="${note.image}"
            alt="越南 ${formatNumber(note.amount)} đồng 鈔票正面官方樣張"
            loading="lazy"
            decoding="async"
          />
          <div class="banknote-card-footer">
            <strong>${note.short}</strong>
            <span>約 ${formatTwd(twdValue)}</span>
          </div>
        </div>
      `;
    }).join("");
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

  function hasStoredRate() {
    try {
      const storedValue = localStorage.getItem(RATE_STORAGE_KEY);
      if (storedValue === null) return false;
      const parsed = Number.parseFloat(storedValue);
      return Number.isFinite(parsed) && parsed > 0;
    } catch (_error) {
      return false;
    }
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
    elements.rateSettingsSummary.textContent = `₫1,000 ≈ NT$${rate.toFixed(2)}`;
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

  function readFavoritePhraseIds() {
    try {
      const stored = localStorage.getItem(PHRASE_FAVORITES_STORAGE_KEY);
      if (stored === null) return [...DEFAULT_FAVORITE_PHRASE_IDS];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [...DEFAULT_FAVORITE_PHRASE_IDS];

      const seen = new Set();
      return parsed.filter((phraseId) => {
        if (typeof phraseId !== "string" || !PHRASE_BY_ID.has(phraseId) || seen.has(phraseId)) return false;
        seen.add(phraseId);
        return true;
      });
    } catch (_error) {
      return [...DEFAULT_FAVORITE_PHRASE_IDS];
    }
  }

  function saveFavoritePhraseIds() {
    try {
      localStorage.setItem(PHRASE_FAVORITES_STORAGE_KEY, JSON.stringify(favoritePhraseIds));
    } catch (_error) {
      // Storage may be unavailable; favorites still work during the current session.
    }
  }

  function readOpenPhraseCategoryId() {
    try {
      const stored = localStorage.getItem(PHRASE_OPEN_CATEGORY_STORAGE_KEY);
      if (stored === null) return "favorites";
      if (stored === "") return null;
      return PHRASE_CATEGORY_IDS.has(stored) ? stored : "favorites";
    } catch (_error) {
      return "favorites";
    }
  }

  function saveOpenPhraseCategoryId() {
    try {
      localStorage.setItem(PHRASE_OPEN_CATEGORY_STORAGE_KEY, openPhraseCategoryId || "");
    } catch (_error) {
      // Storage may be unavailable; the accordion still works during the current session.
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

  function getConversionOutput(rawValue, direction = conversionDirection) {
    if (direction === "vnd-to-twd") {
      const amount = parseVnd(rawValue);
      if (amount === null || amount === 0) return null;
      return Math.round((amount / 1000) * rate);
    }

    const amount = parseTwd(rawValue);
    if (amount === null || amount === 0) return null;
    const calculatedVnd = (amount / rate) * 1000;
    if (!Number.isSafeInteger(Math.round(calculatedVnd))) return null;
    return Math.max(1000, Math.round(calculatedVnd / 1000) * 1000);
  }

  function renderConversionDirection() {
    const isVndToTwd = conversionDirection === "vnd-to-twd";
    const activeButton = isVndToTwd ? elements.vndToTwdButton : elements.twdToVndButton;

    [elements.vndToTwdButton, elements.twdToVndButton].forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    elements.conversionInputLabel.textContent = isVndToTwd ? "越南盾金額" : "新台幣金額";
    elements.conversionCurrencyPrefix.textContent = isVndToTwd ? "₫" : "NT$";
    elements.conversionInput.placeholder = isVndToTwd ? "例如 150k" : "例如 1,000";
    elements.conversionInput.inputMode = "decimal";
    elements.conversionHint.textContent = isVndToTwd
      ? "可輸入 150000、150k、1.2m 或 150.000"
      : "可輸入 1000、1,000 或小數";
    elements.conversionResultLabel.textContent = isVndToTwd ? "約新台幣" : "約越南盾";
    elements.conversionQuickGrid.setAttribute(
      "aria-label",
      isVndToTwd ? "快速輸入越南盾金額" : "快速輸入新台幣金額",
    );

    const presets = CONVERSION_PRESETS[conversionDirection];
    elements.conversionQuickGrid.querySelectorAll("[data-amount]").forEach((button, index) => {
      const preset = presets[index];
      button.dataset.amount = String(preset.value);
      button.textContent = preset.label;
    });
  }

  function setConversionDirection(direction) {
    if (direction === conversionDirection) {
      elements.conversionInput.focus();
      return;
    }

    const convertedValue = getConversionOutput(elements.conversionInput.value);
    conversionDirection = direction;
    renderConversionDirection();
    elements.conversionInput.value = convertedValue === null ? "" : String(convertedValue);
    updateConversion();
    elements.conversionInput.focus();
  }

  function updateConversion() {
    const rawValue = elements.conversionInput.value;
    clearError(elements.conversionError);
    const isVndToTwd = conversionDirection === "vnd-to-twd";
    const amount = isVndToTwd ? parseVnd(rawValue) : parseTwd(rawValue);

    if (!rawValue.trim()) {
      elements.twdEstimate.textContent = "—";
      elements.conversionNote.textContent = `目前匯率：1,000 越南盾 = NT$${rate.toFixed(2)}`;
      elements.conversionInput.removeAttribute("aria-invalid");
      return;
    }

    if (amount === null || amount === 0) {
      elements.twdEstimate.textContent = "—";
      elements.conversionNote.textContent = isVndToTwd
        ? "請輸入有效的越南盾金額"
        : "請輸入有效的新台幣金額";
      elements.conversionInput.setAttribute("aria-invalid", "true");
      if (rawValue.trim()) {
        showError(
          elements.conversionError,
          isVndToTwd
            ? "可輸入 150000、150k、1.2m 或 150.000。"
            : "可輸入 1000、1,000 或最多兩位小數。",
        );
      }
      return;
    }

    elements.conversionInput.removeAttribute("aria-invalid");
    if (isVndToTwd) {
      elements.twdEstimate.textContent = formatTwd((amount / 1000) * rate);
      elements.conversionNote.textContent = `${formatVnd(amount)} ÷ 1,000 × ${rate.toFixed(2)}`;
      return;
    }

    const convertedVnd = getConversionOutput(rawValue, "twd-to-vnd");
    if (convertedVnd === null) {
      elements.twdEstimate.textContent = "—";
      elements.conversionNote.textContent = "金額超出可換算範圍";
      elements.conversionInput.setAttribute("aria-invalid", "true");
      showError(elements.conversionError, "請輸入較小的新台幣金額。");
      return;
    }
    elements.twdEstimate.textContent = formatVnd(convertedVnd);
    elements.conversionNote.textContent = `${formatTwd(amount)} ÷ ${rate.toFixed(2)} × 1,000，取整至千盾`;
  }

  function completeRateSetup(statusMessage = "") {
    shouldShowRateOnboarding = false;
    elements.rateOnboarding.hidden = true;
    elements.rateOnboarding.classList.remove("is-attention");
    if (statusMessage) elements.rateSetupStatus.textContent = statusMessage;
  }

  function setRateSettingsMode(mode, moveFocus = false) {
    const isActual = mode === "actual";
    rateSettingsMode = isActual ? "actual" : "direct";
    elements.rateSettingsCard.open = true;
    elements.directRatePanel.hidden = isActual;
    elements.actualRatePanel.hidden = !isActual;

    [elements.directRateModeButton, elements.actualRateModeButton].forEach((button) => {
      const isActive = button === (isActual ? elements.actualRateModeButton : elements.directRateModeButton);
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (moveFocus) {
      (isActual ? elements.actualTwdInput : elements.rateInput).focus();
    }
  }

  function updateRate({ completeSetup = false, statusMessage = "" } = {}) {
    const value = getRate();
    clearError(elements.rateError);
    elements.rateSetupStatus.textContent = "";

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
    renderDenominationReference();
    updatePayment();
    if (completeSetup) {
      completeRateSetup(statusMessage || `已更新換算基準：NT$${rate.toFixed(2)}`);
    }
  }

  function clearActualRateAppliedStatus() {
    elements.actualExchangeResult.classList.remove("is-applied");
    if (calculatedActualRate !== null) {
      elements.actualRateStatus.textContent = "已算出這次的實際匯率，可按下按鈕套用。";
    }
  }

  function updateActualExchangeRate() {
    const rawTwd = elements.actualTwdInput.value;
    const rawVnd = elements.actualVndInput.value;
    const paidTwd = parseTwd(rawTwd);
    const receivedVnd = parseVnd(rawVnd);
    const hasTwdInput = rawTwd.trim() !== "";
    const hasVndInput = rawVnd.trim() !== "";
    const invalidTwd = hasTwdInput && (paidTwd === null || paidTwd <= 0);
    const invalidVnd = hasVndInput && (receivedVnd === null || receivedVnd <= 0);

    clearError(elements.actualTwdError);
    clearError(elements.actualVndError);
    if (invalidTwd) {
      elements.actualTwdInput.setAttribute("aria-invalid", "true");
    } else {
      elements.actualTwdInput.removeAttribute("aria-invalid");
    }
    if (invalidVnd) {
      elements.actualVndInput.setAttribute("aria-invalid", "true");
    } else {
      elements.actualVndInput.removeAttribute("aria-invalid");
    }
    elements.actualExchangeResult.classList.remove("is-applied");
    calculatedActualRate = null;
    elements.applyActualRateButton.disabled = true;
    elements.applyActualRateButton.textContent = "輸入後即可使用";
    elements.actualRateResult.textContent = "—";

    if (invalidTwd) {
      showError(elements.actualTwdError, "請輸入大於 0 的臺幣金額，最多兩位小數。");
    }
    if (invalidVnd) {
      showError(elements.actualVndError, "請輸入大於 0 的越南盾金額，例如 3m 或 3.000.000。");
    }

    if (invalidTwd || invalidVnd) {
      elements.actualRateStatus.textContent = "請先修正金額格式。";
      return;
    }

    if (!hasTwdInput || !hasVndInput) {
      elements.actualRateStatus.textContent = "輸入兩筆金額後自動計算。";
      return;
    }

    const roundedRate = Math.round(((paidTwd / receivedVnd) * 1000) * 100) / 100;
    if (!Number.isFinite(roundedRate) || roundedRate <= 0) {
      elements.actualRateStatus.textContent = "這組金額無法產生可用的匯率，請確認後再試一次。";
      return;
    }

    calculatedActualRate = roundedRate;
    elements.actualRateResult.textContent = `1,000 越南盾 = NT$${roundedRate.toFixed(2)}`;
    elements.actualRateStatus.textContent = "已算出這次的實際匯率，可按下按鈕套用。";
    elements.applyActualRateButton.disabled = false;
    elements.applyActualRateButton.textContent = `使用 NT$${roundedRate.toFixed(2)}`;
  }

  function applyActualExchangeRate() {
    if (calculatedActualRate === null) return;

    elements.rateInput.value = calculatedActualRate.toFixed(2);
    updateRate({ completeSetup: true });
    elements.actualExchangeResult.classList.add("is-applied");
    elements.actualRateStatus.textContent = `已將 NT$${calculatedActualRate.toFixed(2)} 設為換算基準`;
  }

  function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  function updateRestoredCartNotice() {
    const shouldShow = isUsingRestoredCart && cart.length > 0;
    elements.restoredCartNotice.hidden = !shouldShow;
    if (!shouldShow) elements.restoredCartNotice.classList.remove("is-attention");
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
    updateShoppingStepAvailability();
    updateRestoredCartNotice();
    updatePayment();
  }

  function startNewPurchase() {
    dismissRestoredCartNoticeEffect();
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
    elements.shoppingNoteSuggestion.open = false;
    setShoppingStep("cart");
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
    if (cart.length === 0) {
      dismissRestoredCartNoticeEffect();
      isUsingRestoredCart = false;
    }
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
      elements.shoppingNoteSuggestion.hidden = true;
      elements.shoppingNoteSuggestion.open = false;
      elements.shoppingNoteCount.textContent = "共 0 種面額";
      elements.shoppingNoteList.innerHTML = "";
      return;
    }

    const notes = breakdownChange(total).filter((note) => getBanknote(note.denomination));
    const noteList = notes
      .map((note) => {
        const banknote = getBanknote(note.denomination);
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
    elements.shoppingNoteCount.textContent = `共 ${notes.length} 種面額`;
    elements.shoppingNoteSuggestion.hidden = noteList === "";
    if (noteList === "") elements.shoppingNoteSuggestion.open = false;
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
    elements.paymentTotalTwd.textContent = `約 ${formatTwd((total / 1000) * rate)}`;
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

  function createPhraseCard(phrase, categoryId) {
    const card = document.createElement("article");
    card.className = "phrase-card";
    card.setAttribute("role", "listitem");

    const copy = document.createElement("div");
    copy.className = "phrase-card-copy";
    const chinese = document.createElement("h3");
    chinese.textContent = phrase.chinese;
    const vietnamese = document.createElement("p");
    vietnamese.lang = "vi";
    vietnamese.textContent = phrase.vietnamese;
    copy.append(chinese, vietnamese);

    const actions = document.createElement("div");
    actions.className = "phrase-card-actions";
    const isFavorite = favoritePhraseIds.includes(phrase.id);
    const favoriteButton = document.createElement("button");
    favoriteButton.className = `phrase-favorite-button${isFavorite ? " is-favorite" : ""}`;
    favoriteButton.type = "button";
    favoriteButton.dataset.phraseFavoriteId = phrase.id;
    favoriteButton.dataset.phraseContext = categoryId;
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.setAttribute("aria-label", `${isFavorite ? "取消常用字卡" : "加入常用字卡"}：${phrase.chinese}`);
    favoriteButton.textContent = isFavorite ? "⭐" : "☆";

    const viewButton = document.createElement("button");
    viewButton.className = "secondary-button phrase-view-button";
    viewButton.type = "button";
    viewButton.dataset.phraseViewId = phrase.id;
    viewButton.textContent = "查看";
    actions.append(favoriteButton, viewButton);
    card.append(copy, actions);
    return card;
  }

  function focusRenderedPhraseTarget(target) {
    if (!target) return;
    window.requestAnimationFrame(() => {
      let selector = "";
      if (target.type === "category") {
        selector = `[data-phrase-category-toggle="${target.categoryId}"]`;
      } else if (target.type === "favorite") {
        selector = `[data-phrase-context="${target.categoryId}"][data-phrase-favorite-id="${target.phraseId}"]`;
      }
      const nextTarget = selector ? elements.phraseCategoryList.querySelector(selector) : null;
      if (nextTarget) nextTarget.focus();
    });
  }

  function renderPhraseCategories(focusTarget = null) {
    const categories = [
      {
        id: "favorites",
        icon: "⭐",
        label: "常用字卡",
        phrases: favoritePhraseIds.map((phraseId) => PHRASE_BY_ID.get(phraseId)).filter(Boolean),
      },
      ...PHRASE_CATEGORIES,
    ];
    const fragment = document.createDocumentFragment();

    categories.forEach((category) => {
      const isOpen = openPhraseCategoryId === category.id;
      const section = document.createElement("section");
      section.className = `card phrase-category${isOpen ? " is-open" : ""}`;

      const toggle = document.createElement("button");
      toggle.className = "phrase-category-toggle";
      toggle.id = `phraseCategoryToggle-${category.id}`;
      toggle.type = "button";
      toggle.dataset.phraseCategoryToggle = category.id;
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-controls", `phraseCategoryPanel-${category.id}`);

      const heading = document.createElement("span");
      heading.className = "phrase-category-heading";
      const icon = document.createElement("span");
      icon.className = "phrase-category-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = category.icon;
      const label = document.createElement("strong");
      label.textContent = category.label;
      heading.append(icon, label);

      const count = document.createElement("span");
      count.className = "phrase-category-count";
      count.textContent = `${category.phrases.length} 張`;
      const chevron = document.createElement("span");
      chevron.className = "phrase-category-chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "⌄";
      toggle.append(heading, count, chevron);

      const panel = document.createElement("div");
      panel.className = "phrase-category-panel";
      panel.id = `phraseCategoryPanel-${category.id}`;
      panel.dataset.phraseCategory = category.id;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", toggle.id);
      panel.hidden = !isOpen;

      if (category.id === "favorites") {
        const toolbar = document.createElement("div");
        toolbar.className = "phrase-favorites-toolbar";
        const restoreButton = document.createElement("button");
        restoreButton.className = "secondary-button";
        restoreButton.type = "button";
        restoreButton.dataset.phraseAction = "restore";
        restoreButton.textContent = "恢復預設";
        const clearButton = document.createElement("button");
        clearButton.className = "text-button danger-button phrase-clear-button";
        clearButton.type = "button";
        clearButton.dataset.phraseAction = "clear";
        clearButton.disabled = category.phrases.length === 0;
        clearButton.textContent = "清空常用";
        toolbar.append(restoreButton, clearButton);
        panel.append(toolbar);
      }

      if (category.phrases.length > 0) {
        const grid = document.createElement("div");
        grid.className = "phrase-grid";
        grid.setAttribute("role", "list");
        category.phrases.forEach((phrase) => grid.append(createPhraseCard(phrase, category.id)));
        panel.append(grid);
      } else {
        const emptyState = document.createElement("div");
        emptyState.className = "phrase-empty-state";
        const emptyText = document.createElement("p");
        emptyText.textContent = "目前還沒有常用字卡";
        const restoreButton = document.createElement("button");
        restoreButton.className = "primary-button";
        restoreButton.type = "button";
        restoreButton.dataset.phraseAction = "restore";
        restoreButton.textContent = "恢復預設常用字卡";
        emptyState.append(emptyText, restoreButton);
        panel.append(emptyState);
      }

      section.append(toggle, panel);
      fragment.append(section);
    });

    elements.phraseCategoryList.replaceChildren(fragment);
    focusRenderedPhraseTarget(focusTarget);
  }

  function togglePhraseFavorite(phraseId, categoryId) {
    const phrase = PHRASE_BY_ID.get(phraseId);
    if (!phrase) return;

    const wasFavorite = favoritePhraseIds.includes(phraseId);
    favoritePhraseIds = wasFavorite
      ? favoritePhraseIds.filter((favoriteId) => favoriteId !== phraseId)
      : [...favoritePhraseIds, phraseId];
    saveFavoritePhraseIds();
    elements.phraseStatus.textContent = `${wasFavorite ? "已從常用字卡移除" : "已加入常用字卡"}：${phrase.chinese}`;
    const focusTarget = wasFavorite && categoryId === "favorites"
      ? { type: "category", categoryId: "favorites" }
      : { type: "favorite", categoryId, phraseId };
    renderPhraseCategories(focusTarget);
  }

  function openPhraseView(phraseId, trigger) {
    const phrase = PHRASE_BY_ID.get(phraseId);
    if (!phrase) return;

    phraseViewReturnFocus = trigger;
    elements.phraseViewChinese.textContent = phrase.chinese;
    elements.phraseViewVietnamese.textContent = phrase.vietnamese;
    elements.phraseViewDialog.showModal();
    elements.phraseViewCloseButton.focus();
  }

  function closePhraseView() {
    if (elements.phraseViewDialog.open) elements.phraseViewDialog.close();
  }

  function openPhraseConfirmation(action, trigger) {
    pendingPhraseAction = action;
    phraseConfirmReturnFocus = trigger;

    if (action === "restore") {
      elements.phraseConfirmTitle.textContent = "恢復預設常用字卡？";
      elements.phraseConfirmDescription.textContent = "目前的常用字卡會被替換為預設的 8 張。";
      elements.phraseConfirmActionButton.textContent = "恢復預設";
      elements.phraseConfirmActionButton.classList.remove("is-danger");
    } else {
      elements.phraseConfirmTitle.textContent = "清空所有常用字卡？";
      elements.phraseConfirmDescription.textContent = "所有自訂常用字卡都會被移除，之後仍可恢復預設內容。";
      elements.phraseConfirmActionButton.textContent = "清空常用";
      elements.phraseConfirmActionButton.classList.add("is-danger");
    }

    elements.phraseConfirmDialog.showModal();
    elements.phraseConfirmCancelButton.focus();
  }

  function confirmPhraseAction() {
    if (pendingPhraseAction === "restore") {
      favoritePhraseIds = [...DEFAULT_FAVORITE_PHRASE_IDS];
      elements.phraseStatus.textContent = "已恢復預設的 8 張常用字卡";
    } else if (pendingPhraseAction === "clear") {
      favoritePhraseIds = [];
      elements.phraseStatus.textContent = "已清空所有常用字卡";
    } else {
      return;
    }

    saveFavoritePhraseIds();
    pendingPhraseAction = null;
    phraseConfirmReturnFocus = null;
    elements.phraseConfirmDialog.close();
    renderPhraseCategories({ type: "category", categoryId: "favorites" });
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
  elements.phrasesTab.addEventListener("click", () => setActiveTab("phrases"));
  elements.conversionTab.addEventListener("keydown", handleTabKeydown);
  elements.shoppingTab.addEventListener("keydown", handleTabKeydown);
  elements.phrasesTab.addEventListener("keydown", handleTabKeydown);
  elements.vndToTwdButton.addEventListener("click", () => setConversionDirection("vnd-to-twd"));
  elements.twdToVndButton.addEventListener("click", () => setConversionDirection("twd-to-vnd"));
  elements.restoredCartNotice.addEventListener("animationend", () => {
    elements.restoredCartNotice.classList.remove("is-attention");
  });
  elements.goToRateButton.addEventListener("click", () => {
    setActiveTab("conversion");
    setRateSettingsMode("direct", true);
  });
  elements.onboardingActualRateButton.addEventListener("click", () => {
    completeRateSetup();
    setRateSettingsMode("actual", true);
  });
  elements.onboardingDirectRateButton.addEventListener("click", () => {
    completeRateSetup();
    setRateSettingsMode("direct", true);
  });
  elements.onboardingDefaultRateButton.addEventListener("click", () => {
    elements.rateInput.value = DEFAULT_RATE.toFixed(2);
    updateRate({ completeSetup: true, statusMessage: "已使用預設換算基準 NT$1.30" });
    elements.rateSettingsCard.open = false;
  });
  elements.directRateModeButton.addEventListener("click", () => setRateSettingsMode("direct", true));
  elements.actualRateModeButton.addEventListener("click", () => setRateSettingsMode("actual", true));
  elements.startNewPurchaseButton.addEventListener("click", startNewPurchase);
  elements.cartStepButton.addEventListener("click", () => setShoppingStep("cart", true));
  elements.paymentStepButton.addEventListener("click", () => setShoppingStep("payment", true));
  elements.goToPaymentButton.addEventListener("click", () => setShoppingStep("payment", true));
  elements.backToCartButton.addEventListener("click", () => setShoppingStep("cart", true));
  elements.clearConversionButton.addEventListener("click", () => {
    elements.conversionInput.value = "";
    updateConversion();
    elements.conversionInput.focus();
  });
  elements.conversionInput.addEventListener("input", updateConversion);
  elements.rateInput.addEventListener("input", () => {
    clearActualRateAppliedStatus();
    updateRate({ completeSetup: true });
  });
  elements.actualTwdInput.addEventListener("input", updateActualExchangeRate);
  elements.actualVndInput.addEventListener("input", updateActualExchangeRate);
  elements.applyActualRateButton.addEventListener("click", applyActualExchangeRate);
  elements.itemForm.addEventListener("submit", addItem);
  elements.cartList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-id]");
    if (button) removeItem(button.dataset.removeId);
  });
  elements.clearCartButton.addEventListener("click", () => {
    if (cart.length === 0) return;
    dismissRestoredCartNoticeEffect();
    isUsingRestoredCart = false;
    cart = [];
    saveCart();
    elements.paymentInput.value = "";
    resetBanknoteCounts();
    elements.shoppingNoteSuggestion.open = false;
    setShoppingStep("cart");
    renderCart();
    elements.formStatus.textContent = "已清除購物清單";
    elements.itemName.focus();
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
  elements.phraseCategoryList.addEventListener("click", (event) => {
    const categoryToggle = event.target.closest("[data-phrase-category-toggle]");
    if (categoryToggle) {
      const categoryId = categoryToggle.dataset.phraseCategoryToggle;
      openPhraseCategoryId = openPhraseCategoryId === categoryId ? null : categoryId;
      saveOpenPhraseCategoryId();
      renderPhraseCategories({ type: "category", categoryId });
      return;
    }

    const favoriteButton = event.target.closest("[data-phrase-favorite-id]");
    if (favoriteButton) {
      togglePhraseFavorite(favoriteButton.dataset.phraseFavoriteId, favoriteButton.dataset.phraseContext);
      return;
    }

    const viewButton = event.target.closest("[data-phrase-view-id]");
    if (viewButton) {
      openPhraseView(viewButton.dataset.phraseViewId, viewButton);
      return;
    }

    const actionButton = event.target.closest("[data-phrase-action]");
    if (actionButton && !actionButton.disabled) {
      openPhraseConfirmation(actionButton.dataset.phraseAction, actionButton);
    }
  });
  elements.phraseViewCloseButton.addEventListener("click", closePhraseView);
  elements.phraseViewDoneButton.addEventListener("click", closePhraseView);
  elements.phraseViewDialog.addEventListener("close", () => {
    if (phraseViewReturnFocus && phraseViewReturnFocus.isConnected) phraseViewReturnFocus.focus();
    phraseViewReturnFocus = null;
  });
  elements.phraseConfirmCancelButton.addEventListener("click", () => elements.phraseConfirmDialog.close());
  elements.phraseConfirmActionButton.addEventListener("click", confirmPhraseAction);
  elements.phraseConfirmDialog.addEventListener("close", () => {
    pendingPhraseAction = null;
    if (phraseConfirmReturnFocus && phraseConfirmReturnFocus.isConnected) phraseConfirmReturnFocus.focus();
    phraseConfirmReturnFocus = null;
  });
  elements.rateOnboarding.hidden = !shouldShowRateOnboarding;
  elements.rateInput.value = rate.toFixed(2);
  renderPhraseCategories();
  renderConversionDirection();
  updateShoppingRateSummary();
  setActiveTab("conversion");
  setShoppingStep("cart");
  renderBanknoteGuide();
  renderDenominationReference();
  renderCart();
  updateConversion();
  updateActualExchangeRate();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js?v=29").catch(() => {
        // The calculator remains fully usable if a local server does not support PWA registration.
      });
    });
  }
})();

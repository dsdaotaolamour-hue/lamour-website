// Lamour Vietnam Unified SPA Controller
(function () {
  const site = window.LAMOUR_SITE || {};
  const books = window.LAMOUR_BOOKS || [];
  const products = window.LAMOUR_PRODUCTS || [];
  const protocols = window.LAMOUR_PROTOCOLS || [];
  const newsList = window.LAMOUR_NEWS || [];

  const VALID_TABS = ['cong-ty', 'san-pham', 'thu-vien', 'kho-sach', 'isov-standard', 'kho-du-lieu', 'tin-tuc'];
  let activeTab = 'thu-vien';

  window.getZaloQrUrl = function (size = 140) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=6&color=064b26&data=${encodeURIComponent(site.zaloUrl || 'https://zalo.me/0868858975')}`;
  };

  window.showToast = function (message, type = 'success') {
    let el = document.getElementById('lamour-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'lamour-toast';
      el.className = 'toast-banner';
      document.body.appendChild(el);
    }
    const bg = type === 'error' ? 'bg-red-700' : 'bg-[#0a6836]';
    el.innerHTML = `
      <div class="${bg} text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 text-sm font-semibold">
        <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">✓</span>
        <span>${message}</span>
      </div>
    `;
    el.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  };

  window.copyTextSafe = async function (text, successMsg = 'Đã sao chép nội dung vào bộ nhớ tạm!') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      window.showToast(successMsg);
      return true;
    } catch {
      window.showToast('Không thể tự động sao chép, vui lòng chọn văn bản và bấm Ctrl+C.', 'error');
      return false;
    }
  };

  function bookStackLogoSvg(whiteMode = false) {
    if (whiteMode) {
      return `
        <svg class="w-10 h-10 shrink-0" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="8" width="32" height="8" rx="2.5" fill="#FFFFFF"/>
          <rect x="10" y="19" width="32" height="8" rx="2.5" fill="#FFFFFF" fill-opacity="0.9"/>
          <rect x="6" y="30" width="32" height="8" rx="2.5" fill="#FFFFFF" fill-opacity="0.82"/>
        </svg>`;
    }
    return `
      <svg class="w-9 h-9 shrink-0" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="30" height="8" rx="2.5" fill="#0A6836"/>
        <rect x="10" y="19" width="31" height="8" rx="2.5" fill="#F59E0B"/>
        <rect x="6" y="30" width="30" height="8" rx="2.5" fill="#1E293B"/>
      </svg>`;
  }

  function renderHeaderLogo(tab) {
    if (tab === 'isov-standard') {
      const isovSrc = site.isovLogoUrl || 'assets/company/logo-isov.png';
      return `
        <img src="${isovSrc}" alt="ISOV Standard"
          onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden')"
          class="h-10 w-auto object-contain" />
        <div class="hidden flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg">
            <div class="w-full h-full bg-[#1c0205] rounded-[11px] flex items-center justify-center text-amber-300 font-black text-xs">
              ISOV
            </div>
          </div>
          <div class="leading-tight">
            <span class="text-[9px] uppercase tracking-[0.22em] text-amber-300 font-bold block">Công ty TNHH TM DV Lamour</span>
            <span class="text-sm sm:text-base font-black tracking-wide text-white">ISOV <span class="text-amber-300">STANDARD</span></span>
          </div>
        </div>`;
    }

    if (tab === 'kho-du-lieu') {
      const driveSrc = site.driveLogoUrl || 'assets/company/logo-drive.png';
      return `
        <img src="${driveSrc}" alt="Kho dữ liệu Drive L'amour"
          onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden')"
          class="h-10 w-auto object-contain" />
        <div class="hidden flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-sm">DRIVE</div>
          <div class="leading-tight">
            <div class="text-xs font-black tracking-tight text-slate-900 uppercase">LAMOUR CLOUD</div>
            <div class="text-[10px] font-bold text-[#0a6836] uppercase tracking-wider">Kho Dữ Liệu</div>
          </div>
        </div>`;
    }

    if (tab === 'thu-vien' || tab === 'kho-sach') {
      return `
        ${bookStackLogoSvg(false)}
        <div class="leading-tight">
          <div class="text-[11px] font-extrabold tracking-tight text-slate-900 uppercase">THƯ VIỆN SÁCH<sup class="text-[9px] ml-0.5 text-amber-500">®</sup></div>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-extrabold text-[#0a6836] uppercase">NGÀNH SPA</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#0a6836]">Online</span>
          </div>
        </div>`;
    }

    const companySrc = site.companyLogoUrl || 'assets/company/logo-lamour-đen.png';
    return `
      <img src="${companySrc}" alt="Công ty TNHH TM DV Lamour"
        onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden')"
        class="h-10 w-auto object-contain" />
      <div class="hidden flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-[#0a6836] text-white flex items-center justify-center font-black text-sm shadow-sm">L</div>
        <div class="leading-tight">
          <div class="text-xs font-black tracking-tight text-slate-900 uppercase">Công ty TNHH TM DV Lamour</div>
          <div class="text-[10px] font-bold text-[#0a6836] uppercase tracking-wider">Spa Ecosystem</div>
        </div>
      </div>`;
  }

  function updateNavbarUI(tab) {
    const header = document.getElementById('main-header');
    const logoHost = document.getElementById('header-logo-host');
    const isDark = tab === 'isov-standard';

    if (header) {
      header.classList.toggle('is-dark', isDark);
    }
    if (logoHost) {
      logoHost.innerHTML = renderHeaderLogo(tab);
    }

    document.querySelectorAll('[data-tab-btn]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tabBtn === tab);
    });
  }

  function triggerReveals(panel) {
    if (!panel) return;
    panel.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('active');
      requestAnimationFrame(() => {
        setTimeout(() => el.classList.add('active'), 40);
      });
    });
  }

  window.switchTab = function (tabId, scrollToId = null) {
    if (!VALID_TABS.includes(tabId)) tabId = 'thu-vien';
    activeTab = tabId;

    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.remove('is-active');
    });
    const targetPanel = document.getElementById(`tab-${tabId}`);
    if (targetPanel) {
      targetPanel.classList.add('is-active');
      triggerReveals(targetPanel);
      if (tabId === 'cong-ty' && typeof animateCompanyCounters === 'function') {
        animateCompanyCounters();
      }
    }

    updateNavbarUI(tabId);
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileDrawer) mobileDrawer.classList.add('hidden');

    if (window.location.hash !== `#${tabId}`) {
      history.replaceState(null, '', `#${tabId}`);
    }

    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (tabId === 'kho-du-lieu') animateDriveCounters();
  };

  // Toggle Heading (Accordion) for Nội quy in Thư viện sách
  window.toggleRuleHeading = function (btnEl) {
    const item = btnEl.closest('.toggle-item');
    if (!item) return;
    item.classList.toggle('is-open');
  };

  window.openLibraryRules = function () {
    window.switchTab('thu-vien', 'noi-quy-section');
    setTimeout(() => {
      const firstToggle = document.querySelector('#noi-quy-section .toggle-item');
      if (firstToggle && !firstToggle.classList.contains('is-open')) {
        firstToggle.classList.add('is-open');
      }
    }, 150);
  };

  // ==================== 1. TAB SẢN PHẨM & LIỆU TRÌNH ====================
  const productState = {
    subView: 'products', // 'products' | 'protocols'
    search: '',
    group: 'ALL',
    priceMode: 'beforeVat',
    page: 1,
    perPage: 16,
    selected: null,
    discountUnlocked: sessionStorage.getItem('lamour_ck_unlocked') === '1'
  };

  function syncDiscountUI() {
    const unlocked = productState.discountUnlocked;
    document.querySelectorAll('.discount-only-btn').forEach((el) => {
      el.classList.toggle('hidden', !unlocked);
    });
    const lockBtn = document.getElementById('discount-lock-btn');
    if (lockBtn) {
      lockBtn.textContent = unlocked ? 'Ẩn Chiết khấu' : 'Chiết khấu';
    }
    const modalLockBtn = document.getElementById('modal-discount-lock-btn');
    if (modalLockBtn) {
      modalLockBtn.textContent = unlocked ? 'Ẩn Chiết khấu' : 'Chiết khấu';
    }
    if (!unlocked && (productState.priceMode === 'ck35' || productState.priceMode === 'ck40')) {
      productState.priceMode = 'beforeVat';
    }
  }

  window.toggleDiscountLock = function () {
    if (productState.discountUnlocked) {
      productState.discountUnlocked = false;
      sessionStorage.removeItem('lamour_ck_unlocked');
      if (productState.priceMode === 'ck35' || productState.priceMode === 'ck40') {
        productState.priceMode = 'beforeVat';
      }
      syncDiscountUI();
      if (productState.selected) updateProductModalPrice(productState.selected, productState.priceMode);
      if (productState.subView === 'products') renderProducts(); else renderProtocols();
      window.showToast('Đã khóa chế độ xem Chiết khấu.');
      return;
    }
    const passModal = document.getElementById('discount-pass-modal');
    const passInput = document.getElementById('discount-pass-input');
    const passErr = document.getElementById('discount-pass-error');
    if (passErr) passErr.classList.add('hidden');
    if (passInput) passInput.value = '';
    if (passModal) {
      passModal.classList.remove('hidden');
      setTimeout(() => passInput && passInput.focus(), 60);
    }
  };

  window.closeDiscountPassModal = function () {
    const passModal = document.getElementById('discount-pass-modal');
    if (passModal) passModal.classList.add('hidden');
  };

  window.submitDiscountPassword = function () {
    const passInput = document.getElementById('discount-pass-input');
    const passErr = document.getElementById('discount-pass-error');
    const expected = String(site.discountPass || 'Daotao123').trim();
    const entered = passInput ? passInput.value.trim() : '';
    if (entered === expected) {
      productState.discountUnlocked = true;
      sessionStorage.setItem('lamour_ck_unlocked', '1');
      syncDiscountUI();
      window.closeDiscountPassModal();
      if (productState.subView === 'products') renderProducts(); else renderProtocols();
      window.showToast('Đã mở khóa bảng giá Chiết khấu!');
    } else {
      if (passErr) passErr.classList.remove('hidden');
    }
  };

  function populateCategoryFilterForView() {
    const catSelect = document.getElementById('product-category-select');
    if (!catSelect) return;
    catSelect.innerHTML = '';
    const allOpt = document.createElement('option');
    allOpt.value = 'ALL';
    if (productState.subView === 'protocols') {
      const cats = [...new Set(protocols.map((p) => p.category).filter(Boolean))];
      allOpt.textContent = `Tất cả liệu trình (${cats.length})`;
      catSelect.appendChild(allOpt);
      cats.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      });
    } else {
      const groups = [...new Set(products.map((p) => p.group).filter(Boolean))];
      allOpt.textContent = `Tất cả nhóm (${groups.length})`;
      catSelect.appendChild(allOpt);
      groups.forEach((g) => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        catSelect.appendChild(opt);
      });
    }
    productState.group = 'ALL';
    catSelect.value = 'ALL';
  }

  window.switchProductSubView = function (view) {
    productState.subView = view === 'protocols' ? 'protocols' : 'products';
    productState.page = 1;
    const pWrap = document.getElementById('products-list-wrap');
    const prWrap = document.getElementById('protocols-list-wrap');
    const protoBtn = document.getElementById('product-view-protocols-btn');
    if (pWrap) pWrap.classList.toggle('hidden', productState.subView === 'protocols');
    if (prWrap) prWrap.classList.toggle('hidden', productState.subView !== 'protocols');
    if (protoBtn) protoBtn.classList.toggle('is-active', productState.subView === 'protocols');

    if (productState.subView === 'protocols') {
      document.querySelectorAll('[data-price-mode]').forEach((b) => b.classList.remove('is-active'));
    } else {
      document.querySelectorAll('[data-price-mode]').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.priceMode === productState.priceMode);
      });
    }

    populateCategoryFilterForView();
    if (productState.subView === 'protocols') {
      renderProtocols();
    } else {
      renderProducts();
    }
  };

  function formatVnd(val) {
    if (typeof val === 'number' && !Number.isNaN(val)) {
      return val.toLocaleString('vi-VN') + ' đ';
    }
    return val ? String(val) : 'Liên hệ';
  }

  function getPriceInfo(p, mode) {
    if (mode === 'afterVat') {
      return {
        label: 'Giá bán (Sau VAT)',
        value: formatVnd(p.priceAfterVat),
        note: `Giá trước VAT: ${formatVnd(p.priceBeforeVat)}`
      };
    }
    if (mode === 'ck35') {
      return {
        label: 'Giá Chiết Khấu 35%',
        value: formatVnd(p.priceCk35),
        note: `Giá sau VAT: ${formatVnd(p.priceAfterVat)}`
      };
    }
    if (mode === 'ck40') {
      return {
        label: 'Giá Chiết Khấu 40%',
        value: formatVnd(p.priceCk40),
        note: `Giá sau VAT: ${formatVnd(p.priceAfterVat)}`
      };
    }
    return {
      label: 'Giá bán lẻ (Trước VAT)',
      value: formatVnd(p.priceBeforeVat),
      note: 'Chưa bao gồm VAT'
    };
  }

  window.handleProductImgError = function (img) {
    const base = img.dataset.base || '';
    const step = parseInt(img.dataset.step || '0', 10);
    const exts = ['png', 'webp'];
    if (step < exts.length && base) {
      img.dataset.step = String(step + 1);
      img.src = `assets/products/${encodeURIComponent(base)}.${exts[step]}`;
      return;
    }
    img.style.display = 'none';
    const fb = img.nextElementSibling;
    if (fb) fb.classList.remove('hidden');
  };

  function buildProductMediaMarkup(p, isModal = false) {
    const base = p.imageName || p.name;
    const firstSrc = `assets/products/${encodeURIComponent(base)}.jpg`;
    const volText = p.volume ? `${p.volume} ${p.unit || ''}`.trim() : (p.unit || '');
    return `
      <img src="${firstSrc}" data-base="${base}" data-step="0" alt="${p.name}"
        onerror="window.handleProductImgError(this)"
        class="w-full h-full object-cover ${isModal ? '' : 'group-hover:scale-105 transition duration-500'}" loading="lazy" />
      <div class="hidden w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-emerald-50 via-white to-slate-100">
        <span class="px-2.5 py-0.5 rounded-full bg-[#0a6836]/10 text-[#0a6836] text-[10px] font-extrabold uppercase tracking-wider mb-2">${p.group}</span>
        <div class="text-xs sm:text-sm font-black text-slate-800 leading-snug line-clamp-3">${p.name}</div>
        ${volText ? `<div class="text-[11px] font-bold text-slate-500 mt-1">${volText}</div>` : ''}
        <div class="mt-3 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-500 font-mono break-all">${base}.jpg</div>
      </div>
    `;
  }

  window.setProductPriceMode = function (mode) {
    if ((mode === 'ck35' || mode === 'ck40') && !productState.discountUnlocked) {
      window.toggleDiscountLock();
      return;
    }
    productState.priceMode = mode;
    if (productState.subView !== 'products') {
      window.switchProductSubView('products');
      return;
    }
    document.querySelectorAll('[data-price-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.priceMode === mode);
    });
    renderProducts();
  };

  window.setProductModalPriceMode = function (mode) {
    if ((mode === 'ck35' || mode === 'ck40') && !productState.discountUnlocked) {
      window.toggleDiscountLock();
      return;
    }
    productState.priceMode = mode;
    document.querySelectorAll('[data-price-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.priceMode === mode);
    });
    if (productState.selected) {
      updateProductModalPrice(productState.selected, mode);
    }
    renderProducts();
  };

  function updateProductModalPrice(p, mode) {
    const info = getPriceInfo(p, mode);
    const lbl = document.getElementById('product-modal-price-label');
    const val = document.getElementById('product-modal-price-value');
    const note = document.getElementById('product-modal-vat-note');
    if (lbl) lbl.textContent = info.label;
    if (val) val.textContent = info.value;
    if (note) note.textContent = info.note;

    document.querySelectorAll('[data-modal-price-mode]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.modalPriceMode === mode);
    });
  }

  window.openProductModal = function (id) {
    const p = products.find((item) => item.id === id || item.code === id);
    if (!p) return;
    productState.selected = p;

    const modal = document.getElementById('product-modal');
    const imgWrap = document.getElementById('product-modal-image-wrap');
    if (imgWrap) imgWrap.innerHTML = buildProductMediaMarkup(p, true);

    const imgNameEl = document.getElementById('product-modal-img-name');
    if (imgNameEl) imgNameEl.textContent = `${p.imageName || p.name}.jpg`;

    const groupBadge = document.getElementById('product-modal-group-badge');
    const volBadge = document.getElementById('product-modal-volume-badge');
    if (groupBadge) groupBadge.textContent = p.group;
    const volText = p.volume ? `${p.volume} ${p.unit || ''}`.trim() : (p.unit ? `ĐVT: ${p.unit}` : 'ISOV Korea');
    if (volBadge) volBadge.textContent = volText;

    document.getElementById('product-modal-name').textContent = p.name;
    document.getElementById('product-modal-usp').textContent = p.usp;
    document.getElementById('product-modal-skin').textContent = p.skinType || 'Đang cập nhật';
    document.getElementById('product-modal-ingredients').textContent = p.ingredients || 'Đang cập nhật';
    document.getElementById('product-modal-advantage').textContent = p.advantage || 'Đang cập nhật';
    document.getElementById('product-modal-benefit').textContent = p.benefit || 'Đang cập nhật';
    document.getElementById('product-modal-usage').textContent = p.usage || 'Đang cập nhật';

    updateProductModalPrice(p, productState.priceMode);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeProductModal = function () {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    const empty = document.getElementById('products-empty');
    const pagEl = document.getElementById('products-pagination');
    const totalBadge = document.getElementById('products-total-badge');
    if (!grid) return;

    const q = productState.search.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const mQ = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.usp || '').toLowerCase().includes(q) ||
        (p.ingredients || '').toLowerCase().includes(q) ||
        (p.skinType || '').toLowerCase().includes(q) ||
        (p.benefit || '').toLowerCase().includes(q);
      const mG = productState.group === 'ALL' || p.group === productState.group;
      return mQ && mG;
    });

    if (totalBadge) totalBadge.textContent = `${filtered.length} sản phẩm`;

    const totalPages = Math.max(1, Math.ceil(filtered.length / productState.perPage));
    if (productState.page > totalPages) productState.page = totalPages;
    const start = (productState.page - 1) * productState.perPage;
    const items = filtered.slice(start, start + productState.perPage);

    if (!items.length) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
    } else {
      if (empty) empty.classList.add('hidden');
      grid.innerHTML = items.map((p) => {
        const priceInfo = getPriceInfo(p, productState.priceMode);
        const volText = p.volume ? `${p.volume} ${p.unit || ''}`.trim() : (p.unit || '');
        return `
          <article onclick="openProductModal(${p.id})"
            class="cursor-pointer bg-white rounded-lg sm:rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between group">
            <div>
              <div class="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                ${buildProductMediaMarkup(p, false)}
                <span class="hidden sm:inline-block absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-[#0a6836] text-[10px] font-extrabold shadow-xs uppercase">${p.group}</span>
                ${volText ? `<span class="hidden sm:inline-block absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[10px] font-bold">${volText}</span>` : ''}
              </div>
              <div class="p-1.5 sm:p-4 space-y-0.5 sm:space-y-1.5">
                <h3 class="text-[9px] sm:text-base font-extrabold text-slate-900 leading-tight sm:leading-snug line-clamp-2 group-hover:text-[#0a6836] transition">${p.name}</h3>
                <p class="hidden sm:line-clamp-2 text-[11px] font-semibold text-slate-500">${p.usp}</p>
              </div>
            </div>
            <div class="px-1.5 pb-1.5 pt-1 sm:px-4 sm:pb-4 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
              <div class="min-w-0">
                <div class="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-slate-400">${priceInfo.label}</div>
                <div class="text-[9.5px] sm:text-base font-black text-[#0a6836] truncate">${priceInfo.value}</div>
              </div>
              <span class="hidden sm:flex w-8 h-8 rounded-full border border-slate-200 group-hover:bg-[#0a6836] group-hover:text-white group-hover:border-[#0a6836] items-center justify-center text-xs transition shrink-0">→</span>
            </div>
          </article>
        `;
      }).join('');
    }

    if (pagEl) {
      if (totalPages <= 1) {
        pagEl.innerHTML = '';
      } else {
        let html = `<button type="button" onclick="setProductPage(${Math.max(1, productState.page - 1)})" class="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer">‹</button>`;
        for (let i = 1; i <= totalPages; i++) {
          const active = i === productState.page ? 'bg-slate-900 text-white border-slate-900 font-bold' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100';
          html += `<button type="button" onclick="setProductPage(${i})" class="w-9 h-9 rounded-full border ${active} text-xs flex items-center justify-center cursor-pointer">${String(i).padStart(2, '0')}</button>`;
        }
        html += `<button type="button" onclick="setProductPage(${Math.min(totalPages, productState.page + 1)})" class="w-9 h-9 rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm cursor-pointer">›</button>`;
        pagEl.innerHTML = html;
      }
    }
  }

  function renderProtocols() {
    const grid = document.getElementById('protocols-grid');
    const empty = document.getElementById('protocols-empty');
    const totalBadge = document.getElementById('products-total-badge');
    if (!grid) return;

    const q = productState.search.trim().toLowerCase();
    const filtered = protocols.filter((pr) => {
      const mCat = productState.group === 'ALL' || pr.category === productState.group;
      if (!mCat) return false;
      if (!q) return true;
      const inTitle = (pr.title || '').toLowerCase().includes(q) || (pr.description || '').toLowerCase().includes(q) || (pr.category || '').toLowerCase().includes(q);
      const inSteps = (pr.steps || []).some((s) => (s.product || '').toLowerCase().includes(q) || (s.action || '').toLowerCase().includes(q));
      const inHome = (pr.homeCare || []).some((h) => (h.product || '').toLowerCase().includes(q));
      return inTitle || inSteps || inHome;
    });

    if (totalBadge) totalBadge.textContent = `${filtered.length} liệu trình`;

    if (!filtered.length) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');

    grid.innerHTML = filtered.map((pr) => {
      const matchedProducts = q
        ? [...new Set((pr.steps || []).map((s) => s.product).filter((pn) => pn && pn.toLowerCase().includes(q)))]
        : [];
      const onceVal = pr.totals && pr.totals.once ? formatVnd(Math.round(pr.totals.once)) : 'Liên hệ';
      const setVal = pr.totals && pr.totals.beforeVat ? formatVnd(pr.totals.beforeVat) : 'Liên hệ';
      return `
        <article onclick="openProtocolModal(${pr.id})"
          class="cursor-pointer bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between gap-3 group">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0a6836] text-[10px] font-extrabold uppercase">${pr.category}</span>
              <span class="text-[11px] font-bold text-slate-400">#${String(pr.id).padStart(2, '0')} • ${(pr.steps || []).length} bước</span>
            </div>
            <h3 class="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#0a6836] transition">${pr.title}</h3>
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">${pr.description || ''}</p>
            ${matchedProducts.length ? `<div class="text-[11px] font-bold text-[#0a6836] bg-emerald-50 px-2.5 py-1 rounded-lg">✓ Dùng SP: ${matchedProducts.join(', ')}</div>` : ''}
          </div>
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <div class="flex flex-wrap gap-2 text-[11px] text-slate-500">
              ${pr.duration ? `<span>⏱ ${pr.duration}</span>` : ''}
              ${pr.frequency ? `<span class="truncate">• ${pr.frequency}</span>` : ''}
            </div>
            <div class="flex items-center justify-between gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <div>
                <div class="text-[9px] font-bold uppercase text-slate-400">Giá vốn 1 lần</div>
                <div class="text-xs sm:text-sm font-black text-[#0a6836]">${onceVal}</div>
              </div>
              <div class="text-right">
                <div class="text-[9px] font-bold uppercase text-slate-400">Trọn bộ (Trước VAT)</div>
                <div class="text-xs font-extrabold text-slate-800">${setVal}</div>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  window.openProtocolModal = function (id) {
    const pr = protocols.find((item) => item.id === id);
    if (!pr) return;
    const host = document.getElementById('protocol-modal-content');
    const modal = document.getElementById('protocol-modal');
    if (!host || !modal) return;

    const totals = pr.totals || {};
    const ckCard = productState.discountUnlocked
      ? `<div class="rounded-2xl bg-amber-50 border border-amber-200 p-3.5"><div class="text-[10px] font-bold uppercase text-amber-700">Tổng bộ SP (CK 35%)</div><div class="text-base sm:text-lg font-black text-amber-900 mt-0.5">${formatVnd(Math.round(totals.ck35 || 0))}</div></div>`
      : '';

    const stepsRows = (pr.steps || []).map((s) => `
      <tr class="hover:bg-slate-50">
        <td class="p-2.5 font-mono font-bold text-[#0a6836]">${s.stt}</td>
        <td class="p-2.5 font-semibold text-slate-800">${s.action || ''}</td>
        <td class="p-2.5 font-bold text-slate-900">${s.product || '—'}</td>
        <td class="p-2.5 text-slate-600">${s.time || '—'}</td>
        <td class="p-2.5 text-slate-600">${s.useAmount ? `${s.useAmount} ml` : '—'}</td>
        <td class="p-2.5 font-bold text-[#0a6836] text-right">${s.priceOnce ? formatVnd(Math.round(s.priceOnce)) : '—'}</td>
      </tr>
    `).join('');

    const mobileStepsCards = (pr.steps || []).map((s) => `
      <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-black text-[#0a6836]">Bước ${s.stt} • ${s.action || ''}</span>
          ${s.priceOnce ? `<span class="text-[11px] font-black text-[#064b26] shrink-0">${formatVnd(Math.round(s.priceOnce))}</span>` : ''}
        </div>
        ${s.product ? `<div class="text-xs font-extrabold text-slate-900">${s.product}</div>` : ''}
        <div class="flex flex-wrap gap-2 text-[10px] text-slate-500">
          ${s.time ? `<span>⏱ ${s.time}</span>` : ''}
          ${s.useAmount ? `<span>💧 ${s.useAmount} ml</span>` : ''}
        </div>
      </div>
    `).join('');

    const homeCareCards = (pr.homeCare || []).length
      ? `<div class="space-y-2">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-[#0a6836]">Chăm sóc về nhà gợi ý</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            ${pr.homeCare.map((h) => `
              <div class="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3">
                <div class="text-[10px] font-bold uppercase text-[#0a6836]">${h.step}</div>
                <div class="text-xs font-extrabold text-slate-900 mt-0.5">${h.product}</div>
              </div>
            `).join('')}
          </div>
        </div>`
      : '';

    host.innerHTML = `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-3 py-1 rounded-full bg-[#0a6836] text-white text-[11px] font-extrabold uppercase">${pr.category}</span>
          ${pr.duration ? `<span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">⏱ ${pr.duration}</span>` : ''}
          ${pr.frequency ? `<span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">${pr.frequency}</span>` : ''}
        </div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-900">${pr.title}</h2>
        <p class="text-xs sm:text-sm text-slate-600">${pr.description || ''}</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-${productState.discountUnlocked ? '4' : '3'} gap-3">
        <div class="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5">
          <div class="text-[10px] font-bold uppercase text-[#0a6836]">Chi phí 1 lần làm</div>
          <div class="text-base sm:text-lg font-black text-[#064b26] mt-0.5">${formatVnd(Math.round(totals.once || 0))}</div>
        </div>
        <div class="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
          <div class="text-[10px] font-bold uppercase text-slate-500">Trọn bộ (Trước VAT)</div>
          <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${formatVnd(Math.round(totals.beforeVat || 0))}</div>
        </div>
        <div class="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
          <div class="text-[10px] font-bold uppercase text-slate-500">Trọn bộ (Sau VAT)</div>
          <div class="text-base sm:text-lg font-black text-slate-900 mt-0.5">${formatVnd(Math.round(totals.afterVat || 0))}</div>
        </div>
        ${ckCard}
      </div>

      <div class="space-y-2">
        <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700">Quy trình các bước thực hiện</h4>
        <div class="sm:hidden space-y-2">${mobileStepsCards}</div>
        <div class="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <tr><th class="p-2.5">Bước</th><th class="p-2.5">Thao tác</th><th class="p-2.5">Sản phẩm ISOV</th><th class="p-2.5">Thời gian</th><th class="p-2.5">1 lần dùng</th><th class="p-2.5 text-right">Giá 1 lần</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">${stepsRows}</tbody>
          </table>
        </div>
      </div>

      ${homeCareCards}
      ${pr.note ? `<div class="rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 text-xs text-amber-950"><strong>Lưu ý:</strong> ${pr.note}</div>` : ''}
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeProtocolModal = function () {
    const modal = document.getElementById('protocol-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  window.setProductPage = function (p) {
    productState.page = p;
    renderProducts();
    const tab = document.getElementById('tab-san-pham');
    if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ==================== 2. TAB THƯ VIỆN & KHO SÁCH ====================
  window.handleBookImgError = function (img) {
    const code = img.dataset.code || '';
    const step = parseInt(img.dataset.step || '0', 10);
    const exts = ['png', 'webp'];
    if (step < exts.length && code) {
      img.dataset.step = String(step + 1);
      img.src = `assets/books/${encodeURIComponent(code)}.${exts[step]}`;
      return;
    }
    img.style.display = 'none';
    const fb = img.nextElementSibling;
    if (fb) fb.classList.remove('hidden');
  };

  function buildBookCoverMarkup(b, isModal = false) {
    const firstSrc = b.coverUrl && b.coverUrl.startsWith('http')
      ? b.coverUrl
      : `assets/books/${encodeURIComponent(b.code)}.jpg`;
    return `
      <img src="${firstSrc}" data-code="${b.code}" data-step="0" alt="${b.title}"
        onerror="window.handleBookImgError(this)"
        class="w-full h-full object-cover ${isModal ? '' : 'group-hover:scale-105 transition duration-500'}" loading="lazy" />
      <div class="hidden w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-[#064b26] via-[#0a6836] to-[#0d8244] text-white text-left">
        <div class="flex items-center justify-between gap-2">
          <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold tracking-wider">${b.code}</span>
          <span class="text-[9px] uppercase tracking-widest text-emerald-200 font-bold">Lamour</span>
        </div>
        <div class="my-auto py-2">
          <div class="text-xs sm:text-sm font-black leading-snug line-clamp-4">${b.title}</div>
          <div class="text-[10px] text-emerald-100/90 mt-2 line-clamp-2 font-medium">${b.author}</div>
        </div>
        <div class="text-[9px] text-white/60 font-mono truncate">${b.code}.jpg</div>
      </div>
    `;
  }

  function renderLibraryMarquee() {
    const container = document.getElementById('home-book-marquee');
    if (!container || !books.length) return;
    const sample = books.slice(0, 14);
    const items = [...sample, ...sample];
    container.innerHTML = items.map((b) => `
      <button type="button" onclick="openBookFromAnywhere('${b.code}')"
        class="w-40 sm:w-48 shrink-0 bg-white text-slate-900 rounded-2xl p-2.5 shadow-xl hover:-translate-y-1.5 transition group text-left border-0 cursor-pointer">
        <div class="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 relative">
          ${buildBookCoverMarkup(b, false)}
        </div>
        <div class="pt-2.5 px-1">
          <div class="text-xs font-extrabold line-clamp-2 leading-snug group-hover:text-[#0a6836]">${b.title}</div>
          <div class="text-[11px] text-slate-500 mt-1 truncate">${b.author}</div>
        </div>
      </button>
    `).join('');
  }

  window.openBookFromAnywhere = function (code) {
    window.switchTab('kho-sach');
    setTimeout(() => openBookModal(code), 120);
  };

  const bookState = { search: '', category: 'ALL', language: 'ALL', page: 1, selectedBook: null };
  const PAGE_SIZE = 12;

  function starsHtml(rating = 5) {
    const full = Math.floor(rating);
    let html = '';
    for (let i = 1; i <= 5; i++) html += i <= full ? '<span>★</span>' : '<span class="text-slate-200">★</span>';
    return html;
  }

  function initBooksSection() {
    const catSel = document.getElementById('category-select');
    const langSel = document.getElementById('language-select');
    if (catSel && catSel.options.length <= 1) {
      [...new Set(books.flatMap((b) => b.category.split(';').map((s) => s.trim())).filter(Boolean))].forEach((c) => {
        const o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        catSel.appendChild(o);
      });
    }
    if (langSel && langSel.options.length <= 1) {
      [...new Set(books.map((b) => b.language).filter(Boolean))].forEach((l) => {
        const o = document.createElement('option');
        o.value = l;
        o.textContent = l;
        langSel.appendChild(o);
      });
    }
    renderBooksGrid();
  }

  function renderBooksGrid() {
    const grid = document.getElementById('books-grid');
    const emptyState = document.getElementById('empty-state');
    const countText = document.getElementById('book-count-text');
    const paginationBar = document.getElementById('pagination-bar');
    if (!grid) return;

    const q = bookState.search.trim().toLowerCase();
    const filtered = books.filter((b) => {
      const mQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
      const mC = bookState.category === 'ALL' || b.category.toLowerCase().includes(bookState.category.toLowerCase());
      const mL = bookState.language === 'ALL' || b.language === bookState.language;
      return mQ && mC && mL;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    if (bookState.page > totalPages) bookState.page = totalPages;
    const start = (bookState.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    if (countText) countText.textContent = `Hiển thị ${pageItems.length} / ${filtered.length} đầu sách`;
    if (!pageItems.length) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (paginationBar) paginationBar.innerHTML = '';
      return;
    }
    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = pageItems.map((b) => `
      <article data-book-code="${b.code}" class="book-card cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-col justify-between group">
        <div>
          <div class="book-cover-frame mb-3.5 relative">
            ${buildBookCoverMarkup(b, false)}
            <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#0a6836]/90 text-white text-[10px] font-extrabold">${b.code}</span>
          </div>
          <h3 class="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#0a6836] transition">${b.title}</h3>
          <p class="text-xs text-slate-500 mt-1 truncate">${b.author}</p>
        </div>
        <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="text-amber-400 text-xs tracking-tight">${starsHtml(b.rating)}</div>
          <div class="flex items-center gap-1.5">
            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Hỏi mượn</span>
            <span class="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-xs text-slate-600">→</span>
          </div>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-book-code]').forEach((el) => {
      el.addEventListener('click', () => openBookModal(el.dataset.bookCode));
    });

    if (paginationBar) {
      if (totalPages <= 1) { paginationBar.innerHTML = ''; return; }
      const pages = [];
      if (totalPages <= 7) {
        for (let p = 1; p <= totalPages; p++) pages.push(p);
      } else {
        pages.push(1);
        if (bookState.page > 3) pages.push('...');
        for (let p = Math.max(2, bookState.page - 1); p <= Math.min(totalPages - 1, bookState.page + 1); p++) pages.push(p);
        if (bookState.page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }
      let html = `<button data-bpage="${Math.max(1, bookState.page - 1)}" class="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#0a6836] text-xs font-bold cursor-pointer">‹</button>`;
      pages.forEach((p) => {
        if (p === '...') {
          html += `<span class="px-1.5 text-slate-400 text-xs font-bold">...</span>`;
        } else {
          html += `<button data-bpage="${p}" class="w-8 h-8 rounded-full text-xs font-extrabold transition cursor-pointer ${p === bookState.page ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-[#0a6836]'}">${String(p).padStart(2, '0')}</button>`;
        }
      });
      html += `<button data-bpage="${Math.min(totalPages, bookState.page + 1)}" class="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#0a6836] text-xs font-bold cursor-pointer">›</button>`;
      paginationBar.innerHTML = html;
      paginationBar.querySelectorAll('[data-bpage]').forEach((btn) => {
        btn.addEventListener('click', () => {
          bookState.page = Number(btn.dataset.bpage);
          renderBooksGrid();
          window.scrollTo({ top: 180, behavior: 'smooth' });
        });
      });
    }
  }

  function updateBorrowMessage() {
    const b = bookState.selectedBook;
    if (!b) return;
    const name = document.getElementById('borrow-name').value.trim() || '(Chưa nhập)';
    const phone = document.getElementById('borrow-phone').value.trim() || '(Chưa nhập)';
    const spa = document.getElementById('borrow-spa').value.trim() || '(Chưa nhập)';
    document.getElementById('borrow-message').value =
`Chào Quản trị viên Thư viện Spa, tôi muốn đăng ký mượn cuốn sách này:
- Sách: ${b.title}
- Mã sách: ${b.code}
- Họ và tên: ${name}
- SĐT: ${phone}
- Cơ sở / Spa: ${spa}
- Nhờ Admin kiểm tra tình trạng sách giúp mình nhé!`;
  }

  window.openBookModal = function (code) {
    const b = books.find((x) => x.code === code);
    if (!b) return;
    bookState.selectedBook = b;
    const coverBox = document.getElementById('modal-cover-box');
    if (coverBox) {
      coverBox.innerHTML = buildBookCoverMarkup(b, true);
    }
    document.getElementById('modal-title').textContent = b.title;
    document.getElementById('modal-author').textContent = b.author;
    document.getElementById('modal-stars').innerHTML = starsHtml(b.rating);
    document.getElementById('modal-code-badge').textContent = `Mã: ${b.code}`;
    document.getElementById('modal-desc').textContent = b.description || 'Đang cập nhật mô tả sách.';
    document.getElementById('modal-category').textContent = b.category;
    document.getElementById('modal-publisher').textContent = b.publisher;
    document.getElementById('modal-language').textContent = b.language;
    document.getElementById('open-zalo-btn').href = site.zaloUrl || 'https://zalo.me/0868858975';
    document.getElementById('modal-zalo-qr').src = window.getZaloQrUrl(120);
    updateBorrowMessage();
    document.getElementById('book-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookModal = function () {
    document.getElementById('book-modal').classList.add('hidden');
    document.body.style.overflow = '';
  };

  // ==================== 3. TAB ISOV STANDARD ====================
  const tiersData = [
    { id: 1, shortName: '1. Đại Lý', name: '1. ĐẠI LÝ ISOV', revenue: '3 TRIỆU', courseLevel: 'BASIC', training: 'Kiến thức thương hiệu ISOV và danh mục sản phẩm.', criteria: 'Có Giấy phép kinh doanh Spa. Không yêu cầu gửi Case lâm sàng.', immediate: ['1. Chứng nhận Đại lý', '2. Liệu trình ISOV', '3. Sổ tay ISOV'], event: ['Mời tham gia miễn phí Sự kiện Đại sứ ISOV'] },
    { id: 2, shortName: '2. Chuẩn ISOV', name: '2. SPA ĐẠT TIÊU CHUẨN ISOV HÀN QUỐC', revenue: '10 TRIỆU', courseLevel: 'BASIC', training: 'Kiến thức thương hiệu ISOV và danh mục sản phẩm.', criteria: '• Cơ sở vật chất: Diện tích >30m², ≥2 nhân sự, ≥2 giường Spa, ≥4 thiết bị chăm sóc da.<br>• Chuyên môn: Ứng dụng 5/17 liệu trình ISOV, có case điều trị thành công, Chủ Spa có ≥2 bằng cấp chuyên môn.', immediate: ['1. Chứng nhận ISOV Standard', '2. Tranh tráng gương logo ISOV'], event: ['Mời tham gia miễn phí Sự kiện Đại sứ ISOV'] },
    { id: 3, shortName: '3. Loyalty', name: '3. ĐẠI SỨ LOYALTY', revenue: '20 TRIỆU', courseLevel: 'EXPERT', training: 'Liệu trình Peel thảo dược Hàn Quốc Meso Peel CL4, Công nghệ HD Ethosome, Giải pháp điều trị cho da mụn, lão hóa, sắc tố, nhạy cảm, Ứng dụng ánh sáng và công nghệ T.E.G Some.', criteria: 'Hoàn thành khóa đào tạo Cos Master cấp độ EXPERT.', immediate: ['1. Áo choàng ISOV'], event: ['1. Chứng nhận Đại sứ ISOV Loyalty', '2. Băng đeo Đại sứ Loyalty', '3. Bảng tên đeo áo Đại sứ ISOV Loyalty'] },
    { id: 4, shortName: '4. Leader', name: '4. ĐẠI SỨ LEADER', revenue: '50 TRIỆU', courseLevel: 'EXPERT', training: 'Liệu trình Peel thảo dược Hàn Quốc Meso Peel CL4, Công nghệ HD Ethosome, Giải pháp điều trị cho da mụn, lão hóa, sắc tố, nhạy cảm, Ứng dụng ánh sáng và công nghệ T.E.G Some.', criteria: 'Hoàn thành khóa đào tạo Cos Master cấp độ EXPERT.', immediate: ['1. Áo thun ISOV'], event: ['1. Chứng nhận Đại sứ ISOV Leader', '2. Băng đeo Đại sứ ISOV Leader', '3. Bảng tên đeo áo Đại sứ ISOV Leader', '4. Bảng hiệu Đại sứ ISOV Leader'] },
    { id: 5, shortName: '5. Clinical', name: '5. ĐẠI SỨ CLINICAL', revenue: '100 TRIỆU', courseLevel: 'EXPERT', training: 'Liệu trình Peel thảo dược Hàn Quốc Meso Peel CL4, Công nghệ HD Ethosome, Giải pháp điều trị cho da mụn, lão hóa, sắc tố, nhạy cảm, Ứng dụng ánh sáng và công nghệ T.E.G Some.', criteria: '★ BẮT BUỘC: Có Case lâm sàng thực tế ở Spa gửi về Công ty.', immediate: ['1. Áo Blouse ISOV', '2. ½ suất thí sinh thi tay nghề tại Quảng Châu - Trung Quốc', '3. Tham gia chia sẻ Case lâm sàng tại lớp Zoom'], event: ['1. Chứng nhận Đại sứ ISOV Clinical', '2. Băng đeo Đại sứ ISOV Clinical', '3. Bảng tên đeo áo Đại sứ ISOV Clinical', '4. Bảng hiệu Đại sứ ISOV Clinical', '5. Thuyết trình Case lâm sàng tại sự kiện', '6. Được tặng 01 vé tham dự Yến tiệc Đại sứ'] },
    { id: 6, shortName: '6. Trainer', name: '6. TRAINER ISOV', revenue: '150 TRIỆU', courseLevel: 'MASTER', training: 'Kỹ thuật lăn kim MTS, Ứng dụng Mesotherapy, Kỹ thuật Massage đá thạch kinh lạc, Nghệ thuật Setup không gian Spa, Phương pháp tư vấn cá nhân hóa khách hàng, chiến lược tạo sự khác biệt cho dịch vụ VIP.', criteria: '★ BẮT BUỘC: Có Case lâm sàng thực tế ở Spa & Hoàn thành khóa MASTER.', immediate: ['1. Giáo trình đào tạo ISOV Hàn Quốc', '2. ½ suất Ban giám khảo thi tay nghề Quảng Châu - Trung Quốc', '3. Tham gia dạy sản phẩm và liệu trình của nhãn hàng ISOV'], event: ['1. Chứng nhận ISOV Trainer', '2. Bảng tên đeo áo', '3. Bảng để bàn làm việc', '4. Được tặng 01 vé tham dự Yến tiệc Đại sứ'] },
    { id: 7, shortName: '7. Spa 3 Sao', name: '7. SPA ĐẠT 3 SAO ISOV', revenue: '180 TRIỆU', courseLevel: 'MASTER', training: 'Kỹ thuật lăn kim MTS, Ứng dụng Mesotherapy, Kỹ thuật Massage đá thạch kinh lạc, Nghệ thuật Setup không gian Spa, Phương pháp tư vấn cá nhân hóa khách hàng, chiến lược tạo sự khác biệt cho dịch vụ VIP.', criteria: '• Có Case lâm sàng gửi về Công ty.<br>• Cơ sở vật chất: Diện tích 50m²–59m²; từ 3–4 nhân sự; từ 4–5 giường Spa; tối thiểu 5 thiết bị chăm sóc da.<br>• Chuyên môn: Ứng dụng 8/17 liệu trình ISOV; có case thành công; Chủ Spa có ≥2 bằng cấp chuyên môn.', immediate: ['1. Giáo trình Setup Spa 5 sao ISOV Hàn Quốc', '2. Tranh tráng gương hệ thống phân phối ISOV toàn cầu', '3. ½ suất du học thẩm mỹ Hàn Quốc'], event: ['1. Chứng nhận Spa đạt 3 sao ISOV', '2. Bảng hiệu Spa đạt 3 sao ISOV', '3. Được tặng 01 vé tham dự Yến tiệc Đại sứ'] },
    { id: 8, shortName: '8. Spa 4 Sao', name: '8. SPA ĐẠT 4 SAO ISOV', revenue: '300 TRIỆU', courseLevel: 'MASTER', training: 'Kỹ thuật lăn kim MTS, Ứng dụng Mesotherapy, Kỹ thuật Massage đá thạch kinh lạc, Nghệ thuật Setup không gian Spa, Phương pháp tư vấn cá nhân hóa khách hàng, chiến lược tạo sự khác biệt cho dịch vụ VIP.', criteria: '• Có Case lâm sàng gửi về Công ty.<br>• Cơ sở vật chất: Diện tích 60m²–79m²; từ 5–6 nhân sự; từ 6–7 giường Spa; tối thiểu 6 thiết bị chăm sóc da.<br>• Chuyên môn: Ứng dụng 10/17 liệu trình ISOV; có case thành công; Chủ Spa có ≥3 bằng cấp chuyên môn.', immediate: ['1. Tổ chức Event cho Spa', '2. Đạt 01 suất Giám khảo chuyến thi tay nghề tại Quảng Châu - Trung Quốc'], event: ['1. Chứng nhận Spa đạt 4 sao ISOV', '2. Bảng hiệu Spa đạt 4 sao ISOV', '3. Được tặng 01 vé tham dự Yến tiệc Đại sứ'] },
    { id: 9, shortName: '9. Spa 5 Sao', name: '9. SPA ĐẠT 5 SAO ISOV', revenue: '360 TRIỆU', courseLevel: 'MASTER', training: 'Kỹ thuật lăn kim MTS, Ứng dụng Mesotherapy, Kỹ thuật Massage đá thạch kinh lạc, Nghệ thuật Setup không gian Spa, Phương pháp tư vấn cá nhân hóa khách hàng, chiến lược tạo sự khác biệt cho dịch vụ VIP.', criteria: '• Có Case lâm sàng gửi về Công ty.<br>• Cơ sở vật chất: Diện tích >80m²; từ 7 nhân sự trở lên; từ 8 giường Spa trở lên; tối thiểu 7 thiết bị chăm sóc da.<br>• Chuyên môn: Ứng dụng 10/17 liệu trình ISOV; có case thành công; Chủ Spa có ≥3 bằng cấp chuyên môn.', immediate: ['1. Tặng 100 áo mưa thiết kế logo Spa', '2. Đạt 01 suất du học thẩm mỹ tại Hàn Quốc', '3. Lễ trao chứng nhận Spa 5 sao tại cơ sở'], event: ['1. Chứng nhận Spa đạt 5 sao ISOV', '2. Bảng hiệu Spa đạt 5 sao ISOV', '3. CEO được mời trao chứng nhận Đại sứ ISOV Leader và Loyalty', '4. Được tặng 01 vé tham dự Yến tiệc Đại sứ'] }
  ];

  let currentFormMode = 'join';

  window.selectTier = function (index) {
    const slider = document.getElementById('tier-slider');
    const container = document.getElementById('tier-buttons');
    if (slider) slider.value = index;
    if (container) {
      container.innerHTML = tiersData.map((t, idx) => `
        <button type="button" onclick="selectTier(${idx})" class="px-2 py-2.5 rounded-xl text-xs font-extrabold transition border ${
          idx === index
            ? 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#1c0205] border-amber-200 shadow-lg scale-105'
            : 'bg-[#1c0205]/70 text-white/75 border-amber-400/20 hover:border-amber-300/60 hover:text-white'
        }">
          <div class="truncate">${t.shortName}</div>
          <div class="text-[10px] opacity-80">${t.revenue}</div>
        </button>
      `).join('');
    }
    const item = tiersData[index];
    document.getElementById('slider-current-label').textContent = `${item.name} (${item.revenue})`;
    document.getElementById('sim-badge').textContent = `CẤP BẬC 0${item.id}`;
    document.getElementById('sim-course-badge').textContent = `COS MASTER: ${item.courseLevel}`;
    document.getElementById('sim-title').textContent = item.name;
    document.getElementById('sim-revenue').textContent = item.revenue;
    document.getElementById('sim-training').innerHTML = item.training;
    document.getElementById('sim-criteria').innerHTML = item.criteria;
    document.getElementById('sim-immediate-benefits').innerHTML = item.immediate.map((b) => `<li class="flex items-start gap-2.5 bg-[#1c0205]/60 p-3 rounded-xl border border-amber-400/15"><span class="text-amber-300 font-bold">✦</span><span>${b}</span></li>`).join('');
    document.getElementById('sim-event-benefits').innerHTML = item.event.map((b) => `<li class="flex items-start gap-2.5 bg-[#1c0205]/60 p-3 rounded-xl border border-amber-300/25"><span class="text-amber-300 font-bold">★</span><span>${b}</span></li>`).join('');
  };

  window.renderAllCards = function (filter = 'ALL') {
    const grid = document.getElementById('all-tiers-grid');
    if (!grid) return;
    const filtered = filter === 'ALL' ? tiersData : tiersData.filter((t) => t.courseLevel === filter);
    grid.innerHTML = filtered.map((t) => `
      <div class="ruby-card rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-4">
            <span class="px-3 py-1 rounded-md text-xs font-extrabold bg-amber-400/20 text-amber-300 border border-amber-300/30">${t.revenue}</span>
            <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#1c0205] text-white/80 border border-white/10">Cos Master: ${t.courseLevel}</span>
          </div>
          <h3 class="text-lg font-black text-white mb-3">${t.name}</h3>
          <p class="text-xs text-white/75 mb-4 leading-relaxed">${t.criteria}</p>
          <div class="space-y-3 border-t border-amber-400/15 pt-4 text-xs">
            <div>
              <div class="font-extrabold text-amber-300 uppercase mb-1">Quyền lợi nhận ngay (Mùng 10):</div>
              <ul class="space-y-1 text-white/85">${t.immediate.map((i) => `<li>• ${i}</li>`).join('')}</ul>
            </div>
            <div>
              <div class="font-extrabold text-amber-300 uppercase mb-1">Quyền lợi tại Sự kiện (2027):</div>
              <ul class="space-y-1 text-white/85">${t.event.map((e) => `<li>★ ${e}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
        <button type="button" onclick="document.getElementById('isov-dang-ky').scrollIntoView({behavior:'smooth'}); switchFormTab('review');"
          class="mt-6 w-full py-2.5 rounded-xl border border-amber-400/30 hover:bg-amber-400 hover:text-[#1c0205] text-amber-300 text-xs font-extrabold uppercase tracking-wider transition">
          Chọn xét duyệt cấp bậc này
        </button>
      </div>
    `).join('');
  };

  window.filterCards = function (level, btnEl) {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('bg-amber-400', 'text-[#1c0205]');
      btn.classList.add('bg-[#35050a]', 'text-amber-200');
    });
    btnEl.classList.remove('bg-[#35050a]', 'text-amber-200');
    btnEl.classList.add('bg-amber-400', 'text-[#1c0205]');
    window.renderAllCards(level);
  };

  window.switchFormTab = function (mode) {
    currentFormMode = mode;
    const btnJoin = document.getElementById('tab-btn-join');
    const btnReview = document.getElementById('tab-btn-review');
    const panelJoin = document.getElementById('form-panel-join');
    const panelReview = document.getElementById('form-panel-review');
    const badge = document.getElementById('preview-mode-badge');
    if (mode === 'join') {
      panelJoin.classList.remove('hidden');
      panelReview.classList.add('hidden');
      badge.textContent = 'Mẫu 1: Đăng ký tham gia';
      btnJoin.className = 'px-6 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 bg-gradient-to-r from-amber-300 to-amber-500 text-[#1c0205] shadow-lg transition';
      btnReview.className = 'px-6 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 bg-[#35050a]/80 border border-amber-400/35 text-amber-200 hover:border-amber-300 transition';
    } else {
      panelJoin.classList.add('hidden');
      panelReview.classList.remove('hidden');
      badge.textContent = 'Mẫu 2: Đăng ký xét duyệt';
      btnReview.className = 'px-6 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 bg-gradient-to-r from-amber-300 to-amber-500 text-[#1c0205] shadow-lg transition';
      btnJoin.className = 'px-6 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 bg-[#35050a]/80 border border-amber-400/35 text-amber-200 hover:border-amber-300 transition';
    }
    window.updateGeneratedText();
  };

  window.updateGeneratedText = function () {
    const textarea = document.getElementById('generated-message');
    const checklist = document.getElementById('checklist-items');
    if (!textarea) return;
    if (currentFormMode === 'join') {
      const spa = document.getElementById('join-spa-name').value || '[Chưa nhập tên Spa]';
      const owner = document.getElementById('join-owner').value || '[Chưa nhập tên Chủ Spa]';
      const phone = document.getElementById('join-phone').value || '[Chưa nhập SĐT]';
      const sale = document.getElementById('join-sale').value || '[Sale phụ trách]';
      const addr = document.getElementById('join-address').value || '[Chưa nhập địa chỉ]';
      const target = document.getElementById('join-target').value;
      textarea.value = `[ĐĂNG KÝ THAM GIA DỰ ÁN CHUẨN HÓA SPA & ĐẠI SỨ ISOV HÀN QUỐC]\n-----------------------------------------\n• Tên Spa: ${spa}\n• Chủ Spa / Đại diện: ${owner}\n• Số điện thoại Zalo: ${phone}\n• Địa chỉ Spa: ${addr}\n• Cấp bậc mục tiêu: ${target}\n• Sale phụ trách: ${sale}\n-----------------------------------------\n📎 Hồ sơ đính kèm: Hình chụp Giấy phép kinh doanh Spa.\nNhờ Sale cập nhật hồ sơ đăng ký tham gia chương trình giúp Spa nhé!`;
      checklist.innerHTML = `<div>✅ 01 Hình chụp rõ nét <strong>Giấy phép kinh doanh Spa</strong>.</div><div>✅ Gửi trực tiếp đoạn tin nhắn đã Copy kèm hình qua Zalo của Sale phụ trách.</div>`;
    } else {
      const spa = document.getElementById('rev-spa-name').value || '[Chưa nhập tên Spa]';
      const owner = document.getElementById('rev-owner').value || '[Chưa nhập tên & SĐT]';
      const tier = document.getElementById('rev-tier').value;
      const area = document.getElementById('rev-area').value || '[Chưa nhập]';
      const staff = document.getElementById('rev-staff').value || '[Chưa nhập]';
      const beds = document.getElementById('rev-beds').value || '[Chưa nhập]';
      const machines = document.getElementById('rev-machines').value || '[Chưa nhập]';
      const certs = document.getElementById('rev-certs').value || '[Chưa nhập]';
      const products = document.getElementById('rev-products').value || '[Chưa nhập]';
      const protocols = document.getElementById('rev-protocols').value || '[Chưa nhập]';
      const note = document.getElementById('rev-note').value || 'Không có';
      textarea.value = `[ĐĂNG KÝ XÉT DUYỆT HẠNG MỨC SPA & ĐẠI SỨ ISOV HÀN QUỐC]\n-----------------------------------------\n• Tên Spa: ${spa}\n• Chủ Spa & Liên hệ: ${owner}\n• Đề nghị xét duyệt cấp bậc: ${tier}\n\n[THÔNG SỐ CƠ SỞ VẬT CHẤT & CHUYÊN MÔN]\n1. Kích thước / Diện tích Spa: ${area}\n2. Số lượng nhân sự: ${staff}\n3. Số lượng giường Spa: ${beds}\n4. Máy móc công nghệ: ${machines}\n5. Sản phẩm ISOV đang ứng dụng: ${products}\n6. Liệu trình ISOV đang có: ${protocols}\n7. Bằng cấp chuyên môn của Chủ Spa: ${certs}\n8. Ghi chú thêm: ${note}\n-----------------------------------------\n📌 Phần Doanh số (01/07/2026 - 30/06/2027), lịch sử khóa đào tạo Cos Master và Case lâm sàng (nếu đăng ký từ mức Đại sứ Clinical trở lên) nhờ Sale và Phòng Đào Tạo công ty tra cứu & xét duyệt giúp Spa!`;
      checklist.innerHTML = `<div>✅ Hình ảnh thực tế không gian Spa, phòng điều trị, giường &amp; máy móc công nghệ.</div><div>✅ Hình chụp các bằng cấp / chứng chỉ chuyên môn của Chủ Spa.</div><div>✅ Hình ảnh Case lâm sàng thực tế tại Spa (Bắt buộc nếu đăng ký từ mức <strong>Đại sứ Clinical 100 Triệu</strong> trở lên).</div>`;
    }
  };

  window.copyGeneratedText = function () {
    const textarea = document.getElementById('generated-message');
    window.copyTextSafe(textarea.value, 'Đã copy! Hãy mở Zalo Sale và dán gửi kèm hình ảnh.');
    document.getElementById('copy-toast').classList.remove('hidden');
    const btnText = document.getElementById('copy-btn-text');
    btnText.textContent = 'ĐÃ COPY! HÃY DÁN GỬI ZALO CHO SALE';
    setTimeout(() => { btnText.textContent = 'Copy Nội Dung Gửi Cho Sale'; }, 3500);
  };

  // ==================== 4. TAB KHO DỮ LIỆU ====================
  const folderData = {
    'san-pham': {
      title: '01. Kiến thức Sản phẩm công ty',
      subtitle: 'Thương hiệu ISOV & Dược mỹ phẩm Hàn Quốc',
      color: '#1A73E8',
      desc: 'Tổng hợp đầy đủ Catalogue, bảng phân tích hoạt chất (PDRN, Exosome, Astaxanthin, Azulene...), hướng dẫn phối hợp sản phẩm tại Spa và Homecare.',
      driveUrl: 'https://drive.google.com',
      files: [
        { name: 'Cẩm nang hoạt chất & Sản phẩm ISOV 2026.pdf', type: 'PDF • 18.4 MB' },
        { name: 'Slide đào tạo Derma Matrix EXO-PN Skin Booster.pptx', type: 'SLIDE • 42.1 MB' },
        { name: 'Bảng tra cứu pH & Độ tương thích hoạt chất.xlsx', type: 'SHEET • 1.2 MB' }
      ]
    },
    'lieu-trinh': {
      title: '02. Kiến thức Liệu trình cho Spa',
      subtitle: 'Quy trình chuẩn hóa từ cơ bản đến chuyên sâu',
      color: '#065F46',
      desc: 'Phác đồ điều trị nám đa tầng cá nhân hóa, trẻ hóa Mesotherapy, phục hồi da nhiễm Corticoid và quy trình chăm sóc chuẩn y khoa từng bước.',
      driveUrl: 'https://drive.google.com',
      files: [
        { name: 'Phác đồ Điều trị Nám đa tầng cá nhân hóa ISOV.pdf', type: 'PDF • 24.0 MB' },
        { name: 'Quy trình 12 bước Mesotherapy vô khuẩn tại Spa.pdf', type: 'PDF • 9.8 MB' },
        { name: 'Thư viện hình ảnh Before - After ca lâm sàng.folder', type: 'FOLDER • 120 ảnh' }
      ]
    },
    'khoa-hoc': {
      title: '03. Khóa học Chuyên môn Da liễu',
      subtitle: 'Nền tảng giải phẫu da & Bệnh lý học thẩm mỹ',
      color: '#D99B00',
      desc: 'Hệ thống bài giảng đào tạo nội bộ giúp chủ Spa và kỹ thuật viên nắm vững cấu trúc hàng rào bảo vệ da, phân loại Fitzpatrick và xử lý biến chứng.',
      driveUrl: 'https://drive.google.com',
      files: [
        { name: 'Giáo trình Da liễu Thẩm mỹ ứng dụng (Bản dịch chuẩn).pdf', type: 'PDF • 35.6 MB' },
        { name: 'Bộ câu hỏi trắc nghiệm đánh giá năng lực KTV.docx', type: 'DOC • 3.4 MB' },
        { name: 'Video phân tích soi da & Chẩn đoán lâm sàng.mp4', type: 'VIDEO • HD' }
      ]
    },
    'doanh-thu': {
      title: '04. Mô hình tạo doanh thu 100 triệu / tháng',
      subtitle: 'Giải pháp vận hành, Marketing & Chốt sale thực chiến',
      color: '#EA4335',
      desc: 'Bộ công cụ đóng gói sẵn giúp chủ Spa thiết kế menu dịch vụ, kịch bản tư vấn tăng tỷ lệ chốt liệu trình và kế hoạch truyền thông thu hút khách hàng.',
      driveUrl: 'https://drive.google.com',
      files: [
        { name: 'Bản đồ lộ trình đạt mốc 100tr/tháng cho Spa vừa & nhỏ.pdf', type: 'PDF • 14.2 MB' },
        { name: 'Kịch bản tư vấn & Xử lý từ chối khách hàng nám.docx', type: 'DOC • 2.1 MB' },
        { name: 'Bộ mẫu bài viết & Media Marketing ISOV có sẵn.folder', type: 'FOLDER • 85 files' }
      ]
    }
  };

  window.openFolderModal = function (key) {
    const data = folderData[key];
    if (!data) return;
    document.getElementById('modalHeader').style.backgroundColor = data.color;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalDriveLink').href = data.driveUrl;
    document.getElementById('modalFileList').innerHTML = data.files.map((f) => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <span class="font-bold text-slate-800 truncate pr-3">${f.name}</span>
        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">${f.type}</span>
      </div>
    `).join('');
    const modal = document.getElementById('folderModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeFolderModal = function () {
    const modal = document.getElementById('folderModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  window.handleQuickSearch = function (query) {
    const box = document.getElementById('searchResultsBox');
    const q = query.trim().toLowerCase();
    if (!q) { box.classList.add('hidden'); return; }
    const matches = [];
    Object.entries(folderData).forEach(([key, folder]) => {
      if (folder.title.toLowerCase().includes(q) || folder.desc.toLowerCase().includes(q)) matches.push({ key, label: folder.title, sub: 'Thư mục chính' });
      folder.files.forEach((file) => {
        if (file.name.toLowerCase().includes(q)) matches.push({ key, label: file.name, sub: folder.title });
      });
    });
    box.classList.remove('hidden');
    box.innerHTML = matches.length === 0
      ? `<div class="text-xs text-slate-500 px-2 py-1">Chưa thấy tài liệu khớp với "${query}". Gợi ý: ISOV, Nám, Meso, Exosome, 100tr...</div>`
      : matches.slice(0, 4).map((m) => `
          <div onclick="openFolderModal('${m.key}')" class="cursor-pointer flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 transition">
            <div><p class="text-xs font-extrabold text-slate-800">${m.label}</p><p class="text-[10px] font-semibold text-[#065F46]">${m.sub}</p></div>
            <span class="text-[11px] font-bold text-[#065F46] underline">Xem</span>
          </div>`).join('');
  };

  window.updateRoiCalculator = function (val) {
    const count = parseInt(val, 10);
    document.getElementById('staffCountLabel').textContent = `${count} nhân sự`;
    document.getElementById('staffMirror').textContent = count;
    document.getElementById('savedHoursResult').textContent = `${count * 7} giờ`;
  };

  window.copyRegistrationAndNotify = function () {
    const name = document.getElementById('spaNameInput').value.trim();
    const phone = document.getElementById('spaPhoneInput').value.trim();
    const email = document.getElementById('spaEmailInput').value.trim();
    if (!name || !phone || !email) {
      window.showToast('Vui lòng điền đầy đủ Tên Spa, Số điện thoại Zalo và Gmail nhận quyền Drive nhé!', 'error');
      return;
    }
    const textToCopy = `[ĐĂNG KÝ MỞ KHÓA KHO DỮ LIỆU LAMOUR]\n- Tên Spa: ${name}\n- SĐT Zalo: ${phone}\n- Gmail cấp quyền Drive: ${email}\nNhờ bộ phận Đào tạo Lamour kích hoạt giúp mình quyền truy cập 4 kho dữ liệu nhé!`;
    window.copyTextSafe(textToCopy, 'Đã sao chép thông tin đăng ký Drive! Hãy dán gửi Zalo chuyên viên.');
    document.getElementById('copyFeedback').classList.remove('hidden');
  };

  function animateDriveCounters() {
    document.querySelectorAll('#tab-kho-du-lieu .counter').forEach((counter) => {
      if (counter.dataset.animated) return;
      counter.dataset.animated = 'true';
      const target = parseInt(counter.dataset.target, 10);
      const prefix = counter.dataset.prefix || '';
      const suffix = counter.dataset.suffix || '';
      const duration = 1200;
      const startTime = performance.now();
      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${prefix}${Math.round(target * ease)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ==================== 5. TAB TIN TỨC ====================
  function renderNewsTab() {
    const grid = document.getElementById('news-tab-grid');
    if (!grid) return;
    grid.innerHTML = newsList.map((n) => `
      <article class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition flex flex-col justify-between group">
        <div>
          <div class="aspect-[16/10] overflow-hidden bg-slate-100">
            <img src="${n.image}" alt="${n.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
          </div>
          <div class="p-6 space-y-2.5">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-[#0a6836] text-[10px] font-extrabold uppercase">${n.type}</span>
              <span class="text-[11px] text-slate-400 font-semibold">${n.date}</span>
            </div>
            <h3 class="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#0a6836] transition">${n.title}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">${n.excerpt}</p>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ==================== MODALS & PARTICLES ====================
  window.openVideoModal = function () {
    document.getElementById('video-modal').classList.remove('hidden');
    const v = document.getElementById('isov-video-player');
    if (v) v.play().catch(() => {});
  };
  window.closeVideoModal = function () {
    document.getElementById('video-modal').classList.add('hidden');
    const v = document.getElementById('isov-video-player');
    if (v) v.pause();
  };
  window.openImageModal = function (src, caption) {
    document.getElementById('image-modal-src').src = src;
    document.getElementById('image-modal-caption').textContent = caption;
    document.getElementById('image-modal').classList.remove('hidden');
  };
  window.closeImageModal = function () {
    document.getElementById('image-modal').classList.add('hidden');
  };

  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    for (let i = 0; i < 38; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.6, dx: (Math.random() - 0.5) * 0.35, dy: -Math.random() * 0.45 - 0.15, alpha: Math.random() * 0.65 + 0.2 });
    }
    function tick() {
      if (activeTab === 'isov-standard') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(253, 224, 71, ${p.alpha})`;
          ctx.fill();
          p.x += p.dx;
          p.y += p.dy;
          if (p.y < 0) p.y = canvas.height;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
        });
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  // ==================== BOOTSTRAP ====================
  document.addEventListener('DOMContentLoaded', () => {
    const qrFooter = document.getElementById('footer-zalo-qr');
    if (qrFooter) qrFooter.src = window.getZaloQrUrl(120);

    const mobBtn = document.getElementById('mobile-menu-btn');
    const mobDrawer = document.getElementById('mobile-menu-drawer');
    if (mobBtn && mobDrawer) mobBtn.addEventListener('click', () => mobDrawer.classList.toggle('hidden'));

    syncDiscountUI();
    populateCategoryFilterForView();
    renderProducts();
    const pSearch = document.getElementById('product-search-input');
    const pCat = document.getElementById('product-category-select');
    const pReset = document.getElementById('product-reset-btn');
    if (pSearch) pSearch.addEventListener('input', () => {
      productState.search = pSearch.value;
      productState.page = 1;
      if (productState.subView === 'protocols') renderProtocols(); else renderProducts();
    });
    if (pCat) pCat.addEventListener('change', () => {
      productState.group = pCat.value;
      productState.page = 1;
      if (productState.subView === 'protocols') renderProtocols(); else renderProducts();
    });
    if (pReset) pReset.addEventListener('click', () => {
      productState.search = ''; productState.group = 'ALL'; productState.page = 1;
      if (pSearch) pSearch.value = '';
      if (pCat) pCat.value = 'ALL';
      if (productState.subView === 'protocols') renderProtocols(); else renderProducts();
    });
    const pmBack = document.getElementById('product-modal-back-btn');
    const pmClose = document.getElementById('product-modal-close-btn');
    const pModal = document.getElementById('product-modal');
    if (pmBack) pmBack.addEventListener('click', window.closeProductModal);
    if (pmClose) pmClose.addEventListener('click', window.closeProductModal);
    if (pModal) pModal.addEventListener('click', (e) => { if (e.target === pModal) window.closeProductModal(); });

    renderLibraryMarquee();
    initBooksSection();

    const sIn = document.getElementById('search-input');
    const cSel = document.getElementById('category-select');
    const lSel = document.getElementById('language-select');
    const clrBtn = document.getElementById('clear-filter-btn');
    if (sIn) sIn.addEventListener('input', () => { bookState.search = sIn.value; bookState.page = 1; renderBooksGrid(); });
    if (cSel) cSel.addEventListener('change', () => { bookState.category = cSel.value; bookState.page = 1; renderBooksGrid(); });
    if (lSel) lSel.addEventListener('change', () => { bookState.language = lSel.value; bookState.page = 1; renderBooksGrid(); });
    if (clrBtn) clrBtn.addEventListener('click', () => {
      bookState.search = ''; bookState.category = 'ALL'; bookState.language = 'ALL'; bookState.page = 1;
      if (sIn) sIn.value = ''; if (cSel) cSel.value = 'ALL'; if (lSel) lSel.value = 'ALL';
      renderBooksGrid();
    });

    ['borrow-name', 'borrow-phone', 'borrow-spa'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateBorrowMessage);
    });
    const mBack = document.getElementById('modal-back-btn');
    const mClose = document.getElementById('modal-close-btn');
    const bModal = document.getElementById('book-modal');
    if (mBack) mBack.addEventListener('click', window.closeBookModal);
    if (mClose) mClose.addEventListener('click', window.closeBookModal);
    if (bModal) bModal.addEventListener('click', (e) => { if (e.target === bModal) window.closeBookModal(); });
    const copySample = document.getElementById('copy-sample-btn');
    if (copySample) copySample.addEventListener('click', () => {
      window.copyTextSafe(document.getElementById('borrow-message').value, 'Đã sao chép mẫu đăng ký! Hãy bấm Zalo đăng ký và dán tin nhắn.');
    });

    const tierSlider = document.getElementById('tier-slider');
    if (tierSlider) tierSlider.addEventListener('input', (e) => window.selectTier(parseInt(e.target.value, 10)));
    window.selectTier(0);
    window.renderAllCards('ALL');
    window.updateGeneratedText();

    renderNewsTab();
    initParticles();
    if (window.lucide) window.lucide.createIcons();

    const hashTab = window.location.hash.replace('#', '');
    window.switchTab(VALID_TABS.includes(hashTab) ? hashTab : 'cong-ty');
  });

  // ==================== ANIMATED COUNTERS & TESTIMONIAL SLIDER (CÔNG TY LAMOUR) ====================
  function animateCompanyCounters() {
    const counters = document.querySelectorAll('#tab-cong-ty .company-counter[data-count-to]');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.countTo, 10);
      if (!target || Number.isNaN(target)) return;
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      }
      requestAnimationFrame(tick);
    });
  }

  const testimonials = [
    {
      quote: 'Điều Tuyệt Vời Nhất Là Khóa Học Mang Lại Cho Tôi Tư Duy Tổng Thể Về Ngành, Thay Vì Chỉ Chạy Theo Sản Phẩm Đơn Lẻ.',
      name: 'Lâm Thị Quốc Anh',
      spa: 'Lan Anh Spa • TP.HCM',
      initials: 'QA',
      rating: 5,
      date: '15/01/2025'
    },
    {
      quote: 'Hệ thống phác đồ ISOV Korea kết hợp Kho Dữ Liệu Online giúp đội ngũ kỹ thuật viên của Spa tôi tự tin soi da và tư vấn chuẩn xác hơn hẳn.',
      name: 'Nguyễn Minh Tâm',
      spa: 'Tâm An Beauty & Clinic • Hà Nội',
      initials: 'MT',
      rating: 5,
      date: '28/02/2025'
    },
    {
      quote: 'Lộ trình Skin Coach và ISOV Standard giúp Spa chuẩn hóa quy trình 5 sao, khách hàng quay lại đều đặn và doanh thu tăng trưởng bền vững.',
      name: 'Trần Ngọc Hân',
      spa: 'Hân Nhi Aesthetic Spa • Đà Nẵng',
      initials: 'NH',
      rating: 5,
      date: '19/03/2025'
    },
    {
      quote: 'Sản phẩm phục hồi sau peel và meso của ISOV rất êm, ít kích ứng. Mình chỉ mong công ty mở thêm nhiều buổi workshop thực hành trực tiếp ở miền Tây.',
      name: 'Phạm Thùy Dương',
      spa: 'Dương Beauty Studio • Cần Thơ',
      initials: 'TD',
      rating: 4,
      date: '11/04/2025'
    },
    {
      quote: 'Từ ngày áp dụng tư duy khai vấn da của Coach Thảo, tỷ lệ chốt liệu trình dài hạn tại spa tăng gần gấp đôi mà khách vẫn cảm thấy rất thoải mái.',
      name: 'Lê Hoàng Yến',
      spa: 'Yến Nhi Skin Clinic • Bình Dương',
      initials: 'HY',
      rating: 5,
      date: '25/05/2025'
    },
    {
      quote: 'Kho tài liệu số hóa và Thư viện sách ngành Spa quá giá trị cho chủ spa mới. Mỗi tuần họp team mình đều trích một chủ đề ra đào tạo lại cho nhân sự.',
      name: 'Vũ Thị Mai Phương',
      spa: 'Phương Mai Spa • Hải Phòng',
      initials: 'MP',
      rating: 5,
      date: '14/06/2025'
    },
    {
      quote: 'Chất lượng dược mỹ phẩm đồng đều, bảng giá trước và sau VAT minh bạch. Đợt cao điểm lễ giao hàng hơi chậm nửa ngày nhưng bộ phận hỗ trợ xử lý rất nhiệt tình.',
      name: 'Đặng Kim Ngân',
      spa: 'Ngân Luxury Spa • Nha Trang',
      initials: 'KN',
      rating: 4,
      date: '09/07/2025'
    },
    {
      quote: 'Sau khi hoàn thành chứng nhận Skin Coach L’amour, khách hàng tin tưởng chuyên môn của mình hơn hẳn, không còn so bì giá với các spa đại trà.',
      name: 'Bùi Thanh Trúc',
      spa: 'Trúc Xinh Clinic • Đồng Nai',
      initials: 'TT',
      rating: 5,
      date: '22/08/2025'
    },
    {
      quote: 'Bộ liệu trình nám và phục hồi hàng rào bảo vệ da của Sorex ISOV thực sự thuyết phục. Khách da nhạy cảm dùng xong đều khen dịu nhẹ rõ rệt.',
      name: 'Hoàng Bảo Ngọc',
      spa: 'Bảo Ngọc Aesthetic • TP. Huế',
      initials: 'BN',
      rating: 5,
      date: '17/09/2025'
    },
    {
      quote: 'Hệ thống hỗ trợ chuyển giao phác đồ rất bài bản, có file quy trình chi tiết từng bước. Giá mà có thêm video quay cận thao tác cho các bạn mới học thì tuyệt vời hơn nữa.',
      name: 'Trương Mỹ Linh',
      spa: 'Mỹ Linh Skin Lab • Vũng Tàu',
      initials: 'ML',
      rating: 4,
      date: '05/10/2025'
    },
    {
      quote: 'Mình ấn tượng nhất là tinh thần đồng hành lâu dài của L’amour: không bán đứt đoạn mà luôn theo sát hiệu quả điều trị trên từng ca da thực tế.',
      name: 'Ngô Phương Thảo',
      spa: 'Thảo Mộc Spa & Clinic • Nghệ An',
      initials: 'PT',
      rating: 5,
      date: '29/11/2025'
    },
    {
      quote: 'Tham gia Gala Vinh Danh và kết nối cộng đồng Skin Coach giúp mình học hỏi được rất nhiều mô hình quản trị spa tinh gọn và hiệu quả.',
      name: 'Đoàn Thị Hồng Nhung',
      spa: 'Hồng Nhung Beauty • Đắk Lắk',
      initials: 'HN',
      rating: 5,
      date: '20/12/2025'
    },
    {
      quote: 'Đầu năm 2026 mình nâng cấp spa theo chuẩn ISOV Standard, không gian và quy trình đón tiếp khách chuyên nghiệp hơn hẳn trước đây.',
      name: 'Phan Kiều Oanh',
      spa: 'Oanh Kiều Spa • Long An',
      initials: 'KO',
      rating: 5,
      date: '18/01/2026'
    },
    {
      quote: 'Kiến thức về giải phẫu da và thành phần hoạt chất được giảng giải rất dễ hiểu, ứng dụng ngay vào buổi soi da tư vấn hằng ngày.',
      name: 'Cao Thị Thu Hà',
      spa: 'Thu Hà Skincare • Bắc Ninh',
      initials: 'TH',
      rating: 5,
      date: '14/02/2026'
    },
    {
      quote: 'Mình thích tính năng tra cứu nhanh thông tin sản phẩm và chiết khấu trên nền tảng mới, báo giá cho khách sỉ và cộng tác viên cực kỳ nhanh.',
      name: 'Tạ Minh Châu',
      spa: 'Châu Anh Beauty Center • Quảng Ninh',
      initials: 'MC',
      rating: 4,
      date: '27/03/2026'
    },
    {
      quote: 'Chuyến đi thi tay nghề làm đẹp tại Hàn Quốc cùng đoàn L’amour là cột mốc đáng nhớ nhất trong 6 năm làm nghề của mình.',
      name: 'Lý Gia Hân',
      spa: 'Gia Hân Korea Spa • TP.HCM',
      initials: 'GH',
      rating: 5,
      date: '16/04/2026'
    },
    {
      quote: 'Các dòng kem chống nắng và tế bào gốc ISOV có độ ổn định cao, dễ kết hợp với công nghệ phi kim và điện di lạnh tại spa.',
      name: 'Dương Khánh Linh',
      spa: 'Khánh Linh Clinic • Thanh Hóa',
      initials: 'KL',
      rating: 5,
      date: '23/05/2026'
    },
    {
      quote: 'Đội ngũ chuyên môn phản hồi ca da khó rất nhanh qua Zalo, giúp kỹ thuật viên của mình xử lý kịp thời cho khách hàng.',
      name: 'Hồ Ngọc Bích',
      spa: 'Ngọc Bích Spa • Lâm Đồng',
      initials: 'NB',
      rating: 4,
      date: '19/07/2026'
    },
    {
      quote: 'Từ một chủ spa làm nghề theo bản năng, sau khóa Skin Coach mình đã biết xây dựng phác đồ cá nhân hóa và hệ thống chăm sóc sau điều trị bài bản.',
      name: 'Nguyễn Thị Cẩm Tú',
      spa: 'Cẩm Tú Aesthetic • An Giang',
      initials: 'CT',
      rating: 5,
      date: '12/09/2026'
    },
    {
      quote: 'Hệ sinh thái từ đào tạo, sách chuyên ngành đến dược mỹ phẩm chuẩn Hàn của L’amour giúp spa mình phát triển ổn định suốt năm 2026.',
      name: 'Võ Hoàng Thiên Kim',
      spa: 'Thiên Kim Skin Coach • TP.HCM',
      initials: 'TK',
      rating: 5,
      date: '08/11/2026'
    }
  ];
  let testimonialPage = 0;
  const TESTIMONIAL_PER_PAGE = 4;
  const TOTAL_TESTIMONIAL_PAGES = Math.ceil(testimonials.length / TESTIMONIAL_PER_PAGE);
  let testimonialHoverPaused = false;

  const testimonialGridEl = document.getElementById('testimonial-grid');
  if (testimonialGridEl) {
    testimonialGridEl.addEventListener('mouseenter', () => { testimonialHoverPaused = true; });
    testimonialGridEl.addEventListener('mouseleave', () => { testimonialHoverPaused = false; });
  }

  function renderTestimonialGrid() {
    const gridEl = document.getElementById('testimonial-grid');
    const cntEl = document.getElementById('testimonial-counter');
    if (!gridEl) return;

    const start = testimonialPage * TESTIMONIAL_PER_PAGE;
    const slice = testimonials.slice(start, start + TESTIMONIAL_PER_PAGE);

    gridEl.innerHTML = slice.map((item) => {
      const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
      const badgeCls = item.rating === 5 ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800';
      return `
        <article class="luxury-glass-card bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between min-h-[250px]">
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="px-2.5 py-0.5 rounded-full ${badgeCls} text-[11px] font-bold tracking-wider">${stars}</span>
              <span class="text-[11px] font-semibold text-slate-400">${item.date}</span>
            </div>
            <p class="text-[13px] text-slate-700 font-medium leading-relaxed line-clamp-5">
              “${item.quote}”
            </p>
          </div>
          <div class="flex items-center gap-2.5 pt-4 mt-4 border-t border-slate-100">
            <div class="w-9 h-9 rounded-full bg-[#064b26] text-[#f5d08a] font-black flex items-center justify-center text-xs shrink-0">${item.initials}</div>
            <div class="min-w-0">
              <div class="font-extrabold text-xs text-slate-900 truncate">${item.name}</div>
              <div class="text-[11px] text-slate-500 truncate">${item.spa}</div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (cntEl) {
      const end = Math.min(start + slice.length, testimonials.length);
      cntEl.textContent = `${start + 1}–${end} / ${testimonials.length}`;
    }
  }

  window.stepTestimonial = function (dir) {
    testimonialPage = (testimonialPage + dir + TOTAL_TESTIMONIAL_PAGES) % TOTAL_TESTIMONIAL_PAGES;
    const gridEl = document.getElementById('testimonial-grid');
    if (gridEl) {
      gridEl.classList.add('is-switching');
      setTimeout(() => {
        renderTestimonialGrid();
        gridEl.classList.remove('is-switching');
      }, 220);
    } else {
      renderTestimonialGrid();
    }
  };

  renderTestimonialGrid();

  setInterval(() => {
    if (activeTab === 'cong-ty' && !testimonialHoverPaused) {
      window.stepTestimonial(1);
    }
  }, 5000);
})();

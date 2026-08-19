const PublicSite = {
  app: null,
  currentFilter: 'all',

  init() {
    this.app = document.getElementById('app');
    this.applySettings();
    this.setupNavigation();
    this.setupModal();
    this.setupWhatsApp();
    this.handleRoute();
    window.addEventListener('hashchange', () => this.handleRoute());
  },

  applySettings() {
    const settings = DB.getSettings();
    const s = DB.getSettings();
    const c = s.colors;

    const root = document.documentElement;
    root.style.setProperty('--color-primary', c.primary);
    root.style.setProperty('--color-primary-light', c.primaryLight);
    root.style.setProperty('--color-primary-dark', c.primaryDark);
    root.style.setProperty('--color-secondary', c.secondary);
    root.style.setProperty('--color-bg', c.bg);
    root.style.setProperty('--color-bg-alt', c.bgAlt);
    root.style.setProperty('--color-surface', c.surface);
    root.style.setProperty('--color-text', c.text);
    root.style.setProperty('--color-text-light', c.textLight);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--color-border', c.border);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--font-heading', s.fonts.heading);
    root.style.setProperty('--font-body', s.fonts.body);

    document.getElementById('site-logo').textContent = s.siteName;
    document.title = s.siteName + ' — ' + s.siteTagline;

    const nav = document.getElementById('site-nav');
    nav.innerHTML = s.menuItems.map(item =>
      `<a href="#/${item.page === 'home' ? '' : item.page}" class="nav-link" data-page="${item.page}">${item.label}</a>`
    ).join('');

    const footerBrand = document.getElementById('footer-brand');
    const footerTagline = document.getElementById('footer-tagline');
    if (footerBrand) footerBrand.textContent = s.siteName;
    if (footerTagline) footerTagline.textContent = s.siteTagline;

    const footerNav = document.getElementById('footer-nav');
    if (footerNav) {
      footerNav.innerHTML = s.menuItems.map(item =>
        `<a href="#/${item.page === 'home' ? '' : item.page}">${item.label}</a>`
      ).join('');
    }

    this.renderFooterContact();
    this.renderFooterSocials();
    this.setupWhatsApp();
  },

  renderFooterContact() {
    const c = DB.getContact();
    const el = document.getElementById('footer-contact');
    if (!el) return;
    let html = '';
    if (c.whatsapp) html += `<p>WhatsApp: ${c.whatsapp}</p>`;
    if (c.email) html += `<a href="mailto:${c.email}">${c.email}</a>`;
    if (c.address) html += `<p>${c.address}</p>`;
    el.innerHTML = html;
  },

  renderFooterSocials() {
    const s = DB.getSettings();
    const el = document.getElementById('footer-socials');
    if (!el) return;
    let html = '';
    if (s.social.instagram) html += `<a href="${s.social.instagram}" target="_blank" rel="noopener" class="social-link" title="Instagram">IG</a>`;
    if (s.social.facebook) html += `<a href="${s.social.facebook}" target="_blank" rel="noopener" class="social-link" title="Facebook">FB</a>`;
    if (s.social.pinterest) html += `<a href="${s.social.pinterest}" target="_blank" rel="noopener" class="social-link" title="Pinterest">PI</a>`;
    el.innerHTML = html;

    const copy = document.getElementById('footer-copy');
    if (copy) copy.innerHTML = `&copy; ${new Date().getFullYear()} ${s.siteName}. Todos os direitos reservados.`;
  },

  setupNavigation() {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('site-nav');
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    nav.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        nav.classList.remove('open');
      }
    });
  },

  setupWhatsApp() {
    const s = DB.getSettings();
    const btn = document.getElementById('whatsapp-btn');
    if (s.whatsapp.number) {
      const num = s.whatsapp.number.replace(/\D/g, '');
      const msg = encodeURIComponent(s.whatsapp.message);
      btn.href = `https://wa.me/${num}?text=${msg}`;
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  },

  handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.replace('#/', '');

    this.updateActiveNav(path);

    if (path === '' || path === '/') {
      this.renderHome();
    } else if (path === 'catalogo') {
      this.renderCatalog();
    } else if (path.startsWith('produto/')) {
      const id = path.replace('produto/', '');
      this.openProductModal(id);
    } else if (path === 'sobre') {
      this.renderAbout();
    } else if (path === 'contato') {
      this.renderContact();
    } else {
      this.renderHome();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const linkPage = link.getAttribute('data-page');
      if (linkPage === page || (page === '' && linkPage === 'home')) {
        link.classList.add('active');
      }
    });
  },

  renderHome() {
    const hp = DB.getHomepage();
    const products = DB.getProducts().filter(p => p.published);
    const settings = DB.getSettings();

    let html = '';

    // Sections in order
    const sections = hp.sections || [
      { id: 'hero', enabled: true },
      { id: 'featured', enabled: true },
      { id: 'about-preview', enabled: true },
      { id: 'contact-preview', enabled: true }
    ];

    sections.forEach(sec => {
      if (!sec.enabled) return;

      if (sec.id === 'hero' && hp.heroEnabled !== false) {
        html += this.renderHero(hp);
      } else if (sec.id === 'featured' && hp.featuredEnabled !== false) {
        html += this.renderFeaturedPreview(products);
      } else if (sec.id === 'about-preview') {
        html += this.renderAboutPreview(hp, settings);
      } else if (sec.id === 'contact-preview') {
        html += this.renderContactPreview(settings);
      }
    });

    this.app.innerHTML = html;
    this.animateElements();
  },

  renderHero(hp) {
    const bgStyle = hp.heroImage ? `background-image:url('${hp.heroImage}')` : '';
    return `
      <section class="hero">
        <div class="hero-bg" style="${bgStyle}"></div>
        <div class="hero-content fade-in">
          <p class="hero-subtitle">${hp.heroSubtitle || ''}</p>
          <h1>${hp.heroTitle || ''}</h1>
          <p>${hp.heroText || ''}</p>
          <div class="hero-btns">
            ${hp.heroBtn1Text ? `<a href="${hp.heroBtn1Link || '#/catalogo'}" class="btn btn-primary">${hp.heroBtn1Text}</a>` : ''}
            ${hp.heroBtn2Text ? `<a href="${hp.heroBtn2Link || '#/sobre'}" class="btn btn-outline">${hp.heroBtn2Text}</a>` : ''}
          </div>
        </div>
      </section>
    `;
  },

  renderFeaturedPreview(products) {
    const hp = DB.getHomepage();
    const featured = products.filter(p => p.featured).slice(0, 6);

    return `
      <section class="section-alt">
        <div class="section-inner">
          <div class="section-header fade-in">
            <h2>${hp.featuredTitle || 'Destaques'}</h2>
            <div class="section-divider"></div>
            <p>${hp.featuredText || ''}</p>
          </div>
          ${featured.length > 0 ? `
            <div class="featured-grid">
              ${featured.map(p => this.renderProductCard(p)).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <div class="empty-state-icon">&#9753;</div>
              <h3>${hp.catalogEmptyTitle || 'Catálogo em breve'}</h3>
              <p>${hp.catalogEmptyMessage || 'Nosso catálogo está sendo preparado.'}</p>
            </div>
          `}
        </div>
      </section>
    `;
  },

  renderAboutPreview(hp, settings) {
    return `
      <section class="section">
        <div class="about-grid fade-in">
          <div class="about-img">
            ${hp.aboutPreviewImage ? `<img src="${hp.aboutPreviewImage}" alt="${settings.siteName}">` : ''}
          </div>
          <div class="about-text">
            <h2>${hp.aboutPreviewTitle || 'Sobre ' + settings.siteName}</h2>
            <div class="section-divider" style="margin:16px 0"></div>
            <p>${hp.aboutPreviewText || ''}</p>
            <a href="#/sobre" class="btn btn-outline" style="margin-top:24px">${hp.aboutPreviewBtnText || 'Saiba Mais'}</a>
          </div>
        </div>
      </section>
    `;
  },

  renderContactPreview(settings) {
    const hp = DB.getHomepage();
    return `
      <section class="section-alt">
        <div class="section-inner" style="text-align:center;">
          <div class="section-header fade-in">
            <h2>${hp.contactPreviewTitle || 'Entre em Contato'}</h2>
            <div class="section-divider"></div>
            <p>${hp.contactPreviewText || ''}</p>
          </div>
          <a href="#/contato" class="btn btn-primary">${hp.contactPreviewBtnText || 'Fale Conosco'}</a>
        </div>
      </section>
    `;
  },

  renderCatalog() {
    const products = DB.getProducts().filter(p => p.published);
    const categories = DB.getCategories();
    const hp = DB.getHomepage();

    let html = `
      <div class="page-header fade-in">
        <h1>Catálogo</h1>
        <div class="section-divider"></div>
        <p>Conheça nossas criações artesanais</p>
      </div>
    `;

    if (products.length === 0) {
      html += `
        <div class="section">
          <div class="empty-state fade-in">
            <div class="empty-state-icon">&#9753;</div>
            <h3>${hp.catalogEmptyTitle || 'Catálogo em breve'}</h3>
            <p>${hp.catalogEmptyMessage || 'Nosso catálogo está sendo preparado.'}</p>
          </div>
        </div>
      `;
    } else {
      if (categories.length > 0) {
        html += `
          <div class="section" style="padding-bottom:0;">
            <div class="catalog-filters fade-in">
              <button class="filter-btn active" data-filter="all">Todos</button>
              ${categories.map(c => `<button class="filter-btn" data-filter="${c.id}">${c.name}</button>`).join('')}
            </div>
          </div>
        `;
      }

      html += `
        <div class="section">
          <div class="featured-grid" id="catalog-grid">
            ${products.map(p => this.renderProductCard(p)).join('')}
          </div>
        </div>
      `;
    }

    this.app.innerHTML = html;

    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.filterProducts();
      });
    });

    this.animateElements();
  },

  filterProducts() {
    const products = DB.getProducts().filter(p => p.published);
    const grid = document.getElementById('catalog-grid');
    if (!grid) return;

    const filtered = this.currentFilter === 'all'
      ? products
      : products.filter(p => p.categoryId === this.currentFilter);

    grid.innerHTML = filtered.length > 0
      ? filtered.map(p => this.renderProductCard(p)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">&#9753;</div><h3>Nenhum produto nesta categoria</h3></div>`;
  },

  renderProductCard(product) {
    const cat = DB.getCategories().find(c => c.id === product.categoryId);
    const price = product.price ? `R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}` : '';

    return `
      <div class="product-card" onclick="PublicSite.openProductModal('${product.id}')">
        <div class="product-card-img">
          ${product.image ? `<img src="${product.image}" alt="${product.name}">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);font-size:0.85rem;">Sem imagem</div>'}
          ${product.featured ? '<span class="product-card-badge">Destaque</span>' : ''}
        </div>
        <div class="product-card-body">
          ${cat ? `<p class="product-card-cat">${cat.name}</p>` : ''}
          <h3 class="product-card-name">${product.name}</h3>
          ${price ? `<p class="product-card-price">${price}</p>` : ''}
          <span class="product-card-btn">Ver detalhes &rarr;</span>
        </div>
      </div>
    `;
  },

  setupModal() {
    const modal = document.getElementById('product-modal');
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('modal-close');

    overlay.addEventListener('click', () => this.closeModal());
    closeBtn.addEventListener('click', () => this.closeModal());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  openProductModal(id) {
    const product = DB.getProduct(id);
    if (!product) return;

    const cat = DB.getCategories().find(c => c.id === product.categoryId);
    const s = DB.getSettings();
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');

    const allImages = [product.image, ...(product.images || [])].filter(Boolean);
    const mainImage = allImages[0] || '';

    const whatsappNum = s.whatsapp.number.replace(/\D/g, '');
    const whatsappMsg = encodeURIComponent(`Olá! Gostaria de saber mais sobre a peça "${product.name}".`);
    const whatsappLink = whatsappNum ? `https://wa.me/${whatsappNum}?text=${whatsappMsg}` : '#';

    let metaHtml = '';
    if (product.dimensions) metaHtml += `<div class="modal-meta-item"><strong>Dimensões</strong>${product.dimensions}</div>`;
    if (product.weight) metaHtml += `<div class="modal-meta-item"><strong>Peso</strong>${product.weight}</div>`;
    if (product.materials) metaHtml += `<div class="modal-meta-item"><strong>Materiais</strong>${product.materials}</div>`;
    if (product.colors) metaHtml += `<div class="modal-meta-item"><strong>Cores</strong>${product.colors}</div>`;
    if (product.additionalInfo) metaHtml += `<div class="modal-meta-item" style="grid-column:1/-1"><strong>Informações Adicionais</strong>${product.additionalInfo}</div>`;

    body.innerHTML = `
      ${mainImage ? `
        <div class="modal-gallery">
          <img id="modal-main-img" src="${mainImage}" alt="${product.name}">
        </div>
        ${allImages.length > 1 ? `
          <div class="modal-gallery-thumbs">
            ${allImages.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" onclick="PublicSite.switchModalImage('${img.replace(/'/g, "\\'")}', this)">`).join('')}
          </div>
        ` : ''}
      ` : ''}
      <div class="modal-details">
        ${cat ? `<p class="modal-cat">${cat.name}</p>` : ''}
        <h2>${product.name}</h2>
        ${product.price ? `<p class="modal-price">R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</p>` : ''}
        ${product.description ? `<div class="modal-desc">${product.description.replace(/\n/g, '<br>')}</div>` : ''}
        ${metaHtml ? `<div class="modal-meta">${metaHtml}</div>` : ''}
        ${whatsappNum ? `<a href="${whatsappLink}" target="_blank" rel="noopener" class="modal-contact-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Perguntar pelo WhatsApp
        </a>` : ''}
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  switchModalImage(src, thumb) {
    document.getElementById('modal-main-img').src = src;
    document.querySelectorAll('.modal-gallery-thumbs img').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  },

  renderAbout() {
    const about = DB.getAbout();
    const settings = DB.getSettings();

    let html = `
      <div class="page-header fade-in">
        <h1>${about.title || 'Sobre ' + settings.siteName}</h1>
        <div class="section-divider"></div>
      </div>
      <section class="section">
        <div class="about-grid fade-in">
          <div class="about-img">
            ${about.image ? `<img src="${about.image}" alt="${settings.siteName}">` : ''}
          </div>
          <div class="about-text">
            ${(about.text || '').split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('')}
            ${about.mission ? `
              <div style="margin-top:24px;padding:20px;background:var(--color-bg-alt);border-radius:var(--radius-md);">
                <h4 style="font-family:var(--font-heading);font-size:1.2rem;margin-bottom:8px;">Nossa Missão</h4>
                <p style="margin:0;">${about.mission}</p>
              </div>
            ` : ''}
            ${about.values && about.values.length > 0 ? `
              <div style="margin-top:24px;">
                <h4 style="font-family:var(--font-heading);font-size:1.2rem;margin-bottom:12px;">Nossos Valores</h4>
                <ul style="list-style:none;padding:0;">
                  ${about.values.map(v => `<li style="padding:6px 0;color:var(--color-text-light);border-bottom:1px solid var(--color-border);">${v}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    `;

    this.app.innerHTML = html;
    this.animateElements();
  },

  renderContact() {
    const contact = DB.getContact();
    const s = DB.getSettings();

    let html = `
      <div class="page-header fade-in">
        <h1>${contact.title || 'Contato'}</h1>
        <div class="section-divider"></div>
        <p>${contact.text || ''}</p>
      </div>
      <section class="section">
        <div class="contact-grid fade-in">
          <div class="contact-info">
            <h3>Informações de Contato</h3>
            ${contact.whatsapp ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/${contact.whatsapp.replace(/\D/g, '')}" target="_blank">${contact.whatsapp}</a>
                </div>
              </div>
            ` : ''}
            ${contact.email ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>E-mail</h4>
                  <a href="mailto:${contact.email}">${contact.email}</a>
                </div>
              </div>
            ` : ''}
            ${contact.instagram ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>Instagram</h4>
                  <a href="${contact.instagram}" target="_blank">${contact.instagram}</a>
                </div>
              </div>
            ` : ''}
            ${contact.facebook ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>Facebook</h4>
                  <a href="${contact.facebook}" target="_blank">${contact.facebook}</a>
                </div>
              </div>
            ` : ''}
            ${contact.address ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>Endereço</h4>
                  <p>${contact.address}</p>
                </div>
              </div>
            ` : ''}
            ${contact.hours ? `
              <div class="contact-item">
                <div class="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div class="contact-item-text">
                  <h4>Horário</h4>
                  <p>${contact.hours}</p>
                </div>
              </div>
            ` : ''}
          </div>
          <div class="contact-info" style="display:flex;align-items:center;justify-content:center;">
            <div style="text-align:center;padding:40px;">
              <div style="font-size:3rem;margin-bottom:16px;">&#9753;</div>
              <h3 style="margin-bottom:12px;">${s.siteName}</h3>
              <p style="color:var(--color-text-light);">${s.siteTagline}</p>
            </div>
          </div>
        </div>
      </section>
    `;

    this.app.innerHTML = html;
    this.animateElements();
  },

  animateElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => PublicSite.init());

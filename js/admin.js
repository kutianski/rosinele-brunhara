const Admin = {
  currentSection: 'dashboard',
  content: null,

  init() {
    this.content = document.getElementById('admin-content');
    this.setupSidebar();
    this.setupModal();
    this.setupMobile();
    this.renderSection('dashboard');
  },

  setupMobile() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('admin-sidebar');
    const closeBtn = document.getElementById('sidebar-close');

    menuBtn.addEventListener('click', () => sidebar.classList.add('open'));
    closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    sidebar.addEventListener('click', (e) => {
      if (e.target.classList.contains('sidebar-link')) {
        sidebar.classList.remove('open');
      }
    });
  },

  setupSidebar() {
    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.renderSection(section);
      });
    });
  },

  renderSection(section) {
    this.currentSection = section;

    document.querySelectorAll('.sidebar-link[data-section]').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-link[data-section="${section}"]`);
    if (activeLink) activeLink.classList.add('active');

    const titles = {
      dashboard: 'Dashboard',
      products: 'Produtos',
      categories: 'Categorias',
      homepage: 'Página Inicial',
      appearance: 'Aparência',
      texts: 'Textos do Site',
      contact: 'Contato',
      about: 'Sobre',
      settings: 'Configurações'
    };

    document.getElementById('topbar-title').textContent = titles[section] || section;

    const renderers = {
      dashboard: () => this.renderDashboard(),
      products: () => this.renderProducts(),
      categories: () => this.renderCategories(),
      homepage: () => this.renderHomepage(),
      appearance: () => this.renderAppearance(),
      texts: () => this.renderTexts(),
      contact: () => this.renderContact(),
      about: () => this.renderAbout(),
      settings: () => this.renderSettings()
    };

    if (renderers[section]) renderers[section]();
  },

  // ===== DASHBOARD =====
  renderDashboard() {
    const products = DB.getProducts();
    const categories = DB.getCategories();
    const published = products.filter(p => p.published).length;
    const featured = products.filter(p => p.featured).length;

    this.content.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total de Produtos</h3>
          <div class="stat-value">${products.length}</div>
        </div>
        <div class="stat-card">
          <h3>Publicados</h3>
          <div class="stat-value">${published}</div>
        </div>
        <div class="stat-card">
          <h3>Em Destaque</h3>
          <div class="stat-value">${featured}</div>
        </div>
        <div class="stat-card">
          <h3>Categorias</h3>
          <div class="stat-value">${categories.length}</div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="quick-action" onclick="Admin.renderSection('products');setTimeout(()=>Admin.openProductForm(),100)">
          <div class="quick-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <span>Novo Produto</span>
        </button>
        <button class="quick-action" onclick="Admin.renderSection('categories');setTimeout(()=>Admin.openCategoryForm(),100)">
          <div class="quick-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <span>Nova Categoria</span>
        </button>
        <a class="quick-action" href="index.html" target="_blank">
          <div class="quick-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <span>Ver Site</span>
        </a>
        <button class="quick-action" onclick="Admin.renderSection('appearance')">
          <div class="quick-action-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </div>
          <span>Aparência</span>
        </button>
      </div>

      ${products.length > 0 ? `
        <div class="admin-panel">
          <div class="panel-header">
            <h3>Últimos Produtos</h3>
            <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="Admin.renderSection('products')">Ver todos</button>
          </div>
          <div class="panel-body" style="padding:0;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${products.slice(-5).reverse().map(p => {
                  const cat = DB.getCategories().find(c => c.id === p.categoryId);
                  return `
                    <tr>
                      <td>${p.image ? `<img class="table-img" src="${p.image}" alt="">` : '<div class="table-img" style="display:flex;align-items:center;justify-content:center;color:var(--admin-text-muted);font-size:0.7rem;">--</div>'}</td>
                      <td><strong>${p.name}</strong></td>
                      <td>${cat ? cat.name : '--'}</td>
                      <td>${p.published ? '<span class="status-badge status-published">Publicado</span>' : '<span class="status-badge status-draft">Rascunho</span>'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="admin-panel">
          <div class="panel-body">
            <div class="admin-empty">
              <div style="font-size:2rem;">&#9753;</div>
              <h4>Bem-vindo ao painel!</h4>
              <p>Comece adicionando seus produtos e categorias.</p>
              <button class="btn-admin btn-admin-primary" onclick="Admin.renderSection('products');setTimeout(()=>Admin.openProductForm(),100)">Adicionar Primeiro Produto</button>
            </div>
          </div>
        </div>
      `}
    `;
  },

  // ===== PRODUCTS =====
  renderProducts() {
    const products = DB.getProducts();
    const categories = DB.getCategories();

    this.content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="font-size:1.1rem;font-weight:600;">Produtos (${products.length})</h2>
        <button class="btn-admin btn-admin-primary" onclick="Admin.openProductForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar Produto
        </button>
      </div>

      ${products.length === 0 ? `
        <div class="admin-panel">
          <div class="panel-body">
            <div class="admin-empty">
              <div style="font-size:2rem;">&#128230;</div>
              <h4>Nenhum produto cadastrado</h4>
              <p>Adicione seus produtos para que apareçam no site.</p>
              <button class="btn-admin btn-admin-primary" onclick="Admin.openProductForm()">Adicionar Produto</button>
            </div>
          </div>
        </div>
      ` : `
        <div class="admin-panel">
          <div class="panel-body" style="padding:0;overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => {
                  const cat = DB.getCategories().find(c => c.id === p.categoryId);
                  const price = p.price ? `R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}` : '--';
                  return `
                    <tr>
                      <td>${p.image ? `<img class="table-img" src="${p.image}" alt="">` : '<div class="table-img" style="display:flex;align-items:center;justify-content:center;color:var(--admin-text-muted);font-size:0.7rem;">--</div>'}</td>
                      <td><strong>${p.name}</strong>${p.featured ? ' <span class="status-badge status-featured">Destaque</span>' : ''}</td>
                      <td>${cat ? cat.name : '--'}</td>
                      <td>${price}</td>
                      <td>${p.published ? '<span class="status-badge status-published">Publicado</span>' : '<span class="status-badge status-draft">Rascunho</span>'}</td>
                      <td>
                        <div class="table-actions">
                          <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="Admin.openProductForm('${p.id}')" title="Editar">Editar</button>
                          <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="Admin.duplicateProduct('${p.id}')" title="Duplicar">Duplicar</button>
                          <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="Admin.confirmDelete('product','${p.id}','${p.name.replace(/'/g, "\\'")}')" title="Excluir">Excluir</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    `;
  },

  openProductForm(id) {
    const product = id ? DB.getProduct(id) : null;
    const categories = DB.getCategories();
    const isEdit = !!product;

    const title = isEdit ? 'Editar Produto' : 'Novo Produto';

    const body = `
      <form id="product-form">
        <div class="form-group">
          <label class="form-label">Nome do Produto *</label>
          <input class="form-input" name="name" value="${product ? product.name : ''}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Categoria</label>
            <select class="form-select" name="categoryId">
              <option value="">Sem categoria</option>
              ${categories.map(c => `<option value="${c.id}" ${product && product.categoryId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Preço (R$)</label>
            <input class="form-input" name="price" type="number" step="0.01" min="0" value="${product ? product.price || '' : ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descrição</label>
          <textarea class="form-textarea" name="description" rows="4">${product ? product.description || '' : ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Imagem Principal</label>
          <div class="image-upload" id="main-image-upload">
            <input type="file" accept="image/*" onchange="Admin.handleImageUpload(event, this)">
            <div class="image-upload-icon">&#128247;</div>
            <p>Clique ou arraste para adicionar uma imagem</p>
            <input type="hidden" name="image" value="${product ? product.image || '' : ''}">
          </div>
          <div id="main-image-preview">${product && product.image ? `<img class="image-preview-small" src="${product.image}" alt="">` : ''}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Galeria de Imagens</label>
          <div class="gallery-grid" id="gallery-grid">
            ${product && product.images ? product.images.map((img, i) => `
              <div class="gallery-item">
                <img src="${img}" alt="">
                <button type="button" class="gallery-item-remove" onclick="Admin.removeGalleryImage(${i})">&times;</button>
              </div>
            `).join('') : ''}
            <label class="gallery-add">
              <input type="file" accept="image/*" multiple onchange="Admin.handleGalleryUpload(event)">
              +
            </label>
          </div>
          <input type="hidden" name="images" id="gallery-images-input" value='${product && product.images ? JSON.stringify(product.images) : '[]'}'>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Dimensões</label>
            <input class="form-input" name="dimensions" value="${product ? product.dimensions || '' : ''}" placeholder="Ex: 15cm x 10cm">
          </div>
          <div class="form-group">
            <label class="form-label">Peso</label>
            <input class="form-input" name="weight" value="${product ? product.weight || '' : ''}" placeholder="Ex: 300g">
          </div>
          <div class="form-group">
            <label class="form-label">Cores</label>
            <input class="form-input" name="colors" value="${product ? product.colors || '' : ''}" placeholder="Ex: Bege, Marrom">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Materiais</label>
          <input class="form-input" name="materials" value="${product ? product.materials || '' : ''}" placeholder="Ex: Argila, Esmalte">
        </div>
        <div class="form-group">
          <label class="form-label">Informações Adicionais</label>
          <textarea class="form-textarea" name="additionalInfo" rows="2">${product ? product.additionalInfo || '' : ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-checkbox">
              <input type="checkbox" name="published" ${!product || product.published ? 'checked' : ''}>
              Publicado
            </label>
          </div>
          <div class="form-group">
            <label class="form-checkbox">
              <input type="checkbox" name="featured" ${product && product.featured ? 'checked' : ''}>
              Produto em Destaque
            </label>
          </div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn-admin btn-admin-secondary" onclick="Admin.closeModal()">Cancelar</button>
      <button class="btn-admin btn-admin-primary" onclick="Admin.saveProduct('${id || ''}')">${isEdit ? 'Salvar Alterações' : 'Criar Produto'}</button>
    `;

    this.openModal(title, body, footer);
  },

  handleImageUpload(event, input) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const container = input.closest('.image-upload');
      const hiddenInput = container ? container.querySelector('input[type="hidden"]') : null;
      if (hiddenInput) hiddenInput.value = e.target.result;
      const preview = document.getElementById('main-image-preview');
      if (preview) preview.innerHTML = `<img class="image-preview-small" src="${e.target.result}" alt="">`;
    };
    reader.readAsDataURL(file);
  },

  handleGalleryUpload(event) {
    const files = Array.from(event.target.files);
    const input = document.getElementById('gallery-images-input');
    let images = JSON.parse(input.value || '[]');

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        images.push(e.target.result);
        input.value = JSON.stringify(images);
        Admin.refreshGallery(images);
      };
      reader.readAsDataURL(file);
    });
  },

  removeGalleryImage(index) {
    const input = document.getElementById('gallery-images-input');
    let images = JSON.parse(input.value || '[]');
    images.splice(index, 1);
    input.value = JSON.stringify(images);
    this.refreshGallery(images);
  },

  refreshGallery(images) {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = images.map((img, i) => `
      <div class="gallery-item">
        <img src="${img}" alt="">
        <button type="button" class="gallery-item-remove" onclick="Admin.removeGalleryImage(${i})">&times;</button>
      </div>
    `).join('') + `
      <label class="gallery-add">
        <input type="file" accept="image/*" multiple onchange="Admin.handleGalleryUpload(event)">
        +
      </label>
    `;
  },

  saveProduct(id) {
    const form = document.getElementById('product-form');
    const formData = new FormData(form);

    const data = {
      name: formData.get('name'),
      categoryId: formData.get('categoryId'),
      price: formData.get('price'),
      description: formData.get('description'),
      image: formData.get('image'),
      dimensions: formData.get('dimensions'),
      weight: formData.get('weight'),
      colors: formData.get('colors'),
      materials: formData.get('materials'),
      additionalInfo: formData.get('additionalInfo'),
      published: formData.has('published'),
      featured: formData.has('featured'),
      images: JSON.parse(document.getElementById('gallery-images-input').value || '[]')
    };

    if (!data.name.trim()) {
      this.toast('Por favor, insira o nome do produto.', 'error');
      return;
    }

    if (id) {
      DB.updateProduct(id, data);
      this.toast('Produto atualizado com sucesso!');
    } else {
      DB.addProduct(data);
      this.toast('Produto criado com sucesso!');
    }

    this.closeModal();
    this.renderProducts();
  },

  duplicateProduct(id) {
    DB.duplicateProduct(id);
    this.toast('Produto duplicado!');
    this.renderProducts();
  },

  // ===== CATEGORIES =====
  renderCategories() {
    const categories = DB.getCategories();

    this.content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="font-size:1.1rem;font-weight:600;">Categorias (${categories.length})</h2>
        <button class="btn-admin btn-admin-primary" onclick="Admin.openCategoryForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar Categoria
        </button>
      </div>

      ${categories.length === 0 ? `
        <div class="admin-panel">
          <div class="panel-body">
            <div class="admin-empty">
              <div style="font-size:2rem;">&#128193;</div>
              <h4>Nenhuma categoria cadastrada</h4>
              <p>Categorias ajudam a organizar seus produtos.</p>
              <button class="btn-admin btn-admin-primary" onclick="Admin.openCategoryForm()">Adicionar Categoria</button>
            </div>
          </div>
        </div>
      ` : `
        <div class="admin-panel">
          <div class="panel-body" style="padding:0;overflow-x:auto;">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Produtos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${categories.map(c => {
                  const count = DB.getProducts().filter(p => p.categoryId === c.id).length;
                  return `
                    <tr>
                      <td>${c.image ? `<img class="table-img" src="${c.image}" alt="">` : '<div class="table-img" style="display:flex;align-items:center;justify-content:center;color:var(--admin-text-muted);font-size:0.7rem;">--</div>'}</td>
                      <td><strong>${c.name}</strong></td>
                      <td>${count} produto(s)</td>
                      <td>
                        <div class="table-actions">
                          <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="Admin.openCategoryForm('${c.id}')">Editar</button>
                          <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="Admin.confirmDelete('category','${c.id}','${c.name.replace(/'/g, "\\'")}')">Excluir</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `}
    `;
  },

  openCategoryForm(id) {
    const category = id ? DB.getCategories().find(c => c.id === id) : null;
    const isEdit = !!category;

    const body = `
      <form id="category-form">
        <div class="form-group">
          <label class="form-label">Nome da Categoria *</label>
          <input class="form-input" name="name" value="${category ? category.name : ''}" required placeholder="Ex: Canecas, Vasos, Pratos...">
        </div>
        <div class="form-group">
          <label class="form-label">Imagem da Categoria</label>
          <div class="image-upload">
            <input type="file" accept="image/*" onchange="Admin.handleImageUpload(event, this)">
            <div class="image-upload-icon">&#128247;</div>
            <p>Clique para adicionar uma imagem</p>
            <input type="hidden" name="image" value="${category ? category.image || '' : ''}">
          </div>
          ${category && category.image ? `<img class="image-preview-small" src="${category.image}" alt="">` : ''}
        </div>
      </form>
    `;

    const footer = `
      <button class="btn-admin btn-admin-secondary" onclick="Admin.closeModal()">Cancelar</button>
      <button class="btn-admin btn-admin-primary" onclick="Admin.saveCategory('${id || ''}')">${isEdit ? 'Salvar' : 'Criar Categoria'}</button>
    `;

    this.openModal(isEdit ? 'Editar Categoria' : 'Nova Categoria', body, footer);
  },

  saveCategory(id) {
    const form = document.getElementById('category-form');
    const formData = new FormData(form);
    const name = formData.get('name').trim();

    if (!name) {
      this.toast('Por favor, insira o nome da categoria.', 'error');
      return;
    }

    const data = { name, image: formData.get('image') };

    if (id) {
      DB.updateCategory(id, data);
      this.toast('Categoria atualizada!');
    } else {
      DB.addCategory(data);
      this.toast('Categoria criada!');
    }

    this.closeModal();
    this.renderCategories();
  },

  // ===== HOMEPAGE =====
  renderHomepage() {
    const hp = DB.getHomepage();

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header">
          <h3>Logo / Imagem da Marca</h3>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Logo ou Imagem</label>
            <div class="image-upload">
              <input type="file" accept="image/*" onchange="Admin.handleHomepageImage(event, 'logo-image')">
              <div class="image-upload-icon">&#128247;</div>
              <p>Clique para adicionar logo ou imagem</p>
              <input type="hidden" id="logo-image" value="${hp.logo || ''}">
            </div>
            ${hp.logo ? `<img class="image-preview-small" src="${hp.logo}" alt="" style="max-width:${hp.logoSize || 120}px;">` : ''}
          </div>
          <div class="form-group">
            <label class="form-label">Tamanho da Imagem (px)</label>
            <input class="form-input" id="logo-size" type="number" min="20" max="500" value="${hp.logoSize || 120}">
            <p class="form-help">Largura da imagem em pixels.</p>
          </div>
          <div class="form-group">
            <label class="form-checkbox">
              <input type="checkbox" id="show-logo-hero" ${hp.showLogoInHero !== false ? 'checked' : ''}>
              Exibir no banner principal (Hero)
            </label>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveLogo()">Salvar Logo</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Banner Principal (Hero)</h3>
          <label class="form-checkbox" style="margin:0;">
            <input type="checkbox" id="hero-enabled" ${hp.heroEnabled !== false ? 'checked' : ''} onchange="Admin.toggleHero()">
            Visível
          </label>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Subtítulo</label>
            <input class="form-input" id="hero-subtitle" value="${hp.heroSubtitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Título Principal</label>
            <input class="form-input" id="hero-title" value="${hp.heroTitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto</label>
            <textarea class="form-textarea" id="hero-text" rows="3">${hp.heroText || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Imagem de Fundo</label>
            <div class="image-upload">
              <input type="file" accept="image/*" onchange="Admin.handleHomepageImage(event, 'heroImage')">
              <div class="image-upload-icon">&#128247;</div>
              <p>Clique para adicionar imagem de fundo</p>
              <input type="hidden" id="hero-image" value="${hp.heroImage || ''}">
            </div>
            ${hp.heroImage ? `<img class="image-preview" src="${hp.heroImage}" alt="">` : ''}
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Texto do Botão 1</label>
              <input class="form-input" id="hero-btn1-text" value="${hp.heroBtn1Text || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Link do Botão 1</label>
              <input class="form-input" id="hero-btn1-link" value="${hp.heroBtn1Link || ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Texto do Botão 2</label>
              <input class="form-input" id="hero-btn2-text" value="${hp.heroBtn2Text || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Link do Botão 2</label>
              <input class="form-input" id="hero-btn2-link" value="${hp.heroBtn2Link || ''}">
            </div>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveHomepageHero()">Salvar Hero</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Produtos em Destaque</h3>
          <label class="form-checkbox" style="margin:0;">
            <input type="checkbox" id="featured-enabled" ${hp.featuredEnabled !== false ? 'checked' : ''} onchange="Admin.toggleFeatured()">
            Visível
          </label>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título da Seção</label>
            <input class="form-input" id="featured-title" value="${hp.featuredTitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto da Seção</label>
            <textarea class="form-textarea" id="featured-text" rows="2">${hp.featuredText || ''}</textarea>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveHomepageFeatured()">Salvar Destaques</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Prévia — Sobre</h3>
          <label class="form-checkbox" style="margin:0;">
            <input type="checkbox" id="about-preview-enabled" ${hp.sections && hp.sections.find(s => s.id === 'about-preview') ? (hp.sections.find(s => s.id === 'about-preview').enabled ? 'checked' : '') : 'checked'} onchange="Admin.toggleSection('about-preview')">
            Visível
          </label>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título</label>
            <input class="form-input" id="about-preview-title" value="${hp.aboutPreviewTitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto</label>
            <textarea class="form-textarea" id="about-preview-text" rows="3">${hp.aboutPreviewText || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Imagem</label>
            <div class="image-upload">
              <input type="file" accept="image/*" onchange="Admin.handleHomepageImage(event, 'aboutPreviewImage')">
              <div class="image-upload-icon">&#128247;</div>
              <p>Clique para adicionar imagem</p>
              <input type="hidden" id="about-preview-image" value="${hp.aboutPreviewImage || ''}">
            </div>
            ${hp.aboutPreviewImage ? `<img class="image-preview-small" src="${hp.aboutPreviewImage}" alt="">` : ''}
          </div>
          <div class="form-group">
            <label class="form-label">Texto do Botão</label>
            <input class="form-input" id="about-preview-btn" value="${hp.aboutPreviewBtnText || ''}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveHomepageAboutPreview()">Salvar</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Prévia — Contato</h3>
          <label class="form-checkbox" style="margin:0;">
            <input type="checkbox" id="contact-preview-enabled" ${hp.sections && hp.sections.find(s => s.id === 'contact-preview') ? (hp.sections.find(s => s.id === 'contact-preview').enabled ? 'checked' : '') : 'checked'} onchange="Admin.toggleSection('contact-preview')">
            Visível
          </label>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título</label>
            <input class="form-input" id="contact-preview-title" value="${hp.contactPreviewTitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto</label>
            <textarea class="form-textarea" id="contact-preview-text" rows="2">${hp.contactPreviewText || ''}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Texto do Botão</label>
            <input class="form-input" id="contact-preview-btn" value="${hp.contactPreviewBtnText || ''}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveHomepageContactPreview()">Salvar</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Mensagem — Catálogo Vazio</h3>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título</label>
            <input class="form-input" id="catalog-empty-title" value="${hp.catalogEmptyTitle || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Mensagem</label>
            <textarea class="form-textarea" id="catalog-empty-message" rows="2">${hp.catalogEmptyMessage || ''}</textarea>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveHomepageEmpty()">Salvar</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header">
          <h3>Ordem das Seções</h3>
        </div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:12px;">Arraste para reordenar. Use os toggles para ativar/desativar.</p>
          <div id="sections-order">
            ${(hp.sections || []).map((sec, i) => `
              <div class="section-order-item" draggable="true" data-index="${i}">
                <span class="drag-icon">&#9776;</span>
                <label>${sec.label}</label>
                <span class="toggle-switch">
                  <input type="checkbox" ${sec.enabled ? 'checked' : ''} onchange="Admin.toggleSectionOrder(${i}, this.checked)">
                  <span class="toggle-slider"></span>
                </span>
              </div>
            `).join('')}
          </div>
          <button class="btn-admin btn-admin-primary" style="margin-top:12px;" onclick="Admin.saveSectionOrder()">Salvar Ordem</button>
        </div>
      </div>
    `;

    this.setupDragAndDrop();
  },

  handleHomepageImage(event, field) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById(field).value = e.target.result;
      const container = event.target.closest('.image-upload').parentElement;
      let preview = container.querySelector('.image-preview, .image-preview-small');
      if (preview) {
        preview.src = e.target.result;
      } else {
        preview = document.createElement('img');
        preview.className = 'image-preview-small';
        preview.src = e.target.result;
        preview.alt = '';
        container.appendChild(preview);
      }
    };
    reader.readAsDataURL(file);
  },

  saveLogo() {
    const hp = DB.getHomepage();
    hp.logo = document.getElementById('logo-image').value;
    hp.logoSize = parseInt(document.getElementById('logo-size').value) || 120;
    hp.showLogoInHero = document.getElementById('show-logo-hero').checked;
    DB.saveHomepage(hp);
    this.toast('Logo salva!');
  },

  toggleHero() {
    const hp = DB.getHomepage();
    hp.heroEnabled = document.getElementById('hero-enabled').checked;
    DB.saveHomepage(hp);
    this.toast('Hero atualizado!');
  },

  toggleFeatured() {
    const hp = DB.getHomepage();
    hp.featuredEnabled = document.getElementById('featured-enabled').checked;
    DB.saveHomepage(hp);
    this.toast('Seção de destaques atualizada!');
  },

  toggleSection(id) {
    const hp = DB.getHomepage();
    if (!hp.sections) hp.sections = [];
    let sec = hp.sections.find(s => s.id === id);
    if (sec) {
      const toggle = document.getElementById(id.replace('-', '-') + '-enabled') || document.querySelector(`[id="${id}-enabled"]`);
      sec.enabled = toggle ? toggle.checked : true;
    }
    DB.saveHomepage(hp);
  },

  toggleSectionOrder(index, checked) {
    const hp = DB.getHomepage();
    if (hp.sections && hp.sections[index]) {
      hp.sections[index].enabled = checked;
    }
    DB.saveHomepage(hp);
  },

  saveSectionOrder() {
    const hp = DB.getHomepage();
    const container = document.getElementById('sections-order');
    const items = container.querySelectorAll('.section-order-item');
    const newOrder = [];

    items.forEach(item => {
      const idx = parseInt(item.dataset.index);
      if (hp.sections && hp.sections[idx]) {
        newOrder.push(hp.sections[idx]);
      }
    });

    hp.sections = newOrder;
    DB.saveHomepage(hp);
    this.toast('Ordem das seções salva!');
    this.renderHomepage();
  },

  setupDragAndDrop() {
    const container = document.getElementById('sections-order');
    if (!container) return;
    let draggedItem = null;

    container.querySelectorAll('.section-order-item').forEach(item => {
      item.addEventListener('dragstart', () => {
        draggedItem = item;
        item.style.opacity = '0.5';
      });

      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
        draggedItem = null;
        // Update indices
        container.querySelectorAll('.section-order-item').forEach((el, i) => {
          el.dataset.index = i;
        });
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          container.insertBefore(draggedItem, item);
        } else {
          container.insertBefore(draggedItem, item.nextSibling);
        }
      });
    });
  },

  saveHomepageHero() {
    const hp = DB.getHomepage();
    hp.heroSubtitle = document.getElementById('hero-subtitle').value;
    hp.heroTitle = document.getElementById('hero-title').value;
    hp.heroText = document.getElementById('hero-text').value;
    hp.heroImage = document.getElementById('hero-image').value;
    hp.heroBtn1Text = document.getElementById('hero-btn1-text').value;
    hp.heroBtn1Link = document.getElementById('hero-btn1-link').value;
    hp.heroBtn2Text = document.getElementById('hero-btn2-text').value;
    hp.heroBtn2Link = document.getElementById('hero-btn2-link').value;
    DB.saveHomepage(hp);
    this.toast('Hero salvo!');
  },

  saveHomepageFeatured() {
    const hp = DB.getHomepage();
    hp.featuredTitle = document.getElementById('featured-title').value;
    hp.featuredText = document.getElementById('featured-text').value;
    DB.saveHomepage(hp);
    this.toast('Seção de destaques salva!');
  },

  saveHomepageAboutPreview() {
    const hp = DB.getHomepage();
    hp.aboutPreviewTitle = document.getElementById('about-preview-title').value;
    hp.aboutPreviewText = document.getElementById('about-preview-text').value;
    hp.aboutPreviewImage = document.getElementById('about-preview-image').value;
    hp.aboutPreviewBtnText = document.getElementById('about-preview-btn').value;
    DB.saveHomepage(hp);
    this.toast('Prévia sobre salva!');
  },

  saveHomepageContactPreview() {
    const hp = DB.getHomepage();
    hp.contactPreviewTitle = document.getElementById('contact-preview-title').value;
    hp.contactPreviewText = document.getElementById('contact-preview-text').value;
    hp.contactPreviewBtnText = document.getElementById('contact-preview-btn').value;
    DB.saveHomepage(hp);
    this.toast('Prévia contato salva!');
  },

  saveHomepageEmpty() {
    const hp = DB.getHomepage();
    hp.catalogEmptyTitle = document.getElementById('catalog-empty-title').value;
    hp.catalogEmptyMessage = document.getElementById('catalog-empty-message').value;
    DB.saveHomepage(hp);
    this.toast('Mensagem salva!');
  },

  // ===== APPEARANCE =====
  renderAppearance() {
    const settings = DB.getSettings();
    const c = settings.colors;

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header"><h3>Cores do Site</h3></div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:16px;">Altere as cores para personalizar a aparência do site.</p>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cor Principal</label>
              <div class="color-input-group">
                <input type="color" value="${c.primary}" onchange="document.getElementById('color-primary').value=this.value">
                <input class="form-input" type="text" id="color-primary" value="${c.primary}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cor Principal (Clara)</label>
              <div class="color-input-group">
                <input type="color" value="${c.primaryLight}" onchange="document.getElementById('color-primaryLight').value=this.value">
                <input class="form-input" type="text" id="color-primaryLight" value="${c.primaryLight}">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Cor Principal (Escura)</label>
              <div class="color-input-group">
                <input type="color" value="${c.primaryDark}" onchange="document.getElementById('color-primaryDark').value=this.value">
                <input class="form-input" type="text" id="color-primaryDark" value="${c.primaryDark}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Cor Secundária</label>
              <div class="color-input-group">
                <input type="color" value="${c.secondary}" onchange="document.getElementById('color-secondary').value=this.value">
                <input class="form-input" type="text" id="color-secondary" value="${c.secondary}">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Fundo</label>
              <div class="color-input-group">
                <input type="color" value="${c.bg}" onchange="document.getElementById('color-bg').value=this.value">
                <input class="form-input" type="text" id="color-bg" value="${c.bg}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fundo Alternativo</label>
              <div class="color-input-group">
                <input type="color" value="${c.bgAlt}" onchange="document.getElementById('color-bgAlt').value=this.value">
                <input class="form-input" type="text" id="color-bgAlt" value="${c.bgAlt}">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Superfície</label>
              <div class="color-input-group">
                <input type="color" value="${c.surface}" onchange="document.getElementById('color-surface').value=this.value">
                <input class="form-input" type="text" id="color-surface" value="${c.surface}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Texto</label>
              <div class="color-input-group">
                <input type="color" value="${c.text}" onchange="document.getElementById('color-text').value=this.value">
                <input class="form-input" type="text" id="color-text" value="${c.text}">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Texto (Claro)</label>
              <div class="color-input-group">
                <input type="color" value="${c.textLight}" onchange="document.getElementById('color-textLight').value=this.value">
                <input class="form-input" type="text" id="color-textLight" value="${c.textLight}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Texto (Suave)</label>
              <div class="color-input-group">
                <input type="color" value="${c.textMuted}" onchange="document.getElementById('color-textMuted').value=this.value">
                <input class="form-input" type="text" id="color-textMuted" value="${c.textMuted}">
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Borda</label>
              <div class="color-input-group">
                <input type="color" value="${c.border}" onchange="document.getElementById('color-border').value=this.value">
                <input class="form-input" type="text" id="color-border" value="${c.border}">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Acento</label>
              <div class="color-input-group">
                <input type="color" value="${c.accent}" onchange="document.getElementById('color-accent').value=this.value">
                <input class="form-input" type="text" id="color-accent" value="${c.accent}">
              </div>
            </div>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveColors()">Salvar Cores</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Tipografia</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Fonte dos Títulos</label>
            <select class="form-select" id="font-heading">
              <option value="'Cormorant Garamond', Georgia, serif" ${settings.fonts.heading.includes('Cormorant') ? 'selected' : ''}>Cormorant Garamond</option>
              <option value="'Playfair Display', Georgia, serif" ${settings.fonts.heading.includes('Playfair') ? 'selected' : ''}>Playfair Display</option>
              <option value="'Lora', Georgia, serif" ${settings.fonts.heading.includes('Lora') ? 'selected' : ''}>Lora</option>
              <option value="Georgia, serif" ${settings.fonts.heading === 'Georgia, serif' ? 'selected' : ''}>Georgia</option>
              <option value="'Montserrat', sans-serif" ${settings.fonts.heading.includes('Montserrat') ? 'selected' : ''}>Montserrat</option>
              <option value="'Inter', sans-serif" ${settings.fonts.heading.includes('Inter') ? 'selected' : ''}>Inter</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Fonte do Corpo</label>
            <select class="form-select" id="font-body">
              <option value="'Montserrat', 'Helvetica Neue', sans-serif" ${settings.fonts.body.includes('Montserrat') ? 'selected' : ''}>Montserrat</option>
              <option value="'Inter', -apple-system, sans-serif" ${settings.fonts.body.includes('Inter') ? 'selected' : ''}>Inter</option>
              <option value="'Lato', sans-serif" ${settings.fonts.body.includes('Lato') ? 'selected' : ''}>Lato</option>
              <option value="'Open Sans', sans-serif" ${settings.fonts.body.includes('Open Sans') ? 'selected' : ''}>Open Sans</option>
              <option value="system-ui, sans-serif" ${settings.fonts.body.includes('system') ? 'selected' : ''}>System UI</option>
            </select>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveFonts()">Salvar Fontes</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Menu de Navegação</h3></div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:12px;">Edite os nomes dos itens do menu.</p>
          <div id="menu-items-editor">
            ${settings.menuItems.map((item, i) => `
              <div class="form-row" style="margin-bottom:10px;align-items:end;">
                <div class="form-group" style="margin:0;">
                  <label class="form-label">Rótulo</label>
                  <input class="form-input menu-item-label" data-index="${i}" value="${item.label}">
                </div>
                <div class="form-group" style="margin:0;">
                  <label class="form-label">Página</label>
                  <select class="form-select menu-item-page" data-index="${i}">
                    <option value="home" ${item.page === 'home' ? 'selected' : ''}>Início</option>
                    <option value="catalogo" ${item.page === 'catalogo' ? 'selected' : ''}>Catálogo</option>
                    <option value="sobre" ${item.page === 'sobre' ? 'selected' : ''}>Sobre</option>
                    <option value="contato" ${item.page === 'contato' ? 'selected' : ''}>Contato</option>
                  </select>
                </div>
              </div>
            `).join('')}
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveMenuItems()">Salvar Menu</button>
        </div>
      </div>
    `;
  },

  saveColors() {
    const settings = DB.getSettings();
    settings.colors = {
      primary: document.getElementById('color-primary').value,
      primaryLight: document.getElementById('color-primaryLight').value,
      primaryDark: document.getElementById('color-primaryDark').value,
      secondary: document.getElementById('color-secondary').value,
      bg: document.getElementById('color-bg').value,
      bgAlt: document.getElementById('color-bgAlt').value,
      surface: document.getElementById('color-surface').value,
      text: document.getElementById('color-text').value,
      textLight: document.getElementById('color-textLight').value,
      textMuted: document.getElementById('color-textMuted').value,
      border: document.getElementById('color-border').value,
      accent: document.getElementById('color-accent').value
    };
    DB.saveSettings(settings);
    this.toast('Cores salvas!');
  },

  saveFonts() {
    const settings = DB.getSettings();
    settings.fonts = {
      heading: document.getElementById('font-heading').value,
      body: document.getElementById('font-body').value
    };
    DB.saveSettings(settings);
    this.toast('Fontes salvas!');
  },

  saveMenuItems() {
    const settings = DB.getSettings();
    const labels = document.querySelectorAll('.menu-item-label');
    const pages = document.querySelectorAll('.menu-item-page');
    settings.menuItems = [];
    labels.forEach((label, i) => {
      settings.menuItems.push({
        label: label.value,
        page: pages[i].value
      });
    });
    DB.saveSettings(settings);
    this.toast('Menu salvo!');
  },

  // ===== TEXTS =====
  renderTexts() {
    const settings = DB.getSettings();

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header"><h3>Identidade da Marca</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Nome da Marca</label>
            <input class="form-input" id="site-name" value="${settings.siteName}">
          </div>
          <div class="form-group">
            <label class="form-label">Tagline / Subtítulo</label>
            <input class="form-input" id="site-tagline" value="${settings.siteTagline}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveBrandTexts()">Salvar</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Rodapé</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Texto do Rodapé (Tagline)</label>
            <input class="form-input" id="footer-tagline-input" value="${settings.siteTagline}">
          </div>
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:12px;">O nome da marca no rodapé é automaticamente o "Nome da Marca" definido acima.</p>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveFooterTexts()">Salvar Rodapé</button>
        </div>
      </div>
    `;
  },

  saveBrandTexts() {
    const settings = DB.getSettings();
    settings.siteName = document.getElementById('site-name').value;
    settings.siteTagline = document.getElementById('site-tagline').value;
    DB.saveSettings(settings);
    this.toast('Identidade da marca salva!');
  },

  saveFooterTexts() {
    const settings = DB.getSettings();
    settings.siteTagline = document.getElementById('footer-tagline-input').value;
    DB.saveSettings(settings);
    this.toast('Rodapé salvo!');
  },

  // ===== CONTACT =====
  renderContact() {
    const contact = DB.getContact();
    const settings = DB.getSettings();

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header"><h3>Informações de Contato</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título da Página</label>
            <input class="form-input" id="contact-title" value="${contact.title || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto Descritivo</label>
            <textarea class="form-textarea" id="contact-text" rows="2">${contact.text || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">WhatsApp (número com DDD)</label>
              <input class="form-input" id="contact-whatsapp" value="${contact.whatsapp || ''}" placeholder="Ex: 5511999999999">
              <p class="form-help">Formato: código do país + DDD + número. Ex: 5511999999999</p>
            </div>
            <div class="form-group">
              <label class="form-label">Mensagem Automática WhatsApp</label>
              <input class="form-input" id="contact-whatsapp-msg" value="${contact.whatsappMessage || ''}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">E-mail</label>
              <input class="form-input" id="contact-email" type="email" value="${contact.email || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Instagram (URL completa)</label>
              <input class="form-input" id="contact-instagram" value="${contact.instagram || ''}" placeholder="https://instagram.com/seuperfil">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Facebook (URL completa)</label>
              <input class="form-input" id="contact-facebook" value="${contact.facebook || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Endereço</label>
              <input class="form-input" id="contact-address" value="${contact.address || ''}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Horário de Funcionamento</label>
            <input class="form-input" id="contact-hours" value="${contact.hours || ''}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveContactInfo()">Salvar Contato</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Redes Sociais (Globais)</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Instagram (URL)</label>
            <input class="form-input" id="social-instagram" value="${settings.social.instagram || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Facebook (URL)</label>
            <input class="form-input" id="social-facebook" value="${settings.social.facebook || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Pinterest (URL)</label>
            <input class="form-input" id="social-pinterest" value="${settings.social.pinterest || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">E-mail (para rodapé)</label>
            <input class="form-input" id="social-email" value="${settings.social.email || ''}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveSocials()">Salvar Redes Sociais</button>
        </div>
      </div>
    `;
  },

  saveContactInfo() {
    const data = {
      title: document.getElementById('contact-title').value,
      text: document.getElementById('contact-text').value,
      whatsapp: document.getElementById('contact-whatsapp').value,
      whatsappMessage: document.getElementById('contact-whatsapp-msg').value,
      email: document.getElementById('contact-email').value,
      instagram: document.getElementById('contact-instagram').value,
      facebook: document.getElementById('contact-facebook').value,
      address: document.getElementById('contact-address').value,
      hours: document.getElementById('contact-hours').value
    };
    DB.saveContact(data);

    // Also update global settings with the whatsapp number
    const settings = DB.getSettings();
    settings.whatsapp.number = data.whatsapp;
    settings.whatsapp.message = data.whatsappMessage;
    DB.saveSettings(settings);

    this.toast('Contato salvo!');
  },

  saveSocials() {
    const settings = DB.getSettings();
    settings.social = {
      instagram: document.getElementById('social-instagram').value,
      facebook: document.getElementById('social-facebook').value,
      pinterest: document.getElementById('social-pinterest').value,
      email: document.getElementById('social-email').value
    };
    DB.saveSettings(settings);
    this.toast('Redes sociais salvas!');
  },

  // ===== ABOUT =====
  renderAbout() {
    const about = DB.getAbout();

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header"><h3>Página Sobre</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Título</label>
            <input class="form-input" id="about-title" value="${about.title || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Texto Principal</label>
            <textarea class="form-textarea" id="about-text" rows="8">${about.text || ''}</textarea>
            <p class="form-help">Use parágrafos separados por linha em branco.</p>
          </div>
          <div class="form-group">
            <label class="form-label">Imagem Principal</label>
            <div class="image-upload">
              <input type="file" accept="image/*" onchange="Admin.handleAboutImage(event)">
              <div class="image-upload-icon">&#128247;</div>
              <p>Clique para adicionar imagem</p>
              <input type="hidden" id="about-image" value="${about.image || ''}">
            </div>
            ${about.image ? `<img class="image-preview" src="${about.image}" alt="">` : ''}
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveAboutText()">Salvar Texto e Imagem</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Missão</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Texto da Missão</label>
            <textarea class="form-textarea" id="about-mission" rows="3">${about.mission || ''}</textarea>
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveAboutMission()">Salvar Missão</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Valores</h3></div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:12px;">Adicione ou remova valores da marca.</p>
          <div id="values-list">
            ${(about.values || []).map((v, i) => `
              <div style="display:flex;gap:8px;margin-bottom:8px;">
                <input class="form-input about-value-input" value="${v}" data-index="${i}">
                <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="Admin.removeAboutValue(${i})">X</button>
              </div>
            `).join('')}
          </div>
          <button class="btn-admin btn-admin-secondary" onclick="Admin.addAboutValue()">+ Adicionar Valor</button>
          <br><br>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveAboutValues()">Salvar Valores</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Galeria de Imagens</h3></div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:12px;">Adicione imagens adicionais para a página Sobre.</p>
          <div class="gallery-grid" id="about-gallery">
            ${(about.images || []).map((img, i) => `
              <div class="gallery-item">
                <img src="${img}" alt="">
                <button type="button" class="gallery-item-remove" onclick="Admin.removeAboutImage(${i})">&times;</button>
              </div>
            `).join('')}
            <label class="gallery-add">
              <input type="file" accept="image/*" multiple onchange="Admin.handleAboutGalleryUpload(event)">
              +
            </label>
          </div>
        </div>
      </div>
    `;
  },

  handleAboutImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('about-image').value = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  handleAboutGalleryUpload(event) {
    const files = Array.from(event.target.files);
    const about = DB.getAbout();
    if (!about.images) about.images = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        about.images.push(e.target.result);
        DB.saveAbout(about);
        Admin.renderAbout();
        Admin.toast('Imagem adicionada!');
      };
      reader.readAsDataURL(file);
    });
  },

  removeAboutImage(index) {
    const about = DB.getAbout();
    about.images.splice(index, 1);
    DB.saveAbout(about);
    this.renderAbout();
    this.toast('Imagem removida!');
  },

  addAboutValue() {
    const list = document.getElementById('values-list');
    const idx = list.children.length;
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;';
    div.innerHTML = `
      <input class="form-input about-value-input" value="" data-index="${idx}">
      <button class="btn-admin btn-admin-danger btn-admin-sm" onclick="this.parentElement.remove()">X</button>
    `;
    list.appendChild(div);
  },

  removeAboutValue(index) {
    const inputs = document.querySelectorAll('.about-value-input');
    inputs[index].parentElement.remove();
  },

  saveAboutText() {
    const about = DB.getAbout();
    about.title = document.getElementById('about-title').value;
    about.text = document.getElementById('about-text').value;
    about.image = document.getElementById('about-image').value;
    DB.saveAbout(about);
    this.toast('Texto e imagem salvos!');
  },

  saveAboutMission() {
    const about = DB.getAbout();
    about.mission = document.getElementById('about-mission').value;
    DB.saveAbout(about);
    this.toast('Missão salva!');
  },

  saveAboutValues() {
    const about = DB.getAbout();
    const inputs = document.querySelectorAll('.about-value-input');
    about.values = Array.from(inputs).map(i => i.value).filter(v => v.trim());
    DB.saveAbout(about);
    this.toast('Valores salvos!');
  },

  // ===== SETTINGS =====
  renderSettings() {
    const settings = DB.getSettings();

    this.content.innerHTML = `
      <div class="admin-panel">
        <div class="panel-header"><h3>WhatsApp</h3></div>
        <div class="panel-body">
          <div class="form-group">
            <label class="form-label">Número do WhatsApp</label>
            <input class="form-input" id="settings-whatsapp" value="${settings.whatsapp.number}" placeholder="Ex: 5511999999999">
            <p class="form-help">Formato internacional: código do país + DDD + número (sem espaços ou traços).</p>
          </div>
          <div class="form-group">
            <label class="form-label">Mensagem Automática</label>
            <input class="form-input" id="settings-whatsapp-msg" value="${settings.whatsapp.message}">
          </div>
          <button class="btn-admin btn-admin-primary" onclick="Admin.saveWhatsApp()">Salvar WhatsApp</button>
        </div>
      </div>

      <div class="admin-panel">
        <div class="panel-header"><h3>Redefer Dados</h3></div>
        <div class="panel-body">
          <p style="font-size:0.82rem;color:var(--admin-text-muted);margin-bottom:16px;">Exporte ou importe todos os dados do site (produtos, categorias, configurações, textos).</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn-admin btn-admin-secondary" onclick="Admin.exportData()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exportar Dados
            </button>
            <label class="btn-admin btn-admin-secondary" style="cursor:pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Importar Dados
              <input type="file" accept=".json" style="display:none;" onchange="Admin.importData(event)">
            </label>
            <button class="btn-admin btn-admin-danger" onclick="Admin.confirmReset()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              Limpar Todos os Dados
            </button>
          </div>
        </div>
      </div>
    `;
  },

  saveWhatsApp() {
    const settings = DB.getSettings();
    settings.whatsapp.number = document.getElementById('settings-whatsapp').value;
    settings.whatsapp.message = document.getElementById('settings-whatsapp-msg').value;
    DB.saveSettings(settings);

    // Sync to contact
    const contact = DB.getContact();
    contact.whatsapp = settings.whatsapp.number;
    contact.whatsappMessage = settings.whatsapp.message;
    DB.saveContact(contact);

    this.toast('WhatsApp salvo!');
  },

  exportData() {
    const data = {
      settings: DB.getSettings(),
      homepage: DB.getHomepage(),
      products: DB.getProducts(),
      categories: DB.getCategories(),
      about: DB.getAbout(),
      contact: DB.getContact(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rosinele-brunhara-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Dados exportados!');
  },

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.settings) DB.saveSettings(data.settings);
        if (data.homepage) DB.saveHomepage(data.homepage);
        if (data.products) DB.saveProducts(data.products);
        if (data.categories) DB.saveCategories(data.categories);
        if (data.about) DB.saveAbout(data.about);
        if (data.contact) DB.saveContact(data.contact);
        this.toast('Dados importados com sucesso!');
        this.renderSection(this.currentSection);
      } catch (err) {
        this.toast('Erro ao importar dados. Verifique o arquivo.', 'error');
      }
    };
    reader.readAsText(file);
  },

  confirmReset() {
    this.showConfirm(
      'Limpar todos os dados?',
      'Esta ação irá apagar todos os produtos, categorias, configurações e textos. Esta ação não pode ser desfeita.',
      () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('rb_'));
        keys.forEach(k => localStorage.removeItem(k));
        this.toast('Todos os dados foram limpos!');
        this.renderSection('dashboard');
      }
    );
  },

  // ===== SHARED =====
  openModal(title, body, footer) {
    document.getElementById('admin-modal-title').textContent = title;
    document.getElementById('admin-modal-body').innerHTML = body;
    document.getElementById('admin-modal-footer').innerHTML = footer;
    document.getElementById('admin-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    document.getElementById('admin-modal').style.display = 'none';
    document.body.style.overflow = '';
  },

  setupModal() {
    const closeBtn = document.getElementById('admin-modal-close');
    const overlay = document.querySelector('.admin-modal-overlay');

    closeBtn.addEventListener('click', () => this.closeModal());
    overlay.addEventListener('click', () => this.closeModal());
  },

  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '&#10003;' : type === 'error' ? '&#10007;' : '&#9888;'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  confirmDelete(type, id, name) {
    this.showConfirm(
      'Excluir item?',
      `Tem certeza que deseja excluir "${name}"? Esta ação não pode ser desfeita.`,
      () => {
        if (type === 'product') {
          DB.deleteProduct(id);
          this.toast('Produto excluído!');
          this.renderProducts();
        } else if (type === 'category') {
          DB.deleteCategory(id);
          this.toast('Categoria excluída!');
          this.renderCategories();
        }
      }
    );
  },

  showConfirm(title, message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <h4>${title}</h4>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn-admin btn-admin-secondary" id="confirm-cancel">Cancelar</button>
          <button class="btn-admin btn-admin-danger" id="confirm-ok">Confirmar</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#confirm-cancel').addEventListener('click', () => overlay.remove());
    overlay.querySelector('#confirm-ok').addEventListener('click', () => {
      onConfirm();
      overlay.remove();
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());

const DB = {
  _prefix: 'rb_',

  _get(key) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  _set(key, value) {
    localStorage.setItem(this._prefix + key, JSON.stringify(value));
  },

  _remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // ===== SETTINGS =====
  getSettings() {
    return this._get('settings') || {
      colors: {
        primary: '#8B7355',
        primaryLight: '#A89279',
        primaryDark: '#6B5640',
        secondary: '#C4A882',
        bg: '#FAF8F5',
        bgAlt: '#F5F0EB',
        surface: '#FFFFFF',
        text: '#4A3F35',
        textLight: '#7A6E63',
        textMuted: '#A99E94',
        border: '#E8E0D8',
        accent: '#D4B896'
      },
      fonts: {
        heading: "'Cormorant Garamond', Georgia, serif",
        body: "'Montserrat', 'Helvetica Neue', sans-serif"
      },
      siteName: 'Rosinele Brunhara',
      siteTagline: 'Cerâmicas Artesanais',
      menuItems: [
        { label: 'Início', page: 'home' },
        { label: 'Catálogo', page: 'catalogo' },
        { label: 'Sobre', page: 'sobre' },
        { label: 'Contato', page: 'contato' }
      ],
      whatsapp: {
        number: '',
        message: 'Olá! Gostaria de saber mais sobre uma peça.'
      },
      social: {
        instagram: '',
        facebook: '',
        pinterest: '',
        email: ''
      }
    };
  },

  saveSettings(settings) {
    this._set('settings', settings);
  },

  // ===== HOMEPAGE =====
  getHomepage() {
    return this._get('homepage') || {
      heroTitle: 'Rosinele Brunhara',
      heroSubtitle: 'Cerâmicas Artesanais',
      heroText: 'Peças únicas feitas à mão com amor, dedicação e atenção a cada detalhe. Cada criação carrega a essência do artesanato e a beleza do feito à mão.',
      heroImage: '',
      heroBtn1Text: 'Ver Catálogo',
      heroBtn1Link: '#/catalogo',
      heroBtn2Text: 'Sobre Mim',
      heroBtn2Link: '#/sobre',
      heroEnabled: true,
      featuredTitle: 'Destaques',
      featuredText: 'Conheça algumas das nossas criações mais especiais.',
      featuredEnabled: true,
      sections: [
        { id: 'hero', label: 'Banner Principal', enabled: true },
        { id: 'featured', label: 'Produtos em Destaque', enabled: true },
        { id: 'about-preview', label: 'Prévia Sobre', enabled: true },
        { id: 'contact-preview', label: 'Prévia Contato', enabled: true }
      ],
      aboutPreviewTitle: 'Sobre Rosinele Brunhara',
      aboutPreviewText: 'Cada peça é moldada com as próprias mãos, trazendo vida à argila através de técnicas tradicionais e muito carinho.',
      aboutPreviewImage: '',
      aboutPreviewBtnText: 'Saiba Mais',
      contactPreviewTitle: 'Entre em Contato',
      contactPreviewText: 'Tem alguma dúvida ou quer encomendar uma peça personalizada? Fale conosco!',
      contactPreviewBtnText: 'Fale Conosco',
      catalogEmptyMessage: 'Nosso catálogo está sendo preparado. Em breve você verá aqui nossas criações artesanais.',
      catalogEmptyTitle: 'Catálogo em breve',
      logo: '',
      logoSize: 120,
      showLogoInHero: true
    };
  },

  saveHomepage(data) {
    this._set('homepage', data);
  },

  // ===== PRODUCTS =====
  getProducts() {
    return this._get('products') || [];
  },

  saveProducts(products) {
    this._set('products', products);
  },

  addProduct(product) {
    const products = this.getProducts();
    product.id = this.generateId();
    product.createdAt = new Date().toISOString();
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(id, data) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
      this.saveProducts(products);
      return products[idx];
    }
    return null;
  },

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  duplicateProduct(id) {
    const product = this.getProducts().find(p => p.id === id);
    if (product) {
      const copy = { ...product };
      delete copy.id;
      delete copy.createdAt;
      delete copy.updatedAt;
      copy.name = copy.name + ' (Cópia)';
      return this.addProduct(copy);
    }
    return null;
  },

  getProduct(id) {
    return this.getProducts().find(p => p.id === id) || null;
  },

  // ===== CATEGORIES =====
  getCategories() {
    return this._get('categories') || [];
  },

  saveCategories(categories) {
    this._set('categories', categories);
  },

  addCategory(category) {
    const categories = this.getCategories();
    category.id = this.generateId();
    categories.push(category);
    this.saveCategories(categories);
    return category;
  },

  updateCategory(id, data) {
    const categories = this.getCategories();
    const idx = categories.findIndex(c => c.id === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...data };
      this.saveCategories(categories);
      return categories[idx];
    }
    return null;
  },

  deleteCategory(id) {
    const categories = this.getCategories().filter(c => c.id !== id);
    this.saveCategories(categories);
  },

  // ===== ABOUT PAGE =====
  getAbout() {
    return this._get('about') || {
      title: 'Sobre Rosinele Brunhara',
      text: 'Rosinele Brunhara é uma artesã ceramista apaixonada pelo que faz. Cada peça é criada com as próprias mãos, trazendo vida à argila através de técnicas tradicionais e muito carinho.\n\nO ateliê é um espaço de criação onde cada detalhe importa — da escolha da argila ao acabamento final. O objetivo é criar peças únicas que transmitam beleza, funcionalidade e afeto.\n\nAcredita que o artesanato tem o poder de transformar o cotidiano, trazendo calor e personalidade para cada ambiente.',
      image: '',
      images: [],
      mission: 'Levar beleza e afeto para o dia a dia através de cerâmicas artesanais únicas, feitas com amor e dedicação.',
      values: [
        'Artesanato com qualidade',
        'Peças únicas e exclusivas',
        'Atenção a cada detalhe',
        'Materiais selecionados',
        'Compromisso com a satisfação'
      ]
    };
  },

  saveAbout(data) {
    this._set('about', data);
  },

  // ===== CONTACT =====
  getContact() {
    return this._get('contact') || {
      title: 'Fale Conosco',
      text: 'Estamos prontos para atender você. Entre em contato por qualquer um dos canais abaixo.',
      whatsapp: '',
      whatsappMessage: 'Olá! Gostaria de saber mais sobre uma peça.',
      email: '',
      instagram: '',
      facebook: '',
      address: '',
      hours: ''
    };
  },

  saveContact(data) {
    this._set('contact', data);
  }
};

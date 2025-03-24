/**
 * AGIStar前端JavaScript
 */

// API基础路径
const API_BASE_URL = 'http://localhost:3000/api/v1';

// DOM元素
const loginBtn = document.querySelector('.btn-login');
const registerBtn = document.querySelector('.btn-primary');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const productModal = document.getElementById('product-modal');
const closeButtons = document.querySelectorAll('.close');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const productsGrid = document.querySelector('.all-products-grid');
const trendingProductsGrid = document.querySelector('.trending-products');
const categoriesGrid = document.querySelector('.categories-grid');
const searchBox = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');

// 状态
let currentPage = 1;
let selectedCategory = '';
let sortBy = 'rating';
let sortOrder = 'desc';
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user'));

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupEventListeners();
  createParticles();
});

/**
 * 初始化应用
 */
function initApp() {
  fetchTrendingProducts();
  fetchCategories();
  fetchProducts();
  updateAuthUI();
}

/**
 * 配置事件监听器
 */
function setupEventListeners() {
  // 认证相关
  loginBtn.addEventListener('click', () => openModal(loginModal));
  registerBtn.addEventListener('click', () => openModal(registerModal));
  closeButtons.forEach(btn => btn.addEventListener('click', closeModals));
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModals();
    openModal(registerModal);
  });
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeModals();
    openModal(loginModal);
  });
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  // 筛选相关
  categoryFilter.addEventListener('change', handleCategoryFilter);
  sortFilter.addEventListener('change', handleSortFilter);
  
  // 搜索相关
  searchBtn.addEventListener('click', handleSearch);
  searchBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  
  // 点击背景关闭模态框
  window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === registerModal || e.target === productModal) {
      closeModals();
    }
  });
}

/**
 * 创建背景粒子效果
 */
function createParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${Math.random() * 10 + 5}px`;
    particle.style.height = particle.style.width;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.backgroundColor = 'white';
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
    particle.style.transform = `translateY(${Math.random() * 100}px)`;
    
    particlesContainer.appendChild(particle);
  }
}

/**
 * 打开模态框
 * @param {HTMLElement} modal - 模态框元素
 */
function openModal(modal) {
  closeModals();
  modal.style.display = 'block';
}

/**
 * 关闭所有模态框
 */
function closeModals() {
  loginModal.style.display = 'none';
  registerModal.style.display = 'none';
  productModal.style.display = 'none';
}

/**
 * 处理登录表单提交
 * @param {Event} e - 事件对象
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      token = data.data.token;
      user = data.data.user;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      updateAuthUI();
      closeModals();
      showAlert('登录成功', 'success');
    } else {
      showAlert(data.message || '登录失败', 'error');
    }
  } catch (error) {
    console.error('登录错误:', error);
    showAlert('登录失败，请稍后再试', 'error');
  }
}

/**
 * 处理注册表单提交
 * @param {Event} e - 事件对象
 */
async function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('reg-username').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      closeModals();
      openModal(loginModal);
      showAlert('注册成功，请登录', 'success');
    } else {
      showAlert(data.message || '注册失败', 'error');
    }
  } catch (error) {
    console.error('注册错误:', error);
    showAlert('注册失败，请稍后再试', 'error');
  }
}

/**
 * 更新认证UI
 */
function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  
  if (token && user) {
    authButtons.innerHTML = `
      <span class="user-welcome">欢迎，${user.username}</span>
      <button class="btn btn-login logout-btn">退出</button>
    `;
    
    document.querySelector('.logout-btn').addEventListener('click', handleLogout);
  } else {
    authButtons.innerHTML = `
      <button class="btn btn-login">登录</button>
      <button class="btn btn-primary">注册</button>
    `;
    
    document.querySelector('.btn-login').addEventListener('click', () => openModal(loginModal));
    document.querySelector('.btn-primary').addEventListener('click', () => openModal(registerModal));
  }
}

/**
 * 处理登出
 */
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token = null;
  user = null;
  updateAuthUI();
  showAlert('已退出登录', 'success');
}

/**
 * 获取趋势产品
 */
async function fetchTrendingProducts() {
  trendingProductsGrid.innerHTML = '<div class="loading">正在加载...</div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/trending`);
    const data = await response.json();
    
    if (data.code === 200) {
      renderProducts(data.data, trendingProductsGrid);
    } else {
      trendingProductsGrid.innerHTML = '<div class="error">加载失败</div>';
    }
  } catch (error) {
    console.error('获取趋势产品错误:', error);
    trendingProductsGrid.innerHTML = '<div class="error">加载失败</div>';
  }
}

/**
 * 获取分类列表
 */
async function fetchCategories() {
  categoriesGrid.innerHTML = '<div class="loading">正在加载...</div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (data.code === 200) {
      renderCategories(data.data);
      populateCategoryFilter(data.data);
    } else {
      categoriesGrid.innerHTML = '<div class="error">加载失败</div>';
    }
  } catch (error) {
    console.error('获取分类错误:', error);
    categoriesGrid.innerHTML = '<div class="error">加载失败</div>';
  }
}

/**
 * 获取产品列表
 */
async function fetchProducts() {
  productsGrid.innerHTML = '<div class="loading">正在加载...</div>';
  
  try {
    let url = `${API_BASE_URL}/products?page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    
    if (selectedCategory) {
      url += `&category=${selectedCategory}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 200) {
      renderProducts(data.data.items, productsGrid);
      renderPagination(data.data.total);
    } else {
      productsGrid.innerHTML = '<div class="error">加载失败</div>';
    }
  } catch (error) {
    console.error('获取产品错误:', error);
    productsGrid.innerHTML = '<div class="error">加载失败</div>';
  }
}

/**
 * 获取产品详情
 * @param {number} id - 产品ID
 */
async function fetchProductDetails(id) {
  productModal.querySelector('.product-detail-content').innerHTML = '<div class="loading">正在加载...</div>';
  openModal(productModal);
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await response.json();
    
    if (data.code === 200) {
      renderProductDetails(data.data);
    } else {
      productModal.querySelector('.product-detail-content').innerHTML = '<div class="error">加载失败</div>';
    }
  } catch (error) {
    console.error('获取产品详情错误:', error);
    productModal.querySelector('.product-detail-content').innerHTML = '<div class="error">加载失败</div>';
  }
}

/**
 * 渲染产品列表
 * @param {Array} products - 产品数组
 * @param {HTMLElement} container - 容器元素
 */
function renderProducts(products, container) {
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="no-results">暂无产品</div>';
    return;
  }
  
  let html = '';
  
  products.forEach(product => {
    html += `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image" style="background-image: url('${product.imageUrl || 'images/placeholder.jpg'}')">
          <div class="product-category">${product.category}</div>
          <div class="product-rating">${parseFloat(product.rating).toFixed(1)}</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-link">
            <a href="${product.officialUrl}" target="_blank">官方网站</a>
            <a href="#" class="view-details">查看详情</a>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // 添加产品卡点击事件
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      fetchProductDetails(card.dataset.id);
    });
  });
  
  // 阻止官网链接点击冒泡
  container.querySelectorAll('.product-link a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

/**
 * 渲染分类列表
 * @param {Array} categories - 分类数组
 */
function renderCategories(categories) {
  if (!categories || categories.length === 0) {
    categoriesGrid.innerHTML = '<div class="no-results">暂无分类</div>';
    return;
  }
  
  const icons = ['fas fa-comments', 'fas fa-image', 'fas fa-code', 'fas fa-pencil-alt', 'fas fa-brain'];
  let html = '';
  
  categories.forEach((category, index) => {
    html += `
      <div class="category-card" data-id="${category.id}">
        <div class="category-icon">
          <i class="${icons[index % icons.length]}"></i>
        </div>
        <h3 class="category-name">${category.name}</h3>
        <p class="category-count">${category.productCount}个产品</p>
      </div>
    `;
  });
  
  categoriesGrid.innerHTML = html;
  
  // 添加分类卡点击事件
  categoriesGrid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedCategory = card.dataset.id;
      categoryFilter.value = selectedCategory;
      currentPage = 1;
      fetchProducts();
      
      // 滚动到产品列表
      document.getElementById('all-products').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/**
 * 填充分类筛选下拉列表
 * @param {Array} categories - 分类数组
 */
function populateCategoryFilter(categories) {
  if (!categories || categories.length === 0) {
    return;
  }
  
  let options = '<option value="">所有分类</option>';
  
  categories.forEach(category => {
    options += `<option value="${category.id}">${category.name}</option>`;
  });
  
  categoryFilter.innerHTML = options;
}

/**
 * 渲染产品详情
 * @param {Object} product - 产品对象
 */
function renderProductDetails(product) {
  const ratingDisplay = parseFloat(product.rating).toFixed(1);
  const featuresHtml = product.features ? product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('') : '';
  const pricingHtml = product.pricing ? `
    <div class="pricing-info">
      <div class="pricing-tag">${product.pricing.free ? '免费提供' : '付费使用'}</div>
      <div class="price-desc">${product.pricing.priceDescription || ''}</div>
    </div>
  ` : '';
  
  let ratingsHtml = '';
  if (product.latestRatings && product.latestRatings.length > 0) {
    product.latestRatings.forEach(rating => {
      ratingsHtml += `
        <div class="rating-item">
          <div class="rating-header">
            <div class="rating-user">
              <div class="user-avatar" style="background-image: url('${rating.user.avatarUrl || 'images/avatar.jpg'}')"></div>
              <div class="user-name">${rating.user.username}</div>
            </div>
            <div class="rating-score"><i class="fas fa-star"></i>${parseFloat(rating.score).toFixed(1)}</div>
          </div>
          <div class="rating-comment">${rating.comment || '暂无评价内容'}</div>
          <div class="rating-date">${new Date(rating.createTime).toLocaleDateString()}</div>
        </div>
      `;
    });
  } else {
    ratingsHtml = '<div class="no-ratings">暂无评价</div>';
  }
  
  const detailHtml = `
    <div class="product-detail-header">
      <div class="product-detail-image" style="background-image: url('${product.imageUrl || 'images/placeholder.jpg'}')"></div>
      <div class="product-detail-info">
        <h2 class="product-detail-name">${product.name}</h2>
        <div class="product-detail-category">${product.category}</div>
        <p class="product-detail-description">${product.description}</p>
        <div class="product-detail-meta">
          <div class="meta-item">
            <i class="fas fa-star"></i>
            <span>${ratingDisplay}分</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span>添加于：${new Date(product.createTime).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="product-detail-features">
      <h3>功能特点</h3>
      <div class="features-list">
        ${featuresHtml}
      </div>
    </div>
    
    <div class="product-detail-pricing">
      <h3>价格信息</h3>
      ${pricingHtml}
    </div>
    
    <div class="product-detail-cta">
      <a href="${product.officialUrl}" target="_blank" class="btn btn-primary">访问官网</a>
      ${token ? `<button class="btn btn-login add-rating-btn" data-id="${product.id}">添加评分</button>` : ''}
    </div>
    
    <div class="product-detail-ratings">
      <h3>用户评价</h3>
      ${ratingsHtml}
    </div>
  `;
  
  productModal.querySelector('.product-detail-content').innerHTML = detailHtml;
  
  // 添加评分按钮点击事件
  const addRatingBtn = productModal.querySelector('.add-rating-btn');
  if (addRatingBtn) {
    addRatingBtn.addEventListener('click', () => {
      showRatingForm(product.id);
    });
  }
}

/**
 * 显示评分表单
 * @param {number} productId - 产品ID
 */
function showRatingForm(productId) {
  const ratingFormHtml = `
    <div class="rating-form">
      <h3>添加您的评分</h3>
      <form id="rating-form">
        <div class="form-group">
          <label>评分 (0-10)</label>
          <input type="number" id="rating-score" min="0" max="10" step="0.1" required>
        </div>
        <div class="form-group">
          <label>评价内容</label>
          <textarea id="rating-comment" rows="4"></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">提交评分</button>
      </form>
    </div>
  `;
  
  productModal.querySelector('.product-detail-cta').insertAdjacentHTML('afterend', ratingFormHtml);
  
  document.getElementById('rating-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitRating(productId);
  });
}

/**
 * 提交评分
 * @param {number} productId - 产品ID
 */
async function submitRating(productId) {
  const score = document.getElementById('rating-score').value;
  const comment = document.getElementById('rating-comment').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score, comment })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      showAlert('评分提交成功', 'success');
      fetchProductDetails(productId);
    } else {
      showAlert(data.message || '评分提交失败', 'error');
    }
  } catch (error) {
    console.error('提交评分错误:', error);
    showAlert('评分提交失败，请稍后再试', 'error');
  }
}

/**
 * 渲染分页
 * @param {number} total - 总产品数量
 */
function renderPagination(total) {
  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 1) {
    document.querySelector('.pagination').innerHTML = '';
    return;
  }
  
  let paginationHtml = '';
  
  // 上一页按钮
  paginationHtml += `
    <button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      <i class="fas fa-chevron-left"></i>
    </button>
  `;
  
  // 页码按钮
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `
      <button ${i === currentPage ? 'class="active"' : ''} data-page="${i}">${i}</button>
    `;
  }
  
  // 下一页按钮
  paginationHtml += `
    <button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      <i class="fas fa-chevron-right"></i>
    </button>
  `;
  
  document.querySelector('.pagination').innerHTML = paginationHtml;
  
  // 添加页码按钮点击事件
  document.querySelector('.pagination').querySelectorAll('button:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      fetchProducts();
      window.scrollTo({ top: document.getElementById('all-products').offsetTop, behavior: 'smooth' });
    });
  });
}

/**
 * 处理分类筛选
 */
function handleCategoryFilter() {
  selectedCategory = categoryFilter.value;
  currentPage = 1;
  fetchProducts();
}

/**
 * 处理排序筛选
 */
function handleSortFilter() {
  const value = sortFilter.value;
  
  if (value === 'rating') {
    sortBy = 'rating';
    sortOrder = 'desc';
  } else if (value === 'createTime') {
    sortBy = 'createTime';
    sortOrder = 'desc';
  }
  
  currentPage = 1;
  fetchProducts();
}

/**
 * 处理搜索
 */
function handleSearch() {
  const query = searchBox.value.trim();
  
  if (!query) return;
  
  // TODO: 实现搜索功能
  alert(`搜索功能待实现: ${query}`);
}

/**
 * 显示提示信息
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 ('success' 或 'error')
 */
function showAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `alert ${type}`;
  alertBox.textContent = message;
  
  document.body.appendChild(alertBox);
  
  setTimeout(() => {
    alertBox.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(alertBox);
    }, 300);
  }, 3000);
}

// 添加 CSS 样式
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0); }
  }
  
  .alert {
    position: fixed;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    transition: top 0.3s ease;
  }
  
  .alert.show {
    top: 20px;
  }
  
  .alert.success {
    background-color: #10b981;
  }
  
  .alert.error {
    background-color: #ef4444;
  }
  
  .user-welcome {
    font-weight: 500;
    margin-right: 1rem;
  }
  
  .rating-form {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: #f8fafc;
    border-radius: 8px;
  }
  
  .rating-form h3 {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }
  
  .rating-form textarea {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    resize: vertical;
  }
  
  .no-results, .error {
    text-align: center;
    padding: 2rem;
    color: var(--gray-color);
    grid-column: 1 / -1;
  }
`;

document.head.appendChild(style); 
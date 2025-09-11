// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [
    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        stock: 150,
        category: 'frutas',
        description: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.',
        image: 'images/productos_frescos_1.jpg',
        unit: 'kilo'
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        stock: 200,
        category: 'frutas',
        description: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes.',
        image: 'images/productos_frescos_1.jpg',
        unit: 'kilo'
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        stock: 250,
        category: 'frutas',
        description: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.',
        image: 'images/productos_frescos_1.jpg',
        unit: 'kilo'
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        stock: 100,
        category: 'verduras',
        description: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins.',
        image: 'images/productos_frescos_2.jpg',
        unit: 'kilo'
    },
    {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 700,
        stock: 80,
        category: 'verduras',
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.',
        image: 'images/productos_frescos_2.jpg',
        unit: 'bolsa de 500g'
    },
    {
        id: 'VR003',
        name: 'Pimientos Tricolores',
        price: 1500,
        stock: 120,
        category: 'verduras',
        description: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.',
        image: 'images/productos_frescos_2.jpg',
        unit: 'kilo'
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        stock: 50,
        category: 'organicos',
        description: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes.',
        image: 'images/campos_agricolas_1.jpg',
        unit: 'frasco de 500g'
    },
    {
        id: 'PO003',
        name: 'Quinua Orgánica',
        price: 3500,
        stock: 75,
        category: 'organicos',
        description: 'Quinua orgánica de alta calidad, rica en proteínas y minerales.',
        image: 'images/campos_agricolas_1.jpg',
        unit: 'kilo'
    },
    {
        id: 'PL001',
        name: 'Leche Entera',
        price: 1800,
        stock: 60,
        category: 'lacteos',
        description: 'Leche entera fresca de granjas locales, rica en calcio y nutrientes esenciales.',
        image: 'images/productores_locales_1.jpg',
        unit: 'litro'
    }
];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeNavigation();
    initializeAnimations();
    
    // Inicializar funcionalidades específicas según la página
    if (window.location.pathname.includes('productos.html')) {
        initializeProductsPage();
    } else if (window.location.pathname.includes('carrito.html')) {
        initializeCartPage();
    } else if (window.location.pathname.includes('contacto.html')) {
        initializeContactPage();
    }
});

// Navegación móvil
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Animaciones de scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos que deben animarse
    document.querySelectorAll('.feature-card, .category-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Funciones del carrito
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }

    if (product.stock < quantity) {
        showNotification('Stock insuficiente', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity + quantity <= product.stock) {
            existingItem.quantity += quantity;
        } else {
            showNotification('No hay suficiente stock disponible', 'error');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            unit: product.unit
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} agregado al carrito`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (window.location.pathname.includes('carrito.html')) {
        renderCartItems();
    }
}

function updateCartQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (!product || !cartItem) return;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.stock) {
        showNotification('Stock insuficiente', 'error');
        return;
    }
    
    cartItem.quantity = newQuantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (window.location.pathname.includes('carrito.html')) {
        renderCartItems();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Filtrar productos por categoría
function filterProducts(category) {
    // Redirigir a la página de productos con el filtro
    window.location.href = `productos.html?categoria=${category}`;
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification-success { background-color: #2E8B57; }
            .notification-error { background-color: #dc3545; }
            .notification-info { background-color: #17a2b8; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Validación de formularios
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const errorElement = input.parentElement.querySelector('.error-message');
        
        // Remover mensajes de error previos
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validar campo
        if (!input.value.trim()) {
            showFieldError(input, 'Este campo es obligatorio');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showFieldError(input, 'Ingrese un email válido');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showFieldError(input, 'Ingrese un teléfono válido');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    input.parentElement.appendChild(errorElement);
    input.style.borderColor = '#dc3545';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Funciones específicas para la página de productos
function initializeProductsPage() {
    renderProducts();
    initializeFilters();
    initializeSearch();
}

function renderProducts(productsToRender = products) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No se encontraron productos.</p>';
        return;
    }
    
    productsContainer.innerHTML = productsToRender.map(product => `
        <article class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="showProductDetails('${product.id}')">
                        Ver Detalles
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toLocaleString()} CLP por ${product.unit}</div>
                <div class="product-stock">Stock: ${product.stock} ${product.unit}s</div>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button onclick="changeQuantity('${product.id}', -1)">-</button>
                        <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.stock}">
                        <button onclick="changeQuantity('${product.id}', 1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addProductToCart('${product.id}')">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value;
            const filteredProducts = selectedCategory === 'all' 
                ? products 
                : products.filter(product => product.category === selectedCategory);
            renderProducts(filteredProducts);
        });
    }
    
    // Aplicar filtro desde URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('categoria');
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
        const filteredProducts = products.filter(product => product.category === categoryParam);
        renderProducts(filteredProducts);
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }
}

function changeQuantity(productId, change) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (qtyInput) {
        const currentQty = parseInt(qtyInput.value);
        const newQty = Math.max(1, currentQty + change);
        const product = products.find(p => p.id === productId);
        
        if (product && newQty <= product.stock) {
            qtyInput.value = newQty;
        }
    }
}

function addProductToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
    addToCart(productId, quantity);
}

// Funciones específicas para la página del carrito
function initializeCartPage() {
    renderCartItems();
}

function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos productos frescos para comenzar!</p>
                <a href="productos.html" class="cta-button">Ver Productos</a>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '$0 CLP';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toLocaleString()} CLP por ${item.unit}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toLocaleString()} CLP
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
                Eliminar
            </button>
        </div>
    `).join('');
    
    if (cartTotal) {
        cartTotal.textContent = `$${getCartTotal().toLocaleString()} CLP`;
    }
}

// Funciones específicas para la página de contacto
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simular envío del formulario
                showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
                this.reset();
            }
        });
    }
}

// Función para mostrar detalles del producto (modal)
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Crear modal si no existe
    let modal = document.getElementById('product-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'product-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Agregar estilos del modal
        if (!document.getElementById('modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 10000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    background-color: white;
                    margin: 5% auto;
                    padding: 2rem;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 600px;
                    position: relative;
                    animation: modalSlideIn 0.3s ease;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    color: #999;
                }
                .modal-close:hover {
                    color: #333;
                }
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 300px; border-radius: 10px; margin-bottom: 1rem;">
                <h2>${product.name}</h2>
                <p class="product-price">$${product.price.toLocaleString()} CLP por ${product.unit}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-stock">Stock disponible: ${product.stock} ${product.unit}s</p>
                <div class="modal-actions" style="margin-top: 2rem;">
                    <div class="quantity-selector" style="margin-bottom: 1rem;">
                        <button onclick="changeModalQuantity(-1)">-</button>
                        <input type="number" id="modal-qty" value="1" min="1" max="${product.stock}">
                        <button onclick="changeModalQuantity(1)">+</button>
                    </div>
                    <button class="cta-button" onclick="addModalProductToCart('${product.id}')">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Cerrar modal al hacer clic fuera
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function changeModalQuantity(change) {
    const qtyInput = document.getElementById('modal-qty');
    if (qtyInput) {
        const currentQty = parseInt(qtyInput.value);
        const newQty = Math.max(1, currentQty + change);
        const maxQty = parseInt(qtyInput.max);
        
        if (newQty <= maxQty) {
            qtyInput.value = newQty;
        }
    }
}

function addModalProductToCart(productId) {
    const qtyInput = document.getElementById('modal-qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
    addToCart(productId, quantity);
    closeModal();
}


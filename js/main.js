// Configuración de modo oscuro
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Variables globales
let cart = [];
let currentUser = null;
let currentPage = 'home';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadRegions();
    loadProducts();
    loadCart();
    showPage('home');
});

// Funciones de navegación
function showPage(page) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Mostrar la página solicitada
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.remove('hidden');
        currentPage = page;
        
        // Cargar contenido específico de la página
        if (page === 'products') {
            loadAllProducts();
        } else if (page === 'admin') {
            showAdminSection('dashboard');
        } else if (page === 'about') {
            // Inicializar el mapa si es necesario
            setTimeout(() => {
                if (window.google && window.google.maps && !document.querySelector('#map > div')) {
                    initMap();
                }
            }, 100);
        }
    }
}

// Función para inicializar Google Maps
function initMap() {
    // Coordenadas del centro de Chile
    const chile = { lat: -35.6751, lng: -71.5430 };
    
    // Crear el mapa
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: chile,
        styles: [
            {
                featureType: "all",
                stylers: [{ saturation: -30 }]
            }
        ]
    });

    // Crear marcadores para cada ubicación
    storeLocations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#2E8B57">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            }
        });

        // Info window para cada marcador
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Montserrat', sans-serif;">
                    <h3 style="margin: 0 0 5px 0; color: #2E8B57;">${location.name}</h3>
                    <p style="margin: 0; color: #666;">${location.address}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
}

// Hacer la función global para Google Maps
window.initMap = initMap;

// Funciones de productos
function loadProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (featuredContainer) {
        featuredContainer.innerHTML = '';
        
        // Mostrar los primeros 6 productos en la página de inicio
        products.slice(0, 6).forEach(product => {
            const productCard = createProductCard(product);
            featuredContainer.appendChild(productCard);
        });
    }
}

function loadAllProducts() {
    const allProductsContainer = document.getElementById('allProducts');
    if (allProductsContainer) {
        allProductsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            allProductsContainer.appendChild(productCard);
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image">
            <i class="fas ${product.icon}"></i>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toLocaleString()}</p>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${product.description.substring(0, 80)}...</p>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary" onclick="showProductDetail('${product.id}')">Ver Detalle</button>
                <button class="btn btn-secondary" onclick="addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const title = document.getElementById('productModalTitle');
    const content = document.getElementById('productModalContent');

    title.textContent = product.name;
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem; color: var(--primary-green);">
                <i class="fas ${product.icon}"></i>
            </div>
        </div>
        <p><strong>Precio:</strong> $${product.price.toLocaleString()} por kilo</p>
        <p><strong>Stock disponible:</strong> ${product.stock} kilos</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <div style="margin-top: 2rem;">
            <label for="quantity">Cantidad (kg):</label>
            <input type="number" id="quantity" min="1" max="${product.stock}" value="1" class="form-control" style="margin: 0.5rem 0;">
            <button class="btn btn-primary" onclick="addToCartWithQuantity('${product.id}')" style="width: 100%;">
                Agregar al Carrito
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Funciones del carrito
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            icon: product.icon
        });
    }

    updateCartDisplay();
    saveCart();
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito');
}

function addToCartWithQuantity(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(productId, quantity);
    closeProductModal();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCart();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <i class="fas ${item.icon}" style="margin-right: 0.5rem; color: var(--primary-green);"></i>
                    <strong>${item.name}</strong>
                    <br>
                    <small>$${item.price.toLocaleString()} c/u</small>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateCartQuantity('${item.id}', this.value)"
                           style="width: 60px; padding: 0.25rem; border: 1px solid #ddd; border-radius: 4px;">
                    <span style="font-weight: 600;">$${itemTotal.toLocaleString()}</span>
                    <button onclick="removeFromCart('${item.id}')" 
                            style="background: none; border: none; color: #dc3545; cursor: pointer;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    cartTotal.innerHTML = `Total: $${total.toLocaleString()}`;
    modal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        showAlert('Tu carrito está vacío');
        return;
    }

    showAlert('¡Compra realizada con éxito! Gracias por tu compra.');
    cart = [];
    updateCartDisplay();
    saveCart();
    closeCart();
}

function saveCart() {
    try {
        localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
    } catch (e) {
        console.log('LocalStorage no disponible');
    }
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem('huertohogar_cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    } catch (e) {
        console.log('Error cargando carrito');
    }
}

// Funciones de validación
function validateRUN(run) {
    // Eliminar puntos y guiones
    const cleanRUN = run.replace(/[.-]/g, '');
    
    // Verificar longitud
    if (cleanRUN.length < 7 || cleanRUN.length > 9) {
        return false;
    }

    // Verificar formato básico
    const runRegex = /^[0-9]+[0-9kK]$/;
    return runRegex.test(cleanRUN);
}

function validateEmail(email) {
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return allowedDomains.some(domain => email.endsWith(domain));
}

function validatePassword(password) {
    return password.length >= 4 && password.length <= 10;
}

// Funciones de formularios
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    let hasError = false;

    // Validar email
    if (!email) {
        showFieldError('loginEmailError', 'El correo es requerido');
        hasError = true;
    } else if (email.length > 100) {
        showFieldError('loginEmailError', 'El correo no puede exceder 100 caracteres');
        hasError = true;
    } else if (!validateEmail(email)) {
        showFieldError('loginEmailError', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        hasError = true;
    } else {
        hideFieldError('loginEmailError');
    }

    // Validar contraseña
    if (!password) {
        showFieldError('loginPasswordError', 'La contraseña es requerida');
        hasError = true;
    } else if (!validatePassword(password)) {
        showFieldError('loginPasswordError', 'La contraseña debe tener entre 4 y 10 caracteres');
        hasError = true;
    } else {
        hideFieldError('loginPasswordError');
    }

    if (!hasError) {
        // Simular login exitoso
        if (email === 'admin@duoc.cl' && password === 'admin') {
            currentUser = { email: email, role: 'admin' };
            showPage('admin');
            showNotification('Login exitoso como administrador');
        } else {
            currentUser = { email: email, role: 'client' };
            showPage('home');
            showNotification('Login exitoso');
        }
        
        // Actualizar navegación
        updateNavigation();
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        run: document.getElementById('registerRun').value,
        name: document.getElementById('registerName').value,
        lastname: document.getElementById('registerLastname').value,
        email: document.getElementById('registerEmail').value,
        birthdate: document.getElementById('registerBirthdate').value,
        region: document.getElementById('registerRegion').value,
        comuna: document.getElementById('registerComuna').value,
        address: document.getElementById('registerAddress').value
    };

    let hasError = false;

    // Validar RUN
    if (!formData.run) {
        showFieldError('registerRunError', 'El RUN es requerido');
        hasError = true;
    } else if (!validateRUN(formData.run)) {
        showFieldError('registerRunError', 'RUN inválido. Formato: 19011022K');
        hasError = true;
    } else {
        hideFieldError('registerRunError');
    }

    // Validar nombre
    if (!formData.name) {
        showFieldError('registerNameError', 'El nombre es requerido');
        hasError = true;
    } else if (formData.name.length > 50) {
        showFieldError('registerNameError', 'El nombre no puede exceder 50 caracteres');
        hasError = true;
    } else {
        hideFieldError('registerNameError');
    }

    // Validar apellidos
    if (!formData.lastname) {
        showFieldError('registerLastnameError', 'Los apellidos son requeridos');
        hasError = true;
    } else if (formData.lastname.length > 100) {
        showFieldError('registerLastnameError', 'Los apellidos no pueden exceder 100 caracteres');
        hasError = true;
    } else {
        hideFieldError('registerLastnameError');
    }

    // Validar email
    if (!formData.email) {
        showFieldError('registerEmailError', 'El correo es requerido');
        hasError = true;
    } else if (formData.email.length > 100) {
        showFieldError('registerEmailError', 'El correo no puede exceder 100 caracteres');
        hasError = true;
    } else if (!validateEmail(formData.email)) {
        showFieldError('registerEmailError', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        hasError = true;
    } else {
        hideFieldError('registerEmailError');
    }

    // Validar dirección
    if (!formData.address) {
        showFieldError('registerAddressError', 'La dirección es requerida');
        hasError = true;
    } else if (formData.address.length > 300) {
        showFieldError('registerAddressError', 'La dirección no puede exceder 300 caracteres');
        hasError = true;
    } else {
        hideFieldError('registerAddressError');
    }

    if (!hasError) {
        showNotification('Registro exitoso. Ya puedes iniciar sesión.');
        showPage('login');
    }
}

function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const comment = document.getElementById('contactComment').value;
    
    let hasError = false;

    // Validar nombre
    if (!name) {
        showFieldError('contactNameError', 'El nombre es requerido');
        hasError = true;
    } else if (name.length > 100) {
        showFieldError('contactNameError', 'El nombre no puede exceder 100 caracteres');
        hasError = true;
    } else {
        hideFieldError('contactNameError');
    }

    // Validar email
    if (email && email.length > 100) {
        showFieldError('contactEmailError', 'El correo no puede exceder 100 caracteres');
        hasError = true;
    } else if (email && !validateEmail(email)) {
        showFieldError('contactEmailError', 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com');
        hasError = true;
    } else {
        hideFieldError('contactEmailError');
    }

    // Validar comentario
    if (!comment) {
        showFieldError('contactCommentError', 'El comentario es requerido');
        hasError = true;
    } else if (comment.length > 500) {
        showFieldError('contactCommentError', 'El comentario no puede exceder 500 caracteres');
        hasError = true;
    } else {
        hideFieldError('contactCommentError');
    }

    if (!hasError) {
        showNotification('Mensaje enviado exitosamente. Te contactaremos pronto.');
        document.getElementById('contactForm').reset();
    }
}

// Funciones auxiliares de validación
function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function hideFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Funciones de regiones y comunas
function loadRegions() {
    const regionSelect = document.getElementById('registerRegion');
    if (regionSelect) {
        Object.keys(regionesYComunas).forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    }
}

function updateComunas() {
    const regionSelect = document.getElementById('registerRegion');
    const comunaSelect = document.getElementById('registerComuna');
    
    if (!regionSelect || !comunaSelect) return;
    
    const selectedRegion = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
    
    if (selectedRegion && regionesYComunas[selectedRegion]) {
        regionesYComunas[selectedRegion].forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

// Funciones del panel de administración
function showAdminSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('#adminPage .admin-content > div').forEach(div => {
        div.classList.add('hidden');
    });

    // Actualizar menú activo
    document.querySelectorAll('.admin-menu a').forEach(a => a.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Mostrar sección seleccionada
    const sectionElement = document.getElementById('admin' + section.charAt(0).toUpperCase() + section.slice(1));
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
        
        if (section === 'products') {
            loadAdminProducts();
        } else if (section === 'users') {
            loadAdminUsers();
        }
    }
}

function loadAdminProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-info btn-sm" onclick="editProduct('${product.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadAdminUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    sampleUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.run}</td>
            <td>${user.name} ${user.lastname}</td>
            <td>${user.email}</td>
            <td>${user.type}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-info btn-sm" onclick="editUser('${user.run}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.run}')">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Funciones auxiliares
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function showAlert(message) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3>Información</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <p style="margin: 1rem 0;">${message}</p>
            <button class="btn btn-primary" onclick="this.closest('.modal').remove()" style="width: 100%;">
                Aceptar
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function showConfirmDialog(message, callback) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3>Confirmar</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <p style="margin: 1rem 0;">${message}</p>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()" style="flex: 1;">
                    Cancelar
                </button>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove(); (${callback.toString()})()" style="flex: 1;">
                    Confirmar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateNavigation() {
    const navActions = document.querySelector('.nav-actions');
    if (currentUser) {
        navActions.innerHTML = `
            <div class="cart-icon" onclick="showCart()">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count" id="cartCount">${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <span style="color: var(--text-primary);">Hola, ${currentUser.email}</span>
            ${currentUser.role === 'admin' ? '<button class="btn btn-info" onclick="showPage(\'admin\')">Admin</button>' : ''}
            <button class="btn btn-secondary" onclick="logout()">Cerrar Sesión</button>
        `;
    }
}

function logout() {
    currentUser = null;
    showPage('home');
    location.reload(); // Recargar para resetear la navegación
}

// Funciones específicas del admin (placeholders)
function showProductForm() {
    showAlert('Función de formulario de producto en desarrollo');
}

function showUserForm() {
    showAlert('Función de formulario de usuario en desarrollo');
}

function editProduct(id) {
    showAlert(`Editar producto ${id} - En desarrollo`);
}

function deleteProduct(id) {
    showConfirmDialog(`¿Está seguro de eliminar el producto ${id}?`, () => {
        showNotification('Producto eliminado');
    });
}

function editUser(run) {
    showAlert(`Editar usuario ${run} - En desarrollo`);
}

function deleteUser(run) {
    showConfirmDialog(`¿Está seguro de eliminar el usuario ${run}?`, () => {
        showNotification('Usuario eliminado');
    });
}

function showBlogDetail(id) {
    const article = blogArticles.find(a => a.id === id);
    if (article) {
        showAlert(`${article.title}: ${article.content.substring(0, 200)}...`);
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
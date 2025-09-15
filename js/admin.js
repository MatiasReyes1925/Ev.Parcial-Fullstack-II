// Sistema de administración para HuertoHogar
class AdminSystem {
    constructor() {
        this.products = this.loadProducts();
        this.orders = this.loadOrders();
        this.users = this.loadUsers();
        this.currentTab = 'dashboard';
        this.init();
    }

    init() {
        // Verificar permisos de admin
        if (!window.authSystem || !window.authSystem.requireAdmin()) {
            return;
        }

        // Actualizar nombre del admin
        const adminNameElement = document.getElementById('admin-name');
        if (adminNameElement && window.authSystem.currentUser) {
            adminNameElement.textContent = `${window.authSystem.currentUser.firstName} ${window.authSystem.currentUser.lastName}`;
        }

        // Event listeners para tabs
        this.initTabs();
        
        // Event listeners para modales
        this.initModals();
        
        // Cargar contenido inicial
        this.loadDashboard();
        this.loadProducts();
        this.loadOrders();
        this.loadUsers();
    }

    // Inicializar tabs
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    // Cambiar tab
    switchTab(tabId) {
        // Actualizar botones
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;
    }

    // Cargar productos desde localStorage o crear productos por defecto
    loadProducts() {
        const savedProducts = localStorage.getItem('huertohogar_products');
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            // Productos por defecto
            this.products = [
                {
                    id: 1,
                    name: 'Manzanas Fuji',
                    category: 'frutas',
                    price: 2500,
                    stock: 50,
                    description: 'Manzanas frescas y crujientes, perfectas para toda la familia.',
                    image: 'images/manzanaFuji.JPG',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Naranjas Valencia',
                    category: 'frutas',
                    price: 2000,
                    stock: 30,
                    description: 'Naranjas jugosas y dulces, ricas en vitamina C.',
                    image: 'images/naranjas.JPG',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Plátanos Cavendish',
                    category: 'frutas',
                    price: 1800,
                    stock: 40,
                    description: 'Plátanos maduros y nutritivos, ideales para el desayuno.',
                    image: 'images/platanos.JPG',
                    status: 'active'
                },
                {
                    id: 4,
                    name: 'Zanahorias Orgánicas',
                    category: 'verduras',
                    price: 1500,
                    stock: 25,
                    description: 'Zanahorias orgánicas cultivadas sin pesticidas.',
                    image: 'images/zanahorias.JPG',
                    status: 'active'
                },
                {
                    id: 5,
                    name: 'Espinacas Frescas',
                    category: 'verduras',
                    price: 1200,
                    stock: 20,
                    description: 'Espinacas frescas y nutritivas, ricas en hierro.',
                    image: 'images/espinacas.JPG',
                    status: 'active'
                },
                {
                    id: 6,
                    name: 'Pimientos Tricolores',
                    category: 'verduras',
                    price: 3000,
                    stock: 15,
                    description: 'Pimientos rojos, amarillos y verdes, perfectos para ensaladas.',
                    image: 'images/pimenton.JPG',
                    status: 'active'
                },
                {
                    id: 7,
                    name: 'Miel Orgánica',
                    category: 'organicos',
                    price: 8000,
                    stock: 12,
                    description: 'Miel pura y orgánica, directamente de colmenas locales.',
                    image: 'images/miel.JPG',
                    status: 'active'
                },
                {
                    id: 8,
                    name: 'Quinua Orgánica',
                    category: 'organicos',
                    price: 5500,
                    stock: 18,
                    description: 'Quinua orgánica, superalimento rico en proteínas.',
                    image: 'images/quinua.jpg',
                    status: 'active'
                },
                {
                    id: 9,
                    name: 'Leche Entera',
                    category: 'lacteos',
                    price: 1000,
                    stock: 35,
                    description: 'Leche fresca y pasteurizada de granjas locales.',
                    image: 'images/leche.jpg',
                    status: 'active'
                }
            ];
            this.saveProducts();
        }
        this.renderProducts();
    }

    // Guardar productos
    saveProducts() {
        localStorage.setItem('huertohogar_products', JSON.stringify(this.products));
    }

    // Renderizar tabla de productos
    renderProducts() {
        const tbody = document.getElementById('products-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="product-image"></td>
                <td>${product.name}</td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>$${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td><span class="status-badge status-${product.status}">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-edit" onclick="adminSystem.editProduct(${product.id})">Editar</button>
                    <button class="btn-danger" onclick="adminSystem.deleteProduct(${product.id})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    // Obtener nombre de categoría
    getCategoryName(category) {
        const categories = {
            'frutas': 'Frutas Frescas',
            'verduras': 'Verduras Orgánicas',
            'organicos': 'Productos Orgánicos',
            'lacteos': 'Productos Lácteos'
        };
        return categories[category] || category;
    }

    // Cargar pedidos simulados
    loadOrders() {
        const savedOrders = localStorage.getItem('huertohogar_orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        } else {
            // Pedidos simulados
            this.orders = [
                {
                    id: 1001,
                    customer: 'María González',
                    date: '2024-09-13',
                    total: 15500,
                    status: 'pending',
                    items: [
                        { productId: 1, quantity: 2, price: 2500 },
                        { productId: 4, quantity: 3, price: 1500 }
                    ]
                },
                {
                    id: 1002,
                    customer: 'Carlos Rodríguez',
                    date: '2024-09-12',
                    total: 12000,
                    status: 'processing',
                    items: [
                        { productId: 2, quantity: 4, price: 2000 },
                        { productId: 5, quantity: 2, price: 1200 }
                    ]
                },
                {
                    id: 1003,
                    customer: 'Ana Martínez',
                    date: '2024-09-11',
                    total: 8000,
                    status: 'delivered',
                    items: [
                        { productId: 7, quantity: 1, price: 8000 }
                    ]
                }
            ];
            this.saveOrders();
        }
        this.renderOrders();
    }

    // Guardar pedidos
    saveOrders() {
        localStorage.setItem('huertohogar_orders', JSON.stringify(this.orders));
    }

    // Renderizar tabla de pedidos
    renderOrders() {
        const tbody = document.getElementById('orders-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${new Date(order.date).toLocaleDateString('es-CL')}</td>
                <td>$${order.total.toLocaleString()}</td>
                <td><span class="status-badge status-${order.status}">${this.getOrderStatusName(order.status)}</span></td>
                <td>
                    <button class="btn-edit" onclick="adminSystem.viewOrder(${order.id})">Ver</button>
                    <button class="btn-primary" onclick="adminSystem.updateOrderStatus(${order.id})">Actualizar</button>
                </td>
            </tr>
        `).join('');
    }

    // Obtener nombre del estado del pedido
    getOrderStatusName(status) {
        const statuses = {
            'pending': 'Pendiente',
            'processing': 'En Proceso',
            'shipped': 'Enviado',
            'delivered': 'Entregado'
        };
        return statuses[status] || status;
    }

    // Cargar usuarios
    loadUsers() {
        if (window.authSystem) {
            this.users = window.authSystem.getAllUsers();
        }
        this.renderUsers();
    }

    // Renderizar tabla de usuarios
    renderUsers() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${new Date(user.registrationDate).toLocaleDateString('es-CL')}</td>
                <td><span class="status-badge status-${user.type === 'admin' ? 'processing' : 'active'}">${user.type === 'admin' ? 'Admin' : 'Cliente'}</span></td>
                <td>
                    <button class="btn-edit" onclick="adminSystem.viewUser(${user.id})">Ver</button>
                    ${user.type !== 'admin' ? `<button class="btn-danger" onclick="adminSystem.deleteUser(${user.id})">Eliminar</button>` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Cargar dashboard
    loadDashboard() {
        // Actualizar estadísticas
        this.updateStats();
    }

    // Actualizar estadísticas del dashboard
    updateStats() {
        // Calcular estadísticas
        const totalSales = this.orders.reduce((sum, order) => sum + order.total, 0);
        const totalProducts = this.products.length;
        const totalUsers = this.users.filter(u => u.type === 'customer').length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;

        // Actualizar elementos del DOM si existen
        const salesElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const productsElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        const usersElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
        const ordersElement = document.querySelector('.stat-card:nth-child(4) .stat-number');

        if (salesElement) salesElement.textContent = `$${totalSales.toLocaleString()}`;
        if (productsElement) productsElement.textContent = totalProducts;
        if (usersElement) usersElement.textContent = totalUsers;
        if (ordersElement) ordersElement.textContent = pendingOrders;
    }

    // Inicializar modales
    initModals() {
        const modal = document.getElementById('product-modal');
        const addBtn = document.getElementById('add-product-btn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-btn');
        const form = document.getElementById('product-form');

        if (addBtn) {
            addBtn.addEventListener('click', () => this.showProductModal());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideProductModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideProductModal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Cerrar modal al hacer clic fuera
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideProductModal();
                }
            });
        }
    }

    // Mostrar modal de producto
    showProductModal(product = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('product-form');

        if (product) {
            title.textContent = 'Editar Producto';
            this.fillProductForm(product);
            form.dataset.productId = product.id;
        } else {
            title.textContent = 'Agregar Producto';
            form.reset();
            delete form.dataset.productId;
        }

        modal.style.display = 'block';
    }

    // Ocultar modal de producto
    hideProductModal() {
        const modal = document.getElementById('product-modal');
        modal.style.display = 'none';
    }

    // Llenar formulario con datos del producto
    fillProductForm(product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
    }

    // Manejar envío del formulario de producto
    handleProductSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const productId = form.dataset.productId;

        const productData = {
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            price: parseInt(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value || 'images/default-product.jpg',
            status: 'active'
        };

        if (productId) {
            // Editar producto existente
            const index = this.products.findIndex(p => p.id == productId);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...productData };
            }
        } else {
            // Agregar nuevo producto
            const newId = Math.max(...this.products.map(p => p.id)) + 1;
            this.products.push({ id: newId, ...productData });
        }

        this.saveProducts();
        this.renderProducts();
        this.hideProductModal();
        this.updateStats();
    }

    // Editar producto
    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.showProductModal(product);
        }
    }

    // Eliminar producto
    deleteProduct(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderProducts();
            this.updateStats();
        }
    }

    // Ver pedido
    viewOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            alert(`Pedido #${order.id}\nCliente: ${order.customer}\nTotal: $${order.total.toLocaleString()}\nEstado: ${this.getOrderStatusName(order.status)}`);
        }
    }

    // Actualizar estado del pedido
    updateOrderStatus(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            const statuses = ['pending', 'processing', 'shipped', 'delivered'];
            const currentIndex = statuses.indexOf(order.status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            
            order.status = statuses[nextIndex];
            this.saveOrders();
            this.renderOrders();
        }
    }

    // Ver usuario
    viewUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            alert(`Usuario: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nTeléfono: ${user.phone || 'N/A'}\nDirección: ${user.address || 'N/A'}\nTipo: ${user.type}`);
        }
    }

    // Eliminar usuario
    deleteUser(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            this.users = this.users.filter(u => u.id !== id);
            if (window.authSystem) {
                window.authSystem.saveUsers(this.users);
            }
            this.renderUsers();
            this.updateStats();
        }
    }
}

// Inicializar sistema de administración cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.adminSystem = new AdminSystem();
});


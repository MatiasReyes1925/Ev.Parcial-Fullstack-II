// Sistema de autenticación simulado para HuertoHogar
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Verificar si el usuario ya está logueado
        if (this.currentUser) {
            this.updateUIForLoggedUser();
        }

        // Event listeners para formularios
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Event listener para logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    }

    // Cargar usuarios desde localStorage o crear usuarios por defecto
    loadUsers() {
        const savedUsers = localStorage.getItem('huertohogar_users');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }

        // Usuarios por defecto
        const defaultUsers = [
            {
                id: 1,
                firstName: 'Usuario',
                lastName: 'Demo',
                email: 'usuario@huertohogar.cl',
                password: '123456',
                phone: '+56 9 1234 5678',
                address: 'Av. Providencia 123, Santiago',
                type: 'customer',
                registrationDate: new Date().toISOString(),
                newsletter: true
            },
            {
                id: 2,
                firstName: 'Admin',
                lastName: 'HuertoHogar',
                email: 'admin@huertohogar.cl',
                password: '123456',
                phone: '+56 9 8765 4321',
                address: 'Oficina Central, Santiago',
                type: 'admin',
                registrationDate: new Date().toISOString(),
                newsletter: false
            }
        ];

        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    // Guardar usuarios en localStorage
    saveUsers(users) {
        localStorage.setItem('huertohogar_users', JSON.stringify(users));
    }

    // Obtener usuario actual desde localStorage
    getCurrentUser() {
        const currentUser = localStorage.getItem('huertohogar_current_user');
        return currentUser ? JSON.parse(currentUser) : null;
    }

    // Guardar usuario actual en localStorage
    setCurrentUser(user) {
        localStorage.setItem('huertohogar_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Manejar login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Limpiar errores previos
        this.clearErrors();

        // Validaciones
        if (!this.validateEmail(email)) {
            this.showError('email', 'Por favor ingresa un email válido');
            return;
        }

        if (!password) {
            this.showError('password', 'La contraseña es requerida');
            return;
        }

        // Simular delay de autenticación
        const submitBtn = document.querySelector('.auth-button');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            // Buscar usuario
            const user = this.users.find(u => u.email === email && u.password === password);

            if (user) {
                // Login exitoso
                this.setCurrentUser(user);
                
                if (remember) {
                    localStorage.setItem('huertohogar_remember', 'true');
                }

                this.showSuccess('¡Bienvenido! Redirigiendo...');
                
                setTimeout(() => {
                    // Redirigir según el tipo de usuario
                    if (user.type === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                this.showError('password', 'Email o contraseña incorrectos');
            }

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 1000);
    }

    // Manejar registro
    async handleRegister(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            terms: document.getElementById('terms').checked,
            newsletter: document.getElementById('newsletter').checked
        };

        // Limpiar errores previos
        this.clearErrors();

        // Validaciones
        let hasErrors = false;

        if (!formData.firstName) {
            this.showError('firstName', 'El nombre es requerido');
            hasErrors = true;
        }

        if (!formData.lastName) {
            this.showError('lastName', 'El apellido es requerido');
            hasErrors = true;
        }

        if (!this.validateEmail(formData.email)) {
            this.showError('email', 'Por favor ingresa un email válido');
            hasErrors = true;
        }

        // Verificar si el email ya existe
        if (this.users.find(u => u.email === formData.email)) {
            this.showError('email', 'Este email ya está registrado');
            hasErrors = true;
        }

        if (formData.phone && !this.validatePhone(formData.phone)) {
            this.showError('phone', 'Por favor ingresa un teléfono válido');
            hasErrors = true;
        }

        if (!this.validatePassword(formData.password)) {
            this.showError('password', 'La contraseña debe tener al menos 6 caracteres');
            hasErrors = true;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showError('confirmPassword', 'Las contraseñas no coinciden');
            hasErrors = true;
        }

        if (!formData.terms) {
            this.showError('terms', 'Debes aceptar los términos y condiciones');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Simular delay de registro
        const submitBtn = document.querySelector('.auth-button');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            // Crear nuevo usuario
            const newUser = {
                id: this.users.length + 1,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                type: 'customer',
                registrationDate: new Date().toISOString(),
                newsletter: formData.newsletter
            };

            // Agregar usuario a la lista
            this.users.push(newUser);
            this.saveUsers(this.users);

            // Auto-login después del registro
            this.setCurrentUser(newUser);

            this.showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 1000);
    }

    // Manejar logout
    handleLogout(e) {
        e.preventDefault();
        
        localStorage.removeItem('huertohogar_current_user');
        localStorage.removeItem('huertohogar_remember');
        this.currentUser = null;

        // Redirigir al login
        window.location.href = 'login.html';
    }

    // Validaciones
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^\+?56\s?9\s?\d{4}\s?\d{4}$/;
        return phoneRegex.test(phone);
    }

    validatePassword(password) {
        return password && password.length >= 6;
    }

    // Mostrar errores
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Limpiar errores
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const fieldElements = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
        
        errorElements.forEach(el => {
            el.classList.remove('show');
            el.textContent = '';
        });
        
        fieldElements.forEach(el => {
            el.classList.remove('error');
        });
    }

    // Mostrar mensaje de éxito
    showSuccess(message) {
        // Crear elemento de éxito si no existe
        let successElement = document.querySelector('.success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'success-message';
            const form = document.querySelector('.auth-form');
            form.insertBefore(successElement, form.firstChild);
        }
        
        successElement.textContent = message;
        successElement.classList.add('show');
    }

    // Actualizar UI para usuario logueado
    updateUIForLoggedUser() {
        // Actualizar navegación si existe
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && this.currentUser) {
            // Agregar enlace de perfil/admin
            const profileLink = document.createElement('li');
            if (this.currentUser.type === 'admin') {
                profileLink.innerHTML = `<a href="admin.html" class="nav-link">Panel Admin</a>`;
            } else {
                profileLink.innerHTML = `<a href="#" class="nav-link">Mi Perfil</a>`;
            }
            
            // Agregar enlace de logout
            const logoutLink = document.createElement('li');
            logoutLink.innerHTML = `<a href="#" id="logout-btn" class="nav-link">Cerrar Sesión</a>`;
            
            navMenu.appendChild(profileLink);
            navMenu.appendChild(logoutLink);

            // Agregar event listener al logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
            }
        }
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Verificar si el usuario es admin
    isAdmin() {
        return this.currentUser && this.currentUser.type === 'admin';
    }

    // Obtener todos los usuarios (solo para admin)
    getAllUsers() {
        if (!this.isAdmin()) {
            throw new Error('Acceso denegado');
        }
        return this.users;
    }

    // Proteger páginas que requieren autenticación
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Proteger páginas que requieren permisos de admin
    requireAdmin() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        
        if (!this.isAdmin()) {
            alert('Acceso denegado. Se requieren permisos de administrador.');
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();

// Hacer disponible globalmente
window.authSystem = authSystem;


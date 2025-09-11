// JavaScript específico para la página de contacto

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeFormValidation();
});

// Inicializar formulario de contacto
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Agregar validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validar formulario completo
    if (!validateForm(form)) {
        showNotification('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Simular envío del formulario
    setTimeout(() => {
        // Recopilar datos del formulario
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            city: formData.get('city'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString()
        };
        
        // Guardar en localStorage (simulación)
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        
        // Mostrar confirmación
        showContactConfirmation(contactData);
        
        // Limpiar formulario
        form.reset();
        clearAllFieldErrors(form);
        
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
        
    }, 2000);
}

// Mostrar confirmación del contacto
function showContactConfirmation(contactData) {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'contact-confirmation-modal';
    confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    confirmationModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
            text-align: center;
            animation: slideIn 0.3s ease;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            ">&times;</button>
            
            <div style="color: #2E8B57; font-size: 4rem; margin-bottom: 1rem;">📧</div>
            <h2 style="color: #2E8B57; margin-bottom: 1rem; font-family: 'Playfair Display', serif;">
                ¡Mensaje Recibido!
            </h2>
            <p style="font-size: 1.1rem; margin-bottom: 1rem; color: #333;">
                Gracias <strong>${contactData.name}</strong> por contactarnos.
            </p>
            
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; text-align: left;">
                <h4 style="color: #8B4513; margin-bottom: 1rem;">Resumen de tu consulta:</h4>
                <p><strong>Asunto:</strong> ${getSubjectText(contactData.subject)}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                ${contactData.phone ? `<p><strong>Teléfono:</strong> ${contactData.phone}</p>` : ''}
                ${contactData.city ? `<p><strong>Ciudad:</strong> ${getCityText(contactData.city)}</p>` : ''}
            </div>
            
            <p style="color: #666; margin-bottom: 2rem;">
                Nuestro equipo revisará tu mensaje y te responderá en un plazo máximo de 24 horas.
            </p>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #2E8B57; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Continuar
                </button>
                <button onclick="window.location.href='productos.html'" 
                        style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    Ver Productos
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmationModal);
    
    // Cerrar modal al hacer clic fuera
    confirmationModal.onclick = function(event) {
        if (event.target === confirmationModal) {
            confirmationModal.remove();
        }
    };
}

// Obtener texto del asunto
function getSubjectText(value) {
    const subjects = {
        'consulta-productos': 'Consulta sobre Productos',
        'problema-pedido': 'Problema con Pedido',
        'sugerencia': 'Sugerencia',
        'colaboracion': 'Colaboración Comercial',
        'otro': 'Otro'
    };
    return subjects[value] || value;
}

// Obtener texto de la ciudad
function getCityText(value) {
    const cities = {
        'santiago': 'Santiago',
        'puerto-montt': 'Puerto Montt',
        'villarica': 'Villarica',
        'nacimiento': 'Nacimiento',
        'vina-del-mar': 'Viña del Mar',
        'valparaiso': 'Valparaíso',
        'concepcion': 'Concepción',
        'otra': 'Otra ciudad'
    };
    return cities[value] || value;
}

// Inicializar FAQ
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFaq(this);
        });
    });
}

// Toggle FAQ
function toggleFaq(questionElement) {
    const faqItem = questionElement.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Cerrar todas las FAQ abiertas
    document.querySelectorAll('.faq-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir la FAQ clickeada si no estaba activa
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Inicializar validación de formulario
function initializeFormValidation() {
    // Validación personalizada para campos específicos
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmailField(this);
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhoneField(this);
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            validateMessageLength(this);
        });
    }
}

// Validar campo individual
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Limpiar errores previos
    clearFieldError(field);
    
    // Validar según el tipo de campo
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Ingrese un email válido');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Ingrese un teléfono válido (ej: +56 9 1234 5678)');
        return false;
    }
    
    if (field.name === 'message' && value && value.length < 10) {
        showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    }
    
    // Marcar como válido
    field.classList.add('success');
    return true;
}

// Validar campo de email
function validateEmailField(field) {
    const value = field.value.trim();
    clearFieldError(field);
    
    if (value && !isValidEmail(value)) {
        showFieldError(field, 'Ingrese un email válido');
        return false;
    }
    
    if (value && isValidEmail(value)) {
        field.classList.add('success');
        return true;
    }
    
    return true;
}

// Validar campo de teléfono
function validatePhoneField(field) {
    const value = field.value.trim();
    clearFieldError(field);
    
    if (value && !isValidPhone(value)) {
        showFieldError(field, 'Formato: +56 9 1234 5678 o 912345678');
        return false;
    }
    
    if (value && isValidPhone(value)) {
        field.classList.add('success');
        return true;
    }
    
    return true;
}

// Validar longitud del mensaje
function validateMessageLength(field) {
    const value = field.value.trim();
    const minLength = 10;
    const maxLength = 1000;
    
    clearFieldError(field);
    
    if (value.length > 0 && value.length < minLength) {
        showFieldError(field, `El mensaje debe tener al menos ${minLength} caracteres`);
        return false;
    }
    
    if (value.length > maxLength) {
        showFieldError(field, `El mensaje no puede exceder ${maxLength} caracteres`);
        return false;
    }
    
    if (value.length >= minLength) {
        field.classList.add('success');
        
        // Mostrar contador de caracteres
        let counter = field.parentElement.querySelector('.char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'font-size: 0.8rem; color: #666; text-align: right; margin-top: 0.25rem;';
            field.parentElement.appendChild(counter);
        }
        counter.textContent = `${value.length}/${maxLength} caracteres`;
    }
    
    return true;
}

// Limpiar error de campo
function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.classList.remove('error', 'success');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Limpiar todos los errores del formulario
function clearAllFieldErrors(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Mostrar términos y condiciones
function showTerms() {
    const termsModal = document.createElement('div');
    termsModal.className = 'terms-modal';
    termsModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    termsModal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            ">&times;</button>
            
            <h2 style="color: #2E8B57; margin-bottom: 2rem; font-family: 'Playfair Display', serif;">
                Términos y Condiciones
            </h2>
            
            <div style="color: #666; line-height: 1.6;">
                <h3 style="color: #8B4513; margin-bottom: 1rem;">1. Uso de la Información</h3>
                <p style="margin-bottom: 1rem;">
                    La información proporcionada en este formulario será utilizada únicamente para responder 
                    a tu consulta y mejorar nuestros servicios. No compartiremos tus datos con terceros 
                    sin tu consentimiento expreso.
                </p>
                
                <h3 style="color: #8B4513; margin-bottom: 1rem;">2. Privacidad</h3>
                <p style="margin-bottom: 1rem;">
                    Respetamos tu privacidad y protegemos tus datos personales de acuerdo con la 
                    legislación chilena de protección de datos. Puedes solicitar la eliminación 
                    de tus datos en cualquier momento.
                </p>
                
                <h3 style="color: #8B4513; margin-bottom: 1rem;">3. Comunicaciones</h3>
                <p style="margin-bottom: 1rem;">
                    Si aceptas recibir nuestro newsletter, podrás darte de baja en cualquier momento 
                    haciendo clic en el enlace de cancelación incluido en nuestros emails.
                </p>
                
                <h3 style="color: #8B4513; margin-bottom: 1rem;">4. Tiempo de Respuesta</h3>
                <p style="margin-bottom: 1rem;">
                    Nos comprometemos a responder tu consulta en un plazo máximo de 24 horas hábiles. 
                    Para consultas urgentes, puedes contactarnos directamente por teléfono.
                </p>
                
                <h3 style="color: #8B4513; margin-bottom: 1rem;">5. Modificaciones</h3>
                <p style="margin-bottom: 2rem;">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Las modificaciones serán publicadas en nuestro sitio web.
                </p>
            </div>
            
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #2E8B57;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">
                    Entendido
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(termsModal);
    
    // Cerrar modal al hacer clic fuera
    termsModal.onclick = function(event) {
        if (event.target === termsModal) {
            termsModal.remove();
        }
    };
}

// Función para autocompletar información del usuario si está logueado
function autoFillUserInfo() {
    // Esta función podría implementarse si hay un sistema de usuarios
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    if (savedUserInfo.name) {
        const nameField = document.getElementById('name');
        if (nameField && !nameField.value) {
            nameField.value = savedUserInfo.name;
        }
    }
    
    if (savedUserInfo.email) {
        const emailField = document.getElementById('email');
        if (emailField && !emailField.value) {
            emailField.value = savedUserInfo.email;
        }
    }
    
    if (savedUserInfo.phone) {
        const phoneField = document.getElementById('phone');
        if (phoneField && !phoneField.value) {
            phoneField.value = savedUserInfo.phone;
        }
    }
}

// Inicializar autocompletado si hay información guardada
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(autoFillUserInfo, 500);
});

// Función para mostrar sugerencias de asunto basadas en la ciudad
function updateSubjectSuggestions() {
    const citySelect = document.getElementById('city');
    const subjectSelect = document.getElementById('subject');
    
    if (citySelect && subjectSelect) {
        citySelect.addEventListener('change', function() {
            const selectedCity = this.value;
            
            // Agregar opciones específicas según la ciudad
            if (selectedCity && selectedCity !== 'otra') {
                // Podrías agregar lógica específica aquí
                showNotification(`Información específica para ${getCityText(selectedCity)} disponible`, 'info');
            }
        });
    }
}


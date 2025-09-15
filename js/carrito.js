// JavaScript específico para la página del carrito

// Inicializar funcionalidades del carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha mínima para entrega (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const deliveryDateInput = document.getElementById('delivery-date');
    if (deliveryDateInput) {
        deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    }
    
    // Inicializar formulario de checkout
    initializeCheckoutForm();
    
    // Actualizar total final
    updateFinalTotal();
});

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío. Agrega algunos productos primero.', 'error');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Función para cerrar el modal de checkout
function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Inicializar formulario de checkout
function initializeCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                processOrder();
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) {
                closeCheckoutModal();
            }
        };
    }
}

// Procesar el pedido
function processOrder() {
    // Recopilar datos del formulario
    const formData = new FormData(document.getElementById('checkout-form'));
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        delivery: {
            address: formData.get('address'),
            city: formData.get('city'),
            date: formData.get('delivery-date') || 'Lo antes posible'
        },
        payment: formData.get('payment'),
        items: cart,
        total: getCartTotal(),
        orderNumber: generateOrderNumber(),
        timestamp: new Date().toISOString()
    };
    
    // Simular procesamiento del pedido
    showNotification('Procesando tu pedido...', 'info');
    
    setTimeout(() => {
        // Guardar pedido en localStorage (simulación)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpiar carrito
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Mostrar confirmación
        showOrderConfirmation(orderData);
        
        // Cerrar modal
        closeCheckoutModal();
        
        // Actualizar vista del carrito
        renderCartItems();
        updateFinalTotal();
        
    }, 2000);
}

// Generar número de pedido
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HH${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

// Mostrar confirmación del pedido
function showOrderConfirmation(orderData) {
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal';
    confirmationModal.style.display = 'block';
    
    confirmationModal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; text-align: center;">
            <span class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="color: #2E8B57; font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: #2E8B57; margin-bottom: 1rem;">¡Pedido Confirmado!</h2>
            <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                Tu pedido <strong>#${orderData.orderNumber}</strong> ha sido procesado exitosamente.
            </p>
            <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 1.5rem 0; text-align: left;">
                <h4 style="color: #8B4513; margin-bottom: 1rem;">Detalles del Pedido:</h4>
                <p><strong>Cliente:</strong> ${orderData.customer.name}</p>
                <p><strong>Email:</strong> ${orderData.customer.email}</p>
                <p><strong>Ciudad:</strong> ${orderData.delivery.city}</p>
                <p><strong>Fecha de entrega:</strong> ${orderData.delivery.date}</p>
                <p><strong>Total:</strong> $${orderData.total.toLocaleString()} CLP</p>
            </div>
            <p style="color: #666; margin-bottom: 2rem;">
                Recibirás un email de confirmación con los detalles de tu pedido y el seguimiento de la entrega.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="background: #2E8B57; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Continuar
                </button>
                <button onclick="window.location.href='productos.html'" 
                        style="background: #6c757d; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                    Seguir Comprando
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

// Actualizar total final
function updateFinalTotal() {
    const finalTotalElement = document.getElementById('final-total');
    if (finalTotalElement) {
        const total = getCartTotal();
        finalTotalElement.textContent = `$${total.toLocaleString()} CLP`;
    }
}

// Sobrescribir la función renderCartItems para incluir actualización del total final
const originalRenderCartItems = renderCartItems;
renderCartItems = function() {
    originalRenderCartItems();
    updateFinalTotal();
};

// Función para aplicar cupón de descuento (funcionalidad adicional)
function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    const validCoupons = {
        'HUERTO10': 0.10,
        'FRESH15': 0.15,
        'ORGANIC20': 0.20
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        const discountAmount = getCartTotal() * discount;
        
        showNotification(`¡Cupón aplicado! Descuento de ${(discount * 100)}%`, 'success');
        
        // Aquí podrías implementar la lógica para aplicar el descuento
        // Por simplicidad, solo mostramos la notificación
        
    } else if (couponCode) {
        showNotification('Cupón no válido', 'error');
    }
    
    couponInput.value = '';
}

// Función para calcular envío (funcionalidad adicional)
function calculateShipping(city, total) {
    const shippingRates = {
        'santiago': 0,
        'valparaiso': 2000,
        'vina-del-mar': 2000,
        'concepcion': 3000,
        'puerto-montt': 5000,
        'villarica': 4000,
        'nacimiento': 3500
    };
    
    // Envío gratis para pedidos superiores a $15,000
    if (total >= 15000) {
        return 0;
    }
    
    return shippingRates[city] || 3000;
}

// Función para mostrar información de envío
function updateShippingInfo() {
    const citySelect = document.getElementById('delivery-city');
    const shippingInfo = document.querySelector('.shipping-info');
    
    if (citySelect && shippingInfo) {
        citySelect.addEventListener('change', function() {
            const selectedCity = this.value;
            const total = getCartTotal();
            const shippingCost = calculateShipping(selectedCity, total);
            
            if (shippingCost === 0) {
                shippingInfo.innerHTML = `
                    <h4>Información de Envío</h4>
                    <p>📦 Envío gratis</p>
                    <p>🚚 Entrega en 24-48 horas</p>
                    <p>📍 ${selectedCity.replace('-', ' ').toUpperCase()}</p>
                `;
            } else {
                shippingInfo.innerHTML = `
                    <h4>Información de Envío</h4>
                    <p>📦 Costo de envío: $${shippingCost.toLocaleString()} CLP</p>
                    <p>🚚 Entrega en 24-48 horas</p>
                    <p>📍 ${selectedCity.replace('-', ' ').toUpperCase()}</p>
                    <p style="color: #2E8B57; font-weight: 600;">💡 Envío gratis en pedidos superiores a $15.000</p>
                `;
            }
        });
    }
}

// Inicializar información de envío
document.addEventListener('DOMContentLoaded', function() {
    updateShippingInfo();
});

// Función para guardar carrito como favoritos
function saveCartAsFavorites() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    localStorage.setItem('favorites', JSON.stringify(cart));
    showNotification('Carrito guardado en favoritos', 'success');
}

// Función para cargar favoritos
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        showNotification('No tienes productos en favoritos', 'info');
        return;
    }
    
    // Limpiar carrito actual y cargar favoritos
    cart = [...favorites];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    updateFinalTotal();
    
    showNotification('Favoritos cargados al carrito', 'success');
}

// Función para compartir carrito (funcionalidad adicional)
function shareCart() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    const cartSummary = cart.map(item => 
        `${item.name} (${item.quantity} ${item.unit})`
    ).join(', ');
    
    const shareText = `¡Mira mi carrito de HuertoHogar! ${cartSummary}. Total: $${getCartTotal().toLocaleString()} CLP`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi Carrito - HuertoHogar',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Carrito copiado al portapapeles', 'success');
        });
    }
}


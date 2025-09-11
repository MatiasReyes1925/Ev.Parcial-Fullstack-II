// JavaScript específico para la página Nosotros

document.addEventListener('DOMContentLoaded', function() {
    initializeMapInteractions();
    initializeCounterAnimations();
    initializeScrollAnimations();
});

// Inicializar interacciones del mapa
function initializeMapInteractions() {
    const mapPoints = document.querySelectorAll('.map-point');
    const locationItems = document.querySelectorAll('.location-item');
    
    // Crear un mapa de correspondencia entre ciudades y elementos
    const cityMap = {
        'santiago': 'Santiago',
        'valparaiso': 'Valparaíso',
        'vina-del-mar': 'Viña del Mar',
        'concepcion': 'Concepción',
        'nacimiento': 'Nacimiento',
        'villarica': 'Villarica',
        'puerto-montt': 'Puerto Montt'
    };
    
    // Agregar eventos a los puntos del mapa
    mapPoints.forEach(point => {
        const city = point.dataset.city;
        
        point.addEventListener('mouseenter', function() {
            // Resaltar el elemento correspondiente en la lista
            locationItems.forEach(item => {
                const itemCity = item.querySelector('h4').textContent;
                if (itemCity === cityMap[city]) {
                    item.style.backgroundColor = '#e8f5e8';
                    item.style.transform = 'translateX(15px)';
                }
            });
        });
        
        point.addEventListener('mouseleave', function() {
            // Restaurar el estado normal de todos los elementos
            locationItems.forEach(item => {
                item.style.backgroundColor = 'white';
                item.style.transform = 'translateX(0)';
            });
        });
        
        point.addEventListener('click', function() {
            showCityInfo(city, cityMap[city]);
        });
    });
    
    // Agregar eventos a los elementos de la lista
    locationItems.forEach(item => {
        const cityName = item.querySelector('h4').textContent;
        const cityKey = Object.keys(cityMap).find(key => cityMap[key] === cityName);
        
        item.addEventListener('mouseenter', function() {
            // Resaltar el punto correspondiente en el mapa
            const mapPoint = document.querySelector(`[data-city="${cityKey}"]`);
            if (mapPoint) {
                mapPoint.style.transform = 'scale(1.3)';
                mapPoint.querySelector('.point-label').style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            // Restaurar el estado normal del punto del mapa
            const mapPoint = document.querySelector(`[data-city="${cityKey}"]`);
            if (mapPoint) {
                mapPoint.style.transform = 'scale(1)';
                mapPoint.querySelector('.point-label').style.opacity = '0';
            }
        });
        
        item.addEventListener('click', function() {
            showCityInfo(cityKey, cityName);
        });
    });
}

// Mostrar información detallada de la ciudad
function showCityInfo(cityKey, cityName) {
    const cityInfo = {
        'santiago': {
            name: 'Santiago',
            region: 'Región Metropolitana',
            description: 'Nuestro centro de distribución principal, desde donde coordinamos las entregas a toda la región metropolitana.',
            products: 'Todas las categorías disponibles',
            deliveryTime: '24 horas',
            coverage: 'Toda la región metropolitana'
        },
        'valparaiso': {
            name: 'Valparaíso',
            region: 'Región de Valparaíso',
            description: 'Puerto principal que nos permite recibir productos frescos desde diferentes regiones costeras.',
            products: 'Especialidad en productos del mar y frutas costeras',
            deliveryTime: '24-48 horas',
            coverage: 'Valparaíso y alrededores'
        },
        'vina-del-mar': {
            name: 'Viña del Mar',
            region: 'Región de Valparaíso',
            description: 'La ciudad jardín donde ofrecemos productos frescos para un estilo de vida saludable.',
            products: 'Frutas, verduras orgánicas y productos gourmet',
            deliveryTime: '24-48 horas',
            coverage: 'Viña del Mar y comunas cercanas'
        },
        'concepcion': {
            name: 'Concepción',
            region: 'Región del Biobío',
            description: 'Centro de distribución para el sur del país, conectando con productores locales de la región.',
            products: 'Productos regionales y especialidades del sur',
            deliveryTime: '24-48 horas',
            coverage: 'Gran Concepción'
        },
        'nacimiento': {
            name: 'Nacimiento',
            region: 'Región del Biobío',
            description: 'Zona agrícola rica en productos de la tierra, especialmente cereales y legumbres.',
            products: 'Cereales, legumbres y productos agrícolas tradicionales',
            deliveryTime: '48 horas',
            coverage: 'Nacimiento y valle central'
        },
        'villarica': {
            name: 'Villarica',
            region: 'Región de La Araucanía',
            description: 'Zona lacustre con productos únicos de la región de los lagos y volcanes.',
            products: 'Productos lacustres, frutas de la región y especialidades mapuches',
            deliveryTime: '48 horas',
            coverage: 'Villarica y zona lacustre'
        },
        'puerto-montt': {
            name: 'Puerto Montt',
            region: 'Región de Los Lagos',
            description: 'Puerta de entrada a la Patagonia, con acceso a productos únicos del sur de Chile.',
            products: 'Productos patagónicos, mariscos y especialidades del sur',
            deliveryTime: '48-72 horas',
            coverage: 'Puerto Montt y región de Los Lagos'
        }
    };
    
    const info = cityInfo[cityKey];
    if (!info) return;
    
    // Crear modal con información de la ciudad
    const modal = document.createElement('div');
    modal.className = 'city-info-modal';
    modal.style.cssText = `
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
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            position: relative;
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
            
            <h2 style="color: #2E8B57; margin-bottom: 0.5rem; font-family: 'Playfair Display', serif;">
                📍 ${info.name}
            </h2>
            <p style="color: #8B4513; font-weight: 600; margin-bottom: 1.5rem;">
                ${info.region}
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 2rem;">
                ${info.description}
            </p>
            
            <div style="display: grid; gap: 1rem;">
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <strong style="color: #2E8B57;">🛍️ Productos Disponibles:</strong><br>
                    <span style="color: #666;">${info.products}</span>
                </div>
                
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <strong style="color: #2E8B57;">🚚 Tiempo de Entrega:</strong><br>
                    <span style="color: #666;">${info.deliveryTime}</span>
                </div>
                
                <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <strong style="color: #2E8B57;">📍 Cobertura:</strong><br>
                    <span style="color: #666;">${info.coverage}</span>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="window.location.href='productos.html'" style="
                    background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">
                    Ver Productos Disponibles
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    };
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('city-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'city-modal-styles';
        styles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Inicializar animaciones de contador
function initializeCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Animar contador
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d,]/g, '');
    const duration = 2000;
    const increment = number / (duration / 16);
    
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
}

// Inicializar animaciones de scroll
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.value-card, .team-member, .location-item');
    
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
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Función para mostrar más información sobre el impacto
function showImpactDetails() {
    const impactModal = document.createElement('div');
    impactModal.className = 'impact-modal';
    impactModal.style.cssText = `
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
    
    impactModal.innerHTML = `
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
                🌱 Nuestro Impacto Detallado
            </h2>
            
            <div style="display: grid; gap: 1.5rem;">
                <div style="padding: 1.5rem; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #2E8B57;">
                    <h4 style="color: #8B4513; margin-bottom: 1rem;">🌾 Apoyo a Productores Locales</h4>
                    <p style="color: #666; line-height: 1.6;">
                        Trabajamos directamente con más de 100 productores locales, garantizando precios justos y 
                        relaciones comerciales a largo plazo que benefician a las comunidades rurales.
                    </p>
                </div>
                
                <div style="padding: 1.5rem; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #2E8B57;">
                    <h4 style="color: #8B4513; margin-bottom: 1rem;">🌍 Reducción de Huella de Carbono</h4>
                    <p style="color: #666; line-height: 1.6;">
                        Al comprar productos locales, reducimos significativamente las emisiones de CO2 asociadas 
                        al transporte de larga distancia, contribuyendo a un planeta más sostenible.
                    </p>
                </div>
                
                <div style="padding: 1.5rem; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #2E8B57;">
                    <h4 style="color: #8B4513; margin-bottom: 1rem;">🏘️ Fortalecimiento de Comunidades</h4>
                    <p style="color: #666; line-height: 1.6;">
                        Cada compra contribuye al desarrollo económico de las comunidades rurales, 
                        manteniendo vivas las tradiciones agrícolas y generando empleo local.
                    </p>
                </div>
                
                <div style="padding: 1.5rem; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #2E8B57;">
                    <h4 style="color: #8B4513; margin-bottom: 1rem;">💚 Promoción de Vida Saludable</h4>
                    <p style="color: #666; line-height: 1.6;">
                        Facilitamos el acceso a alimentos frescos y nutritivos, contribuyendo a mejorar 
                        la salud y bienestar de más de 10,000 familias chilenas.
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 2rem;">
                <button onclick="window.location.href='contacto.html'" style="
                    background: linear-gradient(135deg, #2E8B57 0%, #228B22 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-right: 1rem;
                ">
                    Únete a Nuestro Impacto
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(impactModal);
    
    // Cerrar modal al hacer clic fuera
    impactModal.onclick = function(event) {
        if (event.target === impactModal) {
            impactModal.remove();
        }
    };
}

// Agregar evento para mostrar detalles del impacto
document.addEventListener('DOMContentLoaded', function() {
    const impactSection = document.querySelector('.impact');
    if (impactSection) {
        const showDetailsBtn = document.createElement('button');
        showDetailsBtn.textContent = 'Ver Más Detalles';
        showDetailsBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 2rem;
            transition: all 0.3s ease;
        `;
        
        showDetailsBtn.addEventListener('mouseenter', function() {
            this.style.background = 'white';
            this.style.color = '#2E8B57';
        });
        
        showDetailsBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.color = 'white';
        });
        
        showDetailsBtn.addEventListener('click', showImpactDetails);
        
        const impactDescription = impactSection.querySelector('.impact-description');
        if (impactDescription) {
            impactDescription.appendChild(showDetailsBtn);
        }
    }
});


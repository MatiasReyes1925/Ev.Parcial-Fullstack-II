# Ev.Parcial-Fullstack-II

# HuertoHogar - Sitio Web

## Integrantes del Proyecto
- **Jean Pierre Valenzuela Navarrete**
- **Matias Eduardo Reyes Agilera**
- **Cristobal Andres CEA GUZMAN**

## Descripción
Sitio web para la tienda online HuertoHogar, especializada en productos frescos del campo. Desarrollado según las especificaciones de la evaluación parcial DSY1104.

## Características Principales
- **Diseño Responsivo**: Compatible con dispositivos móviles y de escritorio
- **Catálogo de Productos**: Sistema completo de productos con filtros y búsqueda
- **Carrito de Compras**: Funcionalidad completa para agregar, modificar y eliminar productos
- **Formulario de Contacto**: Con validación JavaScript y múltiples opciones de contacto
- **Mapa Interactivo**: Ubicaciones de las tiendas en Chile
- **Navegación Intuitiva**: Menú responsive con hamburger para móviles

## Estructura del Proyecto
```
huerto_hogar/
├── index.html          # Página principal
├── productos.html      # Catálogo de productos
├── carrito.html        # Carrito de compras
├── nosotros.html       # Información de la empresa
├── contacto.html       # Formulario de contacto
├── css/
│   ├── styles.css      # Estilos principales
│   ├── productos.css   # Estilos específicos de productos
│   ├── carrito.css     # Estilos del carrito
│   ├── nosotros.css    # Estilos de la página nosotros
│   └── contacto.css    # Estilos del formulario de contacto
├── js/
│   ├── main.js         # JavaScript principal
│   ├── carrito.js      # Funcionalidad del carrito
│   ├── nosotros.js     # Interacciones de la página nosotros
│   └── contacto.js     # Validación del formulario
├── images/             # Imágenes del sitio
└── README.md          # Este archivo
```

## Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive con Flexbox y Grid
- **JavaScript ES6**: Funcionalidades interactivas
- **Google Fonts**: Tipografías Montserrat y Playfair Display

## Paleta de Colores
- **Verde Principal**: #2E8B57 (SeaGreen)
- **Verde Secundario**: #228B22 (ForestGreen)
- **Marrón**: #8B4513 (SaddleBrown)
- **Dorado**: #FFD700 (Gold)
- **Naranja**: #FFA500 (Orange)

## Funcionalidades Implementadas

### Página Principal (index.html)
- Hero section con llamada a la acción
- Sección de características principales
- Categorías de productos
- Testimonios de clientes
- Footer completo

### Catálogo de Productos (productos.html)
- Lista completa de productos con imágenes
- Sistema de filtros por categoría
- Búsqueda por nombre/descripción
- Funcionalidad de agregar al carrito
- Controles de cantidad

### Carrito de Compras (carrito.html)
- Visualización de productos agregados
- Modificación de cantidades
- Eliminación de productos
- Cálculo automático de totales
- Formulario de checkout

### Nosotros (nosotros.html)
- Historia de la empresa
- Misión y visión
- Valores corporativos
- Mapa interactivo de ubicaciones
- Información del equipo
- Estadísticas de impacto

### Contacto (contacto.html)
- Formulario de contacto con validación
- Información de contacto múltiple
- Preguntas frecuentes (FAQ)
- Enlaces a redes sociales

## Cómo Ejecutar el Sitio

### Opción 1: Servidor Local Simple
```bash
# Navegar a la carpeta del proyecto
cd huerto_hogar

# Iniciar servidor HTTP simple con Python
python3 -m http.server 8000

# Abrir en el navegador
# http://localhost:8000
```

### Opción 2: Servidor con Node.js
```bash
# Instalar http-server globalmente
npm install -g http-server

# Navegar a la carpeta del proyecto
cd huerto_hogar

# Iniciar servidor
http-server -p 8000

# Abrir en el navegador
# http://localhost:8000
```

### Opción 3: Abrir Directamente
Simplemente abrir el archivo `index.html` en cualquier navegador web moderno.

## Características Técnicas

### Responsive Design
- Breakpoints para móviles (480px), tablets (768px) y desktop (1024px+)
- Menú hamburger para dispositivos móviles
- Imágenes optimizadas para diferentes tamaños de pantalla

### Accesibilidad
- Estructura HTML semántica
- Etiquetas alt en todas las imágenes
- Navegación por teclado
- Contraste de colores adecuado

### Performance
- Imágenes optimizadas
- CSS y JavaScript minificados conceptualmente
- Carga asíncrona de elementos no críticos

## Navegadores Compatibles
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Funcionalidades JavaScript

### Carrito de Compras
- Persistencia en localStorage
- Actualización en tiempo real
- Validación de stock
- Cálculos automáticos

### Formularios
- Validación en tiempo real
- Mensajes de error personalizados
- Autocompletado inteligente
- Prevención de envío duplicado

### Interacciones
- Animaciones suaves
- Efectos hover
- Modales informativos
- Notificaciones de usuario

## Datos de Prueba
El sitio incluye productos de ejemplo en las siguientes categorías:
- Frutas Frescas (Manzanas, Naranjas, Plátanos)
- Verduras Orgánicas (Zanahorias, Espinacas, Pimientos)
- Productos Orgánicos (Miel, Quinua)
- Productos Lácteos (Leche, Quesos)

## Ubicaciones Cubiertas
- Santiago (Región Metropolitana)
- Valparaíso (Región de Valparaíso)
- Viña del Mar (Región de Valparaíso)
- Concepción (Región del Biobío)
- Nacimiento (Región del Biobío)
- Villarica (Región de La Araucanía)
- Puerto Montt (Región de Los Lagos)

## Contacto del Proyecto
- **Empresa**: HuertoHogar
- **Email**: info@huertohogar.cl
- **Teléfono**: +56 9 1234 5678
- **Sitio Web**: www.huertohogar.cl

## Notas de Desarrollo
- Desarrollado siguiendo las especificaciones de la evaluación DSY1104
- Implementa todos los requerimientos funcionales y no funcionales
- Código limpio y bien documentado
- Estructura modular y escalable

## Próximas Mejoras
- Integración con pasarelas de pago reales
- Sistema de usuarios y autenticación
- Panel de administración
- API REST para gestión de productos
- Integración con sistemas de inventario
- Notificaciones push
- Chat en vivo

---
**Desarrollado para la evaluación parcial DSY1104**  
**Fecha**: Septiembre 2025  
**Versión**: 1.0
// Datos de productos
const products = [
    {
        id: 'FR001',
        name: 'Manzanas Fuji',
        price: 1200,
        stock: 150,
        description: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.',
        category: 'Frutas Frescas',
        icon: 'fa-apple-alt'
    },
    {
        id: 'FR002',
        name: 'Naranjas Valencia',
        price: 1000,
        stock: 200,
        description: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.',
        category: 'Frutas Frescas',
        icon: 'fa-circle'
    },
    {
        id: 'FR003',
        name: 'Plátanos Cavendish',
        price: 800,
        stock: 250,
        description: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.',
        category: 'Frutas Frescas',
        icon: 'fa-seedling'
    },
    {
        id: 'VR001',
        name: 'Zanahorias Orgánicas',
        price: 900,
        stock: 100,
        description: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.',
        category: 'Verduras Orgánicas',
        icon: 'fa-carrot'
    },
    {
        id: 'VR002',
        name: 'Espinacas Frescas',
        price: 700,
        stock: 80,
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.',
        category: 'Verduras Orgánicas',
        icon: 'fa-leaf'
    },
    {
        id: 'VR003',
        name: 'Pimientos Tricolores',
        price: 1500,
        stock: 120,
        description: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.',
        category: 'Verduras Orgánicas',
        icon: 'fa-pepper-hot'
    },
    {
        id: 'PO001',
        name: 'Miel Orgánica',
        price: 5000,
        stock: 50,
        description: 'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.',
        category: 'Productos Orgánicos',
        icon: 'fa-cookie-bite'
    },
    {
        id: 'PO003',
        name: 'Quinua Orgánica',
        price: 3500,
        stock: 75,
        description: 'Quinua orgánica de alta calidad, perfecta para una alimentación saludable. Este superalimento andino es rico en proteínas completas y minerales esenciales.',
        category: 'Productos Orgánicos',
        icon: 'fa-seedling'
    },
    {
        id: 'PL001',
        name: 'Leche Entera',
        price: 1100,
        stock: 90,
        description: 'Leche entera fresca de granjas locales, rica en calcio y nutrientes esenciales. Los productos lácteos de HuertoHogar provienen de granjas que se dedican a la producción responsable y de calidad.',
        category: 'Productos Lácteos',
        icon: 'fa-glass-whiskey'
    }
];

// Datos de regiones y comunas de Chile
const regionesYComunas = {
    'Región Metropolitana': ['Santiago', 'Las Condes', 'Providencia', 'Ñuñoa', 'Maipú', 'Pudahuel', 'La Florida', 'Peñalolén'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz'],
    'Los Ríos': ['Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'],
    'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Ancud', 'Puerto Varas'],
    'Araucanía': ['Temuco', 'Villarrica', 'Pucón', 'Nueva Imperial', 'Angol'],
    'Maule': ['Talca', 'Curicó', 'Linares', 'Cauquenes'],
    'O\'Higgins': ['Rancagua', 'San Fernando', 'Pichilemu', 'Santa Cruz'],
    'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel'],
    'Atacama': ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral'],
    'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones'],
    'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte'],
    'Arica y Parinacota': ['Arica', 'Putre', 'Camarones'],
    'Aysén': ['Coyhaique', 'Puerto Aysén', 'Chile Chico'],
    'Magallanes': ['Punta Arenas', 'Puerto Natales', 'Porvenir']
};

// Categorías de productos
const categories = [
    {
        id: 'frutas',
        name: 'Frutas Frescas',
        description: 'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura.'
    },
    {
        id: 'verduras',
        name: 'Verduras Orgánicas',
        description: 'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural.'
    },
    {
        id: 'organicos',
        name: 'Productos Orgánicos',
        description: 'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables.'
    },
    {
        id: 'lacteos',
        name: 'Productos Lácteos',
        description: 'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad.'
    }
];

// Artículos de blog
const blogArticles = [
    {
        id: 1,
        title: 'Beneficios de los Alimentos Orgánicos',
        excerpt: 'Descubre por qué elegir productos orgánicos puede mejorar tu salud y la del planeta...',
        content: 'Los alimentos orgánicos se han convertido en una opción cada vez más popular entre los consumidores conscientes de la salud y el medio ambiente. Estos productos se cultivan sin el uso de pesticidas sintéticos, herbicidas o fertilizantes químicos, lo que los convierte en una alternativa más saludable y sostenible. Los estudios han demostrado que los alimentos orgánicos contienen niveles más altos de antioxidantes y nutrientes esenciales, además de tener un mejor sabor debido a su proceso de cultivo natural.',
        image: 'fa-apple-alt',
        date: '2024-01-15'
    },
    {
        id: 2,
        title: 'Agricultura Sostenible en Chile',
        excerpt: 'Conoce las prácticas agrícolas que estamos implementando para cuidar nuestro medio ambiente...',
        content: 'La agricultura sostenible es fundamental para el futuro de nuestro planeta y la seguridad alimentaria. En HuertoHogar, trabajamos directamente con agricultores locales que implementan técnicas de cultivo responsables, incluyendo la rotación de cultivos, el uso de fertilizantes naturales y la conservación del agua. Estas prácticas no solo protegen el medio ambiente, sino que también producen alimentos más nutritivos y sabrosos.',
        image: 'fa-seedling',
        date: '2024-01-10'
    }
];

// Usuarios de ejemplo para el admin
const sampleUsers = [
    {
        run: '12345678-9',
        name: 'Juan Pérez',
        lastname: 'García',
        email: 'juan@duoc.cl',
        type: 'Cliente',
        region: 'Región Metropolitana',
        comuna: 'Santiago',
        address: 'Av. Providencia 1234',
        birthdate: '1990-05-15'
    },
    {
        run: '98765432-1',
        name: 'María García',
        lastname: 'López',
        email: 'maria@profesor.duoc.cl',
        type: 'Vendedor',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        address: 'Calle Los Pinos 567',
        birthdate: '1985-08-22'
    },
    {
        run: '11111111-1',
        name: 'Admin',
        lastname: 'System',
        email: 'admin@duoc.cl',
        type: 'Administrador',
        region: 'Región Metropolitana',
        comuna: 'Las Condes',
        address: 'Av. Las Condes 890',
        birthdate: '1980-01-01'
    }
];

// Ubicaciones de las tiendas para Google Maps
const storeLocations = [
    {
        name: "HuertoHogar Santiago",
        position: { lat: -33.4489, lng: -70.6693 },
        address: "Santiago, Región Metropolitana"
    },
    {
        name: "HuertoHogar Puerto Montt",
        position: { lat: -41.4693, lng: -72.9424 },
        address: "Puerto Montt, Región de Los Lagos"
    },
    {
        name: "HuertoHogar Villarica",
        position: { lat: -39.2736, lng: -72.2274 },
        address: "Villarica, Región de La Araucanía"
    },
    {
        name: "HuertoHogar Nacimiento",
        position: { lat: -37.5019, lng: -72.6758 },
        address: "Nacimiento, Región del Biobío"
    },
    {
        name: "HuertoHogar Viña del Mar",
        position: { lat: -33.0245, lng: -71.5518 },
        address: "Viña del Mar, Región de Valparaíso"
    },
    {
        name: "HuertoHogar Valparaíso",
        position: { lat: -33.0458, lng: -71.6197 },
        address: "Valparaíso, Región de Valparaíso"
    },
    {
        name: "HuertoHogar Concepción",
        position: { lat: -36.8270, lng: -73.0498 },
        address: "Concepción, Región del Biobío"
    }
];
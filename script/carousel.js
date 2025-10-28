// carousel.js - Carousel functionality for travel packages

// Define travel packages data
const travelPackages = [
    {
        id: 1,
        name: "Pack Sudeste Asiático",
        description: "Vietnam, Camboya: buses, hostales y guía de visados",
        longDescription: "Sumérgete en la aventura del sudeste Asiático con nuestro pack esencial para mochileros en Vietnam y Camboya. Este paquete te proporciona la base para un viaje inolvidable, diseñado para explorar a tu ritmo y con un presupuesto ajustado. Perfecto para mochileros que buscan la libertad de viajar de forma independiente, pero con las herramientas básicas de logística y la seguridad de tener alojamiento y documentación cubiertos. ¡Prepárate para la inmersión cultural, los templos milenarios y los paisajes que cortan la respiración!",
        price: "600€",
        image: "images/pack-asia.jpg",
        alt: "Backpacking in Southeast Asia"
    },
    {
        id: 2,
        name: "Pack Ruta Inca",
        description: "Perú, Bolivia: trekking, alojamiento y transporte incluido",
        longDescription: "Descubre la majestuosidad de los Andes con nuestro pack Ruta Inca. Recorre el legendario Camino Inca hasta Machu Picchu, explora el lago Titicaca y sumérgete en la rica cultura de Perú y Bolivia. Este paquete incluye guías expertos, alojamiento en refugios de montaña y transporte entre las principales ciudades. Ideal para aventureros que buscan experiencias auténticas en altitudes extremas y paisajes de montaña inolvidables.",
        price: "850€",
        image: "images/pack-inca.jpg",
        alt: "Inca Trail backpacking package"
    },
    {
        id: 3,
        name: "Pack Europa del Este",
        description: "Polonia, República Checa, Hungría: trenes y hostales",
        longDescription: "Explora la fascinante historia y cultura de Europa del Este con nuestro pack diseñado para mochileros. Visita Cracovia, Praga y Budapest con pases de tren incluidos y alojamiento en hostales céntricos. Descubre castillos medievales, arquitectura gótica y la vibrante vida nocturna de estas capitales. Perfecto para quienes buscan cultura, historia y una excelente relación calidad-precio en el corazón de Europa.",
        price: "720€",
        image: "images/pack-europe.jpg",
        alt: "Eastern Europe backpacking"
    },
    {
        id: 4,
        name: "Pack África Oriental",
        description: "Tanzania, Kenia: safaris, camping y guías locales",
        longDescription: "Vive la aventura africana definitiva con nuestro pack de safari en África Oriental. Explora los parques nacionales del Serengeti y Masai Mara, presencia la Gran Migración y acampa bajo las estrellas africanas. Incluye safaris guiados, camping en plena naturaleza, transporte 4x4 y guías locales expertos. Una experiencia única para los amantes de la vida salvaje y los paisajes épicos.",
        price: "1200€",
        image: "images/exp-africa.jpg",
        alt: "East Africa adventure package"
    },
    {
        id: 5,
        name: "Pack Patagonia",
        description: "Argentina, Chile: refugios de montaña y trekkings épicos",
        longDescription: "Conquista los paisajes más dramáticos del planeta con nuestro pack Patagonia. Recorre el Parque Nacional Torres del Paine, glaciares milenarios y montañas imponentes en la frontera argentino-chilena. Incluye alojamiento en refugios de montaña, trekkings guiados y transporte entre los principales puntos de interés. Ideal para mochileros experimentados que buscan naturaleza salvaje y desafíos físicos memorables.",
        price: "950€",
        image: "images/pack-patagonia.jpg",
        alt: "Patagonia trekking package"
    }
];

// Global variables
let currentIndex = 0;
let autoRotateInterval;

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
});

// Main initialization function
function initializeCarousel() {
    // Show first package
    showPackage(currentIndex);
    
    // Set up navigation button listeners
    setupNavigationButtons();
    
    // Start automatic rotation every 2 seconds
    startAutoRotate();
    
    // Set up buy button listener
    setupBuyButton();
}

// Display package at given index
function showPackage(index) {
    // Get carousel container
    const carousel = document.querySelector('.carousel');
    
    if (!carousel) {
        console.error('Carousel container not found');
        return;
    }
    
    // Get package data
    const package = travelPackages[index];
    
    // Update carousel HTML with package data
    carousel.innerHTML = `
        <div class="pack-card">
            <img src="${package.image}" alt="${package.alt}">
            <h3>${package.name}</h3>
            <p>${package.description}</p>
            <p class="price">${package.price}</p>
            <a href="version_c.html" class="buy-button" data-package-id="${package.id}">Comprar</a>
        </div>
    `;
    
    // Re-attach buy button listener after updating HTML
    setupBuyButton();
}

// Navigate to next package (with circular logic)
function nextPackage() {
    currentIndex = (currentIndex + 1) % travelPackages.length;
    showPackage(currentIndex);
    
    // Reset auto-rotate timer
    resetAutoRotate();
}

// Navigate to previous package (with circular logic)
function prevPackage() {
    currentIndex = (currentIndex - 1 + travelPackages.length) % travelPackages.length;
    showPackage(currentIndex);
    
    // Reset auto-rotate timer
    resetAutoRotate();
}

// Set up event listeners for navigation buttons
function setupNavigationButtons() {
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    if (prevButton) {
        prevButton.addEventListener('click', prevPackage);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', nextPackage);
    }
}

// Start automatic rotation every 2 seconds
function startAutoRotate() {
    autoRotateInterval = setInterval(function() {
        nextPackage();
    }, 2000);
}

// Stop automatic rotation
function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }
}

// Reset automatic rotation (restart timer)
function resetAutoRotate() {
    stopAutoRotate();
    startAutoRotate();
}

// Set up buy button to save package data
function setupBuyButton() {
    const buyButton = document.querySelector('.buy-button');
    
    if (buyButton) {
        buyButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get package ID from button
            const packageId = parseInt(this.getAttribute('data-package-id'));
            
            // Find package data
            const selectedPackage = travelPackages.find(pkg => pkg.id === packageId);
            
            if (selectedPackage) {
                // Save to localStorage for version_c.html to use
                localStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
                
                // Redirect to payment page
                window.location.href = 'version_c.html';
            }
        });
    }
}

// Pause auto-rotate when user hovers over carousel (desktop)
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoRotate);
    carouselContainer.addEventListener('mouseleave', startAutoRotate);
    
    // Add touch/swipe support for mobile devices
    addTouchSupport(carouselContainer);
}

// ============================================
// MOBILE TOUCH/SWIPE SUPPORT
// ============================================

function addTouchSupport(element) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    element.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoRotate(); // Pause auto-rotate when user touches
    }, { passive: true });
    
    element.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoRotate(); // Resume auto-rotate after swipe
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) {
            return; // Not a swipe, just a tap
        }
        
        if (swipeDistance > 0) {
            // Swiped right - go to previous
            prevPackage();
        } else {
            // Swiped left - go to next
            nextPackage();
        }
    }
}

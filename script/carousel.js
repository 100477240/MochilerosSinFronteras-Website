// carousel.js - Carousel functionality for travel packages

// Define travel packages data
const travelPackages = [
    {
        id: 1,
        name: "Pack Sudeste Asiático",
        description: "Vietnam, Camboya: buses, hostales y guía de visados",
        price: "600€",
        image: "images/pack-asia.jpg",
        alt: "Backpacking in Southeast Asia"
    },
    {
        id: 2,
        name: "Pack Ruta Inca",
        description: "Perú, Bolivia: trekking, alojamiento y transporte incluido",
        price: "850€",
        image: "images/pack-inca.jpg",
        alt: "Inca Trail backpacking package"
    },
    {
        id: 3,
        name: "Pack Europa del Este",
        description: "Polonia, República Checa, Hungría: trenes y hostales",
        price: "720€",
        image: "images/pack-europe.jpg",
        alt: "Eastern Europe backpacking"
    },
    {
        id: 4,
        name: "Pack África Oriental",
        description: "Tanzania, Kenia: safaris, camping y guías locales",
        price: "1200€",
        image: "images/exp-africa.jpg",
        alt: "East Africa adventure package"
    },
    {
        id: 5,
        name: "Pack Patagonia",
        description: "Argentina, Chile: refugios de montaña y trekkings épicos",
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

// Pause auto-rotate when user hovers over carousel
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', stopAutoRotate);
    carouselContainer.addEventListener('mouseleave', startAutoRotate);
}

// payment.js - Payment form validation for version_c.html

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePayment();
});

function initializePayment() {
    // Check if user is logged in
    const session = getCurrentSession();
    
    if (!session) {
        // Not logged in - redirect to login
        alert('Debes iniciar sesión para realizar una compra.');
        window.location.href = 'index.html';
        return;
    }
    
    // Load package data from localStorage
    loadPackageData();
    
    // Set up form validation
    setupPaymentForm();
}

// Add this helper function at the end of payment.js
function getCurrentSession() {
    let session = localStorage.getItem('currentSession');
    if (!session) {
        session = sessionStorage.getItem('currentSession');
    }
    return session ? JSON.parse(session) : null;
}
// ============================================
// LOAD PACKAGE DATA
// ============================================

function loadPackageData() {
    // Get selected package from localStorage (set by carousel)
    const packageData = localStorage.getItem('selectedPackage');
    
    if (packageData) {
        const package = JSON.parse(packageData);
        updatePackageDisplay(package);
    }
}

function updatePackageDisplay(package) {
    // Update package card with selected data
    const packCard = document.querySelector('.c-pack-card');
    const descriptionSection = document.querySelector('.left-sidebar-widget p');
    
    if (packCard) {
        const img = packCard.querySelector('img');
        const title = packCard.querySelector('h3');
        const description = packCard.querySelector('p:not(.price)');
        const price = packCard.querySelector('.price');
        
        if (img) img.src = package.image;
        if (img) img.alt = package.alt;
        if (title) title.textContent = package.name;
        if (description) description.textContent = package.description;
        if (price) price.textContent = package.price;
    }
    
    // Update long description
    if (descriptionSection && package.longDescription) {
        descriptionSection.textContent = package.longDescription;
    }
}


// ============================================
// FORM VALIDATION
// ============================================

function setupPaymentForm() {
    const form = document.querySelector('.buy-form');
    const purchaseButton = document.querySelector('.boton-comprar');
    const clearButton = document.querySelector('.boton-borrar');
    
    if (!form || !purchaseButton) {
        console.error('Payment form or buttons not found');
        return;
    }
    
    // Handle purchase button click
    purchaseButton.addEventListener('click', function(e) {
        e.preventDefault();
        handlePurchase();
    });
    
    // Handle clear/reset button
    if (clearButton) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearForm();
        });
    }
    
    // Prevent default form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePurchase();
    });
}

// IMPROVED version of handlePurchase() function
function handlePurchase() {
    // Get all form values using IDs (more reliable)
    const fullName = document.querySelector('#full-name');
    const email = document.querySelector('#email');
    const cardType = document.querySelector('#card-type');
    const cardNumber = document.querySelector('#card-number');
    const cardholderName = document.querySelector('#cardholder-name');
    const expirationDate = document.querySelector('#fecha-caducidad');
    const cvv = document.querySelector('#cvv');
    
    // Check if all elements exist
    if (!fullName || !email || !cardType || !cardNumber || !cardholderName || !expirationDate || !cvv) {
        alert('Error: No se pudieron encontrar todos los campos del formulario.');
        return;
    }
    
    const formData = {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        cardType: cardType.value,
        cardNumber: cardNumber.value.trim(),
        cardholderName: cardholderName.value.trim(),
        expirationDate: expirationDate.value,
        cvv: cvv.value.trim()
    };
    
    // Validate all fields
    const validation = validatePaymentForm(formData);
    
    if (!validation.isValid) {
        // Show all errors
        alert('Errores en el formulario:\n\n' + validation.errors.join('\n'));
        return;
    }
    
    // If valid, process purchase
    processPurchase(formData);
}


function validatePaymentForm(data) {
    const errors = [];
    
    // Validate full name (minimum 3 characters)
    if (data.fullName.length < 3) {
        errors.push('• El nombre completo debe tener al menos 3 caracteres.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        errors.push('• El formato del correo electrónico no es válido (debe ser nombre@dominio.extensión).');
    }
    
    // Validate card type is selected
    if (!data.cardType || data.cardType === '') {
        errors.push('• Debes seleccionar un tipo de tarjeta.');
    }
    
    // Validate card number (13, 15, 16, or 19 digits)
    const cardNumberDigits = data.cardNumber.replace(/\s/g, '');
    const validLengths = [13, 15, 16, 19];
    
    if (!validLengths.includes(cardNumberDigits.length)) {
        errors.push('• El número de tarjeta debe tener 13, 15, 16 o 19 dígitos.');
    }
    
    if (!/^\d+$/.test(cardNumberDigits)) {
        errors.push('• El número de tarjeta solo debe contener dígitos.');
    }
    
    // Validate cardholder name (minimum 3 characters)
    if (data.cardholderName.length < 3) {
        errors.push('• El nombre del titular debe tener al menos 3 caracteres.');
    }
    
    // Validate expiration date (must be future date)
    if (!data.expirationDate) {
        errors.push('• Debes seleccionar una fecha de caducidad.');
    } else {
        const expDate = new Date(data.expirationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only dates
        
        if (expDate <= today) {
            errors.push('• La fecha de caducidad debe ser una fecha futura.');
        }
    }
    
    // Validate CVV (exactly 3 digits)
    if (data.cvv.length !== 3) {
        errors.push('• El CVV debe tener exactamente 3 dígitos.');
    }
    
    if (!/^\d{3}$/.test(data.cvv)) {
        errors.push('• El CVV solo debe contener números.');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function processPurchase(formData) {
    // Get package data
    const packageData = localStorage.getItem('selectedPackage');
    const package = packageData ? JSON.parse(packageData) : null;
    
    // Create purchase record
    const purchase = {
        id: Date.now(),
        package: package,
        buyer: {
            name: formData.fullName,
            email: formData.email
        },
        payment: {
            cardType: formData.cardType,
            lastFourDigits: formData.cardNumber.slice(-4)
        },
        purchaseDate: new Date().toISOString(),
        status: 'completed'
    };
    
    // Save purchase to localStorage
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    // Show success message
    const message = `
¡Compra completada con éxito!

Pack: ${package ? package.name : 'N/A'}
Precio: ${package ? package.price : 'N/A'}
Comprador: ${formData.fullName}

Recibirás un email de confirmación en: ${formData.email}

¡Gracias por tu compra!
    `;
    
    alert(message);
    
    // Clear form after successful purchase
    clearForm();
    
    // Optional: Redirect to home page after a delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function clearForm() {
    // Get all form inputs
    const form = document.querySelector('.buy-form');
    
    if (form) {
        // Reset all input fields
        form.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        // Reset select to first option
        const cardSelect = form.querySelector('.card-select');
        if (cardSelect) {
            cardSelect.selectedIndex = 0;
        }
        
        alert('Formulario borrado correctamente.');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format card number with spaces (optional enhancement)
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Add real-time formatting (optional)
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.querySelector('.buy-form input[type="number"][placeholder*="Numero de tarjeta"]');
    
    if (cardNumberInput) {
        // Change input type to text for better formatting
        cardNumberInput.type = 'text';
        // Add inputmode for mobile keyboards
        cardNumberInput.setAttribute('inputmode', 'numeric');
        
        cardNumberInput.addEventListener('input', function() {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            // Limit to 19 digits
            value = value.substring(0, 19);
            // Format with spaces every 4 digits
            this.value = value.match(/.{1,4}/g)?.join(' ') || value;
        });
    }
    
    // Add proper inputmode to CVV field for mobile
    const cvvInput = document.querySelector('#cvv');
    if (cvvInput) {
        cvvInput.setAttribute('inputmode', 'numeric');
    }
});

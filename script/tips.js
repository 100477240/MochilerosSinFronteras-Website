// tips.js - Tips system for version_b.html

// Initialize tips system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTips();
});

function initializeTips() {
    // Load and display existing tips
    loadTips();
    
    // Set up form submission
    setupTipForm();
}

// ============================================
// DISPLAY TIPS
// ============================================

function loadTips() {
    // Get tips from localStorage
    const tips = JSON.parse(localStorage.getItem('travelTips')) || [];
    
    // Get the last 3 tips (most recent)
    const recentTips = tips.slice(-3).reverse();
    
    // Find the tips list container
    const tipsList = document.querySelector('.tips-list');
    
    if (!tipsList) {
        console.error('Tips list container not found');
        return;
    }
    
    // Clear existing tips
    tipsList.innerHTML = '';
    
    // If no tips exist, show default tips
    if (recentTips.length === 0) {
        showDefaultTips(tipsList);
        return;
    }
    
    // Display each tip as a link
    recentTips.forEach(tip => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = tip.title;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showTipDetails(tip);
        });
        li.appendChild(link);
        tipsList.appendChild(li);
    });
}

function showDefaultTips(tipsList) {
    const defaultTips = [
        'Transporte económico entre ciudades',
        'Cómo mantener la salud en los viajes',
        'Evitar robos en rutas concurridas',
        'Elementos esenciales en la mochila'
    ];
    
    defaultTips.forEach(tipTitle => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = tipTitle;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Este es un consejo de ejemplo. ¡Añade tus propios consejos usando el formulario!');
        });
        li.appendChild(link);
        tipsList.appendChild(li);
    });
}

function showTipDetails(tip) {
    const message = `
Título: ${tip.title}

Descripción: ${tip.description}

Autor: ${tip.author}
Fecha: ${new Date(tip.timestamp).toLocaleDateString('es-ES')}
    `;
    alert(message);
}

// ============================================
// ADD NEW TIP
// ============================================

function setupTipForm() {
    // Find the tip form
    const tipForm = document.querySelector('.tip-form');
    const submitButton = document.querySelector('.tip-submit-button');
    
    if (!tipForm || !submitButton) {
        console.error('Tip form or submit button not found');
        return;
    }
    
    // Handle form submission
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleTipSubmission();
    });
    
    // Also handle Enter key in form
    tipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleTipSubmission();
    });
}

function handleTipSubmission() {
    // Get form inputs
    const titleInput = document.querySelector('#tip-title');
    const descriptionInput = document.querySelector('#tip-description');
    
    if (!titleInput || !descriptionInput) {
        console.error('Tip form inputs not found');
        return;
    }
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    
    // Validate tip
    const validation = validateTip(title, description);
    
    if (!validation.isValid) {
        alert(validation.message);
        return;
    }
    
    // Get current user from session
    const session = getCurrentSession();
    const author = session ? session.name : 'Usuario Anónimo';
    
    // Add tip
    addTip(title, description, author);
    
    // Clear form
    titleInput.value = '';
    descriptionInput.value = '';
    
    // Show success message
    alert('¡Consejo añadido exitosamente!');
}

function validateTip(title, description) {
    // Check title length (minimum 15 characters)
    if (title.length < 15) {
        return {
            isValid: false,
            message: 'El título debe tener al menos 15 caracteres.'
        };
    }
    
    // Check description length (minimum 30 characters)
    if (description.length < 30) {
        return {
            isValid: false,
            message: 'La descripción debe tener al menos 30 caracteres.'
        };
    }
    
    return { isValid: true };
}

function addTip(title, description, author) {
    // Get existing tips
    const tips = JSON.parse(localStorage.getItem('travelTips')) || [];
    
    // Create new tip object
    const newTip = {
        id: Date.now(),
        title: title,
        description: description,
        author: author,
        timestamp: new Date().toISOString()
    };
    
    // Add to tips array
    tips.push(newTip);
    
    // Save to localStorage
    localStorage.setItem('travelTips', JSON.stringify(tips));
    
    // Reload tips display
    loadTips();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCurrentSession() {
    // Check both localStorage and sessionStorage
    let session = localStorage.getItem('currentSession');
    
    if (!session) {
        session = sessionStorage.getItem('currentSession');
    }
    
    return session ? JSON.parse(session) : null;
}

// auth.js - Authentication and session management

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// Main initialization function
function initializeAuth() {
    // Check which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        setupLoginForm();
    } else if (currentPage === 'version_b.html') {
        checkSession();
        setupLogout();
        displayUserProfile();
    }
}

// ============================================
// LOGIN FUNCTIONALITY (index.html)
// ============================================

function setupLoginForm() {
    const loginButton = document.querySelector('.login-button');
    const loginForm = document.querySelector('.login-form');
    
    if (loginButton && loginForm) {
        // Prevent default link behavior
        loginButton.addEventListener('click', function(event) {
            event.preventDefault();
            handleLogin();
        });
        
        // Also handle form submission (Enter key)
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    // Get form values
    const usernameInput = document.querySelector('.login-form input[type="text"]');
    const passwordInput = document.querySelector('.login-form input[type="password"]');
    const rememberCheckbox = document.querySelector('.login-form input[type="checkbox"]');
    
    if (!usernameInput || !passwordInput) {
        console.error('Login form inputs not found');
        return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;
    
    // Validate inputs
    if (username === '' || password === '') {
        showErrorPopup('Por favor, completa todos los campos.');
        return;
    }
    
    // Check credentials against stored users
    if (validateCredentials(username, password)) {
        // Successful login
        createSession(username, rememberMe);
        
        // Redirect to logged-in page
        window.location.href = 'version_b.html';
    } else {
        // Failed login
        showErrorPopup('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
}

function validateCredentials(username, password) {
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Find user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);
    
    // For testing purposes, also accept default test account
    if (username === 'testuser' && password === 'Test1234!') {
        // Create test user if it doesn't exist
        if (!user) {
            const testUser = {
                username: 'testuser',
                password: 'Test1234!',
                name: 'Usuario',
                lastName: 'de Prueba',
                email: 'test@example.com',
                profilePicture: null
            };
            users.push(testUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
        return true;
    }
    
    return user !== undefined;
}

function createSession(username, rememberMe) {
    // Get user data
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => u.username === username);
    
    // Create session object
    const session = {
        username: username,
        name: user ? user.name : 'Usuario',
        lastName: user ? user.lastName : '',
        email: user ? user.email : '',
        profilePicture: user ? user.profilePicture : null,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };
    
    // Store session
    if (rememberMe) {
        // Store in localStorage (persistent)
        localStorage.setItem('currentSession', JSON.stringify(session));
    } else {
        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('currentSession', JSON.stringify(session));
    }
}

function showErrorPopup(message) {
    // Display error message using window.alert
    window.alert(message);
}

// ============================================
// SESSION MANAGEMENT (version_b.html)
// ============================================

function checkSession() {
    // Check for active session
    const session = getCurrentSession();
    
    if (!session) {
        // No active session - redirect to login
        window.alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'index.html';
    }
}

function getCurrentSession() {
    // Check both localStorage and sessionStorage
    let session = localStorage.getItem('currentSession');
    
    if (!session) {
        session = sessionStorage.getItem('currentSession');
    }
    
    return session ? JSON.parse(session) : null;
}

function displayUserProfile() {
    const session = getCurrentSession();
    
    if (!session) {
        return;
    }
    
    // Update user greeting in the page
    const userGreeting = document.querySelector('.user-greeting');
    if (userGreeting) {
        userGreeting.textContent = `¡Hola, ${session.name}!`;
    }
    
    // Update profile picture if exists
    const profilePicture = document.querySelector('.user-profile-picture');
    if (profilePicture && session.profilePicture) {
        profilePicture.src = session.profilePicture;
        profilePicture.alt = `${session.name} ${session.lastName}`;
    }
    
    // Update any other user-specific elements
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = `${session.name} ${session.lastName}`;
    });
}

// ============================================
// LOGOUT FUNCTIONALITY (version_b.html)
// ============================================

function setupLogout() {
    const logoutButton = document.querySelector('.logout-button');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();
            handleLogout();
        });
    }
}

function handleLogout() {
    // Show confirmation popup
    const confirmed = window.confirm('¿Estás seguro de que deseas cerrar sesión?');
    
    if (confirmed) {
        // Clear session data
        clearSession();
        
        // Redirect to homepage
        window.location.href = 'index.html';
    }
}

function clearSession() {
    // Remove session from both storage types
    localStorage.removeItem('currentSession');
    sessionStorage.removeItem('currentSession');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Check if user is logged in (can be called from any page)
function isLoggedIn() {
    return getCurrentSession() !== null;
}

// Get current user data
function getCurrentUser() {
    return getCurrentSession();
}

// Export functions for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isLoggedIn,
        getCurrentUser,
        clearSession
    };
}

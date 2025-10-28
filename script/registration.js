// registration.js - Registration system

$(document).ready(function () { 
    initializeRegistration(); 
});

function initializeRegistration() {
    const $submitBtn = $('.submit-button');
    const $privacyCheck = $('#privacidad');
    const $profilePic = $('#foto-perfil');

    // Submit button deactivated initially
    $submitBtn.css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' });

    // Enable/disable submit based on privacy checkbox
    $privacyCheck.on('change', function () {
        if ($(this).is(':checked')) {
            $submitBtn.css({ 'opacity': '1', 'cursor': 'pointer', 'pointer-events': 'auto' });
        } else {
            $submitBtn.css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' }); 
        }
    });

    // Show filename when profile picture is selected
    $profilePic.on('change', function () { 
        const fileName = this.files.length > 0 ? this.files[0].name : 'Seleccionar archivo'; 
        $('.file-upload span').text(fileName); 
    });

    // Handle form submission
    $submitBtn.on('click', function (e) { 
        e.preventDefault(); 
        handleRegistration(); 
    });
}

function handleRegistration() {
    // Check privacy policy
    if (!$('#privacidad').is(':checked')) { 
        alert('Debes aceptar la política de privacidad para continuar.');
        return;
    }

    // Get form data
    const formData = {
        name: $('#nombre').val().trim(), 
        lastName: $('#apellidos').val().trim(),
        email: $('#email').val().trim(),
        confirmEmail: $('#confirm-email').val().trim(),
        birthDate: $('#fecha-nacimiento').val(),
        username: $('#login').val().trim(),
        password: $('#password').val(), 
        profilePicture: $('#foto-perfil')[0].files[0]
    };

    // Validate all fields
    const validation = validateAllFields(formData);

    if (!validation.isValid) { 
        alert(validation.errors.join('\n')); 
        return; 
    }

    // Save user data
    saveUserData(formData, function (success) {
        if (success) {
            alert('¡Registro completado con éxito! Redirigiendo...');
            setTimeout(() => { 
                createSessionAfterRegistration(formData); 
                window.location.href = 'version_b.html'; 
            }, 1000);
        }
    });
}

// Validate all fields according to requirements
function validateAllFields(data) {
    const errors = [];

    // Name minimum 3 characters
    if (data.name.length < 3) { 
        errors.push('El nombre debe tener al menos 3 caracteres.'); 
    }

    // Check last name (3 characters each word)
    const lastNameParts = data.lastName.split(' ').filter(p => p.length > 0);
    if (lastNameParts.length < 2) {
        errors.push('Los apellidos deben tener al menos dos palabras.'); 
    } else if (lastNameParts.some(p => p.length < 3)) { 
        errors.push('Cada apellido debe tener al menos 3 caracteres.'); 
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) { 
        errors.push('El formato del correo electrónico no es válido.'); 
    }

    // Check email confirmation
    if (data.email !== data.confirmEmail) { 
        errors.push('Los dos correos deben ser iguales.'); 
    }

    // Check birth date
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        const minDate = new Date('1900-01-01');
        
        if (birthDate > today) { 
            errors.push('La fecha de nacimiento no puede estar en el futuro.'); 
        }
        if (birthDate < minDate) { 
            errors.push('La fecha de nacimiento no es válida.'); 
        }
        
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) { 
            errors.push('Debes tener 13 años o más.'); 
        }
    }

    // Check username length
    if (data.username.length < 5) {
        errors.push('El nombre de usuario debe tener al menos 5 caracteres.'); 
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (users.some(u => u.username === data.username)) { 
        errors.push('Este nombre de usuario ya está en uso.'); 
    }

    // Check password
    const pwdValidation = validatePassword(data.password);
    if (!pwdValidation.isValid) {
        errors.push(pwdValidation.message); 
    }

    // Check profile picture format
    if (data.profilePicture) {
        const validFormats = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!validFormats.includes(data.profilePicture.type)) { 
            errors.push('La imagen debe tener un formato válido: webp, png o jpg.'); 
        }
    }

    return { 
        isValid: errors.length === 0, 
        errors: errors
    };
}

function validatePassword(password) {
    if (password.length < 8) {
        return { 
            isValid: false, 
            message: 'La contraseña debe tener 8 caracteres o más.' 
        };
    }

    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < 2) { 
        return { 
            isValid: false, 
            message: 'La contraseña debe tener 2 números o más.' 
        }; 
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) { 
        return { 
            isValid: false, 
            message: 'La contraseña debe contener al menos 1 carácter especial.' 
        }; 
    }

    if (!/[A-Z]/.test(password)) {
        return { 
            isValid: false, 
            message: 'La contraseña debe contener al menos 1 letra mayúscula.' 
        };
    }

    if (!/[a-z]/.test(password)) {
        return { 
            isValid: false, 
            message: 'La contraseña debe contener al menos 1 letra minúscula.' 
        };
    }
    
    return { isValid: true };
}

function saveUserData(data, callback) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    if (data.profilePicture) {
        // Convert image to base64
        const reader = new FileReader();

        reader.onload = function (e) {
            const newUser = {
                name: data.name, 
                lastName: data.lastName, 
                email: data.email, 
                birthDate: data.birthDate,
                username: data.username, 
                password: data.password, 
                profilePicture: e.target.result,
                registrationDate: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            callback(true);
        };
        
        reader.onerror = function () {
            callback(false);
        };

        reader.readAsDataURL(data.profilePicture);
    } else {
        // No profile picture
        const newUser = {
            name: data.name, 
            lastName: data.lastName, 
            email: data.email, 
            birthDate: data.birthDate,
            username: data.username, 
            password: data.password, 
            profilePicture: null,
            registrationDate: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        callback(true);
    }
}

// Create session after successful registration
function createSessionAfterRegistration(data) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => u.username === data.username);

    const session = {
        username: data.username,
        name: data.name, 
        lastName: data.lastName, 
        email: data.email,
        profilePicture: user ? user.profilePicture : null,
        loginTime: new Date().toISOString(), 
        rememberMe: false
    };
    
    sessionStorage.setItem('currentSession', JSON.stringify(session));
}

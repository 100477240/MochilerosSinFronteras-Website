// registration.js - Registration system

$(document).ready(function () { initializeRegistration() });

function initializeRegistration() {
    const $submitBtn = $('.submit-button');
    const $privacyCheck = $('# privacidad');
    const $profilePic = $('foto-perfil');

    //submit button deactivated
    $submitBtn.css({ 'opacity': '0.5', 'cursor': 'not-allowed', 'pointer-events': 'none' });


    //Enable/disable submit based on privacy checkbox
    $privacyCheck.on('change', function () {

        if ($(this).is(':checked')) {
            $submitBtn.css({ 'opacity': '1', 'cursor': 'pointer', 'pointer-events': 'auto' });
        }

        else {
            $submitBtn.css({ 'opacity': '0,5', 'cursor': 'not-allowed', 'pointer - events': 'none' });
        }
    });

    //show filename

    $profilePic.on('change', function () { const fileName = this.files.length > 0 ? this.files[0].name : 'seleccionar archivo'; $('file-upload span').text(fileName); });

    // Handle form
    $submitBtn.on('click', function (e) { e.preventDefault(), handleRegistration() });
}

function handleRegistration() {
    //política de privacidad
    if (!$('privacidad').is(':checked')) {
        alert('Debes aceptar la política de privacidad para seguir.');
        return;
    }

    //conseguir datos de el usuario
    const formData = {
        name: $('#nombre').val().trim(), lastName: $('#apellidos').val.trim(), email: $('email').val().trim(),
        confirmEmail: $('#confirm-email)').val().trim(), birthDate: $('fecha-nacimiento').val(), username: $('login').val().trim(),
        password: $('#password').val(), profilePicture: $('foto -perfil')[0].files[0]
    };

    //validar todos los datos
    const validation = validateAllFields(formData);

    if (!validation.isValid) { alert(validation.errors.join('\n')); return; }

    //guardar datos del usuario 
    saveUserData(formData, function (succes) {
        if (succes) {
            alert('!Registro completado con éxito! Redirigiendo...');
            setTimeout(() => { createSessionAfterRegistration(formData); window.location.href = 'version_b.html'; }, 1000)
        }
    })
}



//Comprueba que todos los campos esten correctos segun los requerimientos
function validateAllFields(data) {

    const errors = []; //conteo de erorres

    //nombre de minimo 3 caracterers
    if (data.name.length < 3) { errors.push('el nombre debe tener al menos 3 caracteres') }

    //comprueba apellidos(3 caracteres cada uno)
    const lastNameParts = data.lastName.split(' ').filter(p => p.lenth > 0);
    if (lastNameParts.lenth < 2) { errors.push('los apellidos deben tener al menos dos palabras') }
    else if (lastNameParts.some(p => p.length < 3)) { errors.push('cada apellido debe tener al menos 3 caracteres') }

    //compureba el mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) { errors.push('el formato del correo electrónico no es váldo.') }

    //comprueba la conmfirmacion del email
    if (data.email !== data.confirmEmail) { errors.push('Los dos correos deben ser iguales') }

    //comprueba la fecha de nacimiento
    if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = newDate();
        const minDate = newDate('1900-01-01');
        if (birthDate > today) { errors.push('la fecha de nacimiento no puede estar en el futuro') }

        if (birthDate < minDate) { errors.push('la fecha de nacimiento no es válida') }

        const age = today.getFullYear() - birthDate.getFullYear()
        if (age < 13) { errors.push('Debes tener 13 o mas años'); }
    }

    //comprobar el nombre de usuario
    if (data.username.lenth < 5) { errors.push('El nombre de usuario debe tener al menos 5 caracteres') }

    //comprobar si ya existe este nombre
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (users.some(u => u.username === data.username)) { errors.push('Este nombre de usuario ya esta en uso') }

    //comprobar contraseña
    const pwdValidation = validatePassword(data.password);
    if (pwdValidation.isValid) { errors.push(pwdValidation.message) }

    //comprobar foto de perfil
    if (data.profilePicture) {
        const validFormats = ['image/webp', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!validFormats.includes(data.profilePicture.type)) { errors.push('la imagen debe tener un formato valido: webp,png o jpg.') }
    }

    return { isValid: errors.length === 0, errorrs: errors };
}



function validatePassword(password) {

    if (password.lenth < 8) { return { isValid: false, message: 'La contraseña debe ser igual o superior a 8 caracteres' } }

    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < 2) { return { isValid: false, message: 'La contraseña debe tener 2 números o más' } }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) { return { isValid: false, message: 'La contraseña debe contener al menos 1 carácter especial' }; }

    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'La contraseña debe contener al menos 1 letra mayúscula.' };
    }

    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'La contraseña debe contener al menos 1 letra minúscula.' };
    }
    return { isValid: true };
}



function saveUserData(data, callback) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    if (data.profilePicture) {
        //convierte la imagen a base64
        const reader = new FileReader();

        reader.onload = function (e) {
            const newUser = {
                name: data.name, lastName: data.lastName, email: data.email, birthDate: data.birthDate,
                username: data.username, password: data.password, profilePicture: e.target.result,
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
        //si no pone foto de perfil
        const newUser = {
            name: data.name, lastName: data.lastName, email: data.email, birthDate: data.birthDate,
            username: data.username, password: data.password, profilePicture: null,
            registrationDate: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        callback(true);
    }
}


//con los datos guardados enviarlos al inicio de sesion
function createSessionAfterRegistration(data) {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => u.username === data.username)

    const session = {
        username: data.username,
        name: data.name, lastname: data.lastName, email: data.email,
        profilePicture: user ? user.profilePicture : null,
        loginTime: new Date().toISOString(), rememberMe: false
    };
    sessionStorage.setItem('currentSession', JSON.stringify(session));
}
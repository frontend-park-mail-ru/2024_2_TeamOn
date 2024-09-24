

import { state, users, maxAttempts } from '../consts.js';
import { removeError, showError } from '../utils/errors.js';
import { fetchAjax } from '../utils/fetchAjax.js'; 
import { goToPage } from '../index.js'


export let attempts = 0;
export function validateLoginForm(inputLogin, inputPassword){
    let hasError = false;
    if (!users[DOMPurify.sanitize(inputLogin.value)] || users[DOMPurify.sanitize(inputLogin.value)].password != DOMPurify.sanitize(inputPassword.value) ) {
        showError(inputLogin, '');
        showError(inputPassword, `Неправильный логин или пароль, осталось ${maxAttempts-attempts} попыток`);
        if ( checkAttempts(attempts) ) {
            goToPage(state.menuElements.home);
        }
        hasError = true;
    }
    return hasError
}

export function validateErrorLoginForm(form, inputLogin,inputPassword ) {
    const errors = form.querySelectorAll('.error');
    for (let i = 0; i < errors.length; i++) {
        errors[i].remove();
    }

    let hasError = false;
    
    if (!DOMPurify.sanitize(inputLogin.value).trim()) {
        showError(inputLogin, 'Пожалуйста, введите логин');
        hasError = true;
    }else {
        removeError(inputLogin)
    }

    if (!DOMPurify.sanitize(inputPassword.value)) {
        showError(inputPassword, 'Пожалуйста, введите пароль');
        hasError = true;
    }else {
        removeError(inputPassword)
    }

    return hasError
}


export function authLogin(form, inputLogin, inputPassword){
    if (!validateErrorLoginForm(form, inputLogin, inputPassword) && !validateLoginForm(inputLogin, inputPassword)) {
        const password = DOMPurify.sanitize(inputPassword.value);

        fetchAjax('POST', '/login', { password }, (status, response) => {
            if ( status === 200 ){
                state.currentUser = users[DOMPurify.sanitize(inputLogin.value)]
                localStorage.setItem('login', DOMPurify.sanitize(inputLogin.value));
                sessionStorage.setItem('login', DOMPurify.sanitize(inputLogin.value));
                goToPage(state.menuElements.profile);
            }
        });
    }
}

function checkAttempts(attempts){
    if (attempts < maxAttempts) {
        return false
    } else {
        return true
    }
}

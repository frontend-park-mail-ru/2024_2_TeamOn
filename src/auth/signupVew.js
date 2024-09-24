import { state } from '../consts.js';
import {goToPage} from '../index.js'
import { authSignup, validateSignupForm } from './signup.js';

export function renderSignup() {
    const backgroundLayer = document.createElement('div');
    backgroundLayer.className = 'background-signup';

    const form = document.createElement('form');
    form.className = 'container-signup';

    const closeBtn = document.createElement('button');

    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = 'x';
    closeBtn.onclick = () => {
        goToPage(state.menuElements.home);
    };

    const h2 = document.createElement('h2');
    h2.textContent = 'Регистрация';

    const inputUsername = document.createElement('input');
    inputUsername.type = 'text';
    inputUsername.placeholder = 'Введите имя пользователя';

    const inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.placeholder = 'Придумайте пароль (минимум 8 символов)';

    const inputRepeatPassword = document.createElement('input');
    inputRepeatPassword.type = 'password';
    inputRepeatPassword.placeholder = 'Повторите пароль';

    const buttonRegister = document.createElement('input');
    buttonRegister.value = 'Зарегистрироваться';
    buttonRegister.type = 'submit'

    buttonRegister.addEventListener('click', (e) => {
        e.preventDefault(); 
        authSignup(form, inputPassword, inputRepeatPassword, inputUsername);
    });
    
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            authSignup(form, inputUsername, inputPassword, inputRepeatPassword );
        }
    });
 
    form.addEventListener('input', (e) => {
        e.preventDefault();
        validateSignupForm(form, inputUsername, inputPassword, inputRepeatPassword);
    });

    form.append(closeBtn);
    //inputUsername.appendChild(input);

    form.appendChild(h2);
    form.appendChild(inputUsername);
    form.appendChild(inputPassword);
    form.appendChild(inputRepeatPassword);
    form.appendChild(buttonRegister);
    backgroundLayer.appendChild(form);
    document.body.appendChild(backgroundLayer);
    return backgroundLayer;


}    
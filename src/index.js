 
import { users, maxAttempts, state } from '../const.js';
import { renderLogin } from './auth/loginView.js';
import { renderSignup } from './auth/signupVew.js';
import { renderError } from './pages/error.js';
import { renderProfile } from './pages/profile.js';
import { renderMenu } from './menu/menu.js';
import { renderHome } from './pages/home.js';

const root = document.getElementById('root');
export const menuContainer = document.createElement('aside');
const pageContainer = document.createElement('main');
root.appendChild(pageContainer);

const localStorage = window.localStorage;
const sessionStorage = window.sessionStorage;

const config = {
    menu: {
        home: {
            href: '/',
            text: 'Домашняя страница',
            render: renderHome
        },
        login: {
            href: '/login',
            text: 'Авторизация',
            render: renderLogin
        },
        signup: {
            href: '/signup',
            text: 'Регистрация',
            render: renderSignup
        },
        profile: {
            href: '/profile',
            text: 'Профиль',
            render: renderProfile
        },/*
        feed: {
            href: '/feed',
            text: 'Лента',
            render: renderFeed
        },*/
        error: {
            href: '/error',
            text: 'Ошибка',
            render: renderError
        }
    }
};


export function addUser(username, email = null, password, imagesrc = null) { // tmp
    users[username] = {
        email,
        password,
        imagesrc
    };
}

export function goToPage(targetLinkMenu, statusErr = null) {
    pageContainer.innerHTML = "";
  
    state.activePageLink.classList.remove("active");
    targetLinkMenu.classList.add("active");
    state.activePageLink = targetLinkMenu;
  
    const newPageElement =
      config.menu[targetLinkMenu.dataset.section].render(statusErr);
  
    pageContainer.appendChild(newPageElement);
  }
  
  menuContainer.addEventListener("click", (event) => {
    const { target } = event;
    if (
      target.tagName.toLowerCase() === "a" ||
      target instanceof HTMLAnchorElement
    ) {
      event.preventDefault();
  
      goToPage(target);
    }
  });
  
  renderMenu(config.menu);
  goToPage(state.menuElements.home);
  
/**
 * Отправляет запрос AJAX с помощью Fetch API с включенным CORS.
 * @param {*} method    HTTP-метод
 * @param {*} url       URL, на который отправляется запрос
 * @param {*} body      Тело запроса (необязательное)
 * @param {*} callback  Функция обратного вызова, вызываемая с ответом
 * 
Эта функция отправляет запрос AJAX с помощью Fetch API с включенным CORS.
Она устанавливает заголовок Origin в * и включает заголовок Content-Type
со значением application/json; charset=utf-8, если предоставлено тело запроса.
Опция mode установлена в cors, чтобы включить CORS.
 */
/*
function fetchAjax(method, url, body = null, callback) {
    const headers = {};
  
    if (body) {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      body = JSON.stringify(body);
    }

    const init = {
      method,
      headers,
      body,
      mode: 'cors',
      credentials: 'include',
    };
  
    console.log('Sending fetch request...');
    fetch(url, init)
    .then(response => {
        response.text().then(text => {
          callback(response.status, text);
        });
    })
}
    */
/*
function renderLogin() {
    const backgroundLayer = document.createElement('div');
    backgroundLayer.className = 'background-login';
    
    const loginContainer = document.createElement('div');
    const h2 = document.createElement('h2');
    const form = document.createElement('form');
    const inputLogin = document.createElement('input');
    const inputPassword = document.createElement('input');
    const submitButton = document.createElement('input');
    const registerLink = document.createElement('div');
    const registerLinkAnchor = document.createElement('a');
    const closeBtn = document.createElement('button');

    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = 'x';
    closeBtn.onclick = () => {
        goToPage(state.menuElements.home);
    };

    loginContainer.className = 'login-container';
    
    loginContainer.appendChild(closeBtn);
    loginContainer.appendChild(h2);

    h2.textContent = 'Вход';

    loginContainer.appendChild(form);

    inputLogin.type = 'text';
    inputLogin.placeholder = 'Введите email или имя пользователя';
    inputLogin.required = true;
    form.appendChild(inputLogin);

    inputPassword.type = 'password';
    inputPassword.placeholder = 'Введите пароль';
    inputPassword.required = true;
    form.appendChild(inputPassword);

    submitButton.type = 'submit';
    submitButton.value = 'Войти';
    form.appendChild(submitButton);

    registerLink.className = 'register-link';
    registerLink.textContent = 'У вас нет аккаунта? ';
    registerLinkAnchor.textContent = 'Зарегистрируйтесь';
    registerLink.appendChild(registerLinkAnchor);
    loginContainer.appendChild(registerLink);

    registerLinkAnchor.addEventListener('click', (e) => {
        goToPage(state.menuElements.signup);
    });

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        auth();
        attempts++;

    });

    submitButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  
            auth();
            attempts++;
        }
    });
    form.addEventListener('input', (e) => {
        e.preventDefault();
        validateErrorLoginForm();
    });


    let attempts = 0;
    function validateLoginForm(){
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
    function validateErrorLoginForm() {
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

    function auth(){
        if (!validateErrorLoginForm() && !validateLoginForm()) {
            const password = DOMPurify.sanitize(inputPassword.value);

            fetchAjax('POST', '/login', { password }, (status, response) => {
                if ( status === 200 ){
                    state.currentUser = users[DOMPurify.sanitize(inputLogin.value)]
                    localStorage.setItem('login', DOMPurify.sanitize(inputLogin.value));
                    sessionStorage.setItem('login', DOMPurify.sanitize(inputLogin.value));
                    goToPage(state.menuElements.profile);
                    return; 
                } else {
                    return;
                }

            });
        }
    }

    backgroundLayer.appendChild(loginContainer)
    return backgroundLayer;
}

export function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = DOMPurify.sanitize(message);
    input.parentElement.insertBefore(error, input.nextSibling);
    input.classList.add('error-input'); 
}
export function removeError(inputField) {
    inputField.classList.remove('error-input');
}

function checkAttempts(attempts){
    if (attempts < maxAttempts) {
        return false
    } else {
        return true
    }
}

function renderError(statusErr) {
    const notFoundDiv = document.createElement('div');
    const notFoundContainer = document.createElement('div');
    const notFound404 = document.createElement('div');
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    const a = document.createElement('a');
    const span = document.createElement('span');

    notFoundDiv.id = 'notfound';

    notFoundContainer.className = 'notfound';

    notFound404.className = 'notfound-404';

    h1.textContent = statusErr;
    if (statusErr > 300) {
        h2.textContent = 'Страница не найдена'
    }

    a.href = '/';
    span.className = 'arrow';
    a.appendChild(span);
    a.appendChild(document.createTextNode('Вернуться на главную'));

    notFound404.appendChild(h1);
    notFoundContainer.appendChild(notFound404);
    notFoundContainer.appendChild(h2);
    notFoundContainer.appendChild(a);
    notFoundDiv.appendChild(notFoundContainer);

    return notFoundDiv
}

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

    form.append(closeBtn)
    form.appendChild(h2);
    form.appendChild(inputUsername);
    form.appendChild(inputPassword);
    form.appendChild(inputRepeatPassword);
    form.appendChild(buttonRegister);

    buttonRegister.addEventListener('click', (e) => {
        e.preventDefault(); 
        auth();
    });
    
    form.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            auth();
        }
    });
 
    form.addEventListener('input', (e) => {
        e.preventDefault();
        validateForm();
    });
    
function validateForm() {
    var errors = form.querySelectorAll('.error');
    let passwordErrors = [];
    
    for (var i = 0; i <errors.length; i++) {
        errors[i].remove();
    }
    
    let hasError = false;
    let firstLoginError = false;
    let firstPasswordError = false;

    if (!DOMPurify.sanitize(inputUsername.value)) {
        showError(inputUsername, 'Пожалуйста, введите логин');
        hasError = true;
        firstLoginError = true;
    } else {
        removeError(inputUsername)
    }

    if (!DOMPurify.sanitize(inputPassword.value)) {
        showError(  inputPassword, 'Пожалуйста, введите пароль');
        hasError = true;
        firstPasswordError = true;
    } else {
        removeError(inputPassword)
    }

    if (DOMPurify.sanitize(inputRepeatPassword.value) != DOMPurify.sanitize(inputPassword.value)) {
        showError(inputRepeatPassword, 'Пароли должны совпадать');
        hasError = true;
    } else {
        removeError(inputRepeatPassword)
    }

    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9-_]+$/.test(DOMPurify.sanitize(inputUsername.value)) && !firstLoginError) {
        showError(inputUsername, 'Логин должен содержать хотя бы одну латинскую букву, и может содержать цифры и знаки "-" "_"');
        hasError = true;
    } else {
        removeError(inputUsername)
    }
    if ((DOMPurify.sanitize(inputUsername.value).length < 4 || DOMPurify.sanitize(inputUsername.value).length > 10) && !firstLoginError) {
        showError(inputUsername, 'Логин должен быть не менее 4 и не более 10 символов');
        hasError = true;
    } else {
        removeError(inputUsername)
    }

    if (DOMPurify.sanitize(inputPassword.value).length < 8 || DOMPurify.sanitize(inputPassword.value).length > 64) {
        passwordErrors.push('Пароль должен быть не менее 8 и не более 64 символов');
    }

    if (!/[0-9]/.test(DOMPurify.sanitize(inputPassword.value))) {
        passwordErrors.push('Пароль должен содержать хотя бы одну цифру');
    }    
    if (!/[!@#$%^&*]/.test(DOMPurify.sanitize(inputPassword.value))) {
        passwordErrors.push('Пароль должен содержать хотя бы один спецсимвол');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(DOMPurify.sanitize(inputPassword.value))) {
        passwordErrors.push('Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре и одну в верхнем регистре');
    }

    if (passwordErrors.length > 0 && !firstPasswordError) {
        showError(inputPassword, passwordErrors.join('<br>'));
        hasError = true;
    } else {
        removeError(inputPassword)
    }

    if (users[DOMPurify.sanitize(inputUsername.value)] && !firstLoginError) {
        showError(inputUsername, 'Пользователь с таким именем уже существует');
        hasError = true;
    } else {
        removeError(inputUsername)
    }
    return hasError
    }
    function auth(){
        const password = DOMPurify.sanitize(inputPassword.value);
        const passwordDouble = DOMPurify.sanitize(inputRepeatPassword.value);
        if (!validateForm()) {
            fetchAjax('POST', '/signup', { password }, (status, response) => {
                if (status >= 200 && status < 300) {
                    addUser(DOMPurify.sanitize(inputUsername.value), null, password, null);
                    goToPage(state.menuElements.login);
                    return;
                }
                if (status >= 400 && status < 500) {
                    goToPage(state.menuElements.error, status);
                    return;
                }
            });
        }
    }
    
    backgroundLayer.appendChild(form)
    return backgroundLayer;
}
*/

/*
function renderMenu( conf, id = null ) {
    Object.entries(conf).forEach(([key, { href, text }], index) => {
        const menuElement = document.createElement('a');
        menuElement.href = href;
        menuElement.textContent = text;
        menuElement.dataset.section = key;

        if (index === 0) {
            menuElement.classList.add('active');
            state.activePageLink = menuElement;
        }

        state.menuElements[key] = menuElement;
        menuContainer.appendChild(menuElement);
    });
}

function renderHome(conf=null, id = null) {

    const savedLogin = localStorage.getItem('login');
    if (savedLogin ) {
        state.currentUser = users[savedLogin];
        goToPage(state.menuElements.profile);
    }

    const container = document.createElement('div');
    const overlay = document.createElement('div');
    const header = document.createElement('div');
    const buttons = document.createElement('div');
    const loginButton = document.createElement('a');


    container.classList.add('home-container');

    overlay.classList.add('home-overlay');

    header.classList.add('home-header');
    header.textContent = 'логотипчик';


    buttons.classList.add('home-buttons');

    loginButton.classList.add('home-button');
    loginButton.textContent = 'Войти';

    container.appendChild(overlay);
    container.appendChild(header);
    buttons.appendChild(loginButton);
    container.appendChild(buttons);

    loginButton.onclick = () => {
        goToPage(state.menuElements.login);
    };
    return container;
}
*/


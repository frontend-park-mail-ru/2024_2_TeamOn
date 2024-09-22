 
import { users, maxAttempts, state } from './const.js';

const root = document.getElementById('root');
const menuContainer = document.createElement('aside');
const pageContainer = document.createElement('main');
root.appendChild(pageContainer);


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
        },
        feed: {
            href: '/feed',
            text: 'Лента',
            render: renderFeed
        },
        error: {
            href: '/error',
            text: 'Ошибка',
            render: renderError
        }
    }
};

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

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
function fetchAjax(method, url, body = null, callback) {
    const headers = {
        Origin: '*', 
    };

    if (body) {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      body = JSON.stringify(body);
    }
  
    const init = {
      method,
      headers,
      body,
      mode: 'cors',  
    };
  
    fetch(url, init)
    .then(response => {
        response.text().then(text => callback(response.status, text));
    })
}
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
        if (!users[inputLogin.value] || users[inputLogin.value].password != inputPassword.value ) {
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
        
        if (!inputLogin.value.trim()) {
            showError(inputLogin, 'Пожалуйста, введите логин');
            hasError = true;
        }else {
            removeError(inputLogin)
        }

        if (!inputPassword.value) {
            showError(inputPassword, 'Пожалуйста, введите пароль');
            hasError = true;
        }else {
            removeError(inputPassword)
        }

        return hasError
    }
    function auth(){
        if (!validateErrorLoginForm() && !validateLoginForm()) {
            const password = inputPassword.value;

            fetchAjax('POST', '/login', { password }, (status, response) => {
                if ( status === 200 ){
                    state.currentUser = users[inputLogin.value]
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

function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = message;
    input.parentElement.insertBefore(error, input.nextSibling);
    input.classList.add('error-input'); 
}
function removeError(inputField) {
    inputField.classList.remove('error-input');
}
function addUser(username, email = null, password, imagesrc = null) { // tmp
    users[username] = {
        email,
        password,
        //name: username,
        imagesrc
    };
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
function renderSignup() {
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

    inputUsername = document.createElement('input');
    inputUsername.type = 'text';
    inputUsername.placeholder = 'Введите имя пользователя';

    const inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.placeholder = 'Придумайте пароль (минимум 8 символов)';

    const inputRepeatPassword = document.createElement('input');
    inputRepeatPassword.type = 'password';
    inputRepeatPassword.placeholder = 'Повторите пароль';

    const buttonRegister = document.createElement('input');
    buttonRegister.value = 'Зарегистрироватsься';
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

        if (!inputUsername.value) {
            showError(inputUsername, 'Пожалуйста, введите логин');
            hasError = true;
            firstLoginError = true;
        } else {
            removeError(inputUsername)
        }

        if (!inputPassword.value) {
            showError(  inputPassword, 'Пожалуйста, введите пароль');
            hasError = true;
            firstPasswordError = true;
        } else {
            removeError(inputPassword)
        }

        if (inputRepeatPassword.value != inputPassword.value) {
            showError(inputRepeatPassword, 'Пароли должны совпадать');
            hasError = true;
        } else {
            removeError(inputRepeatPassword)
        }

        if (!/^[a-zA-Z0-9]+$/.test(inputUsername.value) && !firstLoginError) {
            showError(inputUsername, 'Логин должен содержать только латинские буквы');
            hasError = true;
        } else {
            removeError(inputUsername)
        }

        if (inputPassword.value.length < 8) {
            passwordErrors.push('Пароль должен быть не менее 8 символов');
        }
    
        if (!/[0-9]/.test(inputPassword.value)) {
            passwordErrors.push('Пароль должен содержать хотя бы одну цифру');
        }    
        if (!/[!@#$%^&*]/.test(inputPassword.value)) {
            passwordErrors.push('Пароль должен содержать хотя бы один спецсимвол');
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(inputPassword.value)) {
            passwordErrors.push('Пароль должен содержать хотя бы одну латинскую букву в нижнем регистре и одну в верхнем регистре');
        }
    
        if (passwordErrors.length > 0 && !firstPasswordError) {
            showError(inputPassword, passwordErrors.join('<br>'));
            hasError = true;
        } else {
            removeError(inputPassword)
        }

        if (users[inputUsername.value] && !firstLoginError) {
            showError(inputUsername, 'Пользователь с таким именем уже существует');
            hasError = true;
        } else {
            removeError(inputUsername)
        }
        return hasError
    }
    function auth(){
        const password = inputPassword.value;
        const passwordDouble = inputRepeatPassword.value;
        if (!validateForm()) {
            fetchAjax('POST', '/signup', { password }, (status, response) => {
                if (status >= 200 && status < 300) {
                    addUser(inputUsername.value, null, password, null);
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
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
});

function renderProfile(conf = null, id = null) {
    const user = state.currentUser;
    if (!user) {
        alert(`Вы не авторизованы`);
        goToPage(state.menuElements.login);
        return profileElement;
    } else {
        alert(`Добро пожаловать, ${Object.keys(users).find(key => users[key] === user)}`);
    }

    const header = document.createElement('div');
    header.classList.add('header-profile');
    const nav = document.createElement('nav');
    const navLinks = ['Моя страница', 
                      /*'Лента', 
                      'Настройки'*/];
    const activePage = conf?.activePage || 'Моя страница';  
    
    navLinks.forEach(linkText => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = linkText;
        if (linkText === activePage) {
            link.style.fontWeight = 'bold'; 
        }
        nav.appendChild(link);
    });
    header.appendChild(nav);

    const logoutLink = document.createElement('a');
    logoutLink.classList.add('logout');
    logoutLink.href = '#';
    logoutLink.textContent = 'Выйти';
    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        goToPage(state.menuElements.home);

    })
    header.appendChild(logoutLink);


    const title = document.createElement('h1');
    title.textContent = `${Object.keys(users).find(key => users[key] === user)} о себе: Мы крутышки!`;
    header.appendChild(title);
    document.body.appendChild(header);

    const profile = document.createElement('div');
    profile.classList.add('profile');

    const left = document.createElement('div');
    left.classList.add('left');

    const profileImg = document.createElement('img');
    profileImg.classList.add('image-profile');
    left.appendChild(profileImg);

    const info = document.createElement('div');
    info.classList.add('info');

    const name = document.createElement('h2');
    name.textContent = `${Object.keys(users).find(key => users[key] === user)}`;
    info.appendChild(name);

    const desc = document.createElement('p');
    desc.textContent = 'IT контент';
    info.appendChild(desc);
    
    left.appendChild(info);

    const earnings = document.createElement('div');
    earnings.classList.add('earnings');

    const earningsTitle = document.createElement('h3');
    earningsTitle.textContent = 'Выплаты:';
    earnings.appendChild(earningsTitle);

    const earningsToday = document.createElement('p');
    earningsToday.textContent = 'За сегодня вы заработали:';
    earnings.appendChild(earningsToday);

    const amount = document.createElement('p');
    amount.textContent = ' ';
    earnings.appendChild(amount);

    left.appendChild(earnings);
    profile.appendChild(left);

    const right = document.createElement('div');
    right.classList.add('right');

    const stats = document.createElement('div');
    stats.classList.add('stats');

    const statsData = [
        '2 публикаций',
        '10000 подписчиков',
        '7 подписок'
    ];

    statsData.forEach(statText => {
        const stat = document.createElement('div');
        stat.textContent = statText;
        stats.appendChild(stat);
    });

    right.appendChild(stats);

    const postsContainer = document.createElement('div');
    postsContainer.classList.add('posts');
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0'); 
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const year = currentDate.getFullYear(); 
    const posts = [
        { title: `${Object.keys(users).find(key => users[key] === user)}`, content: 'Всем привет!', date:`${day}.${month}.${year}` },
        { title: `${Object.keys(users).find(key => users[key] === user)}`, content: 'Фронтенд рулит!', date:`${day}.${month}.${year}` }
    ];
    console.log(posts);
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const postTitle = document.createElement('h4');
        postTitle.textContent = post.title;
        postDiv.appendChild(postTitle);

        const postContent = document.createElement('p');
        postContent.textContent = post.content;
        postDiv.appendChild(postContent);

        const postDate = document.createElement('div');
        postDate.classList.add('date');
        postDate.textContent = post.date;
        postDiv.appendChild(postDate);

        postsContainer.appendChild(postDiv);
    });

    right.appendChild(postsContainer);
    profile.appendChild(right);

    document.body.appendChild(profile);
/*
    // создание публикации
    const createButtonDiv = document.createElement('div');
    createButtonDiv.classList.add('create-button');

    const createButton = document.createElement('button');
    createButton.textContent = 'Создать';
    createButtonDiv.appendChild(createButton);

    document.body.appendChild(createButtonDiv);
*/    
}

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

    const container = document.createElement('div');
    const overlay = document.createElement('div');
    const header = document.createElement('div');
    const searchBox = document.createElement('div');
    const searchIcon = document.createElement('i');
    const searchInput = document.createElement('input');
    const buttons = document.createElement('div');
    const loginButton = document.createElement('a');
    const startButton = document.createElement('a');


    container.classList.add('home-container');

    overlay.classList.add('home-overlay');

    header.classList.add('home-header');
    header.textContent = 'логотипчик';

    searchBox.classList.add('home-search-box');

    searchIcon.classList.add('home-fas', 'fa-search');

    /*searchInput.type = 'text';
    searchInput.placeholder = 'Найти автора';*/

    buttons.classList.add('home-buttons');

    loginButton.classList.add('home-button');
    loginButton.textContent = 'Войти';

    /*startButton.classList.add('home-button', 'primary');
    startButton.textContent = 'Начало работы';*/

    container.appendChild(overlay);
    container.appendChild(header);
    //searchBox.appendChild(searchIcon);
    //searchBox.appendChild(searchInput);
    //container.appendChild(searchBox);
    buttons.appendChild(loginButton);
    //buttons.appendChild(startButton);
    container.appendChild(buttons);

    loginButton.onclick = () => {
        goToPage(state.menuElements.login);
    };
    return container;
}

function renderFeed() {

// wait...

}

function goToPage(targetLinkMenu, statusErr = null) {
    pageContainer.innerHTML = '';

    state.activePageLink.classList.remove('active');
    targetLinkMenu.classList.add('active');
    state.activePageLink = targetLinkMenu;

    const newPageElement = config.menu[targetLinkMenu.dataset.section].render(statusErr);

    pageContainer.appendChild(newPageElement);
}

menuContainer.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName.toLowerCase() === 'a' || target instanceof HTMLAnchorElement) {
        event.preventDefault();

        goToPage(target);
    }
});

renderMenu( config.menu );
goToPage(state.menuElements.home);
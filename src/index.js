
const root = document.getElementById('root');
const menuContainer = document.createElement('aside');
const pageContainer = document.createElement('main');
// root.appendChild(menuContainer);
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
        }
    }
};

const state = {
    activePageLink: null,
    menuElements: {},
    currentUser: null
};

const users = {
    'alex': {
        email: 'alex@mail.com',
        password: 'alesha',
        imagesrc: 'https://steamuserimages-a.akamaihd.net/ugc/2041856159322303572/F430E99639B6B932EA68CF4DF6B233ED78AD547B/?imw=512&amp;imh=302&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true',
    },
    'olya': {
        email: 'olya@mail.ru',
        password: '12345',
        imagesrc: 'https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg',
    },
    'danil': {
        email: 'danil@mail.ru',
        password: 'javascript',
        imagesrc: 'https://obruchalki.com/upload/iblock/4f6/4f6d56a0ad82e61874b989aac7146b1e.jpg',
    },
    'polina': {
        email: 'polina@mail.ru',
        password: 'polina_',
        imagesrc: 'https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg',
    }
};

function createInput(type, text, name) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

function ajax(method, url, body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
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
        validateLoginForm();
    });

    submitButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  
            validateLoginForm();
        }
    });

    function validateLoginForm() {
        const errors = form.querySelectorAll('.error');
        for (let i = 0; i < errors.length; i++) {
            errors[i].remove();
        }

        let hasError = false;

        if (!inputLogin.value.trim()) {
            showError(inputLogin, 'Пожалуйста, введите емайл');
            hasError = true;
        }

        if (!inputPassword.value) {
            showError(inputPassword, 'Пожалуйста, введите пароль');
            hasError = true;
        }
        // добавить валидацию на существующий аккаунт

        if (!hasError) {
            const password = inputPassword.value;

            ajax('POST', '/login', { password }, (status, response) => {
                if (status === 200) {
                    goToPage(state.menuElements.profile);
                    return;
                }

                if (status >= 400 && status < 500 && users[inputLogin.value]) {
                    state.currentUser = users[inputLogin.value];
                    alert(`Заглушка ${status}`);
                    goToPage(state.menuElements.profile);
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
    error.style.color = 'red';
    error.innerHTML = message;
    input.parentElement.insertBefore(error, input.nextSibling);
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
    buttonRegister.textContent = 'Зарегистрироваться';
    buttonRegister.type = 'submit'

    form.append(closeBtn)
    form.appendChild(h2);
    form.appendChild(inputUsername);
    form.appendChild(inputPassword);
    form.appendChild(inputRepeatPassword);
    form.appendChild(buttonRegister);

    buttonRegister.addEventListener('click', (e) => {
        e.preventDefault();
        validateForm();
    });
    
    buttonRegister.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            validateForm(); 
        }
    });
    
    function validateForm() {
        var errors = form.querySelectorAll('.error');
        for (var i = 0; i <errors.length; i++) {
            errors[i].remove();
        }
        
        let hasError = false;

        if (!inputUsername.value) {
            showError(inputUsername, 'Пожалуйста, введите емайл');
            hasError = true;
        }

        if (!inputPassword.value) {
            showError(  inputPassword, 'Пожалуйста, введите пароль');
            hasError = true;
        }

        if (inputRepeatPassword.value != inputPassword.value) {
            showError(inputRepeatPassword, 'Пароли должны совпадать');
            hasError = true;
        }

        const password = inputPassword.value;
        const passwordDouble = inputRepeatPassword.value;
        // точно так же сделай на существующий аккаунт

        if (!hasError) {
            ajax('POST', '/signup', { password }, (status, response) => {
                if (status >= 200 && status < 300) {
                    goToPage(state.menuElements.login);
                    return;
                }
                if (status >= 400 && status < 500 && password === passwordDouble) {
                    goToPage(state.menuElements.login);
                    alert(`Регистрация не удалась, но это заглушка ${status}`);
                    return;
                }
            });
        }
    }
    
    backgroundLayer.appendChild(form)
    return backgroundLayer;
}


function renderProfile(conf=null, id = null) {
    const profileElement = document.createElement('div');
    profileElement.className = 'profile'
    const user = state.currentUser;
    if (!user) {
        alert(`Вы не авторизованы`)
        goToPage(state.menuElements.login);
        return profileElement;
    } else {
        alert(`Добро пожаловать, ${Object.keys(users).find(key => users[key] === user)}`)
    }
    const userEmailElement = document.createElement('p');
    const userLoginElement = document.createElement('p');
    const login = Object.keys(users).find(key => users[key] === user)
    const userImageElement = document.createElement('img');

    userEmailElement.textContent = `Email: ${user.email}`;
    userLoginElement.textContent = `Login: ${login}`;
    userImageElement.src = user.imagesrc;

    profileElement.appendChild(userEmailElement);
    profileElement.appendChild(userLoginElement);
    profileElement.appendChild(userImageElement);

    return profileElement;
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

    searchInput.type = 'text';
    searchInput.placeholder = 'Найти автора';

    buttons.classList.add('home-buttons');

    loginButton.classList.add('home-button');
    loginButton.textContent = 'Войти';

    startButton.classList.add('home-button', 'primary');
    startButton.textContent = 'Начало работы';

    container.appendChild(overlay);
    container.appendChild(header);
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    container.appendChild(searchBox);
    buttons.appendChild(loginButton);
    buttons.appendChild(startButton);
    container.appendChild(buttons);

    loginButton.onclick = () => {
        goToPage(state.menuElements.login);
    };
    return container;
}

function renderFeed() {

// wait...

}

function goToPage(targetLinkMenu) {
    pageContainer.innerHTML = '';

    state.activePageLink.classList.remove('active');
    targetLinkMenu.classList.add('active');
    state.activePageLink = targetLinkMenu;

    const newPageElement = config.menu[targetLinkMenu.dataset.section].render();

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
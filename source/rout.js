console.log('lol kek cheburek');

const root = document.getElementById('root');
const menuContainer = document.createElement('aside');
const pageContainer = document.createElement('main');
root.appendChild(menuContainer);
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
        }
    }
};

const state = {
    activePageLink: null,
    menuElements: {}
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

function renderLogin() {
    const form      = document.createElement('form');
    const closeBtn  = document.createElement( 'button' );
    const linkToSignup  = document.createElement( 'a' );

    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = 'X';
    closeBtn.onclick = () => {
        goToPage(state.menuElements.home);
    };

    linkToSignup.innerHTML = 'Нет аккаунта? Зарегистрируйся';
    linkToSignup.onclick = () => {
        //renderMenu( config.menu )
        goToPage( state.menuElements.signup);

    }

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Войти!';

    form.appendChild(closeBtn);
    form.appendChild(linkToSignup)
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        ajax('POST', '/login', { email, password }, (status) => {
            if (status === 200) {
                goToPage(state.menuElements.profile);
                return;
            }

            alert('НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ');
        });
    });

    return form;
}

function renderSignup() {
    const form      = document.createElement('form');
    const closeBtn  = document.createElement('button');

    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = 'X';
    closeBtn.onclick = () => {
        goToPage(state.menuElements.home);
    };

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться!';

    form.appendChild(closeBtn)
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        ajax('POST', '/signup', { email, password }, (status) => {
            if (status >= 200 && status < 300) {
                goToPage(state.menuElements.login);
                return;
            }

            alert('Регистрация не удалась');
        });
    });

    return form;
}

function renderProfile() {
    const profileElement = document.createElement('div');

    ajax('GET', '/me', null, (status, responseString) => {
        const isAuthorized = status === 200;

        if (!isAuthorized) {
            alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
            goToPage(state.menuElements.login);
            return;
        }

        const { email, age, images } = JSON.parse(responseString);

        const span = document.createElement('span');
        span.textContent = `${email} ${age} лет`;
        profileElement.appendChild(span);

        if (images && Array.isArray(images)) {
            const div = document.createElement('div');
            profileElement.appendChild(div);

            images.forEach(({ src, likes }) => {
                div.innerHTML += `<img src="${src}" width="500"/><div>${likes} Лайков</div>`;
            });
        }
    });

    return profileElement;
}

function renderHome(){
    
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
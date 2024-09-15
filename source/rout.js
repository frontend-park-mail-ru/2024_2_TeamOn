console.log('lol kek cheburek');

const root = document.getElementById('root');
const menuContainer = document.createElement('aside');
const pageContainer = document.createElement('main');
root.appendChild(menuContainer);
root.appendChild(pageContainer);

const config = {
    menu: {
        feed: {
            href: '/feed',
            text: 'Лента',
            render: renderFeed
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

function renderMenu() {
    Object.entries(config.menu).forEach(([key, { href, text }], index) => {
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
    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Войти!';

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
    const form = document.createElement('form');

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');
    const ageInput = createInput('number', 'Возраст', 'age');

    const submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.value = 'Зарегистрироваться!';

    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(ageInput);
    form.appendChild(submitBtn);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        ajax('POST', '/signup', { email, password }, (status, response) => {
            if (status >= 200 && status < 300) {
                // Registration successful, redirect to login page
                goToPage(state.menuElements.login);
            } else {
                // Registration failed, display error message
                alert(`Registration failed: ${response} ${status}`);
            }
        });
    });


    return form;
}

function renderFeed() {
    const feedContainer = document.createElement('div');

    ajax('GET', '/feed', null, (status, responseString) => {
        let isAuthorized = status === 200;

        if (!isAuthorized) {
            alert('Нет авторизации!');
            goToPage(state.menuElements.login);
            return;
        }

        const images = JSON.parse(responseString);

        if (images && Array.isArray(images)) {
            const div = document.createElement('div');
            feedContainer.appendChild(div);

            images.forEach(({ src, likes, id }) => {
                div.innerHTML += `<img src="${src}" width="500" />`;
                const likeContainer = document.createElement('div');
                div.appendChild(likeContainer);
                likeContainer.textContent = `${likes} лайков`;
                const button = document.createElement('button');
                button.textContent = 'ЛАЙК';
                button.type = 'button';
                button.dataset.imageId = id;

                likeContainer.appendChild(button);
            });
        }
    });

    feedContainer.addEventListener('click', (event) => {
        if (event.target.tagName.toLowerCase() === 'button' && event.target.dataset.imageId) {
            ajax('POST', '/like', { id: event.target.dataset.imageId }, (status) => {
                if (status === 200) {
                    goToPage(state.menuElements.feed);
                }
            });
        }
    });

    return feedContainer;
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

renderMenu();
goToPage(state.menuElements.feed);

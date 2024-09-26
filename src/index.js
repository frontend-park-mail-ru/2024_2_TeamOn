import { users, state } from './consts.js';
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
 
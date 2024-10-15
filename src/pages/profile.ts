import { goToPage } from "../index";
import { RouterLinks, state } from "../consts";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { fetchAjax } from "../utils/fetchAjax";
import { getItemLocalStorage, removeItemLocalStorage } from "../utils/storages";
import { route, routing } from "../utils/routing";

/**
 * Получение текущего профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", "/api/profile", null, (response) => {
      if (response.ok) {
        response.json().then((data) => {
          resolve(data);
        });
      } else if (response.status === 401) {
        route(RouterLinks.LOGIN);
      } else {
        reject(new Error("Ответ от фетча с ошибкой"));
      }
    });
  });
}
/**
 * Рендер навбара
 * @param {*} conf Конфигурационный объект
 * @param {string} [conf.activePage="Моя страница"] Активная страница
 * @returns
 */
function renderNavbar(conf?: any) {
  const nav = document.createElement(ELEMENTS.NAV);
  const navLinks = ["Моя страница"];
  const activePage = conf?.activePage || "Моя страница";

  navLinks.forEach((linkText) => {
    const link = document.createElement(ELEMENTS.A);
    link.style.cursor = "pointer";
    link.onclick = () => {
      goToPage((state.menuElements as { profile: HTMLElement }).profile);
    };
    link.textContent = linkText;
    if (linkText === activePage) {
      link.style.fontWeight = "bold";
    }
    nav.appendChild(link);
  });
  return nav;
}

/**
 * Функция рендерит информацию о пользователе.
 * @param {*} user Объект пользователя
 * @param {*} payments Объект выплат
 */
function renderUserInfo(user: any, payments?: any) {
  const left = document.createElement(ELEMENTS.DIV);
  left.classList.add(ELEMENTS_CLASS.LEFT);

  const leftbar = document.createElement(ELEMENTS.DIV);
  leftbar.classList.add(ELEMENTS_CLASS.LEFT_BAR);

  const profileImg = document.createElement(ELEMENTS.IMG);
  profileImg.classList.add(ELEMENTS_CLASS.IMAGE_PROFILE);
  leftbar.appendChild(profileImg);

  const info = document.createElement(ELEMENTS.DIV);
  info.classList.add(ELEMENTS_CLASS.INFO);

  const name = document.createElement(ELEMENTS.H2);
  name.textContent = `${user.username}`;
  info.appendChild(name);

  const desc = document.createElement(ELEMENTS.P);
  desc.textContent = `${user.role}`;
  info.appendChild(desc);

  leftbar.appendChild(info);

  const earnings = document.createElement(ELEMENTS.DIV);
  earnings.classList.add(ELEMENTS_CLASS.EARNINGS);

  const earningsTitle = document.createElement(ELEMENTS.H3);
  earningsTitle.textContent = "Выплаты";
  earnings.appendChild(earningsTitle);

  const earningsToday = document.createElement(ELEMENTS.H4);
  earningsToday.textContent = "За сегодня вы заработали:";
  earnings.appendChild(earningsToday);

  const amount = document.createElement(ELEMENTS.P);
  if (!payments) {
    amount.textContent = `0.0 ₽`;
  } else {
    amount.textContent = `${payments.amount}`;
  }
  earnings.appendChild(amount);

  leftbar.appendChild(earnings);
  left.appendChild(leftbar);
  return left;
}

/**
 * Функция рендерит статистику пользователя.
 * @param {*} user Объект пользователя
 * @param {*} posts Объект постов (не используется в функции)
 */
function renderUserStats(user: any, posts = null) {
  const stats = document.createElement(ELEMENTS.DIV);
  stats.classList.add(ELEMENTS_CLASS.STATS);

  const statsData = [
    `посты: ${user.posts_amount}`,
    `подписчики: ${user.subscriptions}`,
    `подписки: ${user.followers}`,
  ];

  statsData.forEach((statText) => {
    const stat = document.createElement(ELEMENTS.DIV);
    stat.textContent = statText;
    stats.appendChild(stat);
  });
  return stats;
}

/**
 * Функция рендерит заголовок настроения пользователя.
 * @param {*} user Объект пользователя
 */
function renderVibe(user: any) {
  const title = document.createElement(ELEMENTS.H1);
  const me = document.createElement(ELEMENTS.H4);
  me.textContent = `ОБО МНЕ`;
  title.textContent = `${user.status}`;
  me.appendChild(title);
  return me;
}

function renderUserPosts(user: any) {
  const postsContainer = document.createElement(ELEMENTS.DIV);
  postsContainer.classList.add("posts");
  const postDiv = document.createElement(ELEMENTS.DIV);
  postDiv.classList.add(ELEMENTS_CLASS.POST);

  const postTitle = document.createElement(ELEMENTS.H4);
  postTitle.textContent = user.posts_title;
  postDiv.appendChild(postTitle);

  const postContent = document.createElement(ELEMENTS.P);
  postContent.textContent = user.posts_content;
  postDiv.appendChild(postContent);

  const postDate = document.createElement(ELEMENTS.DIV);
  postDate.classList.add(ELEMENTS_CLASS.DATE);
  postDate.textContent = user.posts_date;
  postDiv.appendChild(postDate);

  postsContainer.appendChild(postDiv);

  return postsContainer;
}
/**
 * Функция рендерит кнопку выхода из системы.
 * @param {*} Item Ключ, по которому необходимо стереть локальные и сессионные данные
 * @returns
 */
function renderLogoutButton(Item: any) {
  const logoutLink = document.createElement(ELEMENTS.A);
  logoutLink.classList.add(ELEMENTS_CLASS.LOGOUT);
  logoutLink.textContent = "Выйти";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    while (getItemLocalStorage(Item)) {
      removeItemLocalStorage(Item);
    }
    route(RouterLinks.HOME);
    //location.reload();
  });
  return logoutLink;
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    state.currentUser = user;

    const formProfile = document.createElement(ELEMENTS.DIV);
    formProfile.classList.add(ELEMENTS_CLASS.FORM_PROFILE);

    const header = document.createElement(ELEMENTS.DIV);
    header.classList.add(ELEMENTS_CLASS.HEADER_PROFILE);

    header.appendChild(renderNavbar());

    header.appendChild(renderLogoutButton(user.username));

    header.appendChild(renderVibe(user));

    const profile = document.createElement(ELEMENTS.DIV);
    profile.classList.add(ELEMENTS_CLASS.PROFILE);

    profile.appendChild(renderUserInfo(user));

    const right = document.createElement(ELEMENTS.DIV);
    right.classList.add(ELEMENTS_CLASS.RIGHT);

    right.appendChild(renderUserStats(user));

    right.appendChild(renderUserPosts(user));
    profile.appendChild(right);

    formProfile.appendChild(header);
    formProfile.appendChild(profile);

    return formProfile;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}

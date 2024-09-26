import { goToPage } from "../index.js";
import { state, users } from "../consts.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";
function getCurrentUser() {
  return state.currentUser;
}

function renderNavbar(conf) {
  const nav = document.createElement(ELEMENTS.NAV);
  const navLinks = ["Моя страница"];
  const activePage = conf?.activePage || "Моя страница";

  navLinks.forEach((linkText) => {
    const link = document.createElement(ELEMENTS.A);
    link.href = "#";
    link.textContent = linkText;
    if (linkText === activePage) {
      link.style.fontWeight = "bold";
    }
    nav.appendChild(link);
  });
  return nav;
}

function renderUserInfo(user) {
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
  name.textContent = `${Object.keys(users).find((key) => users[key] === user)}`;
  info.appendChild(name);

  const desc = document.createElement(ELEMENTS.P);
  desc.textContent = "IT контент";
  info.appendChild(desc);

  leftbar.appendChild(info);

  const earnings = document.createElement(ELEMENTS.DIV);
  earnings.classList.add(ELEMENTS_CLASS.EARNINGS);

  const earningsTitle = document.createElement(ELEMENTS.H3);
  earningsTitle.textContent = "Выплаты:";
  earnings.appendChild(earningsTitle);

  const earningsToday = document.createElement(ELEMENTS.P);
  earningsToday.textContent = "За сегодня вы заработали:";
  earnings.appendChild(earningsToday);

  const amount = document.createElement(ELEMENTS.P);
  amount.textContent = " ";
  earnings.appendChild(amount);

  leftbar.appendChild(earnings);
  left.appendChild(leftbar);
  return left;
}
function renderUserStats() {
  const stats = document.createElement(ELEMENTS.DIV);
  stats.classList.add(ELEMENTS_CLASS.STATS);

  const statsData = ["2 публикаций", "10000 подписчиков", "7 подписок"];

  statsData.forEach((statText) => {
    const stat = document.createElement(ELEMENTS.DIV);
    stat.textContent = statText;
    stats.appendChild(stat);
  });
  return stats;
}

function renderUserPosts(user) {
  const postsContainer = document.createElement(ELEMENTS.DIV);
  postsContainer.classList.add("posts");
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const posts = [
    {
      title: `${Object.keys(users).find((key) => users[key] === user)}`,
      content: "Всем привет!",
      date: `${day}.${month}.${year}`,
    },
    {
      title: `${Object.keys(users).find((key) => users[key] === user)}`,
      content: "Фронтенд рулит!",
      date: `${day}.${month}.${year}`,
    },
  ];

  posts.forEach((post) => {
    const postDiv = document.createElement(ELEMENTS.DIV);
    postDiv.classList.add(ELEMENTS_CLASS.POST);

    const postTitle = document.createElement(ELEMENTS.H4);
    postTitle.textContent = post.title;
    postDiv.appendChild(postTitle);

    const postContent = document.createElement(ELEMENTS.P);
    postContent.textContent = post.content;
    postDiv.appendChild(postContent);

    const postDate = document.createElement(ELEMENTS.DIV);
    postDate.classList.add(ELEMENTS_CLASS.DATE);
    postDate.textContent = post.date;
    postDiv.appendChild(postDate);

    postsContainer.appendChild(postDiv);
  });

  return postsContainer;
}

function renderVibe(user) {
  const title = document.createElement(ELEMENTS.H1);
  title.textContent = `${Object.keys(users).find((key) => users[key] === user)} о себе: Мы крутышки!`;
  return title;
}

function renderLogoutButton(Item) {
  const logoutLink = document.createElement(ELEMENTS.A);
  logoutLink.classList.add(ELEMENTS_CLASS.LOGOUT);
  logoutLink.href = "#";
  logoutLink.textContent = "Выйти";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem(Item);
    sessionStorage.removeItem(Item);
    goToPage(state.menuElements.home);
  });
  return logoutLink;
}

export function renderProfile() {
  const formProfile = document.createElement(ELEMENTS.DIV);
  formProfile.classList.add(ELEMENTS_CLASS.FORM_PROFILE);

  const user = getCurrentUser();

  const header = document.createElement(ELEMENTS.DIV);
  header.classList.add(ELEMENTS_CLASS.HEADER_PROFILE);

  header.appendChild(renderNavbar());

  header.appendChild(renderLogoutButton("login"));

  header.appendChild(renderVibe(user));

  const profile = document.createElement(ELEMENTS.DIV);
  profile.classList.add(ELEMENTS_CLASS.PROFILE);

  profile.appendChild(renderUserInfo(user));

  const right = document.createElement(ELEMENTS.DIV);
  right.classList.add(ELEMENTS_CLASS.RIGHT);

  right.appendChild(renderUserStats());

  right.appendChild(renderUserPosts());
  profile.appendChild(right);

  formProfile.appendChild(header);
  formProfile.appendChild(profile);

  return formProfile;
}

import { goToPage } from "../index.js";
import { state } from "../consts.js";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts.js";
import { fetchAjax } from "../utils/fetchAjax.js";

const dataTest = [
  {
    username: "Alexey",
    subscriptions: 33,
    status: "author",
    followers: 90,
  },
];
const payTest = [
  {
    amount: 12,
  },
];

const postTest = [
  {
    title: "Tema",
    text: "sTESTIKIKI",
    media_content_url: "urlik",
    createdAt: "2024-09-27T07:52:34.324Z",
    updatedAt: "2024-09-27T07:52:34.324Z",
  },
  {
    title: "Tema",
    text: "sTESTIKIKI",
    media_content_url: "urlik",
    createdAt: "2024-09-27T07:52:34.324Z",
    updatedAt: "2024-09-27T07:52:34.324Z",
  },
  {
    title: "Tema",
    text: "sTESTIKIKI",
    media_content_url: "urlik",
    createdAt: "2024-09-27T07:52:34.324Z",
    updatedAt: "2024-09-27T07:52:34.324Z",
  },
  {
    title: "Tema",
    text: "sTESTIKIKI",
    media_content_url: "urlik",
    createdAt: "2024-09-27T07:52:34.324Z",
    updatedAt: "2024-09-27T07:52:34.324Z",
  },
];
function getPayments() {
  let result = {};
  fetchAjax("GET", "/profile/payments", {}, (response) => {
    if (response.ok) {
      response.json().then((data) => {
        result = data;
      });
    }
  });
  return result;
}
function getPosts() {
  let result = {};
  fetchAjax("GET", "/profile/posts", {}, (response) => {
    if (response.ok) {
      response.json().then((data) => {
        result = data;
      });
    }
  });
  return result;
}
export function getCurrentUser() {
  fetchAjax("GET", "/profile", {}, (response) => {
    if (response.ok) {
      response.json().then((data) => {
        state.currentUser = data;
        localStorage.setItem("login", data.username);
        sessionStorage.setItem("login", data.username);
      });
    }
  });
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

function renderUserInfo(user, payments) {
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
  desc.textContent = `${user.status}`;
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
  amount.textContent = `${payments[0].amount}`;
  earnings.appendChild(amount);

  leftbar.appendChild(earnings);
  left.appendChild(leftbar);
  return left;
}
function renderUserStats(user, posts) {
  const stats = document.createElement(ELEMENTS.DIV);
  stats.classList.add(ELEMENTS_CLASS.STATS);

  const statsData = [
    `${posts.length} посты`,
    `${user.subscriptions} подписчиков`,
    `${user.followers} подписок`,
  ];

  statsData.forEach((statText) => {
    const stat = document.createElement(ELEMENTS.DIV);
    stat.textContent = statText;
    stats.appendChild(stat);
  });
  return stats;
}

function renderUserPosts(user, posts) {
  const postsContainer = document.createElement(ELEMENTS.DIV);
  postsContainer.classList.add("posts");

  posts.forEach((post) => {
    const postDiv = document.createElement(ELEMENTS.DIV);
    postDiv.classList.add(ELEMENTS_CLASS.POST);

    const postTitle = document.createElement(ELEMENTS.H4);
    postTitle.textContent = post.title;
    postDiv.appendChild(postTitle);

    const postContent = document.createElement(ELEMENTS.P);
    postContent.textContent = post.text;
    postDiv.appendChild(postContent);

    const postDate = document.createElement(ELEMENTS.DIV);
    postDate.classList.add(ELEMENTS_CLASS.DATE);
    postDate.textContent = post.createdAt;
    postDiv.appendChild(postDate);

    postsContainer.appendChild(postDiv);
  });

  return postsContainer;
}

function renderVibe(user) {
  const title = document.createElement(ELEMENTS.H1);
  title.textContent = `${user.username} о себе: Мы крутышки!`;
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

  //const user = getCurrentUser();
  const user = state.currentUser;
  const payments = getPayments();
  const posts = getPosts();

  const header = document.createElement(ELEMENTS.DIV);
  header.classList.add(ELEMENTS_CLASS.HEADER_PROFILE);

  header.appendChild(renderNavbar());

  header.appendChild(renderLogoutButton("login"));

  header.appendChild(renderVibe(user[0]));

  const profile = document.createElement(ELEMENTS.DIV);
  profile.classList.add(ELEMENTS_CLASS.PROFILE);

  profile.appendChild(renderUserInfo(user[0], payments));

  const right = document.createElement(ELEMENTS.DIV);
  right.classList.add(ELEMENTS_CLASS.RIGHT);

  right.appendChild(renderUserStats(user[0], posts));

  right.appendChild(renderUserPosts(user[0], posts));
  profile.appendChild(right);

  formProfile.appendChild(header);
  formProfile.appendChild(profile);

  return formProfile;
}

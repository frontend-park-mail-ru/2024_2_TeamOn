import { route } from "../../utils/routing";
import { feedLinks, RouterLinks, state } from "../../consts";
import { renderLogoutButton } from "../profile/profile";
import { findUsername } from "../../utils/hasLogged";
let previousActiveLink: any = null; // Variable to store the previous active link

function setActiveLink(link: any) {
  if (previousActiveLink) {
    previousActiveLink.className = "";
    previousActiveLink.active = false;
  }

  link.className = "active";
  link.active = true;
  previousActiveLink = link;
}
function renderBurger() {
  const burger = document.createElement("div");
  burger.className = "burger";
  const lineFirst = document.createElement("div");
  lineFirst.className = "line";
  const lineSecond = document.createElement("div");
  lineSecond.className = "line";
  const lineThree = document.createElement("div");
  lineThree.className = "line";
  burger.appendChild(lineFirst);
  burger.appendChild(lineSecond);
  burger.appendChild(lineThree);
  return burger;
}
function renderSidebar() {
  const div: any = document.createElement("div");
  div.className = "side";

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  const burger: any = renderBurger();

  div.appendChild(burger);
  div.appendChild(sidebar);
  const navMenu: any = document.createElement("div");
  navMenu.className = "nav-menu";
  burger.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
  feedLinks.forEach((link: any) => {
    const a = document.createElement("a");
    if (link.active) {
      a.className = "active";
    }
    if (link.href) {
      a.onclick = () => {
        route(link.href);
        setActiveLink(link);
      };
    }
    const i = document.createElement("i");
    i.className = link.icon;
    a.appendChild(i);
    a.appendChild(document.createTextNode(link.text));
    if (link.new) {
      const span = document.createElement("span");
      span.style.color = "red";
      span.appendChild(document.createTextNode(" НОВОЕ"));
      a.appendChild(span);
    }
    navMenu.appendChild(a);
  });
  sidebar.appendChild(navMenu);
  const user: any = findUsername();

  if (user) {
    sidebar.appendChild(renderLogoutButton(user));
  } else {
    route(RouterLinks.HOME)
  }
  return div;
}
function renderSearchbar() {
  const searchBar = document.createElement("div");
  searchBar.className = "search-bar";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Найти креаторов";
  searchBar.appendChild(input);
  return searchBar;
}

function createContainerPost(post: any) {
  const container = document.createElement("div");
  container.classList.add("post-container");

  // Создание секции автора
  const authorSection: any = document.createElement("div");
  authorSection.classList.add("author-section");

  // Создание аватара автора
  const avatar = document.createElement("img");
  avatar.alt = "Аватар автора";
  avatar.classList.add("avatar");
  avatar.height = 50;
  avatar.src = post.avatarSrc;
  avatar.width = 50;

  // Создание имени автора
  const authorName = document.createElement("div");
  authorName.classList.add("author-name");
  authorName.textContent = post.authorName;

  // Добавление аватара и имени автора в секцию автора
  authorSection.appendChild(avatar);
  authorSection.appendChild(authorName);
  const author_id = 12; // БЕКЕНД ЗАГЛУШКА
  authorSection.addEventListener("click", () => {
    route(`/feed/${author_id}`);
  });

  // Создание заголовка
  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = post.title;

  // Создание контента
  const content = document.createElement("div");
  content.classList.add("content");
  content.textContent = post.content;

  // Создание media-контента
  const mediaContent = document.createElement("img");
  mediaContent.className = "media-post";
  // mediaContent.src = "../styles/photos/home.png"
  // mediaContent.alt = "Описание"

  // Создание даты
  const date = document.createElement("div");
  date.classList.add("date");
  date.textContent = post.date;

  // Создание секции взаимодействия
  const feedbackContainer = document.createElement("div");
  feedbackContainer.classList.add("interaction-section");

  // Создание лайков
  const containerLike = document.createElement("div");
  containerLike.className = "like-container";

  const buttonLike = document.createElement("div");
  buttonLike.classList.add("likes");

  const amountLike = document.createElement("h3");
  amountLike.innerHTML = `${post.likes}`;

  containerLike.appendChild(buttonLike);
  containerLike.appendChild(amountLike);

  // Создание комментариев
  const containerComments = document.createElement("div");
  containerComments.className = "comments-container";

  const buttonComment = document.createElement("div");
  buttonComment.classList.add("comments");

  const amountComment = document.createElement("h3");
  amountComment.innerHTML = `${post.comments}`;

  // Добавление лайков и комментариев в секцию взаимодействия
  containerComments.appendChild(buttonComment);
  containerComments.appendChild(amountComment);

  feedbackContainer.appendChild(containerLike);
  feedbackContainer.appendChild(containerComments);

  // Добавление всех элементов в контейнер поста
  container.appendChild(authorSection);
  container.appendChild(title);
  container.appendChild(content);
  container.appendChild(mediaContent);
  container.appendChild(date);
  container.appendChild(feedbackContainer);
  return container;
}

export { renderSidebar, renderSearchbar, createContainerPost };

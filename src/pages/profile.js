import {goToPage} from '../index.js'
import { state, users } from '../consts.js';
function getCurrentUser() {
    return state.currentUser;
  }
export function renderProfile(conf = null, id = null) {
    const formProfile = document.createElement("div");
    formProfile.classList.add("form-profile");
  
    const user = getCurrentUser();
  
    const header = document.createElement("div");
    header.classList.add("header-profile");
    const nav = document.createElement("nav");
    const navLinks = [
      "Моя страница",
      'Лента', 
                        'Настройки'
    ];
    const activePage = conf?.activePage || "Моя страница";
  
    navLinks.forEach((linkText) => {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = linkText;
      if (linkText === activePage) {
        link.style.fontWeight = "bold";
      }
      nav.appendChild(link);
    });
    header.appendChild(nav);
  
    const logoutLink = document.createElement("a");
    logoutLink.classList.add("logout");
    logoutLink.href = "#";
    logoutLink.textContent = "Выйти";
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("login");
      sessionStorage.removeItem("login");
      goToPage(state.menuElements.home);
    });
    header.appendChild(logoutLink);
  
    const title = document.createElement("h1");
    title.textContent = `${Object.keys(users).find((key) => users[key] === user)} о себе: Мы крутышки!`;
    header.appendChild(title);
  
    const profile = document.createElement("div");
    profile.classList.add("profile");
  
    const left = document.createElement("div");
    left.classList.add("left");
  
    const leftbar = document.createElement("div");
    leftbar.classList.add("left-bar");
  
    const profileImg = document.createElement("img");
    profileImg.classList.add("image-profile");
    leftbar.appendChild(profileImg);
  
    const info = document.createElement("div");
    info.classList.add("info");
  
    const name = document.createElement("h2");
    name.textContent = `${Object.keys(users).find((key) => users[key] === user)}`;
    info.appendChild(name);
  
    const desc = document.createElement("p");
    desc.textContent = "IT контент";
    info.appendChild(desc);
  
    leftbar.appendChild(info);
  
    const earnings = document.createElement("div");
    earnings.classList.add("earnings");
  
    const earningsTitle = document.createElement("h3");
    earningsTitle.textContent = "Выплаты:";
    earnings.appendChild(earningsTitle);
  
    const earningsToday = document.createElement("p");
    earningsToday.textContent = "За сегодня вы заработали:";
    earnings.appendChild(earningsToday);
  
    const amount = document.createElement("p");
    amount.textContent = " ";
    earnings.appendChild(amount);
  
    leftbar.appendChild(earnings);
    left.appendChild(leftbar)
    profile.appendChild(left);
  
    const right = document.createElement("div");
    right.classList.add("right");
  
    const stats = document.createElement("div");
    stats.classList.add("stats");
  
    const statsData = ["2 публикаций", "10000 подписчиков", "7 подписок"];
  
    statsData.forEach((statText) => {
      const stat = document.createElement("div");
      stat.textContent = statText;
      stats.appendChild(stat);
    });
  
    right.appendChild(stats);
  
    const postsContainer = document.createElement("div");
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
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");
  
      const postTitle = document.createElement("h4");
      postTitle.textContent = post.title;
      postDiv.appendChild(postTitle);
  
      const postContent = document.createElement("p");
      postContent.textContent = post.content;
      postDiv.appendChild(postContent);
  
      const postDate = document.createElement("div");
      postDate.classList.add("date");
      postDate.textContent = post.date;
      postDiv.appendChild(postDate);
  
      postsContainer.appendChild(postDiv);
    });
  
    right.appendChild(postsContainer);
    profile.appendChild(right);
  
    formProfile.appendChild(header);
    formProfile.appendChild(profile);
  
    return formProfile;
}
import { ELEMENTS_CLASS, RouterLinks, state } from "../consts";
import { goToPage, pageContainer } from "../index";
import { route } from "../utils/routing";
import { getCurrentUser, renderProfile } from "./profile";

export async function renderFeed() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    state.currentUser = user;

    const sidebar = document.createElement("div");
    sidebar.className = "sidebar";
    const links = [
      {
        text: "Главная",
        icon: "fas fa-home",
        active: true,
      },
      {
        text: "Сообщество",
        icon: "fas fa-users",
        new: true,
      },
      {
        text: "Уведомления",
        icon: "fas fa-bell",
      },
      {
        text: "Настройки",
        icon: "fas fa-cog",
        href: "settings",
      },
    ];

    links.forEach((link: any) => {
      const a = document.createElement("a");
      if (link.active) {
        a.className = "active";
      }
      if (link.href) {
        a.onclick = () => {
          route(RouterLinks.SETTINGS);
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
      sidebar.appendChild(a);
    });
    const userInfo = document.createElement("div");
    userInfo.onclick = () => {
      route(RouterLinks.PROFILE);
    };
    userInfo.className = "user-info";
    const userName = document.createElement("div");
    userName.className = "user-name";
    userName.appendChild(document.createTextNode("Профиль"));
    userInfo.appendChild(userName);
    sidebar.appendChild(userInfo);

    const mainContent: any = document.createElement("div");
    mainContent.className = "main-content";

    const searchBar = document.createElement("div");
    searchBar.className = "search-bar";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Найти креаторов или темы";
    searchBar.appendChild(input);
    mainContent.appendChild(searchBar);

    const sectionTitle = document.createElement("div");

    sectionTitle.className = "section-title";
    sectionTitle.appendChild(
      document.createTextNode("Популярно на этой неделе"),
    );
    mainContent.appendChild(sectionTitle);

    const creatorsList = document.createElement("div");
    creatorsList.className = "creators-list";
    const creators = [
      {
        name: "Aranaktu",
        description: "Creating modding tools for various games",
        img: "https://storage.googleapis.com/a1aa/image/JDndjHeYX3VYICZACwsGJMTeWuYdYsWnZZTfJIPMVyvfBJYOB.jpg",
      },
      {
        name: "LGR",
        description: "Creating Videos about retro computers and vintage tech",
        img: "https://storage.googleapis.com/a1aa/image/9hLSlgbdmCIlOFBwgffwofhXlFuZ2vHFB2iJbABfwRLlBJYOB.jpg",
      },
    ];
    creators.forEach((creator) => {
      const creatorItem = document.createElement("div");
      creatorItem.className = "creator-item";
      const img = document.createElement("img");
      img.alt = `Profile picture of ${creator.name}`;
      img.height = 50;
      img.width = 50;
      img.src = creator.img;
      creatorItem.appendChild(img);
      const creatorInfo = document.createElement("div");
      creatorInfo.className = "creator-info";
      const creatorName = document.createElement("div");
      creatorName.className = "creator-name";
      creatorName.appendChild(document.createTextNode(creator.name));
      creatorInfo.appendChild(creatorName);
      const creatorDescription = document.createElement("div");
      creatorDescription.className = "creator-description";
      creatorDescription.appendChild(
        document.createTextNode(creator.description),
      );
      creatorInfo.appendChild(creatorDescription);
      creatorItem.appendChild(creatorInfo);
      creatorsList.appendChild(creatorItem);
    });
    mainContent.appendChild(creatorsList);

    const sectionTitle2 = document.createElement("div");
    sectionTitle2.className = "section-title";
    sectionTitle2.appendChild(document.createTextNode("Темы"));
    mainContent.appendChild(sectionTitle2);

    const topics = document.createElement("div");
    topics.className = "topics";
    const topicItems = [
      "Подкасты и шоу",
      "Настольные игры",
      "Музыка",
      "Текст",
      "Приложения и программное обеспечение",
      "Изобразительное искусство",
      "Видеоигры",
      "Стиль жизни",
      "Рукоделие",
      "Социальные вопросы",
    ];
    topicItems.forEach((topic) => {
      const topicItem = document.createElement("div");
      topicItem.className = "topic-item";
      topicItem.appendChild(document.createTextNode(topic));
      topics.appendChild(topicItem);
    });
    mainContent.appendChild(topics);

    const sectionTitle3 = document.createElement("div");
    sectionTitle3.className = "section-title";
    sectionTitle3.appendChild(document.createTextNode("Недавно на Patreon"));
    mainContent.appendChild(sectionTitle3);

    const recentPatreon = document.createElement("div");
    recentPatreon.className = "recent-patreon";
    const patreons = [
      {
        name: "1Peter Zeihan",
        img: "https://storage.googleapis.com/a1aa/image/1xmjY6FUfGy0DyZVJzX3Ww6u5ZSWUCuxBZDKgmhJZESQIBzJA.jpg",
      },
      {
        name: "2Josh Strider",
        img: "https://storage.googleapis.com/a1aa/image/L2lgWCiHcaofa6hxz1biHL26Rmvof2IcFHO0CU6QcM8PQCmTA.jpg",
      },
      {
        name: "3Josh Strider",
        img: "https://storage.googleapis.com/a1aa/image/L2lgWCiHcaofa6hxz1biHL26Rmvof2IcFHO0CU6QcM8PQCmTA.jpg",
      },
      {
        name: "4Josh Strider",
        img: "https://storage.googleapis.com/a1aa/image/L2lgWCiHcaofa6hxz1biHL26Rmvof2IcFHO0CU6QcM8PQCmTA.jpg",
      },
      {
        name: "5Josh Strider",
        img: "https://storage.googleapis.com/a1aa/image/L2lgWCiHcaofa6hxz1biHL26Rmvof2IcFHO0CU6QcM8PQCmTA.jpg",
      },
      {
        name: "6Josh Strider",
        img: "https://storage.googleapis.com/a1aa/image/L2lgWCiHcaofa6hxz1biHL26Rmvof2IcFHO0CU6QcM8PQCmTA.jpg",
      },
    ];
    patreons.forEach((patreon) => {
      const patreonItem = document.createElement("div");
      patreonItem.className = "patreon-item";
      const img = document.createElement("img");
      img.alt = `Profile picture of ${patreon.name}`;
      img.height = 50;
      img.width = 50;
      img.src = patreon.img;
      patreonItem.appendChild(img);
      const patreonInfo = document.createElement("div");
      patreonInfo.className = "patreon-info";
      const patreonName = document.createElement("div");
      patreonName.className = "patreon-name";
      patreonName.appendChild(document.createTextNode(patreon.name));
      patreonInfo.appendChild(patreonName);
      patreonItem.appendChild(patreonInfo);
      recentPatreon.appendChild(patreonItem);
    });
    mainContent.appendChild(recentPatreon);

    mainContent.appendChild(sidebar);
    return mainContent;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}

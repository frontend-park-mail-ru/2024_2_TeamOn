import { state } from "../../consts";
import { getCurrentUser } from "../profile/profile";
import {
  renderSearchbar,
  renderSidebar,
  createContainerPost,
} from "../feed/feedView";
import { routing } from "../../utils/routing";

async function getPopularPosts() {
  return await [
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Polkovnik",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
  ];
}
async function getRecentlyPosts() {
  return await [
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
    {
      avatarSrc:
        "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
      authorName: "Anatolich",
      title: "Как прошла предзащита",
      content:
        "На предзащите сидели порядка 60 человек 10 из которых это преподы. Все прошло просто замечательно. Была комфортная обстановка. Задавали понятные и интересные вопросы на подумать. Учили для себя что-то важное",
      date: "19.10.2024",
      likes: 34,
      comments: 34,
    },
  ];
}
export async function renderFeed() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const sidebar: any = renderSidebar();

    const mainContent: any = document.createElement("div");
    mainContent.className = "main-content";

    const rightContent: any = document.createElement("div");
    rightContent.className = "right-content";

    const searchBar: any = renderSearchbar();
    mainContent.appendChild(searchBar);

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        searchBar.style.position = "fixed";
        searchBar.style.top = "1.9%";
      } else {
        searchBar.style.position = "";
      }
    });
    const sectionTitle = document.createElement("div");

    sectionTitle.className = "section-title";
    sectionTitle.appendChild(
      document.createTextNode("Популярно на этой неделе"),
    );
    rightContent.appendChild(sectionTitle);

    // Создание контейнера для всех постов
    const posts = document.createElement("div");
    posts.classList.add("main-container");

    // Использование forEach для создания постов
    (await getPopularPosts()).forEach((post: any) => {
      // Создание контейнера для поста
      const container: any = createContainerPost(post);

      // Добавление контейнера поста в основной контейнер
      posts.appendChild(container);
    });

    rightContent.appendChild(posts);

    const sectionTitle3 = document.createElement("div");
    sectionTitle3.className = "section-title";
    sectionTitle3.appendChild(document.createTextNode("Недавние"));
    rightContent.appendChild(sectionTitle3);

    const recentlyPosts = document.createElement("div");
    recentlyPosts.classList.add("main-container");

    // Использование forEach для создания постов
    (await getRecentlyPosts()).forEach((post: any) => {
      // Создание контейнера для поста
      const container: any = createContainerPost(post);

      // Добавление контейнера поста в основной контейнер
      recentlyPosts.appendChild(container);
    });

    rightContent.appendChild(recentlyPosts);
    mainContent.appendChild(rightContent);
    mainContent.appendChild(sidebar);

    return mainContent;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}

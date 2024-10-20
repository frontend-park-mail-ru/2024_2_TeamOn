import { state } from "../../consts";
import {
  createContainerPost,
  renderSearchbar,
  renderSidebar,
} from "../feed/feedView";
import { getCurrentUser } from "../profile/profile";
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
export async function renderNotifications() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const sidebar: any = renderSidebar();
    const main: any = document.createElement("div");
    const mainContent: any = document.createElement("div");
    mainContent.className = "container-notification";
    const h1: any = document.createElement("h1");
    h1.textContent = "Уведомления";
    const containerIcon: any = document.createElement("div");
    containerIcon.className = "notification-icon";

    const i: any = document.createElement("i");
    i.className = "icon-notification-big";

    const containerSec: any = document.createElement("div");
    containerSec.className = "no-notifications";
    containerSec.textContent = "Уведомлений пока нет";

    const containerText: any = document.createElement("div");
    containerText.className = "notification-text";
    containerText.textContent =
      "Вы будете получать уведомления о новых участниках сообщества, действиях с вашими публикациями и других событиях.";

    main.appendChild(sidebar);
    mainContent.appendChild(h1);
    mainContent.appendChild(containerIcon);
    containerIcon.appendChild(i);
    mainContent.appendChild(containerSec);
    mainContent.appendChild(containerText);
    main.appendChild(mainContent);

    return main;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}

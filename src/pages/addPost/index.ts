import { renderTo, update } from "../../../lib/vdom/lib";
import {
  renderUserPost,
} from "../../entities/userPost/ui/ui";
import {renderPosts} from "../../features/controlAdaptivePageAuthor/controlAdaptivePageAuthor"
import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { getUserPosts } from "../../features/getuserposts/getUserPosts";
import DOMPurify from "dompurify";
import { getPayments } from "../../features/getpayments/getpayments";
import { renderUserStats } from "../../entities/profileInfo/ui/ui";

const containerCreatePost = document.querySelector(".create-post-page");
const buttonSave = containerCreatePost?.querySelector(
  `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
);
const buttonCancel = containerCreatePost?.querySelector(
  `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
);

if (buttonCancel) {
  buttonCancel.addEventListener("click", () => {
    // Переход обратно на страницу профиля
    window.history.back();
  });
}

if (buttonSave) {
  buttonSave.addEventListener("click", async () => {
    const title: HTMLInputElement | null = containerCreatePost?.querySelector(
      `.input-group`,
    );
    const content: HTMLTextAreaElement | null = containerCreatePost?.querySelector(
      `.textarea-group`,
    );

    if (!title || !content) {
      console.error("Отсутствуют поля для ввода");
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(title.value);
    const sanitizedContent = DOMPurify.sanitize(content.value);

    if (!sanitizedTitle || !sanitizedContent) {
      const errorContainer = containerCreatePost?.querySelector(`.form-group`);
      if (errorContainer && !errorContainer.querySelector("p")) {
        const error = document.createElement("p");
        error.style.color = "red";
        error.textContent = "Заполните все поля!";
        errorContainer.appendChild(error);
      }
      return;
    }

    try {
      // Создание поста
      const post = await addUserPost(containerCreatePost,sanitizedTitle, sanitizedContent);

      // Переход на страницу профиля
      const newPosts = await getUserPosts(window.location.pathname, 0, 300);
      const placePosts = document.querySelector(".place-posts");
      if (placePosts) {
        placePosts.prepend(...(await renderPosts(newPosts.slice(0, 1))));
      }

      // Обновление статистики на странице профиля
      const placeStats = document.querySelector(".stats");
      const payments = await getPayments(window.location.pathname);
      if (placeStats) {
        const statsVNode = await renderUserStats({ /* authorData */ }, payments);
        update(placeStats, statsVNode);
      }

      // После успешного добавления поста возвращаем пользователя на страницу профиля
      window.history.back();
    } catch (error) {
      console.error("Ошибка создания поста:", error);
    }
  });
}

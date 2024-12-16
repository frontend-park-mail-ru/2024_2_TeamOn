import { containerPost } from "../../widgest/moderation";
import { ELEMENTS_CLASS, LINKS, QUERY } from "../../shared/consts/consts";
import { getModerationPosts } from "../getModerationPosts/getModerationPosts";
import { renderTo, update } from "../../../lib/vdom/lib";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import { getAvatar } from "../getavatar/getavatar";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { hasLogged } from "../../shared/utils/hasLogged";
import { route } from "../../shared/routing/routing";
import { controlSlideShow } from "../paginateFeed/paginateFeed";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { renderBlockPost } from "../../pages/moderation/ui/moderation";
import { showOverlay } from "../../shared/overlay/overlay";

async function renderModalBlockPost(container: any, post: any) {
  const mainContent: any = document.querySelector(`.right-content`);

  const place = document.querySelector(`.div-blockposts`);
  const modal: any = renderBlockPost(post);
  update(place, modal);

  const modalsDelete: any = document.querySelector(".modal__deletepost");
  const overlay: any = showOverlay(modalsDelete, mainContent);
  const buttonCancel: any = modalsDelete.querySelector(`.cancel`);
  const buttonBlock: any = modalsDelete.querySelector(`.delete`);

  modalsDelete.style.display = "block";
  mainContent.classList.add("blur");
  const labelCheck = modalsDelete.querySelector(`.label-check`);
  const inputCheck = modalsDelete.querySelector(`.input-check`);

  // Обработчик события change для чекбокса
  inputCheck.addEventListener("change", () => {
    const dontShowAgain = inputCheck.checked;
    if (dontShowAgain) {
      localStorage.setItem("dontShowBlockPostModal", "true");
    } else {
      localStorage.setItem("dontShowBlockPostModal", "false");
    }
  });

  const handleClickCancel = (e: any) => {
    e.preventDefault();
    modalsDelete.style.display = "none";
    mainContent.classList.remove("blur");
    document.body.style.overflow = "auto";
    overlay.remove();
    return;
  };

  const handleClickBlock = async (e: any) => {
    e.preventDefault();
    const response: any = await decisionPost({
      postID: post.postID,
      status: "BLOCKED",
    });
    container.style.display = "none";
    modalsDelete.style.display = "none";
    mainContent.classList.remove("blur");
    document.body.style.overflow = "auto";
    overlay.remove();
  };

  buttonBlock.addEventListener("click", handleClickBlock);
  buttonCancel.addEventListener("click", handleClickCancel);
  overlay.addEventListener("click", handleClickCancel);

  return;
}
/**
 * Функция проставляет новый статус к посту от модератора
 * @param postId
 * @returns
 */
async function decisionPost(body: { postID: string; status: string }) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/moderation/moderation/post/decision",
      { postID: body.postID, status: body.status },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          response.json().then((data) => {
            resolve(data);
          });
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
async function customizePostModeration(container: any, post: any = null) {
  const authorSection: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.NAME}`,
  );

  const avatar: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.AVATAR}`,
  );
  if (avatar) {
    avatar.alt = "Аватар автора";
    avatar.height = 50;
    const avatarload: any = await getAvatar(
      window.location.pathname,
      post.authorID,
    );
    avatar.src = avatarload;
    avatar.width = 50;
  }
  const authorName: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.NAME}`,
  );
  if (authorName) {
    authorName.textContent = post.authorUsername;
  }
  if (authorSection) {
    authorSection.addEventListener("click", () => {
      gotoauthor(post.authorID);
    });
  }

  const title: any = container.querySelector(`.${ELEMENTS_CLASS.POST.TITLE}`);
  title.textContent = post.title;

  const content: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.CONTENT}`,
  );
  content.textContent = post.content;

  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = convertISOToRussianDate(post.createdAt);

  const rightContainer = document.querySelector(`.right-content`);
  controlSlideShow(container, rightContainer);

  const buttons: any = container.querySelector(`.button-container`);
  const buttonApprove: any = buttons.querySelector(`.approve-button`);
  const buttonBlock: any = buttons.querySelector(`.block-button`);

  const handleClickApprove = async () => {
    if (!hasLogged()) {
      route(LINKS.LOGIN.HREF);
      return;
    }
    const response: any = await decisionPost({
      postID: post.postID,
      status: "ALLOWED",
    });
    container.style.display = "none";
  };

  const handleClickBlock = async (e: any) => {
    e.preventDefault();
    if (
      localStorage.getItem("dontShowBlockPostModal") === "false" ||
      !localStorage.getItem("dontShowBlockPostModal")
    ) {
      renderModalBlockPost(container, post);
      return;
    }
    const response: any = await decisionPost({
      postID: post.postID,
      status: "BLOCKED",
    });
    container.style.display = "none";
    return;
  };

  buttonApprove.addEventListener("click", handleClickApprove);
  buttonBlock.addEventListener("click", handleClickBlock);
}

/**
 * Берет каждый пост и наполняет его
 * @param containerPopularPosts Контейнер популярных постов
 * @param containerRecentlyPosts Контейнер недавних постов
 */
async function modifirePostsModeration(
  containerApprovePosts: any,
  containerReportedPosts: any,
  approvePosts: any,
  reportedPosts: any,
) {
  try {
    // Обработка популярных постов
    if (approvePosts.length > 0) {
      const containersApprovePosts = containerApprovePosts.querySelectorAll(
        `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
      );

      // Используем Promise.all для обработки апрувнутых постов параллельно
      await Promise.all(
        Array.from(containersApprovePosts)
          .slice(-approvePosts.length)
          .map((container: any, index: any) => {
            return customizePostModeration(
              container,
              approvePosts[approvePosts.length - 1 - index],
            );
          }),
      );
    }

    // Обработка недавних постов
    if (reportedPosts.length > 0) {
      const containersReportedPosts = containerReportedPosts.querySelectorAll(
        `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
      );

      // Используем Promise.all для обработки зарепорченных постов параллельно
      await Promise.all(
        Array.from(containersReportedPosts)
          .slice(-reportedPosts.length)
          .map((container: any, index: any) => {
            return customizePostModeration(
              container,
              reportedPosts[reportedPosts.length - 1 - index],
            );
          }),
      );
    }
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}

/**
 * Рендерит скелет популярных постов
 * @returns
 */
async function renderPublishPosts(approvePosts: any) {
  const postsPromises = approvePosts.map(async (post: any) => {
    const container = await containerPost(post);

    const div = renderTo(container);

    const containerMedia: any = await containerMediaPost(post.postID);
    if (containerMedia) {
      let arrayMedia: any = [];
      containerMedia[0].forEach((media: any) => {
        const divMedia = renderTo(media, "content-media");
        arrayMedia.push(divMedia);
      });
      const place: any = div.querySelector(`.container-image-photos`);
      place.append(...arrayMedia);
    }
    return div;
  });

  const posts = await Promise.all(postsPromises);
  console.log(posts);
  return posts;
}

/**
 * Рендерит скелет популярных постов
 * @returns
 */
async function renderReportedPosts(reportedPosts: any) {
  const postsPromises = reportedPosts.map(async (post: any) => {
    const container = await containerPost(post);

    const div = renderTo(container);

    const containerMedia: any = await containerMediaPost(post.postId);
    if (containerMedia) {
      let arrayMedia: any = [];
      containerMedia[0].forEach((media: any) => {
        const divMedia = renderTo(media);
        arrayMedia.push(divMedia);
      });
      const place: any = div.querySelector(`.container-image-photos`);
      place.append(...arrayMedia);
    }
    return div;
  });

  const posts = await Promise.all(postsPromises);
  return posts;
}

async function paginateModeration(
  allApprovePosts: any,
  allReportedPosts: any,
  containerApprovePosts: any,
  containerReportedPosts: any,
) {
  let stopLoadApprovePosts: boolean = false;
  let stopLoadReportedPosts: boolean = false;
  let offsetApprove = 0;
  let offsetReported = 0;
  let isLoading = false;

  // Используем Set для отслеживания активных запросов
  const activeRequests = new Set();

  async function loadPosts() {
    if (isLoading) return; // Если загрузка уже идет, выходим из функции
    isLoading = true; // Устанавливаем флаг загрузки

    const activeLinkFeed = sessionStorage.getItem("moderation");
    activeLinkFeed == "0"
      ? (stopLoadApprovePosts = false)
      : (stopLoadReportedPosts = false);
    try {
      if (!stopLoadApprovePosts && window.location.pathname === "/moderation") {
        // Загружаем approve посты
        const requestId = `approve-${offsetApprove}`;
        if (activeRequests.has(requestId)) return; // Проверяем, был ли этот запрос уже отправлен
        activeRequests.add(requestId);

        const publishPosts: any = await getModerationPosts(
          offsetApprove,
          "PUBLISHED",
        );
        const nextPublishPosts = publishPosts.slice(0, QUERY.LIMIT);
        if (nextPublishPosts.length > 0) {
          allApprovePosts.push(...nextPublishPosts);
          console.log(allApprovePosts);
          offsetApprove += QUERY.LIMIT;
          containerApprovePosts.append(
            ...(await renderPublishPosts(nextPublishPosts)),
          );
          modifirePostsModeration(
            containerApprovePosts,
            containerReportedPosts,
            nextPublishPosts.reverse(),
            [],
          );
        } else {
          stopLoadApprovePosts = true;
        }
      }

      if (
        !stopLoadReportedPosts &&
        window.location.pathname === "/moderation"
      ) {
        // Загружаем reported посты
        const requestId = `reported-${offsetReported}`;
        if (activeRequests.has(requestId)) return; // Проверяем, был ли этот запрос уже отправлен
        activeRequests.add(requestId);
        const reportedPosts: any = await getModerationPosts(
          offsetReported,
          "COMPLAINED",
        );

        const nextReportedPosts = reportedPosts.slice(0, QUERY.LIMIT);
        if (nextReportedPosts.length > 0) {
          allReportedPosts.push(...nextReportedPosts);
          offsetReported += QUERY.LIMIT;
          // Обновляем контейнер недавних постов
          containerReportedPosts.append(
            ...(await renderReportedPosts(nextReportedPosts)),
          );
          modifirePostsModeration(
            containerApprovePosts,
            containerReportedPosts,
            [],
            nextReportedPosts.reverse(),
          );
        } else {
          stopLoadReportedPosts = true;
        }
      }
    } finally {
      isLoading = false; // Сбрасываем флаг загрузки
    }
  }

  // Инициализируем загрузку первых постов
  // await loadPosts();

  // // Обработчик события прокрутки
  // let isLoadingTop = false;

  // window.addEventListener("scroll", async () => {
  //   const { scrollTop, clientHeight, scrollWidth } = document.documentElement;
  //   // Проверяем, достиг ли пользователь нижней части страницы и не загружаем ли мы данные в данный момент
  //   if (scrollTop + clientHeight >= 3000 && !isLoadingTop) {
  //     isLoadingTop = true; // Устанавливаем флаг загрузки
  //     await loadPosts();
  //     isLoadingTop = false; // Сбрасываем флаг после загрузки
  //   }
  // });
  await loadPosts();
  // Обработчик события прокрутки
  let isLoadingOnScroll = false;
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollHeight - scrollTop <= clientHeight + 100 && !isLoadingOnScroll) {
      isLoadingOnScroll = true;
      await loadPosts();
      isLoadingOnScroll = false;
    }
  });
}

export { paginateModeration };

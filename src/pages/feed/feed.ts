import {
  ELEMENTS_CLASS,
  LINKS,
  LOCATIONS,
  QUERY,
  sidebarLinks,
  state,
} from "../../consts";
import { controlLogout, getAvatar } from "../profile/profile";
import {
  renderSidebar,
  createContainerPost,
  setActiveLink,
  getAccount,
} from "../feed/feedView";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { route } from "../../utils/routing";
import { fetchAjax } from "../../utils/fetchAjax";
import { convertISOToRussianDate } from "../../utils/parsedate";

async function getPopularPosts(offsetPopular: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.POPULAR_POSTS.METHOD,
      LOCATIONS.POSTS.POPULAR_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offsetPopular}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

async function getRecentlyPosts(offsetRecently: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.RECENTLY_POSTS.METHOD,
      LOCATIONS.POSTS.RECENTLY_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offsetRecently}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

/**
 * Берет каждый пост и наполняет его
 * @param containerPopularPosts Контейнер популярных постов
 * @param containerRecentlyPosts Контейнер недавних постов
 */
async function modifirePosts(
  containerPopularPosts: any,
  containerRecentlyPosts: any,
  popularPosts: any,
  recentlyPosts: any,
) {
  try {
    // Обработка популярных постов
    if (popularPosts.length > 0) {
      const containersPopularPosts = containerPopularPosts.querySelectorAll(
        `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
      );

      // Используем Promise.all для обработки популярных постов параллельно
      await Promise.all(
        Array.from(containersPopularPosts)
          .slice(-popularPosts.length)
          .map((container: any, index: any) => {
            return customizePost(
              container,
              popularPosts[popularPosts.length - 1 - index],
            );
          }),
      );
    }

    // Обработка недавних постов
    if (recentlyPosts.length > 0) {
      const containersRecentlyPosts = containerRecentlyPosts.querySelectorAll(
        `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
      );

      // Используем Promise.all для обработки недавних постов параллельно
      await Promise.all(
        Array.from(containersRecentlyPosts)
          .slice(-recentlyPosts.length)
          .map((container: any, index: any) => {
            return customizePost(
              container,
              recentlyPosts[recentlyPosts.length - 1 - index],
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
function renderPopularPosts(popularPosts: any) {
  var posts: any = [];
  popularPosts.forEach(async (post: any) => {
    const container: any = await createContainerPost(post, []);
    posts.push(container);
  });
  return posts;
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
async function renderRecentlyPosts(recentlyPosts: any) {
  try {
    var posts: any = [];
    recentlyPosts.forEach((post: any) => {
      const container: any = createContainerPost(post, []);
      posts.append(container);
    });

    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function AddLikeOnPost(postId: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.LIKE.METHOD,
      LOCATIONS.POSTS.LIKE.HREF,
      { postId: postId },
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 404) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Кастомизирует сайдраб
 * @param sidebar
 * @returns
 */
export function modifierSidebar(mainContainer: any) {
  const burger: any = mainContainer.querySelector(
    `.${ELEMENTS_CLASS.BURGER.BLOCK}`,
  );
  const sidebar = mainContainer.querySelector(".sidebar");
  burger.addEventListener("click", () => {
    sidebar.classList.toggle(ELEMENTS_CLASS.ACTIVE);
  });
  const sidebarReferenses = sidebar.querySelectorAll(".referens");
  console.log(sidebarReferenses);
  sidebarLinks.forEach((link: any, index: any) => {
    sidebarReferenses[index]?.addEventListener("click", (event: any) => {
      event.preventDefault();
      setActiveLink(link);
      route(link.href);
    });
    if (window.location.pathname === link.href) {
      setActiveLink(link);
    }
    if (link.active) {
      sidebarReferenses[index].className = ELEMENTS_CLASS.ACTIVE;
    }
    // const span: any = mainContainer.querySelector(".new");
    // span.style.color = "red";

    window.addEventListener("popstate", () => {
      sidebarLinks.forEach((link: any, index: any) => {
        if (window.location.pathname === link.href) {
          setActiveLink(link);
        } else {
          sidebarReferenses[index].classList.remove(ELEMENTS_CLASS.ACTIVE);
        }
      });
    });
  });
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
export async function customizePost(container: any, post: any = null) {
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
      post.authorId,
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
      sessionStorage.setItem("authorid", post.authorId);
      sessionStorage.setItem("author", post.authorUsername);
      sessionStorage.getItem("account") == post.authorUsername
        ? route(`/profile`)
        : route(`/profile/${sessionStorage.getItem("authorid")}`);
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

  const divLikes: any = container.querySelector(`.likes-container`);
  if (divLikes) {
    const amountLike: any = container.querySelector(
      `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
    );
    amountLike.innerHTML = `${post.likes}`;

    // Установка состояния лайка
    if (post.isLiked) {
      divLikes.classList.add("active");
    } else {
      divLikes.classList.remove("active");
    }

    const divLike: any = container.querySelector(
      `.${ELEMENTS_CLASS.POST.LIKES.BLOCK}`,
    );

    divLike.addEventListener("click", async () => {
      if (post.isLiked) {
        // Удалить лайк
        const likeCount: any = await AddLikeOnPost(post.postId);
        post.isLiked = false; // Обновляем состояние
        post.likes = likeCount.count; // Обновляем количество лайков
        divLikes.classList.remove("active");
      } else {
        // Добавить лайк
        const likeCount: any = await AddLikeOnPost(post.postId);
        post.isLiked = true; // Обновляем состояние
        post.likes = likeCount.count; // Обновляем количество лайков
        divLikes.classList.add("active");
      }
      amountLike.innerHTML = `${post.likes}`; // Обновляем отображаемое количество лайков
    });
  }
}
export async function paginate(
  allPopularPosts: any,
  allRecentlyPosts: any,
  containerPopularPosts: any,
  containerRecentlyPosts: any,
) {
  let stopLoadPopularPosts: boolean = false;
  let stopLoadRecentlyPosts: boolean = false;
  let offsetPopular = 0;
  let offsetRecently = 0;
  // Объект для предотвращения повторной загрузки
  let isLoading = false;
  const cache: any = {
    popular: [],
    recently: [],
  };
  async function loadPosts() {
    if (isLoading) return; // Если загрузка уже идет, выходим из функции
    isLoading = true; // Устанавливаем флаг загрузки

    try {
      if (!stopLoadPopularPosts) {
        // Загружаем популярные посты
        const popularPosts: any = await getPopularPosts(offsetPopular);
        const nextPopularPosts = popularPosts.slice(0, QUERY.LIMIT);

        if (nextPopularPosts.length > 0) {
          allPopularPosts.push(...nextPopularPosts);
          offsetPopular += QUERY.LIMIT;

          containerPopularPosts.append(
            ...(await renderPopularPosts(nextPopularPosts)),
          );
          modifirePosts(
            containerPopularPosts,
            containerRecentlyPosts,
            nextPopularPosts,
            [],
          );
          cache.popular.push(...nextPopularPosts);
        } else {
          stopLoadPopularPosts = true;
        }
      }
      if (!stopLoadRecentlyPosts) {
        // Загружаем недавние посты
        const recentlyPosts: any = await getRecentlyPosts(offsetRecently);
        const nextRecentlyPosts = recentlyPosts.slice(0, QUERY.LIMIT);
        if (nextRecentlyPosts.length > 0) {
          allRecentlyPosts.push(...nextRecentlyPosts);
          offsetRecently += QUERY.LIMIT; // Увеличиваем смещение на количество загруженных постов

          // Обновляем контейнер недавних постов
          containerRecentlyPosts.append(
            ...(await renderRecentlyPosts(nextRecentlyPosts)),
          );
          modifirePosts(
            containerPopularPosts,
            containerRecentlyPosts,
            [],
            nextRecentlyPosts,
          );
          cache.recently.push(...nextRecentlyPosts);
        } else {
          stopLoadRecentlyPosts = true;
        }
      }
    } finally {
      isLoading = false;
    }
  }

  // Инициализируем загрузку первых постов
  await loadPosts();

  // Обработчик события прокрутки
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      await loadPosts();
    }
  });
}
export async function renderFeed() {
  try {
    const allPopularPosts: any = []; // Массив для хранения всех загруженных популярных постов
    const allRecentlyPosts: any = []; // Массив для хранения всех загруженных недавних постов
    const userdata = await getAccount();

    const user: any = state.currentUser;
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.role === "Reader"
      ? (state.currentUser.reader = user)
      : (state.currentUser.author = user);

    const doc = document.body;
    doc.style.height = "100%";

    const vdom = createElement("div", { class: "main-content" }, [
      await renderSidebar(userdata),
      createElement("div", { class: "right-content" }, [
        createElement("div", { class: "section-title" }, [
          createText("Популярное"),
        ]),
        createElement("div", { class: "main-container-popular" }, []),
        createElement("div", { class: "section-title" }, [
          createText("Недавние"),
        ]),
        createElement("div", { class: "main-container-recently" }, []),
      ]),
    ]);

    const container = update(pageContainer, vdom);
    state.currentUser = user;

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );

    const mainContent = container.querySelector(`.main-content`);

    await paginate(
      allPopularPosts,
      allRecentlyPosts,
      containerPopularPosts,
      containerRecentlyPosts,
    );

    // if (cache.popular.length > 0 || cache.recently.length > 0) {
    //   containerPopularPosts.append(
    //     ...(await renderRecentlyPosts(cache.popular)),
    //   );
    //   modifirePosts(
    //     containerPopularPosts,
    //     containerRecentlyPosts,
    //     cache.popular,
    //     [],
    //   );
    //   offsetPopular = cache.popular.length;
    //   cache.popular = [];
    // }

    modifierSidebar(mainContent);

    controlLogout(container, user);

    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}

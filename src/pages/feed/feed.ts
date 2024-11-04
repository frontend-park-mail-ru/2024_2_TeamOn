import {
  ELEMENTS_CLASS,
  LINKS,
  LOCATIONS,
  QUERY,
  sidebarLinks,
  state,
} from "../../consts";
import { controlLogout } from "../profile/profile";
import {
  renderSidebar,
  createContainerPost,
  setActiveLink,
} from "../feed/feedView";
import { VNode } from "../../lib/vdom/src/source";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { pageContainer } from "../../index";
import { route } from "../../utils/routing";
import { removeItemLocalStorage } from "../../utils/storages";
import { fetchAjax } from "../../utils/fetchAjax";

let popularPostsArray: any = [];

async function getPopularPosts(offset: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.POPULAR_POSTS.METHOD,
      LOCATIONS.POSTS.POPULAR_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offset}`,
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
function getmedia() {
  return [
    {
      postId: 1,
      mediaContent: [
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
        {
          file: "https://storage.googleapis.com/a1aa/image/CBxaavBCBJ7LEpZ4JuAkjHDS1NkBmGD0yKHdp2irmfcnCL0JA.jpg",
        },
      ],
    },
  ];
}
async function getRecentlyPosts(offset: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      LOCATIONS.POSTS.RECENTLY_POSTS.METHOD,
      LOCATIONS.POSTS.RECENTLY_POSTS.HREF +
        `?limit=${QUERY.LIMIT}&offset=${offset}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
            offset += QUERY.LIMIT;
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
    // const popularPosts: any = await getPopularPosts();
    // const popularPosts: any = popularPostsArray;
    const mediacontent = getmedia();
    if (!popularPosts) {
      console.error("Популярные посты не загрузились");
    }
    const containersPopularPosts = containerPopularPosts.querySelectorAll(
      `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
    );
    containersPopularPosts.forEach((container: any, index: any) => {
      console.log(popularPosts[index]);
      console.log("WO");
      customizePost(container, popularPosts[index]);
    });

    // const recentlyPosts: any = await getRecentlyPosts();
    const containersRecentlyPosts = containerRecentlyPosts.querySelectorAll(
      `.${ELEMENTS_CLASS.POST.FEED.BLOCK}`,
    );
    containersRecentlyPosts.forEach((container: any, index: any) => {
      customizePost(container, recentlyPosts[index]);
    });
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
async function renderPopularPosts(popularPosts: any) {
  try {
    const media = getmedia();
    var posts: any = [];
    popularPosts.forEach((post: any) => {
      const mediaContent =
        media.find((m) => m.postId === post.postId)?.mediaContent || [];

      const container: VNode = createContainerPost(post, mediaContent);
      posts.push(container);
    });
    return posts;
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}
/**
 * Рендерит скелет популярных постов
 * @returns
 */
async function renderRecentlyPosts(recentlyPosts: any) {
  try {
    const media = getmedia();
    var arrayMedia: any = [];

    var posts: any = [];
    recentlyPosts.forEach((post: any) => {
      media.forEach((oneMedia: any) => {
        if (oneMedia.postId == post.id) {
          arrayMedia.push(oneMedia);
        }
      });
      const container: VNode = createContainerPost(post, arrayMedia);
      posts.push(container);
    });
    return posts;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function AddLikeOnPost(postId: any) {
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
export function customizePost(container: any, post: any = null) {
  const authorSection: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.NAME}`,
  );

  const avatar: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.AUTHOR.AVATAR}`,
  );
  if (avatar) {
    avatar.alt = "Аватар автора";
    avatar.height = 50;
    // avatar.src = post.avatarSrc;
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
      sessionStorage.setItem("page", post.authorId);
      route(`/profile/${sessionStorage.getItem("page")}`);
    });
  }

  const title: any = container.querySelector(`.${ELEMENTS_CLASS.POST.TITLE}`);
  title.textContent = post.title;

  const content: any = container.querySelector(
    `.${ELEMENTS_CLASS.POST.CONTENT}`,
  );
  content.textContent = post.content;

  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = post.date;

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
export async function renderFeed() {
  try {
    let offset = 0;
    const allPopularPosts: any = []; // Массив для хранения всех загруженных популярных постов
    const allRecentlyPosts: any = [];

    while (true) {
      const popularPosts: any = await getPopularPosts(offset);

      // Если постов меньше, чем лимит, выходим из цикла
      if (popularPosts.length < QUERY.LIMIT) {
        break;
      }

      // Добавляем загруженные посты в общий массив
      allPopularPosts.push(...popularPosts);

      // Увеличиваем offset для следующей итерации
      offset += QUERY.LIMIT;
    }

    while (true) {
      const recentlyPosts: any = await getRecentlyPosts(offset);

      // Если постов меньше, чем лимит, выходим из цикла
      if (recentlyPosts.length < QUERY.LIMIT) {
        break;
      }

      // Добавляем загруженные посты в общий массив
      allRecentlyPosts.push(...recentlyPosts);

      // Увеличиваем offset для следующей итерации
      offset += QUERY.LIMIT;
    }

    const user: any = state.currentUser;
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.role === "Reader"
      ? (state.currentUser.reader = user)
      : (state.currentUser.author = user);

    const doc: any = document.body;
    doc.style.height = "100%";
    const vdom: VNode = createElement("div", { class: "main-content" }, [
      await renderSidebar(),
      createElement("div", { class: "right-content" }, [
        createElement("div", { class: "section-title" }, [
          createText("Популярное"),
        ]),
        createElement("div", { class: "main-container-popular" }, [
          ...(await renderPopularPosts(allPopularPosts)),
        ]),
        createElement("div", { class: "section-title" }, [
          createText("Недавние"),
        ]),
        createElement("div", { class: "main-container-recently" }, [
          ...(await renderRecentlyPosts(allRecentlyPosts)),
        ]),
      ]),
    ]);

    const container = update(pageContainer, vdom);
    state.currentUser = user;

    const mainContent = container.querySelector(".main-content");
    modifierSidebar(mainContent);

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );

    modifirePosts(
      containerPopularPosts,
      containerRecentlyPosts,
      allPopularPosts,
      allRecentlyPosts,
    );

    // const side: any = container.querySelector(
    //   `.${ELEMENTS_CLASS.SEARCH.ELEMENT}`,
    // );
    // side.type = "text";
    // side.placeholder = "Найти креаторов";

    controlLogout(container, user);

    return container;
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}

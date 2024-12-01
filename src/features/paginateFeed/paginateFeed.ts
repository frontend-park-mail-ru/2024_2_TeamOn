import { ELEMENTS_CLASS, LINKS, QUERY } from "../../shared/consts/consts";
import { getPopularPosts } from "../getPopularPosts/getPopularPosts";
import { getRecentlyPosts } from "../getRecentlyPosts/getRecentlyPosts";
import { containerPost } from "../../widgest/feed";
import { renderTo, update } from "../../../lib/vdom/lib";
import { AddLikeOnPost } from "../../entities/likes";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { route } from "../../shared/routing/routing";
import { getAvatar } from "../getavatar/getavatar";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import { hasLogged } from "../../shared/utils/hasLogged";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { showOverlay } from "../../shared/overlay/overlay";
import { renderComplaintPost } from "../../pages/feed/ui/feed";
import { fetchAjax } from "../../shared/fetch/fetchAjax";

export function controlSlideShow(container: any, rightContainer: any) {
  const modalPhotos: any = document.querySelector(`.modal-view-photos`); //
  const rightContent: any = rightContainer;
  const closeModal: any = document.querySelector(`.close-modal-view`); //
  const main: any = document.querySelector("main");
  let imageModal: any = null;
  let leftArrow: any = null;
  let rightArrow: any = null;
  let overlay: any = null;
  if (modalPhotos) {
    imageModal = modalPhotos.querySelector(".image-photos-modal"); //
    // Обработчики для кнопок переключения
    leftArrow = modalPhotos.querySelector(".leftarrow-modal-view"); //
    rightArrow = modalPhotos.querySelector(".rightarrow-modal-view"); //
  }
  const imgPhotos: any = Array.from(container.querySelectorAll(`.image-photo`)); //

  let imgAvatar: any = container.querySelector(`.author-avatar`);
  const toggleButton: any = container.querySelector(".toggleButton");
  if (!imgAvatar) {
    imgAvatar = container.querySelector(`.profile-avatar`);
  }
  var currentIndex = 0;

  const updateImage = (currentIndex: any) => {
    if (!imageModal || imgPhotos.length == 0) return;
    imageModal.src = imgPhotos[currentIndex].src;
  };

  const showAvatar = () => {
    if (!imageModal) return;
    imageModal.src = imgAvatar.src;
    return;
  };

  const handleOpenSlideshow = (
    event: any,
    callback: any,
    index: any = null,
  ) => {
    event.stopPropagation();
    modalPhotos.style.display = "block";
    rightContent.classList.add("blackout");
    overlay = showOverlay(modalPhotos, rightContent);

    currentIndex = index;
    callback(currentIndex);
    document.body.style.overflow = "hidden";
    if (leftArrow) {
      leftArrow.addEventListener("click", touchLeftArrow);
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", touchRightArrow);
    }

    if (isMobile()) {
      let startX = 0;
      let endX = 0;
      modalPhotos.addEventListener("click", (event: any) => {
        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        overlay.remove();
      });
      modalPhotos.addEventListener("touchstart", (event: any) => {
        startX = event.touches[0].clientX;
      });

      modalPhotos.addEventListener("touchmove", (event: any) => {
        endX = event.touches[0].clientX;
      });

      modalPhotos.addEventListener("touchend", (event: any) => {
        if (startX > endX + 50) {
          // Свайп влево
          const oldIndex = currentIndex;

          currentIndex = (currentIndex + 1) % imgPhotos.length; // Увеличиваем индекс
          animateImageTransition(oldIndex, currentIndex, -100); // Сдвигаем влево
        } else if (startX + 50 < endX) {
          // Свайп вправо
          const oldIndex = currentIndex;
          currentIndex =
            (currentIndex - 1 + imgPhotos.length) % imgPhotos.length; // Уменьшаем индекс
          animateImageTransition(oldIndex, currentIndex, 100); // Сдвигаем вправо
        }
      });
    }

    if (!isMobile()) {
      // Обработка кликов
      modalPhotos.addEventListener("click", (event: any) => {
        event.stopPropagation();
        const width = modalPhotos.clientWidth; // Получаем ширину элемента slideshow
        const midPoint = 1018; // Находим середину элемента
        // Если клик был в правой половине
        if (event.clientX > midPoint) {
          currentIndex = (currentIndex + 1) % imgPhotos.length;
          updateImage(currentIndex);
        }
        // Если клик был в левой половине
        else {
          currentIndex =
            (currentIndex - 1 + imgPhotos.length) % imgPhotos.length;
          updateImage(currentIndex);
        }
      });
    }
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        overlay.remove();
      });
    }

    if (main) {
      main.addEventListener("click", (event: any) => {
        event.stopImmediatePropagation();
        event.stopPropagation();
        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        overlay.remove();
      });
    }
  };
  const touchRightArrow = (event: any) => {
    event.stopPropagation();
    currentIndex = (currentIndex + 1) % imgPhotos.length;
    updateImage(currentIndex);
  };

  const touchLeftArrow = (event: any) => {
    event.stopPropagation();
    currentIndex = (currentIndex - 1 + imgPhotos.length) % imgPhotos.length;
    updateImage(currentIndex);
  };

  function isMobile() {
    return window.innerWidth <= 768;
  }
  let MAX_SIZE = 0;
  if (isMobile()) {
    MAX_SIZE = 300;
  } else {
    MAX_SIZE = 1000;
  }

  function filterImages() {
    let resheight = 0;
    let reswidth = 0;
    let limitExceeded = false; // Флаг для отслеживания превышения лимита

    imgPhotos.forEach((img: any) => {
      const imgHeight = img.naturalHeight;
      const imgWidth = img.clientWidth;
      if (reswidth + imgWidth <= MAX_SIZE) {
        img.style.display = "block";
        resheight += imgHeight;
        reswidth += imgWidth;
      } else {
        img.style.display = "none";
        limitExceeded = true; // Устанавливаем флаг, если лимит превышен
      }
    });
    if (toggleButton) {
      // Показываем или скрываем кнопку в зависимости от превышения лимита
      toggleButton.style.display = limitExceeded ? "block" : "none";
    }
  }

  // Функция для обработки загрузки изображений
  function onImagesLoaded() {
    filterImages();
    if (!toggleButton) {
      return;
    }
    toggleButton.addEventListener("click", () => {
      const isHidden = toggleButton.textContent === "Показать...";
      if (isHidden) {
        imgPhotos.forEach((img: any) => {
          img.style.display = "block"; // Показываем все изображения
        });
      } else {
        filterImages(); // Применяем фильтрацию
      }
      toggleButton.textContent = isHidden ? "Скрыть" : "Показать..."; // Меняем текст кнопки
    });
  }

  // Добавляем обработчик события загрузки для каждого изображения
  let imagesLoaded = 0;
  imgPhotos.forEach((img: any) => {
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === imgPhotos.length) {
        onImagesLoaded(); // Все изображения загружены
      }
    };
    if (img.complete) {
      imagesLoaded++;
      if (imagesLoaded === imgPhotos.length) {
        onImagesLoaded(); // Все изображения загружены
      }
    }
  });

  imgPhotos.forEach((img: any, index: any) => {
    img.addEventListener("click", (event: any) => {
      handleOpenSlideshow(event, updateImage, index);
    });
  });
  if (imgAvatar) {
    imgAvatar.addEventListener("click", (event: any) => {
      handleOpenSlideshow(event, showAvatar);
    });
  }

  function animateImageTransition(
    oldIndex: any,
    newIndex: any,
    direction: any,
  ) {
    const imageModal: any = document.querySelector(".image-photos-modal");

    // Сдвинуть текущее изображение
    imageModal.style.transform = `translateX(${direction}%)`;

    // Обновить изображение через 500 мс (время анимации)
    setTimeout(() => {
      updateImage(newIndex); // Обновляем изображение

      // Вернуть изображение на место
      imageModal.style.transition = "none"; // Отключаем анимацию на время обновления
      imageModal.style.transform = `translateX(${direction * -2}%)`; // Сдвигаем за границы
      setTimeout(() => {
        imageModal.style.transition = ""; // Включаем анимацию обратно
        imageModal.style.transform = "translateX(0)"; // Возвращаем на место
      }, 50); // Небольшая задержка для применения стиля
    }, 500); // Время совпадает с временем анимации
  }
}
async function complaintPost(postID: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/moderation/moderation/post/complaint",
      { postID: postID },
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
function modifierModalComplaintPost(
  dropdownmenu: any,
  mainContent: any,
  container: any,
  post: any,
) {
  dropdownmenu.classList.remove(ELEMENTS_CLASS.ACTIVE);
  const place = document.querySelector(`.complaint-form`);
  const modal: any = renderComplaintPost(post);
  update(place, modal);

  const modalsDelete: any = document.querySelector(".modal__deletepost");
  const overlay: any = showOverlay(modalsDelete, mainContent);
  const buttonCancel: any = modalsDelete.querySelector(`.cancel`);
  const buttonBlock: any = modalsDelete.querySelector(`.delete`);

  modalsDelete.style.display = "block";
  mainContent.classList.add("blur");

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
    const response: any = await complaintPost({
      postID: post.postId,
    });
    console.log(post);
    container.style.display = "none";
    modalsDelete.style.display = "none";
    mainContent.classList.remove("blur");
    document.body.style.overflow = "auto";
    overlay.remove();
  };

  buttonBlock.addEventListener("click", handleClickBlock);
  buttonCancel.addEventListener("click", handleClickCancel);
  overlay.addEventListener("click", handleClickCancel);
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
async function customizePost(container: any, post: any = null) {
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
      gotoauthor(post.authorId);
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
      if (!hasLogged()) {
        route(LINKS.LOGIN.HREF);
        return;
      }
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

  const rightContainer = document.querySelector(`.right-content`);
  controlSlideShow(container, rightContainer);

  const menu = container.querySelector(`.menu-icon`);
  const alldropdownMenu = document.querySelectorAll(`.dropdown-menu`);
  const dropdownmenu: any = container.querySelector(`.dropdown-menu`);

  if (!menu) return;
  const handleClickMenu = async (event: any) => {
    if (event.target.classList.contains("button-delete-post")) {
      modifierModalComplaintPost(dropdownmenu, rightContainer, container, post);
      return;
    }
    event.stopPropagation();

    const isActive = dropdownmenu.classList.contains(ELEMENTS_CLASS.ACTIVE);

    alldropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
      dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
    });
    if (!isActive) {
      dropdownmenu.classList.toggle(ELEMENTS_CLASS.ACTIVE);
    }
  };

  menu.addEventListener("click", handleClickMenu);
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
async function renderPopularPosts(popularPosts: any) {
  const postsPromises = popularPosts.map(async (post: any) => {
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

/**
 * Рендерит скелет недавних постов
 * @returns
 */
async function renderRecentlyPosts(recentlyPosts: any) {
  const postsPromises = recentlyPosts.map(async (post: any) => {
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

async function paginate(
  allPopularPosts: any,
  allRecentlyPosts: any,
  containerPopularPosts: any,
  containerRecentlyPosts: any,
) {
  let stopLoadPopularPosts: boolean = false;
  let stopLoadRecentlyPosts: boolean = false;
  let offsetPopular = 0;
  let offsetRecently = 0;
  let isLoading = false;

  // Используем Set для отслеживания активных запросов
  const activeRequests = new Set();

  async function loadPosts() {
    if (isLoading) return; // Если загрузка уже идет, выходим из функции
    isLoading = true; // Устанавливаем флаг загрузки

    const activeLinkFeed = sessionStorage.getItem("feed");
    activeLinkFeed == "0"
      ? (stopLoadPopularPosts = false)
      : (stopLoadRecentlyPosts = false);
    try {
      if (
        !stopLoadPopularPosts &&
        (window.location.pathname === "/feed" ||
          window.location.pathname === "/moderation")
      ) {
        // Загружаем популярные посты
        const requestId = `popular-${offsetPopular}`;
        if (activeRequests.has(requestId)) return; // Проверяем, был ли этот запрос уже отправлен
        activeRequests.add(requestId);

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
            nextPopularPosts.reverse(),
            [],
          );
        } else {
          stopLoadPopularPosts = true;
        }
        activeRequests.delete(requestId); // Удаляем запрос из активных
      }

      if (
        !stopLoadRecentlyPosts &&
        (window.location.pathname === "/feed" ||
          window.location.pathname === "/moderation") &&
        hasLogged()
      ) {
        // Загружаем недавние посты
        const requestId = `recent-${offsetRecently}`;
        if (activeRequests.has(requestId)) return; // Проверяем, был ли этот запрос уже отправлен
        activeRequests.add(requestId);

        const recentlyPosts: any = await getRecentlyPosts(offsetRecently);
        const nextRecentlyPosts = recentlyPosts.slice(0, QUERY.LIMIT);
        if (nextRecentlyPosts.length > 0) {
          allRecentlyPosts.push(...nextRecentlyPosts);
          offsetRecently += QUERY.LIMIT;

          // Обновляем контейнер недавних постов
          containerRecentlyPosts.append(
            ...(await renderRecentlyPosts(nextRecentlyPosts)),
          );
          modifirePosts(
            containerPopularPosts,
            containerRecentlyPosts,
            [],
            nextRecentlyPosts.reverse(),
          );
        } else {
          stopLoadRecentlyPosts = true;
        }
        activeRequests.delete(requestId); // Удаляем запрос из активных
      }
    } finally {
      isLoading = false; // Сбрасываем флаг загрузки
    }
  }

  // Инициализируем загрузку первых постов
  await loadPosts();

  // Обработчик события прокрутки
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= scrollHeight - 1000) {
      await loadPosts();
    }
  });
}

export { paginate };

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
import { setStatic } from "../../shared/getStatic/getStatic";
import { urlIconLike } from "../../app";

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
  const videoModal: any = modalPhotos.querySelector(`.video-modal`);
  const videoHud: any = modalPhotos.querySelector(`.video-hud`);
  const video: any = Array.from(container.querySelectorAll(".video-player"));
  console.log(video);
  const allContent: any = Array.from(
    container.querySelectorAll(".content-media"),
  );

  let imgAvatar: any = container.querySelector(`.author-avatar`);
  const toggleButton: any = container.querySelector(".toggleButton");
  if (!imgAvatar) {
    imgAvatar = container.querySelector(`.profile-avatar`);
  }
  var currentIndex = 0;

  const updateImage = (currentIndex: any) => {
    if (!imageModal || imgPhotos.length == 0) return;
    imageModal.style.display = "block";
    videoModal.style.display = "none";
    videoHud.style.display = "none";
    imageModal.src = imgPhotos[currentIndex].src;
    if (allContent[currentIndex].querySelector(`.video-player`)) {
      const placeVideo =
        allContent[currentIndex].querySelector(`.video-player`);
      imageModal.style.display = "none";
      videoModal.style.display = "block";
      videoHud.style.display = "flex";
      videoModal.src = placeVideo.src;
      const modalContainerPhotos: any = document.querySelector(
        `.modal-container-photos`,
      );
      modalContainerPhotos.appendChild(videoHud);
    }
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
    controlVideo(modalPhotos);

    if (leftArrow) {
      leftArrow.addEventListener("click", touchLeftArrow);
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", touchRightArrow);
    }

    if (isMobile() && imageModal.style.display !== "none") {
      let startX = 0;
      let endX = 0;
      modalPhotos.addEventListener("click", (event: any) => {
        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        videoModal.pause();
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
      if (imageModal.style.display !== "none")
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
        videoModal.pause();
        overlay.remove();
      });
    }

    // if (main) {
    //   main.addEventListener("click", (event: any) => {
    //     event.stopImmediatePropagation();
    //     event.stopPropagation();
    //     document.body.style.overflow = "auto";
    //     modalPhotos.style.display = "none";
    //     rightContent.classList.remove("blackout");
    //     videoModal.pause();
    //     overlay.remove();
    //   });
    // }
  };
  const touchRightArrow = (event: any) => {
    event.stopPropagation();
    videoModal.pause();
    currentIndex = (currentIndex + 1) % allContent.length;
    updateImage(currentIndex);
  };

  const touchLeftArrow = (event: any) => {
    event.stopPropagation();
    videoModal.pause();
    currentIndex = (currentIndex - 1 + allContent.length) % allContent.length;
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

  allContent.forEach((img: any, index: any) => {
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
function controlVideo(container: any) {
  if (container.videoInitialized) {
    return; // Если да, выходим из функции
  }
  container.videoInitialized = true; // Устанавливаем флаг инициализации

  //Плеер
  var videoPlayer = container.querySelector(".video-modal");
  //Время
  var progressBar = container.querySelector(".video-hud__progress-bar");
  var currTime = container.querySelector(".video-hud__curr-time");
  var durationTime = container.querySelector(".video-hud__duration");
  // //Кнопки
  var actionButton = container.querySelector(".video-hud__action");
  var muteButton = container.querySelector(".video-hud__mute");
  var volumeScale = container.querySelector(".video-hud__volume");
  var speedSelect = container.querySelector(".video-hud__speed");
  const buttonFullHD = container.querySelector(`.full_hd`);
  const slideShow: any = document.querySelector(`.slideshow`);

  actionButton.removeEventListener("click", videoAct);
  videoPlayer.removeEventListener("click", videoAct);
  videoPlayer.removeEventListener("timeupdate", videoProgress);
  progressBar.removeEventListener("click", videoChangeTime);
  muteButton.removeEventListener("click", videoMute);
  volumeScale.removeEventListener("change", videoChangeVolume);
  speedSelect.removeEventListener("change", videoChangeSpeed);

  const buttonDownload: any = container.querySelector(`.video-hud__download`);
  buttonDownload.href = videoPlayer.src;
  // const handleMouseMove = () => {
  //   const videoHud: any = container.querySelector(`.video-hud`);
  //   videoHud.style.opacity = "1";
  // };
  // const handleMouseOut = () => {
  //   const videoHud: any = container.querySelector(`.video-hud`);
  //   videoHud.style.opacity = "0";
  // };

  let hideHudTimeout: any;

  const handleMouseMove = () => {
    const videoHud: any = container.querySelector(`.video-hud`);
    if (window.innerWidth <= 768) {
      videoHud.style.opacity = 1;
      return;
    }
    // videoHud.style.opacity = "1";
    videoHud.classList.add("active");
    // Если мышь движется, сбрасываем таймер
    if (hideHudTimeout) {
      clearTimeout(hideHudTimeout);
    }

    // Устанавливаем новый таймер для скрытия элементов управления через 3 секунды (3000 мс)
    hideHudTimeout = setTimeout(() => {
      videoHud.classList.remove("active");
      // videoHud.style.opacity = "0";
    }, 3000); // Вы можете изменить время на ваше усмотрение
  };

  const handleMouseOut = () => {
    const videoHud: any = container.querySelector(`.video-hud`);
    if (window.innerWidth <= 768) {
      videoHud.style.opacity = 1;
      return;
    }
    // videoHud.style.opacity = "0";
    videoHud.classList.remove("active");
    // Очищаем таймер, если мышь выходит за пределы контейнера
    if (hideHudTimeout) {
      clearTimeout(hideHudTimeout);
    }
  };
  const handleClickFullHD = (e: any) => {
    e.stopPropagation();
    slideShow.style.pointerEvents = "none";
    slideShow.style.userSelect = "none";

    if (container.style.width == "800px" || !container.style.width) {
      if (window.innerWidth > 768) {
        container.style.width = "100%";
        videoPlayer.style.height = "1045px";
      }
      if (!document.fullscreenElement) {
        // Проверяем, в полноэкранном ли режиме
        if (videoPlayer.requestFullscreen) {
          videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
          // Safari
          videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
          // IE11
          videoPlayer.msRequestFullscreen();
        }
      }
      // videoPlayer.webkitRequestFullscreen();
    } else {
      if (window.innerWidth <= 768) {
        // videoPlayer.style.
        container.style.width = "390px";
        return;
      }
      container.style.width = "800px";
      videoPlayer.style.height = "450px";
      slideShow.style.userSelect = "";
      slideShow.style.pointerEvents = "";
    }
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (window.innerWidth <= 768) {
        // videoPlayer.style.
        container.style.width = "390px";
        return;
      }
      container.style.width = "800px"; // Возвращаем ширину к 800px
      videoPlayer.style.height = "450px"; // Возвращаем высоту к 450px
      slideShow.style.userSelect = ""; // Включаем выделение
      slideShow.style.pointerEvents = ""; // Включаем взаимодействие
    }
  };

  buttonFullHD.removeEventListener("click", handleClickFullHD);
  buttonFullHD.addEventListener("click", handleClickFullHD);
  const videoHud: any = container.querySelector(`.video-hud`);
  videoHud.addEventListener("mousemove", handleMouseMove);
  videoHud.addEventListener("mouseout", handleMouseOut);
  videoPlayer.addEventListener("mousemove", handleMouseMove);
  videoPlayer.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("keydown", handleKeyPress);
  function videoAct(e: any) {
    e.stopPropagation();
    //Запускаем или ставим на паузу
    if (videoPlayer.paused) {
      videoPlayer.play();
      actionButton.setAttribute(
        "class",
        "video-hud__element video-hud__action video-hud__action_play",
      );
    } else {
      videoPlayer.pause();
      actionButton.setAttribute(
        "class",
        "video-hud__element video-hud__action video-hud__action_pause",
      );
    }
    if (durationTime.innerHTML == "00:00") {
      durationTime.innerHTML = videoTime(videoPlayer.duration); //Об этой функции чуть ниже
    }
  }
  if (window.innerWidth <= 768) {
    videoHud.style.opacity = 1;
  }
  // Запуск, пауза
  actionButton.addEventListener("click", videoAct);
  videoPlayer.addEventListener("click", videoAct);

  function videoTime(time: any) {
    //Рассчитываем время в секундах и минутах
    time = Math.floor(time);
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time - minutes * 60);
    var minutesVal: any = minutes;
    var secondsVal: any = seconds;
    if (minutes < 10) {
      minutesVal = "0" + minutes;
    }
    if (seconds < 10) {
      secondsVal = "0" + seconds;
    }
    return minutesVal + ":" + secondsVal;
  }
  function videoProgress() {
    // videoPlayer.removeEventListener("timeupdate", videoProgress);
    // Ensure the video is loaded and has a valid duration
    if (!videoPlayer.duration || videoPlayer.duration === Infinity) {
      return; // Exit if duration is not valid
    }

    // Calculate progress
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;

    // Ensure progress is between 0 and 100
    progressBar.value = Math.max(0, Math.min(progress, 100));

    // Display current time
    currTime.innerHTML = videoTime(videoPlayer.currentTime);
  }
  // function videoProgress() {
  //   //Отображаем время воспроизведения
  //   const progress =
  //     Math.floor(videoPlayer.currentTime) /
  //     (Math.floor(videoPlayer.duration) / 100);
  //   progressBar.value = progress;
  //   currTime.innerHTML = videoTime(videoPlayer.currentTime);
  // }
  function videoChangeTime(e: MouseEvent) {
    // Получаем координаты клика относительно прогресс-бара
    const rect = progressBar.getBoundingClientRect(); // Получаем размеры и положение прогресс-бара
    let mouseX: number = e.clientX - rect.left;

    if (mouseX < 0) {
      mouseX = 0;
    } else if (mouseX > rect.width) {
      mouseX = rect.width;
    }

    const progress = (mouseX / rect.width) * 100;

    videoPlayer.currentTime = videoPlayer.duration * (progress / 100);
  }

  // Отображение времени
  videoPlayer.addEventListener("timeupdate", videoProgress);
  // Перемотка
  progressBar.addEventListener("click", videoChangeTime);

  // function videoChangeTime(e: any) {
  //   // progressBar.removeEventListener("click", videoChangeTime);
  //   //Перематываем
  //   var mouseX = Math.floor(e.pageX - progressBar.offsetLeft) - 152;
  //   alert(mouseX)
  //   var progress = mouseX / (progressBar.offsetWidth / 100);
  //   alert(progress)
  //   videoPlayer.currentTime = videoPlayer.duration * (progress / 100);
  // }

  // //Отображение времени
  // videoPlayer.addEventListener("timeupdate", videoProgress);
  // //Перемотка
  // progressBar.addEventListener("click", videoChangeTime);

  function videoChangeVolume() {
    //Меняем громкость
    var volume = volumeScale.value / 100;
    videoPlayer.volume = volume;
    if (videoPlayer.volume == 0) {
      muteButton.setAttribute(
        "class",
        "video-hud__element video-hud__mute video-hud__mute_true",
      );
    } else {
      muteButton.setAttribute(
        "class",
        "video-hud__element video-hud__mute video-hud__mute_false",
      );
    }
  }
  function videoMute() {
    //Убираем звук
    if (videoPlayer.volume == 0) {
      videoPlayer.volume = volumeScale.value / 100;
      muteButton.setAttribute(
        "class",
        "video-hud__element video-hud__mute video-hud__mute_false",
      );
    } else {
      videoPlayer.volume = 0;
      muteButton.setAttribute(
        "class",
        "video-hud__element video-hud__mute video-hud__mute_true",
      );
    }
  }
  function videoChangeSpeed() {
    //Меняем скорость
    var speed = speedSelect.value / 100;
    videoPlayer.playbackRate = speed;
  }

  //Звук
  muteButton.addEventListener("click", videoMute);
  volumeScale.addEventListener("change", videoChangeVolume);
  //Работа со скоростью
  speedSelect.addEventListener("change", videoChangeSpeed);
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
  const iconLike: any = divLikes.querySelector(`.likes`);
  setStatic(iconLike, urlIconLike);

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

  //Получаем объекты
  // controlVideo(container);
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
    console.log(containerMedia);
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
  activeRequests: any,
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
        // activeRequests.delete(requestId); // Удаляем запрос из активных
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
      }
    } finally {
      isLoading = false; // Сбрасываем флаг загрузки
    }
  }

  // Инициализируем загрузку первых постов
  await loadPosts();

  // Обработчик события прокрутки
  let isLoadingTop = false;

  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollWidth } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= 3000 && !isLoadingTop) {
      isLoadingTop = true;
      await loadPosts();
      isLoadingTop = false;
    }
  });
}

export { paginate };

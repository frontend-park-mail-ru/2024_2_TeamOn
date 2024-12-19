import { ELEMENTS_CLASS, LINKS, QUERY } from "../../shared/consts/consts";
import { getPopularPosts } from "../getPopularPosts/getPopularPosts";
import { getRecentlyPosts } from "../getRecentlyPosts/getRecentlyPosts";
import { containerComment, containerPost } from "../../widgest/feed";
import { renderTo, update } from "../../../lib/vdom/lib";
import { setLike } from "../../entities/likes";
import { convertISOToRussianDate } from "../../shared/utils/parsedate";
import { route } from "../../shared/routing/routing";
import { getAvatar } from "../getavatar/getavatar";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";
import { hasLogged } from "../../shared/utils/hasLogged";
import { gotoauthor } from "../../shared/gotoauthor/gotoauthor";
import { showOverlay } from "../../shared/overlay/overlay";
import { renderComplaint } from "../../pages/feed/ui/feed";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { setStatic } from "../../shared/getStatic/getStatic";
import {
  iconArrowNextMediaFiles,
  pageContainer,
  urlDeleteComment,
  urlEditComment,
  urlFullHD,
  urlIconComment,
  urlIconLike,
  urlVideoDownload,
  urlVideoPlay,
  urlVideoStop,
  urlVideoVolume,
  urlVideoVolumeMute,
} from "../../app";
import { hideLoader, showLoader } from "../../pages/feed";
import {
  getComments,
  setComments,
} from "../controlAdaptivePageAuthor/controlAdaptivePageAuthor";
import {
  contentComment,
  editContentComment,
} from "../../widgest/feed/ui/comments/comments";
import { findCommentById } from "../../shared/findByID/findByID";
import DOMPurify from "dompurify";
import { renderNextArrow } from "./nextarrow";

export function controlSlideShow(container: any, rightContainer: any) {
  const nextButtonMedia = container.querySelector(`.next-media-button`);
  const modalPhotos: any = document.querySelector(`.modal-view-photos`); //
  const rightContent: any = rightContainer;
  const closeModal: any = document.querySelector(`.close-modal-view`); //
  const main: any = document.querySelector("main");
  let imageModal: any = null;
  let leftArrow: any = null;
  let rightArrow: any = null;
  let overlay: any = null;
  let imgPhotos: any = null;
  let videoModal: any = null;
  let videoHud: any = null;
  if (modalPhotos) {
    imageModal = modalPhotos.querySelector(".image-photos-modal"); //
    // Обработчики для кнопок переключения
    leftArrow = modalPhotos.querySelector(".leftarrow-modal-view"); //
    rightArrow = modalPhotos.querySelector(".rightarrow-modal-view"); //
    imgPhotos = Array.from(container.querySelectorAll(`.image-photo`)); //
    videoModal = modalPhotos.querySelector(`.video-modal`);
    videoHud = modalPhotos.querySelector(`.video-hud`);
  }
  const video: any = Array.from(container.querySelectorAll(".video-player"));
  let allContent: any = Array.from(container.querySelectorAll(".image-photo"));
  // Функция для проверки, является ли элемент видео
  const isAudio = (element: any) => {
    // Предположим, что видео имеет тег <video> внутри элемента
    return element.querySelector(".audio") !== null;
  };

  // Фильтруем массив, исключая элементы, которые содержат audio
  const filteredContent = allContent.filter(
    (element: any) => !isAudio(element),
  );
  allContent = filteredContent;
  let imgAvatar: any = container.querySelector(`.author-avatar`);
  const toggleButton: any = container.querySelector(".toggleButton");
  if (!imgAvatar) {
    imgAvatar = container.querySelector(`.profile-avatar`);
  }
  if (window.location.pathname === "/notifications") {
    imgAvatar = container.querySelector(`.notif-avatar`);
  }
  var currentIndex = 0;
  let isTransitioning = false;

  const updateImage = (currentIndex: any, target: any = null) => {
    if (!imageModal || imgPhotos.length == 0) return;
    imageModal.style.display = "block";
    if (videoModal && videoHud) {
      videoModal.style.display = "none";
      videoHud.style.display = "none";
    }
    if (target !== "arrow" && target != "swipe") {
      imageModal.src = target.src;
    } else {
      imageModal.src = imgPhotos[currentIndex].src;
    }
    console.log(imgPhotos[currentIndex]);
    if (
      (target && target instanceof HTMLVideoElement) ||
      (target === "arrow" &&
        allContent[currentIndex].querySelector(`.video-player`))
    ) {
      let placeVideo = allContent[currentIndex].querySelector(`.video-player`);
      if (target !== "arrow") {
        placeVideo = target;
      }
      imageModal.style.display = "none";
      if (videoModal && videoHud) {
        videoModal.style.display = "block";
        videoHud.style.display = "block";
        videoModal.src = placeVideo.src;
      }
      const modalContainerPhotos: any = document.querySelector(
        `.modal-container-photos`,
      );
      if (videoHud) {
        modalContainerPhotos.appendChild(videoHud);
      }
    }
  };

  const showAvatar = () => {
    if (!imageModal) return;
    imageModal.style.display = "block";
    if (videoModal && videoHud) {
      videoModal.style.display = "none";
      videoHud.style.display = "none";
    }

    imageModal.src = imgAvatar.src;
    return;
  };

  const handleOpenSlideshow = (
    event: any,
    callback: any,
    index: any = null,
    target: any = null,
  ) => {
    event.stopPropagation();
    callback(currentIndex, target);
    if (
      isMobile() &&
      videoModal &&
      videoModal.style.display == "block" &&
      imageModal.style.display == "none"
    ) {
      window.location.href = videoModal.src;
      return;
    }
    if (modalPhotos) {
      modalPhotos.style.display = "block";
    }
    rightContent.classList.add("blackout");
    overlay = showOverlay(modalPhotos, rightContent);

    currentIndex = index;
    document.body.style.overflow = "hidden";
    if (videoHud && videoModal) {
      controlVideo(modalPhotos);
    }

    if (leftArrow) {
      leftArrow.addEventListener("click", touchLeftArrow);
    }

    if (rightArrow) {
      rightArrow.addEventListener("click", touchRightArrow);
    }

    if (isMobile() && videoModal && videoModal.style.display === "none") {
      let startX = 0;
      let endX = 0;
      let startY = 0;
      let endY = 0;
      let isClick = false;
      let isSwipe = false;
      let fullScreen = false;

      modalPhotos.addEventListener("click", (event: any) => {
        if (isMobile()) {
          return;
        }

        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        if (videoModal) {
          videoModal.pause();
        }
        overlay.remove();
      });
      modalPhotos.addEventListener("touchstart", (event: any) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        isClick = true; // Предполагаем, что это клик
        isSwipe = false; // Сбрасываем флаг свайпа
      });

      modalPhotos.addEventListener("touchmove", (event: any) => {
        endX = event.touches[0].clientX;
        endY = event.touches[0].clientY;
        // Проверяем, достаточно ли перемещение для свайпа
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          isSwipe = true;
          isClick = false;
        }
      });

      var handleClick = () => {
        if (isSwipe) return;
        if (videoModal && videoModal.style.display === "block") {
          const slideShow: any = document.querySelector(`.slideshow`);
          var videoPlayer: any = document.querySelector(".video-modal");

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
                fullScreen = true;
              } else if (videoPlayer.webkitRequestFullscreen) {
                // Safari
                videoPlayer.webkitRequestFullscreen();
                fullScreen = true;
              } else if (videoPlayer.msRequestFullscreen) {
                // IE11
                videoPlayer.msRequestFullscreen();
                fullScreen = true;
              }
            }
          } else {
            if (window.innerWidth <= 768) {
              container.style.width = "390px";
              return;
            }
            container.style.width = "800px";
            videoPlayer.style.height = "450px";
            slideShow.style.userSelect = "";
            slideShow.style.pointerEvents = "";
          }
          isClick = true;
          return;
        }
      };
      var handleTouched = (e: any) => {
        if (isClick) return;
        e.stopPropagation();
        if (document.fullscreenElement) return;
        if (allContent.length == 1) return;
        if (startX > endX + 50) {
          // Свайп влево
          const oldIndex = currentIndex;
          currentIndex = (currentIndex + 1) % allContent.length; // Увеличиваем индекс
          animateImageTransition(oldIndex, currentIndex, -100); // Сдвигаем влево
        } else if (startX < endX + 50) {
          // Свайп вправо
          const oldIndex = currentIndex;
          currentIndex =
            (currentIndex - 1 + allContent.length) % allContent.length; // Уменьшаем индекс
          animateImageTransition(oldIndex, currentIndex, 100); // Сдвигаем вправо
        } else if (startY > endY + 50) {
          animateImageTransition(0, currentIndex, -100); // Сдвигаем влево
        }
        isSwipe = true;
      };
      if (videoModal) {
        videoModal.addEventListener("click", handleClick);
      }
      modalPhotos.addEventListener("touchend", handleTouched);
    }
    // const handleM
    if (!isMobile()) {
      // Обработка кликов
      if (!modalPhotos) {
        return;
      }
      modalPhotos.addEventListener("click", (event: any) => {
        if (videoModal && videoModal.style.display === "block") return;
        event.stopPropagation();
        const width = modalPhotos.clientWidth; // Получаем ширину элемента slideshow
        const midPoint = 1018; // Находим середину элемента
        // Если клик был в правой половине
        if (event.clientX > midPoint) {
          currentIndex = (currentIndex + 1) % allContent.length;
          updateImage(currentIndex);
        }
        // Если клик был в левой половине
        else {
          currentIndex =
            (currentIndex - 1 + allContent.length) % allContent.length;
          updateImage(currentIndex);
        }
      });
    }
    if (closeModal) {
      const handleCliclCancel = () => {
        document.body.style.overflow = "auto";
        modalPhotos.style.display = "none";
        rightContent.classList.remove("blackout");
        if (videoModal) {
          videoModal.pause();
        }
        overlay.remove();
        rightArrow.removeEventListener("click", touchRightArrow);
        leftArrow.removeEventListener("click", touchLeftArrow);
        modalPhotos.removeEventListener("touchend", handleTouched);
      };
      closeModal.addEventListener("click", handleCliclCancel);
      overlay.addEventListener("click", handleCliclCancel);
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
    if (isTransitioning) return;
    isTransitioning = true;
    if (videoModal) {
      videoModal.pause();
    }
    currentIndex = (currentIndex + 1) % allContent.length;
    updateImage(currentIndex, "arrow");
    setTimeout(() => {
      isTransitioning = false; // Сбрасываем флаг после завершения анимации
    }, 500);
    // rightArrow.removeEventListener("click", touchRightArrow);
  };

  const touchLeftArrow = (event: any) => {
    event.stopPropagation();
    if (isTransitioning) return;
    isTransitioning = true;
    if (videoModal) {
      videoModal.pause();
    }
    currentIndex = (currentIndex - 1 + allContent.length) % allContent.length;
    updateImage(currentIndex, "arrow");
    setTimeout(() => {
      isTransitioning = false; // Сбрасываем флаг после завершения анимации
    }, 500); // Время совпадает с временем анимации
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
  if (nextButtonMedia) {
    nextButtonMedia.addEventListener("click", () => {
      allContent.forEach((img: any) => {
        img.parentNode.style.display = "block";
      });
      nextButtonMedia.parentNode.style.height = "auto";
      nextButtonMedia.remove();
    });
  }
  // function filterImages() {
  //   let resheight = 0;
  //   let reswidth = 0;
  //   let limitExceeded = false; // Флаг для отслеживания превышения лимита
  //   allContent.forEach((img: any) => {
  //     const imgHeight = img.naturalHeight;
  //     const imgWidth = img.clientWidth;
  //     if (reswidth + imgWidth <= MAX_SIZE) {
  //       img.style.display = "block";
  //       resheight += imgHeight;
  //       reswidth += imgWidth;
  //     } else {
  //       img.style.display = "none";
  //       limitExceeded = true; // Устанавливаем флаг, если лимит превышен
  //     }
  //   });
  //   if (toggleButton) {
  //     // Показываем или скрываем кнопку в зависимости от превышения лимита
  //     toggleButton.style.display = limitExceeded ? "block" : "none";
  //   }
  // }

  // Функция для обработки загрузки изображений
  // function onImagesLoaded() {
  //   filterImages();
  //   if (!toggleButton) {
  //     return;
  //   }
  //   toggleButton.addEventListener("click", () => {
  //     const isHidden = toggleButton.textContent === "Показать...";
  //     if (isHidden) {
  //       allContent.forEach((img: any) => {
  //         img.style.display = "block"; // Показываем все изображения
  //       });
  //     } else {
  //       filterImages(); // Применяем фильтрацию
  //     }
  //     toggleButton.textContent = isHidden ? "Скрыть" : "Показать..."; // Меняем текст кнопки
  //   });
  // }

  // Добавляем обработчик события загрузки для каждого изображения
  // let imagesLoaded = 0;
  // allContent.forEach((img: any) => {
  //   onImagesLoaded();
  //   img.onload = () => {
  //     imagesLoaded++;
  //     if (imagesLoaded === allContent.length) {
  //       onImagesLoaded(); // Все изображения загружены
  //     }
  //   };
  //   if (img.complete) {
  //     imagesLoaded++;
  //     if (imagesLoaded === allContent.length) {
  //       onImagesLoaded(); // Все изображения загружены
  //     }
  //   }
  // });

  allContent.forEach((img: any, index: any) => {
    img.addEventListener("click", (event: any) => {
      if (img.querySelector(".video-player") && isMobile()) {
        window.location.href = img.querySelector(".video-player").src;
        return;
      }
      handleOpenSlideshow(event, updateImage, index, event.target);
    });
  });
  if (imgAvatar) {
    const handleClick = (event: any) => {
      handleOpenSlideshow(event, showAvatar);
    };
    imgAvatar.addEventListener("click", handleClick);
  }

  function animateImageTransition(
    oldIndex: any,
    newIndex: any,
    direction: any,
  ) {
    if (allContent[newIndex].querySelector(`.video-player`)) return;
    const imageModal: any = document.querySelector(".image-photos-modal");

    // Сдвинуть текущее изображение
    imageModal.style.transform = `translateX(${direction}%)`;

    // Обновить изображение через 500 мс (время анимации)
    setTimeout(() => {
      updateImage(newIndex, "swipe"); // Обновляем изображение

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
  container.videoInitialized = true; // Устанавливаем флаг инициализации
  const fullhdButton = container.querySelector(`.full_hd`);
  const iconVolume = container.querySelector(`.volume-icon-test`);
  const iconDownload = container.querySelector(`.video-hud__download`);
  const iconPlay = container.querySelector(`.play-button`);
  if (fullhdButton) {
    setStatic(fullhdButton, urlFullHD);
  }
  if (iconVolume) {
    setStatic(iconVolume, urlVideoVolume);
  }
  if (iconDownload) {
    setStatic(iconDownload, urlVideoDownload);
  }
  if (iconPlay) {
    setStatic(iconPlay, urlVideoPlay);
  }
  //Плеер
  var videoPlayer = container.querySelector(".video-modal");
  //Время
  var progressBar = container.querySelector(".progress-test");
  var currTime = container.querySelector(".video-hud__curr-time");
  var durationTime = container.querySelector(".video-hud__duration");
  // //Кнопки
  var actionButton = container.querySelector(".video-hud__action");
  var muteButton = container.querySelector(".volume-icon-test");
  var volumeScale = container.querySelector(".video-hud__volume");
  var speedSelect = container.querySelector(".video-hud__speed");
  const buttonFullHD = container.querySelector(`.full_hd`);
  const slideShow: any = document.querySelector(`.slideshow`);
  var divVolumeScale = container.querySelector(".div-volumescale");
  const closeButton = container.querySelector(`.close-modal-view`);

  actionButton.removeEventListener("click", videoAct);
  videoPlayer.removeEventListener("click", videoAct);
  videoPlayer.removeEventListener("timeupdate", videoProgress);
  progressBar.removeEventListener("click", videoChangeTime);
  muteButton.removeEventListener("click", videoMute);
  volumeScale.removeEventListener("change", videoChangeVolume);
  speedSelect.removeEventListener("change", videoChangeSpeed);

  const buttonDownload: any = container.querySelector(`.download_video`);
  buttonDownload.href = videoPlayer.src;

  let hideHudTimeout: any;
  const hideVolumeScale = () => {
    divVolumeScale.style.display = "none";
    volumeScale.style.display = "none";
  };
  const showVolumeScale = (e: any) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.target === volumeScale || e.target === muteButton) {
      divVolumeScale.style.display = "block";
      volumeScale.style.display = "block";
    }
  };
  muteButton.removeEventListener("mouseleave", hideVolumeScale);
  muteButton.removeEventListener("mouseenter", showVolumeScale);

  muteButton.addEventListener("mouseleave", hideVolumeScale);
  muteButton.addEventListener("mouseenter", showVolumeScale);

  const handleMouseMove = () => {
    const videoHud: any = container.querySelector(`.video-hud`);
    if (window.innerWidth <= 768) {
      videoHud.style.opacity = 1;
      return;
    }
    closeButton.style.opacity = "1";
    videoHud.classList.add("active");
    // Если мышь движется, сбрасываем таймер
    if (hideHudTimeout) {
      clearTimeout(hideHudTimeout);
    }

    // Устанавливаем новый таймер для скрытия элементов управления через 3 секунды (3000 мс)
    hideHudTimeout = setTimeout(() => {
      closeButton.style.opacity = "0";
      videoHud.classList.remove("active");
    }, 3000); // Вы можете изменить время на ваше усмотрение
  };

  const handleMouseOut = (e: any) => {
    const videoHud: any = container.querySelector(`.video-hud`);
    if (window.innerWidth <= 768) {
      videoHud.style.opacity = 1;
      return;
    }
    videoHud.classList.remove("active");
    // Очищаем таймер, если мышь выходит за пределы контейнера
    if (hideHudTimeout) {
      clearTimeout(hideHudTimeout);
    }
  };
  const handleClickFullHD = (e: any = null) => {
    if (e) e.stopPropagation();
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
  if (window.innerWidth <= 768) {
    const modalPhotos: any = document.querySelector(`.modal-view-photos`); //
    const videoHud: any = modalPhotos.querySelector(`.video-hud`);
    if (videoHud.style.display === "none") return;
    handleClickFullHD();
    return;
  }
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
  function videoAct() {
    // e.stopPropagation();
    //Запускаем или ставим на паузу
    if (videoPlayer.paused) {
      videoPlayer.play();
      actionButton.setAttribute(
        "class",
        "play-button video-hud__element video-hud__action video-hud__action_play",
      );
      setStatic(iconPlay, urlVideoPlay);
    } else {
      videoPlayer.pause();
      actionButton.setAttribute(
        "class",
        "play-button stop video-hud__element video-hud__action",
      );
      setStatic(iconPlay, urlVideoStop);
    }
    if (durationTime.innerHTML == "00:00") {
      durationTime.innerHTML = videoTime(videoPlayer.duration); //Об этой функции чуть ниже
    }
  }
  if (window.innerWidth <= 768) {
    videoHud.style.opacity = 1;
  }

  if (videoPlayer.paused) {
    actionButton.setAttribute(
      "class",
      "play-button stop video-hud__element video-hud__action",
    );
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
    if (!videoPlayer.duration || videoPlayer.duration === Infinity) {
      return;
    }

    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;

    progressBar.value = Math.max(0, Math.min(progress, 100));

    currTime.innerHTML = videoTime(videoPlayer.currentTime);
  }

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

  function videoChangeVolume() {
    //Меняем громкость
    var volume = volumeScale.value / 100;
    videoPlayer.volume = volume;
    muteButton.classList.remove("stop");
    setStatic(iconVolume, urlVideoVolume);
    if (volume === 0) {
      muteButton.classList.add("stop");
      setStatic(iconVolume, urlVideoVolumeMute);
    }
  }
  function videoMute(event: any) {
    event.stopImmediatePropagation();
    if (event.target == container.querySelector(`.video-hud__volume`)) return;
    //Убираем звук
    if (videoPlayer.volume == 0) {
      muteButton.classList.remove("stop");
      videoPlayer.volume = volumeScale.value / 100;
    } else {
      muteButton.classList.add("stop");
      videoPlayer.volume = 0;
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
  volumeScale.addEventListener("input", videoChangeVolume);
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
  const modal: any = renderComplaint(post);
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
    const response: any = await complaintPost(post.postId);
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
async function customizeComment(container: any, comment: any, postID: string) {
  const date: any = container.querySelector(`.${ELEMENTS_CLASS.POST.DATE}`);
  date.textContent = convertISOToRussianDate(comment.createdAt);

  const content: any = container.querySelector(`.comment-title`);
  content.innerHTML = `${comment.content}`;
  const currentCommentID = comment.commentID;
  console.log(comment);

  const username = container.querySelector(`.author-comment-name`);
  username.innerHTML = `${comment.username}`;

  username.addEventListener("click", () => {
    gotoauthor(comment.userID);
  });
  const buttonDelete = container.querySelector(`.button-delete-comment`);
  const divDeleteButton = container.querySelector(`.container-delete-comment`);
  const divEditButton = container.querySelector(`.container-edit-comment`);
  const buttonEdit = container.querySelector(`.button-edit-comment`);
  const buttonSave = container.querySelector(".save-comment");
  const buttonCancel = container.querySelector(`.cancel-comment`);
  setStatic(buttonEdit, urlEditComment);
  setStatic(buttonDelete, urlDeleteComment);

  const handleSaveComment = async () => {
    const newContent = container.querySelector(`.comment-edit`);
    const containerContent = contentComment(newContent.value);
    const sanitizedMessage = DOMPurify.sanitize(newContent.value);
    if (sanitizedMessage == "") {
      const error = container
        .querySelector(`.iteraction-section-comment`)
        .querySelector("p");
      if (!error) {
        const error = document.createElement("p");
        error.style.color = "red";
        error.textContent = "Ошибка. Комментарий не может быть пустым";
        container
          .querySelector(`.iteraction-section-comment`)
          .appendChild(error);
      }
      return;
    }
    const response = await saveComment(
      comment.commentID,
      DOMPurify.sanitize(newContent.value),
    );
    if (response) {
      const error = container
        .querySelector(`.iteraction-section-comment`)
        .querySelector("p");
      if (error) {
        error.remove();
      }
    }
    update(content, containerContent);
    buttonSave.style.display = "none";
    buttonCancel.style.display = "none";
  };
  const handleClickSaveComment = (e: any) => {
    e.preventDefault();
    handleSaveComment();
  };
  const handleClickKeySaveComment = (e: any) => {
    if (e.key === "Enter" && e.shiftKey) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveComment();
    }
  };
  const handleClickEditCancelComment = async () => {
    const comments: any = await getComments(postID, 0, 300);
    const comment = findCommentById(currentCommentID, comments);
    const content = container.querySelector(`.comment-edit`);
    const currentText = comment.content;
    const containerContent = contentComment(currentText); // <-- сюда его вставляю
    const error = container
      .querySelector(`.iteraction-section-comment`)
      .querySelector("p");
    if (error) {
      error.remove();
    }
    update(container.querySelector(`.comment-title`), containerContent);
    buttonSave.style.display = "none";
    buttonCancel.style.display = "none";
  };
  const handleClickDeleteComent = () => {
    modifierModalDeleteComment(container, comment, postID);
  };
  const handleClickEditComment = async () => {
    const comments: any = await getComments(postID, 0, 300);
    const comment = findCommentById(currentCommentID, comments);
    const containerContent = editContentComment();
    const editContent = update(content, containerContent);
    const title = editContent.querySelector(`.comment-edit`);
    title.textContent = `${comment.content}`; // Вставляем текст комментария
    title.setAttribute("contenteditable", "true"); // Делаем элемент редактируемым
    title.focus(); // Устанавливаем фокус на элемент

    buttonSave.style.display = "flex";
    buttonCancel.style.display = "flex";
    buttonSave.addEventListener("click", handleClickSaveComment);
    title.addEventListener("keydown", handleClickKeySaveComment);
    buttonCancel.addEventListener("click", handleClickEditCancelComment);
  };

  if (sessionStorage.getItem("account") === comment.username && hasLogged()) {
    divEditButton.style.display = "flex";
    divDeleteButton.style.display = "flex"; // ИСПРАВИТЬ!
    buttonDelete.addEventListener("click", handleClickDeleteComent);
    buttonEdit.addEventListener("click", handleClickEditComment);
  }
  const rightContainer = document.querySelector(`.right-content`);
  controlSlideShow(container, rightContainer);
}
/**
 * Функция добавления лайка
 * @param postId
 * @returns
 */
async function saveComment(postID: string, content: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/posts/posts/comments/${postID}/update`,
      { content: content },
      (response) => {
        if (response.ok) {
          resolve(true);
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
 * Функция добавления лайка
 * @param postId
 * @returns
 */
async function addComment(postID: string, content: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/posts/posts/${postID}/comments/create`,
      { content: content },
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
 * Функция добавления лайка
 * @param postId
 * @returns
 */
async function deleteComment(commentID: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "DELETE",
      `/api/posts/posts/comments/${commentID}/delete`,
      null,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 404) {
          route(LINKS.ERROR.HREF);
        } else {
          response.json().then((data: any) => {
            resolve(data);
          });
        }
      },
    );
  });
}
function modifierModalDeleteComment(
  container: any,
  comment: any,
  postID: string,
) {
  let mainContent: any = document.querySelector(`.right-content`);
  if (!mainContent) mainContent = document.querySelector(`.profile-form`);
  const place = document.querySelector(`.delete-comment-form`);
  const modal: any = renderComplaint(comment, true);
  update(place, modal);

  const modalsDelete: any = document.querySelector(".modal__deletepost");
  const overlay: any = showOverlay(modalsDelete, mainContent);
  const buttonCancel: any = modalsDelete.querySelector(`.cancel`);
  const buttonDelete: any = modalsDelete.querySelector(`.delete`);

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

  const parentElement = container.parentNode;
  const placeContent = parentElement.parentNode;
  const oldCount = placeContent.querySelectorAll(".comment-item").length;
  const handleClickDelete = async (e: any) => {
    e.preventDefault();
    showLoader();
    try {
      const response: any = await deleteComment(comment.commentID);
      if (!response || response.message) {
        const error = modalsDelete.querySelector(".error");
        if (!error) {
          const error = document.createElement("p");
          error.classList.add("error");
          error.style.color = "red";
          error.textContent = response.message;
          modalsDelete.appendChild(error);
        }
        return;
      }
      modalsDelete.style.display = "none";
      parentElement.remove();
      if (placeContent.querySelectorAll(`.comment-item`).length === 0) {
        const activeRequests = new Set();
        await paginateComments(activeRequests, [], placeContent, postID, 0);
      }
      console.log(placeContent);
      const nextCommentsButton: any =
        placeContent.parentNode.querySelector(`.next-comments`);
      const amountComments: any =
        placeContent.parentNode.parentNode.querySelector(`.amount-comments`);
      const commentsCount: any = await getComments(postID, 0, 300);

      amountComments.innerHTML = `${commentsCount.length}`;
      if (oldCount > 1) {
        nextCommentsButton.textContent = "Скрыть комментарии";
      }
      if (commentsCount.length > 1 && oldCount === 1) {
        nextCommentsButton.textContent = "Показать следующие комментарии...";
        const allItems = placeContent.querySelectorAll(`.comment-item`);
        allItems.forEach((item: any, index: number) => {
          if (index !== 0) {
            item.remove();
          }
        });
      } else if (commentsCount.length === 1) {
        nextCommentsButton.style.display = "none";
      }
      mainContent.classList.remove("blur");
      document.body.style.overflow = "auto";
      overlay.remove();
    } finally {
      hideLoader();
    }
  };
  buttonDelete.addEventListener("click", handleClickDelete);
  buttonCancel.addEventListener("click", handleClickCancel);
  overlay.addEventListener("click", handleClickCancel);
}
export function controlMediaFiles(container: any) {
  const medias = container.querySelectorAll(`.content-media`);
  const placeMedia = container.querySelector(`.container-image-photos`);
  if (medias.length === 1) {
    medias.forEach((media: any, index: number) => {
      placeMedia.style.display = "block";
    });
  }
  if (medias.length === 2) {
    medias.forEach((media: any, index: number) => {
      media.style.maxWidth = "50%";
    });
  } else if (medias.length > 2) {
    medias.forEach((media: any, index: number) => {
      if (index === 0) {
        media.style.maxWidth = "50%";
      }
      if (index === 1) {
        media.style.maxWidth = "50%";
        media.style.height = "50%";
        const div = renderTo(
          renderNextArrow(String(medias.length - 2)),
          "next-media-button",
        );
        const icon = div.querySelector(`.next-arrow-media`);
        setStatic(icon, iconArrowNextMediaFiles);
        media.appendChild(div);
        return;
      } else if (index > 1) {
        media.style.display = "none";
      }
    });
  }
}
/**
 * Кастомизирует каждый пост, который к нему пришел
 * @param container Контейнер ( популярных | недавних постов )
 * @param post Пост
 */
async function customizePost(container: any, post: any) {
  controlMediaFiles(container);

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

  const iconLike: any = container.querySelector(`.likes`);
  const iconComment: any = container.querySelector(`.comments`);

  setStatic(iconLike, urlIconLike);

  setStatic(iconComment, urlIconComment);

  setComments(container, post);

  setLike(container, post);

  setCapture(container);

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

  pageContainer.addEventListener("click", (event: any) => {
    if (event.target !== menu) {
      alldropdownMenu.forEach((dropdown: any, dropdownIndex: number) => {
        dropdown.classList.remove(ELEMENTS_CLASS.ACTIVE);
      });
    }
  });
  menu.addEventListener("click", handleClickMenu);
}
export function setCapture(container: any) {
  const videos: any = container.querySelectorAll(`.video-container`);
  videos.forEach((video: any) => {
    const vi: any = video.querySelector(`.video-player`);
    captureFrame(vi);
    vi.addEventListener("loadeddata", () => {
      captureFrame(vi);
    });
  });
}
export async function modifireComments(
  containerComments: any,
  comments: any,
  postID: string,
) {
  try {
    if (comments.length > 0) {
      const containersComments =
        containerComments.querySelectorAll(`.comment-item`);
      // if (comments.length == 1) {
      //   return customizeComment(containersComments[0], comments[0], postID);
      // }
      await Promise.all(
        Array.from(containersComments)
          .slice(-comments.length)
          .map((container: any, index: any) => {
            return customizeComment(
              container,
              comments[comments.length - 1 - index],
              postID,
            );
          }),
      );
    }
  } catch (error) {
    console.log("ERROR in modifireComments in feed");
    throw error;
  }
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
    console.log("ERROR in modifirePosts in feed");
    throw error;
  }
}
function isVideoElement(video: any) {
  return (
    video instanceof HTMLVideoElement &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}
// Функция для извлечения кадра
function captureFrame(video: any) {
  const src = video.src;
  if (!src) {
    console.error("Video source (src) is not set.");
    return false;
  }

  // Установите текущее время видео на 1 секунду
  video.currentTime = 1;

  // Добавьте обработчик события, который сработает, когда видео переместится на 1 секунду
  video.addEventListener("seeked", function onSeeked() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context: any = canvas.getContext("2d");

    // Проверка размеров видео
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      // Извлечение кадра из видео
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Преобразование canvas в изображение и установка его в качестве постера
      video.poster = canvas.toDataURL("image/*");
    } else {
      console.error("Video dimensions are not valid");
    }

    // Удаляем обработчик, чтобы он не срабатывал снова
    video.removeEventListener("seeked", onSeeked);
  });
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
export async function paginateComments(
  activeRequests: any,
  allComments: any,
  containerComments: any,
  postID: string,
  flag: any,
) {
  const allItems = containerComments.querySelectorAll(`.container-comment`);
  let stopLoadComments: boolean = false;
  let offset = 0;
  let isLoading = false;
  offset = flag;
  async function loadComments() {
    if (isLoading) return;
    isLoading = true;

    try {
      if (!stopLoadComments) {
        const requestId = `comments-${offset}`;
        if (activeRequests.has(requestId)) return;
        activeRequests.add(requestId);

        const comments: any = await getComments(postID, offset);

        const nextComments = comments.slice(0, QUERY.LIMIT);
        if (nextComments.length > 0) {
          allComments.push(...nextComments);
          offset += QUERY.LIMIT;
          containerComments.append(...(await renderComments(nextComments)));
          modifireComments(containerComments, nextComments.reverse(), postID);
        } else {
          stopLoadComments = true;
        }
      }
    } finally {
      isLoading = false;
    }
  }

  await loadComments();

  // Обработчик события прокрутки
  let isLoadingTop = false;

  const comments: any = await getComments(postID, offset);
  if (comments.length === 0) return;
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollWidth } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= 1000 && !isLoadingTop) {
      isLoadingTop = true;
      await loadComments();
      isLoadingTop = false;
    }
  });
}
export async function renderComments(comments: any) {
  const commentsPromises = comments.map(async (comment: any) => {
    const container = await containerComment(comment);

    const div = renderTo(container, "container-comment");
    const avatarImage: any = div.querySelector(`.author-comment-avatar`);
    const avatarLoad: any = await getAvatar(
      window.location.pathname,
      comment.userID,
    );
    avatarImage.src = avatarLoad;
    avatarImage.height = 50;
    avatarImage.width = 50;
    return div;
  });
  const commentsRes = await Promise.all(commentsPromises);
  return commentsRes;
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

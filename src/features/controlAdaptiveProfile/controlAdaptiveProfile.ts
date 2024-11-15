import { ELEMENTS_CLASS } from "../../shared/consts/consts";
import { getPageAuthor } from "../getpageauthor/getpageauthor";

/**
 * Управления адаптивностью профиля
 * @param container Контейнер профиля
 */
async function controlAdaptiveProfile(container: any) {
    const buttonMobileAbout: any = document.querySelector(
      ".about-mobile__button",
    );
    const buttonMobilePosts = container.querySelector(".posts-mobile__button");
  
    const feedProfile: any = container.querySelector(".feed-profile");
    const aboutProfile: any = container.querySelector(".place-edit-info");
    const data: any = await getPageAuthor(window.location.pathname);
  
    /**
     * Функция показа ленты в профиле
     */
    function showFeedProfile() {
      buttonMobileAbout.classList.remove(ELEMENTS_CLASS.ACTIVE);
      buttonMobilePosts.classList.add(ELEMENTS_CLASS.ACTIVE);
      aboutProfile.classList.add("hidden");
      if (feedProfile) {
        feedProfile.classList.remove("hidden");
      }
    }
  
    /**
     * Функция показа контейнера "ПРОФИЛЬ"
     */
    function showAboutProfile() {
      aboutProfile.classList.remove("hidden");
      if (feedProfile) {
        feedProfile.classList.add("hidden");
      }
      buttonMobilePosts.classList.remove(ELEMENTS_CLASS.ACTIVE);
      buttonMobileAbout.classList.add(ELEMENTS_CLASS.ACTIVE);
    }
  
    if (window.innerWidth <= 1024) {
      showAboutProfile();
    } else {
      feedProfile.classList.remove("hidden");
      aboutProfile.classList.remove("hidden");
    }
    if (buttonMobileAbout && buttonMobilePosts) {
      buttonMobileAbout.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
          showAboutProfile();
        }
      });
  
      buttonMobilePosts.addEventListener("click", () => {
        if (window.innerWidth <= 1024) {
          showFeedProfile();
        }
      });
    }
  }

  export { controlAdaptiveProfile }
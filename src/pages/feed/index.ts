import { LINKS, state } from "../../shared/consts/consts";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import { renderTo, update } from "../../../lib/vdom/lib";
import {
  pageContainer,
  urlCloseModal,
  urlLeftArrowModal,
  urlRightArrowModal,
} from "../../app/index";
import { renderFeedForm } from "./ui/feed";
import { paginate } from "../../features/paginateFeed/paginateFeed";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { controlActiveLink } from "../../features/controlActiveLink/controlActiveLink";
import { renderRating } from "../../entities/rating";
import { addResult, getQuestion } from "../settings";
import { showSearch } from "../../entities/searchbar";
import { hasLogged } from "../../shared/utils/hasLogged";
import { setTitle } from "../../shared/settitle/setTitle";
import { setStatic } from "../../shared/getStatic/getStatic";

export async function controlEventIFrame(container: any = pageContainer) {
  const div: any = document.querySelector(`#rating-iframe`);

  if (div) return;
  if (window.location.pathname === "/feed") {
    const rating: any = renderRating();
    const divrating: any = renderTo(rating);
    container.append(divrating);
    controlIFRAME();
  }

  setInterval(
    async () => {
      const div: any = document.querySelector(`#rating-iframe`);

      if (div) return;

      if (window.location.pathname === "/feed") {
        const rating: any = renderRating();
        const divrating: any = renderTo(rating);
        container.append(divrating);
        controlIFRAME();
      }
    },
    1 * 10 * 1000,
  );
}
async function controlIFRAME() {
  const frame: any = document.querySelector(`.rating-widget`);
  if (!frame) return;
  const stars: any = frame.querySelectorAll(`i`);

  const button: any = frame.querySelector(`.button-sendgrade`);
  const textQuestion: any = frame.querySelector(`.question`);
  const close: any = frame.querySelector(`.close`);

  let grade = 0;
  stars.forEach((star: any, index: number) => {
    star.addEventListener("click", () => {
      grade = index + 1;
      stars.forEach((s: any, i: number) => {
        s.classList.toggle("inactive", i >= grade);
      });
    });
  });
  close.addEventListener("click", () => {
    frame.style.display = "none";
  });
  const question: any = await getQuestion();
  if (!question) {
    return;
  }
  textQuestion.textContent = question.question;

  button.addEventListener("click", async (e: any) => {
    e.preventDefault();
    const ok: any = await addResult(question.questionID, grade);
    if (ok) {
      frame.style.display = "none";
    }
  });
}
/**
 * Функция рендера ленты
 * @returns
 */
export async function renderFeed() {
  try {
    setTitle(LINKS.FEED.TEXT);
    const allPopularPosts: any = []; // Массив для хранения всех загруженных популярных постов
    const allRecentlyPosts: any = []; // Массив для хранения всех загруженных недавних постов

    const user: any = state.currentUser;
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.role === "Reader"
      ? (state.currentUser.reader = user)
      : (state.currentUser.author = user);

    const doc = document.body;
    doc.style.height = "100%";

    const vdom = await renderFeedForm();

    const container = update(pageContainer, vdom);

    const closeModalView: any = container.querySelector(`.close-modal-view`);
    setStatic(closeModalView, urlCloseModal);
    const leftArrowModalView: any = container.querySelector(
      `.leftarrow-modal-view`,
    );
    setStatic(leftArrowModalView, urlLeftArrowModal);
    const rightArrowModalView: any = container.querySelector(
      `.rightarrow-modal-view `,
    );
    setStatic(rightArrowModalView, urlRightArrowModal);

    state.currentUser = user;

    showSearch(container);

    const tabs = container.querySelector(".tabs");

    const rightContent = container.querySelector(`.right-content`);

    controlActiveLink(tabs, rightContent);

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );
    const mainContent = container.querySelector(`.main-content`);
    if (mainContent) {
      modifierSidebar(mainContent);
    }
    if (hasLogged()) {
      controlLogout(container, user);
    }

    await paginate(
      allPopularPosts,
      allRecentlyPosts,
      containerPopularPosts,
      containerRecentlyPosts,
    );
    return container;
  } catch (error) {
    console.log("ERROR in feed");
    throw error;
  }
}

import { LINKS, state } from "../../shared/consts/consts";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import { renderTo, update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app/index";
import { renderModerationForm } from "./ui/moderation";
import { paginate } from "../../features/paginateFeed/paginateFeed";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import {
  controlActiveLink,
  controlModeration,
} from "../../features/controlActiveLink/controlActiveLink";
import { renderRating } from "../../entities/rating";
import { addResult, getQuestion } from "../settings";
import { showSearch } from "../../entities/searchbar";
import { hasLogged } from "../../shared/utils/hasLogged";
import { setTitle } from "../../shared/settitle/setTitle";
import { paginateModeration } from "../../features/paginateModeration/paginateModeration";
import { hideLoader, showLoader } from "../feed";
import { route } from "../../shared/routing/routing";

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
export async function renderModeration() {
  try {
    if (sessionStorage.getItem("role") !== "Moderator" || !hasLogged()) {
      route(LINKS.FEED.HREF);
      return;
    }

    showLoader();
    setTitle(LINKS.MODERATION.TEXT);
    const allApprovePosts: any = []; // Массив для хранения всех загруженных популярных постов
    const allReportedPosts: any = []; // Массив для хранения всех загруженных недавних постов

    const user: any = state.currentUser;
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    user.role === "Reader"
      ? (state.currentUser.reader = user)
      : (state.currentUser.author = user);

    const doc = document.body;
    doc.style.height = "100%";

    const vdom = await renderModerationForm();

    const container = update(pageContainer, vdom);

    state.currentUser = user;

    showSearch(container);

    const tabs = container.querySelector(".tabs");

    controlActiveLink(tabs, controlModeration);

    const containerPublishPosts = container.querySelector(
      ".main-container-publish",
    );
    const containerReportedPosts = container.querySelector(
      ".main-container-reported",
    );
    const mainContent = container.querySelector(`.main-content`);
    if (mainContent) {
      modifierSidebar(mainContent);
    }
    if (hasLogged()) {
      controlLogout(container, user);
    }
    await paginateModeration(
      allApprovePosts,
      allReportedPosts,
      containerPublishPosts,
      containerReportedPosts,
    );

    return container;
  } catch (error) {
    console.log("ERROR in feed");
    throw error;
  } finally {
    hideLoader();
  }
}

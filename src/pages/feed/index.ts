import { state } from "../../shared/consts/consts";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import { renderTo, update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app/index";
import { renderFeedForm } from "./ui/feed";
import { paginate } from "../../features/paginateFeed/paginateFeed";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { controlActiveLink } from "../../features/controlActiveLink/controlActiveLink";
import { renderRating } from "../../entities/rating";
import { addResult, checkShowIFrame, getQuestion } from "../settings";
import { showSearch } from "../../entities/searchbar";

async function controlEventIFrame(container: any = pageContainer) {
  const flag: any = await checkShowIFrame();
  const div: any = document.querySelector(`#rating-iframe`);
  if (div) return;
  if (flag.iCanShow) {
    const rating: any = renderRating();
    const divrating: any = renderTo(rating);
    container.append(divrating);
    controlIFRAME();
  }
}
async function controlIFRAME() {
  // const flag: any = await checkShowIFrame();
  // if (!flag) return;

  const frame: any = document.querySelector(`.rating-widget`);
  const stars: any = frame.querySelectorAll(`i`);

  const button: any = frame.querySelector(`.button-sendgrade`);
  const textQuestion: any = frame.querySelector(`.question`);
  let grade = 0;
  stars.forEach((star: any, index: number) => {
    star.addEventListener("click", () => {
      grade = index + 1;
      stars.forEach((s: any, i: number) => {
        s.classList.toggle("inactive", i >= grade);
      });
    });
  });
  const question: any = await getQuestion();

  textQuestion.textContent = question.question;

  button.addEventListener("click", async (e: any) => {
    e.preventDefault();
    console.log(grade);
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

    controlLogout(container, user);

    await paginate(
      allPopularPosts,
      allRecentlyPosts,
      containerPopularPosts,
      containerRecentlyPosts,
    );
    controlEventIFrame();

    return container;
  } catch (error) {
    console.log("ERROR in feed");
    throw error;
  }
}

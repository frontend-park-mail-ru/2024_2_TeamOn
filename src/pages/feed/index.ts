import { state } from "../../shared/consts/consts";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import { update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app/index";
import { renderFeedForm } from "./ui/feed";
import { paginate } from "../../features/paginateFeed/paginateFeed";
import { modifierSidebar } from "../../shared/sidebar/modifire";

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

    const containerPopularPosts = container.querySelector(
      ".main-container-popular",
    );
    const containerRecentlyPosts = container.querySelector(
      ".main-container-recently",
    );

    const mainContent = container.querySelector(`.main-content`);

    modifierSidebar(mainContent);

    controlLogout(container, user);
    
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

import { state } from "../../shared/consts/consts";
import { getAccount } from "../../features/getAccount/getAccount";
import { renderAbout } from "../../entities/profileabout/index";
import { update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app/index";
import { mobilepr, profileContent } from "./ui/profile";
import { getBackgroundAuthor } from "../../entities/profileDesktopHeader";
import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";
import { getPayments } from "../../features/getpayments/getpayments";
import { getAvatar } from "../../features/getavatar/getavatar";
import { controlAdaptivePageAuthors } from "../../features/controlAdaptivePageAuthor/controlAdaptivePageAuthor";
import { controlAdaptiveProfile } from "../../features/controlAdaptiveProfile/controlAdaptiveProfile";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import { controlInfo } from "../../features/controlInfo/controlInfo";
import { controlMediaProfile } from "../../features/controlMediaProfile/controlMediaProfile";
import { paginateProfile } from "../../features/paginateprofile/paginateprofile";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { setAuthor } from "../settings";

export async function controlBecomeCreator(div: any) {
  const userdata: any = await getAccount();
  const role = userdata.role;
  const button: any = div.querySelector(`.join-button`);

  if (role === "Reader") {
    div.classList.add("fade"); // Добавляем класс для анимации
    div.style.display = "flex";
  } else {
    div.style.display = "none";
  }

  const handleClick = async () => {
    const setrole = await setAuthor();

    // Запускаем анимацию
    div.classList.add("fade-out");

    // Ждем окончания анимации перед изменением display
    setTimeout(() => {
      div.style.display = "none";
      const profile: any = document.querySelector(`.profile`);
      profile.style.display = "flex";
    }, 500); // Должно совпадать с длительностью анимации в CSS

    button.removeEventListener("click", handleClick);
  };

  button.addEventListener("click", handleClick);
  return;
}
/**
 * Асинхронная функция рендеринга профиля пользователя.
 * @returns созданный элемент профиля пользователя или 0,
 * если пользователь не найден
 */
export async function renderProfile() {
  try {
    const posts: any = [];
    const authorData: any = await getPageAuthor(window.location.pathname);

    const avatar: any = await getAvatar(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    const background: any = await getBackgroundAuthor(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    const userdata: any = await getAccount();
    const payments: any = await getPayments(window.location.pathname);

    document.body.style.height = "100%";
    state.currentUser = authorData;

    if (!authorData) {
      throw new Error("Пользователь не найден");
    }

    const vdom: any = await profileContent(
      userdata,
      authorData,
      avatar,
      background,
      payments,
    );
    const container = update(pageContainer, vdom);
    if (!vdom) {
      throw new Error("VirtualDOM не построился");
    }

    // const container = update(pageContainer, vdom);
    if (window.innerWidth <= 1024) {
      const mobileContaine2: any = await mobilepr(
        authorData,
        avatar,
        background,
        payments,
      );
      const mobile: any = document.querySelector(`.div-mobile`);
      update(mobile, await mobileContaine2);
      controlAdaptiveProfile(container);
    }

    // Отрисовка информации о пользователе
    const content = renderAbout(authorData);
    const place: any = document.querySelector(`.place-edit-info`);
    update(place, content);

    const mainContent = container.querySelector(".main-content");
    const profileForm = container.querySelector(`.profile-form`);
    const placeEditInfo = container.querySelector(`.place-edit-info`);

    modifierSidebar(mainContent);
    await controlAdaptivePageAuthors(authorData, container, profileForm);

    controlLogout(container, authorData);
    controlMediaProfile(container);

    controlInfo(authorData, placeEditInfo);

    const placeposts: any = container.querySelector(`.place-posts`);

    await paginateProfile(posts, placeposts);

    return container;
  } catch (error) {
    console.log("ERROR in profile");
    throw error;
  }
}

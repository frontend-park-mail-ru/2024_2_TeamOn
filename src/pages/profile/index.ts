import { state } from "../../shared/consts/consts";
import { getAccount } from "../../features/getAccount/getAccount";
import { renderAbout } from "../../entities/profileabout/index";
import { renderTo, update } from "../../../lib/vdom/lib";
import { pageContainer } from "../../app/index";
import {
  mobilepr,
  profileContent,
  renderContainerAddCustomSubs,
} from "./ui/profile";
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
import { getCustomSubscription } from "../../features/getCustomSubs/getCustomSubs";
import { containerCustomSubscribe } from "../../widgest/profile/ui/profileform/profileform";
import { addCustomSubs, renderAddCustomSubs } from "../../entities/customsubs";
import DOMPurify from "dompurify";
import { getSubsLayer } from "../../features/getSubsLayer/getSubsLayer";
async function controlCustomSubscriptions(container: any) {
  if (window.location.pathname !== "/profile") return;

  // const authorId = sessionStorage.getItem("authorid") || "me";
  const containersCustomSubs: any =
    container.querySelectorAll(`.subscription-level`);
  const containersCustomSubsHeader: any =
    container.querySelector(`.subscription-levels`);
  const profileForm: any = container.querySelector(`.profile-form`);
  const div: any = container.querySelector(`.add-customsubs`);
  if (!div) return;
  if (containersCustomSubs.length <= 3 && containersCustomSubs.length > 0) {
    // const containerAddCustomSubs: any = renderContainerAddCustomSubs();
    // const div: any = renderTo(containerAddCustomSubs);
    // containersCustomSubsHeader.prepend(div);
    div.addEventListener("click", async () => {
      const modalAddCustomSubscription: any =
        container.querySelector(`.div-edit-posts`);
      update(modalAddCustomSubscription, renderAddCustomSubs());
      const modalAddSubs: any = document.querySelector(`.modal__addsubs`);
      const buttonCancel: any = modalAddSubs.querySelector(`.cancel`);
      const buttonConfirm: any = modalAddSubs.querySelector(`.save`);
      const inputs: any = modalAddSubs.querySelectorAll(".input-group");
      const title = inputs[0];
      const cost = inputs[1];
      const description: any = modalAddSubs.querySelector(".textarea-group");
      const layers: any = await getSubsLayer();

      modalAddSubs.style.display = "block";
      profileForm.classList.add("blur");

      buttonCancel.addEventListener("click", () => {
        modalAddSubs.style.display = "none";
        profileForm.classList.remove("blur");

        return;
      });

      buttonConfirm.addEventListener("click", async () => {
        modalAddSubs.style.display = "none";
        profileForm.classList.remove("blur");

        if (
          !DOMPurify.sanitize(title.value) ||
          !DOMPurify.sanitize(cost.value) ||
          !DOMPurify.sanitize(description.value)
        ) {
          const input = modalAddSubs.querySelector(`.form-group`);
          const error = input.querySelector("p");
          if (!error) {
            const error = document.createElement("p");
            error.style.color = "red";
            error.textContent = "Ошибка";
            input.appendChild(error);
          }
          return;
        }
        await addCustomSubs(
          title.value,
          description.value,
          cost.value,
          layers ? layers : 1,
        );
        controlCustomSubscriptions(container);
      });
    });
  }
}

async function renderContainerSubs() {
  try {
    const containers: any = [];
    const authorId = sessionStorage.getItem("authorid") || "me";
    const subscriptions: any = await getCustomSubscription(authorId);
    console.log(subscriptions);
    if (!subscriptions) return;

    const containerAddCustomSubs: any = renderContainerAddCustomSubs();

    if (
      subscriptions.length < 3 &&
      subscriptions.length >= 0 &&
      window.location.pathname === "/profile"
    ) {
      const div: any = renderTo(containerAddCustomSubs);
      containers.push(div);
    }

    subscriptions.forEach((subscription: any) => {
      const container: any = containerCustomSubscribe(subscription);
      const div = renderTo(container);
      containers.push(div);
    });
    return containers;
  } catch (error) {
    console.error("Error renderContainerSubs");
  }
}
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

    const containerSubs: any = container.querySelector(`.subscription-levels`);
    containerSubs.append(...(await renderContainerSubs()));

    controlCustomSubscriptions(container);

    return container;
  } catch (error) {
    console.log("ERROR in profile");
    throw error;
  }
}

import { LINKS, state } from "../../shared/consts/consts";
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
import { getCustomSubscription } from "../../features/getCustomSubs/getCustomSubs";
import {
  addCustomSubs,
  renderModalAddCustomSubs,
} from "../../entities/customsubs";
import DOMPurify from "dompurify";
import { getSubsLayer } from "../../features/getSubsLayer/getSubsLayer";
import {
  modifireSubscriptions,
  paginateSubscription,
  renderContainerSubs,
} from "../../features/subscriptionsList/subcriptionsList";
import { renderContainersLayer } from "../../entities/customsubs/ui/ui";
import { hasLogged } from "../../shared/utils/hasLogged";
import { route } from "../../shared/routing/routing";
import { setTitle } from "../../shared/settitle/setTitle";
import { showOverlay } from "../../shared/overlay/overlay";

async function controlCustomSubscriptions(container: any) {
  if (window.location.pathname !== "/profile") return;
  const containersCustomSubs: any =
    container.querySelectorAll(`.subscription-level`);
  const profileForm: any = container.querySelector(`.profile-form`);
  const div: any = container.querySelector(`.add-customsubs`);
  const rightColumn: any = container.querySelector(`.right-column`);

  if (!div) return;

  const currentSubs: any = await getCustomSubscription(
    window.location.pathname,
  );
  if (currentSubs.length === 3) {
    rightColumn.style.height = "600px";
    div.style.display = "none";
    return;
  }
  const handleClickAddSubs = async () => {
    const modalAddCustomSubscription: any =
      container.querySelector(`.div-add-custom-subs`);
    update(modalAddCustomSubscription, renderModalAddCustomSubs());
    const layerList: any =
      modalAddCustomSubscription.querySelector(`.layer-list`);

    const modalAddSubs: any = document.querySelector(`.modal__addsubs`);

    const overlay: any = showOverlay(modalAddSubs, profileForm);

    const buttonCancel: any = modalAddSubs.querySelector(`.cancel`);
    const buttonConfirm: any = modalAddSubs.querySelector(`.save`);
    const inputs: any = modalAddSubs.querySelectorAll(".input-group");
    const title = inputs[0];
    const cost = inputs[1];
    const description: any = modalAddSubs.querySelector(".textarea-group");
    const layers: any = await getSubsLayer();
    modalAddSubs.style.display = "block";

    layerList.append(...(await renderContainersLayer(layers)));
    const radioButtons: any = modalAddSubs.querySelectorAll(`.modal-layers`);
    let selectedLayer: any = 1;
    radioButtons.forEach((button: any) => {
      button.addEventListener("change", () => {
        if (button.checked) {
          selectedLayer = button.id;
        }
      });
      if (button.checked) {
        selectedLayer = button.id;
      }
    });
    const handleClickCancel = (e: any) => {
      modalAddSubs.style.display = "none";
      profileForm.classList.remove("blur");
      overlay.remove();
      document.body.style.overflow = "auto";
      return;
    };

    profileForm.classList.add("blur");

    buttonCancel.addEventListener("click", handleClickCancel);
    profileForm.addEventListener("click", handleClickCancel);
    overlay.addEventListener("click", handleClickCancel);

    buttonConfirm.addEventListener("click", async (e: any) => {
      e.preventDefault();
      const sanitizedTitle = DOMPurify.sanitize(title.value);
      const sanitizedDescription = DOMPurify.sanitize(description.value);
      const sanitizedCost = DOMPurify.sanitize(cost.value);

      if (!sanitizedTitle || !sanitizedDescription || !sanitizedCost) {
        const input = modalAddSubs.querySelectorAll(`.form-group`)[2];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = "Ошибка. Поля должны быть заполнены";
          input.appendChild(error);
        }
        return;
      }

      if (!Number.isInteger(Number(sanitizedCost))) {
        const input = modalAddSubs.querySelectorAll(`.form-group`)[2];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = "Ошибка. Введите целое число";
          input.appendChild(error);
        }
        return;
      }
      const response: any = await addCustomSubs(
        title.value,
        description.value,
        Number(cost.value),
        Number(selectedLayer),
      );
      if (response && response.message) {
        const input = modalAddSubs.querySelectorAll(`.form-group`)[2];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = response.message;
          input.appendChild(error);
        }
        return;
      }

      modalAddSubs.style.display = "none";
      profileForm.classList.remove("blur");
      overlay.remove();
      document.body.style.overflow = "auto";
      const newsubs: any = await getCustomSubscription(
        window.location.pathname,
      );

      if (newsubs.length == 0) return;
      const place: any = document.querySelector(".subscription-levels");
      place.append(...(await renderContainerSubs(newsubs.slice(-1))));
      modifireSubscriptions(place, newsubs.reverse());
      if (newsubs.length === 3) {
        div.style.display = "none";
        return;
      }
    });
  };

  if (
    (containersCustomSubs.length <= 3 && containersCustomSubs.length > 0) ||
    !document.querySelector(`.modal__addsubs`)
  ) {
    div.addEventListener("click", handleClickAddSubs);
  }
}

export async function controlBecomeCreator(div: any) {
  if (hasLogged()) {
    const userdata: any = await getAccount();
    const role = userdata.role;
    if (role === "Reader") {
      div.classList.add("fade"); // Добавляем класс для анимации
      div.style.display = "flex";
    } else {
      div.style.display = "none";
    }
  }
  const button: any = div.querySelector(`.join-button`);

  if (!hasLogged()) {
    div.style.display = "block";
  }
  const handleClick = async () => {
    if (!hasLogged()) {
      route(LINKS.LOGIN.HREF);
      return;
    }
    if (hasLogged()) {
      const setrole = await setAuthor();
    }

    // Запускаем анимацию
    div.classList.add("fade-out");

    // Ждем окончания анимации перед изменением display
    setTimeout(() => {
      div.style.display = "none";
      const profile: any = document.querySelector(`.profile`);

      // profile.classList.add("new");
      const span: any = pageContainer.querySelector(".new-badge");

      span.style.display = "block";
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
    setTitle(LINKS.PROFILE.TEXT);
    const posts: any = [];
    const subcriptions: any = [];
    const authorData: any = await getPageAuthor(window.location.pathname);

    const avatar: any = await getAvatar(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    const background: any = await getBackgroundAuthor(
      window.location.pathname,
      sessionStorage.getItem("authorid"),
    );
    let payments: any = 0;

    if (hasLogged()) {
      payments = await getPayments(window.location.pathname);
    }

    document.body.style.height = "100%";
    state.currentUser = authorData;

    if (!authorData) {
      throw new Error("Пользователь не найден");
    }

    const vdom: any = await profileContent(
      authorData,
      avatar,
      background,
      payments,
    );
    const container = update(pageContainer, vdom);
    if (!vdom) {
      throw new Error("VirtualDOM не построился");
    }

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
    const placeSubscriptions = container.querySelector(`.subscription-levels`);

    await paginateProfile(posts, placeposts);

    await paginateSubscription(subcriptions, placeSubscriptions);

    controlCustomSubscriptions(container);

    return container;
  } catch (error) {
    console.log("ERROR in profile");
    throw error;
  }
}

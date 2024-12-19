import {
  realizePay,
  renderModalRealizeCustomSubs,
  renderModalRequestCustomSubs,
  requestPay,
} from "../../entities/customsubs";
import { getCustomSubscription } from "../getCustomSubs/getCustomSubs";
import {
  containerCustomSubscribe,
  containerNoneCustomSubcsribe,
} from "../../widgest/profile/ui/profileform/profileform";
import { renderTo, update } from "../../../lib/vdom/lib";
import { route } from "../../shared/routing/routing";
import { hasLogged } from "../../shared/utils/hasLogged";
import { LINKS } from "../../shared/consts/consts";
import { paginateProfile } from "../paginateprofile/paginateprofile";
import { getPageAuthor } from "../getpageauthor/getpageauthor";
import { getPayments } from "../getpayments/getpayments";
import { renderUserStats } from "../../entities/profileInfo/ui/ui";
import { VNode } from "lib/vdom/src/source";
import { showOverlay } from "../../shared/overlay/overlay";
import { setStatic } from "../../shared/getStatic/getStatic";
import { iconClearSubs, iconPremiumSub, urlPushbackIcon } from "../../app";
import { controlPush } from "../../shared/push/push";

function foundCancel(div: any) {
  const buttonCancel: any = div.querySelector(`.cancel`);
  return buttonCancel;
}
function foundSave(div: any) {
  const buttonSave: any = div.querySelector(`.save`);
  return buttonSave;
}

function modifireModalConfirmSubscription(
  profileForm: any,
  container: any,
  subscription: any,
) {
  let subscriptionRequestID: any = 0;

  let pagenumber = true;
  const authorId: any = sessionStorage.getItem("authorid");
  const modal: any = renderModalRequestCustomSubs(subscription);
  const div: any = document.querySelector(`.div-confirmsubs`);
  update(div, modal);

  const buttonCancel: any = foundCancel(div);
  const buttonSave: any = foundSave(div);

  const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);
  const overlay: any = showOverlay(modalConfirm, profileForm);

  profileForm.classList.add("blur");
  modalConfirm.style.display = "block";

  const subscriptionSelect: HTMLSelectElement = modalConfirm.querySelector(
    `#subscription-duration`,
  );
  const handleClickPayment = async () => {
    window.location.href = subscriptionRequestID;
    return;
  };
  let selectedDuration: number = 1;
  const handleChange = (event: any) => {
    selectedDuration = Number(event.target.value);
  };

  const handleClickCancel = async (event: any) => {
    buttonCancel.removeEventListener("click", handleClickCancel);
    const div: any = document.querySelector(`.div-confirmsubs`);
    const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);
    overlay.remove();
    document.body.style.overflow = "auto";

    modalConfirm.style.display = "none";
    profileForm.classList.remove("blur");
    const newUrl = `/profile/${authorId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    return;
  };
  const handleClickSave = async (event: any) => {
    buttonSave.removeEventListener("click", handleClickSave);

    if (window.location.pathname === `/profile/${authorId}`) {
      subscriptionRequestID = await requestPay(
        authorId,
        selectedDuration,
        Number(subscription.layer),
      );
      if (!subscriptionRequestID || subscriptionRequestID.message) {
        const input = modalConfirm.querySelectorAll(`.form-group`)[1];
        const error = input.querySelector("p");
        if (!error) {
          const error = document.createElement("p");
          error.style.color = "red";
          error.textContent = "Ошибка. Поля не могут быть пустыми";
          input.appendChild(error);
        }
        return;
      }
      const newUrl = `/profile/${authorId}?act=payments`;
      window.history.pushState({ path: newUrl }, "", newUrl);

      const modal: any = renderModalRealizeCustomSubs(
        subscription,
        selectedDuration,
      );
      update(div, modal);
      const modalRealize: any = div.querySelector(`.modal__confirmsubs`);
      const pushback: any = modalRealize.querySelector(`.pushback`);
      const buttonCancel: any = foundCancel(modalRealize);
      const buttonSave: any = foundSave(modalRealize);
      buttonCancel.addEventListener("click", handleClickCancel);
      if (buttonSave.value == "Оплатить") {
        buttonSave.addEventListener("click", handleClickPayment);
      }
      buttonSave.addEventListener("click", handleClickPayment);

      profileForm.classList.add("blur");
      modalRealize.style.display = "block";

      pushback.style.display = "block";
      const pushbackIcon: any = pushback.querySelector(`.pushback-icon`);
      setStatic(pushbackIcon, urlPushbackIcon);

      pushback.addEventListener("click", handlePushBack);
    }
  };
  const handlePushBack = () => {
    const newUrl = `/profile/${authorId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    const modal: any = renderModalRequestCustomSubs(subscription);
    const div: any = document.querySelector(`.div-confirmsubs`);
    update(div, modal);
    const modalRealize: any = div.querySelector(`.modal__confirmsubs`);
    profileForm.classList.add("blur");
    modalRealize.style.display = "block";

    const buttonCancel: any = foundCancel(div);
    const buttonSave: any = foundSave(div);
    selectedDuration = 1;
    const subscriptionSelect: HTMLSelectElement = modalRealize.querySelector(
      `#subscription-duration`,
    );

    subscriptionSelect.addEventListener("change", handleChange);

    buttonCancel.addEventListener("click", handleClickCancel);
    buttonSave.addEventListener("click", handleClickSave);
    pagenumber = true;
  };

  subscriptionSelect.addEventListener("change", handleChange);
  buttonCancel.addEventListener("click", handleClickCancel);
  buttonSave.addEventListener("click", handleClickSave);
  overlay.addEventListener("click", handleClickCancel);
}

function customizeSubscription(container: any, subscription: any) {
  if (window.location.pathname === "/profile") {
    return;
  }
  const iconSub = container.querySelectorAll(`.icon-subs`);
  if (subscription.layer === "2") {
    setStatic(iconSub, iconPremiumSub);
  }
  const buttonSubscription: any = container.querySelector(`.button-buy-subs`);
  const profileForm: any = document.querySelector(`.profile-form`);

  buttonSubscription.addEventListener(`click`, async () => {
    if (!hasLogged()) {
      route(LINKS.LOGIN.HREF);
      return;
    }
    const userdata: any = await getPageAuthor(window.location.pathname);
    if (!userdata.isSubscribe) {
      modifireModalConfirmSubscription(profileForm, container, subscription);
    }
  });
}
export async function renderContainerSubs(
  allSubcriptions: any,
  userdata: any = null,
) {
  let subs: any = [];

  for (const subscription of allSubcriptions) {
    const container: any = containerCustomSubscribe(subscription, userdata);
    const div = renderTo(container);
    subs.push(div);
    if (userdata && userdata.isSubscribe) {
      const button: any = div.querySelector(`.button-buy-subs`);
      button.classList.add("issubs");
      const rightColumn: any = document.querySelector(`.right-column`);
      rightColumn.style.height = "250px";
      const customSibs = div.querySelector(".subscription-level");
      customSibs.classList.add("box");
      return subs;
    }
  }

  if (allSubcriptions.length === 0 && window.location.pathname !== "/profile") {
    const rightColumn: any = document.querySelector(`.right-column`);
    rightColumn.style.height = "250px";
    const container: any = containerNoneCustomSubcsribe();
    const div = renderTo(container);
    const icon = div.querySelector(`.icon-dontsubs`);
    const existCustomSibs = div.querySelector(".subscription-level");
    // existCustomSibs.classList.remove("box");
    subs.push(div);
  }

  return subs;
}
export async function modifireSubscriptions(
  placeSubscriptions: any,
  allSubcriptions: any,
) {
  try {
    if (allSubcriptions.length < 4 && allSubcriptions.length > 0) {
      const containersSubscriptions =
        placeSubscriptions.querySelectorAll(`.subscription-level`);

      await Promise.all(
        Array.from(containersSubscriptions).map(
          (container: any, index: any) => {
            return customizeSubscription(container, allSubcriptions[index]);
          },
        ),
      );
      return;
    }
  } catch (error) {
    console.error(error);
  }
}
async function paginateSubscription(
  allSubcriptions: any,
  placeSubscriptions: any,
) {
  async function loadSubcriptions() {
    try {
      const userdata: any = await getPageAuthor(window.location.pathname);
      const subs: any = await getCustomSubscription(window.location.pathname);
      const filteredSubs = subs.filter((sub: any) => sub.layer !== 0);
      allSubcriptions.push(...filteredSubs);
      placeSubscriptions.append(
        ...(await renderContainerSubs(allSubcriptions, userdata)),
      );
      modifireSubscriptions(placeSubscriptions, allSubcriptions);
    } catch (error) {
      console.error("Error in loadSubcriptions");
    }
  }

  await loadSubcriptions();
}

export { paginateSubscription };

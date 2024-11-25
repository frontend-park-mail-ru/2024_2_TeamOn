import {
  realizePay,
  renderModalRealizeCustomSubs,
  renderModalRequestCustomSubs,
  renderModalUnfollow,
  requestPay,
  unfollow,
} from "../../entities/customsubs";
import { getCustomSubscription } from "../getCustomSubs/getCustomSubs";
import {
  containerCustomSubscribe,
  containerNoneCustomSubcsribe,
} from "../../widgest/profile/ui/profileform/profileform";
import { renderTo, update } from "../../../lib/vdom/lib";
import { route } from "../../shared/routing/routing";
import { renderModalStatusUpload } from "../../shared/pushstatus/pushstatus";
import { hasLogged } from "../../shared/utils/hasLogged";
import { LINKS } from "../../shared/consts/consts";
import { paginateProfile } from "../paginateprofile/paginateprofile";
import { getPageAuthor } from "../getpageauthor/getpageauthor";

function foundCancel(div: any) {
  const buttonCancel: any = div.querySelector(`.cancel`);
  return buttonCancel;
}
function foundSave(div: any) {
  const buttonSave: any = div.querySelector(`.save`);
  return buttonSave;
}
function foundUnfollow(div: any) {
  const buttonSave: any = div.querySelector(`.delete`);
  return buttonSave;
}
async function modifireModalUnfollow(
  profileForm: any,
  container: any,
  subscription: any,
) {
  const authorId: any = sessionStorage.getItem("authorid");
  const userdata: any = await getPageAuthor(window.location.pathname);
  const modal: any = renderModalUnfollow(userdata);
  const div: any = document.querySelector(`.div-unfollow`);
  const placeSubscriptions = container.querySelector(`.subscription-levels`);

  update(div, modal);

  const buttonCancel: any = foundCancel(div);
  const buttonUnfollow: any = foundUnfollow(div);

  const modalConfirm: any = div.querySelector(`.modal__unfollow`);
  profileForm.classList.add("blur");
  modalConfirm.style.display = "block";

  const handleClickCancel = () => {
    buttonCancel.removeEventListener("click", handleClickCancel);
    const div: any = document.querySelector(`.div-unfollow`);
    const modalConfirm: any = div.querySelector(`.modal__unfollow`);

    modalConfirm.style.display = "none";
    profileForm.classList.remove("blur");
  };
  buttonCancel.addEventListener("click", handleClickCancel);

  const handleClickUnfollow = async () => {
    const response: any = await unfollow(authorId);
    if (!response || response.message) {
      const input = modalConfirm.querySelector(`.form-group`);
      const error = modalConfirm.querySelector(".error-msg");
      if (!error) {
        const error = document.createElement("p");
        error.style.color = "red";
        error.textContent = "Ошибка";
        error.className = "error-msg";
        input.appendChild(error);
      }
      return;
    }
    const media = `Успешно отписались от ${userdata.authorUsername}`;
    renderModalStatusUpload(true, media);
    modalConfirm.style.display = "none";
    profileForm.classList.remove("blur");
    const placeposts: any = container.querySelector(`.place-posts`);
    await paginateProfile([], placeposts);
    await paginateSubscription([], placeSubscriptions);
  };

  buttonUnfollow.addEventListener("click", handleClickUnfollow);
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
  profileForm.classList.add("blur");
  modalConfirm.style.display = "block";

  let selectedDuration: number = 1;
  const subscriptionSelect: HTMLSelectElement = modalConfirm.querySelector(
    `#subscription-duration`,
  );
  const handleClickPayment = async () => {
    const response: any = await realizePay(subscriptionRequestID);
    const modalConfirmNew: any = document.querySelector(`.modal__confirmsubs`);
    if (!response || response.message) {
      const input = modalConfirmNew.querySelectorAll(`.form-group`);
      const error = input[input.length - 1].querySelector("p");
      if (!error) {
        const error = document.createElement("p");
        error.style.color = "red";
        error.textContent = "Ошибка оплаты";
        input[input.length - 1].appendChild(error);
      }
      return;
    }
    const media = "Оплата успешно проведена";
    renderModalStatusUpload(true, media);
    modalConfirmNew.style.display = "none";
    profileForm.classList.remove("blur");
    const newUrl = `/profile/${authorId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    const placeposts: any = document.querySelector(`.place-posts`);
    const placeSubscriptions: any =
      document.querySelector(`.subscription-levels`);
    placeSubscriptions.innerHTML = "";
    placeposts.style.display = "block";
    await paginateProfile([], placeposts);
    await paginateSubscription([], placeSubscriptions);
  };

  const handleChange = (event: any) => {
    selectedDuration = Number(event.target.value);
  };
  const handleClickProfileForm = (event: any) => {
    if (event.target.classList.contains("button-buy-subs")) return;
    profileForm.removeEventListener("click", handleClickProfileForm);
    const div: any = document.querySelector(`.div-confirmsubs`);
    const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);

    modalConfirm.style.display = "none";
    profileForm.classList.remove("blur");
    const newUrl = `/profile/${authorId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    return;
  };
  const handleClickCancel = async (event: any) => {
    buttonCancel.removeEventListener("click", handleClickCancel);
    const div: any = document.querySelector(`.div-confirmsubs`);
    const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);

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
  profileForm.addEventListener("click", handleClickProfileForm);
}

function customizeSubscription(container: any, subscription: any) {
  if (window.location.pathname === "/profile") {
    return;
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
      rightColumn.style.height = "200px";
      return subs;
    }
  }

  if (allSubcriptions.length === 0 && window.location.pathname !== "/profile") {
    const rightColumn: any = document.querySelector(`.right-column`);
    rightColumn.style.height = "200px";
    const container: any = containerNoneCustomSubcsribe();
    const div = renderTo(container);
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
      modifireSubscriptions(placeSubscriptions, allSubcriptions.reverse());
    } catch (error) {
      console.error("Error in loadSubcriptions");
    }
  }

  await loadSubcriptions();
}

export { paginateSubscription };

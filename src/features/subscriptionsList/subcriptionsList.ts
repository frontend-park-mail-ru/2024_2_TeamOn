import {
  renderModalAddCustomSubs,
  renderModalRealizeCustomSubs,
  renderModalRequestCustomSubs,
  requestPay,
} from "../../entities/customsubs";
import { getCustomSubscription } from "../getCustomSubs/getCustomSubs";
import { getSubsLayer } from "../getSubsLayer/getSubsLayer";
import { containerCustomSubscribe } from "../../widgest/profile/ui/profileform/profileform";
import { renderTo, update } from "../../../lib/vdom/lib";
import { renderContainerAddCustomSubs } from "../../pages/profile/ui/profile";
import { route } from "../../shared/routing/routing";
import { renderModalStatusUpload } from "../../shared/pushstatus/pushstatus";

// function modifireModalConfirmSubscription(
//   profileForm: any,
//   container: any,
//   subscription: any,
// ) {
//   const modal: any = renderModalRequestCustomSubs(subscription);
//   const div: any = document.querySelector(`.div-confirmsubs`);
//   update(div, modal);
//   const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);
//   profileForm.classList.add("blur");
//   modalConfirm.style.display = "block";

//   let selectedDuration: number = 1;
//   const subscriptionSelect: HTMLSelectElement = modalConfirm.querySelector(
//     `#subscription-duration`,
//   );

//   subscriptionSelect.addEventListener("change", (event: any) => {
//     selectedDuration = Number(event.target.value);
//   });

//   const handleClick = async (event: any) => {
//     modalConfirm.removeEventListener("click", handleClick);
//     if (event.target.classList.contains("cancel")) {
//       modalConfirm.style.display = "none";
//       profileForm.classList.remove("blur");
//       return;
//     }

//     if (event.target.classList.contains("save")) {
//       const authorId: any = sessionStorage.getItem("authorid");
//       const valueRequest: any = await requestPay(
//         authorId,
//         selectedDuration,
//         subscription.layer,
//       );
//       const newUrl = `/profile/${authorId}?act=payments`;
//       window.history.pushState({ path: newUrl }, "", newUrl);
//       const authorPayRegex = /^\/profile\/[0-9a-zA-Z-]+$/;
//       const queryRegex = /^\?act=payments$/;

//       if (
//         authorPayRegex.test(window.location.pathname) &&
//         queryRegex.test(window.location.search)
//       ) {

//         const modal: any = renderModalRealizeCustomSubs(subscription);
//         update(div, modal);
//         const modalRealize: any = div.querySelector(`.modal__confirmsubs`);
//         const pushback: any = modalRealize.querySelector(`.pushback`);
//         pushback.style.display = "block";

//         // // Обработчик для кнопки pushback
//         pushback.addEventListener("click", () => {
//           const newUrl = `/profile/${authorId}`;
//           window.history.pushState({ path: newUrl }, "", newUrl);
//         });
//         const buttonCancel = modalRealize.querySelector(`.cancel`);
//         buttonCancel.addEventListener("click", ()=> {
//           modalRealize.style.display = "none";
//           profileForm.classList.remove("blur");
//           const newUrl = `/profile/${authorId}`;
//           window.history.pushState({ path: newUrl }, "", newUrl);
//           return;
//         })
//         profileForm.classList.add("blur");
//         modalRealize.style.display = "block";

//         modalConfirm.addEventListener("click", handleClick);
//       }
//     }
//   }
//   // Используем делегирование событий
//   modalConfirm.addEventListener("click", handleClick);

//   console.log(subscription);
// }
function foundCancel(div: any) {
  const buttonCancel: any = div.querySelector(`.cancel`);
  return buttonCancel;
}
function foundSave(div: any) {
  const buttonSave: any = div.querySelector(`.save`);
  return buttonSave;
}
function changeModal(profileForm: any, subscription: any) {
  const modal: any = renderModalRequestCustomSubs(subscription);
  const div: any = document.querySelector(`.div-confirmsubs`);
  update(div, modal);

  const buttonCancel: any = foundCancel(div);
  const buttonSave: any = foundSave(div);

  const modalConfirm: any = div.querySelector(`.modal__confirmsubs`);
  profileForm.classList.add("blur");
  modalConfirm.style.display = "block";
  return modalConfirm;
}
function modifireModalConfirmSubscription(
  profileForm: any,
  container: any,
  subscription: any,
) {
  console.log(subscription);
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
  const handleClickPayment = () => {
    alert("da");
    const media = "Оплата успешно проведена";
    renderModalStatusUpload(true, media);
    // modalConfirm.style.display = "none";
    // profileForm.classList.remove("blur");
    const newUrl = `/profile/${authorId}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  //   const handleClickPayment = () => {
  //     const successMessage: any = document.querySelector(`.push-modal`);
  //     // const successMessage: any = document.getElementById("successMessage");
  //     successMessage.style.display = "block";

  //     // Устанавливаем начальное сообщение
  //     let countdown = 5;
  //     successMessage.innerHTML = `Оплата успешно проведена, вернем вас на окно профиля через ${countdown}...`;

  //     // Запускаем анимацию
  //     successMessage.style.animation = "scroll-message 0.5s ease-in-out";

  //     // Устанавливаем интервал для обратного отсчета
  //     const interval = setInterval(() => {
  //         countdown--;
  //         if (countdown > 0) {
  //             successMessage.innerHTML = `Оплата успешно проведена, вернем вас на окно профиля через ${countdown}...`;
  //         } else {
  //             clearInterval(interval); // Останавливаем интервал
  //             // Скрываем сообщение через 1 секунду после завершения отсчета
  //             setTimeout(() => {
  //                 successMessage.style.display = "none";
  //             }, 1000);
  //         }
  //     }, 1000); // Интервал 1 секунда

  //     const newUrl = `/profile/${authorId}`;
  //     window.history.pushState({ path: newUrl }, "", newUrl);
  // };

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
    console.log(pagenumber);
    buttonSave.removeEventListener("click", handleClickSave);

    if (window.location.pathname === `/profile/${authorId}`) {
      const valueRequest: any = await requestPay(
        authorId,
        selectedDuration,
        Number(subscription.layer),
      );
      alert("handleClickSave");
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
    // } else {
    //   const modal: any = renderModalRequestCustomSubs(subscription);
    //   const div: any = document.querySelector(`.div-confirmsubs`);

    //   update(div, modal);
    //   const modalRealize: any = div.querySelector(`.modal__confirmsubs`);
    //   profileForm.classList.add("blur");
    //   modalRealize.style.display = "block";
    //   const buttonCancel: any = foundCancel(modalRealize);
    //   const buttonSave: any = foundSave(modalRealize);
    //   buttonCancel.addEventListener("click", handleClickCancel);
    //   alert("nu")
    //   buttonSave.addEventListener("click", handleClickPayment);
    // }
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

  buttonSubscription.addEventListener(`click`, () => {
    modifireModalConfirmSubscription(profileForm, container, subscription);
  });
}
export async function renderContainerSubs(allSubcriptions: any) {
  let subs: any = [];
  allSubcriptions.forEach(async (subscription: any) => {
    const container: any = containerCustomSubscribe(subscription);
    const div = renderTo(container);
    subs.push(div);
  });
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
      const subs: any = await getCustomSubscription(window.location.pathname);
      allSubcriptions.push(...subs);
      placeSubscriptions.append(
        ...(await renderContainerSubs(allSubcriptions)),
      );
      modifireSubscriptions(placeSubscriptions, allSubcriptions.reverse());
    } catch (error) {
      console.error("Error in loadSubcriptions");
    }
  }

  await loadSubcriptions();
}

export { paginateSubscription };

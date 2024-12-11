import {
  allowedExtensions,
  ELEMENTS_CLASS,
  LINKS,
  months,
  monthsSkl,
  state,
} from "../../shared/consts/consts";
import { pageContainer } from "../../app/index";
import { renderTo, update } from "../../../lib/vdom/lib";
import { VNode } from "../../../lib/vdom/src/source";
import { fetchAjax } from "../../shared/fetch/fetchAjax";
import { route } from "../../shared/routing/routing";
import { getAccount } from "../../features/getAccount/getAccount";
import { controlLogout } from "../../features/controlLogout/controlLogout";
import {
  validateSettingsPassword,
  validateMainInfo,
} from "../../shared/validateSettingsForm/validateSettingsForm";
import { renderStat, settingsContainer } from "./ui/settings";
import { getAvatar } from "../../features/getavatar/getavatar";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { renderStatics, renderTableTitle } from "../statistics/ui/ui";
import { hasLogged } from "../../shared/utils/hasLogged";
import { setTitle } from "../../shared/settitle/setTitle";
import { hideLoader } from "../feed";
import {
  customStatDay,
  customStatMonth,
  customStatYear,
  filterStat,
  filterStatDay,
} from "../../shared/utils/filterStat";
import { controlPush } from "../../shared/push/push";

function showLoadSet(container: any) {
  const load = container.querySelector(`.mask_settings`);
  if (!load) {
    const form = document.body.querySelector(`.content-container`);
    const newmask = document.createElement("div");
    newmask.classList.add("mask_settings");
    const newloader = document.createElement("div");
    newloader.classList.add("loader_settings");
    newmask.appendChild(newloader);
    form?.appendChild(newmask);
    newmask.style.display = "flex";
    newmask.style.opacity = "1";
  }
  if (load) {
    load.style.display = "flex";
    load.style.opacity = 1;
  }
}
function hideLoadSet(container: any) {
  const mask: any = container.querySelector(".mask_settings");
  if (mask) {
    mask.style.opacity = 0;
    setTimeout(() => {
      mask.style.display = "none";
    }, 600);
  }
}
/**
 * Рендер настроек
 * @returns
 */
export async function renderSettings() {
  try {
    hideLoader();
    setTitle(LINKS.SETTINGS.TEXT);

    const user = state.currentUser;
    const doc: any = document.body;
    doc.style.minHeight = "100%";
    const userdata: any = await getAccount();

    const vdom: VNode = await settingsContainer();

    const container = update(pageContainer, vdom);
    showLoadSet(container);
    const mainContent = container.querySelector(".main-content");

    const tabs = container.querySelector(`.tabs`);

    const contentContainer = container.querySelector(`.content-container`);

    modifierSidebar(mainContent);
    if (hasLogged()) {
      controlLogout(container, user);
    }

    setupTabs(tabs, contentContainer, userdata);
    const index: any = sessionStorage.getItem("settings");
    await updateContent(
      contentContainer,
      index == null ? 0 : Number(index),
      userdata,
    );

    const profilePicForm: any = document.querySelector(
      `.profile-pic-container`,
    );

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
  // } finally {
  //   hideLoadSet(document.body);
  // }
}
/**
 * Функция стать автором
 * @returns
 */
export async function setAuthor() {
  return new Promise((resolve, reject) => {
    fetchAjax("POST", "/api/accounts/account/update/role", null, (response) => {
      if (response.ok) {
        resolve(true);
      } else if (response.status === 404) {
        route(LINKS.ERROR.HREF);
      } else {
        reject(new Error("Внутреняя ошибка сервера"));
      }
    });
  });
}
/**
 * Функция сохранения настроек
 * @param username Имя
 * @param email Почта
 * @param password Пароль
 * @returns
 */
async function saveSettings(
  username: string,
  email: string,
  oldPassword: any,
  password: string,
) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/accounts/account/update",
      {
        username: username,
        email: email,
        oldPassword: oldPassword,
        password: password,
      },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          response.json().then((data: any) => {
            resolve(data);
          });
        } else {
          resolve(false);
        }
      },
    );
  });
}
/**
 * Функция сохранения аватара
 * @param avatar Аватар
 * @returns
 */
async function saveAvatar(avatar: FormData) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/accounts/account/update/avatar",
      avatar,
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          resolve(false);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Функция утановки навбара в виде таблицы
 * @param tabs Таблицы
 * @param contentContainer Контейнер основной
 * @param userdata Информация о пользователе
 */
function setupTabs(
  tabs: HTMLDivElement,
  contentContainer: HTMLDivElement,
  userdata: any,
) {
  const listPage =
    sessionStorage.getItem("role") === "Author"
      ? [
          "Основная информация",
          "Безопасность",
          "Статистика",
          "Оценки",
          /** , "Получение дохода"*/
        ]
      : ["Основная информация", "Безопасность", "Оценки"];

  listPage.forEach((tabName, index) => {
    const tabLink = document.createElement("a");
    tabLink.textContent = tabName;
    const initial: any =
      sessionStorage.getItem("settings") == null
        ? 0
        : sessionStorage.getItem("settings");
    tabLink.className = index.toString() === initial.toString() ? "active" : "";
    tabLink.classList.add("settings");
    // Обработчик события клика
    tabLink.addEventListener("click", (event) => {
      event.preventDefault();
      tabs
        .querySelectorAll("a")
        .forEach((link) => link.classList.remove("active"));
      tabLink.classList.add("active");
      if (tabName === "Оценки" && index === 2) {
        index = index + 1;
      }
      sessionStorage.setItem("settings", index.toString());
      updateContent(contentContainer, index, userdata);
    });
    tabs.appendChild(tabLink);
  });
}

let buttonPersonalize: any;
let buttonPassword: any;
/**
 * Обновление контейнера
 * @param contentContainer Основной контейнер
 * @param index Индекс в таблице
 * @param userdata Информация о пользователе
 * @returns
 */
async function updateContent(
  contentContainer: HTMLDivElement,
  index: number = 0,
  userdata: any,
) {
  contentContainer.innerHTML = "";
  try {
    showLoadSet(document.body);
    const profileForm = await createProfileForm(userdata);
    const securityForm = createSecurityForm();
    let stat: any = null;
    if (sessionStorage.getItem("role") === "Author") {
      stat = await createStat();
    }
    const fb = await createFeedback();
    hideLoadSet(document.body);

    contentContainer.appendChild(profileForm);
    contentContainer.appendChild(securityForm);
    if (stat) {
      contentContainer.appendChild(stat);
    }
    if (fb) {
      contentContainer.appendChild(fb);
    }
  } catch (error) {
    console.error(error);
  } finally {
    hideLoadSet(document.body);
  }
  // hideLoadSet(document.body);
  let containerPersonalize: any =
    contentContainer.querySelector(`.form-container`);
  let containerPassword: any = contentContainer.querySelector(
    `.form-container-security`,
  );
  let containerFeedback: any = contentContainer.querySelector(
    `.form-container-feedback`,
  );
  let containerStatistics: any =
    contentContainer.querySelector(`.form-container-stat`);

  switch (index) {
    case 0:
      setTimeout(() => {
        containerPersonalize.style.display = "block";
        containerPassword.style.display = "none";
      }, 600);
      break;
    case 1:
      setTimeout(() => {
        containerPersonalize.style.display = "none";
        containerPassword.style.display = "block";
      }, 600);
      break;
    case 2:
      setTimeout(() => {
        containerPersonalize.style.display = "none";
        if (containerStatistics) {
          containerStatistics.style.display = "block";
        }
      }, 600);
      break;
    case 3:
      setTimeout(() => {
        containerPersonalize.style.display = "none";
        if (containerFeedback) {
          containerFeedback.style.display = "block";
        }
      }, 600);
      break;
    default:
      return [buttonPersonalize, buttonPassword];
  }
}
/**
 * Функция создания формы профиля
 * @param userdata Информация о юзере
 * @returns
 */
async function createProfileForm(userdata: any): Promise<HTMLDivElement> {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Персонализируйте свою страницу";
  formContainer.appendChild(formTitle);

  const profilePicRow = createPhoto();
  formContainer.appendChild(await profilePicRow);

  const usernameRow = document.createElement("div");
  usernameRow.className = "form-row";
  const usernameLabel = createLabel("Имя пользователя", "username");
  const usernameInput = createInput("text", "username", userdata.username);
  const usernameError = createErrorMessage();
  usernameRow.append(usernameLabel, usernameInput);
  formContainer.append(usernameRow, usernameError);

  const emailRow = document.createElement("div");
  emailRow.className = "form-row";
  const emailLabel = createLabel("Электронная почта", "email");
  const emailInput = createInput("email", "email", userdata.email);
  const buttonSetAuthor = await createButtonSetAuthor();
  const emailError = createErrorMessage();
  emailRow.append(emailLabel, emailInput);

  const saveButton = document.createElement("button");
  saveButton.className = ELEMENTS_CLASS.SEND_TIP.COMBINE + " save-settings";
  saveButton.textContent = "Сохранить";

  formContainer.append(emailRow, emailError, buttonSetAuthor, saveButton);
  const username: any = usernameInput;
  const email: any = emailInput;
  saveButton.addEventListener("click", async (event: any) => {
    const { usernameError: usernameErrorMsg, emailError: emailErrorMsg } =
      validationMainInfoSave(usernameInput.value, emailInput.value);
    usernameError.textContent = usernameErrorMsg || "";
    emailError.textContent = emailErrorMsg || "";
    if (!usernameError.textContent && !emailError.textContent) {
      const ok: any = await saveSettings(username.value, email.value, "", "");
      ok.message
        ? (emailError.textContent = ok.message)
        : (emailError.textContent = "");
      // Проверяем, успешно ли сохранен аватар
      if (ok && !ok.message) {
        const user: any = await getAccount();
        if (!formContainer.querySelector(`.succcesful-title`)) {
          // Создаем элемент для сообщения об успешной загрузке
          const successMessage = document.createElement("div");
          successMessage.textContent = "Данные успешно сохранены";
          successMessage.style.color = "green";
          successMessage.style.marginTop = "10px";
          successMessage.style.fontWeight = "bold";
          successMessage.className = "succcesful-title";

          user.email
            ? (emailInput.value = user.email)
            : (emailInput.value = "");
          user.username
            ? (usernameInput.value = user.username)
            : (usernameInput.value = "");

          // Добавляем сообщение в профильный div
          formContainer.appendChild(successMessage);
          // Убираем сообщение через несколько секунд
          setTimeout(() => {
            successMessage.remove();
          }, 3000); // Удаляем сообщение через 3 секунды
        }
      } else {
        if (!formContainer.querySelector(`.reject-title`)) {
          const successMessage = document.createElement("div");
          successMessage.textContent = "Ошибка при сохранении данных";
          successMessage.style.color = "red";
          successMessage.style.marginTop = "10px";
          successMessage.className = "reject-title";

          // Добавляем сообщение в профильный div
          formContainer.appendChild(successMessage);

          // Убираем сообщение через несколько секунд
          setTimeout(() => {
            successMessage.remove();
          }, 3000); // Удаляем сообщение через 3 секунды
        }
      }
    }
  });

  formContainer.addEventListener("input", (event) => {
    if (event.target === usernameInput || event.target === emailInput) {
      const { usernameError: usernameErrorMsg, emailError: emailErrorMsg } =
        validationMainInfoSave(usernameInput.value, emailInput.value);
      usernameError.textContent = usernameErrorMsg || "";
      emailError.textContent = emailErrorMsg || "";
    }
  });

  // formContainer.append(profilePicRow);
  return formContainer;
}
/**
 * Валидация основной информации
 * @param username Имя
 * @param email Почта
 * @returns
 */
export function validationMainInfoSave(
  username: string,
  email: string,
): { usernameError: string; emailError: string } {
  const { usernameError, emailError } = validateMainInfo(username, email);
  return { usernameError, emailError };
}

function createSecurityForm(): HTMLDivElement {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container-security";

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Изменить пароль";
  formContainer.appendChild(formTitle);

  const newPasswordRow = document.createElement("div");
  newPasswordRow.className = "form-row";
  const passwordStrength = document.createElement("div");
  passwordStrength.className = "password-strength";
  const newPasswordLabel = createLabel(
    "Придумайте новый пароль",
    "new-password",
  );
  const newPasswordInput = createInput("password", "new-password");
  const newPasswordError = createErrorMessage();
  newPasswordRow.append(newPasswordLabel, newPasswordInput);
  formContainer.append(newPasswordRow, newPasswordError);

  const oldPasswordRow = document.createElement("div");
  oldPasswordRow.className = "form-row";
  const oldPasswordLabel = createLabel("Старый пароль", "old-password");

  const confirmPasswordRow = document.createElement("div");
  confirmPasswordRow.className = "form-row";
  const confirmPasswordLabel = createLabel(
    "Повторите пароль",
    "confirm-password",
  );
  const oldPasswordInput = createInput("password", "old-password");
  const oldPasswordError = createErrorMessage();

  const confirmPasswordInput = createInput("password", "confirm-password");
  const confirmPasswordError = createErrorMessageStrength();

  oldPasswordRow.append(oldPasswordLabel, oldPasswordInput);
  confirmPasswordRow.append(confirmPasswordLabel, confirmPasswordInput);
  formContainer.append(oldPasswordRow, oldPasswordError);
  formContainer.append(confirmPasswordRow, confirmPasswordError);

  const saveButton = document.createElement("button");
  saveButton.className = ELEMENTS_CLASS.SEND_TIP.COMBINE + " save-password";
  saveButton.textContent = "Сохранить";
  saveButton.id = "password-save";
  formContainer.addEventListener("input", (event) => {
    event.preventDefault();

    validationSecuritySave(
      newPasswordInput,
      confirmPasswordInput,
      newPasswordError,
      confirmPasswordError,
    );
    if (oldPasswordInput.value == "") {
      oldPasswordError.textContent = "";
    }
    if (confirmPasswordInput.value == "") {
      confirmPasswordError.textContent = "";
    }
  });

  formContainer.append(
    newPasswordRow,
    newPasswordError,
    confirmPasswordRow,
    confirmPasswordError,
    saveButton,
  );
  const password: any = newPasswordInput;
  saveButton.addEventListener("click", async () => {
    validationSecuritySave(
      newPasswordInput,
      confirmPasswordInput,
      newPasswordError,
      confirmPasswordError,
    );
    if (newPasswordError.textContent == "") {
      const ok: any = await saveSettings(
        "",
        "",
        oldPasswordInput.value,
        password.value,
      );
      // Проверяем, успешно ли сохранен аватар
      if (ok.message) {
        if (ok.message.includes("старый")) {
          oldPasswordError.textContent = ok.message;
        } else {
          newPasswordError.textContent = ok.message;
        }
      }
      // ok.message
      //   ? (newPasswordError.textContent = ok.message)
      //   : (newPasswordError.textContent = "");
      if (ok && !ok.message) {
        if (!formContainer.querySelector(`.succcesful-title`)) {
          // Создаем элемент для сообщения об успешной загрузке
          const successMessage = document.createElement("div");
          successMessage.textContent = "Данные успешно сохранены";
          newPasswordError.textContent = "";
          oldPasswordError.textContent = "";
          successMessage.style.color = "green";
          successMessage.style.marginTop = "10px";
          successMessage.style.fontWeight = "bold";
          successMessage.className = "succcesful-title";
          newPasswordInput.value = "";
          confirmPasswordInput.value = "";
          const strengthBar: any = document.querySelector(".password-strength");
          strengthBar.style.width = "0%";
          oldPasswordInput.value = "";
          // Добавляем сообщение в профильный div
          formContainer.appendChild(successMessage);
          // Убираем сообщение через несколько секунд
          setTimeout(() => {
            successMessage.remove();
          }, 3000); // Удаляем сообщение через 3 секунды
        }
      } else {
        if (!formContainer.querySelector(`.reject-title`)) {
          const successMessage = document.createElement("div");
          successMessage.textContent = "Ошибка при сохранении данных";
          successMessage.style.color = "red";
          successMessage.style.marginTop = "10px";
          successMessage.className = "reject-title";

          // Добавляем сообщение в профильный div
          formContainer.appendChild(successMessage);

          // Убираем сообщение через несколько секунд
          setTimeout(() => {
            successMessage.remove();
          }, 3000); // Удаляем сообщение через 3 секунды
        }
      }
    }
  });
  return formContainer;
}
/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getStatisticsForPost(time: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      "/api/pages/stat/posts" + `?time=${time}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          resolve(false);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

/**
 * Функция получения популярных постов
 * @param offsetPopular Оффсет для популярных постов
 * @returns
 */
async function getStatisticsForPayments(time: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "GET",
      "/api/pages/stat/payments" + `?time=${time}`,
      null,
      (response) => {
        if (response.ok) {
          response.json().then((data) => {
            resolve(data);
          });
        } else if (response.status === 400) {
          resolve(false);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}

async function createStat() {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container-stat";
  update(formContainer, await renderStat());
  if (sessionStorage.getItem("settings") !== "2") return formContainer;

  const postsYear: any = await getStatisticsForPost("year");
  let [valuesX, valuesY] = filterStat(postsYear, 1);
  postsYear.valueX = valuesX;
  postsYear.valueY = valuesY;

  customStatYear(postsYear);

  const paymentsYear: any = await getStatisticsForPayments("year");
  [valuesX, valuesY] = filterStat(paymentsYear, 1);
  paymentsYear.valueX = valuesX;
  paymentsYear.valueY = valuesY;
  customStatYear(paymentsYear);

  const postsMonth: any = await getStatisticsForPost("month");
  [valuesX, valuesY] = filterStat(postsMonth, 1);
  postsMonth.valueX = valuesX;
  postsMonth.valueY = valuesY;
  postsMonth.valueX = customStatMonth(postsMonth);

  const paymentsMonth: any = await getStatisticsForPayments("month");
  [valuesX, valuesY] = filterStat(paymentsMonth, 1);
  paymentsMonth.valueX = valuesX;
  paymentsMonth.valueY = valuesY;
  paymentsMonth.valueX = customStatMonth(paymentsMonth);

  const postsDay: any = await getStatisticsForPost("day");
  [valuesX, valuesY] = filterStat(postsDay, 1);
  postsDay.valueX = valuesX;
  postsDay.valueY = valuesY;
  postsDay.valueX = customStatDay(postsDay);
  console.log(postsDay, "5");

  const paymentsDay: any = await getStatisticsForPayments("day");
  [valuesX, valuesY] = filterStat(paymentsDay, 1);
  paymentsDay.valueX = valuesX;
  paymentsDay.valueY = valuesY;
  paymentsDay.valueX = customStatDay(paymentsDay);

  const totalPaymentsDay = paymentsDay.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );
  const totalPaymentsMonth = paymentsMonth.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );
  const totalPaymentsYear = paymentsYear.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );
  const totalPostsDay = postsDay.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );
  const totalPostsMonth = postsMonth.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );
  const totalPostsYear = postsYear.valueY.reduce(
    (accumulator: any, currentValue: number) => accumulator + currentValue,
    0,
  );

  const content: any = renderContainerGraphics(
    formContainer,
    postsYear,
    paymentsYear,
  );

  const buttonsPosts: any = formContainer.querySelector(
    ".period-buttons-posts",
  );
  const buttonsPayments: any = formContainer.querySelector(
    `.period-buttons-payments`,
  );

  const tablePosts: any = formContainer.querySelector(`.table-posts`);
  const tablePayments: any = formContainer.querySelector(`.table-payments`);

  let total = totalPaymentsYear;
  let response: any = [{ theme: "Общее количество выплат, ₽", rating: total }];
  customizeTable(tablePayments, response);

  total = totalPostsYear;
  response = [{ theme: "Общее количество постов, шт.", rating: total }];
  customizeTable(tablePosts, response);

  const buttonSetDayPosts: any = buttonsPosts.querySelector(`.btn-day`);
  const buttonSetMonthPosts: any = buttonsPosts.querySelector(`.btn-month`);
  const buttonSetYearPosts: any = buttonsPosts.querySelector(`.btn-year`);

  const buttonSetDayPayments: any = buttonsPayments.querySelector(`.btn-day`);
  const buttonSetMonthPayments: any =
    buttonsPayments.querySelector(`.btn-month`);
  const buttonSetYearPayments: any = buttonsPayments.querySelector(`.btn-year`);

  buttonSetDayPayments.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-payments`);
    const ctx = canv.getContext("2d");
    canv.innerHTML = "";
    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPayments(formContainer, paymentsDay, "");

    const total = totalPaymentsDay;
    const response: any = [
      { theme: "Общее количество выплат, ₽", rating: total },
    ];
    customizeTable(tablePayments, response);

    // customizeTable(tablePayments, response);
  });

  buttonSetDayPosts.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-posts`);
    const ctx = canv.getContext("2d");

    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPosts(formContainer, postsDay, "");

    const total = totalPostsDay;
    const response: any = [
      { theme: "Общее количество постов, шт.", rating: total },
    ];
    customizeTable(tablePosts, response);
  });
  buttonSetMonthPayments.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-payments`);
    const ctx = canv.getContext("2d");

    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPayments(formContainer, paymentsMonth, "");

    const total = totalPaymentsMonth;
    const response: any = [
      { theme: "Общее количество выплат, ₽", rating: total },
    ];
    customizeTable(tablePayments, response);
  });

  buttonSetMonthPosts.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-posts`);
    const ctx = canv.getContext("2d");

    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPosts(formContainer, postsMonth, "");

    const total = totalPostsMonth;
    const response: any = [
      { theme: "Общее количество постов, шт.", rating: total },
    ];
    customizeTable(tablePosts, response);
  });
  buttonSetYearPayments.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-payments`);
    const ctx = canv.getContext("2d");

    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPayments(formContainer, paymentsYear, "");

    const total = totalPaymentsYear;
    const response: any = [
      { theme: "Общее количество выплат, ₽", rating: total },
    ];
    customizeTable(tablePayments, response);
  });

  buttonSetYearPosts.addEventListener("click", () => {
    const canv: any = formContainer.querySelector(`.canv-posts`);
    const ctx = canv.getContext("2d");

    // Очистка канваса
    ctx.clearRect(0, 0, canv.width, canv.height);
    renderContainerGraphicPosts(formContainer, postsYear, "");

    const total = totalPostsYear;
    const response: any = [
      { theme: "Общее количество постов, шт.", rating: total },
    ];
    customizeTable(tablePosts, response);
  });

  return formContainer;
}
function adjustCanvasWidth(canvas: any, numberOfValues: number) {
  const baseWidth = 800; // Базовая ширина канваса
  const additionalWidthPerValue = 50; // Дополнительная ширина на каждое значение

  let newWidth = baseWidth + numberOfValues * additionalWidthPerValue;

  canvas.width = Math.min(newWidth);
}
function renderContainerGraphicPosts(
  formContainer: any,
  posts: any,
  labelX: string,
) {
  const canvas: any = formContainer.querySelector(".canv-posts");

  const dataPosts = posts.valueY;
  const labelsPosts = posts.valueX;
  console.log(labelsPosts);
  console.log(dataPosts);
  // adjustCanvasWidth(canvas, posts.valuesX.length);

  renderGraphics(
    canvas,
    dataPosts,
    labelsPosts,
    formContainer,
    "Количество постов, шт.",
    labelX,
  );
}
function renderContainerGraphicPayments(
  formContainer: any,
  payments: any,
  labelX: string,
) {
  const canvasPayments: any = formContainer.querySelector(".canv-payments");

  // Данные для графика
  const dataPayments = payments.valueY;

  const labelsPayments = payments.valueX;

  // adjustCanvasWidth(canvasPayments, payments.valuesX.length);

  renderGraphics(
    canvasPayments,
    dataPayments,
    labelsPayments,
    formContainer,
    "Количество выплат, ₽",
    labelX,
  );
}
function renderContainerGraphics(
  formContainer: any,
  posts: any,
  payments: any,
) {
  renderContainerGraphicPosts(formContainer, posts, "Месяц");

  renderContainerGraphicPayments(formContainer, payments, "Месяц");
}
function renderGraphics(
  canvas: any,
  data: any,
  labels: any,
  formContainer: any,
  label: string,
  labelX: string,
) {
  const ctx = canvas.getContext("2d");
  const padding = 40;
  const leftOffset = 30;
  const width = canvas.width - padding * 2 - leftOffset - 30;
  const height = canvas.height - padding * 2;
  ctx.lineWidth = 2;

  // Нормализация данных для отображения
  const maxDataValue = Math.max(...data);
  if (maxDataValue === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Устанавливаем стиль текста
    ctx.fillStyle = "#337ab7";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Рисуем текст "Нет данных"
    ctx.fillText(
      "Упс.. кажется нет данных",
      canvas.width / 2,
      canvas.height / 2,
    );
    return;
  }
  const scaleY = height / maxDataValue;
  // Очищаем канвас перед перерисовкой
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем оси
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(padding + leftOffset, padding);
  ctx.lineTo(padding + leftOffset, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // Рисуем метки на оси X
  ctx.fillStyle = "black";
  labels.forEach((label: any, index: number) => {
    if (index % 5 !== 0) return;
    const x = padding + leftOffset + (width / (data.length - 1)) * index;
    ctx.fillText(label, x - 10, canvas.height - padding + 15);
  });

  // Рисуем метки на оси Y
  ctx.fillStyle = "black";
  const numberOfYLabels = 5;
  for (let i = 0; i <= numberOfYLabels; i++) {
    const yValue = (maxDataValue / numberOfYLabels) * i;
    const y = canvas.height - padding - yValue * scaleY;
    ctx.fillText(Math.floor(yValue), padding + leftOffset - 30, y + 5);

    // Рисуем горизонтальную линию, если yValue не равно 0
    if (yValue !== 0) {
      ctx.beginPath();
      ctx.moveTo(padding + leftOffset + 1, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.strokeStyle = "#e0e0e0";
      ctx.stroke();
    }
  }

  // Добавляем названия осей
  ctx.fillStyle = "black";
  ctx.font = "14px Arial";
  ctx.fillText(labelX, canvas.width / 2.5, canvas.height - 5);
  ctx.save();
  ctx.translate(20, canvas.height / 1.5);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(label, 0, 1);
  ctx.restore();
  ctx.lineWidth = 3;

  // Анимация линии графика
  let currentIndex = 0; // Индекс текущей точки
  const animationSpeed = 50; // Задержка в миллисекундах

  function animateLine() {
    const buttons: any = document.body.querySelectorAll(`.button-sort`);
    buttons.forEach((button: any) => {
      if (button) {
        button.classList.add("disable");
        button.disabled = true;
        button.style.cursor = "not-allowed";
      }
    });
    if (currentIndex < data.length - 1) {
      ctx.strokeStyle = "#337ab7";
      ctx.beginPath();
      const startX =
        padding + leftOffset + (width / (data.length - 1)) * currentIndex;
      const startY = canvas.height - padding - data[currentIndex] * scaleY;
      const endX =
        padding + leftOffset + (width / (data.length - 1)) * (currentIndex + 1);
      const endY = canvas.height - padding - data[currentIndex + 1] * scaleY;

      // Интерполяция для плавного перехода
      const steps = 1000; // Количество промежуточных шагов
      for (let step = 0; step <= steps; step++) {
        const t = step / steps; // Пропорция от 0 до 1
        const interpolatedX = startX + (endX - startX) * t;
        const interpolatedY = startY + (endY - startY) * t;

        if (step === 0) {
          ctx.moveTo(interpolatedX, interpolatedY);
        } else {
          ctx.lineTo(interpolatedX, interpolatedY);
        }
      }

      ctx.stroke();
      currentIndex++;
      setTimeout(animateLine, animationSpeed); // Задержка перед следующим кадром
    } else {
      buttons.forEach((button: any) => {
        if (button) {
          button.classList.remove("disable");
          button.disabled = false;
          button.style.cursor = "pointer";
        }
      });
    }
  }

  // Начинаем анимацию
  animateLine();

  // // Рисуем точки на графике
  // ctx.strokeStyle = "black"; // Цвет обводки точек
  // data.forEach((value: any, index: number) => {
  //   const x = padding + leftOffset + (width / (data.length - 1)) * index;
  //   const y = canvas.height - padding - value * scaleY;
  //   ctx.beginPath();
  //   ctx.arc(x, y, 5, 0, Math.PI * 2); // Радиус 5
  //   ctx.stroke(); // Обводим точки
  // });

  // Модальное окно
  const modal: any = formContainer.querySelector(".modal-graphic");
  const modalContent: any = formContainer.querySelector(".modalContent");

  canvas.addEventListener("click", function (event: any) {
    event.stopPropagation();

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xIndex = Math.floor(
      (mouseX - (padding + leftOffset)) / (width / (data.length - 1)),
    );

    if (xIndex >= 0 && xIndex < data.length) {
      const yValue = data[xIndex];
      let currLabel = labels[xIndex];
      const regex = /\b(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])\b/g;
      const matches = String(currLabel).match(regex);
      let res;
      if (matches) {
        // Предполагаем, что вы хотите взять первое совпадение
        const dateParts = matches[0].split(".");

        // Проверяем, что у нас есть два элемента (день и месяц)
        if (dateParts.length === 2) {
          const day = dateParts[0];
          let month = dateParts[1];

          // Заменяем номер месяца на название
          monthsSkl.forEach((item: any, index: number) => {
            if (month === String(index + 1)) {
              month = item;
            }
          });
          res = `${day} ${month}`;
        }
      }
      let extens;
      if (label === "Количество выплат, ₽") {
        extens = "₽";
      } else {
        extens = "шт.";
      }
      modalContent.textContent = `${yValue} ${extens ? extens : ""}, ${res ? res : currLabel} `;

      // Получаем координаты курсора
      const cursorX = event.clientX;
      const cursorY = event.clientY;

      // Устанавливаем позицию модального окна
      modal.style.left = cursorX + "px";
      modal.style.top = cursorY + "px";
      modal.style.display = "block";
    }
  });

  document.addEventListener("click", function (event) {
    const isClickInsideModal = modal.contains(event.target);
    const isClickOnCanvas = event.target === canvas;
    if (!isClickInsideModal && !isClickOnCanvas) {
      modal.style.display = "none";
    }
  });
}

async function createFeedback() {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container-feedback";
  if (sessionStorage.getItem("settings") !== "3") return formContainer;
  const formTitle = document.createElement("h2");
  formTitle.textContent = "Статистика";
  formContainer.appendChild(formTitle);
  let titleDay = document.createElement("h4");
  let titleWeek = document.createElement("h4");
  let titleInfinity = document.createElement("h4");
  const containerDay: any = document.createElement("div");
  const containerWeek: any = document.createElement("div");
  const containerInfinity: any = document.createElement("div");
  containerDay.classList.add("container-table");
  containerWeek.classList.add("container-table");
  containerInfinity.classList.add("container-table");

  let themes: any[] = [];
  let ratings: any = [];

  let time = "1";
  const responseTableDay: any = await getDataTable(time);
  titleDay.innerHTML = "<i>За последний день</i>";
  formContainer.appendChild(titleDay);
  const tableDay: any = renderTable();

  time = "7";
  const responseTableWeek = await getDataTable(time);
  titleWeek.innerHTML = "<i>За последнюю неделю</i>";
  const tableWeek: any = renderTable();

  time = "infinity";
  const responseTableInfinity = await getDataTable(time);
  titleInfinity.innerHTML = "<i>За последнее время</i>";
  const tableInfinity: any = renderTable();

  containerDay.appendChild(titleDay);
  containerDay.append(tableDay);
  formContainer.appendChild(containerDay);

  containerWeek.appendChild(titleWeek);
  containerWeek.appendChild(tableWeek);
  formContainer.appendChild(containerWeek);

  containerInfinity.appendChild(titleInfinity);
  containerInfinity.appendChild(tableInfinity);
  formContainer.appendChild(containerInfinity);
  modifierTable(
    formContainer,
    responseTableDay,
    responseTableWeek,
    responseTableInfinity,
  );
  return formContainer;
}

function modifierTable(
  formContainer: any,
  responseTableDay: any,
  responseTableWeek: any,
  responseTableInfinity: any,
) {
  const divTables: any = formContainer.querySelectorAll(`.my-table`);
  let response: any;
  divTables.forEach((div: any, index: number) => {
    if (index === 0) {
      response = responseTableDay;
    } else if (index === 1) {
      response = responseTableWeek;
    } else {
      response = responseTableInfinity;
    }
    customizeTable(div, response);
  });
}

function customizeTable(div: any, response: any) {
  const tbody: any = div.querySelector("tbody");
  tbody.innerHTML = "";
  let array: any = [];
  response.forEach((resp: any, index: number) => {
    const container = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.className = "theme-output";
    td1.textContent = resp.theme;
    const td2 = document.createElement("td");
    td2.className = "rating-output";
    td2.textContent = resp.rating;
    container.append(td1, td2);

    tbody.appendChild(container);
  });
}
function renderTable() {
  const jsx: any = renderTableTitle();
  const div: any = renderTo(jsx, "my-table");

  return div;
}
export async function getDataTable(time: any) {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", `api/csat/table?time=${time}`, null, (response) => {
      if (response.ok) {
        response.json().then((data) => {
          resolve(data);
        });
      } else if (response.status === 400) {
        // reject("Пока рано");
      } else {
        // reject(new Error("Внутреняя ошибка сервера"));
        resolve(
          time === "1"
            ? [
                { theme: "Тема1", rating: "1" },
                { theme: "Тема1", rating: "1" },
              ]
            : [
                { theme: "Тема1", rating: "1" },
                { theme: "Тема7", rating: "7" },
              ],
        );
      }
    });
  });
}
export async function checkShowIFrame() {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", "/api/csat/check", null, (response) => {
      if (response.ok) {
        resolve(true);
      } else if (response.status === 400) {
        reject("Пока рано");
      } else {
        reject(new Error("Внутреняя ошибка сервера"));
      }
    });
  });
}
export async function getQuestion() {
  return new Promise((resolve, reject) => {
    fetchAjax("GET", "api/csat/question", null, (response) => {
      if (response.ok) {
        response.json().then((data) => {
          resolve(data);
        });
      } else if (response.status === 400) {
        resolve(false);
      } else {
        reject(new Error("Внутреняя ошибка сервера"));
      }
    });
  });
}
export async function addResult(questionID: any, rating: any) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      `/api/csat/result/${questionID}`,
      { rating: rating },
      (response) => {
        if (response.ok) {
          resolve(true);
        } else if (response.status === 400) {
          reject("Пока рано");
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
/**
 * Валидация окна с безопасностью
 * @param newPasswordInput Новый пароль
 * @param confirmPasswordInput ПОдверждение пароля
 * @param newPasswordError Ошибка для нового пароля
 * @param confirmPasswordError Ошибка для подтвержденного пароля
 */
function validationSecuritySave(
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  newPasswordError: HTMLDivElement,
  confirmPasswordError: HTMLDivElement,
): void {
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";

  let passwordStrength = 0;
  validateSettingsPassword(
    newPasswordInput,
    confirmPasswordInput,
    passwordStrength,
    newPasswordError,
    confirmPasswordError,
  );
}
/**
 * Функция создания лейбла
 * @param text Текст
 * @param htmlFor Значение
 * @returns
 */
function createLabel(text: string, htmlFor: string): HTMLLabelElement {
  const label = document.createElement("label");
  label.setAttribute("for", htmlFor);
  label.textContent = text;
  return label;
}
/**
 * Функция создания инпута
 * @param type Тип
 * @param id Айди
 * @param initialtext Изначальный текст
 * @returns
 */
function createInput(
  type: string,
  id: string,
  initialtext: any = null,
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.value = initialtext;
  return input;
}
/**
 * Функция рендера кнопки "СТАТЬ АВТОРОМ"
 * @returns
 */
async function createButtonSetAuthor() {
  const button: any = document.createElement("button");
  button.classList.add("become-author-button");
  button.textContent = "Стать автором";
  const userdata: any = await getAccount();
  const role = userdata.role;
  if (role !== "Reader") {
    button.classList.add("active");
    return button;
  }
  // const handleClick = async () => {
  //   const setrole = await setAuthor();
  //   button.classList.add("active");
  //   const profile: any = document.querySelector(`.profile`);
  //   profile.style.display = "block";
  //   button.removeEventListener("click", handleClick);
  // };
  const div: any = document.querySelector(`.become-a-creator`);

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
    button.classList.add("active");
  };
  button.addEventListener("click", handleClick);
  return button;
}
/**
 * Создания аватара
 * @returns
 */
async function createPhoto(): Promise<any> {
  const avatar: any = await getAvatar("/profile");
  const profilePicDiv = document.createElement("form");
  profilePicDiv.className = "profile-pic-container";
  profilePicDiv.enctype = "multipart/form-data";
  profilePicDiv.method = "POST";

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic";
  profilePic.src = avatar;

  const profilePicInput = document.createElement("input");
  profilePicInput.type = "file";
  profilePicInput.id = "profile-pic";
  profilePicInput.name = "file";
  profilePicInput.accept = "image/*";
  profilePicInput.style.display = "none";

  const uploadButton = document.createElement("button");
  uploadButton.type = "button";
  uploadButton.textContent = "Выбрать аватар";
  uploadButton.className =
    "send-tip send-tip__button send-tip__button__effects save-settings";

  uploadButton.addEventListener("click", () => {
    profilePicInput.click();
  });

  profilePicInput.addEventListener("change", async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        const message = "Неверный формат файла";
        controlPush({ status: false, message: message }, "isnotpush");

        return; // Прерываем выполнение, если формат не подходит
      }

      const reader = new FileReader();
      reader.onload = async function (e: any) {
        profilePic.src = e.target.result;
        const formData = new FormData();
        formData.append("file", file);
        try {
          const ok: any = await saveAvatar(formData);
          const message = "Аватар успешно применен";
          controlPush({ status: ok, message: message }, "isnotpush");
        } catch (error) {
          console.error("Ошибка при загрузке фонового изображения:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  });

  // Проверка наличия файла в FormData

  profilePicDiv.appendChild(profilePic);
  profilePicDiv.appendChild(profilePicInput);
  profilePicDiv.appendChild(uploadButton);

  return profilePicDiv;
}
/**
 * Создание сообщения об ошибке
 * @returns
 */
function createErrorMessage(): HTMLDivElement {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.color = "red";
  return errorMessage;
}
/**
 * Создание длины ошибок
 * @returns
 */
function createErrorMessageStrength(): HTMLDivElement {
  const errorMessage = document.createElement("div");
  errorMessage.className = "password-strength";
  return errorMessage;
}

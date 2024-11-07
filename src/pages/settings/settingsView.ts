import { Container } from "../../../node_modules/postcss/lib/postcss";
import { ELEMENTS_CLASS, LINKS, state } from "../../consts";
import { pageContainer } from "../../index";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { fetchAjax } from "../../utils/fetchAjax";
import { route } from "../../utils/routing";
import { modifierSidebar } from "../feed/feed";
import { getAccount, renderSidebar } from "../feed/feedView";
import { controlLogout, getAvatar } from "../profile/profile";
import { validateSettingsPassword, validateMainInfo } from "./settings";

export async function renderSettings() {
  try {
    const user = state.currentUser;
    const doc: any = document.body;
    doc.style.height = "100%";
    const userdata: any = await getAccount();

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      await renderSidebar(userdata),
      createElement("div", { class: "container" }, [
        createElement("h1", {}, [createText("Настройки")]),
        createElement("div", { class: "tabs" }, []),
        createElement("div", { class: "content-container" }, []),
      ]),
    ]);
    const container = update(pageContainer, vdom);

    const mainContent = container.querySelector(".main-content");

    const tabs = container.querySelector(`.tabs`);

    const contentContainer = container.querySelector(`.content-container`);

    modifierSidebar(mainContent);

    controlLogout(container, user);

    setupTabs(tabs, contentContainer, userdata);
    const index: any = sessionStorage.getItem("active");
    updateContent(
      contentContainer,
      index == null ? 0 : Number(index),
      userdata,
    );

    const profilePicForm: any = document.querySelector(
      `.profile-pic-container`,
    );
    console.log(profilePicForm);

    return container;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}
async function setAuthor() {
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
async function saveSettings(username: string, email: string, password: string) {
  return new Promise((resolve, reject) => {
    fetchAjax(
      "POST",
      "/api/accounts/account/update",
      { username: username, email: email, password: password },
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
function setupTabs(
  tabs: HTMLDivElement,
  contentContainer: HTMLDivElement,
  userdata: any,
) {
  ["Основная информация", "Безопасность", "Получение дохода"].forEach(
    (tabName, index) => {
      const tabLink = document.createElement("a");
      tabLink.textContent = tabName;
      const initial: any =
        sessionStorage.getItem("active") == null
          ? 0
          : sessionStorage.getItem("active");
      tabLink.className =
        index.toString() === initial.toString() ? "active" : "";

      // Обработчик события клика
      tabLink.addEventListener("click", (event) => {
        event.preventDefault();
        tabs
          .querySelectorAll("a")
          .forEach((link) => link.classList.remove("active"));
        tabLink.classList.add("active");
        sessionStorage.setItem("active", index.toString());
        updateContent(contentContainer, index, userdata);
      });
      tabs.appendChild(tabLink);
    },
  );
}

let buttonPersonalize: any;
let buttonPassword: any;
async function updateContent(
  contentContainer: HTMLDivElement,
  index: number = 0,
  userdata: any,
) {
  contentContainer.innerHTML = "";
  contentContainer.appendChild(await createProfileForm(userdata));
  contentContainer.appendChild(createSecurityForm());
  let containerPersonalize: any =
    contentContainer.querySelector(`.form-container`);
  let containerPassword: any = contentContainer.querySelector(
    `.form-container-security`,
  );

  switch (index) {
    case 0:
      containerPersonalize.style.display = "block";
      containerPassword.style.display = "none";
      break;
    case 1:
      containerPersonalize.style.display = "none";
      containerPassword.style.display = "block";
      break;
    default:
      return [buttonPersonalize, buttonPassword];
  }
}
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

  formContainer.append(emailRow, emailError, saveButton, buttonSetAuthor);
  const username: any = usernameInput;
  const email: any = emailInput;
  console.log(username);
  saveButton.addEventListener("click", async (event: any) => {
    const { usernameError: usernameErrorMsg, emailError: emailErrorMsg } =
      validationMainInfoSave(usernameInput.value, emailInput.value);
    usernameError.textContent = usernameErrorMsg || "";
    emailError.textContent = emailErrorMsg || "";
    if (!usernameError.textContent && !emailError.textContent) {
      const ok: any = await saveSettings(username.value, email.value, "");
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
  formTitle.textContent = "Измените данные вашей страницы";
  formContainer.appendChild(formTitle);

  // const oldPasswordRow = document.createElement("div");
  // oldPasswordRow.className = "form-row";
  // const oldPasswordLabel = createLabel("Введите старый пароль", "old-password");
  // const oldPasswordInput = createInput("password", "old-password");
  // const oldPasswordError = createErrorMessage();
  // oldPasswordRow.append(oldPasswordLabel, oldPasswordInput);
  // formContainer.append(oldPasswordRow, oldPasswordError);

  const newPasswordRow = document.createElement("div");
  newPasswordRow.className = "form-row";
  const passwordStrength = document.createElement("div");
  passwordStrength.className = "password-strength";
  const newPasswordLabel = createLabel("Введите новый пароль", "new-password");
  const newPasswordInput = createInput("password", "new-password");
  const newPasswordError = createErrorMessage();
  newPasswordRow.append(newPasswordLabel, newPasswordInput);
  formContainer.append(newPasswordRow, newPasswordError);

  const confirmPasswordRow = document.createElement("div");
  confirmPasswordRow.className = "form-row";
  const confirmPasswordLabel = createLabel(
    "Повторите пароль",
    "confirm-password",
  );
  const confirmPasswordInput = createInput("password", "confirm-password");
  const confirmPasswordError = createErrorMessageStrength();
  confirmPasswordRow.append(confirmPasswordLabel, confirmPasswordInput);
  formContainer.append(confirmPasswordRow, confirmPasswordError);

  const saveButton = document.createElement("button");
  saveButton.className = ELEMENTS_CLASS.SEND_TIP.COMBINE + " save-password";
  saveButton.textContent = "Сохранить";
  saveButton.id = "password-save";
  formContainer.addEventListener("input", (event) => {
    event.preventDefault();
    validationSecuritySave(
      // oldPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      // oldPasswordError,
      newPasswordError,
      confirmPasswordError,
    );
  });

  formContainer.append(
    // oldPasswordRow,
    // oldPasswordError,
    newPasswordRow,
    newPasswordError,
    confirmPasswordRow,
    confirmPasswordError,
    saveButton,
  );
  const password: any = newPasswordInput;
  saveButton.addEventListener("click", async () => {
    validationSecuritySave(
      // oldPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      // oldPasswordError,
      newPasswordError,
      confirmPasswordError,
    );
    if (newPasswordError.textContent == "") {
      const ok: any = await saveSettings("", "", password.value);
      // Проверяем, успешно ли сохранен аватар
      ok.message
        ? (newPasswordError.textContent = ok.message)
        : (newPasswordError.textContent = "");
      if (ok && !ok.message) {
        if (!formContainer.querySelector(`.succcesful-title`)) {
          // Создаем элемент для сообщения об успешной загрузке
          const successMessage = document.createElement("div");
          successMessage.textContent = "Данные успешно сохранены";
          successMessage.style.color = "green";
          successMessage.style.marginTop = "10px";
          successMessage.style.fontWeight = "bold";
          successMessage.className = "succcesful-title";
          newPasswordInput.value = "";
          confirmPasswordInput.value = "";
          validationSecuritySave(
            // oldPasswordInput,
            newPasswordInput,
            confirmPasswordInput,
            // oldPasswordError,
            newPasswordError,
            confirmPasswordError,
          );
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

function validationSecuritySave(
  // oldPasswordInput: HTMLInputElement,
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  // oldPasswordError: HTMLDivElement,
  newPasswordError: HTMLDivElement,
  confirmPasswordError: HTMLDivElement,
): void {
  // oldPasswordError.textContent = "";
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

function createLabel(text: string, htmlFor: string): HTMLLabelElement {
  const label = document.createElement("label");
  label.setAttribute("for", htmlFor);
  label.textContent = text;
  return label;
}

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
async function createButtonSetAuthor() {
  const button: any = document.createElement("button");
  button.classList.add("become-author-button");
  button.textContent = "Стать автором";
  const userdata: any = await getAccount();
  const role = userdata.role;
  const mainContainer: any = document.querySelector(`.main-content`);
  if (role !== "Reader") {
    button.classList.add("active");
    return button;
  }
  const handleClick = async () => {
    const setrole = await setAuthor();
    button.classList.add("active");
    const profile: any = document.querySelector(`.profile`);
    profile.style.display = "block";
    button.removeEventListener("click", handleClick);
  };
  button.addEventListener("click", handleClick);
  return button;
}

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
      const reader = new FileReader();
      reader.onload = function (e: any) {
        profilePic.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Загрузить";

  // Добавляем обработчик события для формы
  profilePicDiv.addEventListener("submit", async (e: any) => {
    e.preventDefault();

    const formData = new FormData(profilePicDiv);

    // Проверка наличия файла в FormData
    if (formData.has("file")) {
      console.log("Файл загружен:", formData.get("file"));

      const ok: any = await saveAvatar(formData);

      // Проверяем, успешно ли сохранен аватар
      if (ok) {
        // Создаем элемент для сообщения об успешной загрузке
        const successMessage = document.createElement("div");
        successMessage.textContent = "Аватар успешно загружен!";
        successMessage.style.color = "green";
        successMessage.style.marginTop = "10px";
        successMessage.style.fontWeight = "bold";

        // Добавляем сообщение в профильный div
        profilePicDiv.appendChild(successMessage);

        // Убираем сообщение через несколько секунд
        setTimeout(() => {
          successMessage.remove();
        }, 3000); // Удаляем сообщение через 3 секунды
      } else {
        if (!document.querySelector(`.error-msg`)) {
          const successMessage = document.createElement("div");
          successMessage.textContent = "Ошибка при сохранении аватара";
          successMessage.style.color = "red";
          successMessage.style.marginTop = "10px";
          successMessage.className = "error-msg";
          // Добавляем сообщение в профильный div
          profilePicDiv.appendChild(successMessage);
          // Убираем сообщение через несколько секунд
          setTimeout(() => {
            successMessage.remove();
          }, 3000); // Удаляем сообщение через 3 секунды
        }
      }
    } else {
      const successMessage = document.createElement("div");
      successMessage.textContent = "Ошибка при сохранении аватара";
      successMessage.style.color = "red";
      successMessage.style.marginTop = "10px";

      // Добавляем сообщение в профильный div
      profilePicDiv.appendChild(successMessage);

      // Убираем сообщение через несколько секунд
      setTimeout(() => {
        successMessage.remove();
      }, 3000); // Удаляем сообщение через 3 секунды
    }
  });
  profilePicDiv.appendChild(profilePic);
  profilePicDiv.appendChild(profilePicInput);
  profilePicDiv.appendChild(uploadButton);
  profilePicDiv.appendChild(submit);

  return profilePicDiv;
}

function createErrorMessage(): HTMLDivElement {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.color = "red";
  return errorMessage;
}
function createErrorMessageStrength(): HTMLDivElement {
  const errorMessage = document.createElement("div");
  errorMessage.className = "password-strength";
  return errorMessage;
}

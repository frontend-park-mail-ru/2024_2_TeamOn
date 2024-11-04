import { ELEMENTS_CLASS, LINKS, state } from "../../consts";
import { pageContainer } from "../../index";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { fetchAjax } from "../../utils/fetchAjax";
import { route } from "../../utils/routing";
import { modifierSidebar } from "../feed/feed";
import { renderSidebar } from "../feed/feedView";
import { controlLogout } from "../profile/profile";
import { validateSettingsPassword, validateMainInfo } from "./settings";

export async function renderSettings() {
  try {
    const user = state.currentUser;
    const doc: any = document.body;
    doc.style.height = "100%";

    const vdom: VNode = createElement("div", { class: "main-content" }, [
      await renderSidebar(),
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

    setupTabs(tabs, contentContainer);
    const index: any = sessionStorage.getItem("active");
    updateContent(contentContainer, index == null ? 0 : Number(index));

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
        } else if (response.status === 404) {
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
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
          route(LINKS.ERROR.HREF);
        } else {
          reject(new Error("Внутреняя ошибка сервера"));
        }
      },
    );
  });
}
function setupTabs(tabs: HTMLDivElement, contentContainer: HTMLDivElement) {
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
        updateContent(contentContainer, index);
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
) {
  contentContainer.innerHTML = "";
  contentContainer.appendChild(await createProfileForm());
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
async function createProfileForm(): Promise<HTMLDivElement> {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

  const formTitle = document.createElement("h2");
  formTitle.textContent = "Персонализируйте свою страницу";
  formContainer.appendChild(formTitle);

  const usernameRow = document.createElement("div");
  usernameRow.className = "form-row";
  const usernameLabel = createLabel("Имя пользователя", "username");
  const usernameInput = createInput("text", "username");
  const usernameError = createErrorMessage();
  usernameRow.append(usernameLabel, usernameInput);
  formContainer.append(usernameRow, usernameError);

  const emailRow = document.createElement("div");
  emailRow.className = "form-row";
  const emailLabel = createLabel("Электронная почта", "email");
  const emailInput = createInput("email", "email");
  const buttonSetAuthor = createButtonSetAuthor();
  const emailError = createErrorMessage();
  emailRow.append(emailLabel, emailInput);
  formContainer.append(emailRow, emailError, buttonSetAuthor);

  const roleRow = document.createElement("div");
  roleRow.className = "form-row";
  const roleLabel = createLabel("Роль", "role");
  const roleSelect = createRoleSelect();
  roleRow.append(roleLabel, roleSelect);

  const profilePicRow = createPhoto();

  const saveButton = document.createElement("button");
  saveButton.className = ELEMENTS_CLASS.SEND_TIP.COMBINE + " save-settings";
  saveButton.textContent = "Сохранить";

  const username: any = usernameInput;
  const email: any = emailInput;
  console.log(username);

  saveButton.addEventListener("click", async () => {
    const setSettings = await saveSettings(username.value, email.value, "");
  });

  formContainer.addEventListener("input", (event) => {
    event.preventDefault();

    const { usernameError: usernameErrorMsg, emailError: emailErrorMsg } =
      validationMainInfoSave(usernameInput.value, emailInput.value);
    usernameError.textContent = usernameErrorMsg || "";
    emailError.textContent = emailErrorMsg || "";
  });

  formContainer.append(roleRow, profilePicRow, saveButton);
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

  const oldPasswordRow = document.createElement("div");
  oldPasswordRow.className = "form-row";
  const oldPasswordLabel = createLabel("Введите старый пароль", "old-password");
  const oldPasswordInput = createInput("password", "old-password");
  const oldPasswordError = createErrorMessage();
  oldPasswordRow.append(oldPasswordLabel, oldPasswordInput);
  formContainer.append(oldPasswordRow, oldPasswordError);

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
      oldPasswordInput,
      newPasswordInput,
      confirmPasswordInput,
      oldPasswordError,
      newPasswordError,
      confirmPasswordError,
    );
  });

  formContainer.append(
    oldPasswordRow,
    oldPasswordError,
    newPasswordRow,
    newPasswordError,
    confirmPasswordRow,
    confirmPasswordError,
    saveButton,
  );
  const password: any = newPasswordInput;
  saveButton.addEventListener("click", async () => {
    const setSettings = await saveSettings("", "", password.value);
  });
  return formContainer;
}

function validationSecuritySave(
  oldPasswordInput: HTMLInputElement,
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  oldPasswordError: HTMLDivElement,
  newPasswordError: HTMLDivElement,
  confirmPasswordError: HTMLDivElement,
): void {
  oldPasswordError.textContent = "";
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";

  let passwordStrength = 0; // Переменная для хранения силы пароля
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

function createInput(type: string, id: string): HTMLInputElement {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  return input;
}
function createButtonSetAuthor() {
  const button: any = document.createElement("button");
  button.classList.add("become-author-button");
  const text: any = document.createElement("h3");
  text.textContent = "Стать автором";
  button.appendChild(text);
  button.addEventListener("click", async () => {
    const setrole = await setAuthor();
    const vdom = createElement("a", { class: "referens" }, [
      createElement("i", { class: "icon-profile" }, []),
      createText(" Профиль"),
    ]);
    const navMenu: any = document.querySelector(`.section-profile`);

    update(navMenu, vdom);
  });
  return button;
}

function createRoleSelect(): HTMLSelectElement {
  const roleSelect = document.createElement("select");
  roleSelect.id = "role";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Выберите роль";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  roleSelect.appendChild(defaultOption);

  const roles = ["Автор", "Читатель"];
  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.toLowerCase();
    option.textContent = role;
    roleSelect.appendChild(option);
  });

  return roleSelect;
}
function createPhoto(): HTMLDivElement {
  const profilePicLabel = document.createElement("label");
  profilePicLabel.setAttribute("for", "profile-pic");
  profilePicLabel.textContent = "Фото профиля";

  const profilePicDiv = document.createElement("form");
  profilePicDiv.className = "profile-pic-container";
  profilePicDiv.enctype = "multipart/form-data";
  profilePicDiv.method = "POST";

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic";

  const profilePicInput = document.createElement("input");
  profilePicInput.type = "file";
  profilePicInput.id = "profile-pic";
  profilePicInput.name = "file"; // Добавлено имя для поля
  profilePicInput.accept = "image/*";

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Сохранить";

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

  profilePicDiv.appendChild(profilePic);
  profilePicDiv.appendChild(profilePicInput);
  profilePicDiv.appendChild(submit);

  profilePicDiv.addEventListener("submit", async (e: any) => {
    e.preventDefault();

    const formData = new FormData(profilePicDiv);

    // Проверка наличия файла в FormData
    if (formData.has("file")) {
      console.log("Файл загружен:", formData.get("file"));
    } else {
      console.error("Файл не выбран.");
      return; // Прекращаем выполнение, если файл не выбран
    }

    const ok: any = await saveAvatar(formData);
  });

  const container = document.createElement("div");
  container.appendChild(profilePicLabel);
  container.appendChild(profilePicDiv);

  return container;
}
// function createPhoto(): HTMLDivElement {
//   const profilePicLabel = document.createElement("label");
//   profilePicLabel.setAttribute("for", "profile-pic");
//   profilePicLabel.textContent = "Фото профиля";

//   const profilePicDiv = document.createElement("form");
//   profilePicDiv.className = "profile-pic-container";

//   const profilePic = document.createElement("img");
//   profilePic.className = "profile-pic";

//   profilePicDiv.enctype = "multipart/form-data";

//   const profilePicInput = document.createElement("input");
//   profilePicInput.type = "file";
//   profilePicInput.id = "profile-pic";
//   profilePicInput.accept = "image/*";

//   const submit = document.createElement("button")
//   submit.type = "submit";

//   profilePicInput.addEventListener("change", async (event: any) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = function (e: any) {
//         profilePic.src = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   });

//   profilePicDiv.appendChild(profilePic);
//   profilePicDiv.appendChild(profilePicInput);
// profilePicDiv.appendChild(submit)
// profilePicDiv.addEventListener("submit", async (e: any) => {
//   e.preventDefault();

//   const formData = new FormData(profilePicDiv);
//   console.log(formData)

//   const ok: any = await saveAvatar(formData);
// })
//   const container = document.createElement("div");
//   container.appendChild(profilePicLabel);
//   container.appendChild(profilePicDiv);

//   return container;
// }

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

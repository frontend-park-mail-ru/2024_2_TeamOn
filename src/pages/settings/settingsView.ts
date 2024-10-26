import { ELEMENTS_CLASS, state } from "../../consts";
import { renderSidebar } from "../feed/feedView";
import { getCurrentUser } from "../profile/profile";
import {
  validateSettingsPassword,
  validateMainInfo
} from "./settings";
export  async function renderSettings() {
  try {
    const user: any | null = await getCurrentUser();
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const sidebar: any = renderSidebar();

    const container = createContainer();

    const mainContent = createMainContent();

    const tabs = createTabs();
    const contentContainer = createContentContainer();

    setupTabs(tabs, contentContainer);
    updateContent(contentContainer, 0);

    container.appendChild(tabs);
    container.appendChild(contentContainer);

    mainContent.appendChild(container);
    mainContent.appendChild(sidebar);
    return mainContent;
  } catch (error) {
    console.log("EROR");
    throw error;
  }
}

function createContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.className = "container";
  const title = document.createElement("h1");
  title.textContent = "Настройки";
  container.appendChild(title);
  return container;
}

function createMainContent(): HTMLDivElement {
  const mainContent = document.createElement("div");
  mainContent.className = "main-content";
  return mainContent;
}

function createTabs(): HTMLDivElement {
  const tabs = document.createElement("div");
  tabs.className = "tabs";
  return tabs;
}

function createContentContainer(): HTMLDivElement {
  const contentContainer = document.createElement("div");
  contentContainer.className = "content-container";
  return contentContainer;
}

function setupTabs(tabs: HTMLDivElement, contentContainer: HTMLDivElement) {
  ["Основная информация", "Безопасность", "Получение дохода"].forEach((tabName, index) => {
    const tabLink = document.createElement("a");
    tabLink.href = "#";
    tabLink.textContent = tabName;
    tabLink.className = index === 0 ? "active" : ""; 

    // Обработчик события клика
    tabLink.addEventListener("click", (event) => {
      event.preventDefault(); 
      tabs.querySelectorAll("a").forEach((link) => link.classList.remove("active"));
      tabLink.classList.add("active"); 
      updateContent(contentContainer, index); 
    });
    tabs.appendChild(tabLink); 
  });
}


function updateContent(contentContainer: HTMLDivElement, index: number) {
  contentContainer.innerHTML = "";
  switch(index) {
  case 0:
    contentContainer.appendChild(createProfileForm());
    break;
  case 1: 
    contentContainer.appendChild(createSecurityForm());
    break
  default:
    console.error("Страница не найдена", index);
  }
}

function createProfileForm(): HTMLDivElement {
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
  const emailError = createErrorMessage();
  emailRow.append(emailLabel, emailInput);
  formContainer.append(emailRow, emailError);

  const roleRow = document.createElement("div");
  roleRow.className = "form-row";
  const roleLabel = createLabel("Роль", "role");
  const roleSelect = createRoleSelect();
  roleRow.append(roleLabel, roleSelect);

  const profilePicRow = createPhoto();

  const saveButton = document.createElement("button");
  saveButton.className = ELEMENTS_CLASS.SEND_TIP;
  saveButton.textContent = "Сохранить";

  formContainer.addEventListener("input", (event) => {
    event.preventDefault();

    const { usernameError: usernameErrorMsg, emailError: emailErrorMsg } = validationMainInfoSave(
      usernameInput.value,
      emailInput.value
    );
    usernameError.textContent = usernameErrorMsg || "";
    emailError.textContent = emailErrorMsg || "";
  });

  formContainer.append(roleRow, profilePicRow, saveButton);

  return formContainer;
}

export function validationMainInfoSave(
  username: string,
  email: string
): { usernameError: string; emailError: string } {
  const { usernameError, emailError } = validateMainInfo(username, email);
  return { usernameError, emailError };
}

function createSecurityForm(): HTMLDivElement {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

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
  saveButton.className = ELEMENTS_CLASS.SEND_TIP;
  saveButton.textContent = "Сохранить";

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

  const profilePicDiv = document.createElement("div");
  profilePicDiv.className = "profile-pic-container";

  const profilePic = document.createElement("img");
  profilePic.className = "profile-pic";

  const profilePicInput = document.createElement("input");
  profilePicInput.type = "file";
  profilePicInput.id = "profile-pic";
  profilePicInput.accept = "image/*";

  profilePicInput.addEventListener("change", (event: any) => {
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

  const container = document.createElement("div");
  container.appendChild(profilePicLabel);
  container.appendChild(profilePicDiv);

  return container;
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

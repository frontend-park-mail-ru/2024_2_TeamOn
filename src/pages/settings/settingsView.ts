import { renderSidebar } from "../feed/feedView";
import { validateSettings } from "./settings";

export function renderSettings() {
    const sidebar: HTMLElement = renderSidebar();
    const main: HTMLDivElement = document.createElement("div");
    const container = createContainer();
    const mainContent = createMainContent();
    const tabs = createTabs();
    const contentContainer = createContentContainer();

    setupTabs(tabs, contentContainer);
    updateContent(contentContainer, 0);

    main.appendChild(sidebar);
    mainContent.appendChild(tabs);
    mainContent.appendChild(contentContainer);
    container.appendChild(mainContent);
    main.appendChild(container);
    return main;
}

function createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'container';
    return container;
}

function createMainContent(): HTMLDivElement {
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    const title = document.createElement('h1');
    title.textContent = 'Настройки';
    mainContent.appendChild(title);
    return mainContent;
}

function createTabs(): HTMLDivElement {
    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    return tabs;
}

function createContentContainer(): HTMLDivElement {
    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';
    return contentContainer;
}

function setupTabs(tabs: HTMLDivElement, contentContainer: HTMLDivElement) {
    const tabNames = ['Основная информация', 'Безопасность', 'Получение дохода'];
    tabNames.forEach((tabName, index) => {
        const tabLink = document.createElement('a');
        tabLink.href = '#';
        tabLink.textContent = tabName;
        tabLink.className = index === 0 ? 'active' : '';

        tabLink.addEventListener('click', (event) => {
            event.preventDefault();
            tabs.querySelectorAll('a').forEach((link) => link.classList.remove('active'));
            tabLink.classList.add('active');
            updateContent(contentContainer, index);
        });

        tabs.appendChild(tabLink);
    });
}

function updateContent(contentContainer: HTMLDivElement, index: number) {
    contentContainer.innerHTML = ''; 
    if (index === 0) {
        contentContainer.appendChild(createProfileForm());
    } else if (index === 1) {
        contentContainer.appendChild(createSecurityForm());
    }
}

function createProfileForm(): HTMLDivElement {
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Персонализируйте свою страницу';

    const usernameRow = document.createElement('div');
    usernameRow.className = 'form-row';
    const usernameLabel = createLabel('Имя пользователя', 'username');
    const usernameInput = createInput('text', 'username');
    const usernameError = createErrorMessage(); 
    usernameRow.append(usernameLabel, usernameInput, usernameError); 

    const emailRow = document.createElement('div');
    emailRow.className = 'form-row';
    const emailLabel = createLabel('Электронная почта', 'email');
    const emailInput = createInput('email', 'email');
    const emailError = createErrorMessage(); 
    emailRow.append(emailLabel, emailInput, emailError); 

    const roleRow = document.createElement('div');
    roleRow.className = 'form-row';
    const roleLabel = createLabel('Роль', 'role');
    const roleSelect = createRoleSelect();
    roleRow.append(roleLabel, roleSelect);

    const profilePicRow = createPhoto();

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
  
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        validationMainInfo(usernameInput, emailInput, usernameError, emailError);
    });

    formContainer.append(
        formTitle,
        usernameRow,
        emailRow,
        roleRow,
        profilePicRow,
        saveButton
    );

    return formContainer;
}

function createSecurityForm(): HTMLDivElement {
    const formContainer = document.createElement('div'); 
    formContainer.className = 'form-container';

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Измените данные вашей страницы';

    const oldPasswordLabel = createLabel('Введите старый пароль', 'old-password');
    const oldPasswordInput = createInput('password', 'old-password');
    const oldPasswordError = createErrorMessage();

    const newPasswordLabel = createLabel('Введите новый пароль', 'new-password');
    const newPasswordInput = createInput('password', 'new-password');
    const newPasswordError = createErrorMessage();

    const confirmPasswordLabel = createLabel('Повторите пароль', 'confirm-password');
    const confirmPasswordInput = createInput('password', 'confirm-password');
    const confirmPasswordError = createErrorMessage();

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
  
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        handleSecuritySave(oldPasswordInput, newPasswordInput, confirmPasswordInput, oldPasswordError, newPasswordError, confirmPasswordError);
    });

    formContainer.append(
        formTitle,
        oldPasswordLabel,
        oldPasswordInput,
        oldPasswordError,
        newPasswordLabel,
        newPasswordInput,
        newPasswordError,
        confirmPasswordLabel,
        confirmPasswordInput,
        confirmPasswordError,
        saveButton
    );

    return formContainer;
}

function validationMainInfo(usernameInput: HTMLInputElement, emailInput: HTMLInputElement, usernameError: HTMLDivElement, emailError: HTMLDivElement): void {
    usernameError.textContent = '';
    emailError.textContent = '';

    const username = usernameInput.value;
    const email = emailInput.value;

    const errors = validateSettings(username, email, '', '', '');
    if (errors.length > 0) {
        errors.forEach(error => {
            if (error.includes('Имя пользователя')) {
                usernameError.textContent = error;
            } else if (error.includes('адрес электронной почты')) {
                emailError.textContent = error;
            }
        });
    } else {
        alert('Настройки успешно сохранены!');
    }
}

function createLabel(text: string, htmlFor: string): HTMLLabelElement {
    const label = document.createElement('label');
    label.setAttribute('for', htmlFor);
    label.textContent = text;
    return label;
}

function createInput(type: string, id: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    return input;
}

function createErrorMessage(): HTMLDivElement {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.color = 'red';
    return errorMessage;
}

function createRoleSelect(): HTMLSelectElement {
    const roleSelect = document.createElement('select');
    roleSelect.id = 'role';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Выберите роль';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    roleSelect.appendChild(defaultOption);

    const roles = ['Автор', 'Читатель'];
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.toLowerCase();
        option.textContent = role;
        roleSelect.appendChild(option);
    });

    return roleSelect;
}

function createPhoto(): HTMLDivElement {
    const profilePicLabel = document.createElement('label');
    profilePicLabel.setAttribute('for', 'profile-pic');
    profilePicLabel.textContent = 'Фото профиля';

    const profilePicDiv = document.createElement('div');
    profilePicDiv.className = 'profile-pic-container';

    const profilePic = document.createElement('img');
    profilePic.className = 'profile-pic';

    const profilePicInput = document.createElement('input');
    profilePicInput.type = 'file';
    profilePicInput.id = 'profile-pic';
    profilePicInput.accept = 'image/*'; 

    profilePicInput.addEventListener('change', (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e: any) {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    profilePicDiv.appendChild(profilePic);
    profilePicDiv.appendChild(profilePicInput);

    const container = document.createElement('div');
    container.appendChild(profilePicLabel);
    container.appendChild(profilePicDiv);

    return container;
}

function handleSecuritySave(
  oldPasswordInput: HTMLInputElement,
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  oldPasswordError: HTMLDivElement,
  newPasswordError: HTMLDivElement,
  confirmPasswordError: HTMLDivElement
): void {
  oldPasswordError.textContent = '';
  newPasswordError.textContent = '';
  confirmPasswordError.textContent = '';

  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  const errors = validateSettings('', '', oldPassword, newPassword, confirmPassword);
  if (errors.length > 0) {
      errors.forEach(error => {
          if (error.includes('старый пароль')) {
              oldPasswordError.textContent = error;
          } else if (error.includes('Новый пароль')) {
              newPasswordError.textContent = error;
          } else if (error.includes('подтверждение пароля')) {
              confirmPasswordError.textContent = error;
          }
      });
  } else {
      alert('Пароль успешно изменен!');
  }
}

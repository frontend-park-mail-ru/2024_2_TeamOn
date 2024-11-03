import { ELEMENTS_CLASS, state } from "../../consts";
import { createElement, createText, update } from "../../lib/vdom/lib";
import { VNode } from "../../lib/vdom/src/source";
import { renderSidebar } from "../feed/feedView";
import { getCurrentUser } from "../profile/profile";
import { validateSettingsPassword, validateMainInfo } from "./settings";
import { pageContainer } from "../../index";

export async function renderSettings() {
  try {
    const user: any | null = await getCurrentUser(window.location.pathname);
    if (!user) {
      throw new Error("Пользователь не найден");
    }
    const doc: any = document.body;
    doc.style.height = "100%";

    state.currentUser = user;

    const vdom: VNode = createElement("div", { class: "container" }, [
      createElement("h1", {}, [createText("Настройки")]),
      createElement("div", { class: "tabs" }, [createTabs()]),
      createElement(
        "div",
        { class: "content-container", ref: "contentContainer" },
        []
      ),
      renderSidebar(),
    ]);

    const container = update(pageContainer, vdom); 
    createTabs(); 

    return container;
  } catch (error) {
    console.error("Ошибка:", error);
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

function createTabs(): VNode {
  const tabNames = ["Основная информация", "Безопасность", "Получение дохода"];
  const tabs: VNode[] = tabNames.map((tabName, index) =>
    createElement(
      "a",
      {
        href: "#",
        class: index === 0 ? "active" : "",
        events: {
          click: (event: MouseEvent) => {
            event.preventDefault();

            const links = document.querySelectorAll(".tabs a");
            links.forEach((link) => link.classList.remove("active"));
            (event.currentTarget as HTMLElement).classList.add("active");

            updateContent(
              document.querySelector(".content-container") as HTMLElement,
              index,
            );
          },
        },
      },
      [createText(tabName)],
    ),
  );

  return createElement("div", { class: "tabs" }, tabs);
}

function updateContent(contentContainer: HTMLElement, index: number) {
  let vdomContent;

  switch (index) {
    case 0:
      vdomContent = createProfileForm(); 
      break;
    case 1:
      vdomContent = createSecurityForm(); 
      break;
    default:
      vdomContent = createElement("div", {}, [
        createText("Страница не найдена"),
      ]);
  }
}
function createInput(type: string, id: string): VNode {
  return createElement("input", { type, id }, []);
}

function createLabel(text: string, htmlFor: string): VNode {
  return createElement("label", { htmlFor }, [createText(text)]);
}

function createProfileForm() {
  const vdom: VNode = createElement("div", { class: "profile-form" }, [
    createElement("div", { class: "form-container" }, [
      createElement("h2", {}, [createText("Персонализируйте свою страницу")]),

      createElement("div", { class: "form-row" }, [
        createText("Имя пользователя"),
        createInput("text", "username"), 
      ]),
      createErrorMessage(),

      createElement("div", { class: "form-row" }, [
        createText("Электронная почта"),
        createInput("email", "email"), 
      ]),
      createErrorMessage(),

      createElement("div", { class: "form-row" }, [
        createText("Выберите вашу роль:"),
        createRoleButton(), 
      ]),

      createPhoto(),

      createElement("button", { class: ELEMENTS_CLASS.SEND_TIP.COMBINE }, [
        createText("Сохранить"),
      ]),
    ]),
  ]);

  return vdom;
}

function createSecurityForm(): VNode {
  const vdom: VNode = createElement("div", { class: "profile-form" }, [
    createElement("div", { class: "security-form" }, [
      createElement("div", { class: "form-container" }, [
        createElement("h2", {}, [createText("Измените данные вашей страницы")]),

        createElement("div", { class: "form-row" }, [
          createLabel("Введите старый пароль", "old-password"),
          createInput("password", "old-password"),
        ]),
        createErrorMessage(),

        createElement("div", { class: "form-row" }, [
          createElement("div", { class: "password-strength" }, [
            createLabel("Введите новый пароль", "new-password"),
            createInput("password", "new-password"),
          ]),
        ]),
        createErrorMessage(),

        createElement("div", { class: "form-row" }, [
          createLabel("Повторите пароль", "confirm-password"),
          createInput("password", "confirm-password"),
        ]),
        createErrorMessageStrength(),

        createElement("button", { class: ELEMENTS_CLASS.SEND_TIP.COMBINE }, [
          createText("Сохранить"),
        ]),
      ]),
    ]),
  ]);

  return vdom;
}

function createRoleButton(): VNode {
  return createElement("button", { class: "become-author-button" }, [
    createText("Стать автором"),
  ]);
}

function createPhoto(): VNode {
  return createElement("div", { class: "photo-form" }, [
    createElement("label", { for: "profile-pic" }, [
      createText("Фото профиля"),
    ]),
    createElement("div", { class: "profile-pic-container" }, [
      createElement("img", { class: "profile-pic", src: "" }, []),
      createElement(
        "input",
        { type: "file", id: "profile-pic", accept: "image/*" },
        [],
      ),
    ]),
  ]);
}

function createErrorMessage(): VNode {
  return createElement(
    "div",
    { class: "error-message", style: "color: red;" },
    [],
  );
}

function createErrorMessageStrength(): VNode {
  return createElement("div", { class: "password-strength" }, []);
}

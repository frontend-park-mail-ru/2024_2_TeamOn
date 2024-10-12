/**
 * Объект, содержащий состояние приложения.
 * @param {*} activePageLink Активная ссылка в меню
 * @param {*} menuElements Элементы меню
 * @param {*} currentUser Текущий пользователь
 */
export const state = {
  activePageLink: null,
  menuElements: {},
  currentUser: null,
};

/**
 *Максимальное количество попыток авторизации.
 */
export const maxAttempts = 3;

export const validatePassword = {
  MIN_SYMBOLS: 8,
  MAX_SYMBOLS: 64,
};

export const validateUsername = {
  MIN_SYMBOLS: 4,
  MAX_SYMBOLS: 10,
};

/**
 * Объект, содержащий ссылки на страницы приложения.
 * @param {*} HOME Ссылка на домашнюю страницу
 * @param {*} LOGIN Ссылка на страницу авторизации
 * @param {*} SIGNUP Ссылка на страницу регистрации
 * @param {*} PROFILE Ссылка на страницу профиля
 * @param {*} ERROR Ссылка на страницу ошибки
 */
export const LINKS = {
  HOME: {
    HREF: "/",
    TEXT: "Домашняя страница",
  },
  LOGIN: {
    HREF: "/auth/login",
    TEXT: "Авторизация",
  },
  SIGNUP: {
    HREF: "/auth/register",
    TEXT: "Регистрация",
  },
  PROFILE: {
    HREF: "/feed/profile",
    TEXT: "Профиль",
  },
  ERROR: {
    HREF: "/error",
    TEXT: "Ошибка",
  },
  SETTINGS: {
    HREF: "/feed/settings",
    TEXT: "Настройки",
  },
  FEED: {
    HREF: "/feed",
    TEXT: "Лента",
  },
};
export const RouterLinks = {
  HOME: "/",
  FEED: "/feed",
  PROFILE: "/feed/profile",
  SETTINGS: "/feed/settings",
};
/**
 * Объект, содержащий теги HTML-элементов.
 */
export const ELEMENTS = {
  BUTTON: "button",
  INPUT: "input",
  FORM: "form",
  DIV: "div",
  SPAN: "span",
  NAV: "nav",
  IMG: "img",
  P: "p",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  A: "a",
  I: "i",
};
/**
 * Регулярные выражения для валидации
 */
export const REGEXP = {
  REGEXP_LOGIN: new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9-_]+$"),
  REGEXP_PASSWORD_ONE_NUMBER: new RegExp("[0-9]"),
  REGEX_SPEC_SYMBOL: new RegExp("[!@#$%^&*]"),
  REGEXP_UPPER_LOWER_CASE: new RegExp("(?=.*[a-z])(?=.*[A-Z])"),
};

/**
 * Объект, содержащий классы HTML-элементов.
 */
export const ELEMENTS_CLASS = {
  CLOSE_BTN: "close-btn",
  BACKGROUND_SIGNUP: "background-signup",
  BACKGROUND_LOGIN: "background-login",
  LOGIN_CONTAINER: "login-container",
  SIGNUP_CONTAINER: "container-signup",
  SIGNUP_LINK: "register-link",
  LOGIN_LINK: "login-link",
  ACTIVE: "active",
  NOTFOUND: "notfound",
  NOTFOUND_404: "notfound-404",
  ARROW: "arrow",
  HOME_CONTAINER: "home-container",
  HOME_OVERLAY: "home-overlay",
  HOME_HEADER: "home-header",
  HOME_BUTTONS: "home-buttons",
  HOME_BUTTON: "home-button",
  LEFT: "left",
  LEFT_BAR: "left-bar",
  IMAGE_PROFILE: "image-profile",
  INFO: "info",
  EARNINGS: "earnings",
  STATS: "stats",
  POST: "post",
  DATE: "date",
  LOGOUT: "logout",
  FORM_PROFILE: "form-profile",
  HEADER_PROFILE: "header-profile",
  PROFILE: "profile",
  RIGHT: "right",
  PASSWORD_EYE: "password-eye",
};

/**
 * Объект, содержащий состояние приложения.
 * @param {*} activePageLink Активная ссылка в меню
 * @param {*} menuElements Элементы меню
 * @param {*} currentUser Текущий пользователь
 */
export const state = {
  activePageLink: null,
  menuElements: {},
  currentUser: {
    author: null,
    reader: null,
  },
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
    HREF: "/login",
    TEXT: "Авторизация",
  },
  SIGNUP: {
    HREF: "/signup",
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
  NOTIFICATIONS: {
    HREF: "/feed/notifications",
    TEXT: "Уведомления",
  },
};

export const LOCATIONS = {
  LOGIN: {
    METHOD: "POST",
    HREF: "/api/auth/login",
  },
  SIGNUP: {
    METHOD: "POST",
    HREF: "/api/auth/register",
  },
  PROFILE: {
    METHOD: "GET",
    HREF: "/api/profile",
  },
  OTHER_PAGE: {
    METHOD: "GET",
    HREF: "/api/profile",
  },
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
  REGEXT_ERROR_LINK: new RegExp("^/[a-z0-9]+/[a-z0-9]+$"),
  REGEXP_EMAIL: new RegExp("^[^s@]+@[^s@]+.[^s@]+$"),
};

/**
 * Объект, содержащий классы HTML-элементов.
 */
export const ELEMENTS_CLASS = {
  CLOSE_BTN: {
    ELEMENT: "close__button",
    MODIFIER: "close__hover",
    COMBINE: "close__button close__hover",
  },
  SIGNUP: {
    BLOCK: "signup",
    ELEMENT: "signup__container",
  },
  LOGIN: {
    BLOCK: "login",
    ELEMENT: "login__container",
  },
  SIGNUP_LINK: {
    BLOCK: "signup-link",
    ELEMENT: "signup-link__a",
    MODIFIER: "signup-link__a__hover",
    COMBINE: "signup-link__a signup-link__a__hover",
  },
  LOGIN_LINK: {
    BLOCK: "login-link",
    ELEMENT: "login-link__a",
    MODIFIER: "login-link__a__hover",
    COMBINE: "login-link__a login-link__a__hover",
  },
  HOME: {
    HOME_CONTAINER: "home-container",
    HOME_CONTAINER_SEC: "home-container-sec",
    HOME_OVERLAY: "home-overlay",
    HOME_HEADER: "home-header",
  },
  HOME_BUTTONS: {
    BLOCK: "home-buttons",
    ELEMENT: "home-buttons__button",
    MODIFIER: "home-buttons__button__effects",
    COMBINE: "home-buttons home-buttons__button home-buttons__button__effects",
  },
  LOGOUT: {
    BLOCK: "logout",
    ELEMENT: "logout__button",
    MODIFIER: "logout__button__effects",
    COMBINE: "logout__button logout__button__effects",
  },
  DONATE: {
    BLOCK: "donate",
    ELEMENT: "donate__button",
    MODIFIER: "donate__button__effects",
    COMBINE: "donate donate__button donate__button__effects",
  },
  SEND_TIP: {
    BLOCK: "send-tip",
    ELEMENT: "send-tip__button",
    MODIFIER: "send-tip__button__effects",
    COMBINE: "send-tip send-tip__button send-tip__button__effects",
  },
  CANCEL: {
    BLOCK: "cancel",
    ELEMENT: "cancel__button",
    MODIFIER: "cancel__button__effects",
    COMBINE: "cancel cancel__button cancel__button__effects",
  },
  CREATE: {
    BLOCK: "create",
    ELEMENT: "create__button",
    MODIFIER: "create__button__effects",
    COMBINE: "create create__button create__button__effects",
  },
  PROFILE: {
    BLOCK: "profile",
    FORM: "form-profile",
    HEADER: "header-profile",
    RIGHT: "right",
    LEFT: "left",
    LEFT_BAR: "left-bar",
    IMAGE_PROFILE: "image-profile",
    INFO: "info",
    EARNINGS: "earnings",
    STATS: "stats",
  },
  POST: {
    TITLE: "title",
    CONTENT: "content",
    MEDIA: "media-post",
    DATE: "date",
    LIKES: {
      BLOCK: "likes-container",
      ELEMENT: "likes",
      AMOUNT: "amount-likes",
    },
    COMMENTS: {
      BLOCK: "comments-container",
      ELEMENT: "comments",
      AMOUNT: "amount-comments",
    },
    AUTHOR: {
      BLOCK: "author-section",
      AVATAR: "author-avatar",
      NAME: "author-name",
    },
    FEED: {
      BLOCK: "post-container",
    },
    PROFILE: {
      BLOCK: "post",
    },
  },
  NOTIFICATION: {
    BLOCK: "container-notification",
    ELEMENT: "notification-icon",
    MODIFIER: {
      bigICON: "icon-notification-big",
      noNOTIFICATIONS: "no-notifications",
      TEXT: "notification-text",
    },
  },
  BURGER: {
    BLOCK: "burger",
    ELEMENT: "line",
  },
  SIDEBAR: {
    BLOCK: "side",
    ELEMENT: "sidebar",
  },
  SEARCH: {
    BLOCK: "search-bar",
    ELEMENT: "search-input",
  },
  PASSWORD_EYE: "password-eye",
  ACTIVE: "active",
  NOTFOUND: "notfound",
  NOTFOUND_404: "notfound-404",
  ARROW: "arrow",
};

export const sidebarLinks = [
  {
    text: " Главная",
    icon: "icon-home",
    active: false,
    href: LINKS.FEED.HREF,
  },
  {
    text: " Уведомления",
    icon: "icon-notification",
    active: false,
    new: true,
    href: LINKS.NOTIFICATIONS.HREF,
  },
  {
    text: " Настройки",
    icon: "icon-settings",
    active: false,
    href: LINKS.SETTINGS.HREF,
  },
  {
    text: " Профиль",
    icon: "icon-profile",
    active: false,
    href: LINKS.PROFILE.HREF,
  },
];

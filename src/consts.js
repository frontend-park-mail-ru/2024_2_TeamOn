export const state = {
  activePageLink: null,
  menuElements: {},
  currentUser: null,
};

export const maxAttempts = 3;

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
    HREF: "/profile",
    TEXT: "Профиль",
  },
  PROFILE_PAYMENTS: {
    HREF: "/profile/payments",
    TEXT: "Профиль",
  },
  PROFILE_POST: {
    HREF: "/profile/posts",
    TEXT: "Профиль",
  },
  ERROR: {
    HREF: "/error",
    TEXT: "Ошибка",
  },
};

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

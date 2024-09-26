export const state = {
  activePageLink: null,
  menuElements: {},
  currentUser: null,
};

export const maxAttempts = 3;

export const users = {
  alex: {
    email: "alex@mail.com",
    password: "alesha",
    imagesrc:
      "https://steamuserimages-a.akamaihd.net/ugc/2041856159322303572/F430E99639B6B932EA68CF4DF6B233ED78AD547B/?imw=512&amp;imh=302&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true",
  },
  olya: {
    email: "olya@mail.ru",
    password: "12345",
    imagesrc:
      "https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg",
  },
  danil: {
    email: "danil@mail.ru",
    password: "javascript",
    imagesrc:
      "https://obruchalki.com/upload/iblock/4f6/4f6d56a0ad82e61874b989aac7146b1e.jpg",
  },
  polina: {
    email: "polina@mail.ru",
    password: "polina_",
    imagesrc:
      "https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg",
  },
};

export const LINKS = {
  HOME: {
    HREF: "/",
    TEXT: "Домашняя страница",
  },
  LOGIN: {
    HREF: "/api/auth/login",
    TEXT: "Авторизация",
  },
  SIGNUP: {
    HREF: "/api/auth/register",
    TEXT: "Регистрация",
  },
  PROFILE: {
    HREF: "/profile",
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
};

export const ELEMENTS_CLASS = {
  CLOSE_BTN: "close-btn",
  CONTAINER_SIGNUP: "container-signup",
  BACKGROUND_SIGNUP: "background-signup",
  BACKGROUND_LOGIN: "background-login",
  LOGIN_CONTAINER: "login-container",
  SIGNUP_LINK: "register-link",
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
};

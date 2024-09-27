import { state, ELEMENTS_CLASS } from "./consts.js";
import { renderLogin } from "./auth/loginView.js";
import { renderSignup } from "./auth/signupVew.js";
import { renderError } from "./pages/error.js";
import { renderProfile } from "./pages/profile.js";
import { renderHome } from "./pages/home.js";
import { LINKS } from "./consts.js";
import { startA } from "./menu/menu.js";

const config = {
  menu: {
    home: {
      href: LINKS.HOME.HREF,
      text: LINKS.HOME.TEXT,
      render: renderHome,
    },
    login: {
      href: LINKS.LOGIN.HREF,
      text: LINKS.LOGIN.TEXT,
      render: renderLogin,
    },
    signup: {
      href: LINKS.SIGNUP.HREF,
      text: LINKS.SIGNUP.TEXT,
      render: renderSignup,
    },
    profile: {
      href: LINKS.PROFILE.HREF,
      text: LINKS.PROFILE.TEXT,
      render: renderProfile,
    },
    profile_payments: {
      href: LINKS.PROFILE_PAYMENTS.HREF,
      text: LINKS.PROFILE_PAYMENTS.TEXT,
      render: renderProfile,
    },
    profile_post: {
      href: LINKS.PROFILE_POST.HREF,
      text: LINKS.PROFILE_POST.TEXT,
      render: renderProfile,
    },
    error: {
      href: LINKS.ERROR.HREF,
      text: LINKS.ERROR.TEXT,
      render: renderError,
    },
  },
};

export function goToPage(targetLinkMenu, statusErr = null) {
  pageContainer.innerHTML = "";

  state.activePageLink.classList.remove(ELEMENTS_CLASS.ACTIVE);
  targetLinkMenu.classList.add(ELEMENTS_CLASS.ACTIVE);
  state.activePageLink = targetLinkMenu;

  const newPageElement =
    config.menu[targetLinkMenu.dataset.section].render(statusErr);

  pageContainer.appendChild(newPageElement);
}
if (state.activePageLink == state.menuElements.home) {
  var root = startA(config.menu, state);
}

const pageContainer = document.createElement("main");
root.appendChild(pageContainer);
goToPage(state.menuElements.home, null, pageContainer);

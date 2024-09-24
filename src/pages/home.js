import { state, users } from '../consts.js';
import {goToPage} from '../index.js'

export function renderHome(conf=null, id = null) {

    const savedLogin = localStorage.getItem("login");
    if (savedLogin) {
      state.currentUser = users[savedLogin];
      goToPage(state.menuElements.profile);
    } else {
      const container = document.createElement("div");
      const overlay = document.createElement("div");
      const header = document.createElement("div");
      const buttons = document.createElement("div");
      const loginButton = document.createElement("a");
    
      container.classList.add("home-container");
    
      overlay.classList.add("home-overlay");
    
      header.classList.add("home-header");
      header.textContent = "логотипчик";
    
      buttons.classList.add("home-buttons");
    
      loginButton.classList.add("home-button");
      loginButton.textContent = "Войти";
    
      container.appendChild(overlay);
      container.appendChild(header);
      buttons.appendChild(loginButton);
      container.appendChild(buttons);
    
      loginButton.onclick = () => {
        goToPage(state.menuElements.login);
      };
      return container;
  
    }
}

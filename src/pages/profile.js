import { goToPage } from "../index.js";
import { state } from "../consts.js";
import { fetchAjax } from "../utils/fetchAjax.js";

async function getPayments() {
  const response = await fetchAjax("GET", "/profile/payments");
  if (response.ok) {
    return response.json();
  }
  return [];
}

async function getPosts() {
  const response = await fetchAjax("GET", "/profile/posts");
  if (response.ok) {
    return response.json();
  }
  return [];
}

async function getCurrentUser() {
  const response = await fetchAjax("GET", "/profile");
  if (response && response.ok) {
    const data = await response.json();
    state.currentUser = data;
    localStorage.setItem("login", data.username);
    sessionStorage.setItem("login", data.username);
    return data;
  }
  return null;
}

export async function loadUserData() {
  const user = await getCurrentUser();
  const payments = await getPayments();
  const posts = await getPosts();
  return { user, payments, posts };
}

export function renderLogoutButton() {
  const logoutLink = document.createElement("a");
  logoutLink.classList.add("logout");
  logoutLink.href = "#";
  logoutLink.textContent = "Выйти";
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("login");
    sessionStorage.removeItem("login");
    goToPage(state.menuElements.home);
  });
  return logoutLink;
}

export async function renderProfilePage() {
  const { user, payments, posts } = await loadUserData();
  const profileContainer = renderProfile(user, payments, posts);
  document.body.innerHTML = ""; 
  document.body.appendChild(profileContainer);
}
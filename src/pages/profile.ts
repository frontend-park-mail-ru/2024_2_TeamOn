import { goToPage } from "../index";
import { state } from "../consts";
import { ELEMENTS, ELEMENTS_CLASS } from "../consts";
import { fetchAjax } from "../utils/fetchAjax";
import { getItemLocalStorage, removeItemLocalStorage } from "../utils/storages";

/**
 * Получение текущего профиля через объект типа промис
 * @returns Информация о пользователе
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    //fetchAjax("GET", "/api/profile", null, (response) => {
      const response = { ok: true, status:200 };
      if (response.ok) {
        const data = { username: "olya", password: "olyalya"}; 
          resolve(data);
        } else if (response.status === 401) {
          goToPage((state.menuElements as { login: HTMLElement }).login);
          reject(new Error("Не авторизован"));
        
      } else {
        reject(new Error("Ответ от фетча с ошибкой"));
      }
    });
  //});
}




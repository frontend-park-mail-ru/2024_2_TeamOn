import { getPageAuthor } from "../../features/getpageauthor/getpageauthor";
import { route } from "../routing/routing";

/**
 * Переход на страницу автора
 * @param author Автор ID
 * @param user Юзер для проверки
 */
async function gotoauthor(authorId: any) {
  const user: any = await getPageAuthor(window.location.pathname, authorId);
  sessionStorage.setItem("authorid", authorId);
  sessionStorage.setItem("author", user.authorUsername);
  sessionStorage.getItem("account") == user.authorUsername
    ? route(`/profile`)
    : route(`/profile/${authorId}`);
}

export { gotoauthor };

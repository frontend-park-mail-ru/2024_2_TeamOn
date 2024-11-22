import { QUERY } from "../../shared/consts/consts";
import { customizePostProfile } from "../controlAdaptivePageAuthor/controlAdaptivePageAuthor";
import { getUserPosts } from "../getuserposts/getUserPosts";
import { renderUserPost } from "../../entities/userPost/index";
import { renderTo } from "../../../lib/vdom/lib";
import { containerMediaPost } from "../../widgest/feed/ui/post/post";

/**
 * Функция рендера постов
 * @param authorPosts Массив постов у текущего юзера
 * @returns
 */
async function renderPosts(authorPosts: any[]) {
  let posts: any = [];
  authorPosts.forEach(async (post: any) => {
    const container: any = await renderUserPost(post);
    const div = renderTo(container);
    posts.push(div);
  });
  return posts;
}

/**
 * Функция модифицирования каждого поста
 * @param containerPosts Контейнер с постами
 * @param posts Посты
 * @param postId Пост айди. Нужен для создания поста
 * @returns
 */
async function modifireMyPosts(
  containerPosts: any,
  posts: any,
  postId: any = null,
) {
  try {
    // Обработка популярных постов
    const containersPost = containerPosts.querySelectorAll(`.posts`);
    if (posts.length > 1 && containersPost.length > 1) {
      if (!containersPost) return;
      // Используем Promise.all для обработки популярных постов параллельно
      await Promise.all(
        Array.from(containersPost)
          .slice(-posts.length)
          .map((container: any, index: any) => {
            return customizePostProfile(
              container,
              posts[posts.length - 1 - index],
              postId,
            );
          }),
      );
      return;
    }
    return 0;
    // const containersPost = containerPosts.querySelectorAll(`.posts`);
    // return customizePostProfile(containersPost[0], posts[0], postId);
  } catch (error) {
    console.log("ERROR");
    throw error;
  }
}

/**
 * Функция пагинации на странице автора
 * @param allPosts Все посты
 * @param containerPosts Контейнер с постами
 */
async function paginateProfile(allPosts: any, containerPosts: any) {
  let stopLoad: boolean = false;
  let offset = 0;
  // Объект для предотвращения повторной загрузки
  let isLoading = false;
  const cache: any = {
    popular: [],
    recently: [],
  };
  /**
   * Загрузка постов в профиле
   * @returns
   */
  async function loadProfilePost() {
    if (isLoading) return; // Если загрузка уже идет, выходим из функции
    isLoading = true; // Устанавливаем флаг загрузки

    try {
      if (!stopLoad) {
        // Загружаем популярные посты
        const posts: any = await getUserPosts(window.location.pathname, offset);
        const nextPosts = posts.slice(0, QUERY.LIMIT);
        if (nextPosts.length > 0) {
          allPosts.push(...nextPosts);
          offset += QUERY.LIMIT;

          containerPosts.append(...(await renderPosts(nextPosts)));
          modifireMyPosts(containerPosts, nextPosts.reverse());
          // alert(2)
          // cache.popular.push(...nextPosts);
        } else {
          stopLoad = true;
        }
      }
    } finally {
      isLoading = false;
    }
  }

  // Инициализируем загрузку первых постов
  await loadProfilePost();
  // Обработчик события прокрутки
  window.addEventListener("scroll", async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // Проверяем, достиг ли пользователь нижней части страницы
    if (scrollTop + clientHeight >= scrollHeight - 500) {
      await loadProfilePost();
    }
  });
}

export { paginateProfile };

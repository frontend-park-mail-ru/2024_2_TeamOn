import { ELEMENTS_CLASS } from "../../../shared/consts/consts";
import { AddLikeOnPost } from "../api/api";

/**
 * Установка взаимодействия с лайком у поста
 * @param container Контейнер поста
 * @param post Пост
 */
function setLike(container: any, post: any) {
    const divLikes: any = container.querySelector(`.likes-container`);
    if (divLikes) {
      const amountLike: any = container.querySelector(
        `.${ELEMENTS_CLASS.POST.LIKES.AMOUNT}`,
      );
      amountLike.innerHTML = `${post.likes}`;
  
      // Установка состояния лайка
      if (post.isLiked) {
        divLikes.classList.add("active");
      } else {
        divLikes.classList.remove("active");
      }
  
      const divLike: any = container.querySelector(
        `.${ELEMENTS_CLASS.POST.LIKES.BLOCK}`,
      );
  
      divLike.addEventListener("click", async () => {
        if (post.isLiked) {
          // Удалить лайк
          const likeCount: any = await AddLikeOnPost(post.postId);
          post.isLiked = false; // Обновляем состояние
          post.likes = likeCount.count; // Обновляем количество лайков
          divLikes.classList.remove("active");
        } else {
          // Добавить лайк
          const likeCount: any = await AddLikeOnPost(post.postId);
          post.isLiked = true; // Обновляем состояние
          post.likes = likeCount.count; // Обновляем количество лайков
          divLikes.classList.add("active");
        }
        amountLike.innerHTML = `${post.likes}`; // Обновляем отображаемое количество лайков
      });
    }
  }

  export { setLike }
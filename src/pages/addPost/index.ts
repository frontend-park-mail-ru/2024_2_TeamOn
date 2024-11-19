import { renderTo, update } from "../../../lib/vdom/lib";
import {
  renderUserPost,
} from "../../entities/userPost/ui/ui";
import {renderPosts} from "../../features/controlAdaptivePageAuthor/controlAdaptivePageAuthor"
import { ELEMENTS_CLASS, LINKS } from "../../shared/consts/consts";
import { getUserPosts } from "../../features/getuserposts/getUserPosts";
import DOMPurify from "dompurify";
import { getPayments } from "../../features/getpayments/getpayments";
import { renderUserStats } from "../../entities/profileInfo/ui/ui";
import { addUserPost } from "src/entities/userPost/api/api";
import { route } from "src/shared/routing/routing";

const containerCreatePost = document.querySelector(".create-post-page");
const buttonSave = containerCreatePost?.querySelector(
  `.${ELEMENTS_CLASS.SEND_TIP.BLOCK}`,
);
const buttonCancel = containerCreatePost?.querySelector(
  `.${ELEMENTS_CLASS.CANCEL.BLOCK}`,
);

if (buttonCancel) {
  buttonCancel.addEventListener("click", () => {
    route(LINKS.PROFILE.HREF);
  });
}

if (buttonSave) {
  buttonSave.addEventListener("click", async () => {
    const title = containerCreatePost?.querySelector<HTMLInputElement>(
      `.input-group`,
    );
    const content = containerCreatePost?.querySelector<HTMLInputElement>(
      `.textarea-group`,
    );

    if (!title || !content) {
      console.error("Отсутствуют поля для ввода");
      return;
    }

    const sanitizedTitle = DOMPurify.sanitize(title.value);
    const sanitizedContent = DOMPurify.sanitize(content.value);

    if (!sanitizedTitle || !sanitizedContent) {
      const errorContainer = containerCreatePost?.querySelector(`.form-group`);
      if (errorContainer && !errorContainer.querySelector("p")) {
        const error = document.createElement("p");
        error.style.color = "red";
        error.textContent = "Заполните все поля!";
        errorContainer.appendChild(error);
      }
      return;
    }

    try {
      const post = await addUserPost(containerCreatePost,sanitizedTitle, sanitizedContent);

      const newPosts:any = await getUserPosts(window.location.pathname, 0, 300);
      const placePosts = document.querySelector(".place-posts");
      if (placePosts) {
        placePosts.prepend(...(await renderPosts(newPosts.slice(0, 1))));
      }

      const placeStats = document.querySelector(".stats");
      const payments = await getPayments(window.location.pathname);
      if (placeStats) {
        const statsVNode = await renderUserStats({ /* authorData */ }, payments);
        update(placeStats, statsVNode);
      }

      window.history.back(); 
    } catch (error) {
      console.error("Ошибка создания поста:", error);
    }
  });
}

export const mediaChange = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  const mediaContainer = document.getElementById('mediaContainer') as HTMLElement;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileType = file.type;
      let mediaElement: HTMLImageElement | HTMLVideoElement | HTMLAudioElement | HTMLIFrameElement | HTMLElement;

      // Обработка фото
      if (fileType.startsWith('image/')) {
        mediaElement = document.createElement('img') as HTMLImageElement;
        (mediaElement as HTMLImageElement).src = reader.result as string;    
        (mediaElement as HTMLImageElement).style.maxWidth = "100%";  

      // Обработка видео
      } else if (fileType.startsWith('video/')) {
        mediaElement = document.createElement('video') as HTMLVideoElement;
        (mediaElement as HTMLVideoElement).src = reader.result as string;  
        (mediaElement as HTMLVideoElement).controls = true;  
        (mediaElement as HTMLVideoElement).style.maxWidth = "100%";  

      // Обработка аудио
      } else if (fileType.startsWith('audio/')) {
        mediaElement = document.createElement('audio') as HTMLAudioElement;
        (mediaElement as HTMLAudioElement).src = reader.result as string;  
        (mediaElement as HTMLAudioElement).controls = true;  
        (mediaElement as HTMLAudioElement).style.maxWidth = "100%"; 

      // Обработка PDF
      } else if (fileType === 'application/pdf') {
        mediaElement = document.createElement('iframe') as HTMLIFrameElement;
        (mediaElement as HTMLIFrameElement).src = reader.result as string;  
        (mediaElement as HTMLIFrameElement).style.width = "100%";
        (mediaElement as HTMLIFrameElement).style.height = "500px";  

      } else {
        mediaElement = document.createElement('div') as HTMLElement;
        mediaElement.textContent = 'Неподдерживаемый тип файла'; 
      }
      mediaContainer.innerHTML = '';
      mediaContainer.appendChild(mediaElement);
    };
    reader.readAsDataURL(file);  
  }
};



import { update } from "../../../lib/vdom/lib";
import { containerCreatePost } from "./ui/ui";
import { pageContainer } from "../../app";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { modifireCreatePost } from "./modal/modal";
import { controlSlideShow } from "../../features/paginateFeed/paginateFeed";

export async function renderCreatePost() {
  try {
    const vdom: any = await containerCreatePost();
    const container = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");

    await modifireCreatePost();
    modifierSidebar(mainContent);

    return container;
  } catch (error) {
    console.log("ERROR in createpost");
    throw error;
  }
}

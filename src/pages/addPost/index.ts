import { renderTo, update } from "../../../lib/vdom/lib";
import { containerCreatePost, containerLayer } from "./ui/ui";
import {
  pageContainer,
  urlCloseModal,
  urlIconAttache,
  urlLeftArrowModal,
  urlRightArrowModal,
} from "../../app";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { modifireCreatePost } from "./modal/modal";
import { getCustomSubscription } from "../../features/getCustomSubs/getCustomSubs";
import { setTitle } from "../../shared/settitle/setTitle";
import { LINKS } from "../../shared/consts/consts";
import { setStatic } from "../../shared/getStatic/getStatic";

async function renderLayers(layers: any) {
  try {
    const containers: any = [];
    const baseSub: any = { layer: 0, title: "Базовая" };
    const container: any = containerLayer(baseSub);
    const div = renderTo(container);
    containers.push(div);

    layers.forEach((layer: any) => {
      const container: any = containerLayer(layer);
      const div = renderTo(container);
      containers.push(div);
    });
    return containers;
  } catch (error) {
    console.error("Error renderLayers");
  }
}
export async function renderCreatePost() {
  try {
    setTitle(LINKS.CREATE_POST.TEXT);
    const vdom: any = await containerCreatePost();
    const container = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");

    const iconAttache = container.querySelector(`.icon-attache`);
    setStatic(iconAttache, urlIconAttache);

    const closeModalView: any = container.querySelector(`.close-modal-view`);
    setStatic(closeModalView, urlCloseModal);
    const leftArrowModalView: any = container.querySelector(
      `.leftarrow-modal-view`,
    );
    setStatic(leftArrowModalView, urlLeftArrowModal);
    const rightArrowModalView: any = container.querySelector(
      `.rightarrow-modal-view `,
    );
    setStatic(rightArrowModalView, urlRightArrowModal);

    const placeLayers: any = container.querySelector(`.layers`);
    const subs: any = await getCustomSubscription("/profile");
    placeLayers.append(...(await renderLayers(subs)));
    await modifireCreatePost();
    modifierSidebar(mainContent);
    return container;
  } catch (error) {
    console.log("ERROR in createpost");
    throw error;
  }
}

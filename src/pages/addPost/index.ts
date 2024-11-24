import { renderTo, update } from "../../../lib/vdom/lib";
import { containerCreatePost, containerLayer } from "./ui/ui";
import { pageContainer } from "../../app";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { modifireCreatePost } from "./modal/modal";
import { containerCustomSubscribe } from "src/widgest/profile/ui/profileform/profileform";
import { getSubsLayer } from "../../features/getSubsLayer/getSubsLayer";
import { getCustomSubscription } from "../../features/getCustomSubs/getCustomSubs";
import { renderContainerSubs } from "../../features/subscriptionsList/subcriptionsList";

async function renderLayers(layers: any) {
  try {
    const containers: any = [];
    const baseSub: any = { layer: 0, title: "Базовая" };
    const container: any = containerLayer(baseSub);
    const div = renderTo(container);
    containers.push(div);

    console.log(layers);
    layers.forEach((layer: any) => {
      const container: any = containerLayer(layer);
      const div = renderTo(container);
      containers.push(div);
      console.log(containers);
    });
    return containers;
  } catch (error) {
    console.error("Error renderLayers");
  }
}
export async function renderCreatePost() {
  try {
    const vdom: any = await containerCreatePost();
    const container = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");

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

import { renderTo, update } from "../../../lib/vdom/lib";
import { containerCreatePost, containerLayer } from "./ui/ui";
import { pageContainer } from "../../app";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { modifireCreatePost } from "./modal/modal";
import { containerCustomSubscribe } from "src/widgest/profile/ui/profileform/profileform";
import {
  getAllowedSubsLayer,
  getSubsLayer,
} from "../../features/getSubsLayer/getSubsLayer";
import { getCustomSubscription } from "../../features/getCustomSubs/getCustomSubs";
import { renderContainerSubs } from "../../features/subscriptionsList/subcriptionsList";

async function renderLayers(layers: any) {
  try {
    const containers: any = [];
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
    const layers: any = await getSubsLayer();
    // const layers: any = await getAllowedSubsLayer();
    placeLayers.append(...(await renderLayers(layers)));
    await modifireCreatePost();
    modifierSidebar(mainContent);

    //   const radioButtons = container.querySelectorAll(`input[name="visibility"]`);
    //   radioButtons.forEach((radio: any) => {
    //     radio.addEventListener('change', () => {
    //         console.log(`Выбранный слой: ${radio.id} ${radio.value}`);
    //     });
    // });
    return container;
  } catch (error) {
    console.log("ERROR in createpost");
    throw error;
  }
}

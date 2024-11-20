import { renderTo, update } from "../../../lib/vdom/lib";
import { containerCreatePost, containerLayer } from "./ui/ui";
import { pageContainer } from "../../app";
import { modifierSidebar } from "../../shared/sidebar/modifire";
import { modifireCreatePost } from "./modal/modal";
import { containerCustomSubscribe } from "src/widgest/profile/ui/profileform/profileform";
import { getSubsLayer } from "../../features/getSubsLayer/getSubsLayer";

async function renderLayers() {
  try {
    const containers: any = [];
    const layers: any = await getSubsLayer();
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
    const vdom: any = await containerCreatePost();
    const container = update(pageContainer, vdom);
    const mainContent = container.querySelector(".main-content");

    const layers: any = container.querySelector(`.layers`);
    // layers.appendChild(...(await renderLayers()));

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

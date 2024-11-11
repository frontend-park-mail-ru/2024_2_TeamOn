import * as VDom from "vdom";
import { getAccount, renderSidebar } from "./feedView";

export async function createAppVNode() {
    const userdata = await getAccount();
    return (
        <div class="main-content">
            {await renderSidebar(userdata)}
            <div class="right-content">
                <div class="section-title">
                    Популярное
                </div>
                <div class="main-container-popular"></div>
                <div class="section-title">
                    Недавние
                </div>
                <div class="main-container-recently"></div>
            </div>
        </div>
    );
}
import * as VDom from "vdom";
import { Sidebar } from "../../../shared/sidebar/sidebar";
import { getAccount } from "../../../features/getAccount/getAccount";

export async function settingsContainer() {
  return (
    <div class="main-content">
      {await Sidebar()}
      <div class="container-popular">
        <div style="position: fixed;  margin-left: -20px; z-index: 1000;">
          <h1>Настройки</h1>
        </div>
        <div class="tabs settings"></div>
        <div class="content-container">
          <div class="mask_settings">
            <div class="loader_settings"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function renderStat() {
  const role: any = await getAccount();
  const flag: string =
    role.role === "Author" ? "display: block;" : "display: none;";
  const inlineStyle: string =
    " display: flex; flex-direction: column; gap: 40px";
  const inlineStyleFlag: string = flag + inlineStyle;
  return (
    <div class="container-static" style={inlineStyleFlag}>
      <div class="stat-posts">
        <div class="graphic-posts" style="width: 905px">
          <p>
            <i style="font-weight: bold;">Статистика постов </i>
          </p>
          <canvas class="canv-posts" width="900" height="300"></canvas>
        </div>
        <div class="table-posts">
          <table class="table-stat-posts">
            <thead>
              <tr>
                <td class="td-theme">Критерий</td>
                <td class="td-rating">Значение</td>
              </tr>
            </thead>
            <tbody>
              <div class="output-backend"></div>
            </tbody>
          </table>
        </div>
        <div class="period-buttons-posts">
          <button class="btn-day button-sort">За день</button>
          <button class="btn-month button-sort">За месяц</button>
          <button class="btn-year button-sort">За год</button>
        </div>
      </div>
      <div class="stat-posts">
        <div class="graphic-payments" style="width: 905px">
          <p>
            <i style="font-weight: bold;">Статистика выплат</i>
          </p>
          <canvas class="canv-payments" width="900" height="300"></canvas>
        </div>
        <div class="tables">
          <div class="table-payments">
            <table class="table-stat-payments">
              <thead>
                <tr>
                  <td class="td-theme">Критерий</td>
                  <td class="td-rating">Значение</td>
                </tr>
              </thead>
              <tbody>
                <div class="output-backend"></div>
              </tbody>
            </table>
          </div>
          <div class="period-buttons-payments">
            <button class="btn-day button-sort">За день</button>
            <button class="btn-month button-sort">За месяц</button>
            <button class="btn-year button-sort">За год</button>
          </div>
          <div class="modal-graphic" id="infoModal">
            <p class="modalContent">Информация о графике</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { renderStat };

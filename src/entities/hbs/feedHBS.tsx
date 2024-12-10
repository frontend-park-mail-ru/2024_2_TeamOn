import { renderFeed } from "src/pages/feed";
import { Sidebar } from "src/shared/sidebar/sidebar";
import * as VDom from "vdom";
import { renderSearchbar } from "../searchbar";
export async function hbsTest() {
  return (
    <div class="hbs-test">
      <div class="main-content">
        {await Sidebar()}
        {renderSearchbar()}
        <div class="right-content">
          <div class="tabs feed">
            <a class="active"> Популярное </a>
            <a> Недавние </a>
          </div>
          <div class="main-container-popular">
            <div>
              <div class="post-container">
                <div class="header-post" style="display: flex">
                  <div class="menu-icon">
                    ⋮
                    <div class="dropdown-menu">
                      <div class="interaction-post">
                        <div class="button-delete-post">Пожаловаться</div>
                      </div>
                    </div>
                  </div>
                  <div class="author-section">
                    <img class="author-avatar avatar"></img>
                    <div class="info-post-section">
                      <div class="author-name"></div>
                      <div class="date"></div>
                    </div>
                  </div>
                </div>
                <div class="title"></div>
                <div class="content"></div>
                <div class="toggleButton" style="display: none;">
                  Показать...
                </div>
                <div class="container-image-photos"></div>
                <div class="iteraction-section">
                  <div class="likes-container">
                    <div class="likes"></div>
                    <h3 class="amount-likes"></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="main-container-recently"></div>;
        </div>
      </div>
    </div>
  );
}

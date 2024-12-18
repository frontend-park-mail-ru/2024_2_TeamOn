import * as VDom from "vdom";
import { containerHomeButtons } from "../../../widgest/home/index";
import { renderSearchbar } from "../../../entities/searchbar/index";
import { containerFeedButtons } from "../../../widgest/home/index";
import { urlHomeContainer, urlHomeContainerSec } from "../../../app";

export function containerHome() {
  return (
    <div class="home-container" src={urlHomeContainer}>
      <div>
        <div>
          <div class="home-container-sec" src={urlHomeContainerSec}></div>
          <div class="home-overlay"></div>
          <div class="home-header">PUSHART</div>
          <div class="searchbar-container">{renderSearchbar()}</div>
          {containerFeedButtons()}
          {containerHomeButtons()}
        </div>
      </div>
      <footer class="footer">
        <div class="footer-content">
          <div>
            <div class="logo">
              <img src="https://placehold.co/30x30" alt="Company Logo">
                {" "}
              </img>
            </div>
            <p>We growing up your business with personal AI manager.</p>
            <p>Maxwell, 2023.</p>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Pricing</a>
          </div>
          <div>
            <h3>Resources</h3>
            <a href="#">Documentation</a>
            <a href="#">Papers</a>
            <a href="#">Press Conferences</a>
          </div>
          <div>
            <h3>Legal</h3>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies Policy</a>
            <a href="#">Data Processing</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2023 Maxwell Inc. All rights reserved.</p>
          <div class="social-icons">
            <a href="#">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

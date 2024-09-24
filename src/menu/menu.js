
import { state } from '../consts.js';
import { menuContainer } from '../index.js';

export function renderMenu( conf, id = null ) {
    Object.entries(conf).forEach(([key, { href, text }], index) => {
        const menuElement = document.createElement('a');
        menuElement.href = href;
        menuElement.textContent = text;
        menuElement.dataset.section = key;

        if (index === 0) {
            menuElement.classList.add('active');
            state.activePageLink = menuElement;
        }

        state.menuElements[key] = menuElement;
        menuContainer.appendChild(menuElement);
    });
}
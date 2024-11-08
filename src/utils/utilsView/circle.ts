/**
 * Создание маски
 * @returns
 */
function createMask() {
  const mask = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mask.innerHTML = `
  <defs class="defs">
    <mask id="circle-mask">
      <rect width="800%" height="800%" fill="white" />
      <circle cx="50%" cy="50%" r="100" fill="black" />
    </mask>
  </defs>
`;
  return mask;
}
/**
 * Управление маской
 * @param container Контейнер
 * @param containerSecond Второй контейнер
 * @param mask Маска
 * @returns
 */
function controllerMask(container: any, containerSecond: any, mask: any) {
  // Добавляем обработчик события для движения мыши
  if (container == undefined) {
    return 0;
  }
  container.addEventListener("mousemove", (e: any) => {
    containerSecond.style.mask = "url(#circle-mask)";
    containerSecond.style.webkitmask = "url(#circle-mask)";
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // Корректируем координаты по отношению к контейнеру
    const y = e.clientY - rect.top;

    // Обновляем позицию круга в маске
    const circle = mask.querySelector("circle") as SVGCircleElement;
    circle.setAttribute("cx", `${x}`);
    circle.setAttribute("cy", `${y}`);
  });

  // Добавляем обработчик события для выхода мыши из элемента
  container.addEventListener("mouseout", () => {
    containerSecond.style.mask = "none";
    containerSecond.style.webkitmask = "none";
  });
}
export { createMask, controllerMask };

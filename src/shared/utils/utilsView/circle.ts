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
// function controllerMask(container: any, containerSecond: any, mask: any) {
//   // Проверяем, что контейнер определен
//   if (container == undefined) {
//     return 0;
//   }

//   // Добавляем обработчик события для движения мыши
//   container.addEventListener("mousemove", (e: MouseEvent) => {
//     containerSecond.style.mask = "url(#circle-mask)";
//     containerSecond.style.webkitmask = "url(#circle-mask)";

//     const rect = container.getBoundingClientRect();
//     const x = e.pageX - rect.left - window.scrollX; // Корректируем координаты по отношению к контейнеру
//     const y = e.pageY - rect.top - window.scrollY;
//     console.log(e.pageY)
//     console.log(window.scrollY)
//     // Обновляем позицию круга в маске
//     const circle = mask.querySelector("circle") as SVGCircleElement;
//     circle.setAttribute("cx", `${x}`);
//     circle.setAttribute("cy", `${y}`);
//   });

//   // Добавляем обработчик события для выхода мыши из элемента
//   container.addEventListener("mouseout", () => {
//     containerSecond.style.mask = "none";
//     containerSecond.style.webkitmask = "none";
//   });
// }

function controllerMask(container: any, containerSecond: any, mask: any) {
  // Добавляем обработчик события для движения мыши
  if (container == undefined) {
    return 0;
  }
  // container.addEventListener("mousemove", (e: MouseEvent) => {
  //   containerSecond.style.mask = "url(#circle-mask)";
  //   containerSecond.style.webkitmask = "url(#circle-mask)";
  //   const rect = container.getBoundingClientRect();
  //   const x = e.clientX - rect.left; // Корректируем координаты по отношению к контейнеру
  //   const y = e.clientY - rect.top;

  //   // Обновляем позицию круга в маске
  //   const circle = mask.querySelector("circle") as SVGCircleElement;
  //   circle.setAttribute("cx", `${x}`);
  //   circle.setAttribute("cy", `${y}`);
  // });

  // // Добавляем обработчик события для выхода мыши из элемента
  // container.addEventListener("mouseout", () => {
  //   containerSecond.style.mask = "none";
  //   containerSecond.style.webkitmask = "none";
  // });

  // Функция для обновления маски
  const updateMaskHome = (e: any) => {
    containerSecond.style.mask = "url(#circle-mask)";
    containerSecond.style.webkitmask = "url(#circle-mask)";
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // Корректируем координаты по отношению к контейнеру
    const y = e.clientY - rect.top;

    // Обновляем позицию круга в маске
    const circle = mask.querySelector("circle") as SVGCircleElement;
    circle.setAttribute("cx", `${x}`);
    circle.setAttribute("cy", `${y}`);
  };

  // Добавляем обработчики событий для контейнера
  container.addEventListener("mousemove", updateMaskHome);
  container.addEventListener("mouseout", () => {
    containerSecond.style.mask = "none";
    containerSecond.style.webkitmask = "none";
  });

}
export { createMask, controllerMask };

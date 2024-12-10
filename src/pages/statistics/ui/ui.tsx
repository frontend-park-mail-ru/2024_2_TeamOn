import * as VDom from "vdom";

function renderTableTitle() {
  return (
    <table>
      <thead>
        <tr>
          <td class="td-theme">Тема</td>
          <td class="td-rating">Рейтинг</td>
        </tr>
      </thead>
      <tbody>
        <div class="output-backend"></div>
      </tbody>
    </table>
  );
}

function renderStatics(theme: any, rating: any) {
  return (
    <tr>
      <td class="theme-output">{theme}</td>
      <td class="rating-output">{rating}</td>
    </tr>
  );
}
function createDiv() {
  return <div></div>;
}
export { renderTableTitle, renderStatics, createDiv };

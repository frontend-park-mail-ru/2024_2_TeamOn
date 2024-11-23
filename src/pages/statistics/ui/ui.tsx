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
        <div class="output-backend">
          {/* {renderStatic(theme, rating)} */}
          {/* {renderStatics("1", "2")} */}
          {/* <tr>
            <td class="theme-output">434</td>
            <td class="rating-output">sdsd</td>
          </tr> */}
        </div>
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

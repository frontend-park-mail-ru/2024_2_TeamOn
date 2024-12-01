import { hasLogged } from "../../../../shared/utils/hasLogged";
import * as VDom from "vdom";

function complaintForm() {
  let flag = "display: block";
  if (!hasLogged()) flag = "display: none;";
  return <div class="complaint-form" style={flag}></div>;
}

export { complaintForm };

import * as VDom from "vdom";
import { signupForm, linkLogin } from "../../../widgest/signup/index";

export function containerSignup() {
  return (
    <div class="signup">
      <div class="signup__container">
        <button class="close__button close__hover"></button>
        <h2>Регистрация</h2>
        {signupForm()}
        {linkLogin()}
      </div>
    </div>
  );
}

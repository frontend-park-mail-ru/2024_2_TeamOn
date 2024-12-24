import * as VDom from "vdom";
import { signupForm, linkLogin } from "../../../widgest/signup/index";
import { urlSignup } from "../../../app";

export function containerSignup() {
  return (
    <div class="signup" src={urlSignup}>
      <div class="signup-background"></div>
      <div class="signup__container">
        <button class="close__button close__hover"></button>
        <h2>Регистрация</h2>
        {signupForm()}
        {linkLogin()}
      </div>
    </div>
  );
}

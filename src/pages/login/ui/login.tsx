import * as VDom from "vdom";
import { loginForm, linkSignup } from "../../../widgest/login/index";

export function containerLogin() {
  return (
    <div class="login">
      <div class="login__container">
        <button class="close__button close__hover"></button>
        <h2>Вход</h2>
        {loginForm()}
        {linkSignup()}
      </div>
    </div>
  );
}

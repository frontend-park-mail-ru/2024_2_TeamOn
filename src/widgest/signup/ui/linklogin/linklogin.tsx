import * as VDom from "vdom";

function linkLogin() {
  return (
    <div class="login-link">
      У вас уже есть аккаунт?
      <a class="login-link__a login-link__a__hover">Войти</a>
    </div>
  );
}

export { linkLogin };

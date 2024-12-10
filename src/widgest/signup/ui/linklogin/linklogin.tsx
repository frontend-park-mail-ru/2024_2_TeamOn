import * as VDom from "vdom";

function linkLogin() {
  const linkMessage: string = "У вас уже есть аккаунт? ";
  return (
    <div class="login-link" style="user-select: none;">
      {linkMessage}
      <a class="login-link__a login-link__a__hover">Войти</a>
    </div>
  );
}

export { linkLogin };

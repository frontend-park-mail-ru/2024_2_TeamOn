import * as VDom from "vdom";

function linkSignup() {
  const linkMessage: string = "У вас нет аккаунта? ";
  return (
    <div class="signup-link" style="user-select: none;">
      {linkMessage}
      <a class="signup-link__a signup-link__a__hover">Зарегистрируйтесь</a>
    </div>
  );
}

export { linkSignup };

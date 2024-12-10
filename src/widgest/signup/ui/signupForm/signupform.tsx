import * as VDom from "vdom";

function signupForm() {
  return (
    <form class="form-signup">
      <input class="input-username"></input>
      <input class="input-password"></input>
      <input class="input-repeatPassword"></input>
      <div class="password-strength"></div>
      <input class="button-signup"></input>
    </form>
  );
}

export { signupForm };

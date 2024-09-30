(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['loginTemplate.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"BACKGROUND_LOGIN") : stack1), depth0))
    + "\">\n  <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"LOGIN_CONTAINER") : stack1), depth0))
    + "\">\n    <button class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"CLOSE_BTN") : stack1), depth0))
    + "\" onclick=\"goToPage(state.menuElements.home)\">x</button>\n    <h2>Вход</h2>\n    \n    <form id=\"loginForm\" onsubmit=\"handleSubmit(event)\">\n      <input type=\"text\" id=\"inputLogin\" placeholder=\"Введите email или имя пользователя\" required>\n      <i class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"PASSWORD_EYE") : stack1), depth0))
    + "\" onclick=\"togglePasswordVisibility()\">👁️</i>\n      <input type=\"password\" id=\"inputPassword\" placeholder=\"Введите пароль\" required>\n      <input type=\"submit\" value=\"Войти\">\n\n      <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"SIGNUP_LINK") : stack1), depth0))
    + "\">\n        У вас нет аккаунта? <a href=\"#\" onclick=\"goToPage(state.menuElements.signup)\">Зарегистрируйтесь</a>\n      </div>\n    </form>\n  </div>\n</div>\n\n";
},"useData":true});
})();
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signupTemplate.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<script id=\"signup-template\" type=\"text/x-handlebars-template\">\n  <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"BACKGROUND_SIGNUP") : stack1), depth0))
    + "\">\n    <form class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"CONTAINER_SIGNUP") : stack1), depth0))
    + "\" id=\"signupForm\">\n      <button class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"CLOSE_BTN") : stack1), depth0))
    + "\" onclick=\"goToPage(state.menuElements.home)\">x</button>\n      <h2>Регистрация</h2>\n      <input type=\"text\" id=\"inputUsername\" placeholder=\"Введите имя пользователя\" required>\n      <input type=\"password\" id=\"inputPassword\" placeholder=\"Придумайте пароль (минимум 8 символов)\" required>\n      <input type=\"password\" id=\"inputRepeatPassword\" placeholder=\"Повторите пароль\" required>\n      <input type=\"submit\" value=\"Зарегистрироваться\" id=\"registerButton\">\n    </form>\n  </div>\n</script>\n";
},"useData":true});
})();
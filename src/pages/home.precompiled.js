(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['homeTemplate.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<script id=\"home-template\" type=\"text/x-handlebars-template\">\n  <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HOME_CONTAINER") : stack1), depth0))
    + "\">\n    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HOME_OVERLAY") : stack1), depth0))
    + "\"></div>\n    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HOME_HEADER") : stack1), depth0))
    + "\">PUSHART</div>\n    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HOME_BUTTONS") : stack1), depth0))
    + "\">\n      <a class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HOME_BUTTON") : stack1), depth0))
    + "\" id=\"loginButton\">Войти</a>\n    </div>\n  </div>\n</script>\n";
},"useData":true});
})();
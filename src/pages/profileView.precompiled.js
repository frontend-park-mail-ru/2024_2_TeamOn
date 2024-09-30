(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['profileTemplate.hbs'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <a href=\"#\" class=\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||container.hooks.helperMissing).call(alias1,depth0,(depths[1] != null ? lookupProperty(depths[1],"activePage") : depths[1]),{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":5,"column":41},"end":{"line":5,"column":64}}}),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":5,"column":35},"end":{"line":5,"column":77}}})) != null ? stack1 : "")
    + "\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</a>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "bold";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"POST") : stack1), depth0))
    + "\">\n                        <h4>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"title") : depth0), depth0))
    + "</h4>\n                        <p>"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"text") : depth0), depth0))
    + "</p>\n                        <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"DATE") : stack1), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"createdAt") : depth0), depth0))
    + "</div>\n                    </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"FORM_PROFILE") : stack1), depth0))
    + "\">\n    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"HEADER_PROFILE") : stack1), depth0))
    + "\">\n        <nav>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"navLinks") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":12},"end":{"line":6,"column":21}}})) != null ? stack1 : "")
    + "        </nav>\n        "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"logoutButton") || (depth0 != null ? lookupProperty(depth0,"logoutButton") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"logoutButton","hash":{},"data":data,"loc":{"start":{"line":8,"column":8},"end":{"line":8,"column":26}}}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n    <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"PROFILE") : stack1), depth0))
    + "\">\n        <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"LEFT") : stack1), depth0))
    + "\">\n            <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"LEFT_BAR") : stack1), depth0))
    + "\">\n                <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"profileImage") : stack1), depth0))
    + "\" class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"IMAGE_PROFILE") : stack1), depth0))
    + "\" alt=\"Profile Image\">\n                <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"INFO") : stack1), depth0))
    + "\">\n                    <h2>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"username") : stack1), depth0))
    + "</h2>\n                    <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"status") : stack1), depth0))
    + "</p>\n                </div>\n                <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"EARNINGS") : stack1), depth0))
    + "\">\n                    <h3>Выплаты:</h3>\n                    <p>За сегодня вы заработали:</p>\n                    <p>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"payments") : depth0)) != null ? lookupProperty(stack1,"0") : stack1)) != null ? lookupProperty(stack1,"amount") : stack1), depth0))
    + "</p>\n                </div>\n            </div>\n        </div>\n        <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"RIGHT") : stack1), depth0))
    + "\">\n            <div class=\""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"ELEMENTS_CLASS") : depth0)) != null ? lookupProperty(stack1,"STATS") : stack1), depth0))
    + "\">\n                <div>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"posts") : depth0)) != null ? lookupProperty(stack1,"length") : stack1), depth0))
    + " постов</div>\n                <div>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"subscriptions") : stack1), depth0))
    + " подписчиков</div>\n                <div>"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"followers") : stack1), depth0))
    + " подписок</div>\n            </div>\n            <div class=\"posts\">\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"posts") : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":16},"end":{"line":38,"column":25}}})) != null ? stack1 : "")
    + "            </div>\n        </div>\n    </div>\n</div>\n";
},"useData":true,"useDepths":true});
})();
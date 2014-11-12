define(['handlebars'], function(Handlebars) {

this["TPL"] = this["TPL"] || {};

this["TPL"]["form:form"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<form action=\"POST\" class=\"b-form\">\r\n    <button type=\"submit\" class=\"b-button\">find flights</button>\r\n</form>\r\n<a class=\"j-add-segment\" href=\"#\">Add segment + </a>";
},"useData":true});



this["TPL"]["form:segment"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return " <input class=\"b-form-input\" type=\"date\" rv-value=\"model:date\" placeholder=\"Departure date\">\r\n <input class=\"b-form-input\" type=\"text\" rv-value=\"model:_origin_iata\" placeholder=\"Depart direction\">\r\n <input class=\"b-form-input\" type=\"text\" rv-value=\"model:_destination_iata\" placeholder=\"Return direction\">";
},"useData":true});



this["TPL"]["tickets:tickets"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "		<li class=\"b-search_results-item\">\n            <div class=\"b-search_results-item_price\">"
    + escapeExpression(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"price","hash":{},"data":data}) : helper)))
    + " ₽</div>\n            <a target=\"_blank\" href=\""
    + escapeExpression(((helper = (helper = helpers.deeplink || (depth0 != null ? depth0.deeplink : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"deeplink","hash":{},"data":data}) : helper)))
    + "\">\n                <div class=\"b-buy_button\">Get it now!</div>\n            </a>\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul class=\"b-search_results\">\n";
  stack1 = helpers.each.call(depth0, depth0, {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>";
},"useData":true});

return this["TPL"];

});
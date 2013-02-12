//= require jquery
//= require jquery_ujs

//= require bootstrap
//= require handlebars
//= require ember

//= require ../campaign_frontend/src/ember-facebook
//= require_tree .

if(content_type != undefined)
  content_template = content_type.name;
else
  content_template = null

App = Ember.Application.create({
    rootElement: '#view',
    button: true
});

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.IndexView = Ember.View.extend({
    templateName: content_template,
    didInsertElement: function() {
      if(content_type != undefined) {
        fx = eval(content_type.js).render;
        fx(this);
      }
    }
});

App.IndexController = Ember.Controller.extend({
  data: function() {
    fx = eval(content_type.js).data;
    return fx($.parseJSON(content_type.theming_data));
  }.property()
});

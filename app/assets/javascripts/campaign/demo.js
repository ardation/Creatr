if(typeof content_type != 'undefined')
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
  
App.ContentView = Ember.View.extend({
    templateName: content_template,
    didInsertElement: function() {
      fx = eval(content_type.js).render;
      fx(this);
    }

});

App.ApplicationController = Ember.Controller.extend({});
App.ContentController = Ember.Controller.extend({
  data: function() {
    fx = eval(content_type.js).data;
    return fx($.parseJSON(content_type.theming_data));
  }.property()
});


App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router){
        router.get('applicationController').connectOutlet( 'content');
      }
    })
  })
});

if(typeof content_type != 'undefined')
  content_template = 'test';//content_type.name;
else
  content_template = null

App = Ember.Application.create({
    rootElement: '#view',
});

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});
  
App.ContentView = Ember.View.extend({
    templateName: content_template
});

App.ApplicationController = Ember.Controller.extend({});
App.ContentController = Ember.Controller.extend({
  name: 'Reuben Posthuma',
  data: function() {
    return {name: 'Tom', age: 12};
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
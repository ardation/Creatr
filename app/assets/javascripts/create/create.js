//Testing this out!

App = Ember.Application.create({
  rootElement: '#emberContainer'
});
  
App.ApplicationController = Ember.Controller.extend();

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.Step1View = Ember.View.extend ({
  templateName: 'templates/step1'
});

App.Step2View = Ember.View.extend ({
  templateName: 'templates/step2'
});


App.Step1Controller = Ember.ArrayController.extend();
App.Step2Controller = Ember.ArrayController.extend();

App.CRMData = Ember.Object.extend();


App.CRMData.reopenClass ({

  crm_data: Em.A(),

  loadData: function() {
    context = this;
    $.getJSON ("ajax/crm_data", function(data) {
      data.forEach(function(crm) {
        context.crm_data.addObject(App.CRMData.create(crm))
      }, context)
    }); 
    return this.crm_data;

  }
});

App.Router = Em.Router.extend ({
  enableLogging: true,

  root: Em.Route.extend ({
    showstep2: Ember.Route.transitionTo('step2'),

    index: Ember.Route.extend({
      route: '/'
    }),

    step1: Ember.Route.extend ({
      route: 'step1',
      connectOutlets: function(router){
        router.get('applicationController').connectOutlet( 'step1', App.CRMData.loadData());
      }
    }),

    step2: Ember.Route.extend ({
      route: 'step2',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet( 'step2')
      }
    })
  })
});




// App.CRM = DS.Model.extend({

// });






// $.ready(function() {
//   App.initialize();
// });
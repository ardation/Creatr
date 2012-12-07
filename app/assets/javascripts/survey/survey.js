subViews = new Array();

content_types_obj = Ember.ArrayProxy.create({content: content_types});

App = Ember.Application.create({
    rootElement: '#survey',
    autoinit: false
});

App.SurveyData = Ember.Object.create({
  data: []
});


App.surveyViews = [];
App.surveyControllers = [];

for(i = 0; i<survey_contents.length; i++) {
  content_type_id = survey_contents[i].content_type_id;
  content_type = content_types_obj.get('content').findProperty('id', content_type_id);

  App.surveyViews[i] = Ember.View.extend({
    templateName: 'Text Template',
    didInsertElement: function() {
      fx = eval(content_type.js).render;
      fx();
    }
  });

  App.surveyControllers[i] = Ember.Controller.extend({
    id: i,
    answerBinding: this.get('App.SurveyData.data').pushObject("test"),

    data: function() {
      fx = eval(content_type.js).data;
      return fx(survey_contents[this.id].data);
    }.property(),

    outData: function() {
      return "this is a test";
    }.property()
  });
}

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});
  
App.ApplicationController = Ember.Controller.extend({ });

App.SubmitView = Ember.View.extend({
  templateName: 'final'
});

App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({
    index: Em.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.route('/1');
      }
    }),
    step: Em.Route.extend({
      route: '/:step',
      connectOutlets: function(router, context) { 
        if(context.step < App.surveyViews.length) {
          router.get('applicationController').connectOutlet({ 
              viewClass: App.surveyViews[context.step-1], 
              controller: App.surveyControllers[context.step-1].create(),
              context: {}
          });
        }
        else {
          router.transitionTo('finish');
        }
      }
    }),
    finish: Em.Route.extend({
      route: '/submit',
      connectOutlets: function(router, context) {
        router.get('applicationController').connectOutlet('submit');
      }
    })
  })
});

$(document).ready(function() {
  App.initialize();
});

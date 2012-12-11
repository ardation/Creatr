nextStep = 1;

scratch = null;
function sneakyFunction(data) {
  console.log(data);
  scratch = data;
  return data;
}

subViews = new Array();
content_types_obj = Ember.ArrayProxy.create({content: content_types});

App = Ember.Application.create({
    rootElement: '#survey',
    autoinit: false,
    nextStep: 1
});

App.SurveyData = Ember.ArrayProxy.create({
  content: [],

  uploadData: function() {
    $.post('upload', JSON.stringify(this.content,null));
  }
});


App.surveyViews = [];
App.surveyControllers = [];

for(i = 0; i<survey_contents.length; i++) {
  content_type_id = survey_contents[i].content_type_id;
  content_type = content_types_obj.get('content').findProperty('id', content_type_id);
  Ember.get('App.SurveyData').pushObject(""),

  App.surveyViews[i] = Ember.View.extend({
    templateName: 'Text Template',
    didInsertElement: function() {
      fx = eval(content_type.js).render;
      fx();
    }
  });

  App.surveyControllers[i] = Ember.Controller.extend({
    id: i,
    next: this.id+1,
    answer: App.SurveyData.content[this.id-1],

    answerObserver: function() {
      App.SurveyData.content[this.id-1] = this.answer;
    }.observes('answer'),

    data: function() {
      fx = eval(content_type.js).data;
      return fx(survey_contents[this.id].data);
    }.property(),

    enter: function() {
      alert("entered");
    }
  });
}

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});
  
App.ApplicationController = Ember.Controller.extend({
  test: 2
});

App.SubmitView = Ember.View.extend({
  templateName: 'final'
});

App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({

    incrementStep: Ember.Route.transitionTo('step'),

    index: Em.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.route('/1');
      }
    }),
    step: Em.Route.extend({
      route: '/:step',
      connectOutlets: function(router, context) { 
        if(context.step <= App.surveyViews.length) {
          router.get('applicationController').connectOutlet({ 
              viewClass: App.surveyViews[context.step-1], 
              controller: sneakyFunction(App.surveyControllers[context.step-1].create()),
              context: {}
          });
          router.controller.enter();
        }
        else {
          router.transitionTo('finish');
        }
      },
      exit: function() {
      //
      }, 
      enter: function() {

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

Ember.LOG_BINDINGS=true;
$(document).ready(function() {
  App.initialize();
});

testAnswer = "Reuben";

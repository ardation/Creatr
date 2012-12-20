nextStep = 1;

subViews = new Array();
content_types_obj = Ember.ArrayProxy.create({content: content_types});

App = Ember.Application.create({    // When ember updates we will need to use createWithMixins
    rootElement: '#surveyContainer',
    autoinit: false,
    nextStep: 1,
    button: true
}, Em.Facebook);


App.setProperties({
    appId: 113411778806173
});

App.SurveyData = Ember.ArrayProxy.create({
  content: [],
  storerecord: function() {
    //store data for submission
    var records = [];
    if ( amplify.store('records') == undefined ) {
      amplify.store('records', records);
    }
    records = amplify.store('records');
    data = JSON.parse(JSON.stringify(this.content));
    records.push(data);
    amplify.store('records', records);
  },
  pushrecords: function() {
    var records = amplify.store('records');
    _.each(records, function(value) {
      console.log(value)
      $.post('upload', value , 'json')
      .success(function() {
        amplify.store('records', _.without(records, value));
      })
      .error(function(data) {
        // if(data.responseText == '"Phone Number already exists in the system."') {
        //   amplify.store('records', _.without(records, value));
        // }
      });
    });
  }
});


App.surveyViews = [];
App.surveyControllers = [];

for(i = 0; i<survey_contents.length; i++) {
  content_type_id = survey_contents[i].content_type_id;
  content_type = content_types_obj.get('content').findProperty('id', content_type_id);
  Ember.get('App.SurveyData').pushObject(""),

  App.surveyViews[i] = Ember.View.extend
  ({
    templateName: content_type.name,
    classTest: 'test',
    didInsertElement: function() {
      fx = eval(content_type.js).render;
      fx();
    }
  });

  App.surveyControllers[i] = Ember.Controller.extend({
    id: i,
    content_store: content_type,
    next: this.id+1,

    data: function() {
      fx = eval(this.content_store.js).data;
      return fx($.parseJSON(survey_contents[this.id].data));
    }.property(),

    enter: function() {
      fx = eval(this.content_store.js).enter;
      fx(this.readHelper, this.writeHelper, this.id, survey_contents[this.id].data, this);
    },
    
    exit: function() {
      fx = eval(this.content_store.js).exit;
      fx(this.readHelper, this.writeHelper, this.id, survey_contents[this.id].data, this);
    },

    writeHelper: function(index, data) {
      App.SurveyData.content[index] = data;
    },
    
    readHelper: function(index) {
      return App.SurveyData.content[index];
    },
    _propertySet: function(name, data) {
      App.surveyControllers[this.id].set(name, data);
    }

  });

  App.surveyControllers[i] = App.surveyControllers[i].create();
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

    incrementStep: function(router) {
      router.transitionTo('step', {step:App.nextStep});
    },

    index: Em.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        //router.route('//1');
        test = {step:1};
        router.transitionTo('step', {step:1});
      }
    }),
    step: Em.Route.extend({
      route: '/:step',
      connectOutlets: function(router, context) { 
        if(context.step*1 <= App.surveyViews.length) {
          App.set('nextStep', context.step*1+1);
          this.currentStep = context.step;
          App.surveyControllers[context.step-1].enter();
          router.get('applicationController').connectOutlet({ 
              viewClass: App.surveyViews[context.step-1], 
              controller: App.surveyControllers[context.step-1],
              context: {}
          });
        }
        else {
          router.transitionTo('finish');
        }
      },
      exit: function(router) {
        App.surveyControllers[this.currentStep-1].exit();
      }
    }),
    finish: Em.Route.extend({
      route: '/submit',
      connectOutlets: function(router, context) {
        App.set('button', false);
        router.get('applicationController').connectOutlet('submit');
        if( navigator.onLine ){
        //internet connection
          App.SurveyData.storerecord();
          App.SurveyData.pushrecords();
        } else {
          //no internet dconnection
          App.SurveyData.storerecord();
        }
      }
    })
  })
});

Ember.LOG_BINDINGS=true;

$(document).ready(function() {
  App.initialize();
});

window.addEventListener('online',function(evt) { App.SurveyData.pushrecords();});
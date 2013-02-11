nextStep = 1;

subViews = new Array();
content_types_obj = Ember.ArrayProxy.create({content: content_types});

App = Ember.Application.createWithMixins({    // When ember updates we will need to use createWithMixins
    rootElement: '#surveyContainer',
    autoinit: false,
    nextStep: 1,
    button: true
}, Em.Facebook);

App.Store = DS.Store.extend({
  revision: 11
});

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

/*
//Make the required controllers and views
App.surveyViews = [];
App.surveyControllers = [];
$.each(survey_contents, function(i, content) {
  content_type = content_types_obj.get('content').findProperty('id', content.content_type_id);
  for(j = 0; j < content_type.data_count; j++) {
    Ember.get('App.SurveyData').pushObject("");
  }
  App.surveyView = Ember.View.extend
  ({
    id: i,
    content_store: content_type,
    data: JSON.parse(content.data),
    templateName: content_type.name,
    classTest: 'test',
    didInsertElement: function() {
      $('#animate').slideDown();
      fx = eval(this.content_store.js).render;
      fx(this);
    }
  });

  App.surveyControllers[i] = Ember.Controller.extend({
    id: i,
    content_store: content_type,
    content: content,
    next: this.id+1,

    data: function() {
      fx = eval(this.content_store.js).data;
      return fx($.parseJSON(content.data));
    }.property(),

    enter: function() {
      fx = eval(this.content_store.js).enter;
      fx(this.readHelper, this.writeHelper, this.id, $.parseJSON(content.data), this);
    },

    exit: function() {
      $('#animate').slideUp();
      fx = eval(this.content_store.js).exit;
      fx(this.readHelper, this.writeHelper, this.id, $.parseJSON(content.data), this);
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
});

*/

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.ApplicationController = Ember.Controller.extend({
  test: 2
});

App.Router.map(function() {
  this.resource("content", { path: "/content/:id" });
});

App.Type = DS.Model.extend({
  js: DS.attr('string'),
  name: DS.attr('string'),
  contents: DS.hasMany('App.Content')
});

App.Content = DS.Model.extend({
  name: DS.attr('string'),
  content_store: DS.attr('string'),
  type: DS.belongsTo('App.Type')
});

App.ContentController = Ember.Controller.extend({
  type: null,
  content: null,
  data: function() {
    fx = eval(this.type.get('js')).data;
    return fx(this.content.get('data'));
  }.property(),

  enter: function() {
    fx = eval(this.type.get('js')).enter;
    fx(this.readHelper, this.writeHelper, this.content.get('id'), this.content.get('data'), this);
  },

  exit: function() {
    $('#animate').slideUp();
    fx = eval(this.type.get('js')).exit;
    fx(this.readHelper, this.writeHelper, this.content.get('id'), this.content.get('data'), this);
  },

  writeHelper: function(index, data) {
    App.SurveyData.content[index] = data;
  },

  readHelper: function(index) {
    return App.SurveyData.content[index];
  }
});

App.ContentView = Ember.View.extend
  ({
    type: null,
    data: null,
    classTest: 'test',
    didInsertElement: function() {
      $('#animate').slideDown();
      fx = eval(this.type.get('js')).render;
      fx(this);
    }
  });

App.ContentRoute = Ember.Route.extend({
  current_id:0,
  model: function(params) {
    this.current_id = params.id;
    return App.Content.find(params.id);
  },
  renderTemplate: function() {
    if (this.current_id!=0)
      this.render(App.Content.find(this.current_id).get('type').get('name'));
  },
  setupController: function(controller, content) {
    controller.set('content', content);
    controller.set('type', content.get('type'));
  }
});
/*
App.Router = Ember.Router.extend({
  enableLogging: true,
  root: Ember.Route.extend({

    incrementStep: function(router) {
      router.transitionTo('step', {step:App.nextStep});
    },

    backStep: function(router) {
      router.transitionTo('step', {step:App.nextStep-2});
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
          if(context.step*1 == App.surveyViews.length) {
            router.transitionTo('finish');
          }
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
        //router.get('applicationController').connectOutlet('submit');
        App.SurveyData.storerecord();
        if( navigator.onLine ) App.SurveyData.pushrecords();
      }
    })
  })
});
*/

Ember.LOG_BINDINGS=true;

$('html').bind('keypress', function(e)
{
   if(e.keyCode == 13)
   {
      return false;
   }
});

window.addEventListener('online', App.SurveyData.pushrecords );

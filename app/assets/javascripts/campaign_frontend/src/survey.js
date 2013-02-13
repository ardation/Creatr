nextStep = 1;

content_types_obj = Ember.ArrayProxy.create({content: content_types});

App = Ember.Application.createWithMixins({    // When ember updates we will need to use createWithMixins
    rootElement: '#surveyContainer',
    autoinit: false,
    nextStep: 1,
    button: true,
    back_button: false,
    reset_button: false,
    foward_button: true
}, Em.Facebook);

App.Store = DS.Store.extend({
  revision: 11
});

App.setProperties({
    appId: 367941839912657
});

App._contents = Ember.ArrayProxy.create({content: Ember.A(survey_contents)});
App._types = Ember.ArrayProxy.create({content: Ember.A(content_types)});
SurveyLength = App._contents.get('length');

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
    this.pushrecords();
  },
  pushrecords: function() {
    var records = amplify.store('records');
    _.each(records, function(value) {
      console.log(value)
      $.post('upload', {data: value} , 'json')
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

for(i = 0; i<survey_contents.length; i++) {
  content_type = content_types_obj.get('content').findProperty('id', survey_contents[i].content_type_id);
  for(j = 0; j < content_type.data_count; j++) {
    Ember.get('App.SurveyData').pushObject("");
  }
}

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.ApplicationController = Ember.Controller.extend({
  test: 2
});

App.Router.map(function() {
  this.resource("content", { path: "/content/:id" });
});


App.ContentController = Ember.Controller.extend({
  _content: null,
  type: null,
  answer: "Reuben is the answer",
  data: function() {
    dat = this._content.data
    if (dat == undefined) {
      return null;
    } else {
      if(typeof dat != "object")
        this.set('_content.data', JSON.parse(dat));
      fx = eval(this.type.js).data;
      return fx(this._content.data);
    }
  }.property('this._content.data'),

  enter: function() {
    console.log(this._content);
    $('#surveyContainer').delay(500).fadeIn();

    fx = eval(this.type.js).enter;
    fx(this.readHelper, this.writeHelper, this._content.position - 1, this._content.data, this);
  },

  exit: function() {
    if(this.type != null) {
      fx = eval(this.type.js).exit;
      if (this._content.data != null)
        fx(this.readHelper, this.writeHelper, this._content.position - 1, this._content.data, this);
    }
  },

  writeHelper: function(index, data) {
    App.SurveyData.content[index] = data;
  },

  readHelper: function(index) {
    return App.SurveyData.content[index];
  },
  _propertySet: function(name, data) {
    this.set(name, data);
  },
});

App.ContentView = Ember.View.extend
  ({
    type: null,
    data: null,
    classTest: 'test'
  });

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('content', 1);
  }
});

App.ContentRoute = Ember.Route.extend({
  current_id:0,
  name: null,
  type: null,
  _content: null,
  events: {
    incrementStep: function() {
      var context = this;
      $('#surveyContainer').fadeOut(500);
      $('body').toggleClass('alt');
      setTimeout(function() {context.transitionTo('content', context.current_id*1+1)}, 500);
    },

    resetStep: function() {
      var context = this;
      $('#surveyContainer').fadeOut(500);
      $('body').toggleClass('alt');
      setTimeout(function() {context.transitionTo('content', 1)}, 500);
    },
    backStep: function() {
      this.transitionTo('content', this.current_id*1-1);
    }
  },
  model: function(params) {
    this.set('current_id', params.id);
    return this.current_id;
  },
  serialize: function(id) {
    this.set('current_id', id);
    return { id: id };
  },
  renderTemplate: function() {
    if (App._contents.get('length') == this.current_id) {
      App.set('reset_button', true)
      App.set('forward_button', false)
    } else {
      App.set('reset_button', false)
      App.set('forward_button', true)
    }
    if (this.current_id == 1 || App._contents.get('length') == this.current_id)
      App.set('back_button', false)
    else
      App.set('back_button', true)

    this.render(this.name);
    var _this = this;
    Ember.run.next(function(){
      fx = eval(_this.type.js).render;
      fx(_this, _this._content.data, _this._content.position);
    });

  },
  setupController: function(controller, model) {

    //simulate exit for now
    obj =  App._contents.findProperty('position', this.current_id*1);
    controller.exit();
    type_id = obj.content_type_id;
    type_obj = App._types.findProperty('id', type_id);
    this.name = type_obj.name;
    this.set('_content', obj);
    controller.set('_content', obj);
    controller.set('type', type_obj);
    this.set('type', type_obj);
    controller.enter();
    if(this.current_id*1 == SurveyLength) {
      console.log('trying to upload data');
      App.SurveyData.storerecord();
    }
    console.log('final');
  }
});


Ember.LOG_BINDINGS=true;

$('html').bind('keypress', function(e)
{
   if(e.keyCode == 13)
   {
      return false;
   }
});

window.addEventListener('online', App.SurveyData.pushrecords );

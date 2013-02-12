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

App._contents = Ember.ArrayProxy.create({content: Ember.A(survey_contents)});
App._types = Ember.ArrayProxy.create({content: Ember.A(content_types)});

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
    dat = this.get('_content.data')
    if (dat == undefined) {
      return null;
    } else {
      this.set('_content.data', JSON.parse(dat));
      fx = eval(this.type.js).data;
      return fx(this._content.data);
    }
  }.property('this._content.data'),

  enter: function() {
    $('#animate').slideDown();

    fx = eval(this.type.js).enter;
    fx(this.readHelper, this.writeHelper, this._content.position - 1, this._content.data, this);
  },

  exit: function() {
    $('#animate').slideUp();
    if(this.type != null) {
      fx = eval(this.type.js).exit;
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
  }
});

App.ContentView = Ember.View.extend
  ({
    type: null,
    data: null,
    classTest: 'test',
    didInsertElement: function() {
      console.log('did insert element!!!')
    },
    afterRender: function() {
      alert('rendered');
    }
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
      this.transitionTo('content', this.current_id*1+1);
    },
    backStep: function() {
      this.transitionTo('content', this.current_id*1-1);
    }
  },
  model: function(params) {
    console.log(params.id)
    this.current_id = params.id;
    return this.current_id;
  },
  serialize: function(id) {
    this.current_id = id;
    return { id: id };
  },
  renderTemplate: function() {
    console.log('all the time')
    this.render(this.name);
    var _this = this;
    fx = eval(_this.type.js).render;
    fx(_this, _this._content.data, _this._content.position);
    
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
    if(this.current_id*1 == survey_contents.length) {
      console.log('trying to upload data');
      App.SurveyData.storerecord();
    }
  },
  activate: function() {
    console.log("we're in bro");
  },
  deactivate: function () {
    console.log('Outies');
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

nextStep = 1;

content_types_obj = Ember.ArrayProxy.create({content: content_types});

if (amplify.store('current_content') == undefined) {
  amplify.store('current_content', 1);
}

if (amplify.store('response') == undefined) {
  amplify.store('response', {});
}

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
    data = amplify.store('response');
    if (data != {})
      records.push(data);
    amplify.store('records', records);
    amplify.store('response', {});
    this.pushrecords();
  },
  pushrecords: function() {
    var records = amplify.store('records');
    _.each(records, function(value) {
      if (_.size(value) != 0) {
        var person = {};
        var answers_attributes = [];
        $.each( value, function( key, data ) {
          if(parseInt(key) == key) {
            //content
            if (typeof data == 'object')
              data = JSON.stringify(data);
            answers_attributes.push({content_id: parseInt(key), data: data});
          } else {
            //attribute
            person[key] = data;
          }
        });

        person['answers_attributes'] = answers_attributes;
        $.post('/endpoint.json', {person: person} , 'json')
        .success(function() {
          amplify.store('records', _.without(records, value));
        })
        .error(function(data) {
          // if(data.responseText == '"Phone Number already exists in the system."') {
          //   amplify.store('records', _.without(records, value));
          // }
        });
      }
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
  data: function() {
    if (this._content.content_type_id != this.type.id)
      this.set('type', App._types.findProperty('id', this._content.content_type_id));

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
    $('#surveyContainer').delay(500).fadeIn();

    fx = eval(this.type.js).enter;
    fx(this.readHelper, this.writeHelper, this._content.id, this._content.data, this);
  },

  exit: function() {
    if(this.type != null) {
      fx = eval(this.type.js).exit;
      //if(verify(this))
      return fx(this.readHelper, this.writeHelper, this._content.id, this._content.data, this);
      return false;
    }
  },

  writeHelper: function(index, data) {
    var writer = amplify.store('response');
    writer[index] = data;
    amplify.store('response', writer);
  },

  readHelper: function(index) {
    var reader = amplify.store('response');
    return reader[index];
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
  _controller: null,
  events: {
    incrementStep: function() {
      var context = this;
      if($('input:visible').filter(function() { return $(this).val() == ""; }).length > 0) {
        //input type text
        $('#error').fadeIn();
      } else if (!$('input:visible[type=radio]').is(':checked') && $('input:visible[type=radio]').length > 0) {
        //input type radio
        $('#error').fadeIn();
      } else if(this._controller.exit() != false) {
        $('#error').fadeOut();
        $('#surveyContainer').fadeOut(300);
        amplify.store('current_content', this.current_id*1+1);
        setTimeout(function() {context.transitionTo('content', context.current_id*1+1)}, 300);
      } else {
        $('#error').fadeIn();
      }
    },
    resetStep: function() {
      if ( amplify.store('current_content') != 1 ) {
        var context = this;
        this._controller.exit();
        $('#surveyContainer').fadeOut(300);
        amplify.store('current_content', 1);
        amplify.store('response', {});
        setTimeout(function() {context.transitionTo('content', 1)}, 300);
      }
    },
    backStep: function() {
      var context = this;
      $('#surveyContainer').fadeOut(300);
      amplify.store('current_content', this.current_id*1-1);
      setTimeout(function() {context.transitionTo('content', context.current_id*1-1)}, 300);
    },
    skipFacebook: function() {
      var context = this;
      $('#surveyContainer').fadeOut(300);
      amplify.store('current_content', 3);
      App.set('button', true);
      setTimeout(function() {context.transitionTo('content', 3)}, 300);
    }
  },
  model: function(params) {
    var router = this;
    Ember.run.next(function() {
      if (amplify.store('current_content') != router.current_id) {
        router.transitionTo('content', amplify.store('current_content'));
      }
    });

    this.set('current_id', params.id);
    return this.current_id;
  },
  serialize: function(id) {
    this.set('current_id', id);
    return { id: id };
  },
  renderTemplate: function() {
    if (App._contents.get('length') == this.current_id) {
      App.set('reset_button', true);
      App.set('forward_button', false);
    } else {
      App.set('reset_button', false);
      App.set('forward_button', true);
    }
    if (this.current_id <= 2 || App._contents.get('length') == this.current_id)
      App.set('back_button', false);
    else
      App.set('back_button', true);

    this.render(this.name);
    var _this = this;
    Ember.run.next(function(){
      fx = eval(_this.type.js).render;
      fx(_this, _this._content.data, _this._content.position);
    });
  },
  setupController: function(controller, model) {
    this._controller = controller;
    if(this.current_id*1 == 2 && !navigator.onLine) { //facebook step but no connectivity
      amplify.store('current_content', 3);  //skip step
      this.transitionTo('content', 3);
    }
    //simulate exit for now
    obj =  App._contents.findProperty('position', this.current_id*1);
    type_id = obj.content_type_id;
    type_obj = App._types.findProperty('id', type_id);
    this.name = type_obj.name;
    this.set('_content', obj);
    controller.set('_content', obj);
    controller.set('type', type_obj);
    this.set('type', type_obj);
    controller.enter();
    if(this.current_id*1 == SurveyLength) {
      App.SurveyData.storerecord();
    }
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
App.SurveyData.pushrecords();
window.addEventListener('online', App.SurveyData.pushrecords );

// function verify(context) {
//   if(context.answer == "" || context.answer == null) {
//     App.set('Error', 'Enter what you\'d like to see happen in your life!');
//     return false;
//   }
//   return true;
// }


// function verify(context) {
//   if(typeof $('input:radio[name=rdGroup]:checked').val() == "undefined") {
//     App.set('Error', 'Tell us where you\'re at on your journey!');
//     return false;
//   }
//   return true;
// }

// function verify(context) {
//   if(typeof $('input:radio[name=rdGroup]:checked').val() == "undefined") {
//     App.set('Error', 'How interested are you in finding out about this Jesus guy?');
//     return false;
//   }
//   return true;
// }


// function verify(context) {
//   if(context.first_name == "" || context.first_name == null) {
//     App.set('Error', 'You haven\'t forgotten your own name, have you?');
//     return false;
//   }
//   if(context.last_name == "" || context.last_name == null) {
//     App.set('Error', 'Last names are important too...');
//     return false;
//   }

//   if(context.mobile == "" || context.mobile == null) {
//     App.set('Error', 'If we don\'t have your cellphone number, we can\'t send you a code for your new shades!');
//     return false;
//   }

//   if(typeof $('input:radio[name=gender]:checked').val() == "undefined") {
//     App.set('Error', 'Knowing your gender makes it less awkward for both of us...');
//     return false;
//   }

//   if(context.degree == "" || context.degree == null) {
//     App.set('Error', 'What are you studying here?');
//     return false;
//   }

//   if(context.hall  == "" || context.hall == null) {
//     App.set('Error', 'If we know where you\'re staying we can hook you up with sweet events and people!');
//     return false;
//   }

//   if(typeof $('input:radio[name=year]:checked').val() == "undefined") {
//     App.set('Error', 'What year are you?');
//     return false;
//   }
//   return true;
// }

//routerHack = null;

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
    foward_button: true,
    skip_button: false,
    firstStage: true,
    stage: 1,
    init: function() {
      this._super();
      this.set('stage', amplify.store('current_content'));
    },
    stageDidChange: function(element, property, value) {
      amplify.store('current_content', this.get('stage'));
      if (this.get('stage') == 1)
        this.set('firstStage', true)
      else
        this.set('firstStage', false)

      if (typeof survey_contents[this.get('stage')-1] != "undefined" && survey_contents[this.get('stage')-1].name == "Facebook")
        this.set('skip_button', true)
      else
        this.set('skip_button', false)

    }.observes('stage'),
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
function radio_validate() {
  var names = [];
  $('input:visible[type=radio]').each(function() {
    if( $.inArray( $(this).attr('name'), names ) == -1 )
      names.push( $(this).attr('name') );
  });
  if (names == [])
    return false;
  else {
    var returnable = false;
    $.each(names, function(index, value) {
      if ( !$('input:visible[name='+value+']').is(':checked') ) {
        returnable = true;
        return;
      }
    });
    return returnable;
  }
}
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
        $('#error').slideDown(200);
      } else if (radio_validate() ) {
        //input type radio
        $('#error').slideDown(200);
      } else if(this._controller.exit() != false) {
        if(context.current_id*1 == 1) {
          App.set('FBUser',false);
          if(FB) {
            FB.getLoginStatus(function(response) {
              if(response.status == 'connected') {
                console.log('trying to logout');
                FB.logout();
                App.set('button', false);
                App.set('FBUser', false);
              }
            });
          }
          else {
            alert('test');
          }
        }
        $('#error').slideUp(200);
        $('#surveyContainer').fadeOut(300);
        setTimeout(function() {
          App.set('stage', context.current_id*1+1);
          context.transitionTo('content', context.current_id*1+1);
        }, 300);
      } else {
        $('#error').slideDown();
      }
    },
    resetStep: function() {
      App.set('button', true);
      if ( App.get('stage') != 1 ) {
        var context = this;
        this._controller.exit();
        $('#surveyContainer').fadeOut(300);
        amplify.store('response', {});
        setTimeout(function() {
          App.set('stage', 1);
          context.transitionTo('content', 1);
        }, 300);
      }
    },
    backStep: function() {
      $('#error').slideUp(200);
      var context = this;
      $('#surveyContainer').fadeOut(300);
      setTimeout(function() {App.set('stage', context.current_id*1-1); context.transitionTo('content', context.current_id*1-1)}, 300);
    },
    skipFacebook: function() {
      var context = this;
      $('#surveyContainer').fadeOut(300);
      setTimeout(function() {
        App.set('button', true);
        App.set('stage', App.get('stage') + 1);
        context.transitionTo('content', App.get('stage'));
      }, 300);
    }
  },
  model: function(params) {
    var router = this;
    Ember.run.next(function() {
      if (App.get('stage') != router.current_id) {
        router.transitionTo('content', App.get('stage'));
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
    //window['routerHack'] = this;
    this._controller = controller;
    if(this.current_id*1 == 2 && !navigator.onLine) { //facebook step but no connectivity
      App.set('stage', 3);  //skip step
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

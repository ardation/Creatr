//Testing this out!

App = Ember.Application.create({
  rootElement: '#emberContainer'
});

App.SurveyContent = Ember.Object.extend({
  name: null,
  content_type: null,
  content_pos: null,
  hash: Em.A([])
});

App.Surveys = Ember.Object.create({
  name: null,
  start: $.datepicker.formatDate('mm/dd/yy' , new Date()),
  end: $.datepicker.formatDate('mm/dd/yy' , new Date()),
  themeID: 0,
  contents: Ember.A([App.SurveyContent.create()])     //Pushing a copy of App.SurveyContent onto this
});

App.CRMData = Ember.Object.extend();

App.CRMData.reopenClass ({
  crm_data: [],
  org_data: [],
  org_display_data: [],

  loadData: function() {
    context = this;
    context.crm_data = [];
    $.getJSON ("ajax/crm_data", function(data) {
      data.forEach(function(crm) {
        context.crm_data.pushObject(App.CRMData.create({id: crm.crm_id, name: crm.crm_name}));
        crm.orgs.forEach(function(org) {
          context.org_data.pushObject(App.CRMData.create({id: org.org_id, name: org.org_name, crm_id: crm.crm_id}));
        }, context)
      }, context)
      context.updateOrganisations(5);
    }); 
    return this.crm_data;
  },
  updateOrganisations: function(crm_id) {
    context = this;
    this.org_display_data.clear();
    console.log("clearing the buffer")
    console.log(this.org_display_data)
    context.org_data.forEach(function(org) {
      if(org.crm_id == crm_id) {
        context.org_display_data.pushObject(App.CRMData.create({id: org.id, name: org.name}));
      }
    }, context)
  }
});

App.DateField = Ember.TextField.extend({
  attributeBindings: ['id', 'class']
});

App.CRMSelect = Ember.Select.extend({
  attributeBindings: ['id'],
  change: function(evt) {
    console.log(evt)
    App.CRMData.updateOrganisations($('#crm').val())
  }
});

App.ApplicationController = Ember.Controller.extend();

App.Step1Controller = Ember.ArrayController.extend({});

App.Step2Controller = Ember.ArrayController.extend({});

App.Step2Controller = Ember.ArrayController.extend({});

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.Step0View = Ember.View.extend ({
  templateName: 'templates/step0'
});

App.Step1View = Ember.View.extend ({
  templateName: 'templates/step1'
});

App.Step2View = Ember.View.extend ({
  templateName: 'templates/step2',
  didInsertElement: function() {
    $( ".jquery-ui-datepicker" ).datepicker();
  }
});

App.Step3View = Ember.View.extend ({
  templateName: 'templates/step3',
});



App.Router = Em.Router.extend ({
  enableLogging: true,

  root: Em.Route.extend ({
    showstep1: Ember.Route.transitionTo('step1'),
    showstep2: Ember.Route.transitionTo('step2'),
    showstep3: Ember.Route.transitionTo('step3'),

    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router){
        router.get('applicationController').connectOutlet( 'step0');
      }      
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
        router.get('applicationController').connectOutlet('step2')
      },
    }),

    step3: Ember.Route.extend ({
      route: 'step3',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('step3')
      },
    })
  })
});


Ember.LOG_BINDINGS=true;

App.LOG_BINDINGS = true;
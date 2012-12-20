//Testing this out
content_id_counter = 0;
test = "hey";
App = Ember.Application.create({
  rootElement: '#emberContainer',
  test: "hey"
});

App.SurveyContent = Ember.Object.extend({
  init: function(pos) {
    this._super();
    this.set('id', 'content'+content_id_counter);
    this.set('idhref', '#content'+content_id_counter);
    this.set('id2', 'outer_content'+content_id_counter);
    this.set('position', content_id_counter + 1);
    content_id_counter++;
    this.set('hash', Ember.Object.create());
  },
  name: "",
  content_type_id: 2,

  content_hash: function() {
    test = App.ContentTypes.content.findProperty('id', this.content_type_id).validator;
    return JSON.parse(test);
  }.property('content_type_id').volatile(),

  delete: function(event) {
    if(App.Surveys.contents.length > 1)
      App.Surveys.contents.removeObject(this);
      App.Surveys.updatePositions();
  },
  findIndex: function() {
    order = $('#accordion').sortable("toArray");
    i = 0;
    while(i < order.length) {
      if(order[i].indexOf("outer_content") == -1)
        order.removeAt(i);
      else
        i++;
    }
    console.log(order);
    return order.indexOf(this.id);
  }
});


App.Surveys = Ember.Object.create({
  name: null,
  start: $.datepicker.formatDate('mm/dd/yy' , new Date()),
  end: $.datepicker.formatDate('mm/dd/yy' , new Date()),
  themeID: 0,
  cname_alias: "",
  sms_template: "",
  contents: [App.SurveyContent.create()],    //Pushing an instance of App.SurveyContent onto this
  contentsNameObserver: function() {
    context = this;
    if(this.get('contents.lastObject').name) {
      context.contents.pushObject(App.SurveyContent.create());
    }
  }.observes("contents.lastObject.name"),
  updatePositions: function() {
    elements = $('.sortable_').sortable('toArray');
    for(i = 0; i<elements.length; i++) {
      element = $('#'+elements[i]);
      e_id = element.children()[0].id;
      obj = this.contents.findProperty('id2', e_id);
      obj.set('position', i+1);
    };
  },
  uploadModel: function() {
    data = {campaign: {name: this.name, start_date: this.start, finish_date: this.end, theme_id: this.themeID, contents_attributes: this.jsonContents()}};//this.jsonContents()
    $.post('/dashboard/campaigns.json',  data);
  },
  jsonContents: function() {
    json = [];
    this.contents.forEach(function(content) {
      if(content.name != "")
        json.push({name: content.name, content_type_id: content.content_type_id, position: content.position, data: JSON.parse(JSON.stringify(content.hash))});
    });
    return json;
  }

});


App.ContentTypes = Ember.ArrayProxy.create({
  content: [],
  loadData: function() {
    context = this;
    $.getJSON ("content_types", function(data) {
      data.forEach(function(content_type) {
        context.content.push(Ember.Object.create(content_type));
      });
    });
  }
});
App.ContentTypes.loadData();

App.ViewTypeConvention = Ember.Mixin.create({
  viewType: function() {
    return Em.get("Ember.TextField");
  }.property().cacheable()
});


App.CRMData = Ember.Object.extend();

App.CRMData.reopenClass ({
  crm_data: [],
  org_data: [],
  org_display_data: [],

  loadData: function() {
    context = this;
    context.crm_data = [];
    $.getJSON ("crm_data.json", function(data) {
      data.crms.forEach(function(crm) {
        context.crm_data.pushObject(App.CRMData.create({id: crm.id, name: crm.name}));
        crm.orgs.forEach(function(org) {
          context.org_data.pushObject(App.CRMData.create({id: org.id, name: org.name, crm_id: crm.id}));
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

App.HackExtreme = Ember.TextField.extend({
  init: function() {
    this._super();
    saveObject = this.get('parentView').get('content');
    name = this.get('templateData').view.content.name;
    ext = new Object();
    ext[name] = "";

    if(typeof saveObject.hash[name] =='undefined')
      $.extend(saveObject.hash, ext);

    this.set('obj_path', 'hash.'+name);
    this.set('obj', saveObject);
    this.set('val', this.obj.get(this.obj_path));
  },
  valueBinding: "val",
  val: "",
  valObserver: function() {
    test = this.obj;
    this.obj.set(this.obj_path, this.val);
  }.observes('val')



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

App.Step3Controller = Ember.ArrayController.extend({});

App.Step4Controller = Ember.ArrayController.extend({});
App.Step5Controller = Ember.ArrayController.extend({});
App.Step6Controller = Ember.ArrayController.extend({});

App.ApplicationView = Ember.View.extend({
  templateName: 'app'
});

App.Step0View = Ember.View.extend ({
  templateName: 'step0'
});

App.Step1View = Ember.View.extend ({
  templateName: 'step1'
});

App.Step2View = Ember.View.extend ({
  templateName: 'step2',
  didInsertElement: function() {
    $( ".jquery-ui-datepicker" ).datepicker();
  }
});

App.Step3View = Ember.View.extend ({
  templateName: 'step3',
});

App.Step4View = Ember.View.extend ({
  templateName: 'step4',
  didInsertElement: function() {
    templateFire();
  }
});

App.Step5View = Ember.View.extend ({
  templateName: 'step5',
});
App.Step6View = Ember.View.extend ({
  templateName: 'step6',
});


App.JQuerySortableView = Ember.CollectionView.extend( {
  classNames: ['sortable_'],
  contentBinding: 'App.Surveys.contents',
  itemViewClass: 'App.JQuerySortableItemView',
  didInsertElement: function() {
    this._super();
    this.$().sortable({
      axis: "y",
      update: function(event, ui) {
        App.Surveys.updatePositions();
      }
    }).disableSelection();
  }
});

App.JQuerySortableItemView = Ember.View.extend({
  templateName: 'jquery-sortable-item'
});


App.Router = Em.Router.extend ({
  enableLogging: true,

  root: Em.Route.extend ({
    showstep0: Ember.Route.transitionTo('index'),
    showstep1: Ember.Route.transitionTo('step1'),
    showstep2: Ember.Route.transitionTo('step2'),
    showstep3: Ember.Route.transitionTo('step3'),
    showstep4: Ember.Route.transitionTo('step4'),
    showstep5: Ember.Route.transitionTo('step5'),
    showstep6: Ember.Route.transitionTo('step6'),

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
    }),
    step4: Ember.Route.extend ({
      route: 'step4',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('step4')
      },
    }),
    step5: Ember.Route.extend ({
    route: 'step5',
    connectOutlets: function(router) {
      router.get('applicationController').connectOutlet('step5')
    },
    }),

    step6: Ember.Route.extend ({
    route: 'step6',
    connectOutlets: function(router) {
      router.get('applicationController').connectOutlet('step6')
    },
    })
  })
});

function selectThisTheme(id) {
  App.Surveys.set('themeID', id);
}

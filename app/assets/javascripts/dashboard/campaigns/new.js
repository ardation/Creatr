var CampaignsNew = new function() {
  var self = this;

  self.init = function() {
    Ember.TEMPLATES["application"] = Ember.TEMPLATES["dashboard/templates/application"]
    // code which may call other functions in self

    //Testing this out
    content_id_counter = 0;
    window.App = Ember.Application.create({
      rootElement: '#emberContainer'
    });

    App.NavItem = Em.Object.extend({
      displayText: '',
      routePath: '',
      routeName: '',
      icon: ''
    });

    App.ApplicationView = Em.View.extend({
      templateName: 'application',
      NavbarView: Em.View.extend({
        init: function() {
          this._super();
          this.set('controller', this.get('parentView.controller').controllerFor('navbar'))
        },
        selectedRouteName: window.location.hash,
        gotoRoute: function(e) {
          this.set('selectedRouteName', e.routeName);
          this.get('controller.target.router').transitionTo(e.routePath);
        },
        templateName: 'dashboard/templates/navbar',
        MenuItemView: Em.View.extend({
          templateName:'dashboard/templates/menu-item',
          tagName: 'li',
          classNameBindings: 'IsActive:active'.w(),
          IsActive: function() {
            return this.get('item.routeName') === this.get('parentView.selectedRouteName');
          }.property('item', 'parentView.selectedRouteName')
        })
      })
    });

    App.NavbarController = Em.ArrayController.extend({
      content: [],
      init: function() {
        var content = [
        App.NavItem.create({
          displayText: 'Get Started',
          routePath: 'start',
          routeName: 'start',
          icon: 'icon-bolt'
        }),
        App.NavItem.create({
          displayText: 'Data Point',
          routePath: 'step1',
          routeName: 'step1',
          icon: 'icon-filter'
        }),
        App.NavItem.create({
          displayText: 'Campaign Dates',
          routePath: 'step2',
          routeName: 'step2',
          icon: 'icon-calendar'
        }),
        App.NavItem.create({
          displayText: 'Create Content',
          routePath: 'step3',
          routeName: 'step3',
          icon: 'icon-file'
        }),
        App.NavItem.create({
          displayText: 'Theme Selection',
          routePath: 'step4',
          routeName: 'step4',
          icon: 'icon-gift'
        }),
        App.NavItem.create({
          displayText: 'Addons',
          routePath: 'step5',
          routeName: 'step5',
          icon: 'icon-plus'
        }),
        App.NavItem.create({
          displayText: 'Advanced',
          routePath: 'step6',
          routeName: 'step6',
          icon: 'icon-wrench'
        }),
        App.NavItem.create({
          displayText: 'Create',
          routePath: 'create',
          routeName: 'create',
          icon: 'icon-check'
        })
        ]
        this.set('content', content);
      }
    });
    App.StartRoute = Em.Route.extend({
      enter: function() {
        console.log('start route');
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step0');
      }
    });

    App.Step1Route = Em.Route.extend({
      events: {
        showstep2: function() {
          this.transitionTo('step2');
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step1');
      }
    });

    App.Step2Route = Em.Route.extend({
      events: {
        showstep3: function() {
          this.transitionTo('step3');
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step2');
      }
    });

    App.Step3Route = Em.Route.extend({
      events: {
        showstep4: function() {
          this.transitionTo('step4');
        },
        addContent: function() {
          App.Surveys.contents.pushObject(App.SurveyContent.create());
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step3');
      }
    });

    App.Step4Route = Em.Route.extend({
      events: {
        showstep5: function() {
          this.transitionTo('step5');
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step4');
      }
    });

    App.Step5Route = Em.Route.extend({
      events: {
        showstep6: function() {
          this.transitionTo('step6');
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step5');
      }
    });

    App.Step6Route = Em.Route.extend({
      events: {
        createCampaign: function() {
          this.transitionTo('create');
        }
      },
      renderTemplate: function() {
        this.render('dashboard/templates/step6');
      }
    });

    App.CreateRoute = Em.Route.extend({
      enter: function() {
        App.Surveys.uploadModel();
      },
      renderTemplate: function() {
        this.render('dashboard/templates/create');
      }
    });

    App.IndexRoute = Em.Route.extend({
      enter: function() {
        console.log('index route');
      },
      redirect: function() {
        this.transitionTo('start');
      }
    });

    App.Router.map(function() {
      this.route("start");
      this.route("step1");
      this.route("step2");
      this.route("step3");
      this.route("step4");
      this.route("step5");
      this.route("step6");
      this.route("create");
    });

    App.ContentTypes = Ember.ArrayProxy.create({
      content: [],
      loadData: function() {
        context = this;
        content_types.forEach(function(content_type) {
          context.content.push(Ember.Object.create(content_type));
        });
      }
    });
    App.ContentTypes.loadData();

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
        var content = App.ContentTypes.content.findProperty('id', this.content_type_id);
        return JSON.parse(content.validator);
      }.property('content_type_id'),

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
        return order.indexOf(this.id);
      }
    });


    App.Surveys = Ember.Object.create({
      name: null,
      short_name: null,
      start: $.datepicker.formatDate('mm/dd/yy' , new Date()),
      end: $.datepicker.formatDate('mm/dd/yy' , new Date()),
      themeID: 3,
      org_id: 1,
      crm_id: 1,
      cname_alias: "",
      sms_template: "",
      contents: [App.SurveyContent.create()],    //Pushing an instance of App.SurveyContent onto this
      createResponse: "Please wait",
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
        data = {campaign: {name: this.name, short_name: this.short_name, start_date: this.start, finish_date: this.end, organisation_id: this.org_id, theme_id: this.themeID, cname_alias: this.cname_alias, sms_template: this.sms_template, contents_attributes: this.jsonContents()}}
        $.post('/dashboard/campaigns.json',  data, function(data) {

        }).fail(function(error, text) {
          App.Surveys.set('createResponse', error.responseText);
        });
      },
      jsonContents: function() {
        json = [];
        this.contents.forEach(function(content) {
          if(content.name != "") {
            hash = content.get('content_hash');
            for (var key in content.hash) {
              if (content.hash.hasOwnProperty(key)) {
                if(hash.findProperty('name', key) == undefined )
                  delete content.hash[key]
              }
            }
            json.push({name: content.name, content_type_id: content.content_type_id, position: content.position, data: JSON.parse(JSON.stringify(content.hash))});
          }
        });
        return json;
      }
    });

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
        $.getJSON ("/dashboard/campaigns/crm_data.json", function(data) {
          data.crms.forEach(function(crm) {
            context.crm_data.pushObject(App.CRMData.create({id: crm.id, name: crm.name}));
            crm.orgs.forEach(function(org) {
              context.org_data.pushObject(App.CRMData.create({id: org.id, name: org.name, crm_id: crm.id}));
            }, context)
          }, context)
          context.updateOrganisations(context.crm_data[0].id);
          App.Surveys.set('crm_id', context.crm_data[0].id);
        });
        return this.crm_data;
      },
      updateOrganisations: function(crm_id) {
        context = this;
        this.org_display_data.clear();
        context.org_data.forEach(function(org) {
          if(org.crm_id == crm_id) {
            context.org_display_data.pushObject(App.CRMData.create({id: org.id, name: org.name}));
          }
        }, context);
        App.Surveys.set('org_id', context.org_display_data[0].id);
      }
    });

    App.CRMData.loadData();

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
      templateName: 'dashboard/templates/jquery-sortable-item'
    });

    App.Step2View = Ember.View.extend ({
      didInsertElement: function() {
        $( ".jquery-ui-datepicker" ).datepicker();
      }
    });

    App.Step4View = Ember.View.extend ({
      didInsertElement: function() {
        templateFire();
      }
    });

    window.selectThisTheme = function(id) {
      App.Surveys.set('themeID', id);
      App.get('controller.target.router').transitionTo('step5');
    }
  };
};

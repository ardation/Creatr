# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

window.App = Ember.Application.create ({
	rootElement: '#emberContainer'
	autoinit: false
	ApplicationController: Ember.Controller.extend()
	ApplicationView: Ember.View.extend
		templateName: 'app'

	Step1View: Ember.View.extend
		templateName: 'templates/step1'

	StepController: Ember.Controller.extend()

	Router: Em.Router.extend
		enableLogging: true
		location: 'hash'

		root: Em.Route.extend
			index: Ember.Route.extend
				route: '/'


			step1: Ember.Route.extend
				route: 'step1'
				connectOutlets: (router) ->
					router.get('applicationController').connectOutlet('step1')

})

$ ->
  App.initialize()

# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

	App = Ember.Application.create()

	App.ApplicationController = Ember.Controller.extend()
	App.ApplicationView = Ember.View.extend
		templateName: 'templates/application'

	App.

	App.Router = Em.Router.extend
		enableLogging: true
		location: 'hash'

		root: Em.Route.extend
			index: Ember.Route.extend
				route: '/'
				

			step1: Ember.Route.extend
				route: 'step1'
				#connectOutlets: (router) ->
			#		router.get('applicationController').connectOutlet('application', App.Data.showString)


	App.Data = Ember.Object.extend()

	App.Data.reopenClass 
		showString: ->
			"Sup bro?"

	window.App = App;


	# Finally, initialize our glorious Ember application:
	App.initialize()


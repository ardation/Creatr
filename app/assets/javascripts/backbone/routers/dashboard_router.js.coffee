class FlamingWight.Routers.DashboardRouter extends Backbone.Router
  initialize: (options) ->

  routes:
    ".*": "index"

  index: ->
    @view = new FlamingWight.Views.Dashboard.IndexView()
    $("#dashboard").html(@view.render().el)


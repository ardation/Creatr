class FlamingWight.Routers.SurveysRouter extends Backbone.Router
  initialize: (options) ->
    @surveys = new FlamingWight.Collections.SurveysCollection()
    @surveys.reset options.surveys

  routes:
    "/new"      : "newSurveys"
    "/index"    : "index"
    "/:id/edit" : "edit"
    "/:id"      : "show"
    ".*"        : "index"

  newSurveys: ->
    @view = new FlamingWight.Views.Surveys.NewView(collection: @surveys)
    $("#surveys").html(@view.render().el)

  index: ->
    @view = new FlamingWight.Views.Surveys.IndexView(surveys: @surveys)
    $("#surveys").html(@view.render().el)

  show: (id) ->
    surveys = @surveys.get(id)

    @view = new FlamingWight.Views.Surveys.ShowView(model: surveys)
    $("#surveys").html(@view.render().el)

  edit: (id) ->
    surveys = @surveys.get(id)

    @view = new FlamingWight.Views.Surveys.EditView(model: surveys)
    $("#surveys").html(@view.render().el)

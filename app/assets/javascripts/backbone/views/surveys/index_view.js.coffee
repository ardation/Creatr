FlamingWight.Views.Surveys ||= {}

class FlamingWight.Views.Surveys.IndexView extends Backbone.View
  template: JST["backbone/templates/surveys/index"]

  initialize: () ->
    @options.surveys.bind('reset', @addAll)

  addAll: () =>
    @options.surveys.each(@addOne)

  addOne: (surveys) =>
    view = new FlamingWight.Views.Surveys.SurveysView({model : surveys})
    @$("tbody").append(view.render().el)

  render: =>
    $(@el).html(@template(surveys: @options.surveys.toJSON() ))
    @addAll()

    return this

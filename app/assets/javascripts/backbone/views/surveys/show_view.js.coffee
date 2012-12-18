FlamingWight.Views.Surveys ||= {}

class FlamingWight.Views.Surveys.ShowView extends Backbone.View
  template: JST["backbone/templates/surveys/show"]

  render: ->
    $(@el).html(@template(@model.toJSON() ))
    return this

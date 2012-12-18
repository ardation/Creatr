FlamingWight.Views.Surveys ||= {}

class FlamingWight.Views.Surveys.SurveysView extends Backbone.View
  template: JST["backbone/templates/surveys/surveys"]

  events:
    "click .destroy" : "destroy"

  tagName: "tr"

  destroy: () ->
    @model.destroy()
    this.remove()

    return false

  render: ->
    $(@el).html(@template(@model.toJSON() ))
    return this

FlamingWight.Views.Surveys ||= {}

class FlamingWight.Views.Surveys.EditView extends Backbone.View
  template : JST["backbone/templates/surveys/edit"]

  events :
    "submit #edit-surveys" : "update"

  update : (e) ->
    e.preventDefault()
    e.stopPropagation()

    @model.save(null,
      success : (surveys) =>
        @model = surveys
        window.location.hash = "/#{@model.id}"
    )

  render : ->
    $(@el).html(@template(@model.toJSON() ))

    this.$("form").backboneLink(@model)

    return this

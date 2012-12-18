FlamingWight.Views.Surveys ||= {}

class FlamingWight.Views.Surveys.NewView extends Backbone.View
  template: JST["backbone/templates/surveys/new"]

  events:
    "submit #new-surveys": "save"

  constructor: (options) ->
    super(options)
    @model = new @collection.model()

    @model.bind("change:errors", () =>
      this.render()
    )

  save: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @model.unset("errors")

    @collection.create(@model.toJSON(),
      success: (surveys) =>
        @model = surveys
        window.location.hash = "/#{@model.id}"

      error: (surveys, jqXHR) =>
        @model.set({errors: $.parseJSON(jqXHR.responseText)})
    )

  render: ->
    $(@el).html(@template(@model.toJSON() ))

    this.$("form").backboneLink(@model)

    return this

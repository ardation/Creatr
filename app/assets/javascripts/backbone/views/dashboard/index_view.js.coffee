FlamingWight.Views.Dashboard ||= {}

class FlamingWight.Views.Dashboard.IndexView extends Backbone.View
  template: JST["backbone/templates/dashboard/index"]

  render: ->
    $(@el).html(@template())
    return this

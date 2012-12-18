class FlamingWight.Models.Surveys extends Backbone.Model
  paramRoot: 'survey'

  defaults:
    name: null

class FlamingWight.Collections.SurveysCollection extends Backbone.Collection
  model: FlamingWight.Models.Surveys
  url: '/surveys'

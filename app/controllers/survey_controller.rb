class SurveyController < ApplicationController
  def index
    @survey = Survey.find(params[:id])
    @message = @survey.name
    render layout: false
  end
end

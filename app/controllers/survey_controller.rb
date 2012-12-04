class SurveyController < ActionController::Base
  def index
    @survey = Survey.find(params[:id])
    @message = @survey.name
  end
end

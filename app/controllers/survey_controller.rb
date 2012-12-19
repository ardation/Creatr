class SurveyController < ApplicationController
  def index
    @survey = Campaign.find(params[:id])
    @content_types = Array.new
    @survey.contents.each do |content|
      @content_types << content.content_type unless @content_types.include?(content.content_type)
    end
    @content_types = @content_types.to_json(only: [:name, :js, :id])
    # raise @survey.theme.css
  end
end

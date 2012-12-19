class SurveyController < ApplicationController
  def index
    @content_types = Array.new
    @templates = Array.new
    @survey.contents.each do |content| 
      unless @content_types.include?(content.content_type)
        @content_types << content.content_type 
        @templates << {"template" => @survey.theme.get_content_type_template(content.content_type_id), "name" => content.content_type.name}
      end
    end
    @content_types = @content_types.to_json(only: [:name, :js, :id])
    @css = @survey.theme.css
  end
end

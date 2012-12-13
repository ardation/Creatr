class Template < ActiveRecord::Base
  belongs_to :theme
  belongs_to :content_type
  attr_accessible :content, :content_type_id

  validate :html_validator

  def html_validator
    begin
      unless self.content.blank?
        require 'nokogiri'
        doc = Nokogiri::HTML(self.content)
      end
    rescue
      errors[:content] = "Your HTML has an error. Check and try again."
    end
  end

end

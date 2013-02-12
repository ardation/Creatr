class Answer < ActiveRecord::Base
  belongs_to :person
  belongs_to :content
  attr_accessible :content_id, :data, :person_id
end

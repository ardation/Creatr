class Favourite < ActiveRecord::Base
  belongs_to :member
  belongs_to :theme
end

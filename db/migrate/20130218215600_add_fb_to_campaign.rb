class AddFbToCampaign < ActiveRecord::Migration
  def change
    add_attachment :campaigns, :fb_image
  end
end

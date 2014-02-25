class AddFbPageToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :fb_page, :string
  end
end

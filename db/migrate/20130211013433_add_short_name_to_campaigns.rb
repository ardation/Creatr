class AddShortNameToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :short_name, :string
  end
end

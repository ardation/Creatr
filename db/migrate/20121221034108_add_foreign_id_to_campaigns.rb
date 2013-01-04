class AddForeignIdToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :foreign_id, :integer
  end
end

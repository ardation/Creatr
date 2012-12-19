class AddCnameAliasToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :cname_alias, :string
  end
end

class AddCachedDomainToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :cached_domain, :string
    add_index :campaigns, ["cached_domain"]
  end
end

class CreateCampaignCounters < ActiveRecord::Migration
  def change
    create_table :campaign_counters do |t|
      t.integer :campaign_id
      t.date :date
      t.integer :count, default: 0
    end
    add_index :campaign_counters, ["date"]
  end
end

class AddValidatedFieldsAndSmsIndexToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :sms_validated, :boolean, default: false
    add_column :campaigns, :photo_validated, :boolean, default: false
    add_column :campaigns, :synced, :boolean, default: false
    add_index :campaigns, :sms_token
  end
end

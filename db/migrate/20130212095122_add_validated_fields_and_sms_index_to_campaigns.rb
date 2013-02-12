class AddValidatedFieldsAndSmsIndexToCampaigns < ActiveRecord::Migration
  def change
    add_column :people, :sms_validated, :boolean, default: false
    add_column :people, :photo_validated, :boolean, default: false
    add_column :people, :synced, :boolean, default: false
    add_index :people, :sms_token
  end
end

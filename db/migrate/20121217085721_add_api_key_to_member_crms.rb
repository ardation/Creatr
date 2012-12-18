class AddApiKeyToMemberCrms < ActiveRecord::Migration
  def change
    add_column :member_crms, :api_key, :text
    add_column :member_crms, :client, :integer
  end
end

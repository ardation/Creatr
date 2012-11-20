class AddApiSecretToMemberCrm < ActiveRecord::Migration
  def change
    add_column :member_crms, :api_secret, :string
  end
end

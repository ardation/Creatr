class Addindexonmembercrms < ActiveRecord::Migration
  def change
    add_index 'member_crms', %w(crm_id member_id), unique: true
  end
end

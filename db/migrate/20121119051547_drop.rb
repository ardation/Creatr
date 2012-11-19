class Drop < ActiveRecord::Migration
  def up
    drop_table :member_organisations
  end
end

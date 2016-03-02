class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes, &:timestamps
  end
end

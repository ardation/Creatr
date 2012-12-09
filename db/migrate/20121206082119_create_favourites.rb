class CreateFavourites < ActiveRecord::Migration
  def change
    create_table :favourites do |t|
      t.integer :theme_id
      t.integer :member_id

      t.timestamps
    end
  end
end

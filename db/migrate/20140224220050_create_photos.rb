class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :person_id
      t.attachment :file

      t.timestamps
    end
  end
end

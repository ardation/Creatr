class CreateContents < ActiveRecord::Migration
  def change
    create_table :contents do |t|
      t.integer :survey_id
      t.integer :content_type_id
      t.text :data
      t.integer :position

      t.timestamps
    end
  end
end

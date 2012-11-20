class CreateTemplates < ActiveRecord::Migration
  def change
    create_table :templates do |t|
      t.integer :theme_id
      t.integer :content_type_id

      t.timestamps
    end
  end
end

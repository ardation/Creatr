class CreateContentTypes < ActiveRecord::Migration
  def change
    create_table :content_types do |t|
      t.string :name
      t.text :hash
      t.text :js
      t.integer :template_id
      t.integer :inherited_type_id

      t.timestamps
    end
  end
end

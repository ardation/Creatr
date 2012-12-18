class AddContainerTemplateToThemes < ActiveRecord::Migration
  def change
    add_column :themes, :container_template, :text
  end
end

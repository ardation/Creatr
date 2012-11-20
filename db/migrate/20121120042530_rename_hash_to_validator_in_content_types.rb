class RenameHashToValidatorInContentTypes < ActiveRecord::Migration
  def change
    rename_column :content_types, :hash, :validator
  end
end

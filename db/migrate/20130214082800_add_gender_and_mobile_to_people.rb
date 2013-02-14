class AddGenderAndMobileToPeople < ActiveRecord::Migration
  def change
    add_column :people, :gender, :string
    add_column :people, :mobile, :bigint
  end
end

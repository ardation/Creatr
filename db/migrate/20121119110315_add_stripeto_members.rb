class AddStripetoMembers < ActiveRecord::Migration
  def change
    add_column :members, :stripe, :string
  end
end

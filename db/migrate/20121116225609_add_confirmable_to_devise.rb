class AddConfirmableToDevise < ActiveRecord::Migration
  def self.up
    add_column :members, :confirmation_token, :string
    add_column :members, :confirmed_at,       :datetime
    add_column :members, :confirmation_sent_at , :datetime
    add_column :members, :unconfirmed_email, :string

    add_index  :members, :confirmation_token, :unique => true
  end
  def self.down
    remove_index  :members, :confirmation_token

    remove_column :members, :unconfirmed_email
    remove_column :members, :confirmation_sent_at
    remove_column :members, :confirmed_at
    remove_column :members, :confirmation_token
  end
end

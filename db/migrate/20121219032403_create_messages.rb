class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.text :message_template
      t.boolean :is_sms
      t.boolean :is_email

      t.timestamps
    end
  end
end

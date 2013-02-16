class CreateSmsDevices < ActiveRecord::Migration
  def change
    create_table :sms_devices do |t|
      t.string :channel_name

      t.timestamps
    end
  end
end

class AddSmsTemplateToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :sms_template, :text
  end
end

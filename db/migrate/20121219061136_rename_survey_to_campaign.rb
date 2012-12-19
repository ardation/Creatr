class RenameSurveyToCampaign < ActiveRecord::Migration
  def change
    rename_column :contents, :survey_id, :campaign_id
    rename_column :permissions, :survey_id, :campaign_id
    rename_table :surveys, :campaigns
  end
end

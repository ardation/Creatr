class AddStartAndFinishDatesToSurvey < ActiveRecord::Migration
  def change
    add_column :surveys, :start_date, :date
    add_column :surveys, :finish_date, :date
  end
end

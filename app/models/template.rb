class Template < ActiveRecord::Base
  belongs_to :theme
  belongs_to :content_type
  has_attached_file :hamlbars
  validates_attachment_presence :hamlbars
  validates_attachment_size :hamlbars, :less_than => 1.megabytes

  include Rails.application.routes.url_helpers

  def to_jq_upload
    {
      "name" => read_attribute(:upload_file_name),
      "size" => read_attribute(:upload_file_size),
      "url" => template.url(:original),
      "delete_url" => template_path(self),
      "delete_type" => "DELETE"
    }
  end
end

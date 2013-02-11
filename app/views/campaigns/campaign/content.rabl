object false
child :@content do
  attribute :position => :id
  attribute :content_type_id => :type_id
  attribute :data => :content_store
  attribute :name
end
child :@content_type => :type do
  attributes :id, :name, :js
end

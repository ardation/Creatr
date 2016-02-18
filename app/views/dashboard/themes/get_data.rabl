collection :@themes
attributes :id, :title, :short_description, :main_image_url, :owner_name
node(:stats) do |theme|
  {
    favourite: { me: theme.favourite?(current_member.id) }, #count: theme.favourites.size },
    publish:{ published: theme.published?, pending: theme.publish_pending? },
    feature: theme.featured?,
    # campaigns: theme.campaigns.size,
    editable: theme.editable?(current_member.id)
  }
end

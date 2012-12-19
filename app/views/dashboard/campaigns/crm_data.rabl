collection :@crms
attributes :name, :id
node(:orgs) { |crm| current_member.organisations.where(crm_id: crm.id) }

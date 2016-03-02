class MemberCrm < ActiveRecord::Base
  belongs_to :member
  belongs_to :crm

  attr_accessible :api_key, :client

  validate :validate_missionhub_api_key

  def validate_missionhub_api_key
    MissionHub.client_secret = api_key
    MissionHub::Organization.all.each do |org|
      db_org = Organisation.where(crm_id: crm.id, foreign_id: org.attributes['id']).first_or_create(name: org.attributes['name'])
      MemberOrganisation.where(member_id: member.id, organisation_id: db_org.id).first_or_create
    end
  rescue ActiveResource::UnauthorizedAccess
    errors[:api_key] = 'Invalid API key.'
  end
end

class MissionHubCrm
  def self.create(campaign, current_member)
    MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key

    @survey = MissionHub::Survey.create(title: campaign.name, post_survey_message: "Thanks.", organization_id: campaign.organisation.foreign_id)
    campaign.foreign_id = @survey.id

    questions = []
    campaign.contents.each do |content|
      case content.content_type.sync_type
      when ContentType::NON_SYNCABLE
        #do nothing
      when ContentType::FACEBOOK_AUTH
        #do nothing
      when ContentType::SHORT_ANSWER
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "TextField", style: "radio", label:data["Question"], slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::CHECK_BOX
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "checkbox", label:data["Question"], content:data["Answers"].gsub(",","\r\n"), slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::DROPDOWN
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "drop-down", label:data["Question"], content:data["Answers"].gsub(",","\r\n"), slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::RADIO_BUTTON
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "radio", label:data["Question"], content:data["Answers"].gsub(",","\r\n") , slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::CONTACT
        data = JSON.parse content.data
        foreign_hash = {};
        if data["Degree"] == "true"
          question = MissionHub::Question.create(kind: "ChoiceField", style: "drop-down", label:"Degree", content:data["DegreeOptions"].gsub(",","\r\n"), survey_id: @survey.id)
          foreign_hash["Degree"] = question.id
        end
        if data["Year"] == "true"
          question = MissionHub::Question.create(kind: "ChoiceField", style: "radio", label:"Year", content:data["YearOptions"].gsub(",","\r\n"), survey_id: @survey.id)
          foreign_hash["Year"] = question.id
        end
        if data["Halls"] == "true"
          question = MissionHub::Question.create(kind: "ChoiceField", style: "drop-down", label:"Halls", content:data["HallOptions"].gsub(",","\r\n"), survey_id: @survey.id)
          foreign_hash["Halls"] = question.id
        end
        content.foreign_hash = foreign_hash.to_json
      end
    end
    campaign.save!
  end

  def self.delete(campaign, current_member)
    begin
      MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
      MissionHub::Survey.find(campaign.foreign_id).destroy
    rescue

    end
  end

  def self.sync(person, campaign, current_member)
    MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
    mhub_person = MissionHub::Person.create({organization_id: campaign.organisation.foreign_id, first_name: person.first_name, last_name: person.last_name, gender: person.gender.try(:capitalize), fb_uid: person.facebook_id,  phone_number: "64#{person.mobile}" })
    person.foreign_id = mhub_person.id
    person.save!
  end
end

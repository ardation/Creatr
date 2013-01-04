class MissionHubCrm
  def self.create(campaign, current_member)
    MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
    questions = []
    campaign.contents.each do |content|
      case content.content_type.sync_type
      when ContentType::NON_SYNCABLE
        #do nothing
      when ContentType::SHORT_ANSWER
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "TextField", style: "radio", label:data["Question"], object_name: content.name)
        questions.push(question.id)
      when ContentType::CHECK_BOX
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "checkbox", label:data["Question"], content:data["Answers"].gsub(",","\r\n"), object_name: content.name)
        questions.push(question.id)
      when ContentType::DROPDOWN
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "drop-down", label:data["Question"], content:data["Answers"].gsub(",","\r\n"), object_name: content.name)
        questions.push(question.id)
      when ContentType::RADIO_BUTTON
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: "ChoiceField", style: "radio", label:data["Question"], content:data["Answers"].gsub(",","\r\n") , object_name: content.name)
        questions.push(question.id)
      when ContentType::FACEBOOK_AUTH
        #do nothing
      end
    end
    raise questions.inspect
    @survey = MissionHub::Survey.create(title: campaign.name, post_survey_message: "Thanks.", organization_id: campaign.organisation.foreign_id, questions: questions)
    campaign.foreign_id = @survey.id
    @survey = MissionHub::Survey.find(campaign.foreign_id, params: {include: :questions})
    @survey.questions.each do |content|
      campaign.contents.where(name: content.object_name).first.foreign_id = content.id
    end
  end
end

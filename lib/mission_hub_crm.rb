class MissionHubCrm
  def self.create(campaign, current_member)
    MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
    MissionHub.organization_id = campaign.organisation.foreign_id
    @survey = MissionHub::Survey.create(title: campaign.name, post_survey_message: 'Thanks.', organization_id: campaign.organisation.foreign_id)
    campaign.foreign_id = @survey.id

    questions = []
    campaign.contents.each do |content|
      case content.content_type.sync_type
      when ContentType::NON_SYNCABLE
        # do nothing
      when ContentType::FACEBOOK_AUTH
        # do nothing
      when ContentType::SHORT_ANSWER
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: 'TextField', style: 'radio', label: data['Question'], slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::CHECK_BOX
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: 'ChoiceField', style: 'checkbox', label: data['Question'], content: data['Answers'].gsub(',', "\r\n"), slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::DROPDOWN
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: data['Question'], content: data['Answers'].gsub(',', "\r\n"), slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::RADIO_BUTTON
        data = JSON.parse content.data
        question = MissionHub::Question.create(kind: 'ChoiceField', style: 'radio', label: data['Question'], content: data['Answers'].gsub(',', "\r\n"), slug: content.name, survey_id: @survey.id)
        content.foreign_id = question.id
      when ContentType::CONTACT
        data = JSON.parse content.data
        foreign_hash = {}
        if data['Degree'] == 'true'
          question = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: 'Degree', content: data['DegreeOptions'].gsub(',', "\r\n"), survey_id: @survey.id)
          foreign_hash['Degree'] = question.id
        end
        if data['Year'] == 'true'
          question = MissionHub::Question.create(kind: 'ChoiceField', style: 'radio', label: 'Year', content: data['YearOptions'].gsub(',', "\r\n"), survey_id: @survey.id)
          foreign_hash['Year'] = question.id
        end
        if data['Halls'] == 'true'
          question = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: 'Halls', content: data['HallOptions'].gsub(',', "\r\n"), survey_id: @survey.id)
          foreign_hash['Halls'] = question.id
        end
        if data['Campus'] == 'true'
          question = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: 'Campus', content: data['CampusOptions'].gsub(',', "\r\n"), survey_id: @survey.id)
          foreign_hash['Campus'] = question.id
        end
        content.foreign_hash = foreign_hash.to_json
      when ContentType::MULTI_ANSWER
        data = JSON.parse content.data
        foreign_hash = {}
        question1 = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: data['JourneyQuestion'], content: data['JourneyValues'].gsub(',', "\r\n"), slug: 'Interest', survey_id: @survey.id)
        foreign_hash['Interest'] = question1.id
        question2 = MissionHub::Question.create(kind: 'ChoiceField', style: 'drop-down', label: data['KennedyQuestion'], content: data['KennedyAnswers'].gsub(',', "\r\n"), slug: 'Kennedy', survey_id: @survey.id)
        foreign_hash['Kennedy'] = question2.id
        content.foreign_hash = foreign_hash.to_json
      end
    end
    campaign.save!
  end

  def self.delete(campaign, current_member)
    MissionHub.client_secret = current_member.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
    MissionHub::Survey.find(campaign.foreign_id).destroy
  rescue
  end

  def self.sync(person, campaign)
    MissionHub.client_secret = campaign.members.first.member_crms.where(crm_id: campaign.organisation.crm).first.api_key
    MissionHub.organization_id = campaign.organisation.foreign_id
    mhub_person = MissionHub::Person.create(first_name: person.first_name, last_name: person.last_name, gender: person.gender.try(:capitalize), fb_uid: person.facebook_id, phone_number: "0#{person.mobile}", email: person.email)
    person.foreign_id = mhub_person.id
    person.save!

    answers = {}
    person.answers.each do |answer|
      case answer.content.content_type.sync_type
      when ContentType::NON_SYNCABLE
        # do nothing
      when ContentType::FACEBOOK_AUTH
        # do nothing
      when ContentType::SHORT_ANSWER
        answers[answer.content.foreign_id] = answer.data
      when ContentType::CHECK_BOX
        answer_array = JSON.parse(answer.data)
        final = {}
        JSON.parse(answer.content.data)['Answers'].split(',').each_with_index do |value, index|
          final[index.to_s] = if answer_array.include?(value)
                                value
                              else
                                ''
                              end
        end
        answers[answer.content.foreign_id] = final
      when ContentType::DROPDOWN
        answers[answer.content.foreign_id] = answer.data
      when ContentType::RADIO_BUTTON
        answers[answer.content.foreign_id] = answer.data
      when ContentType::CONTACT
        data = JSON.parse(answer.data)
        data.each do |key, value|
          case key
          when 'year'
            answers[JSON.parse(answer.content.foreign_hash)['Year']] = value
          when 'degree'
            answers[JSON.parse(answer.content.foreign_hash)['Degree']] = value
          when 'hall'
            answers[JSON.parse(answer.content.foreign_hash)['Halls']] = value
          when 'campus'
            answers[JSON.parse(answer.content.foreign_hash)['Campus']] = value
          end
        end
      when ContentType::MULTI_ANSWER
        data = JSON.parse(answer.data)
        data.each do |key, value|
          case key
          when 'interest'
            answers[JSON.parse(answer.content.foreign_hash)['Interest']] = value
          when 'kennedy'
            answers[JSON.parse(answer.content.foreign_hash)['Kennedy']] = value
          end
        end
      end
    end
    # PUT THIS INTO GEM
    output = { organization_id: campaign.organisation.foreign_id, survey_id: campaign.foreign_id, person_id: person.foreign_id, answers: answers, secret: MissionHub.client_secret }
    RestClient.post('https://www.missionhub.com/apis/v3/answers', output)
  end
end

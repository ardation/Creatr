class Api::VerifyController < ApplicationController
  respond_to :json

  def verify_campaign
    @campaign = Campaign.find_by_campaign_code(params['token'].to_i)
    if @campaign.nil?
      render :json => { :error => "Campaign does not exist!" }, :status => 404
    else
      render json: @campaign.to_json(only: [:id, :cached_domain, :start_date, :finish_date, :name, :campaign_code], methods: [:total])
    end
  end

  def validate_sms_code
    @campaign = Campaign.find_by_campaign_code(params[:campaign_token].to_i)
    if @campaign.nil?
      render :json => { :error => "Campaign does not exist!" }, :status => 401
    else
      @person = @campaign.people.find_by_sms_token(params[:token].to_i)
      if @person.nil?
        render :json => { :error => "That's an invalid SMS code. Try again!" }, :status => 404
      else
        @person.delay.sync
        if !@person.sms_validated?
          @person.sms_validate
          render json: {validate: true, photo_capable: !@person.facebook_access_token.blank? }.to_json
        else
          render :json => { :error => "That code has already been used. Try again!", :sms_photo => !@person.photo_validated? }, :status => 422
        end
      end
    end
  end

  def search_by_name
    @campaign = Campaign.find_by_campaign_code(params[:campaign_token].to_i)
    if (params[:name])
      @people = @campaign.people.find_by_full_name(params[:name]).all
      render json: @people.to_json(only: [:first_name, :last_name, :id, :mobile])
    end
  end

  def send_sms
    @campaign = Campaign.find_by_campaign_code(params[:campaign_token].to_i)
    @campaign.people.find(params[:token]).try(:send_sms)
    render json: {validate: true}
  end

  def update_mobile
    @campaign = Campaign.find_by_campaign_code(params[:campaign_token].to_i)
    @person = @campaign.people.find(params[:token])
    unless @person.blank?
      @person.mobile = params[:mobile]
      @person.save!
      @person.send_sms
    end
    render json: {validate: true}
  end

  def fb_image
    @campaign = Campaign.find_by_campaign_code(params['campaign_token'].to_i)
    if @campaign.nil?
      render :json => { :error => "Campaign does not exist!" }, :status => 401
    else
      @person = @campaign.people.find_by_sms_token(params[:token].to_i)
      if @person.nil?
        render :json => { :error => "That's an invalid SMS code. Try again!" }, :status => 404
      elsif params[:file].blank?
        render :json => { :error => "No file attached. Try again!" }, :status => 422
      elsif !@person.photo_validated?
        @person.upload_photo params[:file]
        @person.delay.fb_sync
        render json: {validate: true}.to_json
      else
        render :json => { :error => "That person already has a photo! Try again!" }, :status => 422
      end
    end
  end
end

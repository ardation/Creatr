class DashboardController < DashboardBaseController
  def index
    route(current_member)
  end

  def settings
    # set your secret key
    Stripe.api_key = ENV['stripe_secret_key']

    unless current_member.stripe.blank?
      @customer = Stripe::Customer.retrieve(current_member.stripe)
    end

    if current_member.crms.where(name: "MissionHub").nil?
      @mhub_api_key = current_member.crms.where(name: "MissionHub").first.api_key
    end
  end
end

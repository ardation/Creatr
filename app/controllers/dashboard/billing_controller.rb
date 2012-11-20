class Dashboard::BillingController < Dashboard::BaseController
  def index

  end

  def credit_card
    # set your secret key
    Stripe.api_key = ENV['stripe_secret_key']

    # get the credit card details submitted by the form
    token = params[:token]

    # validate token
    unless Stripe::Token.retrieve(token).nil?
      # create a Customer
      if current_member.stripe.blank?
        #create
        customer = Stripe::Customer.create(
          :card => token,
          :email => current_member.email
        )
        current_member.stripe = customer.id
        current_member.save
      else
        #update
        customer = Stripe::Customer.retrieve(current_member.stripe)
        customer.card = token
        customer.email = current_member.email
        customer.save
      end
      respond_to do |format|
        format.json  { render :json => '{"state": "success"}'}
      end
    else
      respond_to do |format|
        format.json  { render :json => '{"state": "failed"}'}
      end
    end
  end
end

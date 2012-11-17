class Members::ConfirmationsController < Devise::ConfirmationsController
  skip_before_filter :authenticate_member!

  def create
    self.resource = resource_class.send_confirmation_instructions(resource_params)
    flash[:set] = true
    redirect_to '/resent'
  end

  def show
    with_unconfirmed_confirmable do
      if @confirmable.valid?
        do_confirm
      end
    end
    if !@confirmable.errors.empty?
      self.resource = @confirmable
      if params[:confirmation_token].nil?
        render 'devise/confirmations/resend'
      else
        render 'devise/confirmations/new'
      end
    end
  end

  protected

  def do_confirm
    @confirmable.confirm!
    set_flash_message :notice, :confirmed
    flash[:set] = true
    redirect_to '/confirmed'
  end

  def after_resending_confirmation_instructions_path_for(resource_name)

  end

  def with_unconfirmed_confirmable
    @confirmable = Member.find_or_initialize_with_error_by(:confirmation_token, params[:confirmation_token])
    if !@confirmable.new_record?
      @confirmable.only_if_unconfirmed {yield}
    end
  end
end

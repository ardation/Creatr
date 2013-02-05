class VerifyController < ApplicationController
  def index
    
  end
  def verify
    returnVal = false
    num = params['num'].to_i % 2
    if num == 0
      returnVal = true
    end
    render :json => returnVal
  end
end

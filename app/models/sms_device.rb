class SmsDevice < ActiveRecord::Base
  attr_accessible :channel_name
  validates_uniqueness_of :channel_name
  def send_sms(phone,message)
    Pusher.trigger(self.channel_name, 'send_sms', {phone: phone, message: message})
    self.touch
    self.save
  end
end

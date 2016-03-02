class SmsDevice < ActiveRecord::Base
  attr_accessible :channel_name
  validates_uniqueness_of :channel_name
  def send_sms(phone, message)
    Pusher.trigger(channel_name, 'send_sms', phone: phone, message: message)
    touch
    save
  end

  # people = [{name: 'John', mobile: '6421000000'}..]
  # message = 'Hello %{name}, how are you?'
  def self.batch_send(people, message)
    people.each do |person|
      sms_device = SmsDevice.find(:first, order: 'updated_at ASC')
      next unless sms_device
      mobile = person.mobile.try(:gsub, /\D/, '').to_i
      next unless mobile
      filtered_message = message.gsub! '%{name}', person.name
      sms_device.send_sms "+#{mobile}", filtered_message
      sleep 3
    end
  end
end

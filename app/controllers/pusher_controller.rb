class PusherController < ActionController::Base
  protect_from_forgery

  def pusher
    webhook = Pusher.webhook(request)
    if webhook.valid?
      webhook.events.each do |event|
        case event['name']
        when 'channel_occupied'
          puts "Channel occupied: #{event['channel']}"
          SmsDevice.find_or_create_by_channel_name(event['channel'])
        when 'channel_vacated'
          puts "Channel vacated: #{event['channel']}"
          SmsDevice.where(channel_name: event['channel']).first.try(:destroy)
        end
      end
      render text: 'ok'
    else
      render text: 'invalid', status: 401
    end
  end
end

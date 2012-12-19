# lib/personalized_domain.rb
class PersonalizedDomain
  def self.matches?(request)
    ![
      ENV['app_url'],
      "",
      nil
    ].include?(request.host)
  end
end

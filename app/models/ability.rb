class Ability
  include CanCan::Ability

  def initialize(member)
    member ||= Member.new
    if member.persisted?
      can :manage, Campaign, permissions: { member_id: member.id}
      can :new, Campaign
      can :manage, Theme, owner_id: member.id, published: false
      can :read, Theme, ["published = true", "published_at null"] do |theme|
        theme.published == true && theme.published_at.nil?
      end
      if member.admin?
        can :manage, Member
        can :manage, ContentType
        can :manage, Theme, ["published = true", "published_at null"] do |theme|
          theme.published == true && theme.published_at.nil?
        end
      end
    end
  end
end

class Ability
  include CanCan::Ability

  def initialize(member)
    member ||= User.new # guest user (not logged in)
    if member.admin?
      can :manage, :all
    else
      can :read, :all
    end
  end
end

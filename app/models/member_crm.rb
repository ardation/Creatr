class MemberCrm < ActiveRecord::Base
  belongs_to :member
  belongs_to :crm
end
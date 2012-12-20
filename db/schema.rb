# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121220062540) do

  create_table "campaign_counters", :force => true do |t|
    t.integer "campaign_id"
    t.date    "date"
    t.integer "count",       :default => 0
  end

  add_index "campaign_counters", ["date"], :name => "index_campaign_counters_on_date"

  create_table "campaigns", :force => true do |t|
    t.string  "name"
    t.integer "organisation_id"
    t.integer "theme_id"
    t.date    "start_date"
    t.date    "finish_date"
    t.string  "cached_domain"
    t.string  "cname_alias"
  end

  add_index "campaigns", ["cached_domain"], :name => "index_campaigns_on_cached_domain"

  create_table "content_types", :force => true do |t|
    t.string   "name"
    t.text     "validator"
    t.text     "js"
    t.integer  "template_id"
    t.integer  "inherited_type_id"
    t.datetime "created_at",                           :null => false
    t.datetime "updated_at",                           :null => false
    t.text     "default_template"
    t.boolean  "is_published",      :default => false
    t.text     "theming_data"
    t.text     "css"
    t.integer  "sync_type",         :default => 0
  end

  create_table "contents", :force => true do |t|
    t.integer  "campaign_id"
    t.integer  "content_type_id"
    t.text     "data"
    t.integer  "position"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.string   "name"
  end

  create_table "crms", :force => true do |t|
    t.string "name"
  end

  create_table "favourites", :force => true do |t|
    t.integer  "theme_id"
    t.integer  "member_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "images", :force => true do |t|
    t.integer  "theme_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.text     "url"
  end

  create_table "member_crms", :force => true do |t|
    t.integer "member_id"
    t.integer "crm_id"
    t.string  "api_secret"
    t.text    "api_key"
    t.integer "client"
  end

  add_index "member_crms", ["crm_id", "member_id"], :name => "index_member_crms_on_crm_id_and_member_id", :unique => true

  create_table "member_organisations", :force => true do |t|
    t.integer "member_id"
    t.integer "organisation_id"
  end

  create_table "members", :force => true do |t|
    t.string   "email",                  :default => "",    :null => false
    t.string   "encrypted_password",     :default => "",    :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "token"
    t.boolean  "activated",              :default => false
    t.text     "usage"
    t.datetime "tokenExpires"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.boolean  "admin",                  :default => false
    t.string   "stripe"
  end

  add_index "members", ["confirmation_token"], :name => "index_members_on_confirmation_token", :unique => true
  add_index "members", ["email"], :name => "index_members_on_email", :unique => true
  add_index "members", ["reset_password_token"], :name => "index_members_on_reset_password_token", :unique => true

  create_table "messages", :force => true do |t|
    t.text     "message_template"
    t.boolean  "is_sms"
    t.boolean  "is_email"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "organisations", :force => true do |t|
    t.string  "name"
    t.integer "uid"
    t.integer "crm_id"
    t.integer "foreign_id"
  end

  add_index "organisations", ["crm_id"], :name => "index_organisations_on_crm"
  add_index "organisations", ["id"], :name => "index_organisations_on_id", :unique => true
  add_index "organisations", ["uid"], :name => "index_organisations_on_uid"

  create_table "permissions", :force => true do |t|
    t.integer "campaign_id"
    t.integer "member_id"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "templates", :force => true do |t|
    t.integer  "theme_id"
    t.integer  "content_type_id"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.text     "content"
  end

  create_table "themes", :force => true do |t|
    t.datetime "created_at",                                 :null => false
    t.datetime "updated_at",                                 :null => false
    t.string   "main_image_file_name"
    t.string   "main_image_content_type"
    t.integer  "main_image_file_size"
    t.datetime "main_image_updated_at"
    t.string   "title"
    t.text     "description"
    t.boolean  "featured",                :default => false
    t.datetime "featured_at"
    t.boolean  "published",               :default => false
    t.datetime "published_at"
    t.boolean  "request_to_publish",      :default => false
    t.integer  "owner_id"
    t.boolean  "mobile",                  :default => true
    t.boolean  "tablet",                  :default => true
    t.boolean  "laptop",                  :default => true
    t.boolean  "desktop",                 :default => true
    t.text     "css"
    t.text     "container_template"
  end

end

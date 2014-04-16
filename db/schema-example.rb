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

ActiveRecord::Schema.define(:version => 20140416092404) do

  create_table "annotation_shapes", :force => true do |t|
    t.integer  "annotation_id"
    t.string   "shape_type"
    t.string   "units",         :default => "relative"
    t.text     "geometry"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "annotation_shapes", ["annotation_id"], :name => "index_annotation_shapes_on_annotation_id"

  create_table "annotations", :force => true do |t|
    t.integer  "attachment_id"
    t.integer  "user_id"
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "annotations", ["attachment_id"], :name => "index_annotations_on_attachment_id"
  add_index "annotations", ["user_id"], :name => "index_annotations_on_user_id"

  create_table "attachments", :force => true do |t|
    t.integer  "contribution_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "metadata_record_id"
    t.string   "title"
    t.boolean  "public"
    t.text     "file_meta"
  end

  add_index "attachments", ["contribution_id"], :name => "index_attachments_on_contribution_id"
  add_index "attachments", ["metadata_record_id"], :name => "index_attachments_on_metadata_record_id"

  create_table "contacts", :force => true do |t|
    t.string   "full_name"
    t.text     "street_address"
    t.string   "locality"
    t.string   "region"
    t.string   "postal_code"
    t.string   "country"
    t.string   "tel"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type",           :limit => 32
    t.string   "gender",         :limit => 1
    t.string   "age",            :limit => 10
  end

  create_table "contributions", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "contributor_id"
    t.integer  "metadata_record_id"
    t.string   "title"
    t.integer  "guest_id"
    t.boolean  "delta",              :default => true, :null => false
    t.integer  "catalogued_by"
  end

  add_index "contributions", ["catalogued_by"], :name => "index_contributions_on_catalogued_by"
  add_index "contributions", ["contributor_id"], :name => "index_contributions_on_contributor_id"
  add_index "contributions", ["guest_id"], :name => "index_contributions_on_guest_id"
  add_index "contributions", ["metadata_record_id"], :name => "index_contributions_on_metadata_record_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0, :null => false
    t.integer  "attempts",   :default => 0, :null => false
    t.text     "handler",                   :null => false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "europeana_records", :force => true do |t|
    t.string   "record_id"
    t.text     "object",     :limit => 16777215
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "europeana_records", ["record_id"], :name => "index_europeana_records_on_record_id", :unique => true

  create_table "exports", :force => true do |t|
    t.integer  "user_id"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "created_at"
    t.string   "format",            :limit => 20
  end

  add_index "exports", ["user_id"], :name => "index_exports_on_user_id"

  create_table "institutions", :force => true do |t|
    t.string   "code",       :null => false
    t.string   "name",       :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "institutions", ["code"], :name => "index_institutions_on_code", :unique => true

  create_table "logs", :force => true do |t|
    t.string   "log_type"
    t.string   "level"
    t.text     "message"
    t.datetime "timestamp"
  end

  create_table "metadata_fields", :force => true do |t|
    t.string   "title"
    t.string   "field_type"
    t.boolean  "required",        :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name",            :default => "",    :null => false
    t.integer  "position",        :default => 0
    t.boolean  "cataloguing",     :default => false
    t.boolean  "searchable",      :default => false
    t.text     "hint"
    t.boolean  "multi"
    t.boolean  "show_in_listing", :default => false
    t.boolean  "contribution",    :default => true,  :null => false
    t.boolean  "attachment",      :default => true,  :null => false
    t.boolean  "facet",           :default => false, :null => false
  end

  create_table "metadata_records", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "field_alternative"
    t.string   "field_creator"
    t.string   "field_subject"
    t.string   "field_date"
    t.text     "field_description"
    t.string   "field_date_from",              :limit => 10
    t.string   "field_date_to",                :limit => 10
    t.string   "field_location_map"
    t.string   "field_location_placename"
    t.string   "field_contributor_behalf"
    t.string   "field_page_number"
    t.string   "field_page_total"
    t.text     "field_notes"
    t.string   "field_lang_other"
    t.string   "field_object_side"
    t.string   "field_cover_image"
    t.string   "field_creator_family_name"
    t.string   "field_creator_given_name"
    t.string   "field_character1_family_name"
    t.string   "field_character1_given_name"
    t.string   "field_character2_family_name"
    t.string   "field_character2_given_name"
    t.text     "field_attachment_description"
    t.text     "field_summary"
    t.string   "field_ticket"
    t.string   "field_location_zoom"
    t.text     "field_editor_pick_text"
    t.string   "field_editor_pick_sig"
    t.string   "field_character1_dob",         :limit => 10
    t.string   "field_character1_dod",         :limit => 10
    t.string   "field_character2_dob",         :limit => 10
    t.string   "field_character2_dod",         :limit => 10
    t.string   "field_character1_pob"
    t.string   "field_character1_pod"
    t.string   "field_character2_pob"
    t.string   "field_character2_pod"
  end

  create_table "metadata_records_taxonomy_terms", :id => false, :force => true do |t|
    t.integer "metadata_record_id"
    t.integer "taxonomy_term_id"
  end

  add_index "metadata_records_taxonomy_terms", ["metadata_record_id", "taxonomy_term_id"], :name => "index", :unique => true
  add_index "metadata_records_taxonomy_terms", ["metadata_record_id"], :name => "index_metadata_records_taxonomy_terms_on_metadata_record_id"
  add_index "metadata_records_taxonomy_terms", ["taxonomy_term_id", "metadata_record_id"], :name => "reverse_index", :unique => true
  add_index "metadata_records_taxonomy_terms", ["taxonomy_term_id"], :name => "index_metadata_records_taxonomy_terms_on_taxonomy_term_id"

  create_table "record_statuses", :force => true do |t|
    t.integer  "record_id"
    t.string   "record_type"
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
  end

  add_index "record_statuses", ["name"], :name => "index_record_statuses_on_status"
  add_index "record_statuses", ["record_id", "record_type"], :name => "index_record_statuses_on_record_id_and_record_type"
  add_index "record_statuses", ["user_id"], :name => "index_record_statuses_on_user_id"

  create_table "search_suggestions", :force => true do |t|
    t.string   "text"
    t.boolean  "stop_word"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "frequency",  :default => 0
  end

  add_index "search_suggestions", ["text"], :name => "index_search_index_words_on_text", :unique => true

  create_table "settings", :force => true do |t|
    t.string   "name"
    t.text     "value"
    t.datetime "updated_at"
  end

  add_index "settings", ["name"], :name => "index_settings_on_name"

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       :limit => 128
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type", "context"], :name => "index_taggings_on_taggable_id_and_taggable_type_and_context"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "taxonomy_terms", :force => true do |t|
    t.string   "term"
    t.integer  "metadata_field_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "taxonomy_terms", ["metadata_field_id"], :name => "index_taxonomy_terms_on_metadata_field_id"

  create_table "users", :force => true do |t|
    t.string   "email",                              :null => false
    t.string   "encrypted_password",   :limit => 60, :null => false
    t.string   "reset_password_token", :limit => 20
    t.string   "role_name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "contact_id"
    t.boolean  "terms"
    t.string   "picture_file_name"
    t.string   "picture_content_type"
    t.integer  "picture_file_size"
    t.datetime "picture_updated_at"
    t.string   "username",                           :null => false
    t.integer  "institution_id"
  end

  add_index "users", ["contact_id"], :name => "index_users_on_contact_id"
  add_index "users", ["email"], :name => "index_users_on_email"
  add_index "users", ["institution_id"], :name => "index_users_on_institution_id"
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["username"], :name => "index_users_on_username", :unique => true

end

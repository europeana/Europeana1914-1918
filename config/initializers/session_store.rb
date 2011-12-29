# Be sure to restart your server when you modify this file.

CoCoCo::Application.config.session_store :cookie_store, :key => '_cococo_session'

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# CoCoCo::Application.config.session_store :active_record_store

# Configure Flash session cookie middleware (for Uploadify)
CoCoCo::Application.config.middleware.insert_before(CoCoCo::Application.config.session_store, CoCoCo::FlashSessionCookieMiddleware, CoCoCo::Application.config.session_options[:key])

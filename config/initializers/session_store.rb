# Be sure to restart your server when you modify this file.

RunCoCo::Application.config.session_store :cookie_store, :key => '_runcoco_session'

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rails generate session_migration")
# RunCoCo::Application.config.session_store :active_record_store

# Configure Flash session cookie middleware (for Uploadify)
RunCoCo::Application.config.middleware.insert_before(RunCoCo::Application.config.session_store, RunCoCo::FlashSessionCookieMiddleware, RunCoCo::Application.config.session_options[:key])

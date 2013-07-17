RunCoCo::Application.routes.draw do
  
  themes_for_rails
  
  # Attachments
  scope '/attachments/:id' do
    match ':contribution_id.:id.original.:extension' => 'attachments#download', :as => 'download_contribution_attachment'
    match ':contribution_id.:id.:style.:extension' => 'attachments#inline', :constraints => { :style => /(thumb|preview|medium|large|full)/ }, :as => 'inline_contribution_attachment'
  end

  scope "/:locale" do
    # Contribution resources
    resources :contributions do
      collection do
        get 'search'
        get 'complete'
      end
      member do
        get 'status', :action => 'status_log'
        get 'delete'
        put 'submit'
        put 'approve'
        put 'reject'
        get 'withdraw'
        put 'withdraw', :action => 'set_withdrawn'
      end
      
      # Attachment sub-resources
      resources :attachments do
        member do
          get 'delete'
          get 'copy'
          put 'duplicate'
        end
      end
    end
    
    match 'explore/:field_name/:term' => 'contributions#explore', :as => 'term_search_contributions', :via => :get
    
    # Users
    devise_for :users,
      :path_names => { :sign_in => 'sign-in', :sign_out => 'sign-out', :sign_up => 'register' }
    match 'users/account' => 'users#account', :as => :user_account

    # Contacts
    resources :contacts, :only => [ :edit, :update, :show ]

    # Contributors
    match 'contributor' => 'contributor#dashboard', :as => :contributor_dashboard
    namespace :contributor do
      resource :guest do
        put 'forget'
      end
    end

    # Blog posts
    match 'blog/:blog(/:category)' => 'blog_posts#show', :as => :blog_post, 
      :constraints => { :blog => /(europeana|gwa)/ }, :via => :get

    # Europeana API interface
    match 'europeana/search' => 'europeana#search', :as => 'search_europeana', :via => :get
    match 'europeana/explore/:field_name/:term' => 'europeana#explore', :as => 'explore_europeana', :via => :get
    match 'europeana/record/:dataset_id/:record_id' => 'europeana#show', :as => 'show_europeana', :via => :get

    # Public usage statistics
    resources :statistics, :only => :index

    # Admin routes
    match 'admin' => 'admin#index', :as => 'admin_root'
    namespace :admin do
      resources :users do
        get 'delete', :on => :member
        get 'export', :on => :collection
      end
      
      resources :contributions, :controller => 'contributions', :only => [ :index ] do
        collection do
          get 'search'
          put 'options'
          get 'export'
        end
      end
      
      resources :exports, :only => [ :index, :show ], :constraints => { :id => /[\w\-\_\.]+/ }
      
      resources :logs, :only => [ :index, :show ], :constraints => { :id => /[\w\-\_\.]+/ }
      
      resources :metadata_fields, :except => [ :show ] do
        collection do
          get 'order'
          put 'order', :action => 'update_order'
          get 'reindex', :action => 'confirm_reindex'
          put 'reindex'
        end
        get 'delete', :on => :member
        
        resources :taxonomy_terms do
          collection do
            get 'import'
            post 'import'
          end
          get 'delete', :on => :member
        end
      end
      
      resources :statistics, :only => :index
      
      scope 'config' do
        match '/' => 'config#index', :as => 'config', :via => :get
        match '/' => 'config#update', :as => 'update_config', :via => :put
        match 'edit' => 'config#edit', :as => 'edit_config', :via => :get
      end
    end

    # Dropbox
    match 'dropbox/connect' => 'dropbox#connect', :as => 'dropbox_connect', :via => :get
    match 'dropbox/disconnect' => 'dropbox#disconnect', :as => 'dropbox_disconnect', :via => :get
    match 'dropbox/refresh' => 'dropbox#refresh', :as => 'dropbox_refresh', :via => :get

    # Help documents and custom pages
    match '*path' => 'pages#show', :as => 'page'
  end
  
  # Suggest search index words for auto-complete
  match 'suggest' => 'search_suggestions#query', :as => 'suggest'
  
  # OAI:PMH provider
  match 'oai' => 'OAI#index', :as => 'oai'
  
  # Home page with locale, e.g. /en, /de
  match '/:locale' => "pages#show", :as => 'home'
  
  # Root route, i.e. "/"
  root :to => "pages#show"
end


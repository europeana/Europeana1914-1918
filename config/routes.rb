RunCoCo::Application.routes.draw do
  # Attachments
  scope '/attachments/:id' do
    match ':contribution_id.:id.original.:extension' => 'attachments#download', :as => 'download_contribution_attachment'
    match ':contribution_id.:id.:style.:extension' => 'attachments#inline', :constraints => { :style => /(thumb|preview|full)/ }, :as => 'inline_contribution_attachment'
  end

  scope "/:locale" do
    # Contribution resources
    resources :contributions do
      collection do
        get 'search'
        get 'complete'
      end
      member do
        get 'delete'
        put 'approve'
        put 'submit'
      end
      
      # Attachment sub-resources
      resources :attachments do
        get 'delete', :on => :member
      end
    end
    
    # Users
    devise_for :users, :path_names => { :sign_in => 'sign-in', :sign_out => 'sign-out', :sign_up => 'register' }
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

    # Admin routes
    match 'admin' => 'admin#index', :as => 'admin_root'
    namespace :admin do
      resources :users do
        get 'delete', :on => :member
      end
      
      resources :contributions, :controller => 'contributions', :only => [ :index ] do
        collection do
          get 'search'
          put 'options'
          get 'export'
        end
      end
      
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
      
      scope 'config' do
        match '/' => 'config#index', :as => 'config', :via => :get
        match '/' => 'config#update', :as => 'update_config', :via => :put
        match 'edit' => 'config#edit', :as => 'edit_config', :via => :get
      end
    end

    # Help documents and custom pages
    match '*path' => 'pages#show', :as => 'page'
  end
  
  # Home page with locale, e.g. /en, /de
  match '/:locale' => "pages#show", :as => 'home'
  
  # Root route, i.e. "/"
  root :to => "pages#show"
end


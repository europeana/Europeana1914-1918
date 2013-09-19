# Create app directories
run "mkdir -p #{shared_path}/private/exports"
run "ln -nfs #{shared_path}/private/exports #{release_path}/private/exports"

# Directory for XML exports
run "mkdir #{shared_path}/exports"
run "mkdir #{release_path}/private"
run "ln -nfs #{shared_path}/exports #{release_path}/private/exports"

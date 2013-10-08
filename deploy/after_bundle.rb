# Directory for XML exports
run "mkdir #{config.shared_path}/exports"
run "mkdir #{config.release_path}/private"
run "ln -nfs #{config.shared_path}/exports #{config.release_path}/private/exports"

# Restart monit workers
run 'sudo monit -g dj_europeana19141918 restart all'
#run 'sudo monit -g solr restart all'

# Send a request to the app to get it loaded into memory
run 'curl http://localhost/'

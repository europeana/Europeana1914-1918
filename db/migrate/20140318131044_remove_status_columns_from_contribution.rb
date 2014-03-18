class RemoveStatusColumnsFromContribution < ActiveRecord::Migration
  def up
    execute "UPDATE contributions SET updated_at = status_timestamp WHERE status_timestamp > updated_at"
    remove_column "contributions", "current_status"
    remove_column "contributions", "status_timestamp"
  end

  def down
    add_column "contributions", "current_status", "integer"
    add_column "contributions", "status_timestamp", "datetime"
    execute "UPDATE contributions,
(SELECT record_id, (CASE status WHEN 'draft' THEN 1 WHEN 'submitted' THEN 2 WHEN 'approved' THEN 3 WHEN 'rejected' THEN 4 WHEN 'revised' THEN 5 WHEN 'withdrawn' THEN 6 end) status_int, created_at FROM record_statuses WHERE record_type='Contribution' AND id=(SELECT id FROM record_statuses record_statuses_sub WHERE record_statuses_sub.record_id=record_statuses.record_id ORDER BY record_statuses_sub.created_at DESC LIMIT 1)) current_status
SET contributions.current_status=current_status.status_int, contributions.status_timestamp=current_status.created_at 
WHERE current_status.record_id=contributions.id"
  end
end

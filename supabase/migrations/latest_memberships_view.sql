-- Drop the view if it exists
DROP VIEW IF EXISTS latest_memberships;

-- Create the view
CREATE OR REPLACE VIEW latest_memberships AS
WITH RankedMemberships AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY member_id ORDER BY created_at DESC) as rn
  FROM memberships
)
SELECT 
  id,
  member_id,
  start_date,
  end_date,
  payment_status,
  plan_type,
  created_at
FROM RankedMemberships 
WHERE rn = 1;
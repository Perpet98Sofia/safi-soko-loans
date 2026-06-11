
-- 1. Remove direct authenticated INSERT on audit_logs (prevent audit log fabrication).
DROP POLICY IF EXISTS "Authenticated insert logs" ON public.audit_logs;

-- Server-side log writer: SECURITY DEFINER, stamps actor_id from auth.uid().
CREATE OR REPLACE FUNCTION public.write_audit_log(
  _action text,
  _entity_type text,
  _entity_id uuid DEFAULT NULL,
  _payload jsonb DEFAULT '{}'::jsonb,
  _bias_flagged boolean DEFAULT false,
  _bias_category text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  INSERT INTO public.audit_logs (action, entity_type, entity_id, payload, bias_flagged, bias_category, actor_id)
  VALUES (_action, _entity_type, _entity_id, COALESCE(_payload, '{}'::jsonb), COALESCE(_bias_flagged, false), _bias_category, auth.uid())
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

REVOKE ALL ON FUNCTION public.write_audit_log(text, text, uuid, jsonb, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.write_audit_log(text, text, uuid, jsonb, boolean, text) TO authenticated;

-- 2. Lock down SECURITY DEFINER has_role: revoke from public/anon, keep authenticated (RLS policies call it).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 3. Realtime channel authorization: enable RLS on realtime.messages so only authenticated
--    sessions can subscribe to topics, and only to topics scoped to their own loan applications
--    (postgres_changes topic format: "realtime:public:loan_applications" and broadcast topics
--    "loan:<loan_id>"). Per-row table RLS on public.loan_applications continues to filter payloads.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can subscribe to own loan topics" ON realtime.messages;
CREATE POLICY "Authenticated can subscribe to own loan topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Officers and admins can subscribe to any loan topic
  public.has_role(auth.uid(), 'officer'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  -- Generic postgres_changes topic for the table: row-level RLS still applies to payloads
  OR realtime.topic() = 'realtime:public:loan_applications'
  -- Per-loan broadcast topics: "loan:<loan_id>" — only the owning trader may subscribe
  OR (
    realtime.topic() LIKE 'loan:%'
    AND EXISTS (
      SELECT 1
      FROM public.loan_applications la
      JOIN public.traders t ON t.id = la.trader_id
      WHERE la.id::text = split_part(realtime.topic(), ':', 2)
        AND t.user_id = auth.uid()
    )
  )
);

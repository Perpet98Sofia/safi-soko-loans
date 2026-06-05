
-- Roles
CREATE TYPE public.app_role AS ENUM ('trader', 'officer', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'officer') OR public.has_role(auth.uid(), 'admin'));

-- Occupation enum
CREATE TYPE public.occupation_type AS ENUM ('market_vendor', 'boda_boda', 'smallholder_farmer', 'other');
CREATE TYPE public.app_language AS ENUM ('en', 'sw');
CREATE TYPE public.loan_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Traders
CREATE TABLE public.traders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  occupation occupation_type NOT NULL DEFAULT 'other',
  region TEXT,
  preferred_language app_language NOT NULL DEFAULT 'en',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_given_at TIMESTAMPTZ,
  data_region TEXT NOT NULL DEFAULT 'africa-south-1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traders TO authenticated;
GRANT ALL ON public.traders TO service_role;
ALTER TABLE public.traders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trader self read" ON public.traders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Trader self insert" ON public.traders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Trader self update" ON public.traders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Loan applications
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trader_id UUID NOT NULL REFERENCES public.traders(id) ON DELETE CASCADE,
  amount_kes NUMERIC(12,2) NOT NULL CHECK (amount_kes > 0),
  purpose TEXT NOT NULL,
  repayment_period_months INT NOT NULL DEFAULT 6,
  prior_repayment_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  status loan_status NOT NULL DEFAULT 'pending',
  human_reviewed BOOLEAN NOT NULL DEFAULT false,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loan_applications TO authenticated;
GRANT ALL ON public.loan_applications TO service_role;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trader read own loans" ON public.loan_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.traders t WHERE t.id = trader_id AND t.user_id = auth.uid())
  OR public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "Trader insert own loans" ON public.loan_applications FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.traders t WHERE t.id = trader_id AND t.user_id = auth.uid())
);
CREATE POLICY "Officer update loans" ON public.loan_applications FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin')
);

-- AI Scores
CREATE TABLE public.ai_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  trader_id UUID NOT NULL REFERENCES public.traders(id) ON DELETE CASCADE,
  creditworthiness_score INT NOT NULL CHECK (creditworthiness_score BETWEEN 0 AND 1000),
  projected_default_risk NUMERIC(5,2) NOT NULL,
  rank_tier TEXT NOT NULL DEFAULT 'scout',
  guard_passed BOOLEAN NOT NULL,
  model_version TEXT NOT NULL DEFAULT 'finsoko-v0.1',
  feature_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ai_scores TO authenticated;
GRANT ALL ON public.ai_scores TO service_role;
ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or officer scores" ON public.ai_scores FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.traders t WHERE t.id = trader_id AND t.user_id = auth.uid())
  OR public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "Officer insert score" ON public.ai_scores FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin')
);

-- Audit logs (TRACK)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  bias_flagged BOOLEAN NOT NULL DEFAULT false,
  bias_category TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Officer read logs" ON public.audit_logs FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(),'officer') OR public.has_role(auth.uid(),'admin') OR actor_id = auth.uid()
);
CREATE POLICY "Authenticated insert logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER traders_updated BEFORE UPDATE ON public.traders FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER loans_updated BEFORE UPDATE ON public.loan_applications FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

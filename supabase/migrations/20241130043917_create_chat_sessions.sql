CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid_v7(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  chat_content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
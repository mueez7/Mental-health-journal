-- ============================================
-- Lumina Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    email TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Journal Entries Table (LLM outputs stored here)
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    entry_type TEXT CHECK (entry_type IN ('quick', 'deep')),
    tags TEXT[] DEFAULT '{}',
    suggestion TEXT,
    mood_score INT CHECK (mood_score >= 1 AND mood_score <= 10),
    stress_score INT CHECK (stress_score >= 1 AND stress_score <= 10),
    time_spent INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Weekly Insights Table
CREATE TABLE public.weekly_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    areas_for_growth TEXT,
    growth_suggestion TEXT,
    positive_highlights TEXT,
    positive_suggestion TEXT,
    themes JSONB DEFAULT '[]', -- E.g. [{"name": "Career", "score": 85}]
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Secure Tables with Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_insights ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies (Users can only see/edit their OWN data)
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users view own entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users view own insights" ON public.weekly_insights FOR SELECT USING (auth.uid() = user_id);

-- 6. Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

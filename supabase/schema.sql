-- FinPilot Database Schema for Supabase
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- =====================================================
-- 0. STOCKS REFERENCE TABLE (US publicly traded companies)
-- =====================================================
CREATE TABLE IF NOT EXISTS stocks (
  id SERIAL PRIMARY KEY,
  symbol TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  exchange TEXT DEFAULT 'NYSE',
  sector TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant read access to all authenticated users
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stocks" ON stocks FOR SELECT USING (true);
GRANT SELECT ON stocks TO authenticated;

-- =====================================================
-- 1. USER PROFILES (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 2. PORTFOLIO HOLDINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(12,4) NOT NULL,
  avg_cost DECIMAL(12,2) NOT NULL,
  asset_type TEXT DEFAULT 'stock',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. FINANCIAL GOALS
-- =====================================================
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  deadline DATE,
  icon TEXT DEFAULT '🎯',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. TRANSACTIONS HISTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'buy', 'sell', 'dividend', 'deposit', 'withdrawal'
  symbol TEXT,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/update their own
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Holdings: users can only access their own
CREATE POLICY "Users can manage own holdings" 
  ON holdings FOR ALL 
  USING (auth.uid() = user_id);

-- Goals: users can only access their own
CREATE POLICY "Users can manage own goals" 
  ON goals FOR ALL 
  USING (auth.uid() = user_id);

-- Transactions: users can only access their own
CREATE POLICY "Users can manage own transactions" 
  ON transactions FOR ALL 
  USING (auth.uid() = user_id);

-- =====================================================
-- 6. GRANT ACCESS
-- =====================================================
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON holdings TO authenticated;
GRANT ALL ON goals TO authenticated;
GRANT ALL ON transactions TO authenticated;

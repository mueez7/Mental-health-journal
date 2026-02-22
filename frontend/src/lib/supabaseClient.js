import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cjddnoweksbqkklnlybm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZGRub3dla3NicWtrbG5seWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NzE2NzQsImV4cCI6MjA4NzI0NzY3NH0.ekSlFG4mHQNGqF_xq4Y7o0Hrkj5qnKFOOUOgAz3MqiQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

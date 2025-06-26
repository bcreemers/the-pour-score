import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zkppdfswhaocczgiishi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcHBkZnN3aGFvY2N6Z2lpc2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjQ4NDYsImV4cCI6MjA2NjU0MDg0Nn0.4N19xEUx8IpKvgav1y9RPuCDj8VVkqnXDbCJm7yLaQs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

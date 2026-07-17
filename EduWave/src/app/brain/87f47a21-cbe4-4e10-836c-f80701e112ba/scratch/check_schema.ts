import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Checking columns for table: courses...');
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching courses:', error);
  } else {
    console.log('Columns found:', data && data[0] ? Object.keys(data[0]) : 'No rows found to inspect columns');
  }
}

checkSchema();

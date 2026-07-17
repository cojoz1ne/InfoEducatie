const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://glnulocbjdkudoiordhh.supabase.co',
  'sb_secret_JAjMw9ewwfiTbedfBtxcWQ_puR1sH9n'
);

async function check() {
  console.log('Checking profiles...');
  const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5);
  if (error) console.error('Profiles error:', error);
  else console.log('Latest profiles:', profiles);

  console.log('Checking auth.users...');
  const { data: users, error: err2 } = await supabase.auth.admin.listUsers();
  if (err2) console.error('Users error:', err2);
  else console.log('Latest users:', users.users.slice(0, 5).map(u => ({ id: u.id, email: u.email, confirmed_at: u.confirmed_at })));
}

check();

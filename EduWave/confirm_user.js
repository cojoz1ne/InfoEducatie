const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://glnulocbjdkudoiordhh.supabase.co',
  'sb_secret_JAjMw9ewwfiTbedfBtxcWQ_puR1sH9n'
);

async function confirmUser() {
  const email = 'cojo444@atl.com';
  console.log(`Confirming user: ${email}...`);
  
  // Find user by email
  const { data: users, error: err1 } = await supabase.auth.admin.listUsers();
  if (err1) {
    console.error('Error fetching users:', err1);
    return;
  }
  
  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.log('User not found!');
    return;
  }
  
  // Update user to confirm email
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );
  
  if (error) {
    console.error('Error confirming user:', error);
  } else {
    console.log('User successfully confirmed!', data.user.email);
  }
}

confirmUser();

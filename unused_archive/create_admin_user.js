const fs = require('fs');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local
const env = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const email = 'admin@grasag-upsa.edu.gh';
const password = 'AdminPassword123!';

(async () => {
  console.log(`Creating user ${email}...`);
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true
  });

  if (userError) {
    console.error('Error creating auth user:', userError.message);
    // If user already exists, let's try to fetch their ID to link them
    if (userError.message.includes('already exists')) {
      console.log('User already exists. Attempting to link to admin_users...');
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError.message);
        return;
      }
      const existingUser = users.users.find(u => u.email === email);
      if (existingUser) {
        await linkAdminUser(existingUser.id);
      }
    }
    return;
  }

  const userId = userData.user.id;
  console.log(`Successfully created auth user with ID: ${userId}`);
  await linkAdminUser(userId);
})();

async function linkAdminUser(userId) {
  console.log(`Linking user ${userId} to admin_users table...`);
  const { data, error } = await supabase
    .from('admin_users')
    .upsert({ auth_uid: userId })
    .select();

  if (error) {
    console.error('Error linking user in admin_users:', error.message);
  } else {
    console.log('Successfully configured user as admin! You can now log in.', data);
  }
}

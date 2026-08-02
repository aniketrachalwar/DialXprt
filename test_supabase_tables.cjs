const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ibufghhkyeuvmkldvslc.supabase.co';
const supabaseAnonKey = 'sb_publishable_LzQxRzSmnUoNwPPgxWELug_rH8xVsaz';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const cats = await supabase.from('categories').select('*');
  console.log('Categories:', cats.error ? cats.error.message : cats.data.length);
  
  const roles = await supabase.from('user_roles').select('*');
  console.log('Roles:', roles.error ? roles.error.message : roles.data.length);

  const b2b = await supabase.from('b2b_products').select('*');
  console.log('B2B:', b2b.error ? b2b.error.message : b2b.data.length);
}
test();

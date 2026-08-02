const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ibufghhkyeuvmkldvslc.supabase.co';
const supabaseAnonKey = 'sb_publishable_LzQxRzSmnUoNwPPgxWELug_rH8xVsaz';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing vendors table...');
  const { data, error } = await supabase.from('vendors').select('*').limit(1);
  if (error) {
    console.log('ERROR Fetching vendors:', error.message, error.details, error.hint);
  } else {
    console.log('SUCCESS! Found', data.length, 'vendors');
  }

  console.log('Testing RPC get_nearby_vendors...');
  const rpcResult = await supabase.rpc('get_nearby_vendors', {
    user_lat: 17.3850,
    user_lng: 78.4867,
    radius_km: 50,
    cat_filter: null,
    search_query: null,
    only_approved: false,
  });
  if (rpcResult.error) {
    console.log('RPC ERROR:', rpcResult.error.message, rpcResult.error.details, rpcResult.error.hint);
  } else {
    console.log('RPC SUCCESS! Found', rpcResult.data ? rpcResult.data.length : 0, 'vendors from RPC');
  }
}
test();

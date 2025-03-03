// server/services/supaBaseService.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;https://bzxxgztzbkdrynevznnn.supabase.co
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6eHhnenR6YmtkcnluZXZ6bm5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDc0ODMxNSwiZXhwIjoyMDU2MzI0MzE1fQ.p_NbDOr0VSH45WGgcMO78R-gjLcnediJklFkn1jqy6g
const supabase = createClient(supabaseUrl, supabaseKey);

// Example function: fetch user
async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

// Example function: create user
async function createUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .insert({ user_id: userId }) // free_credit_used=false by default
    .single();

  if (error) throw error;
  return data;
}

// Example function: set free credit used
async function setFreeCreditUsed(userId) {
  const { data, error } = await supabase
    .from('users')
    .update({ free_credit_used: true })
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  getUserById,
  createUser,
  setFreeCreditUsed
};

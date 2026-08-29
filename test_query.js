import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aczzfjyhzlgldxyrptri.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenpmanloemxnbGR4eXJwdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTQ0NTYsImV4cCI6MjEwMzM5MDQ1Nn0.qDSYce11WRomK8npluyu013FyZxleMgjhQUkelmjLzs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testQuery() {
    const { data: users, error } = await supabase.from('users').select('*').limit(5);
    console.log("Users:", JSON.stringify(users, null, 2));
}

testQuery();

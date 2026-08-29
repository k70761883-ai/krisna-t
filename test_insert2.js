import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aczzfjyhzlgldxyrptri.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenpmanloemxnbGR4eXJwdHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTQ0NTYsImV4cCI6MjEwMzM5MDQ1Nn0.qDSYce11WRomK8npluyu013FyZxleMgjhQUkelmjLzs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testInsert() {
    const { data, error } = await supabase
        .from('vendor_portfolios')
        .insert([{ title: "Test", category: "Test Category", images: [], user_id: '11111111-1111-1111-1111-111111111111' }])
        .select()
        .single();

    if (error) {
        console.error("Supabase Error Details:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success:", data);
    }
}

testInsert();

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oqdmrgydpoiaajqqsung.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZG1yZ3lkcG9pYWFqcXFzdW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NTE3NTAsImV4cCI6MjEwMzAyNzc1MH0.uJnUsAiGRxUf447E8Yd0Dibjoznlhf7CDcXc7hEDrlQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function insertUser() {
  const usersToInsert = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@atter.com',
      password: 'hashedpassword',
      full_name: 'Admin Utama',
      company_name: 'Atter Studio',
      role: 'Admin'
    }
  ];

  console.log('Inserting user...');
  const { data, error } = await supabase.from('users').upsert(usersToInsert);
  
  if (error) {
    console.error('Failed to insert user:', error);
  } else {
    console.log('User inserted successfully!', data);
  }
}

insertUser();

import { supabase } from './supabaseClient';
export async function signOut() {
  await supabase.auth.signOut();
  localStorage.removeItem('access_token');
  window.location.href = '/faculty';
}
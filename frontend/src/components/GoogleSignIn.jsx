import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function GoogleSignIn({ onStart }) {
  const signIn = async () => {
    if (onStart) onStart();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          hd: 'thapar.edu',
          prompt:'select_account'
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={signIn} className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-4">
      Sign in with Google
    </button>
  );
}

export default GoogleSignIn;
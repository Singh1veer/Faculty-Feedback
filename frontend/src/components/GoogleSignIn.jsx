// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );

// function GoogleSignIn({ onStart }) {
//   const signIn = async () => {
//     if (onStart) onStart();
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         queryParams: {
//           hd: 'thapar.edu',
//           prompt:'select_account'
//         },
//         redirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });
//   };

//   return (
//     <button onClick={signIn} className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-4">
//       Sign in with Google
//     </button>
//   );
// }

// export default GoogleSignIn;

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function GoogleSignIn({ onStart }) {
  const signIn = async () => {
    if (onStart) onStart();
    localStorage.setItem('return_to', window.location.pathname);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: { hd: 'thapar.edu', prompt: 'select_account' },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signIn}
      className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-wide py-3 px-5 rounded-sm hover:bg-ink/90 active:scale-[0.98] transition-all duration-150"
    >
      <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6C29.5 35.1 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C41.3 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
      Sign in with Google
    </button>
  );
}

export default GoogleSignIn;
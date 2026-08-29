import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      fetch(`${import.meta.env.VITE_API_URL}/api/protected-test`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then(async (res) => {
        const data = await res.json();
        if (res.ok && data.message.includes('@thapar.edu')) {
          localStorage.setItem('access_token', accessToken);

          const returnTo = localStorage.getItem('return_to') || '/faculty';
          localStorage.removeItem('return_to');
          navigate(returnTo);
        } else {
          navigate('/faculty?error=domain');
        }
      });
    } else {
      navigate('/faculty');
    }
  }, [navigate]);

  return <p>Signing you in…</p>;
}

export default AuthCallback;
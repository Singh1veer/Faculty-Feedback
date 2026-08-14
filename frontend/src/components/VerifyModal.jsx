import { useState } from 'react';

function VerifyModal({ onVerified }) {
    console.log('VerifyModal rendering');
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const sendOtp = async () => {
    setError('');
    const res = await fetch('http://localhost:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStep('code');
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };
  const verifyOtp = async () => {
    setError('');
    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token: code }),
    });
    if (res.ok) {
      const data = await res.json();
       localStorage.setItem('access_token', data.session.access_token);
      onVerified(data);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-paper-raised border border-rule rounded-sm p-6 w-full max-w-sm">
        {step === 'email' && (
          <>
            <input
              className="w-full border border-rule px-3 py-2 font-mono text-sm mb-3"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@thapar.edu"
            />
            <button
              className="w-full bg-ivy text-paper font-mono text-xs uppercase py-2"
              onClick={sendOtp}
            >
              Send code
            </button>
          </>
        )}
        {step === 'code' && (
          <>
            <input
              className="w-full border border-rule px-3 py-2 font-mono text-sm mb-3"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter code"
            />
            <button
              className="w-full bg-ivy text-paper font-mono text-xs uppercase py-2"
              onClick={verifyOtp}
            >
              Verify
            </button>
          </>
        )}
        {error && <p className="text-oxblood font-mono text-xs mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default VerifyModal;
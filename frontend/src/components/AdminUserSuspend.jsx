// import { useState } from 'react';

// function AdminUserSuspend() {
//   const [userId, setUserId] = useState('');
//   const [reason, setReason] = useState('');
//   const [message, setMessage] = useState('');

//   function suspendUser() {
//     const token = localStorage.getItem('access_token');
//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/suspend`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//       body: JSON.stringify({ reason }),
//     })
//       .then(res => res.json())
//       .then(data => setMessage(`Suspended user ${data.user_id}`));
//   }

//   return (
//     <div>
//       <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (UUID)" />
//       <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)" />
//       <button onClick={suspendUser}>Suspend</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default AdminUserSuspend;



import { useState } from 'react';

function AdminUserSuspend() {
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function suspendUser() {
    if (!userId) return;
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    })
      .then(res => res.json())
      .then(data => { setSubmitting(false); setMessage(`Suspended user ${data.user_id}`); });
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (UUID)"
          className="flex-1 border border-rule rounded-full px-4 py-2 text-sm bg-paper outline-none focus:border-brass transition-colors duration-150"
        />
        <input
          value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)"
          className="flex-1 border border-rule rounded-full px-4 py-2 text-sm bg-paper outline-none focus:border-brass transition-colors duration-150"
        />
        <button
          onClick={suspendUser}
          disabled={submitting}
          className="bg-oxblood text-paper font-mono text-xs uppercase py-2 px-5 rounded-full hover:bg-oxblood/90 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Suspending…' : 'Suspend'}
        </button>
      </div>
      {message && <p className="font-mono text-xs text-ink-soft mt-3">{message}</p>}
    </div>
  );
}

export default AdminUserSuspend;
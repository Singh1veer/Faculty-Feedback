import { useState } from 'react';

function AdminUserSuspend() {
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  function suspendUser() {
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ reason }),
    })
      .then(res => res.json())
      .then(data => setMessage(`Suspended user ${data.user_id}`));
  }

  return (
    <div>
      <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID (UUID)" />
      <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)" />
      <button onClick={suspendUser}>Suspend</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminUserSuspend;
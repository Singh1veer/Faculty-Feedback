import { useState, useEffect } from 'react';

function AdminModerationQueue() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

function fetchPending() {
  const token = localStorage.getItem('access_token');
  fetch('http://localhost:5000/api/admin/comments/pending', {
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(res => res.json()).then(setPending);
}

function moderate(id, status) {
  const token = localStorage.getItem('access_token');
  fetch(`http://localhost:5000/api/admin/comments/${id}/moderate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  }).then(fetchPending);
}

  return (
    <div>
      {pending.map(c => (
        <div key={c.id}>
          <p>{c.text}</p>
          <button onClick={() => moderate(c.id, 'approved')}>Approve</button>
          <button onClick={() => moderate(c.id, 'rejected')}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default AdminModerationQueue;
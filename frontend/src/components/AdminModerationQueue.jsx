import { useState, useEffect } from 'react';

function AdminModerationQueue() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  function fetchPending() {
    fetch('http://localhost:5000/api/admin/comments/pending')
      .then(res => res.json())
      .then(setPending);
  }

  function moderate(id, status) {
    fetch(`http://localhost:5000/api/admin/comments/${id}/moderate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
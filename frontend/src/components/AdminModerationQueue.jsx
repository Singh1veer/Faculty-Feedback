// import { useState, useEffect } from 'react';

// function AdminModerationQueue() {
//   const [pending, setPending] = useState([]);

//   useEffect(() => {
//     fetchPending();
//   }, []);

// function fetchPending() {
//   const token = localStorage.getItem('access_token');
//   fetch(`${import.meta.env.VITE_API_URL}/api/admin/comments/pending`, {
//     headers: { 'Authorization': `Bearer ${token}` },
//   }).then(res => res.json()).then(setPending);
// }

// function moderate(id, status) {
//   const token = localStorage.getItem('access_token');
//   fetch(`${import.meta.env.VITE_API_URL}/api/admin/comments/${id}/moderate`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//     body: JSON.stringify({ status }),
//   }).then(fetchPending);
// }

//   return (
//     <div>
//       {pending.map(c => (
//         <div key={c.id}>
//           <p>{c.text}</p>
//           <button onClick={() => moderate(c.id, 'approved')}>Approve</button>
//           <button onClick={() => moderate(c.id, 'rejected')}>Reject</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AdminModerationQueue;




import { useState, useEffect } from 'react';

function AdminModerationQueue() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPending(); }, []);

  function fetchPending() {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/comments/pending`, {
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(res => res.json()).then(data => { setPending(data); setLoading(false); });
  }

  function moderate(id, status) {
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/comments/${id}/moderate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }).then(fetchPending);
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white shadow-sm p-6">
        <p className="font-mono text-sm text-ink-soft animate-pulse">Loading…</p>
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm p-6">
        <p className="text-sm text-ink-soft italic">Nothing pending.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm divide-y divide-rule overflow-hidden">
      {pending.map(c => (
        <div key={c.id} className="p-5">
          <p className="text-ink text-sm mb-3">{c.text}</p>
          <div className="flex gap-3">
            <button
              onClick={() => moderate(c.id, 'approved')}
              className="font-mono text-[10px] uppercase bg-ink text-paper py-1.5 px-4 rounded-full hover:bg-ink/90 transition-colors duration-150"
            >
              Approve
            </button>
            <button
              onClick={() => moderate(c.id, 'rejected')}
              className="font-mono text-[10px] uppercase border border-oxblood/40 text-oxblood py-1.5 px-4 rounded-full hover:bg-oxblood/5 transition-colors duration-150"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminModerationQueue;
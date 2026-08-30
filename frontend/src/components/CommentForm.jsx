// // import { useState } from 'react';

// // function CommentForm({ facultyId, onCommentSubmitted }) {
// //   const [text, setText] = useState('');

// //   const handleSubmit = async () => {
// //     const token = localStorage.getItem('access_token');
// //     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${token}`,
// //       },
// //     body: JSON.stringify({ facultyId, text, semester: '2026-Spring' }),    });
// //     if (res.ok) {
// //       setText('');
// //       onCommentSubmitted();
// //     }
// //   };

// //   return (
// //     <div>
// //       <textarea value={text} onChange={e => setText(e.target.value)} />
// //       <button onClick={handleSubmit}>Submit Comment</button>
// //     </div>
// //   );
// // }

// // export default CommentForm;
// import { useState } from 'react';

// function CommentForm({ facultyId, semester, onCommentSubmitted }) {
//   const [text, setText] = useState('');

//   const handleSubmit = async () => {
//     const token = localStorage.getItem('access_token');
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify({ facultyId, text, semester }),
//     });
//     if (res.ok) {
//       setText('');
//       onCommentSubmitted();
//     }
//   };

//   return (
//     <div>
//       <textarea value={text} onChange={e => setText(e.target.value)} />
//       <button onClick={handleSubmit}>Submit Comment</button>
//     </div>
//   );
// }

// export default CommentForm;



import { useState } from 'react';

function CommentForm({ facultyId, semester, onCommentSubmitted }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ facultyId, text, semester }),
    });
    setSubmitting(false);
    if (res.ok) {
      setText('');
      onCommentSubmitted();
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm p-6">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Share your experience…"
        rows={4}
        className="w-full bg-paper-raised/40 border border-rule rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-soft/50 outline-none focus:border-brass transition-colors duration-200 resize-none"
      />
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
          className="bg-ink text-paper font-mono text-xs uppercase py-2.5 px-6 rounded-full hover:bg-ink/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit Review'}
        </button>
        <span className="font-mono text-[10px] text-ink-soft">{semester}</span>
      </div>
      {error && <p className="text-oxblood font-mono text-xs mt-2">{error}</p>}
    </div>
  );
}

export default CommentForm;
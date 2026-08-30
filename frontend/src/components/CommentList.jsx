// import { useState, useEffect } from 'react';

// function CommentList({ facultyId, refreshKey }) {
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/comments`)
//       .then(res => res.json())
//       .then(setComments);
//   }, [facultyId, refreshKey]);

//   if (comments.length === 0) {
//     return <p>No comments yet.</p>;
//   }

//   return (
//     <div>
//       {comments.map(c => (
//         <div key={c.id}>
//           <p>{c.text}</p>
//           <p><small>{c.semester}</small></p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default CommentList;


import { useState, useEffect } from 'react';

function CommentList({ facultyId, refreshKey }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/comments`)
      .then(res => res.json())
      .then(data => { setComments(data); setLoading(false); });
  }, [facultyId, refreshKey]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => <div key={i} className="h-16 bg-white/60 rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl bg-white shadow-sm p-6 text-center">
        <p className="text-ink-soft text-sm italic">No reviews yet — be the first to share.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm divide-y divide-rule overflow-hidden">
      {comments.map(c => (
        <div key={c.id} className="p-5">
          <p className="italic text-ink text-sm leading-relaxed">"{c.text}"</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft mt-2">{c.semester}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
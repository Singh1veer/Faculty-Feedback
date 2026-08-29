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
        {[1, 2].map(i => <div key={i} className="h-16 bg-paper-raised/60 rounded-sm animate-pulse" />)}
      </div>
    );
  }

  if (comments.length === 0) {
    return <p className="font-mono text-sm text-ink-soft italic">No comments yet — be the first to share.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map(c => (
        <div key={c.id} className="border-l-2 border-rule pl-4 py-1">
          <p className="text-ink text-sm leading-relaxed">{c.text}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft mt-1">{c.semester}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
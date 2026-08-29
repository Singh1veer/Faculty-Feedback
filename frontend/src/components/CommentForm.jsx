// import { useState } from 'react';

// function CommentForm({ facultyId, onCommentSubmitted }) {
//   const [text, setText] = useState('');

//   const handleSubmit = async () => {
//     const token = localStorage.getItem('access_token');
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     body: JSON.stringify({ facultyId, text, semester: '2026-Spring' }),    });
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

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ facultyId, text, semester }),
    });
    if (res.ok) {
      setText('');
      onCommentSubmitted();
    }
  };

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSubmit}>Submit Comment</button>
    </div>
  );
}

export default CommentForm;
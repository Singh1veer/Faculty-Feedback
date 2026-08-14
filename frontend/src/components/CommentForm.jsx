import { useState } from 'react';

function CommentForm({ facultyId, onCommentSubmitted }) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ facultyId, text }),
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
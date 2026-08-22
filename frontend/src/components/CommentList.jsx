import { useState, useEffect } from 'react';

function CommentList({ facultyId, refreshKey }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, [facultyId, refreshKey]);

  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      {comments.map(c => (
        <div key={c.id}>
          <p>{c.text}</p>
          <p><small>{c.semester}</small></p>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
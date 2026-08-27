import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import VerifyModal from './GoogleSignIn';

function CommentsPage() {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [wantsToComment, setWantsToComment] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
      .then(res => res.json())
      .then(setFaculty);
  }, [name]);

  function handleWriteComment() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setWantsToComment(true);
      return;
    }
    setCheckingAuth(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/protected-test`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        setCheckingAuth(false);
        if (res.ok) {
          setIsVerified(true);
        }
        setWantsToComment(true);
      });
  }

  if (!faculty) return <p>Loading…</p>;

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="max-w-md mx-auto">
        <Link to={`/faculty/${name}`} className="text-xs font-mono uppercase text-ivy border-b border-ivy/40">
          ← Back to {faculty.name}
        </Link>

        <h1 className="font-display text-3xl text-ink mt-4 mb-6">
          Comments on {faculty.name}
        </h1>

        {!wantsToComment && (
          <button
            onClick={handleWriteComment}
            disabled={checkingAuth}
            className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-4 mb-8"
          >
            {checkingAuth ? 'Checking…' : 'Write a comment'}
          </button>
        )}

        {wantsToComment && (
          isVerified ? (
            <CommentForm
              facultyId={faculty.id}
              onCommentSubmitted={() => {
                setCommentRefreshKey(prev => prev + 1);
                setWantsToComment(false);
              }}
            />
          ) : (
            <VerifyModal onStart={() => {}} />
          )
        )}

        <h3 className="font-mono text-xs uppercase text-ink-soft mt-10 mb-3">All comments</h3>
        <CommentList facultyId={faculty.id} refreshKey={commentRefreshKey} />
      </div>
    </div>
  );
}

export default CommentsPage;
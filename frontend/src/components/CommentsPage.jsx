// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import CommentForm from './CommentForm';
// import CommentList from './CommentList';
// import VerifyModal from './GoogleSignIn';

// function CommentsPage() {
//   const { name } = useParams();
//   const [faculty, setFaculty] = useState(null);
//   const [commentRefreshKey, setCommentRefreshKey] = useState(0);
//   const [wantsToComment, setWantsToComment] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(false);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
//       .then(res => res.json())
//       .then(setFaculty);
//   }, [name]);

//   function handleWriteComment() {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       setWantsToComment(true);
//       return;
//     }
//     setCheckingAuth(true);
//     fetch(`${import.meta.env.VITE_API_URL}/api/protected-test`, {
//       headers: { 'Authorization': `Bearer ${token}` },
//     })
//       .then(res => {
//         setCheckingAuth(false);
//         if (res.ok) {
//           setIsVerified(true);
//         }
//         setWantsToComment(true);
//       });
//   }

//   if (!faculty) return <p>Loading…</p>;

//   return (
//     <div className="min-h-screen bg-paper px-6 py-16">
//       <div className="max-w-md mx-auto">
//         <Link to={`/faculty/${name}`} className="text-xs font-mono uppercase text-ivy border-b border-ivy/40">
//           ← Back to {faculty.name}
//         </Link>

//         <h1 className="font-display text-3xl text-ink mt-4 mb-6">
//           Comments on {faculty.name}
//         </h1>

//         {!wantsToComment && (
//           <button
//             onClick={handleWriteComment}
//             disabled={checkingAuth}
//             className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-4 mb-8"
//           >
//             {checkingAuth ? 'Checking…' : 'Write a comment'}
//           </button>
//         )}

//         {wantsToComment && (
//           isVerified ? (
//             <CommentForm
//               facultyId={faculty.id}
//               onCommentSubmitted={() => {
//                 setCommentRefreshKey(prev => prev + 1);
//                 setWantsToComment(false);
//               }}
//             />
//           ) : (
//             <VerifyModal onStart={() => {}} />
//           )
//         )}

//         <h3 className="font-mono text-xs uppercase text-ink-soft mt-10 mb-3">All comments</h3>
//         <CommentList facultyId={faculty.id} refreshKey={commentRefreshKey} />
//       </div>
//     </div>
//   );
// }

// export default CommentsPage;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import GoogleSignIn from './GoogleSignIn';

function CommentsPage() {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [semester, setSemester] = useState(null);
  const [semesterInput, setSemesterInput] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
      .then(res => res.json())
      .then(setFaculty);
  }, [name]);

  // On mount, check if already signed in (handles landing back here after Google redirect)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/protected-test`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setIsVerified(res.ok);
      setCheckingAuth(false);
      if (res.ok) fetchProfile(token);
    });
  }, []);

  function fetchProfile(token) {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.semester) setSemester(data.semester);
      });
  }

  function saveSemester() {
    if (!semesterInput) return;
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/complete-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ semester: semesterInput }),
    }).then(() => setSemester(semesterInput));
  }

  if (!faculty || checkingAuth) return <p>Loading…</p>;

  return (
    <div className="min-h-screen bg-paper px-6 py-16">
      <div className="max-w-md mx-auto">
        <Link to={`/faculty/${name}`} className="text-xs font-mono uppercase text-ivy border-b border-ivy/40">
          ← Back to {faculty.name}
        </Link>

        <h1 className="font-display text-3xl text-ink mt-4 mb-6">
          Comments on {faculty.name}
        </h1>

        {!isVerified && (
          <div className="mb-8">
            <p className="font-mono text-sm text-ink-soft mb-3">Sign in to write a comment.</p>
            <GoogleSignIn />
          </div>
        )}

        {isVerified && !semester && (
          <div className="mb-8">
            <p className="font-mono text-sm text-ink-soft mb-2">First select semester in which your studied from above teacher to continue:</p>
            <select
              value={semesterInput}
              onChange={e => setSemesterInput(e.target.value)}
              className="border border-rule px-3 py-2 font-mono text-sm mr-2"
            >
              <option value="">Select…</option>
              <option value="2026-Spring">1st</option>
              <option value="2026-Spring">2nd</option>
              <option value="2026-Spring">3rd</option>
              <option value="2026-Spring">4th</option>
              <option value="2026-Spring">5th</option>
              <option value="2026-Spring">6th</option>
              <option value="2026-Spring">7th</option>
              <option value="2026-Spring">8th</option>
            </select>
            <button onClick={saveSemester} className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-4">
              Continue
            </button>
          </div>
        )}

        {isVerified && semester && (
          <CommentForm
            facultyId={faculty.id}
            semester={semester}
            onCommentSubmitted={() => setCommentRefreshKey(prev => prev + 1)}
          />
        )}

        <h3 className="font-mono text-xs uppercase text-ink-soft mt-10 mb-3">All comments</h3>
        <CommentList facultyId={faculty.id} refreshKey={commentRefreshKey} />
      </div>
    </div>
  );
}

export default CommentsPage;